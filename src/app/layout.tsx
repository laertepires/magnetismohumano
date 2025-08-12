import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/ui/header";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.magnetizandoonline.com.br"),
  title: {
    default: "Magnetizando Online",
    template: "%s | Magnetizando Online",
  },
  description: "Fórum sobre magnetismo humano: técnicas, estudos e troca de experiências.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.magnetizandoonline.com.br",
    siteName: "Magnetizando Online",
    title: "Magnetizando Online",
    description: "Fórum sobre magnetismo humano: técnicas, estudos e troca de experiências.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Magnetizando Online",
    description: "Fórum sobre magnetismo humano: técnicas, estudos e troca de experiências.",
  },
  robots: { index: true, follow: true },
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-S2PHXDE2FW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-S2PHXDE2FW');
        `}
      </Script>
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
