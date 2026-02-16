import type { Metadata } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";
import { useLargeScale } from "../hooks/useLargeScale";

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
  const isLargeScale = useLargeScale();

  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        {/* Запрещаем масштабирование на iPhone */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`font-sans ${isLargeScale ? 'large-scale' : ''}`}>
        {children}
      </body>
    </html>
  );
}