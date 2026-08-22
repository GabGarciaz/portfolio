import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/chrome/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gabriel Medeiros Garcia — Desenvolvedor",
  description:
    "Portfólio de Gabriel Medeiros Garcia: automações com IA, desenvolvimento de software, marketing e design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${fraunces.variable} antialiased`}
    >
      <body className="grain min-h-screen bg-bg text-fg">
        <SmoothScrollProvider>
          <Cursor />
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
