"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navItems } from "@/data/site";
import { withBasePath } from "@/lib/withBasePath";

type HeaderProps = {
  variant?: "home" | "internal";
};

export function Header({ variant = "home" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const homeHref = variant === "home" ? "#inicio" : withBasePath("/#inicio");
  const productHref = withBasePath("/produtos/");
  const getNavHref = (href: string) => {
    if (href.startsWith("/")) return withBasePath(href);
    return variant === "home" ? href : withBasePath(`/${href}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a className="brand" href={homeHref} aria-label="Piá Nuts — início" onClick={() => setOpen(false)}>
          <Image src={withBasePath("/brand/logo-horizontal.webp")} alt="Piá Nuts" width={200} height={90} priority />
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => <a key={item.href} href={getNavHref(item.href)}>{item.label}</a>)}
        </nav>

        <a className="button button-small header-cta" href={productHref}>
          Comprar agora <ShoppingBag size={17} aria-hidden="true" />
        </a>

        <button className="menu-toggle" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" aria-label="Navegação móvel" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {navItems.map((item, index) => (
              <motion.a key={item.href} href={getNavHref(item.href)} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <span>0{index + 1}</span>{item.label}
              </motion.a>
            ))}
            <a className="button" href={productHref} onClick={() => setOpen(false)}>Ver produtos <ShoppingBag size={18} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
