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
  /** Name set in the stock system for the commercial site; null keeps the site's own name. */
  siteName: string | null;
  category: string;
  packages: StockPackage[];
}

const apiUrl = (process.env.NEXT_PUBLIC_STOCK_API_URL ?? "https://pianuts-backend.vercel.app").replace(/\/+$/, "");

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

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

/**
 * The stock system decides what the site shows: products not linked to it are always hidden, and linked
 * ones are hidden once the public list loads without them (turned off for the site).
 */
export function isHiddenOnSite(product: Product, stock: StockProduct[] | null) {
  const productId = product.stock?.productId;
  if (productId === undefined) return true;
  return Boolean(stock && !stock.some((item) => item.id === productId));
}

/** Stock product linked to a site product: by id, then by name. */
function findStockProduct(product: Product, stock: StockProduct[]) {
  const link = product.stock;
  if (link?.productId !== undefined) return stock.find((item) => item.id === link.productId);

  const name = normalize(link?.name ?? product.name);
  return stock.find((item) => normalize(item.name) === name);
}

/** Name shown on the site: the "Nome no site" from the stock system when set, else the site's own name. */
export function getDisplayName(product: Product, stock: StockProduct[] | null) {
  return (stock && findStockProduct(product, stock)?.siteName?.trim()) || product.name;
}

/** Packages of the stock product linked to a site product, optionally narrowed to one package. */
export function findStockPackages(product: Product, stock: StockProduct[]): StockPackage[] {
  const link = product.stock;
  const match = findStockProduct(product, stock);

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
