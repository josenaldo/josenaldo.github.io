# Posicionamento

A fonte da copy e do tom do site. Quem for escrever qualquer texto visível ao usuário começa aqui.

| Arquivo | Governa |
| --- | --- |
| `voice.md` | Tom, humor, pessoa verbal e a lista do que é proibido. Precede os outros dois: se a copy contraria a voz, a copy está errada. |
| `copy.en.md` | Copy canônica em inglês, seção por seção da home, mais modos de trabalho e engagements. É de onde as mensagens `en` são populadas. |
| `copy.pt.md` | Versão em português. Pareia com o arquivo EN por número e ordem de seção — as mesmas nove seções numeradas mais `## Work modes`/`## Modos de trabalho` e `## Engagements`, na mesma sequência; o texto do cabeçalho é traduzido junto com a prosa. Os números são os mesmos; construção de frase e piadas são autorais, não traduzidas. |

**Números não moram aqui.** Toda métrica de resultado citada vem de `src/data/metrics.mjs`, cuja fonte a montante é a nota `Métricas Canônicas` no vault `codex-technomanticus-apocrypha`. Métrica de resultado é o que mudou por causa do trabalho; número que descreve o termo da oferta ("uma reunião por mês") ou ordem de grandeza sem registro recuperável ("centenas de e-mails por semana") não é métrica e fica na prosa. `npm run check:metrics` falha se um número aposentado aparecer nestes arquivos.

**Ordem de precedência quando houver conflito:** nota canônica do vault → `src/data/metrics.mjs` → `voice.md` → `copy.en.md` → `copy.pt.md` → componente.
