import tls from "tls";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  fromName: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT?.trim() || "465"),
    user,
    pass,
    from,
    fromName: process.env.SMTP_FROM_NAME?.trim() || "Биржа Бонусов",
  };
}

function readSmtpReply(socket: tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n").filter(Boolean);
      const lastLine = lines[lines.length - 1];
      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendSmtpCommand(socket: tls.TLSSocket, command: string, expectedCodes: number[]) {
  socket.write(`${command}\r\n`);
  const reply = await readSmtpReply(socket);
  const code = Number(reply.slice(0, 3));
  if (!expectedCodes.includes(code)) {
    throw new Error(`SMTP command failed: ${command} -> ${reply.trim()}`);
  }
}

async function sendViaSmtp(config: SmtpConfig, payload: EmailPayload) {
  const socket = tls.connect({
    host: config.host,
    port: config.port,
    servername: config.host,
  });

  await new Promise<void>((resolve, reject) => {
    socket.once("secureConnect", () => resolve());
    socket.once("error", reject);
  });

  try {
    const hello = await readSmtpReply(socket);
    if (!hello.startsWith("220")) {
      throw new Error(`SMTP greeting failed: ${hello.trim()}`);
    }

    await sendSmtpCommand(socket, "EHLO localhost", [250]);
    await sendSmtpCommand(socket, "AUTH LOGIN", [334]);
    await sendSmtpCommand(socket, Buffer.from(config.user).toString("base64"), [334]);
    await sendSmtpCommand(socket, Buffer.from(config.pass).toString("base64"), [235]);
    await sendSmtpCommand(socket, `MAIL FROM:<${config.from}>`, [250]);
    await sendSmtpCommand(socket, `RCPT TO:<${payload.to}>`, [250, 251]);
    await sendSmtpCommand(socket, "DATA", [354]);

    const message = [
      `From: ${config.fromName} <${config.from}>`,
      `To: <${payload.to}>`,
      `Subject: =?UTF-8?B?${Buffer.from(payload.subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
      "",
      payload.html,
      ".",
      "",
    ].join("\r\n");

    socket.write(message);
    const dataReply = await readSmtpReply(socket);
    if (!dataReply.startsWith("250")) {
      throw new Error(`SMTP DATA failed: ${dataReply.trim()}`);
    }

    await sendSmtpCommand(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export async function sendEmail(payload: EmailPayload) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    console.info("[auth-mail-preview]", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
    return { delivered: false, transport: "preview" as const };
  }

  await sendViaSmtp(smtp, payload);
  return { delivered: true, transport: "smtp" as const };
}
