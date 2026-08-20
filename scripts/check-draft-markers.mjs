// Bloqueia a publicação enquanto existir conteúdo marcado como rascunho sob
// `content/` — hoje, a seção de termos contratuais da página /hiring
// (`content/pages/{en,pt}/hiring-terms.md`), que só o dono do site pode
// escrever, porque são os termos que ele vai cumprir.
//
// Roda só no workflow do GitHub Pages (.github/workflows/nextjs.yml), antes
// do passo de build — nunca no `yarn build` local nem na branch `dev`. O
// marcador precisa poder viver ali enquanto o texto não é escrito; se esta
// checagem travasse o build local, ela travaria o trabalho em vez de
// proteger a publicação. Mesma decisão de fronteira que `verify-cv-links.mjs`
// (checagem de rede fora do build) e `verify-alternates.mjs` (dentro do
// postbuild, não do build).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIRETORIO = 'content'
const MARCADOR = 'a escrever pelo dono do site'

function walk(dir) {
    const out = []
    if (!existsSync(dir)) return out

    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else out.push(full)
    }

    return out
}

function main() {
    const achados = []

    for (const file of walk(DIRETORIO)) {
        const content = readFileSync(file, 'utf8')
        if (content.includes(MARCADOR)) achados.push(file)
    }

    if (achados.length > 0) {
        console.error('check-draft-markers FALHOU:')
        for (const file of achados) console.error(`  - ${file}`)
        console.error(
            'Existe uma seção de termos contratuais da página /hiring ainda não escrita ' +
                '(o que "part-time", "sem horário fixo" e "sem exclusividade" significam de fato). ' +
                'Só o dono do site pode escrevê-la — são os termos que ele vai cumprir, e publicar ' +
                'a página com essa seção pela metade prometeria em público o que não está decidido. ' +
                'Para destravar: escreva a seção nos arquivos acima, no lugar do comentário ' +
                '`<!-- termos-contratuais: a escrever pelo dono do site -->`, remova o comentário, ' +
                'e faça push para `main` de novo.'
        )
        process.exit(1)
    }

    console.log(
        'check-draft-markers OK — nenhum marcador de rascunho em content/.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
