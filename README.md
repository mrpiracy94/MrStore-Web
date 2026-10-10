<div align="center">
  <img src="assets/mrstore-hero.webp" alt="MrStore — O teu homelab. As tuas apps. Uma só loja." width="100%">
  <h1>MrStore-Web</h1>
  <p><strong>O teu homelab. As tuas apps. Uma só loja.</strong><br>Website oficial e montra web independente para o universo self-hosted.</p>
  <p><a href="https://mrpiracy94.github.io/MrStore-Web/">🌐 Abrir website</a> · <a href="https://github.com/mrpiracy94/MrStore">📦 Catálogo técnico</a></p>
</div>

## Sobre o projeto

Este repositório é dedicado à **interface pública da MrStore**: identidade visual, homepage, plataformas, pesquisa, filtros por categoria/arquitetura, favoritos locais e fichas de aplicações.

O catálogo, os manifests Docker Compose, a auditoria CVE e a publicação segura continuam no repositório **[MrStore](https://github.com/mrpiracy94/MrStore)**.

## Arquitetura

| Componente | URL |
|---|---|
| **Website** | https://mrpiracy94.github.io/MrStore-Web/ |
| **Catálogo existente** | https://mrpiracy94.github.io/MrStore/ |
| **Índice de aplicações** | https://mrpiracy94.github.io/MrStore/index.json |
| **Evidência de publicação** | https://mrpiracy94.github.io/MrStore/release-status.json |
| **Manifestos, ícones e capturas** | https://mrpiracy94.github.io/MrStore/apps/… |

A montra consulta os dados de origem com JavaScript e **nunca duplica nem altera o catálogo**. Ambos os endereços partilham o domínio `mrpiracy94.github.io`, permitindo aceder a índices e imagens com a política `connect-src 'self'` e `img-src 'self'`. Para uma pré-visualização local fora desse domínio, é necessário um servidor de desenvolvimento que sirva/proxie ambos os caminhos.

O browser valida os IDs e a consistência entre `index.json` e `release-status.json`. Sem evidência válida, apresenta aviso claro de segurança, sem declarar aplicações aprovadas.

## Design e funcionalidades

- **Design laranja e grafite**, identidade MrStore, responsivo em desktop, tablet e mobile.
- **Catálogo real:** pesquisa, categorias, arquiteturas, carregamento incremental e fichas técnicas.
- **Favoritos:** guardados apenas no `localStorage` do navegador, sem conta.
- **CSP local:** sem CDN, `eval`, código externo nem HTML arbitrário proveniente do catálogo.
- **Transparência:** a montra não instala nem atualiza contentores automaticamente.

A marca é universal para o ecossistema homelab. Isso **não significa que todos os sistemas já tenham integração nativa**. A compatibilidade técnica efetiva está documentada no [repositório principal](https://github.com/mrpiracy94/MrStore/blob/main/README.md#-plataformas-e-compatibilidade).

## Publicação

O workflow `.github/workflows/pages.yml` publica a pasta raiz no GitHub Pages quando há alterações na `main`, sem gerar o catálogo técnico.

Após o primeiro push, em **Settings → Pages → Build and deployment**, confirma que a origem é **GitHub Actions**. Depois verifica o workflow na aba **Actions**.

Se a primeira publicação ficar bloqueada por Pages ainda não inicializado, seleciona **GitHub Actions** nessa definição e volta a executar **Publish MrStore-Web**.

## Testes

```bash
node --test tests/site.test.mjs
```

Os testes verificam estrutura, URLs de catálogo, políticas de segurança, assets da marca e elementos funcionais da interface.

---

**MrStore-Web:** website e comunicação visual. **MrStore:** catálogo técnico e publicação segura. 🧡
