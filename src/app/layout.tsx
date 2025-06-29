import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/ui/header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magnetismo Humano",
  description: "Portal sobre Magnetismo Humano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      
    >
      <body className="min-h-screen bg-background font-sans antialiased flex justify-center w-screen">
        <Header key={Date.now()} />
        <Container className="mt-20">
          <Toaster richColors />
          {children}
        </Container>
      </body>
    </html>
  );
}
