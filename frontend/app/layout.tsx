import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "../src/components/common/AuthInitializer";

export const metadata: Metadata = {
  title: "ASSIST – Mobile Workshop Assistance System",
  description:
    "Get instant roadside mechanic assistance anytime, anywhere. Your reliable partner in automotive distress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
