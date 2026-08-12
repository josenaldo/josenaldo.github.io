import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const VALID_CONFIDENCE = ['measured', 'counted', 'remembered']
const DIRETORIOS = ['src', 'docs/positioning', 'content']

// Arquivos que colidem por acaso com uma variante aposentada, sem citar a
// métrica que ela descreve. Nunca usar isto para afrouxar a lista de
// aposentados — só para colisão de substring comprovadamente não relacionada.
const EXCECOES = [
    // Post sobre economia de tokens do RTK: "70-95%" e "60-90%" são faixas de
    // economia por comando do RTK, não o "-90%"/"-95%" aposentado (que era
    // sobre incidentes de produção do MedEspecialista). Colisão de substring.
    'content/blog/pt/rtk-economia-tokens-claude-code.md',
]

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

function checkRetiredNumbers(variantes) {
    const files = DIRETORIOS.flatMap(walk).filter(
        (file) => file !== 'src/data/retired.json' && !EXCECOES.includes(file)
    )

    for (const file of files) {
        const content = readFileSync(file, 'utf8')
        for (const { variante, motivo } of variantes) {
            if (content.includes(variante)) {
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
        if (!('note' in metric)) {
            errors.push(`metrics.${key}: campo note ausente (use null)`)
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
