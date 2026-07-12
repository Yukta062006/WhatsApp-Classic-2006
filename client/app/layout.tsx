import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsApp Classic 2006 - Microsoft Internet Explorer",
  description: "WhatsApp as if it existed in 2006, viewed in Internet Explorer 6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#3A6EA5] flex items-center justify-center p-2">
        {children}
      </body>
    </html>
  );
}
