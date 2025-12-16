import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const distDir = path.resolve(repoRoot, 'dist');

function readArgValue(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const inputHtmlPath = path.resolve(distDir, readArgValue('--in') ?? 'index.html');
const outputHtmlPath = path.resolve(distDir, readArgValue('--out') ?? 'silent-scream.html');

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

function resolveDistFile(urlPath) {
  const cleaned = urlPath.replace(/^[./]+/, '').replace(/^\/+/, '');
  return path.resolve(distDir, cleaned);
}

function extractAttr(tag, attrName) {
  const re = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`, 'i');
  return tag.match(re)?.[1] ?? null;
}

function escapeInlineScriptText(js) {
  return js.replace(/<\/script>/gi, '<\\/script>');
}

function escapeInlineStyleText(css) {
  return css.replace(/<\/style>/gi, '<\\/style>');
}

let html = await fs.readFile(inputHtmlPath, 'utf8');

html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, '');

html = await (async () => {
  const stylesheetLinkRe = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const matches = [...html.matchAll(stylesheetLinkRe)];
  let result = html;

  for (const match of matches) {
    const tag = match[0];
    const href = extractAttr(tag, 'href');
    if (!href || isExternalUrl(href)) continue;

    const cssPath = resolveDistFile(href);
    const css = escapeInlineStyleText(await fs.readFile(cssPath, 'utf8'));
    result = result.replace(tag, () => `<style>\n${css}\n</style>`);
  }

  return result;
})();

html = await (async () => {
  const scriptWithSrcRe =
    /<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi;
  const matches = [...html.matchAll(scriptWithSrcRe)];
  let result = html;

  for (const match of matches) {
    const fullTag = match[0];
    const beforeSrcAttrs = match[1] ?? '';
    const src = match[2];
    const afterSrcAttrs = match[3] ?? '';
    if (!src || isExternalUrl(src)) continue;

    const jsPath = resolveDistFile(src);
    const js = escapeInlineScriptText(await fs.readFile(jsPath, 'utf8'));
    const preservedAttrs = `${beforeSrcAttrs}${afterSrcAttrs}`.trimEnd();
    result = result.replace(
      fullTag,
      () => `<script${preservedAttrs}>\n${js}\n</script>`
    );
  }

  return result;
})();

const leftovers = [
  /<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>/i,
  /<link\b[^>]*\bhref=["'][^"']+["'][^>]*>/i,
];

for (const re of leftovers) {
  const match = html.match(re);
  if (match) {
    throw new Error(
      `make-single-html: output still contains external references (${re}); first match: ${match[0]}`
    );
  }
}

await fs.writeFile(outputHtmlPath, html, 'utf8');
console.log(`Wrote ${path.relative(repoRoot, outputHtmlPath)}`);
