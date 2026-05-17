# MAPEAMENTO COMPLETO — BRASILESPAÑA

> Documento de auditoria técnica para a plataforma BRASILESPAÑA (primeiro produto do ecossistema CONEXÃO BR).
> **Data:** 2026-05-11 · **Branch:** `main` · **Stack:** Vite 5 · React 18 · React Router 6 · Supabase JS · Tailwind 3
> **Objetivo:** mapear cada conexão, link, botão, rota e ponto pendente — com numeração editável para correção item a item.

---

## ÍNDICE

1. Arquitetura geral e ponto de entrada
2. Roteamento (todas as URLs do app)
3. Componentes globais (Header, PageHeader, Footer, LocationFilter, Logo)
4. Página por página (botões, links e direcionamentos)
5. Sistema bilíngue (PT/ES) — cobertura
6. Backend / Servidor de confiança (Supabase) — estado atual
7. Domínio e e-mail
8. PWA / Download do app (instalação no celular)
9. Pagamentos (PayPal) — pendência
10. Inconsistências entre páginas
11. Segurança (já implementada vs. falta)
12. Lista priorizada de correções (do mais crítico ao polimento)

---

## 1. ARQUITETURA GERAL E PONTO DE ENTRADA

| # | Item | Arquivo | Estado |
|---|------|---------|--------|
| 1.1 | Entry point React | `src/main.jsx` | ✅ OK |
| 1.2 | Router raiz | `BrowserRouter` envolvendo `<App />` | ✅ OK |
| 1.3 | Provider de idioma | `LangProvider` (PT/ES com `localStorage`) | ✅ OK |
| 1.4 | Força HTTPS em produção | `enforceHttps()` em `src/lib/security.js` | ✅ OK |
| 1.5 | Strict Mode React | habilitado | ✅ OK |
| 1.6 | HTML base | `index.html` declara `<html lang="pt-BR">`, meta theme-color verde | ✅ OK |
| 1.7 | Font global | Inter (Google Fonts via preconnect) | ✅ OK |
| 1.8 | CSP / Headers de segurança | `vercel.json` (CSP, HSTS, X-Frame-Options DENY, Permissions-Policy) | ✅ OK |
| 1.9 | Favicon | `public/favicon.svg` | ✅ OK |
| 1.10 | Manifest PWA | **NÃO EXISTE** | ❌ **FAZER** |
| 1.11 | Service Worker | **NÃO EXISTE** | ❌ **FAZER** |
| 1.12 | Apple touch icon / ícones Android | **NÃO EXISTEM** | ❌ **FAZER** |

---

## 2. ROTEAMENTO — TODAS AS URLs (`src/App.jsx`)

| # | Path | Componente | Status |
|---|------|-----------|--------|
| 2.1 | `/` | `Home` | ✅ Implementada |
| 2.2 | `/anuncios/:category` | `ListingsPage` | ⚠️ Dados mock (sem Supabase) |
| 2.3 | `/novo-anuncio` | `NewAdPage` | ⚠️ Submit em memória (sem Supabase) |
| 2.4 | `/entrar` | `LoginPage` | ⚠️ Login simulado (Supabase comentado) |
| 2.5 | `/cadastro` | `RegisterPage` | ⚠️ Cadastro simulado (Supabase comentado) |
| 2.6 | `/sobre` | `SobrePage` | ✅ Estática (OK) |
| 2.7 | `/contato` | `ContatoPage` | ⚠️ Envio mock (sem Supabase) |
| 2.8 | `/como-funciona` | `ComoFuncionaPage` | ✅ Estática (OK) |
| 2.9 | `/privacidade` | `PrivacidadePage` | ✅ Estática (OK) |
| 2.10 | `/termos` | `TermosPage` | ✅ Estática (OK) |
| 2.11 | `/anuncios/:id` (detalhe de um anúncio) | **NÃO EXISTE** | ❌ **FAZER** |
| 2.12 | `/painel` (dashboard do usuário) | **NÃO EXISTE** | ❌ **FAZER** |
| 2.13 | `/esqueci-senha` (recuperação) | **NÃO EXISTE** | ❌ **FAZER** |
| 2.14 | `/baixar-app` (landing do download) | **NÃO EXISTE** | ❌ **FAZER** |
| 2.15 | `*` (404 Not Found) | **NÃO EXISTE** | ❌ **FAZER** |

---

## 3. COMPONENTES GLOBAIS

### 3.1 — `src/components/Header.jsx` (header padrão com nav desktop)

Usado em: `NewAdPage`, `ListingsPage`.

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 3.1.1 | Logo + texto BRASILESPANA | `<Link to="/">` | ✅ |
| 3.1.2 | Link "Início" (PT) / "Inicio" (ES) | `to="/"` | ✅ |
| 3.1.3 | Link "Sobre" / "Sobre nosotros" | `to="/sobre"` | ✅ |
| 3.1.4 | Link "Contato" / "Contacto" | `to="/contato"` | ✅ |
| 3.1.5 | Botão Globe (toggle idioma) | `toggleLang()` | ✅ |
| 3.1.6 | Botão "Entrar" desktop | **SEM `onClick`** — não navega | ❌ **CORRIGIR** (apontar para `/entrar`) |
| 3.1.7 | Botão "Publicar Anúncio" | `navigate('/novo-anuncio')` | ✅ |
| 3.1.8 | Botão mobile menu (hambúrguer) | abre dropdown | ✅ |
| 3.1.9 | Mobile menu "Entrar" | **SEM `onClick`** — não navega | ❌ **CORRIGIR** |
| 3.1.10 | Mobile menu "Publicar Anúncio" | `navigate('/novo-anuncio')` | ✅ |

### 3.2 — `src/components/PageHeader.jsx` (header com hambúrguer + voltar)

Usado em: `LoginPage`, `RegisterPage`, `SobrePage`, `ContatoPage`, `ComoFuncionaPage`, `PrivacidadePage`, `TermosPage`.

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 3.2.1 | Hambúrguer (abre menu) | toggle dropdown | ✅ |
| 3.2.2 | Toggle idioma (Globe + PT/ES) | `toggleLang()` | ✅ |
| 3.2.3 | Botão Voltar | `navigate(backTo)` (default `/`) | ✅ |
| 3.2.4 | Dropdown "Início" | `/` | ✅ |
| 3.2.5 | Dropdown "Sobre" | `/sobre` | ✅ |
| 3.2.6 | Dropdown "Como funciona" | `/como-funciona` | ✅ |
| 3.2.7 | Dropdown "Contato" | `/contato` | ✅ |
| 3.2.8 | Dropdown "+ Publicar Anúncio" | `/novo-anuncio` | ✅ |
| 3.2.9 | **Falta no dropdown:** "Entrar" e "Cadastro" | ❌ **ADICIONAR** |

### 3.3 — `src/components/Footer.jsx`

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 3.3.1 | Logomarca | imagem | ✅ |
| 3.3.2 | Tagline bilíngue | "Conectando brasileiros na Espanha" / "...brasileños en España" | ✅ |
| 3.3.3 | Ícone Instagram | `https://instagram.com/brasilespana` | ⚠️ Verificar se a conta existe |
| 3.3.4 | Ícone Facebook | `https://facebook.com/brasilespana` | ⚠️ Verificar se a conta existe |
| 3.3.5 | Ícone WhatsApp | `https://wa.me/` (**sem número**) | ❌ **CORRIGIR** (definir número oficial) |
| 3.3.6 | Categoria — Serviços / Servicios | `/anuncios/servicos` | ✅ |
| 3.3.7 | Categoria — Produtos / Productos | `/anuncios/produtos` | ✅ |
| 3.3.8 | Categoria — Desapego | `/anuncios/desapego` | ✅ |
| 3.3.9 | Categoria — Doação / Donación | `/anuncios/doacao` | ✅ |
| 3.3.10 | Categoria — Vagas / Empleo | `/anuncios/vagas` | ✅ |
| 3.3.11 | Categoria — Voluntariado | `/anuncios/voluntariado` | ✅ |
| 3.3.12 | Categoria — Promoções / Promociones | `/anuncios/promocoes` | ✅ |
| 3.3.13 | **Categoria Adoção AUSENTE** | esperada (`/anuncios/adocao-pets`) | ❌ **ADICIONAR** |
| 3.3.14 | Link "Sobre nós" / "Sobre nosotros" | `/sobre` | ✅ |
| 3.3.15 | Link "Como funciona" / "Cómo funciona" | `/como-funciona` | ✅ |
| 3.3.16 | Link "Contato" / "Contacto" | `/contato` | ✅ |
| 3.3.17 | Link "Privacidade" / "Privacidad" | `/privacidade` | ✅ |
| 3.3.18 | Link "Termos de uso" / "Términos de uso" | `/termos` | ✅ |
| 3.3.19 | Copyright dinâmico (`new Date().getFullYear()`) | exibe ano corrente | ✅ |

### 3.4 — `src/components/LocationFilter.jsx`

Usado em: `Home`.

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 3.4.1 | Botão "Usar minha localização" / "Usar mi ubicación" | `navigator.geolocation` + Nominatim (OpenStreetMap) | ✅ |
| 3.4.2 | Botão Comunidade Autônoma | abre dropdown multi-seleção | ✅ |
| 3.4.3 | Botão Província / Provincia | dropdown filtrado pela comunidade | ✅ |
| 3.4.4 | Botão Município / Municipio | dropdown filtrado pela província | ✅ |
| 3.4.5 | Botão Bairro / Barrio | dropdown filtrado pelo município | ✅ |
| 3.4.6 | Botão "Filtrar Anúncios" | `navigate('/anuncios/todos?comunidade=...&...')` | ✅ |
| 3.4.7 | Dependência externa: Nominatim | sem fallback offline | ⚠️ Adicionar fallback se API falhar |

### 3.5 — `src/components/Logo.jsx` (logo tipográfica)

| # | Item | Estado |
|---|------|--------|
| 3.5.1 | Logo nas cores oficiais (verde/amarelo/vermelho) com aviãozinho sobre o "N" | ✅ **TRAVADA — NÃO ALTERAR** |
| 3.5.2 | **Não é mais usado** — Header.jsx usa SVG + PNG no lugar | ⚠️ Decidir: descontinuar ou re-adotar |

### 3.6 — `src/components/HeroBanner.jsx` e `CategorySection.jsx` e `FeaturedAds.jsx`

| # | Item | Estado |
|---|------|--------|
| 3.6.1 | HeroBanner.jsx | **não é importado em lugar nenhum** — código morto | ⚠️ Remover ou usar |
| 3.6.2 | CategorySection.jsx | **não é importado em lugar nenhum** — código morto | ⚠️ Remover ou usar |
| 3.6.3 | FeaturedAds.jsx | **não é importado em lugar nenhum** — código morto | ⚠️ Remover ou usar |

---

## 4. PÁGINA POR PÁGINA

### 4.1 — `Home` (`/`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.1.1 | Header próprio (não usa Header.jsx) com fundo céu e logomarca | — | ✅ **TRAVADO — APROVADO** |
| 4.1.2 | Botão "Menu" (topo esquerda) | abre dropdown | ✅ |
| 4.1.3 | Botão "Sair" / "Salir" (topo direita) | `navigate('/entrar')` | ⚠️ Nomenclatura: ainda não há sessão → renomear para "Entrar" |
| 4.1.4 | Dropdown — "Início" | `/` | ✅ |
| 4.1.5 | Dropdown — "Sobre" | `/sobre` | ✅ |
| 4.1.6 | Dropdown — "Como funciona" | `/como-funciona` | ✅ |
| 4.1.7 | Dropdown — "Contato" | `/contato` | ✅ |
| 4.1.8 | Dropdown — "+ Publicar Anúncio" | `/novo-anuncio` | ✅ |
| 4.1.9 | Faixa tricolor (verde/amarelo/vermelho) | decorativa | ✅ **TRAVADO — APROVADO** |
| 4.1.10 | Seletor de idioma (bandeiras BR / ES) | `setLang('pt' / 'es')` | ✅ |
| 4.1.11 | Card categoria — Serviços / Servicios | `/anuncios/servicos` | ✅ |
| 4.1.12 | Card categoria — Produtos / Productos | `/anuncios/produtos` | ✅ |
| 4.1.13 | Card categoria — Desapego | `/anuncios/desapego` | ✅ |
| 4.1.14 | Card categoria — Doação / Donación | `/anuncios/doacao` | ✅ |
| 4.1.15 | Card categoria — Adoção / Adopción | `/anuncios/adocao-pets` | ⚠️ ListingsPage não tem meta para `adocao-pets` → cai no fallback "Todos" |
| 4.1.16 | Card categoria — Voluntariado | `/anuncios/voluntariado` | ✅ |
| 4.1.17 | Card categoria — Vagas / Empleo | `/anuncios/vagas` | ✅ |
| 4.1.18 | Card categoria — Promoções / Promociones | `/anuncios/promocoes` | ✅ |
| 4.1.19 | Card "Ver Tudo" / "Ver Todo" | `/anuncios/todos` | ✅ |
| 4.1.20 | LocationFilter (componente 3.4) | navega com query params | ✅ |
| 4.1.21 | Footer | global | ✅ |
| 4.1.22 | **Falta:** seção "Anúncios em destaque" / "Últimos publicados" | ❌ **AVALIAR** (FeaturedAds.jsx existe mas não é usado) |
| 4.1.23 | **Falta:** banner / CTA "Baixar o app" | ❌ **ADICIONAR** |

### 4.2 — `LoginPage` (`/entrar`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.2.1 | PageHeader (com toggle idioma) | global | ✅ Bilíngue |
| 4.2.2 | Faixa tricolor | decorativa | ✅ |
| 4.2.3 | Input E-mail | validação `validateEmail()` | ✅ |
| 4.2.4 | Input Senha + olho mostra/esconde | toggle visibilidade | ✅ |
| 4.2.5 | Botão "Esqueci minha senha" / "Olvidé mi contraseña" | **SEM `onClick`** — não funciona | ❌ **CORRIGIR** (criar `/esqueci-senha`) |
| 4.2.6 | Botão "Entrar" (submit) | **Supabase comentado**, força `INVALID_CREDENTIALS` | ❌ **CONECTAR Supabase** |
| 4.2.7 | Rate limiter (5 tentativas / 15 min) | localStorage | ✅ Implementado client-side |
| 4.2.8 | Banner "Acesso bloqueado" + tentativas restantes | bilíngue | ✅ |
| 4.2.9 | Mensagem genérica de erro (não revela e-mail) | `AUTH_ERRORS[lang]` | ✅ Boa prática de segurança |
| 4.2.10 | CSRF token (campo hidden) | gerado em `getCSRFToken()` | ⚠️ Backend ainda não valida (Supabase não exige) |
| 4.2.11 | Link "Criar conta gratuita" / "Crear cuenta gratis" | `/cadastro` | ✅ |
| 4.2.12 | Footer | global | ✅ |

### 4.3 — `RegisterPage` (`/cadastro`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.3.1 | PageHeader bilíngue | global | ✅ |
| 4.3.2 | Faixa tricolor | decorativa | ✅ |
| 4.3.3 | Input Nome completo | validação min 3 chars | ✅ |
| 4.3.4 | Input E-mail | `validateEmail()` | ✅ |
| 4.3.5 | Input Senha + regras visuais em tempo real (length, uppercase, número, símbolo) | `validatePassword()` | ✅ |
| 4.3.6 | Input Confirmar senha | validação match | ✅ |
| 4.3.7 | Input WhatsApp internacional | regex `validatePhone()` | ✅ |
| 4.3.8 | Checkbox "Aceito os termos..." | required | ✅ |
| 4.3.9 | **Texto "termos de uso e política de privacidade"** | **NÃO é link clicável** — é apenas um `<span>` estilizado | ❌ **CORRIGIR** (envolver em `<Link to="/termos">` e `<Link to="/privacidade">`) |
| 4.3.10 | Botão "Criar conta" / "Crear cuenta" | **Supabase comentado** — sucesso mockado após 1.4s | ❌ **CONECTAR Supabase** |
| 4.3.11 | Tela de sucesso → botão "Ir para o início" | `navigate('/')` | ✅ |
| 4.3.12 | Link "Já tenho conta — Entrar" / "Ya tengo cuenta — Entrar" | `/entrar` | ✅ |
| 4.3.13 | CSRF token (hidden) | gerado | ⚠️ Backend não valida |
| 4.3.14 | **Falta:** confirmação por e-mail (verificação) | ❌ **FAZER via Supabase Auth** |
| 4.3.15 | **Falta:** captcha / hCaptcha contra bots | ❌ **ADICIONAR** antes de publicar |

### 4.4 — `NewAdPage` (`/novo-anuncio`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.4.1 | **Header global** | **passa `setLang` que NÃO é importado da `useLang`** — bug runtime | ❌ **CORRIGIR linha 119** (remover props ou importar `setLang`) |
| 4.4.2 | Botão Voltar | `step === 0 ? '/' : step-1` | ✅ |
| 4.4.3 | Progress bar 4 etapas (Categoria / Detalhes / Localização / Confirmar) bilíngue | controle de estado | ✅ |
| 4.4.4 | **Step 0** — Grid de 7 categorias (PT/ES) | `setStep(1)` ao escolher | ⚠️ **Falta "Adoção"** (presente na Home) — inconsistente |
| 4.4.5 | **Step 1** — Título, descrição, preço, contato | inputs com placeholders bilíngues | ✅ Layout OK |
| 4.4.6 | **Step 1** — Upload de fotos | UI placeholder **sem `onChange`** | ❌ **IMPLEMENTAR** (Supabase Storage) |
| 4.4.7 | **Step 2** — Comunidade Autônoma (`<select>`) | 17 comunidades listadas **só em PT** (sem versão ES) | ⚠️ **TRADUZIR** para ES |
| 4.4.8 | **Step 2** — Província | input livre (deveria ser select dependente) | ⚠️ Usar hierarquia do LocationFilter |
| 4.4.9 | **Step 2** — Cidade | input livre | ⚠️ Idem |
| 4.4.10 | **Step 3** — Confirmação + botão "Publicar" | apenas `setSubmitted(true)` | ❌ **CONECTAR Supabase** (`insert` em tabela `ads`) |
| 4.4.11 | Tela de sucesso → botão "Voltar ao início" | `navigate('/')` | ✅ |
| 4.4.12 | Footer | global | ✅ |
| 4.4.13 | **Falta:** botão "Salvar como rascunho" | ❌ **AVALIAR** |
| 4.4.14 | **Falta:** integrar com PayPal (cobrar assinatura antes de publicar) | ❌ **FAZER** |

### 4.5 — `ListingsPage` (`/anuncios/:category`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.5.1 | Header global | usa `Header.jsx` | ✅ |
| 4.5.2 | Botão "Voltar" / "Volver" | `navigate('/')` | ✅ |
| 4.5.3 | Header de categoria (ícone + nome) | leitura de `CATEGORY_META[category]` | ⚠️ **Sem entrada para `adocao-pets`** → cai em "Todos" |
| 4.5.4 | Contador de resultados | `filtered.length` | ✅ |
| 4.5.5 | Input de busca | filtra `MOCK_LISTINGS` localmente | ⚠️ Mock — substituir por query Supabase |
| 4.5.6 | Botão "+ Publicar nesta categoria" | `/novo-anuncio` | ✅ |
| 4.5.7 | Tags de filtros de localização (chips removíveis) | exibe `{f.label}: {f.value}` — `f.value` **é undefined** (a estrutura é `f.values: []`) | ❌ **BUG linha 150** (trocar por `f.values.join(', ')`) |
| 4.5.8 | Botão "X" remove filtro | `removeLocFilter(key)` | ✅ |
| 4.5.9 | Cards de anúncios | dados de `MOCK_RAW` (12 itens) | ⚠️ Mock |
| 4.5.10 | Click no card | **sem `onClick`** — não abre detalhe | ❌ **CORRIGIR** (criar `/anuncios/:id` e navegar) |
| 4.5.11 | Estado vazio "Nenhum anúncio encontrado" / "Ningún anuncio encontrado" | bilíngue | ✅ |
| 4.5.12 | Footer | **sem prop `lang`** — usa `useLang()` internamente | ✅ OK |
| 4.5.13 | **Falta:** paginação ou scroll infinito | ❌ |
| 4.5.14 | **Falta:** ordenar (mais recente / preço / proximidade) | ❌ |
| 4.5.15 | **Falta:** filtros adicionais (faixa de preço, destaque) | ❌ |

### 4.6 — `SobrePage` (`/sobre`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.6.1 | PageHeader bilíngue | global | ✅ |
| 4.6.2 | Faixa tricolor | decorativa | ✅ |
| 4.6.3 | Seção Missão | texto bilíngue | ✅ |
| 4.6.4 | Stats (162k, 4.996.951, 35) | bilíngue | ✅ |
| 4.6.5 | Seção Visão CONEXÃO BR | bilíngue | ✅ |
| 4.6.6 | Cards de valores (Comunidade, Bilíngue, Inclusivo, Foco) | bilíngue | ✅ |
| 4.6.7 | Lista da equipe fundadora (Michele, Tharyck, Thayza) | de `TEAM` em `src/lib/social.js` | ✅ |
| 4.6.8 | Botão "Fale com a gente → contato@plataformaconexaobr.com" | `mailto:` | ✅ |
| 4.6.9 | Footer | global | ✅ |

### 4.7 — `ContatoPage` (`/contato`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.7.1 | PageHeader bilíngue | global | ✅ |
| 4.7.2 | Card "E-mail" (`mailto:contato@plataformaconexaobr.com`) | abre cliente de e-mail | ✅ |
| 4.7.3 | Card "Site" (`https://brasilespana.plataformaconexaobr.com`) | abre o site | ✅ |
| 4.7.4 | Ícone Instagram | redes sociais (3.3.3) | ⚠️ |
| 4.7.5 | Ícone Facebook | redes sociais (3.3.4) | ⚠️ |
| 4.7.6 | Ícone WhatsApp | **sem número** (3.3.5) | ❌ |
| 4.7.7 | Formulário (nome, e-mail, assunto, mensagem) | validações locais OK | ✅ |
| 4.7.8 | Botão "Enviar" / "Enviar" | apenas `setTimeout` mock — **TODO Supabase** | ❌ **CONECTAR backend** (tabela `messages` ou serviço transacional) |
| 4.7.9 | Mensagem de sucesso pós-envio | bilíngue | ✅ |
| 4.7.10 | Footer | global | ✅ |

### 4.8 — `ComoFuncionaPage` (`/como-funciona`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.8.1 | PageHeader bilíngue | global | ✅ |
| 4.8.2 | 3 passos (Crie conta / Publique / Conecte-se) | bilíngue | ✅ |
| 4.8.3 | Texto cita **9 categorias** e **R$ 30/mês via PayPal** | conteúdo de marketing | ⚠️ **Inconsistente**: NewAdPage tem só 7 categorias; PayPal ainda não está integrado |
| 4.8.4 | 4 features (Marketplace bilíngue / Sem fidelidade / RGPD+LGPD / Foco local) | bilíngue | ✅ |
| 4.8.5 | CTA "Criar conta" | `/cadastro` | ✅ |
| 4.8.6 | CTA secundário "Ver anúncios" / "Ver anuncios" | `/anuncios/todos` | ✅ |
| 4.8.7 | Footer | global | ✅ |

### 4.9 — `PrivacidadePage` (`/privacidade`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.9.1 | PageHeader bilíngue | global | ✅ |
| 4.9.2 | 4 seções (Dados coletados / Como usamos / Seus direitos / Retenção) | bilíngue + ícones | ✅ |
| 4.9.3 | Botão DPO (`mailto:`) | abre cliente de e-mail | ✅ |
| 4.9.4 | Footer | global | ✅ |
| 4.9.5 | Conformidade declarada: RGPD (EU) + LGPD (BR) | ✅ Texto OK |
| 4.9.6 | **Pendente:** registrar política pública no rodapé externo e DPO formal | ⚠️ Verificar |

### 4.10 — `TermosPage` (`/termos`)

| # | Elemento | Ação | Estado |
|---|----------|------|--------|
| 4.10.1 | PageHeader bilíngue | global | ✅ |
| 4.10.2 | 9 cláusulas numeradas bilíngues | ✅ |
| 4.10.3 | Cláusula 4 cita "R$ 30/mês via PayPal" | ⚠️ Combinar com 4.4.14 (PayPal ainda não integrado) |
| 4.10.4 | Botão de contato (mailto) | ✅ |
| 4.10.5 | Footer | global | ✅ |

---

## 5. SISTEMA BILÍNGUE PT/ES — COBERTURA

Implementação: `src/lib/lang.jsx` — Context global, `localStorage` (`brasilespana-lang`), sincroniza `<html lang>`, default `pt`.

| # | Página/Componente | Bilíngue? |
|---|-------------------|-----------|
| 5.1 | Home | ✅ Total |
| 5.2 | LoginPage | ✅ Total |
| 5.3 | RegisterPage | ✅ Total |
| 5.4 | NewAdPage (UI) | ✅ Bilíngue |
| 5.4b | NewAdPage (lista de Comunidades no `<select>`) | ❌ **Apenas PT** (corrigir) |
| 5.5 | ListingsPage | ✅ Total (inclusive títulos e preços dos mocks) |
| 5.6 | SobrePage | ✅ |
| 5.7 | ContatoPage | ✅ |
| 5.8 | ComoFuncionaPage | ✅ |
| 5.9 | PrivacidadePage | ✅ |
| 5.10 | TermosPage | ✅ |
| 5.11 | Header global | ✅ |
| 5.12 | PageHeader | ✅ |
| 5.13 | Footer | ✅ |
| 5.14 | LocationFilter | ✅ (PT usa "Bairro", ES usa "Barrio") |

**Conclusão:** o sistema bilíngue cobre tudo exceto a lista hard-coded de Comunidades Autônomas em `NewAdPage` (4.4.7).

---

## 6. BACKEND / SERVIDOR DE CONFIANÇA — SUPABASE

| # | Item | Estado |
|---|------|--------|
| 6.1 | Cliente Supabase configurado | `src/lib/supabase.js` — pronto, mas depende de `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` |
| 6.2 | `.env.example` documentado | ✅ |
| 6.3 | `.env.local` real | ❌ **NÃO EXISTE** — precisa criar com credenciais reais |
| 6.4 | Chamada `supabase.auth.signInWithPassword` | ❌ **comentada em LoginPage:118-127** |
| 6.5 | Chamada `supabase.auth.signUp` | ❌ **comentada em RegisterPage:204-211** |
| 6.6 | Insert de anúncio | ❌ **não implementado em NewAdPage** |
| 6.7 | Select de anúncios | ❌ **não implementado em ListingsPage** |
| 6.8 | Insert de mensagem de contato | ❌ **não implementado em ContatoPage** |
| 6.9 | Recuperação de senha (`resetPasswordForEmail`) | ❌ **não implementado** |
| 6.10 | Storage para fotos de anúncio | ❌ **não implementado** |
| 6.11 | Row Level Security (RLS) | ❌ **a configurar no painel Supabase** |
| 6.12 | Schema SQL das tabelas (`profiles`, `ads`, `messages`, `subscriptions`) | ❌ **a criar** |
| 6.13 | Edge Function para webhook PayPal | ❌ **a criar** |

### Plano sugerido de tabelas Supabase

```sql
-- usuários (estende auth.users)
profiles      (id uuid PK, full_name, whatsapp, lang, created_at)
-- anúncios
ads           (id uuid PK, user_id FK, category, title, description, price,
               contact, comunidade, provincia, municipio, bairro,
               photos jsonb, status enum('pending','active','expired'),
               created_at, expires_at)
-- mensagens do formulário de contato
messages      (id uuid PK, name, email, subject, body, lang, created_at)
-- assinatura PayPal
subscriptions (id uuid PK, user_id FK, paypal_sub_id, status, valid_until)
```

---

## 7. DOMÍNIO E E-MAIL

| # | Item | Valor | Estado |
|---|------|-------|--------|
| 7.1 | Domínio principal declarado em código | `brasilespana.plataformaconexaobr.com` (`src/lib/social.js`) | ✅ |
| 7.2 | E-mail público (contato) | `contato@plataformaconexaobr.com` | ✅ |
| 7.3 | E-mail técnico/transacional | `brasilespana@plataformaconexaobr.com` | ✅ |
| 7.4 | DNS / Vercel apontados para o domínio | ⚠️ **Verificar no painel Vercel** (vercel.json apenas com headers/rewrites) |
| 7.5 | Certificado SSL | ⚠️ Automático no Vercel, confirmar antes de publicar |
| 7.6 | CSP permite `*.supabase.co` em `connect-src` | ✅ `vercel.json` linha 17 |
| 7.7 | CSP **não permite** `nominatim.openstreetmap.org` | ❌ **ADICIONAR** em `connect-src` (LocationFilter usa Nominatim) |
| 7.8 | CSP permite `https:` em `img-src` (genérico) | ✅ |

---

## 8. PWA / DOWNLOAD DO APP (instalação no celular)

**ESTADO ATUAL:** zero PWA. Não há manifest, service worker, ícones nem prompt de instalação. Para o objetivo "usuário baixa no celular, adapta a qualquer marca/modelo", precisamos transformar o site em **PWA instalável** (Progressive Web App). É o caminho mais limpo: sem APK, sem App Store, sem antivírus reclamando, e funciona em iOS + Android + desktop.

| # | Tarefa | Como |
|---|--------|------|
| 8.1 | Criar `public/manifest.webmanifest` | name, short_name, theme_color `#1A7A2E`, background_color, display `standalone`, start_url `/`, ícones 192/512 |
| 8.2 | Gerar ícones (192×192, 512×512, maskable, apple-touch-icon 180×180) | a partir da logomarca em `public/images/logomarca.png` |
| 8.3 | Linkar manifest no `index.html` | `<link rel="manifest" href="/manifest.webmanifest">` |
| 8.4 | Adicionar `apple-touch-icon` e `apple-mobile-web-app-capable` no `index.html` | suporte iOS |
| 8.5 | Service Worker (cache offline básico) | usar `vite-plugin-pwa` (já existe ecossistema pronto pra Vite) |
| 8.6 | Componente `<InstallAppButton>` | escuta evento `beforeinstallprompt` (Android/desktop) + mostra instruções iOS |
| 8.7 | Página `/baixar-app` ou banner na Home | CTA "Instalar BRASILESPANA" |
| 8.8 | Garantir que funciona em qualquer resolução | já está com Tailwind responsivo + viewport meta — testar em iPad / TV / monitor 4K |
| 8.9 | **Sem APK próprio** = nenhum risco de "antivírus acusando vírus", porque a instalação é nativa via navegador |
| 8.10 | (Opcional futuro) gerar APK via TWA (Trusted Web Activity) para Play Store | só se quiserem presença na Play Store |

---

## 9. PAGAMENTOS (PayPal) — PENDÊNCIA

| # | Item | Estado |
|---|------|--------|
| 9.1 | Texto dos Termos cita assinatura R$ 30/mês via PayPal | ✅ Texto OK |
| 9.2 | Texto do ComoFunciona idem | ✅ |
| 9.3 | Botão de pagamento real (PayPal Buttons / Subscriptions API) | ❌ **não existe** |
| 9.4 | Tabela `subscriptions` no Supabase | ❌ |
| 9.5 | Webhook do PayPal para confirmar assinatura | ❌ |
| 9.6 | Gate: só publicar anúncio se `subscription.status === 'active'` | ❌ |
| 9.7 | Tela de status da assinatura no painel | ❌ (depende de 2.12) |

---

## 10. INCONSISTÊNCIAS ENTRE PÁGINAS

| # | Inconsistência | Onde | Como corrigir |
|---|----------------|------|---------------|
| 10.1 | Categoria "Adoção" existe na Home, **falta** em Footer, ListingsPage `CATEGORY_META`, NewAdPage `CATEGORIES` | itens 3.3.13 / 4.5.3 / 4.4.4 | Adicionar `adocao-pets` em todas as 3 listas |
| 10.2 | ComoFuncionaPage diz "9 categorias" mas a app tem 8 ou 7 dependendo do lugar | 4.8.3 | Padronizar em **9** (incluindo Adoção e Ver Tudo) |
| 10.3 | NewAdPage `<select>` de Comunidades só em PT | 4.4.7 / 5.4b | Usar `COM_PT_TO_ES` que já existe em `LocationFilter.jsx` |
| 10.4 | Componentes `HeroBanner.jsx`, `CategorySection.jsx`, `FeaturedAds.jsx` não são usados | 3.6 | Decidir: reaproveitar na Home/Listings ou deletar |
| 10.5 | `Logo.jsx` (tipográfico) substituído por PNG no Header, mas arquivo permanece | 3.5 | Decidir uso oficial |
| 10.6 | `dependencies` traz `helmet` (pacote Node) mas é projeto React puro — não funciona no browser | `package.json` | Remover dependência (CSP já está no `vercel.json`) |

---

## 11. SEGURANÇA — IMPLEMENTADA vs. FALTA

### Já implementado
- [x] CSP, HSTS, X-Frame-Options DENY, Referrer-Policy (vercel.json)
- [x] `enforceHttps()` em produção
- [x] Sanitização de inputs com DOMPurify (`sanitize()`)
- [x] Validação de e-mail e senha forte (8+, maiúscula, número, símbolo)
- [x] Rate limiter client-side (5 tentativas / 15 min)
- [x] Mensagens de erro genéricas (não revelam se e-mail existe)
- [x] Token CSRF gerado por sessão (hidden field)
- [x] `safeLog()` redige campos sensíveis em dev e desliga em produção

### Pendente
- [ ] **11.1** Backend que efetivamente bloqueia tentativas (rate limit server-side via Supabase Edge Function)
- [ ] **11.2** Validação real do CSRF no servidor (Supabase Auth não exige, mas custom endpoints sim)
- [ ] **11.3** Captcha (hCaptcha/Turnstile) em /cadastro e /contato antes de ir ao ar
- [ ] **11.4** Verificação de e-mail via Supabase Auth (`emailRedirectTo`)
- [ ] **11.5** Política de senhas rotacionáveis e bloqueio por IP (defesa em profundidade)
- [ ] **11.6** Adicionar `nominatim.openstreetmap.org` em `connect-src` da CSP
- [ ] **11.7** Auditoria de RLS (Row Level Security) em todas as tabelas Supabase
- [ ] **11.8** `Permissions-Policy` atualmente bloqueia `geolocation=()` — **LocationFilter precisa** → relaxar para `geolocation=(self)`

---

## 12. LISTA PRIORIZADA DE CORREÇÕES

> Ordenado do mais crítico (bloqueia publicação) ao polimento.

### 🔴 BLOQUEADORES (corrigir antes de liberar a plataforma)

| # | Tarefa | Item |
|---|--------|------|
| P1 | Conectar Supabase real (criar `.env.local`, ativar chamadas em Login/Register/NewAd/Contato) | 6.3-6.8 |
| P2 | Criar schema (`profiles`, `ads`, `messages`, `subscriptions`) + RLS no Supabase | 6.11, 6.12 |
| P3 | Bug runtime: `NewAdPage.jsx:119` passa `setLang` inexistente | 4.4.1 |
| P4 | Bug: `ListingsPage.jsx:150` usa `f.value` (undefined) — trocar por `f.values.join(', ')` | 4.5.7 |
| P5 | Botão "Entrar" do Header.jsx (desktop e mobile) sem onClick | 3.1.6 / 3.1.9 |
| P6 | "Esqueci minha senha" sem handler nem rota `/esqueci-senha` | 4.2.5 / 2.13 |
| P7 | Permissions-Policy bloqueia geolocation — LocationFilter quebra em prod | 11.8 |
| P8 | CSP não permite Nominatim — LocationFilter quebra em prod | 7.7 / 11.6 |
| P9 | WhatsApp sem número (`https://wa.me/`) | 3.3.5 |
| P10 | Texto dos termos no Register não é clicável | 4.3.9 |
| P11 | Categoria Adoção inconsistente entre Home/Footer/Listings/NewAd | 10.1 |
| P12 | Captcha em /cadastro e /contato | 4.3.15 / 11.3 |

### 🟡 IMPORTANTE (lançar com plano de seguir)

| # | Tarefa | Item |
|---|--------|------|
| P13 | Página de detalhe do anúncio `/anuncios/:id` | 2.11, 4.5.10 |
| P14 | Painel do usuário `/painel` (meus anúncios, assinatura, dados) | 2.12 |
| P15 | Integração PayPal (assinatura + webhook + gate de publicação) | 9.3-9.7 |
| P16 | Upload de fotos no NewAd (Supabase Storage) | 4.4.6 |
| P17 | Tradução do `<select>` de Comunidades no NewAd | 4.4.7 |
| P18 | Província/Cidade do NewAd usar hierarquia do LocationFilter | 4.4.8-4.4.9 |
| P19 | PWA: manifest + ícones + service worker (item 8) | 8.1-8.7 |
| P20 | Página 404 (`*`) | 2.15 |
| P21 | Verificação de e-mail Supabase | 4.3.14 / 11.4 |

### 🟢 POLIMENTO

| # | Tarefa | Item |
|---|--------|------|
| P22 | Adicionar "Entrar / Cadastro" ao dropdown do PageHeader | 3.2.9 |
| P23 | Decidir destino dos componentes não usados (Hero/Category/FeaturedAds) | 3.6, 10.4 |
| P24 | Decidir uso do `Logo.jsx` tipográfico | 3.5, 10.5 |
| P25 | Remover `helmet` do `package.json` | 10.6 |
| P26 | Paginação / ordenação / filtros adicionais em ListingsPage | 4.5.13-4.5.15 |
| P27 | Banner CTA "Instalar app" na Home | 4.1.23 |
| P28 | Adicionar Adoção ao Footer | 3.3.13 |
| P29 | Trocar "Sair / Salir" da Home por "Entrar / Entrar" enquanto não houver sessão | 4.1.3 |

---

## ANEXO A — CREDENCIAIS E ARQUIVOS A CRIAR

```
.env.local                  (PRIVADO — nunca commitar)
public/manifest.webmanifest
public/icons/icon-192.png
public/icons/icon-512.png
public/icons/icon-maskable-512.png
public/apple-touch-icon.png
public/og-image.png         (imagem para compartilhamento Open Graph)
src/sw.js  ou usar vite-plugin-pwa
src/pages/AnuncioDetalhe.jsx   (rota 2.11)
src/pages/PainelPage.jsx        (rota 2.12)
src/pages/EsqueciSenhaPage.jsx  (rota 2.13)
src/pages/NotFoundPage.jsx      (rota 2.15)
supabase/schema.sql             (tabelas + RLS)
supabase/functions/paypal-webhook/index.ts
```

---

## ANEXO B — RESUMO EXECUTIVO (1 minuto)

- **App funcional como protótipo**, 10 rotas, bilíngue PT/ES, design APROVADO travado, header/categorias/cores intocáveis.
- **Para ir ao ar:** corrigir os **12 bloqueadores** listados em P1-P12. Sem isso, login/cadastro/anúncio/contato não persistem nada.
- **Servidor de confiança:** Supabase já está integrado no código (`supabase.js`), só faltam as **chaves reais no `.env.local`** e ativar as 4-5 chamadas comentadas.
- **Download do app (sem vírus, multi-plataforma):** transformar em **PWA** (item 8). É o caminho técnico correto — instala em iOS, Android, Windows, macOS, Linux, sem APK, sem antivírus alarmando, sem App Store.
- **Domínio:** `brasilespana.plataformaconexaobr.com` já está nos arquivos; confirmar DNS no Vercel.
- **Pagamentos:** PayPal mencionado nos textos legais mas ainda **não implementado** — não cobrar antes de P15.
- **Categoria Adoção:** está na Home mas falta nos outros lugares — corrigir em todos para alinhar.

---

*Arquivo gerado em 2026-05-11 para auditoria interna BRASILESPAÑA / CONEXÃO BR.*
