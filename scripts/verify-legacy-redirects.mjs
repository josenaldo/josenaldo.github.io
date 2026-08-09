import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Verificação cruzada do Step 8 das Notas do controlador (Task 7): para cada
// stub gerado, o destino do meta refresh precisa existir de fato no `out/`.
// Considera o formato flat do export (trailingSlash: false): `/en/about`
// vira `out/en/about.html`, e a raiz de locale `/en` vira `out/en.html`.
const OUT_DIR = 'out'

function findStubFiles(dir) {
    const found = []
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        const stat = statSync(full)
        if (stat.isDirectory()) {
            found.push(...findStubFiles(full))
        } else if (entry === 'index.html') {
            const content = readFileSync(full, 'utf-8')
            if (
                content.includes('noindex') &&
                content.includes('http-equiv="refresh"')
            ) {
                found.push(full)
            }
        }
    }
    return found
}

function destinationToOutPath(destination) {
    // destination é algo como /en, /en/about, /pt/blog/slug
    const trimmed = destination.replace(/^\//, '')
    return join(OUT_DIR, `${trimmed}.html`)
}

const stubFiles = findStubFiles(OUT_DIR)
const broken = []

for (const stubFile of stubFiles) {
    const content = readFileSync(stubFile, 'utf-8')
    const match = content.match(/url=([^"]+)/)
    if (!match) {
        broken.push(`${stubFile}: sem destino no meta refresh`)
        continue
    }
    const destination = match[1]
    const expectedFile = destinationToOutPath(destination)
    if (!existsSync(expectedFile)) {
        broken.push(
            `${stubFile} -> ${destination} (esperado ${expectedFile}, não existe)`
        )
    }
}

console.log(`stubs encontrados: ${stubFiles.length}`)
if (broken.length > 0) {
    console.log(`QUEBRADOS ${broken.length}:`)
    broken.forEach((b) => console.log(`  - ${b}`))
    process.exit(1)
}
console.log('ok: todos os stubs apontam para arquivos existentes em out/')
