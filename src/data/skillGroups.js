// Ordered list of skill groups.
//
// Cada grupo tinha uma cor de destaque (uma por card, borda colorida) antes
// da reformulação v2 — spec/03-paginas-internas.md §11 tira a cor: "nível de
// proficiência não vira barra nem estrela: se importa, vira ordem". A ordem
// dentro do grupo já vem de `firstContact` em getAllSkillsByCategory.
const skillGroups = [
    { group: 'Core Stack' },
    { group: 'Backend' },
    { group: 'Frontend' },
    { group: 'Databases' },
    { group: 'Architecture' },
    { group: 'Testing' },
    { group: 'AI & Productivity' },
    { group: 'DevOps & Tooling' },
    { group: 'Agile' },
    { group: 'Legacy & Enterprise Java' },
]

export default skillGroups
