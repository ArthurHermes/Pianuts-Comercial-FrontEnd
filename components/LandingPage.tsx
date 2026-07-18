"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown, ArrowRight, Box, CheckCircle2, Instagram, Leaf,
  MessageCircle, PackageCheck, ScanLine, ShieldCheck, ShoppingBag, Sparkles, Sprout,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Header } from "./Header";
import { Reveal } from "./Reveal";
import { categories, navItems, products, siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/withBasePath";

const benefits = [
  { icon: PackageCheck, index: "01", title: "Frescor preservado", text: "Embalagens a vácuo ajudam a proteger textura, aroma e sabor por mais tempo." },
  { icon: Sprout, index: "02", title: "Seleção cuidadosa", text: "Cada item é escolhido com atenção para entregar uma experiência consistente." },
  { icon: Sparkles, index: "03", title: "Sabor de verdade", text: "Opções naturais, torradas e temperadas para diferentes momentos do seu dia." },
  { icon: Leaf, index: "04", title: "Variedade que inspira", text: "Castanhas, nozes, sementes, frutas secas e aperitivos em um só lugar." },
];

const trustItems = [
  { icon: ScanLine, title: "Informação clara", text: "Produtos identificados para você escolher com segurança e praticidade." },
  { icon: Box, title: "Embalagem cuidadosa", text: "Proteção pensada para conservar as características de cada ingrediente." },
  { icon: ShieldCheck, title: "Compra direta", text: "Navegue pelo catálogo e finalize pelo canal oficial da Piá Nuts." },
];

const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 38]);

  return (
    <main>
      <Header />

      <section id="inicio" ref={heroRef} className="hero">
        <div className="hero-grain" aria-hidden="true" />
        <div className="container hero-grid">
          <motion.div className="hero-copy" style={{ y: copyY }}>
            <motion.div className="eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="eyebrow-dot" /> Seleção que dá gosto
            </motion.div>
            <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
              Naturalmente <em>irresistível.</em>
            </motion.h1>
            <motion.p initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>
              Castanhas, frutas secas e aperitivos selecionados, embalados com cuidado para levar mais frescor, sabor e praticidade até você.
            </motion.p>
            <motion.div className="hero-actions" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}>
              <a className="button" href={withBasePath("/produtos/")}>Ver catalogo <ArrowRight size={19} /></a>
              <a className="text-link" href={withBasePath("/produtos/")}>Explorar sabores <ArrowDown size={18} /></a>
            </motion.div>
            <motion.div className="hero-note" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <CheckCircle2 size={18} aria-hidden="true" /> Embalados a vácuo para preservar o que importa
            </motion.div>
          </motion.div>

          <motion.div className="hero-visual" style={{ y: visualY }} initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <div className="sun-shape" aria-hidden="true" />
            <div className="hero-mascot">
              <motion.div className="hero-mascot-motion" animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
                <Image src={withBasePath("/brand/mascote-original-v2.webp")} alt="Mascote Piá Nuts fazendo sinal de positivo" fill priority sizes="(max-width: 800px) 72vw, 42vw" />
              </motion.div>
            </div>
            <motion.div className="floating-product floating-one" animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [-7, -4, -7] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}>
              <Image src={withBasePath("/products/pistache.webp")} alt="Pistaches" fill sizes="150px" />
            </motion.div>
            <motion.div className="floating-product floating-two" animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [8, 4, 8] }} transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}>
              <Image src={withBasePath("/products/mix-vegetais.webp")} alt="Mix de vegetais" fill sizes="130px" />
            </motion.div>
            <div className="quality-pill"><span>Feito com</span><strong>cuidado</strong></div>
          </motion.div>
        </div>
        <div className="marquee" aria-hidden="true"><div>CASTANHAS <span>✦</span> FRUTAS SECAS <span>✦</span> SEMENTES <span>✦</span> APERITIVOS <span>✦</span> CASTANHAS <span>✦</span> FRUTAS SECAS <span>✦</span> SEMENTES <span>✦</span> APERITIVOS <span>✦</span></div></div>
      </section>

      <section id="beneficios" className="section benefits-section">
        <div className="container">
          <Reveal className="section-heading split-heading">
            <div><span className="section-kicker">Por que Piá Nuts</span><h2>Boa escolha.<br /><em>Bom momento.</em></h2></div>
            <p>Do primeiro olhar à última mordida, cada detalhe é pensado para transformar ingredientes selecionados em uma experiência simples e deliciosa.</p>
          </Reveal>
          <div className="benefit-grid">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.08}>
                <article className="benefit-card">
                  <div className="benefit-top"><benefit.icon aria-hidden="true" /><span>{benefit.index}</span></div>
                  <h3>{benefit.title}</h3><p>{benefit.text}</p><div className="card-line" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="essencia" className="section essence-section">
        <div className="container essence-grid">
          <Reveal className="essence-visual">
            <div className="photo-frame"><Image src={withBasePath("/products/caju-sem-sal.webp")} alt="Castanhas de caju selecionadas" fill sizes="(max-width: 800px) 90vw, 45vw" /></div>
            <div className="stamp"><Image src={withBasePath("/brand/stamp.webp")} alt="Selo Piá Nuts" fill sizes="150px" /></div>
            <div className="floating-label"><Leaf size={18} /><span>Da seleção<br /><strong>à sua mesa</strong></span></div>
          </Reveal>
          <Reveal className="essence-copy" delay={0.12}>
            <span className="section-kicker">Nossa essência</span>
            <h2>O cuidado mora <em>nos detalhes.</em></h2>
            <p className="lead">A Piá Nuts nasceu para tornar escolhas saborosas mais fáceis. Selecionamos produtos que combinam qualidade, praticidade e aquele desejo de repetir.</p>
            <div className="process-list">
              <div><span>01</span><section><h3>Escolha atenta</h3><p>Variedade pensada para diferentes gostos, rotinas e ocasiões.</p></section></div>
              <div><span>02</span><section><h3>Proteção a vácuo</h3><p>Menor contato com o ar para ajudar a preservar textura e aroma.</p></section></div>
              <div><span>03</span><section><h3>Sabor pronto</h3><p>Da embalagem para o lanche, a receita ou a mesa compartilhada.</p></section></div>
            </div>
            <a className="text-link dark" href={withBasePath("/produtos/")}>Conhecer produtos <ArrowRight size={18} /></a>
          </Reveal>
        </div>
      </section>

      <section id="produtos" className="section products-section">
        <div className="container">
          <Reveal className="section-heading products-heading">
            <div><span className="section-kicker light">Vitrine Piá Nuts</span><h2>Tem um sabor<br />para <em>cada momento.</em></h2></div>
            <p>Veja alguns destaques por aqui. O catálogo completo, filtros e carrinho ficam em uma tela separada.</p>
          </Reveal>
          <div className="preview-product-grid">
            {featuredProducts.map((product) => (
              <Reveal key={product.name}>
                <article className="product-card">
                  <div className="product-image">
                    <Image src={withBasePath(product.image)} alt={product.name} fill sizes="(max-width: 620px) 86vw, (max-width: 1000px) 43vw, 24vw" />
                    <span className="product-badge">Destaque</span>
                  </div>
                  <div className="product-copy">
                    <span>{categories.find((category) => category.id === product.category)?.label}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="products-preview-action">
            <a className="button button-light" href="/produtos">
              Abrir catalogo <ShoppingBag size={18} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      <section id="confianca" className="section trust-section">
        <div className="container">
          <Reveal className="trust-intro">
            <div className="mini-mascot"><Image src={withBasePath("/brand/mascote-original-v2.webp")} alt="" fill sizes="110px" /></div>
            <div><span className="section-kicker">Confiança se constrói</span><h2>Clareza para escolher.<br /><em>Cuidado para saborear.</em></h2></div>
          </Reveal>
          <div className="trust-grid">
            {trustItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.09}>
                <article className="trust-card"><item.icon aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="comprar" className="final-cta">
        <div className="cta-rings" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal>
            <span className="section-kicker light">Seu próximo snack favorito</span>
            <h2>Mais sabor para<br /><em>os seus momentos.</em></h2>
            <p>Descubra a seleção Piá Nuts e escolha o que combina com você.</p>
            <a className="button button-light" href="/produtos">Ir para o catalogo <ArrowRight size={20} /></a>
          </Reveal>
          <div className="cta-mascot">
            <motion.div className="cta-mascot-motion" animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}>
              <Image src={withBasePath("/brand/mascote-original-v2.webp")} alt="Mascote Piá Nuts" fill sizes="330px" />
            </motion.div>
          </div>
        </div>
      </section>

      <footer id="contato" className="footer">
        <div className="container footer-grid">
          <div className="footer-brand"><Image src={withBasePath("/brand/logo-horizontal.webp")} alt="Piá Nuts" width={220} height={92} /><p>Seleção, frescor e sabor para transformar pequenos momentos.</p></div>
          <div><h3>Navegue</h3>{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div><h3>Fale com a gente</h3><a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {siteConfig.whatsappLabel}</a><a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> {siteConfig.instagramLabel}</a></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Piá Nuts. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>
    </main>
  );
}
