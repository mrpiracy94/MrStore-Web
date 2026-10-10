# Publicação e ligação ao catálogo

Este repositório hospeda **apenas a montra** MrStore-Web.

- Website: https://mrpiracy94.github.io/MrStore-Web/
- Dados e releases: https://mrpiracy94.github.io/MrStore/
- Origem do catálogo: https://github.com/mrpiracy94/MrStore

## Preparação do GitHub Pages

O workflow `.github/workflows/pages.yml` executa testes e utiliza
`actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` e
`actions/deploy-pages@v4`. Em **Settings → Pages → Build and deployment**,
seleciona **GitHub Actions** se ainda não estiver ativo.

O website é publicado a partir da raiz, com `index.html` e `assets/`.
Não há instalador nem API no repositório MrStore-Web.

## Fonte de dados e política de segurança

O JavaScript consulta `/MrStore/index.json` e
`/MrStore/release-status.json` no mesmo domínio GitHub Pages,
mas **noutro caminho**. Ícones, capturas e manifests também são
resolvidos apenas sob `/MrStore/apps/`. A CSP continua restrita a
`'self'`, sem dependências CDN.

Se o catálogo estiver indisponível, a montra apresenta erro em vez de
fabricar aplicações. Se o relatório de release estiver ausente ou não
corresponder exatamente ao índice, **não apresenta segurança verificada**.

## Testar

```shell
node --test tests/site.test.mjs
```

Para pré-visualização local com catálogo real, usa um proxy estático que
sirva `/MrStore-Web/` e `/MrStore/` sob a mesma origem. Não desativas a
CSP nem a validação do catálogo para contornar erros de CORS.

## Não alterar a integração existente

A configuração da loja técnica **não muda**:
`https://mrpiracy94.github.io/MrStore`

Quando o website separado estiver confirmado online, remove a montra
duplicada do projeto principal apenas através de uma alteração
independente, que não afete os ficheiros `store.json`, `index.json`,
`release-status.json` ou `/apps/`.

## Diagnóstico de erros comuns

- **404 no website:** o GitHub Pages ainda não está ativo no repositório.
  Em `Settings → Pages`, seleciona `GitHub Actions` e executa
  `Publish MrStore-Web` em `Actions`. O repositório ter HTML na main,
  por si só, não significa que o URL Pages esteja publicado.
- **Catálogo indisponível:** verifica o URL técnico
  `https://mrpiracy94.github.io/MrStore/index.json`.
  O website oferece `Voltar a verificar o catálogo` após um erro ou timeout.
- **Aviso de publicação não verificada:** o relatório
  `https://mrpiracy94.github.io/MrStore/release-status.json`
  ainda não existe ou não corresponde aos IDs do índice. Não criar um relatório
  fictício nem desativar a verificação; só a publicação de uma edição aprovada
  no repositório técnico pode resolver o estado de segurança.
- **Favotitos/filtros:** os favoritos continuam no `localStorage`.
  O botão `Limpar filtros` limpa a pesquisa e o estado visual, não os favoritos.
