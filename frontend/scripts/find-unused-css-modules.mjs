import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), 'frontend', 'src')

/** Recursively list files */
function listFiles(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...listFiles(p))
    else out.push(p)
  }
  return out
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch {
    return null
  }
}

const allFiles = listFiles(ROOT)

const cssModuleFiles = allFiles.filter(f => f.endsWith('.module.css'))
const codeFiles = allFiles.filter(
  f =>
    f.endsWith('.ts') ||
    f.endsWith('.tsx') ||
    f.endsWith('.js') ||
    f.endsWith('.jsx') ||
    f.endsWith('.mdx')
)

function resolveRelativeImport(fromFile, spec) {
  if (!spec.startsWith('.')) return null
  const base = path.join(path.dirname(fromFile), spec)
  const normalized = path.normalize(base)
  return normalized.endsWith('.module.css') ? normalized : `${normalized}.module.css`
}

/** cssAbsPath -> importer files */
const cssToImporters = new Map()
const importRe = /from\s+['"]([^'"]+\.module\.css)['"]/g

for (const f of codeFiles) {
  const c = readFileSafe(f)
  if (!c) continue
  let m
  while ((m = importRe.exec(c))) {
    const resolved = resolveRelativeImport(f, m[1])
    if (!resolved || !fs.existsSync(resolved)) continue
    if (!cssToImporters.has(resolved)) cssToImporters.set(resolved, [])
    cssToImporters.get(resolved).push(f)
  }
}

// Preload code into a single string to enable fast substring checks.
const codeConcat = codeFiles
  .map(f => readFileSafe(f) ?? '')
  .join('\n/* --- FILE BREAK --- */\n')

function extractClassNames(css) {
  // Very conservative: capture ".foo" selectors where foo matches CSS module class naming.
  // Excludes ".foo-bar", ".foo_bar", ".foo123" etc. We capture full token until a non-identifier char.
  const re = /\.([A-Za-z_][A-Za-z0-9_-]*)/g
  const names = new Set()
  let m
  while ((m = re.exec(css))) {
    const name = m[1]
    // Skip obvious non-module/global patterns
    if (name === 'global') continue
    names.add(name)
  }
  return [...names].sort()
}

function hasDynamicStylesAccess(tsContent) {
  // If file uses styles[something] or clsx with computed keys, we avoid aggressive deletions.
  return /\bstyles\s*\[/.test(tsContent)
}

const results = []

for (const cssFile of cssModuleFiles) {
  const css = readFileSafe(cssFile)
  if (!css) continue

  const classes = extractClassNames(css)
  if (classes.length === 0) continue

  const relFromSrc = path.relative(ROOT, cssFile).split(path.sep).join('/')
  const importers = cssToImporters.get(cssFile) ?? []

  const importerConcat = importers.map(f => readFileSafe(f) ?? '').join('\n')
  const dynamic = hasDynamicStylesAccess(importerConcat)

  const unused = []
  for (const cls of classes) {
    // Usage patterns:
    // - styles.foo
    // - styles['foo']
    // - " foo " in className string is NOT reliable for CSS modules; ignore.
    const dotNeedle = `styles.${cls}`
    const brNeedle1 = `styles['${cls}']`
    const brNeedle2 = `styles["${cls}"]`

    const usedInImporters =
      importerConcat.includes(dotNeedle) ||
      importerConcat.includes(brNeedle1) ||
      importerConcat.includes(brNeedle2)

    // Also allow usage anywhere in codebase as a fallback (rare, but keeps it safer).
    const usedAnywhere =
      codeConcat.includes(dotNeedle) || codeConcat.includes(brNeedle1) || codeConcat.includes(brNeedle2)

    if (!usedInImporters && !usedAnywhere) unused.push(cls)
  }

  if (unused.length) {
    results.push({
      file: cssFile,
      rel: relFromSrc,
      unused,
      importers: importers.map(f => path.relative(ROOT, f).split(path.sep).join('/')),
      dynamic,
    })
  }
}

results.sort((a, b) => a.rel.localeCompare(b.rel))

process.stdout.write(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      root: ROOT,
      totalCssModules: cssModuleFiles.length,
      filesWithUnused: results.length,
      results,
    },
    null,
    2
  ) + '\n'
)

