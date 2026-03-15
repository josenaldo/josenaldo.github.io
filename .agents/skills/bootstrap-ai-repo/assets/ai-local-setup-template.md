# Setup Local de IA

Este guia documenta configurações **locais** de ferramenta. Nem tudo aqui deve ser commitado no repositório.

## Política de aceite automático seguro

Pode ter aceite automático local quando a ferramenta suportar perfis de aprovação e quando o projeto concordar com isso:

- leitura de arquivos
- listagem de diretórios
- busca textual/semântica
- diff e inspeção de mudanças
- lint, typecheck, formatação
- testes locais
- build local
- comandos de diagnóstico sem efeito externo

Exigem aprovação explícita ou política separada:

- instalação/remoção de dependências
- migrações, seed, reset ou escrita em banco
- deploy, publish, release e `git push`
- alteração/criação de segredos
- escrita ampla fora do escopo pedido
- comandos destrutivos ou com efeito externo irreversível

## Claude Code

- Manter `CLAUDE.md` curto e referencial.
- Considerar compactação antecipada de contexto. Exemplo conhecido:

```json
{
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
```

- Se a versão da ferramenta suportar perfis de aprovação, mapear a política segura acima.
- Não versionar tokens, credenciais nem preferências pessoais de máquina.

## GitHub Copilot

- Centralizar contexto do projeto em `AGENTS.md`.
- Usar `.github/copilot-instructions.md` como camada específica.
- Usar `.github/instructions/**` apenas para segmentações onde `applyTo` agrega valor real.
- Preferir tasks/scripts do projeto para build, lint e testes em vez de comandos ad hoc.

## Sistema operacional e symlink

- Em Windows, links simbólicos podem exigir WSL, modo administrador ou configuração extra.
- Se symlink não for confiável para o time, usar espelho explícito e registrar risco de drift.

## Checklist local

- [ ] Ferramentas alvo instaladas e funcionando
- [ ] Política de aceite automático seguro aplicada
- [ ] Compactação/contexto revisado
- [ ] Comandos oficiais do projeto testados localmente
- [ ] Nenhum segredo pessoal ficou versionado
