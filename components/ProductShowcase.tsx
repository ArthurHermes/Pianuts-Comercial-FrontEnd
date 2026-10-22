"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, Minus, Plus, Search, SlidersHorizontal, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categories, products, siteConfig, type CategoryId, type Product } from "@/data/site";
import { findStockPackages, formatPackage, formatPrice, isHiddenOnSite, useStockPrices, type StockPackage } from "@/lib/stockPrices";
import { withBasePath } from "@/lib/withBasePath";

type Filter = "todos" | CategoryId;
type CartItem = {
  key: string;
  name: string;
  image: string;
  packageLabel?: string;
  unitPrice: number | null;
  quantity: number;
};

const cartKey = (product: Product, productPackage?: StockPackage) => `${product.name}|${productPackage?.id ?? ""}`;

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
  const { stock, failed: pricesFailed } = useStockPrices();
  const [selectedPackages, setSelectedPackages] = useState<Record<string, number>>({});
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(() => {
    const term = normalize(search.trim());

    return products.filter((product) => {
      if (isHiddenOnSite(product, stock)) return false;
      const category = categories.find((item) => item.id === product.category)?.label ?? "";
      const haystack = normalize([product.name, product.description, category].join(" "));
      const matchesCategory = active === "todos" || product.category === active;
      const matchesSearch = !term || normalize(product.name).includes(term);
      const matchesTags = activeTags.length === 0 || activeTags.every((label) => tagOptions.find((tag) => tag.label === label)?.terms.some((term) => hasWord(haystack, term)));
      return matchesCategory && matchesSearch && matchesTags;
    });
  }, [active, activeTags, search, stock]);
  const visible = isMobile ? filtered.slice(0, visibleCount) : filtered;
  const remaining = Math.max(0, filtered.length - visible.length);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const pricedTotal = cart.reduce((total, item) => total + (item.unitPrice ?? 0) * item.quantity, 0);
  const hasPriced = cart.some((item) => item.unitPrice !== null);
  const hasUnpriced = cart.some((item) => item.unitPrice === null);
  const describeItem = (item: CartItem) => `${item.name}${item.packageLabel ? ` (${item.packageLabel})` : ""}`;
  const whatsappText = encodeURIComponent(
    cart.length
      ? [
          "Olá, Piá Nuts! Quero fazer um pedido:",
          "",
          ...cart.map((item) => `- ${item.quantity}x ${describeItem(item)}${item.unitPrice !== null ? ` — ${formatPrice(item.unitPrice * item.quantity)}` : " — sob consulta"}`),
          ...(hasPriced ? ["", `Total estimado: ${formatPrice(pricedTotal)}${hasUnpriced ? " + itens sob consulta" : ""}`] : []),
          "",
          hasUnpriced ? "Pode me passar os valores que faltam e a disponibilidade?" : "Pode confirmar a disponibilidade e a entrega?",
        ].join("\n")
      : "Olá, Piá Nuts! Quero conhecer os produtos."
  );
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappText}`;

  const getPackages = (product: Product) => stock ? findStockPackages(product, stock) : [];
  const getSelectedPackage = (product: Product) => {
    const packages = getPackages(product);
    return packages.find((productPackage) => productPackage.id === selectedPackages[product.name]) ?? packages[0];
  };

  const getQuantity = (key: string) => cart.find((item) => item.key === key)?.quantity ?? 0;

  const addToCart = (product: Product, productPackage?: StockPackage) => {
    const key = cartKey(product, productPackage);
    setCart((items) => {
      const current = items.find((item) => item.key === key);
      if (current) {
        return items.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
      }
      const hasChoice = getPackages(product).length > 1;
      return [...items, {
        key,
        name: product.name,
        image: product.image,
        packageLabel: hasChoice && productPackage ? formatPackage(productPackage) : undefined,
        unitPrice: productPackage?.salePrice ?? null,
        quantity: 1,
      }];
    });
  };

  const decreaseQuantity = (key: string) => {
    setCart((items) => items
      .map((item) => item.key === key ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key: string) => {
    setCart((items) => items.filter((item) => item.key !== key));
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
              const packages = getPackages(product);
              const selected = getSelectedPackage(product);
              const key = cartKey(product, selected);
              const quantity = getQuantity(key);

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
                    {packages.length > 1 && (
                      <div className="package-options" role="group" aria-label={`Tamanhos de ${product.name}`}>
                        {packages.map((productPackage) => (
                          <button
                            key={productPackage.id}
                            type="button"
                            className={productPackage.id === selected?.id ? "active" : ""}
                            aria-pressed={productPackage.id === selected?.id}
                            onClick={() => setSelectedPackages((current) => ({ ...current, [product.name]: productPackage.id }))}
                          >
                            {formatPackage(productPackage)}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className={`product-price ${selected ? "" : "is-muted"}`}>
                      {selected ? (
                        <>
                          <strong>{formatPrice(selected.salePrice)}</strong>
                          {packages.length === 1 && <span>{formatPackage(selected)}</span>}
                        </>
                      ) : (
                        <span>{stock || pricesFailed ? "Preço sob consulta" : "Carregando preço…"}</span>
                      )}
                    </div>
                    <div className="product-actions">
                      {quantity > 0 ? (
                        <div className="quantity-stepper" aria-label={`Quantidade de ${product.name}`}>
                          <button type="button" onClick={() => decreaseQuantity(key)} aria-label={`Diminuir ${product.name}`}>
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <strong>{quantity}</strong>
                          <button type="button" onClick={() => addToCart(product, selected)} aria-label={`Adicionar mais ${product.name}`}>
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button className="add-product" type="button" onClick={() => addToCart(product, selected)}>
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
              <div key={item.key} className="cart-item">
                <div className="cart-item-image">
                  <Image src={withBasePath(item.image)} alt="" fill sizes="58px" />
                </div>
                <div className="cart-item-copy">
                  <strong>{describeItem(item)}</strong>
                  <span>
                    {item.quantity} unidade{item.quantity > 1 ? "s" : ""}
                    {" · "}
                    {item.unitPrice !== null ? formatPrice(item.unitPrice * item.quantity) : "sob consulta"}
                  </span>
                </div>
                <button type="button" onClick={() => removeFromCart(item.key)} aria-label={`Remover ${describeItem(item)}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        {hasPriced && (
          <div className="cart-total">
            <span>Total estimado</span>
            <strong>{formatPrice(pricedTotal)}</strong>
          </div>
        )}
        {hasPriced && hasUnpriced && <p className="cart-note">Itens sem preço são confirmados no WhatsApp.</p>}

        <a className={`button cart-checkout ${cart.length === 0 ? "is-disabled" : ""}`} href={cart.length ? whatsappHref : siteConfig.whatsappUrl} target="_blank" rel="noreferrer" aria-disabled={cart.length === 0}>
          Enviar pedido <MessageCircle size={18} aria-hidden="true" />
        </a>
        <p className="cart-note">A equipe confirma disponibilidade e entrega pelo WhatsApp.</p>
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
              {hasPriced && <span className="cart-bar-total">{formatPrice(pricedTotal)}</span>}
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
