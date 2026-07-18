# Piá Nuts — Landing Page Comercial

Landing page responsiva da Piá Nuts, construída com Next.js, TypeScript, Framer Motion e Lucide.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validar produção

```bash
npm run typecheck
npm run build
npm start
```

## Conteúdo e contatos

Produtos, categorias, URL da loja, WhatsApp e Instagram ficam centralizados em `data/site.ts`. Para alterar um contato ou produto, edite esse arquivo; os componentes consomem os dados automaticamente.

## Assets

- `public/brand`: versões web tratadas das logos, com fundo transparente.
- `public/products`: fotos otimizadas em WebP e enquadradas sem datas antigas.
- `public/og-image.webp`: imagem de compartilhamento social.

Os arquivos-fonte enviados pela marca permanecem intactos. O site usa somente derivados otimizados.

## Acessibilidade e desempenho

- Navegação por teclado e foco visível.
- Textos alternativos nas imagens relevantes.
- Respeito a `prefers-reduced-motion`.
- Imagens responsivas pelo componente `next/image`.
- Layout adaptado para desktop, tablet e mobile.
