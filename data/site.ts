export type CategoryId = "castanhas" | "sementes" | "frutas" | "aperitivos";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
}

export interface Product {
  name: string;
  category: CategoryId;
  image: string;
  description: string;
  featured?: boolean;
  /** Link to the stock system product (defaults to matching by name); packageLabel pins one package. */
  stock?: { productId?: number; name?: string; packageLabel?: string };
}

export const siteConfig = {
  brand: "Piá Nuts",
  domain: "pianuts.com.br",
  storeUrl: "https://www.pianuts.com.br",
  instagramLabel: "@pianuts.castanhas",
  instagramUrl: "https://www.instagram.com/pianuts.castanhas",
  whatsappLabel: "(41) 99255-5036",
  whatsappNumber: "5541992555036",
  whatsappUrl: "https://wa.me/5541992555036?text=Ol%C3%A1%2C%20Pi%C3%A1%20Nuts!%20Quero%20conhecer%20os%20produtos.",
} as const;

export const categories: Category[] = [
  { id: "castanhas", label: "Castanhas & nozes", description: "Seleção natural, torrada e temperada." },
  { id: "sementes", label: "Sementes", description: "Crocância para lanches e receitas." },
  { id: "frutas", label: "Frutas secas", description: "Doçura natural para qualquer momento." },
  { id: "aperitivos", label: "Aperitivos", description: "Sabores práticos, leves e surpreendentes." },
];

export const products: Product[] = [
  { name: "Ameixa seca sem caroço", category: "frutas", image: "/products/ameixa-seca.webp", description: "Macia, intensa e pronta para consumir.", stock: { productId: 1 } },
  { name: "Amêndoa defumada", category: "castanhas", image: "/products/amendoa-defumada.webp", description: "Aromática e crocante, com sabor marcante.", featured: true, stock: { productId: 6 } },
  { name: "Amêndoa natural", category: "castanhas", image: "/products/amendoa-natural.webp", description: "Versátil, selecionada e naturalmente saborosa." },
  { name: "Amêndoa torrada sem sal", category: "castanhas", image: "/products/amendoa-torrada.webp", description: "Torra equilibrada, sem adição de sal.", stock: { productId: 19 } },
  { name: "Avelã turca natural", category: "castanhas", image: "/products/avela-turca.webp", description: "Textura delicada e sabor naturalmente amanteigado.", stock: { productId: 20 } },
  { name: "Banana passa", category: "frutas", image: "/products/banana-passa.webp", description: "Doçura prática, preservada a vácuo.", stock: { productId: 2 } },
  { name: "Castanha de baru", category: "castanhas", image: "/products/castanha-baru.webp", description: "Brasileira, crocante e cheia de personalidade.", stock: { productId: 7 } },
  { name: "Castanha de caju caramelizada", category: "castanhas", image: "/products/caju-caramelizada.webp", description: "Crocância envolvida por uma camada irresistível.", featured: true, stock: { productId: 10 } },
  { name: "Castanha de caju com sal", category: "castanhas", image: "/products/caju-com-sal.webp", description: "Inteira, torrada e temperada na medida.", stock: { productId: 9 } },
  { name: "Castanha de caju sem sal", category: "castanhas", image: "/products/caju-sem-sal.webp", description: "Sabor puro com torra cuidadosa.", stock: { productId: 8 } },
  { name: "Castanha-do-pará 1 kg", category: "castanhas", image: "/products/castanha-para-1kg.webp", description: "Formato família, direto da seleção amazônica." },
  { name: "Castanha-do-pará 500 g", category: "castanhas", image: "/products/castanha-para-500g.webp", description: "Nutrição e sabor em uma embalagem prática.", featured: true, stock: { productId: 11 } },
  { name: "Damasco turco seco", category: "frutas", image: "/products/damasco-turco.webp", description: "Frutado, macio e naturalmente adocicado.", stock: { productId: 3 } },
  { name: "Macadâmia torrada sem sal", category: "castanhas", image: "/products/macadamia-sem-sal.webp", description: "Cremosa por dentro, crocante por fora e sem adição de sal.", stock: { productId: 18 } },
  { name: "Milho espanhol", category: "aperitivos", image: "/products/milho-espanhol.webp", description: "Crocância intensa para acompanhar bons momentos.", stock: { productId: 16 } },
  { name: "Mix de frutas vermelhas", category: "frutas", image: "/products/mix-frutas-vermelhas.webp", description: "Cranberry, goji berry, cereja e muito sabor.", featured: true, stock: { productId: 5 } },
  { name: "Mix de vegetais", category: "aperitivos", image: "/products/mix-vegetais.webp", description: "Colorido, leve e surpreendentemente crocante.", featured: true, stock: { productId: 17 } },
  { name: "Noz chilena mariposa", category: "castanhas", image: "/products/noz-chilena.webp", description: "Natural, selecionada e de textura delicada.", stock: { productId: 12 } },
  { name: "Noz-pecã", category: "castanhas", image: "/products/noz-peca.webp", description: "Sabor elegante e textura amanteigada." },
  { name: "Pistache torrado e salgado", category: "castanhas", image: "/products/pistache.webp", description: "Com casca, crocante e perfeito para compartilhar.", featured: true, stock: { productId: 13 } },
  { name: "Semente de abóbora com sal", category: "sementes", image: "/products/semente-abobora-com-sal.webp", description: "Torrada e temperada para um snack prático.", stock: { productId: 15 } },
  { name: "Semente de abóbora sem sal", category: "sementes", image: "/products/semente-abobora-sem-sal.webp", description: "Crocância natural, sem adição de sal.", stock: { productId: 14 } },
  { name: "Tâmara seca sem caroço", category: "frutas", image: "/products/tamara-seca.webp", description: "Macia, intensa e naturalmente doce.", stock: { productId: 4 } },
];

export const navItems = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Nossa essência", href: "#essencia" },
  { label: "Produtos", href: "/produtos/" },
  { label: "Confiança", href: "#confianca" },
];
