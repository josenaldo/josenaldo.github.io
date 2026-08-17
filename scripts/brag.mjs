import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

import { parse } from 'yaml'

// Extrai o bloco YAML que segue o cabeçalho "## Métricas". Qualquer outro
// bloco de código da nota é prosa — a seção de Evidência costuma ter shell.
const BLOCO_METRICAS = /^##\s+Métricas\s*$[\s\S]*?```yaml\n([\s\S]*?)```/m
const FRONTMATTER = /^---\n([\s\S]*?)\n---/

export function parseBrag(texto, caminho) {
    const fm = texto.match(FRONTMATTER)
    if (!fm) throw new Error(`${caminho}: frontmatter ausente`)

    let frontmatter
    try {
        frontmatter = parse(fm[1]) ?? {}
    } catch (error) {
        throw new Error(`${caminho}: frontmatter inválido — ${error.message}`)
    }

    const bloco = texto.match(BLOCO_METRICAS)
    if (!bloco) return { frontmatter, metricas: [] }

    let metricas
    try {
        metricas = parse(bloco[1])
    } catch (error) {
        throw new Error(
            `${caminho}: bloco de métricas inválido — ${error.message}`
        )
    }

    if (!Array.isArray(metricas)) {
        throw new Error(`${caminho}: o bloco de métricas precisa ser uma lista`)
    }

    return { frontmatter, metricas }
}

const APOSENTADOS = 'Numeros aposentados.md'

export function agregar(notas) {
    const raiz = notas.find((n) => n.engagement === '' && n.ehIndice)
    if (!raiz)
        throw new Error('Brag/index.md ausente — sem ele não há biografia')

    const notaAposentados = notas.find((n) => n.caminho.endsWith(APOSENTADOS))
    if (!notaAposentados) {
        throw new Error(
            `Brag/${APOSENTADOS} ausente — sem ele não há garantia de que valores aposentados de métricas continuam registrados; se o vault é novo, declare a lista vazia explicitamente no arquivo em vez de omiti-lo`
        )
    }
    const retired = notaAposentados.metricas

    const metrics = {}
    const withheld = []
    const engagements = []

    for (const n of notas) {
        if (n.engagement === '') continue
        if (n.caminho.endsWith(APOSENTADOS)) continue

        if (n.ehIndice) {
            if (n.frontmatter.retido === true) {
                throw new Error(
                    `${n.caminho}: retido: true não é válido em index.md de engagement — retenção se aplica a notas de conquista, não ao engagement inteiro; esconder o engagement inteiro é funcionalidade que ainda não existe e precisa ser desenhada, não improvisada`
                )
            }

            engagements.push({
                id: n.frontmatter.id,
                titulo: n.frontmatter.titulo,
                inicio: n.frontmatter.inicio ?? '',
            })
        }

        if (n.frontmatter.retido === true) {
            withheld.push({
                id: n.frontmatter.id ?? basename(n.caminho, '.md'),
                titulo: n.frontmatter.title ?? n.frontmatter.titulo,
                motivo: n.frontmatter.motivo,
                gatilho: n.frontmatter.gatilho,
            })
            continue
        }

        for (const m of n.metricas) {
            metrics[m.id] = { ...m, engagement: n.engagement }
        }
    }

    engagements.sort((a, b) => b.inicio.localeCompare(a.inicio))

    const updated = notas
        .map((n) => n.frontmatter.updated)
        .filter(Boolean)
        .sort()
        .pop()

    return {
        updated,
        biography: {
            careerStartYear: raiz.frontmatter.careerStartYear,
            siteLaunchYear: raiz.frontmatter.siteLaunchYear,
        },
        engagements: engagements.map(({ id, titulo }) => ({ id, titulo })),
        metrics,
        withheld,
        retired,
    }
}

export function validarArvore(notas) {
    const erros = []
    const donoDaMetrica = new Map()
    const pastasComIndice = new Set(
        notas
            .filter((n) => n.ehIndice && n.engagement !== '')
            .map((n) => n.engagement)
    )
    const pastasSemIndiceReportadas = new Set()

    for (const n of notas) {
        if (n.engagement === '') continue

        if (
            !pastasComIndice.has(n.engagement) &&
            !pastasSemIndiceReportadas.has(n.engagement)
        ) {
            pastasSemIndiceReportadas.add(n.engagement)
            erros.push(`pasta "${n.engagement}" não tem index.md`)
        }

        const declarado = n.frontmatter.engagement
        if (!n.ehIndice && declarado && declarado !== n.engagement) {
            erros.push(
                `${n.caminho}: frontmatter declara engagement "${declarado}" mas o arquivo está em "${n.engagement}"`
            )
        }

        if (n.frontmatter.retido === true && !n.frontmatter.gatilho) {
            erros.push(`${n.caminho}: nota retida precisa de campo gatilho`)
        }

        for (const m of n.metricas) {
            const anterior = donoDaMetrica.get(m.id)
            if (anterior) {
                erros.push(
                    `métrica "${m.id}" declarada em dois lugares: ${anterior} e ${n.caminho}`
                )
            } else {
                donoDaMetrica.set(m.id, n.caminho)
            }
        }
    }

    return erros
}

export function lerArvore(raizDir) {
    const notas = []

    function visitar(dir, engagement, profundidade) {
        for (const entrada of readdirSync(dir).sort()) {
            const cheio = join(dir, entrada)
            if (statSync(cheio).isDirectory()) {
                if (profundidade >= 1) {
                    throw new Error(
                        `${cheio}: pasta aninhada além de um nível não é suportada — a estrutura esperada é Brag/<engagement>/<nota>.md (dois níveis)`
                    )
                }
                visitar(cheio, entrada, profundidade + 1)
                continue
            }
            if (!entrada.endsWith('.md')) continue

            const { frontmatter, metricas } = parseBrag(
                readFileSync(cheio, 'utf8'),
                cheio
            )
            notas.push({
                caminho: cheio,
                engagement,
                ehIndice: entrada === 'index.md',
                frontmatter,
                metricas,
            })
        }
    }

    visitar(raizDir, '', 0)

    return notas
}
