const Estoque = require("../src/estoque");


// ============================================================
// TESTES ORIGINAIS (primeiro trabalho)
// ============================================================

// Teste 01 - deve adicionar um novo produto na classe
test("adicionar um produto", () => {
    const estoque = new Estoque();

    const produto = {
        nome: "Teclado",
        preco: 300,
        quantidade: 2
    };

    const resultado = estoque.adicionarProduto(produto);

    expect(resultado).toBe(true);
});


// Teste 02 - deve remover um produto pelo nome
test("remover um produto", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Calça",
        preco: 100,
        quantidade: 3
    });

    const resultado = estoque.removerProduto("Calça");

    expect(resultado).toBe(true);
    expect(estoque.buscarProduto("Calça")).toBe(null);
});


// Teste 03 - deve buscar um produto pelo nome
test("buscar produto pelo nome", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Carro",
        preco: 5000,
        quantidade: 2
    });

    const resultado = estoque.buscarProduto("Carro");

    expect(resultado.nome).toBe("Carro");
});


// Teste 04 - verificar se o produto existe pelo nome
test("verificar se o produto existe", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    const resultado = estoque.produtoExiste("Celular");

    expect(resultado).toBe(true);
});


// Teste 05 - deve aumentar a quantidade do produto no estoque
test("aumentar a quantidade do produto no estoque", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    const resultado = estoque.adicionarEstoque("Celular", 5);

    expect(resultado).toBe(true);
    expect(estoque.consultarQuantidade("Celular")).toBe(15);
});


// Teste 06 - diminuir a quantidade de produto no estoque
test("retirar quantidade de produto", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Camisa",
        preco: 20,
        quantidade: 15
    });

    const resultado = estoque.retirarEstoque("Camisa", 5);

    expect(resultado).toBe(true);
    expect(estoque.consultarQuantidade("Camisa")).toBe(10);
});


// Teste 07 - deve consultar a quantidade de um produto
test("consultar quantidade", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Camisa",
        preco: 20,
        quantidade: 20
    });

    const resultado = estoque.consultarQuantidade("Camisa");

    expect(resultado).toBe(20);
});

// Teste 08 - deve alterar o preço de um produto
test("alterar preço do produto", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    const resultado = estoque.alterarPreco("Celular", 2500);

    expect(resultado).toBe(true);
    expect(estoque.buscarProduto("Celular").preco).toBe(2500);
});


// Teste 09 - deve calcular o valor de um produto
test("calcular valor de um produto", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    const resultado = estoque.calcularValorProduto("Celular");

    expect(resultado).toBe(20000);
});


// Teste 10 - deve calcular o valor total do estoque
test("calcular valor total do estoque", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    estoque.adicionarProduto({
        nome: "Teclado",
        preco: 300,
        quantidade: 2
    });

    const resultado = estoque.calcularValorTotal();

    expect(resultado).toBe(20600);
});


// Teste 11 - deve listar os produtos
test("listar produtos", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    estoque.adicionarProduto({
        nome: "Teclado",
        preco: 300,
        quantidade: 2
    });

    const resultado = estoque.listarProdutos();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe("Celular");
    expect(resultado[1].nome).toBe("Teclado");
});


// Teste 12 - deve contar os produtos
test("contar produtos", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Celular",
        preco: 2000,
        quantidade: 10
    });

    estoque.adicionarProduto({
        nome: "Teclado",
        preco: 300,
        quantidade: 2
    });

    const resultado = estoque.contarProdutos();

    expect(resultado).toBe(2);
});

// Teste 13 - deve verificar se o estoque está vazio
test("verificar se o estoque está vazio", () => {
    const estoque = new Estoque();

    const resultado = estoque.estoqueVazio();

    expect(resultado).toBe(true);
});


// Teste 14 - deve verificar se o estoque de um produto está baixo
test("verificar estoque baixo", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Camisa",
        preco: 50,
        quantidade: 3
    });

    const resultado = estoque.estoqueBaixo("Camisa");

    expect(resultado).toBe(true);
});


// Teste 15 - deve listar produtos com estoque baixo
test("listar produtos com estoque baixo", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Camisa",
        preco: 50,
        quantidade: 3
    });

    estoque.adicionarProduto({
        nome: "Calça",
        preco: 100,
        quantidade: 10
    });

    const resultado = estoque.listarEstoqueBaixo();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe("Camisa");
});


// Teste 16 - deve buscar produtos por faixa de preço
test("buscar produtos por faixa de preço", () => {
    const estoque = new Estoque();

    estoque.adicionarProduto({
        nome: "Camisa",
        preco: 50,
        quantidade: 10
    });

    estoque.adicionarProduto({
        nome: "Calça",
        preco: 100,
        quantidade: 5
    });

    estoque.adicionarProduto({
        nome: "Tênis",
        preco: 300,
        quantidade: 2
    });

    const resultado = estoque.buscarPorPreco(50, 100);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe("Camisa");
    expect(resultado[1].nome).toBe("Calça");
});
