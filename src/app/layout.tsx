import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/chrome/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { Intro } from "@/components/chrome/Intro";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

// Monoespaçada do terminal: intro, rótulos e números
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gabriel Medeiros Garcia — Desenvolvedor",
  description:
    "Portfólio de Gabriel Medeiros Garcia: automações com IA, desenvolvimento de software, tráfego, marketing e design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${anton.variable} ${mono.variable} antialiased`}>
      <body className="grain min-h-screen bg-bg text-fg">
        <SmoothScrollProvider>
          <Cursor />
          <ScrollProgress />
          <Intro />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
