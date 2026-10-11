const Estoque = require("../src/estoque");


// ============================================================
// TESTES NOVOS (criados para matar mutantes sobreviventes)
// ============================================================

describe("adicionarProduto - validações e valores limite", () => {
    test("rejeita produto nulo", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto(null)).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("rejeita produto indefinido", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto(undefined)).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("rejeita produto sem nome", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ preco: 10, quantidade: 1 })).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("rejeita produto com nome vazio", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ nome: "", preco: 10, quantidade: 1 })).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("rejeita produto com preço negativo", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ nome: "Mouse", preco: -1, quantidade: 1 })).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("rejeita produto com quantidade negativa", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ nome: "Mouse", preco: 10, quantidade: -1 })).toBe(false);
        expect(estoque.contarProdutos()).toBe(0);
    });

    test("aceita produto com preço igual a zero (limite)", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ nome: "Brinde", preco: 0, quantidade: 1 })).toBe(true);
        expect(estoque.contarProdutos()).toBe(1);
    });

    test("aceita produto com quantidade igual a zero (limite)", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarProduto({ nome: "Mouse", preco: 10, quantidade: 0 })).toBe(true);
        expect(estoque.contarProdutos()).toBe(1);
    });

    test("guarda uma cópia do produto, sem manter referência ao objeto original", () => {
        const estoque = new Estoque();
        const produto = { nome: "Monitor", preco: 800, quantidade: 4 };

        estoque.adicionarProduto(produto);
        produto.quantidade = 999;

        expect(estoque.consultarQuantidade("Monitor")).toBe(4);
    });
});


describe("removerProduto - casos de falha", () => {
    test("retorna false ao remover produto inexistente e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.removerProduto("Teclado")).toBe(false);
        expect(estoque.contarProdutos()).toBe(1);
    });

    test("retorna false ao remover de um estoque vazio", () => {
        const estoque = new Estoque();

        expect(estoque.removerProduto("Mouse")).toBe(false);
    });

    test("remove somente o produto pedido e mantém os outros", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "A", preco: 1, quantidade: 1 });
        estoque.adicionarProduto({ nome: "B", preco: 2, quantidade: 2 });
        estoque.adicionarProduto({ nome: "C", preco: 3, quantidade: 3 });

        expect(estoque.removerProduto("B")).toBe(true);

        expect(estoque.contarProdutos()).toBe(2);
        expect(estoque.produtoExiste("A")).toBe(true);
        expect(estoque.produtoExiste("B")).toBe(false);
        expect(estoque.produtoExiste("C")).toBe(true);
    });
});


describe("buscarProduto e produtoExiste - casos de falha", () => {
    test("buscarProduto retorna null quando o produto não existe", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.buscarProduto("Teclado")).toBeNull();
    });

    test("buscarProduto encontra o produto correto entre vários", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "A", preco: 1, quantidade: 1 });
        estoque.adicionarProduto({ nome: "B", preco: 2, quantidade: 2 });

        expect(estoque.buscarProduto("B").preco).toBe(2);
    });

    test("produtoExiste retorna false quando o produto não existe", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.produtoExiste("Teclado")).toBe(false);
    });

    test("produtoExiste retorna false em estoque vazio", () => {
        const estoque = new Estoque();

        expect(estoque.produtoExiste("Mouse")).toBe(false);
    });
});


describe("adicionarEstoque - validações", () => {
    test("retorna false para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.adicionarEstoque("Mouse", 5)).toBe(false);
    });

    test("retorna false para quantidade zero e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.adicionarEstoque("Mouse", 0)).toBe(false);
        expect(estoque.consultarQuantidade("Mouse")).toBe(5);
    });

    test("retorna false para quantidade negativa e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.adicionarEstoque("Mouse", -3)).toBe(false);
        expect(estoque.consultarQuantidade("Mouse")).toBe(5);
    });

    test("aceita adicionar exatamente 1 unidade (limite)", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.adicionarEstoque("Mouse", 1)).toBe(true);
        expect(estoque.consultarQuantidade("Mouse")).toBe(6);
    });
});


describe("retirarEstoque - validações e limites", () => {
    test("retorna false para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.retirarEstoque("Mouse", 1)).toBe(false);
    });

    test("retorna false para quantidade zero e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.retirarEstoque("Mouse", 0)).toBe(false);
        expect(estoque.consultarQuantidade("Mouse")).toBe(5);
    });

    test("retorna false para quantidade negativa e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.retirarEstoque("Mouse", -2)).toBe(false);
        expect(estoque.consultarQuantidade("Mouse")).toBe(5);
    });

    test("retorna false ao retirar mais do que existe e não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.retirarEstoque("Mouse", 6)).toBe(false);
        expect(estoque.consultarQuantidade("Mouse")).toBe(5);
    });

    test("permite retirar exatamente a quantidade disponível (limite)", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.retirarEstoque("Mouse", 5)).toBe(true);
        expect(estoque.consultarQuantidade("Mouse")).toBe(0);
    });

    test("aceita retirar exatamente 1 unidade (limite)", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.retirarEstoque("Mouse", 1)).toBe(true);
        expect(estoque.consultarQuantidade("Mouse")).toBe(4);
    });
});


describe("consultarQuantidade - casos de falha", () => {
    test("retorna 0 para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.consultarQuantidade("Mouse")).toBe(0);
    });

    test("retorna 0 para produto existente com quantidade zero", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 0 });

        expect(estoque.consultarQuantidade("Mouse")).toBe(0);
    });
});


describe("alterarPreco - validações", () => {
    test("retorna false para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.alterarPreco("Mouse", 100)).toBe(false);
    });

    test("retorna false para preço negativo e mantém o preço antigo", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.alterarPreco("Mouse", -1)).toBe(false);
        expect(estoque.buscarProduto("Mouse").preco).toBe(50);
    });

    test("aceita preço igual a zero (limite)", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.alterarPreco("Mouse", 0)).toBe(true);
        expect(estoque.buscarProduto("Mouse").preco).toBe(0);
    });
});


describe("cálculos de valor - casos de borda", () => {
    test("calcularValorProduto retorna 0 para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.calcularValorProduto("Mouse")).toBe(0);
    });

    test("calcularValorProduto retorna 0 quando a quantidade é zero", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 0 });

        expect(estoque.calcularValorProduto("Mouse")).toBe(0);
    });

    test("calcularValorTotal retorna 0 para estoque vazio", () => {
        const estoque = new Estoque();

        expect(estoque.calcularValorTotal()).toBe(0);
    });

    test("calcularValorTotal soma preço x quantidade de um único produto", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 3 });

        expect(estoque.calcularValorTotal()).toBe(150);
    });
});


describe("listarProdutos, contarProdutos e estoqueVazio - casos de borda", () => {
    test("listarProdutos retorna lista vazia quando não há produtos", () => {
        const estoque = new Estoque();

        expect(estoque.listarProdutos()).toEqual([]);
    });

    test("listarProdutos retorna uma cópia: alterar a lista não altera o estoque", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        const lista = estoque.listarProdutos();
        lista.push({ nome: "Intruso", preco: 1, quantidade: 1 });

        expect(estoque.contarProdutos()).toBe(1);
    });

    test("contarProdutos retorna 0 para estoque vazio", () => {
        const estoque = new Estoque();

        expect(estoque.contarProdutos()).toBe(0);
    });

    test("estoqueVazio retorna false quando há produtos", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.estoqueVazio()).toBe(false);
    });

    test("estoqueVazio volta a ser true depois de remover o único produto", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });
        estoque.removerProduto("Mouse");

        expect(estoque.estoqueVazio()).toBe(true);
    });
});


describe("estoqueBaixo e listarEstoqueBaixo - limites", () => {
    test("estoqueBaixo retorna false para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.estoqueBaixo("Mouse")).toBe(false);
    });

    test("estoqueBaixo retorna true quando a quantidade é igual ao limite padrão (5)", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 5 });

        expect(estoque.estoqueBaixo("Mouse")).toBe(true);
    });

    test("estoqueBaixo retorna false quando a quantidade está acima do limite padrão", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 6 });

        expect(estoque.estoqueBaixo("Mouse")).toBe(false);
    });

    test("estoqueBaixo respeita um limite personalizado", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 10 });

        expect(estoque.estoqueBaixo("Mouse", 10)).toBe(true);
        expect(estoque.estoqueBaixo("Mouse", 9)).toBe(false);
    });

    test("listarEstoqueBaixo retorna lista vazia quando nenhum produto está baixo", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mouse", preco: 50, quantidade: 6 });

        expect(estoque.listarEstoqueBaixo()).toEqual([]);
    });

    test("listarEstoqueBaixo inclui quantidade igual ao limite e exclui a acima dele", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "No limite", preco: 10, quantidade: 5 });
        estoque.adicionarProduto({ nome: "Acima", preco: 10, quantidade: 6 });

        const resultado = estoque.listarEstoqueBaixo();

        expect(resultado).toHaveLength(1);
        expect(resultado[0].nome).toBe("No limite");
    });

    test("listarEstoqueBaixo respeita um limite personalizado", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "A", preco: 10, quantidade: 8 });
        estoque.adicionarProduto({ nome: "B", preco: 10, quantidade: 12 });

        const resultado = estoque.listarEstoqueBaixo(10);

        expect(resultado).toHaveLength(1);
        expect(resultado[0].nome).toBe("A");
    });
});


describe("buscarPorPreco - limites da faixa", () => {
    test("exclui produtos com preço abaixo do mínimo e acima do máximo", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Barato", preco: 10, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Médio", preco: 75, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Caro", preco: 500, quantidade: 1 });

        const resultado = estoque.buscarPorPreco(50, 100);

        expect(resultado).toHaveLength(1);
        expect(resultado[0].nome).toBe("Médio");
    });

    test("inclui produtos com preço exatamente igual ao mínimo e ao máximo", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Mínimo", preco: 50, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Máximo", preco: 100, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Fora", preco: 101, quantidade: 1 });

        const resultado = estoque.buscarPorPreco(50, 100);

        expect(resultado).toHaveLength(2);
    });

    test("retorna lista vazia quando nenhum produto está na faixa", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Caro", preco: 500, quantidade: 1 });

        expect(estoque.buscarPorPreco(1, 10)).toEqual([]);
    });
});


describe("pesquisarProdutos - busca por texto", () => {
    test("encontra produtos pelo texto parcial no nome", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Camisa", preco: 50, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Calça", preco: 100, quantidade: 1 });

        const resultado = estoque.pesquisarProdutos("ami");

        expect(resultado).toHaveLength(1);
        expect(resultado[0].nome).toBe("Camisa");
    });

    test("retorna vários produtos quando o texto casa com mais de um nome", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Camisa", preco: 50, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Camiseta", preco: 30, quantidade: 1 });
        estoque.adicionarProduto({ nome: "Calça", preco: 100, quantidade: 1 });

        expect(estoque.pesquisarProdutos("cami")).toHaveLength(2);
    });

    test("ignora maiúsculas e minúsculas no texto pesquisado", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "camisa", preco: 50, quantidade: 1 });

        expect(estoque.pesquisarProdutos("CAMISA")).toHaveLength(1);
    });

    test("ignora maiúsculas e minúsculas no nome do produto", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "CELULAR", preco: 2000, quantidade: 1 });

        expect(estoque.pesquisarProdutos("celular")).toHaveLength(1);
    });

    test("retorna lista vazia quando nada casa com o texto", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Camisa", preco: 50, quantidade: 1 });

        expect(estoque.pesquisarProdutos("xyz")).toEqual([]);
    });
});


describe("quantidadeTotalItens", () => {
    test("retorna 0 para estoque vazio", () => {
        const estoque = new Estoque();

        expect(estoque.quantidadeTotalItens()).toBe(0);
    });

    test("soma as quantidades de todos os produtos", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 2000, quantidade: 10 });
        estoque.adicionarProduto({ nome: "Teclado", preco: 300, quantidade: 2 });

        expect(estoque.quantidadeTotalItens()).toBe(12);
    });
});


describe("limparEstoque", () => {
    test("remove todos os produtos e retorna true", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 2000, quantidade: 10 });
        estoque.adicionarProduto({ nome: "Teclado", preco: 300, quantidade: 2 });

        expect(estoque.limparEstoque()).toBe(true);
        expect(estoque.contarProdutos()).toBe(0);
        expect(estoque.estoqueVazio()).toBe(true);
    });

    test("permite adicionar produtos normalmente depois de limpar", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 2000, quantidade: 10 });
        estoque.limparEstoque();

        expect(estoque.adicionarProduto({ nome: "Teclado", preco: 300, quantidade: 2 })).toBe(true);
        expect(estoque.contarProdutos()).toBe(1);
    });
});


describe("aplicarDesconto", () => {
    test("aplica 10% de desconto no preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 200, quantidade: 1 });

        expect(estoque.aplicarDesconto("Celular", 10)).toBe(true);
        expect(estoque.buscarProduto("Celular").preco).toBeCloseTo(180);
    });

    test("aplica 50% de desconto no preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 100, quantidade: 1 });

        estoque.aplicarDesconto("Celular", 50);

        expect(estoque.buscarProduto("Celular").preco).toBeCloseTo(50);
    });

    test("retorna false para produto inexistente", () => {
        const estoque = new Estoque();

        expect(estoque.aplicarDesconto("Celular", 10)).toBe(false);
    });

    test("retorna false para percentual negativo e mantém o preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 200, quantidade: 1 });

        expect(estoque.aplicarDesconto("Celular", -1)).toBe(false);
        expect(estoque.buscarProduto("Celular").preco).toBe(200);
    });

    test("retorna false para percentual acima de 100 e mantém o preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 200, quantidade: 1 });

        expect(estoque.aplicarDesconto("Celular", 101)).toBe(false);
        expect(estoque.buscarProduto("Celular").preco).toBe(200);
    });

    test("aceita 0% de desconto (limite) e mantém o preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 200, quantidade: 1 });

        expect(estoque.aplicarDesconto("Celular", 0)).toBe(true);
        expect(estoque.buscarProduto("Celular").preco).toBe(200);
    });

    test("aceita 100% de desconto (limite) e zera o preço", () => {
        const estoque = new Estoque();
        estoque.adicionarProduto({ nome: "Celular", preco: 200, quantidade: 1 });

        expect(estoque.aplicarDesconto("Celular", 100)).toBe(true);
        expect(estoque.buscarProduto("Celular").preco).toBe(0);
    });
});
