import { Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";
import { navItems, siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/withBasePath";

type FooterProps = {
  variant?: "home" | "internal";
};

export function Footer({ variant = "home" }: FooterProps) {
  // Section anchors (#beneficios...) live on the home page, so internal pages link back to it.
  const getNavHref = (href: string) => {
    if (href.startsWith("/")) return withBasePath(href);
    return variant === "home" ? href : withBasePath(`/${href}`);
  };

  return (
    <footer id="contato" className="footer">
      <div className="container footer-grid">
        <div className="footer-brand"><Image src={withBasePath("/brand/logo-horizontal.webp")} alt="Piá Nuts" width={220} height={92} /><p>Seleção, frescor e sabor para transformar pequenos momentos.</p></div>
        <div><h3>Navegue</h3>{navItems.map((item) => <a key={item.href} href={getNavHref(item.href)}>{item.label}</a>)}</div>
        <div><h3>Fale com a gente</h3><a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {siteConfig.whatsappLabel}</a><a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> {siteConfig.instagramLabel}</a></div>
      </div>
      <div className="container footer-bottom">
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} Piá Nuts. Todos os direitos reservados.</span>
          <span>CNPJ: {siteConfig.cnpj}</span>
        </div>
        <a href={variant === "home" ? "#inicio" : "#"}>Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
