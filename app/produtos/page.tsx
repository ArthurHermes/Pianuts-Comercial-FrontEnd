import type { Metadata } from "next";
import { ProductCatalogPage } from "@/components/ProductCatalogPage";

export const metadata: Metadata = {
  title: "Catálogo de produtos | Piá Nuts",
  description: "Escolha castanhas, nozes, sementes, frutas secas e aperitivos Piá Nuts em uma tela de catálogo com filtros e carrinho.",
};

export default function ProdutosPage() {
  return <ProductCatalogPage />;
}
