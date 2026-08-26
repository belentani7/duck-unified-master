import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Duck Lab — Estúdio de Áudio Digital",
    template: "%s | Duck Lab",
  },
  description:
    "Duck Lab é uma estação de trabalho de áudio digital para gravar, organizar, mixar e exportar projetos musicais no navegador.",
  applicationName: "Duck Lab",
  keywords: [
    "DAW",
    "estúdio de áudio",
    "gravação",
    "mixagem",
    "Web Audio API",
    "Duck Lab",
  ],
  authors: [{ name: "Duck Lab" }],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Duck Lab — Estúdio de Áudio Digital",
    description:
      "Crie, grave e mixe projetos musicais diretamente no navegador.",
    siteName: "Duck Lab",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Duck Lab — Estúdio de Áudio Digital",
    description:
      "Crie, grave e mixe projetos musicais diretamente no navegador.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
