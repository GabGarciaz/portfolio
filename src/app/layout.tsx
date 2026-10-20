import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/chrome/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { GlassStageLoader } from "@/components/three/GlassStageLoader";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// A mesma Anton é servida em /fonts para o texto renderizado no WebGL,
// então o nome no 3D e os títulos em HTML usam a mesma letra.
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gabriel Medeiros Garcia — Desenvolvedor",
  description:
    "Portfólio de Gabriel Medeiros Garcia: automações com IA, desenvolvimento de software, tráfego, marketing e design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${anton.variable} antialiased`}>
      <body className="grain min-h-screen bg-bg text-fg">
        <SmoothScrollProvider>
          <Cursor />
          <ScrollProgress />
          <GlassStageLoader />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
