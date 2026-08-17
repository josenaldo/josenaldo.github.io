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
