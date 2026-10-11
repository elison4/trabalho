// Gera o README.md preenchendo automaticamente os resultados reais do Stryker
// (lê reports/antes/mutation.json e reports/depois/mutation.json).
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const ler = (p) => JSON.parse(fs.readFileSync(path.join(raiz, p), "utf8"));

function resumo(relatorio) {
    const c = { Killed: 0, Timeout: 0, Survived: 0, NoCoverage: 0, outros: 0 };
    const sobreviventes = [];
    for (const [arquivo, dados] of Object.entries(relatorio.files)) {
        const linhasFonte = dados.source.split("\n");
        for (const m of dados.mutants) {
            if (m.status in c) c[m.status]++;
            else c.outros++;
            if (m.status === "Survived" || m.status === "NoCoverage") {
                const linha = m.location.start.line;
                let metodo = "(fora de método)";
                for (let i = linha - 1; i >= 0; i--) {
                    const r = linhasFonte[i].match(/^\s{4}(\w+)\(.*\)\s*\{/);
                    if (r) { metodo = r[1]; break; }
                }
                sobreviventes.push({
                    metodo,
                    linha,
                    mutador: m.mutatorName,
                    original: linhasFonte[linha - 1].trim(),
                    status: m.status === "NoCoverage" ? "sem cobertura" : "sobreviveu",
                });
            }
        }
    }
    const mortos = c.Killed + c.Timeout;
    const vivos = c.Survived + c.NoCoverage;
    const total = mortos + vivos;
    const score = total === 0 ? 0 : (100 * mortos) / total;
    return { ...c, mortos, vivos, total, score, sobreviventes };
}

const antes = resumo(ler("reports/antes/mutation.json"));
const depois = resumo(ler("reports/depois/mutation.json"));
const f = (n) => n.toFixed(2).replace(".", ",") + "%";

function tabelaSobreviventes(lista) {
    if (lista.length === 0) return "_Nenhum mutante sobreviveu._\n";
    let t = "| Método | Linha | Tipo de mutação | Trecho original | Situação |\n|---|---|---|---|---|\n";
    for (const s of lista) {
        t += `| \`${s.metodo}\` | ${s.linha} | ${s.mutador} | \`${s.original.replace(/\|/g, "\\|")}\` | ${s.status} |\n`;
    }
    return t;
}

const readme = `# Mutation Testing com Stryker - Classe Estoque

Trabalho baseado no primeiro trabalho de testes unitários (Jest) da classe \`Estoque\`,
agora aplicando **mutation testing** com o [Stryker Mutator](https://stryker-mutator.io/).

## Estrutura

\`\`\`
src/estoque.js                    # classe Estoque (código testado)
test/estoque.original.test.js     # 16 testes originais (primeiro trabalho)
test/estoque.novos.test.js        # 66 testes novos, criados para matar mutantes
stryker.antes.config.json         # Stryker rodando só os testes originais
stryker.config.json               # Stryker rodando todos os testes
reports/antes/mutation.html       # relatório "antes"
reports/depois/mutation.html      # relatório "depois"
\`\`\`

## Como executar

\`\`\`bash
npm install
npm test                # testes unitários (Jest)
npm run mutation:antes  # Stryker só com os testes originais
npm run mutation        # Stryker com todos os testes
\`\`\`

## O que é mutation testing

O Stryker altera o código-fonte automaticamente (cria "mutantes"), por exemplo trocando
\`<=\` por \`<\`, \`&&\` por \`||\` ou \`true\` por \`false\`, e roda os testes de novo.

- Se algum teste falha, o mutante foi **morto** (bom: os testes detectaram a alteração).
- Se todos os testes passam, o mutante **sobreviveu** (ruim: falta um teste).

O **mutation score** é a porcentagem de mutantes mortos.

## Resultado

| | Antes (16 testes) | Depois (82 testes) |
|---|---|---|
| Mutation score | **${f(antes.score)}** | **${f(depois.score)}** |
| Total de mutantes | ${antes.total} | ${depois.total} |
| Mortos | ${antes.mortos} | ${depois.mortos} |
| Sobreviventes | ${antes.Survived} | ${depois.Survived} |
| Sem cobertura | ${antes.NoCoverage} | ${depois.NoCoverage} |

Relatórios completos do Stryker: [antes](reports/antes/mutation.html) e [depois](reports/depois/mutation.html).

### Diagnóstico dos testes originais

Os testes originais cobriam apenas o "caminho feliz" de 16 dos 20 métodos. Os métodos
\`pesquisarProdutos\`, \`quantidadeTotalItens\`, \`limparEstoque\` e \`aplicarDesconto\` não tinham
nenhum teste, e nenhum método tinha teste para casos de erro ou valores limite.

### Mutantes que sobreviveram aos testes originais (${antes.vivos})

${tabelaSobreviventes(antes.sobreviventes)}
### Mutantes que ainda sobrevivem depois dos testes novos (${depois.vivos})

${tabelaSobreviventes(depois.sobreviventes)}
## Testes criados para matar os mutantes

| Método | Mutante (exemplo) | Teste criado |
|--------|-------------------|--------------|
| \`adicionarProduto\` | remover \`!produto\`, \`!produto.nome\`, \`preco < 0\`, \`quantidade < 0\` | produto nulo, sem nome, nome vazio, preço e quantidade negativos |
| \`adicionarProduto\` | \`preco < 0\` → \`preco <= 0\` | aceita preço 0 e quantidade 0 (limite) |
| \`removerProduto\` | \`index === -1\` → \`!== -1\` ou \`false\` | remover produto inexistente retorna \`false\`; remover um entre vários mantém os demais |
| \`buscarProduto\` | \`p.nome === nome\` → \`true\` | busca o segundo item entre vários; produto inexistente retorna \`null\` |
| \`produtoExiste\` | \`some\` sempre \`true\` | produto inexistente retorna \`false\` |
| \`adicionarEstoque\` | \`quantidade <= 0\` → \`< 0\` | quantidade 0 retorna \`false\`; negativa retorna \`false\`; 1 unidade funciona |
| \`retirarEstoque\` | \`produto.quantidade < quantidade\` → \`<=\` | retirar exatamente o disponível (limite) e retirar mais do que existe |
| \`retirarEstoque\` | remover validações | produto inexistente, quantidade 0 e negativa |
| \`consultarQuantidade\` | retorno \`0\` → outro valor | produto inexistente retorna \`0\` |
| \`alterarPreco\` | \`novoPreco < 0\` → \`<= 0\` | preço 0 aceito, preço negativo rejeitado e preço antigo mantido |
| \`calcularValorProduto\` | \`return 0\` alterado | produto inexistente e quantidade 0 |
| \`calcularValorTotal\` | \`+\` → \`-\`, \`*\` → \`/\` | estoque vazio e produto único |
| \`listarProdutos\` | \`[...]\` → \`[]\` | lista vazia e verificação de que retorna cópia |
| \`estoqueVazio\` | \`=== 0\` → \`!== 0\` | retorna \`false\` com produtos |
| \`estoqueBaixo\` | \`<=\` → \`<\` | quantidade igual ao limite (5), acima do limite e limite personalizado |
| \`listarEstoqueBaixo\` | \`<=\` → \`<\` | quantidade no limite incluída, acima excluída, nenhum baixo |
| \`buscarPorPreco\` | \`>=\` → \`true\`, \`<=\` → \`true\` | produtos abaixo do mínimo e acima do máximo; preços exatos nos limites |
| \`pesquisarProdutos\` | remover \`toLowerCase\` | texto em maiúsculas, nome em maiúsculas, texto parcial, sem resultado |
| \`quantidadeTotalItens\` | \`+\` → \`-\` | soma de vários produtos e estoque vazio |
| \`limparEstoque\` | \`return true\` → \`false\` | estoque fica vazio e aceita novos produtos |
| \`aplicarDesconto\` | \`1 - p/100\` → \`1 + p/100\`, limites 0 e 100 | 10% e 50% de desconto, 0%, 100%, negativo, acima de 100, inexistente |

## Conclusão

O mutation testing mostrou que executar o código não significa testá-lo bem. Os testes
originais passavam por quase todas as linhas, mas verificavam só o caminho feliz, e por isso
${antes.vivos} mutantes sobreviveram. Depois de criar testes para casos de erro, valores limite
e para os quatro métodos que não tinham teste, o mutation score passou de ${f(antes.score)}
para ${f(depois.score)}.

**Autor:** Elison Miller
`;

fs.writeFileSync(path.join(raiz, "README.md"), readme);
console.log(`README.md gerado. Score antes: ${f(antes.score)} | depois: ${f(depois.score)}`);
