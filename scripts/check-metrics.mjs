import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VALID_CONFIDENCE = ['measured', 'counted', 'remembered']
const DIRETORIOS = ['src', 'docs/positioning', 'content']

// Arquivos que citam de propósito um número já aposentado — ex.: um post de
// blog contando a história de como o número mudou. Isto NUNCA é para
// colisão de substring (um número real que por acaso contém a variante,
// como "60-90%" contendo "-90%"): essa colisão se resolve na fronteira de
// dígito em `containsRetiredVariant`, não aqui. Isentar o arquivo inteiro
// por colisão acidental cria um ponto cego permanente — se o arquivo um dia
// citar de verdade um número aposentado, a guarda fica muda.
const EXCECOES = []

const errors = []

function walk(dir) {
    const out = []
    if (!existsSync(dir)) return out

    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else if (/\.(js|jsx|mjs|json|md)$/.test(entry)) out.push(full)
    }

    return out
}

function isDigit(char) {
    return char !== undefined && char >= '0' && char <= '9'
}

// Uma variante aposentada "bate" só quando não está colada a um dígito de
// nenhum dos dois lados — senão "60-90%" acusaria por conter "-90%", e
// "16 autores" acusaria por conter "6 autores". O dígito à esquerda cobre o
// caso observado (número maior engolindo o aposentado por trás); o dígito à
// direita cobre o espelho (ex.: um "5.000+" dentro de um número maior à
// frente), que não apareceu nos dados atuais mas é a mesma classe de erro —
// então a fronteira é simétrica por construção, não só pelo caso visto.
export function containsRetiredVariant(content, variante) {
    let from = 0
    while (true) {
        const idx = content.indexOf(variante, from)
        if (idx === -1) return false
        const before = content[idx - 1]
        const after = content[idx + variante.length]
        if (!isDigit(before) && !isDigit(after)) return true
        from = idx + 1
    }
}

function checkRetiredNumbers(variantes) {
    const files = DIRETORIOS.flatMap(walk).filter(
        (file) => file !== 'src/data/retired.json' && !EXCECOES.includes(file)
    )

    for (const file of files) {
        const content = readFileSync(file, 'utf8')
        for (const { variante, motivo } of variantes) {
            if (containsRetiredVariant(content, variante)) {
                errors.push(
                    `${file}: número aposentado "${variante}" — ${motivo}`
                )
            }
        }
    }
}

function checkLado(key, nome, lado) {
    if (lado === null) return
    if (!VALID_CONFIDENCE.includes(lado.confidence)) {
        errors.push(
            `metrics.${key}.${nome}: confidence "${lado.confidence}" inválida`
        )
    }
}

function checkShape(metrics) {
    for (const [key, metric] of Object.entries(metrics)) {
        if (metric.id !== key) {
            errors.push(`metrics.${key}: id "${metric.id}" difere da chave`)
        }
        if (typeof metric.engagement !== 'string' || !metric.engagement) {
            errors.push(`metrics.${key}: engagement ausente`)
        }
        if (metric.before === null && metric.after === null) {
            errors.push(`metrics.${key}: before e after ambos nulos`)
        }
        checkLado(key, 'before', metric.before ?? null)
        checkLado(key, 'after', metric.after ?? null)
    }
}

function checkGerado() {
    const fonte = readFileSync('src/data/metrics.mjs', 'utf8')
    if (!fonte.startsWith('// ARQUIVO GERADO')) {
        errors.push(
            'src/data/metrics.mjs perdeu o cabeçalho de arquivo gerado — foi editado à mão?'
        )
    }
}

async function main() {
    const retired = JSON.parse(readFileSync('src/data/retired.json', 'utf8'))
    const variantes = retired.entradas.flatMap(({ motivo, variantes }) =>
        variantes.map((variante) => ({ variante, motivo }))
    )

    const { default: metrics } = await import('../src/data/metrics.mjs')
    checkGerado()
    checkShape(metrics)
    checkRetiredNumbers(variantes)

    if (errors.length > 0) {
        console.error('check-metrics FALHOU:')
        for (const error of errors) console.error(`  - ${error}`)
        process.exit(1)
    }

    console.log(
        `check-metrics OK — ${Object.keys(metrics).length} métricas válidas, ${variantes.length} variantes aposentadas, nenhuma encontrada.`
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
