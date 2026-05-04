# BRASILESPAÑA

Marketplace bilíngue (PT-BR / ES) para os 162.000 brasileiros residentes na Espanha. Primeiro produto do ecossistema **CONEXÃO BR** — plataformas digitais para brasileiros no exterior em 35 países.

## Stack

- **Vite 5** + **React 18** (JSX)
- **Tailwind CSS 3.4** com cores oficiais da marca
- **React Router DOM 6**
- **Supabase** (auth + DB)
- **DOMPurify** + **Helmet** (segurança)
- **Lucide React** (ícones)
- Deploy via **Vercel**

## Estrutura

```
.
├── index.html
├── public/
│   └── images/         # Assets servidos em /images/*
├── src/
│   ├── main.jsx        # Entry point (React + Router)
│   ├── App.jsx         # Definição de rotas
│   ├── index.css       # Tailwind directives
│   ├── components/     # Header, Footer, CategorySection, etc.
│   ├── pages/          # Home, ListingsPage, LoginPage, NewAdPage, RegisterPage
│   └── lib/            # supabase.js, security.js
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# editar .env.local com chaves do Supabase

# 3. Rodar em dev
npm run dev
```

A aplicação sobe em `http://localhost:5173` (ou na próxima porta livre).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Vite dev server com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build de produção |

## Deploy

Deploy automático via Vercel a cada push em `main`.

- **Produção**: [brasilespana.vercel.app](https://brasilespana.vercel.app)

## Design Lock

O arquivo [`ESTADO_APROVADO.md`](./ESTADO_APROVADO.md) contém o lock oficial de design assinado pelos fundadores. **Não alterar header, grade de categorias 3×3 ou cores oficiais sem autorização.**

## Equipe

- **Michele Nuevo Guerra** — Fundadora e Idealizadora
- **Tharyck Nuevo Guerra** — Cofundador e Dev Tecnológico
- **Thayza Nuevo Guerra** — Cofundadora e Analista

---

© 2026 CONEXÃO BR — Todos os direitos reservados.
