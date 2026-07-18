"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categories, products, siteConfig, type CategoryId } from "@/data/site";
import { withBasePath } from "@/lib/withBasePath";

type Filter = "todos" | CategoryId;

export function ProductShowcase() {
  const [active, setActive] = useState<Filter>("todos");
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(() => active === "todos" ? products : products.filter((product) => product.category === active), [active]);
  const visible = isMobile ? filtered.slice(0, visibleCount) : filtered;
  const remaining = Math.max(0, filtered.length - visible.length);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 520px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [active]);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar produtos por categoria">
        {[{ id: "todos" as const, label: "Todos" }, ...categories].map((category) => (
          <button key={category.id} type="button" className={active === category.id ? "active" : ""} aria-pressed={active === category.id} onClick={() => setActive(category.id)}>
            {category.label}
          </button>
        ))}
      </div>

      <motion.div layout={!reduceMotion} className="product-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((product) => (
            <motion.article
              layout={!reduceMotion}
              key={product.name}
              className="product-card"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32 }}
            >
              <div className="product-image">
                <Image src={withBasePath(product.image)} alt={product.name} fill sizes="(max-width: 620px) 86vw, (max-width: 1000px) 43vw, 28vw" />
                {product.featured && <span className="product-badge">Destaque</span>}
                <a className="product-link" href={siteConfig.storeUrl} target="_blank" rel="noreferrer" aria-label={`Ver ${product.name} na loja`}>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
              <div className="product-copy">
                <span>{categories.find((category) => category.id === product.category)?.label}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {isMobile && filtered.length > 6 && (
        <div className="catalog-controls">
          <span>{visible.length} de {filtered.length} produtos</span>
          {remaining > 0 ? (
            <button className="button button-light catalog-button" type="button" onClick={() => setVisibleCount((count) => count + 6)}>
              Ver mais {Math.min(6, remaining)} produtos
            </button>
          ) : (
            <button className="catalog-collapse" type="button" onClick={() => { setVisibleCount(6); document.querySelector("#produtos")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }}>
              Mostrar menos ↑
            </button>
          )}
        </div>
      )}
    </>
  );
}
