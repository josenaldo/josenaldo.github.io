/**
 * remark-code-meta — leva o meta da cerca de código adiante.
 *
 *     ```java title="NotificationService.java" showLineNumbers {6}
 *
 * Sem isto, nada do meta sobrevive: o `remark-rehype` não copia `code.meta`
 * do mdast para o hast, então o rehype-prism-plus (que lê
 * `data.meta || properties.metastring`) nunca vê `showLineNumbers` nem o
 * `{6}`, e o título não tem onde aparecer.
 *
 * Roda no REMARK, e não no rehype, exatamente por isso — na etapa rehype o
 * dado já se perdeu. A versão do handoff era um plugin rehype e, com este
 * pipeline (react-markdown), não recebia nada.
 *
 * Escreve em `data.hProperties`, que o remark-rehype transforma em atributos
 * do `<code>`:
 *   - `metastring` — consumido pelo rehype-prism-plus;
 *   - `data-title` — lido pelo CodeBlock para o rótulo da barra de cima.
 *
 * Origem: handoff/handoff-site/code/rehype-code-meta.mjs, no projeto do Claude
 * Design, portado de rehype para remark.
 */

import { visit } from 'unist-util-visit'

const TITLE = /title="([^"]*)"|title='([^']*)'/

export default function remarkCodeMeta() {
    return (tree) => {
        visit(tree, 'code', (node) => {
            const meta = node.meta ?? ''
            if (!meta) return

            node.data = node.data || {}
            node.data.hProperties = node.data.hProperties || {}
            node.data.hProperties.metastring = meta

            const title = meta.match(TITLE)
            if (title) {
                node.data.hProperties['data-title'] = title[1] ?? title[2]
            }

            if (/(^|\s)wrap(\s|$)/.test(meta)) {
                node.data.hProperties['data-wrap'] = 'true'
            }
        })
    }
}
