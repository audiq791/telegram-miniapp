import type { Metadata } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";
import ClientLayout from "./ClientLayout"; // <-- Создадим этот файл

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Биржа бонусов",
  description: "Mini App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <ClientLayout> {/* <-- Используем клиентский компонент */}
        {children}
      </ClientLayout>
    </html>
  );
}