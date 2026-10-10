import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const text = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const html = text("index.html");
const js = text("assets/site.js");
const css = text("assets/site.css");
const readme = text("README.md");
const STORE = "https://mrpiracy94.github.io/MrStore/";

test("site independente aponta para o catálogo técnico original", () => {
  assert.match(js, /const STORE_URL = "https:\/\/mrpiracy94\.github\.io\/MrStore"/);
  assert.match(js, /const catalogBase = new URL\(STORE_URL \+ "\/"\)/);
  assert.match(js, /getCatalogJSON\("index\.json"\)/);
  assert.match(js, /getCatalogJSON\("release-status\.json"\)/);
  assert.match(js, /const publicCatalogBase = catalogBase;/);
  assert.match(js, /fetch\(new URL\(filename, publicCatalogBase\)/);
  assert.doesNotMatch(js, /const publicCatalogBase = new URL\("https:\/\/mrpiracy94\.github\.io\/"\)/);
  assert.match(js, /release\.certification !== "security_scanned"/);
  assert.doesNotMatch(js, /fetch\("\.\/index\.json"/);
  assert.match(html, /https:\/\/mrpiracy94\.github\.io\/MrStore\/store\.json/);
});

test("os caminhos de manifests e imagens permanecem isolados na MrStore", () => {
  assert.match(js, /value\.startsWith\("\/apps\/"\)/);
  assert.match(js, /candidate\.origin !== catalogBase\.origin/);
  assert.match(js, /candidate\.pathname\.startsWith\(catalogBase\.pathname \+ "apps\/"\)/);
  assert.match(js, /safePath\(app\.compose_url, "\.yml"\)/);
  assert.match(js, /safePath\(app\.thumbnail\)/);
  assert.match(js, /safePath\(app\.icon\)/);
});

test("interface mantém controlos e respetivos IDs", () => {
  for (const id of ["total-apps", "total-categories", "categories", "catalogo",
    "search", "architecture", "favorites-toggle", "clear-filters", "app-grid",
    "results-summary", "catalog-state", "catalog-alert", "load-more", "details",
    "details-close", "details-preview", "details-compose", "details-github",
    "copy-store", "copy-feedback", "store-address"]) {
    assert.ok(html.includes('id="' + id + '"'), "Em falta: " + id);
  }
  assert.match(js, /verifyRelease\(/);
  assert.match(js, /localStorage\.setItem\("mrstore-favorites-v1"/);
  assert.match(js, /\$\("clear-filters"\)\.addEventListener/);
  assert.match(html, /lang="pt-PT"/);
});

test("segurança e marca sem dependências externas", () => {
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /connect-src 'self'/);
  assert.match(html, /img-src 'self' data:/);
  assert.doesNotMatch(js, /\.innerHTML\s*=/);
  assert.doesNotMatch(js, /\beval\s*\(/);
  assert.match(css, /--orange:#ff831f/);
  assert.match(readme, /MrStore-Web/);
  assert.match(html, /MrStore-Web\/assets\/mrstore-hero\.webp/);
});

test("banner e logotipo são recursos locais", () => {
  const hero = readFileSync(new URL("../assets/mrstore-hero.webp", import.meta.url));
  assert.equal(hero.toString("ascii", 0, 4), "RIFF");
  assert.equal(hero.toString("ascii", 8, 12), "WEBP");
  assert.ok(hero.length < 500_000, "Banner não está otimizado");
  assert.match(text("assets/mark.svg"), /<svg/);
  assert.match(html, /\.\/assets\/mrstore-hero\.webp/);
  assert.ok(statSync(new URL("../index.html", import.meta.url)).size > 1000);
});

test("erros de rede não deixam o site preso em carregamento", () => {
  assert.match(js, /new AbortController\(\)/);
  assert.match(js, /controller\.abort\(\)/);
  assert.match(js, /window\.clearTimeout\(timer\)/);
  assert.match(js, /retry\.hidden = false/);
  assert.match(js, /\$\("retry-catalog"\)\.addEventListener\("click", initialize\)/);
  assert.match(html, /id="retry-catalog"[^>]*hidden/);
  assert.match(css, /\.catalog-recovery \[hidden\]\{display:none!important\}/);
});

test("não apresenta aprovação quando o relatório está ausente ou não coincide", () => {
  assert.match(js, /state\.validated = verifyRelease\(/);
  assert.match(js, /state\.validated = false/);
  assert.match(js, /edição é editorial e não equivale a uma certificação/);
  assert.match(js, /catalogBase\.origin/);
});

test("ícones e capturas registam o tratamento de erro antes de carregar a imagem", () => {
  const imgBlock = js.slice(js.indexOf('const img = document.createElement("img")'),
                            js.indexOf('return wrap;'));
  assert.ok(imgBlock.indexOf('img.addEventListener("error"') < imgBlock.indexOf("img.src = src"));
  const coverBlock = js.slice(js.indexOf('const shot = document.createElement("img")'),
                              js.indexOf("cover.appendChild(shot)"));
  assert.ok(coverBlock.indexOf('shot.addEventListener("error"') < coverBlock.indexOf("shot.src = screenshotURL"));
});
