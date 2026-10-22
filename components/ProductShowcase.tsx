"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, Minus, Plus, Search, SlidersHorizontal, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categories, products, siteConfig, type CategoryId, type Product } from "@/data/site";
import { withBasePath } from "@/lib/withBasePath";

type Filter = "todos" | CategoryId;
type CartItem = Product & { quantity: number };

// Each tag matches whole words (accent-insensitive) in the product name, description or category.
const tagOptions = [
  { label: "Natural", terms: ["natural"] },
  { label: "Torrada", terms: ["torrada", "torra"] },
  { label: "Com sal", terms: ["com sal"] },
  { label: "Sem sal", terms: ["sem sal", "sem adicao de sal"] },
  { label: "Doce", terms: ["doce", "docura", "adocicado", "caramelizada"] },
  { label: "Crocante", terms: ["crocante", "crocancia"] },
];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const hasWord = (text: string, term: string) => new RegExp(`\\b${term}\\b`).test(text);

export function ProductShowcase() {
  const [active, setActive] = useState<Filter>("todos");
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(() => {
    const term = normalize(search.trim());

    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.category)?.label ?? "";
      const haystack = normalize([product.name, product.description, category].join(" "));
      const matchesCategory = active === "todos" || product.category === active;
      const matchesSearch = !term || normalize(product.name).includes(term);
      const matchesTags = activeTags.length === 0 || activeTags.every((label) => tagOptions.find((tag) => tag.label === label)?.terms.some((term) => hasWord(haystack, term)));
      return matchesCategory && matchesSearch && matchesTags;
    });
  }, [active, activeTags, search]);
  const visible = isMobile ? filtered.slice(0, visibleCount) : filtered;
  const remaining = Math.max(0, filtered.length - visible.length);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const whatsappText = encodeURIComponent(
    cart.length
      ? `Olá, Piá Nuts! Quero fazer um pedido:\n\n${cart.map((item) => `- ${item.quantity}x ${item.name}`).join("\n")}\n\nPode me passar valores e disponibilidade?`
      : "Olá, Piá Nuts! Quero conhecer os produtos."
  );
  const whatsappHref = `https://wa.me/5541992555036?text=${whatsappText}`;

  const getQuantity = (name: string) => cart.find((item) => item.name === name)?.quantity ?? 0;

  const addToCart = (product: Product) => {
    setCart((items) => {
      const current = items.find((item) => item.name === product.name);
      if (current) {
        return items.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (name: string) => {
    setCart((items) => items
      .map((item) => item.name === name ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (name: string) => {
    setCart((items) => items.filter((item) => item.name !== name));
  };

  const toggleTag = (tag: string) => {
    setActiveTags((tags) => tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag]);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 520px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [active, activeTags, search]);

  return (
    <div className="catalog-layout">
      <aside className={`filter-panel ${filtersOpen ? "is-open" : ""}`} aria-label="Filtros de produtos">
        <button className="filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}>
          <span><SlidersHorizontal size={18} aria-hidden="true" /> Filtros</span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>

        <div className="filter-panel-body">
          <label className="catalog-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Buscar produtos</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Buscar produto" />
          </label>

          <section className="filter-section">
            <div className="filter-head">
              <h3>Categorias</h3>
            </div>
            <div className="filters" role="group" aria-label="Filtrar produtos por categoria">
              {[{ id: "todos" as const, label: "Todos" }, ...categories].map((category) => (
                <button key={category.id} type="button" className={active === category.id ? "active" : ""} aria-pressed={active === category.id} onClick={() => setActive(category.id)}>
                  {category.label}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-section">
            <div className="filter-head">
              <h3>Sabor e preparo</h3>
            </div>
            <div className="tag-list" role="group" aria-label="Filtrar por sabor e preparo">
              {tagOptions.map(({ label }) => (
                <button key={label} type="button" className={activeTags.includes(label) ? "active" : ""} aria-pressed={activeTags.includes(label)} onClick={() => toggleTag(label)}>
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>

      <div className="catalog-products">
        <div className="catalog-results-bar">
          <span>{filtered.length} produto{filtered.length === 1 ? "" : "s"} encontrados</span>
          {(active !== "todos" || activeTags.length > 0 || search) && (
            <button type="button" onClick={() => { setActive("todos"); setActiveTags([]); setSearch(""); }}>
              Limpar filtros
            </button>
          )}
          <a className="cart-shortcut" href="#carrinho" aria-label={`Ver carrinho com ${totalItems} itens`}>
            <ShoppingCart size={18} aria-hidden="true" />
            <span>{totalItems}</span>
          </a>
        </div>
        <motion.div layout={!reduceMotion} className="product-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product) => {
              const quantity = getQuantity(product.name);

              return (
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
                    <Image src={withBasePath(product.image)} alt={product.name} fill sizes="(max-width: 620px) 86vw, (max-width: 1000px) 43vw, 24vw" />
                    {product.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-copy">
                    <span>{categories.find((category) => category.id === product.category)?.label}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-actions">
                      {quantity > 0 ? (
                        <div className="quantity-stepper" aria-label={`Quantidade de ${product.name}`}>
                          <button type="button" onClick={() => decreaseQuantity(product.name)} aria-label={`Diminuir ${product.name}`}>
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <strong>{quantity}</strong>
                          <button type="button" onClick={() => addToCart(product)} aria-label={`Adicionar mais ${product.name}`}>
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button className="add-product" type="button" onClick={() => addToCart(product)}>
                          <ShoppingCart size={17} aria-hidden="true" /> Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="empty-results">
            <strong>Nenhum produto encontrado</strong>
            <p>Tente outro nome ou limpe os filtros.</p>
          </div>
        )}

        {isMobile && filtered.length > 6 && (
          <div className="catalog-controls">
            <span>{visible.length} de {filtered.length} produtos</span>
            {remaining > 0 ? (
              <button className="button catalog-button" type="button" onClick={() => setVisibleCount((count) => count + 6)}>
                Ver mais {Math.min(6, remaining)} produtos
              </button>
            ) : (
              <button className="catalog-collapse" type="button" onClick={() => { setVisibleCount(6); document.querySelector("#produtos")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }}>
                Mostrar menos
              </button>
            )}
          </div>
        )}
      </div>

      <aside id="carrinho" className="cart-panel" aria-label="Carrinho de compras">
        <div className="cart-panel-head">
          <div>
            <span className="cart-kicker">Seu pedido</span>
            <h3>Carrinho</h3>
          </div>
          <span className="cart-count">{totalItems}</span>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={28} aria-hidden="true" />
            <p>Selecione os produtos do catálogo para montar seu pedido.</p>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.name} className="cart-item">
                <div className="cart-item-image">
                  <Image src={withBasePath(item.image)} alt="" fill sizes="58px" />
                </div>
                <div className="cart-item-copy">
                  <strong>{item.name}</strong>
                  <span>{item.quantity} unidade{item.quantity > 1 ? "s" : ""}</span>
                </div>
                <button type="button" onClick={() => removeFromCart(item.name)} aria-label={`Remover ${item.name}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <a className={`button cart-checkout ${cart.length === 0 ? "is-disabled" : ""}`} href={cart.length ? whatsappHref : siteConfig.whatsappUrl} target="_blank" rel="noreferrer" aria-disabled={cart.length === 0}>
          Enviar pedido <MessageCircle size={18} aria-hidden="true" />
        </a>
        <p className="cart-note">A equipe confirma valores, disponibilidade e entrega pelo WhatsApp.</p>
      </aside>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="cart-bar"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
          >
            <a className="cart-bar-summary" href="#carrinho">
              <ShoppingCart size={18} aria-hidden="true" /> {totalItems} {totalItems === 1 ? "item" : "itens"}
            </a>
            <a className="button" href={whatsappHref} target="_blank" rel="noreferrer">
              Enviar pedido <MessageCircle size={17} aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
