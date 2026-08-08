import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const RETIRED = [
    '600%',
    '1h → 2min',
    '1h -> 2min',
    'one hour to about two minutes',
    '2 semanas → 1 semana',
    '1 release a cada 2 meses',
    'one release every two months',
    '1 release por semana',
    'one release per week',
    '−90%',
    '-90%',
    '−95%',
    '-95%',
    '5.000+',
    '5,000+',
    '7.000+',
    '7,000+',
    '3.000+',
    '3,000+',
    '6 autores',
    '6 authors',
]

const VALID_CONFIDENCE = ['measured', 'counted', 'remembered']

const errors = []

function walk(dir) {
    const out = []
    // docs/positioning/ só nasce na Task 2 — antes disso o diretório não existe.
    if (!existsSync(dir)) return out
    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else if (/\.(js|jsx|mjs|json|md)$/.test(entry)) out.push(full)
    }
    return out
}

function checkRetiredNumbers() {
    const files = [...walk('src'), ...walk('docs/positioning')]
    for (const file of files) {
        const content = readFileSync(file, 'utf8')
        for (const retired of RETIRED) {
            if (content.includes(retired)) {
                errors.push(`${file}: número aposentado "${retired}"`)
            }
        }
    }
}

function checkShape(metrics) {
    for (const [key, metric] of Object.entries(metrics)) {
        if (metric.id !== key) {
            errors.push(`metrics.${key}: id "${metric.id}" difere da chave`)
        }
        if (!VALID_CONFIDENCE.includes(metric.confidence)) {
            errors.push(
                `metrics.${key}: confidence "${metric.confidence}" inválida`
            )
        }
        if (typeof metric.engagement !== 'string' || !metric.engagement) {
            errors.push(`metrics.${key}: engagement ausente`)
        }
        if (metric.before === null && metric.after === null) {
            errors.push(`metrics.${key}: before e after ambos nulos`)
        }
        if (!('note' in metric)) {
            errors.push(`metrics.${key}: campo note ausente (use null)`)
        }
    }
}

const { default: metrics } = await import('../src/data/metrics.mjs')
checkShape(metrics)
checkRetiredNumbers()

if (errors.length > 0) {
    console.error('check-metrics FALHOU:')
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
}

console.log(
    `check-metrics OK — ${Object.keys(metrics).length} métricas válidas, nenhum número aposentado.`
)
