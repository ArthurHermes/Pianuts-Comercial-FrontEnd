"use client";

import { ArrowLeft, CheckCircle2, PackageCheck } from "lucide-react";
import Image from "next/image";
import { Header } from "./Header";
import { ProductShowcase } from "./ProductShowcase";
import { withBasePath } from "@/lib/withBasePath";

export function ProductCatalogPage() {
  return (
    <main className="catalog-page">
      <Header variant="internal" />

      <section className="catalog-hero">
        <div className="container catalog-hero-grid">
          <div className="catalog-hero-copy">
            <a className="back-link" href={withBasePath("/#produtos")}>
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Voltar</span>
            </a>
            <span className="section-kicker">Catálogo Piá Nuts</span>
            <h1>Escolha seus produtos e monte seu pedido.</h1>
            <p>Filtre por categoria, adicione ao carrinho e envie a lista direto pelo WhatsApp para confirmar valores, disponibilidade e entrega.</p>
            <div className="catalog-hero-points">
              <span><CheckCircle2 size={18} aria-hidden="true" /> Pedido sem compromisso</span>
              <span><PackageCheck size={18} aria-hidden="true" /> Atendimento pelo canal oficial</span>
            </div>
          </div>

          <div className="catalog-hero-visual" aria-hidden="true">
            <Image src={withBasePath("/products/caju-caramelizada.webp")} alt="" fill priority sizes="(max-width: 800px) 80vw, 360px" />
          </div>
        </div>
      </section>

      <section id="produtos" className="section products-section catalog-page-section">
        <div className="container">
          <div className="catalog-screen-heading">
            <div>
              <span className="section-kicker">Produtos</span>
              <h2>Catálogo completo</h2>
            </div>
          </div>
          <ProductShowcase />
        </div>
      </section>
    </main>
  );
}
