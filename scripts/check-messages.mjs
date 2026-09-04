// Trava a paridade entre `src/messages/en.json` e `src/messages/pt.json`:
// mesmas chaves dos dois lados e mesmos placeholders de interpolação dentro
// de cada par de strings. Existe porque a localização do PT reescreve essas
// strings uma a uma, e uma chave perdida some silenciosamente da tela
// enquanto um `{days}` traduzido para `{dias}` quebra a interpolação do
// next-intl em runtime — os dois erros passam pelo `next build`.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export function achatar(objeto, prefixo = '', mapa = new Map()) {
    for (const [chave, valor] of Object.entries(objeto)) {
        const caminho = prefixo ? `${prefixo}.${chave}` : chave
        if (valor !== null && typeof valor === 'object') {
            achatar(valor, caminho, mapa)
        } else {
            mapa.set(caminho, valor)
        }
    }

    return mapa
}

export function placeholders(texto) {
    if (typeof texto !== 'string') return []

    return [...texto.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort()
}

export function comparar(en, pt) {
    const mapaEn = achatar(en)
    const mapaPt = achatar(pt)

    const faltando = [...mapaEn.keys()].filter((k) => !mapaPt.has(k))
    const sobrando = [...mapaPt.keys()].filter((k) => !mapaEn.has(k))
    const divergentes = []

    for (const [chave, valor] of mapaEn) {
        if (!mapaPt.has(chave)) continue
        const a = placeholders(valor)
        const b = placeholders(mapaPt.get(chave))
        if (a.join(',') !== b.join(',')) {
            divergentes.push({ chave, en: a, pt: b })
        }
    }

    return { faltando, sobrando, divergentes }
}

function main() {
    const en = JSON.parse(readFileSync('src/messages/en.json', 'utf8'))
    const pt = JSON.parse(readFileSync('src/messages/pt.json', 'utf8'))
    const { faltando, sobrando, divergentes } = comparar(en, pt)

    if (faltando.length || sobrando.length || divergentes.length) {
        console.error('check-messages FALHOU:')
        for (const k of faltando) console.error(`  - faltando em pt.json: ${k}`)
        for (const k of sobrando) console.error(`  - sobrando em pt.json: ${k}`)
        for (const d of divergentes) {
            console.error(
                `  - placeholders divergentes em ${d.chave}: en=[${d.en}] pt=[${d.pt}]`
            )
        }
        console.error(
            'As mensagens PT precisam ter exatamente as mesmas chaves que as EN e ' +
                'preservar os placeholders de interpolação do next-intl. Traduzir o nome ' +
                'de um placeholder quebra a interpolação em runtime sem quebrar o build.'
        )
        process.exit(1)
    }

    console.log(
        `check-messages OK — ${achatar(en).size} chaves em paridade entre en.json e pt.json.`
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
