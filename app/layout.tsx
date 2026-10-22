import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { withBasePath } from "@/lib/withBasePath";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pianuts.com.br"),
  title: "Piá Nuts | Sabor preservado, qualidade que se sente",
  description: "Castanhas, nozes, sementes, frutas secas e aperitivos selecionados, embalados a vácuo para preservar frescor, textura e sabor.",
  keywords: ["castanhas", "nozes", "frutas secas", "sementes", "aperitivos", "Piá Nuts"],
  openGraph: {
    title: "Piá Nuts | Naturalmente irresistível",
    description: "Seleção cuidadosa, sabor de verdade e frescor preservado.",
    type: "website",
    locale: "pt_BR",
    siteName: "Piá Nuts",
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Piá Nuts — castanhas e aperitivos selecionados" }],
  },
  icons: { icon: withBasePath("/favicon.png"), apple: withBasePath("/favicon.png") },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f2e7" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
