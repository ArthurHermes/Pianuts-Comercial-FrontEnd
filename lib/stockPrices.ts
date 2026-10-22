import { useEffect, useState } from "react";
import type { Product } from "@/data/site";

export interface StockPackage {
  id: number;
  label: string;
  weightKg: number;
  salePrice: number;
}

export interface StockProduct {
  id: number;
  name: string;
  category: string;
  packages: StockPackage[];
}

const apiUrl = (process.env.NEXT_PUBLIC_STOCK_API_URL ?? "https://pianuts-backend.vercel.app").replace(/\/+$/, "");

const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/** Public sale prices from the stock control system (GET /public/prices). */
export async function fetchStockPrices(signal?: AbortSignal): Promise<StockProduct[]> {
  const response = await fetch(`${apiUrl}/public/prices`, { signal });
  if (!response.ok) throw new Error(`Falha ao buscar preços (${response.status})`);
  return (await response.json()) as StockProduct[];
}

/** Loads the public prices once; `stock` stays null while loading or after a failure. */
export function useStockPrices() {
  const [stock, setStock] = useState<StockProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchStockPrices(controller.signal)
      .then(setStock)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(error);
          setFailed(true);
        }
      });
    return () => controller.abort();
  }, []);

  return { stock, failed };
}

/** A product linked by id is hidden when the stock system leaves it out of the public list (turned off for the site). */
export function isHiddenOnSite(product: Product, stock: StockProduct[] | null) {
  const productId = product.stock?.productId;
  return Boolean(stock && productId !== undefined && !stock.some((item) => item.id === productId));
}

/** Packages of the stock product linked to a site product: by id, then by name; optionally narrowed to one package. */
export function findStockPackages(product: Product, stock: StockProduct[]): StockPackage[] {
  const link = product.stock;
  const name = normalize(link?.name ?? product.name);
  const match = link?.productId !== undefined
    ? stock.find((item) => item.id === link.productId)
    : stock.find((item) => normalize(item.name) === name);

  if (!match) return [];
  if (!link?.packageLabel) return match.packages;

  const label = normalize(link.packageLabel);
  return match.packages.filter((productPackage) => normalize(productPackage.label) === label);
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (value: number) => currency.format(value);

/** Readable package size from its weight ("500 g", "1 kg"); falls back to the stock label. */
export function formatPackage(productPackage: StockPackage) {
  const { weightKg, label } = productPackage;
  if (!weightKg) return label;
  return weightKg >= 1 ? `${weightKg.toLocaleString("pt-BR")} kg` : `${Math.round(weightKg * 1000)} g`;
}
