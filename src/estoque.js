class Estoque {
    constructor() {
        this.produtos = [];
    }
    adicionarProduto(produto) {
        if (!produto || !produto.nome || produto.preco < 0 || produto.quantidade < 0) {
            return false;
        }
        this.produtos.push({
            ...produto
        });
        return true;
    }
    removerProduto(nome) {
        const index = this.produtos.findIndex(p => p.nome === nome);
        if (index === -1) {
            return false;
        }
        this.produtos.splice(index, 1);
        return true;
    }
    buscarProduto(nome) {
        return this.produtos.find(p => p.nome === nome) || null;
    }
    produtoExiste(nome) {
        return this.produtos.some(p => p.nome === nome);
    }
    adicionarEstoque(nome, quantidade) {
        const produto = this.buscarProduto(nome);
        if (!produto || quantidade <= 0) {
            return false;
        }
        produto.quantidade += quantidade;
        return true;
    }
    retirarEstoque(nome, quantidade) {
        const produto = this.buscarProduto(nome);
        if (!produto || quantidade <= 0 || produto.quantidade < quantidade) {
            return false;
        }
        produto.quantidade -= quantidade;
        return true;
    }
    consultarQuantidade(nome) {
        const produto = this.buscarProduto(nome);
        return produto ? produto.quantidade : 0;
    }
    alterarPreco(nome, novoPreco) {
        const produto = this.buscarProduto(nome);
        if (!produto || novoPreco < 0) {
            return false;
        }
        produto.preco = novoPreco;
        return true;
    }
    calcularValorProduto(nome) {
        const produto = this.buscarProduto(nome);
        if (!produto) {
            return 0;
        }
        return produto.preco * produto.quantidade;
    }
    calcularValorTotal() {
        return this.produtos.reduce(
            (total, produto) => total + produto.preco * produto.quantidade,
            0
        );
    }
    listarProdutos() {
        return [...this.produtos];
    }
    contarProdutos() {
        return this.produtos.length;
    }
    estoqueVazio() {
        return this.produtos.length === 0;
    }
    estoqueBaixo(nome, limite = 5) {
        const produto = this.buscarProduto(nome);
        if (!produto) {
            return false;
        }
        return produto.quantidade <= limite;
    }
    listarEstoqueBaixo(limite = 5) {
        return this.produtos.filter(
            produto => produto.quantidade <= limite
        );
    }
    buscarPorPreco(precoMinimo, precoMaximo) {
        return this.produtos.filter(
            produto =>
                produto.preco >= precoMinimo &&
                produto.preco <= precoMaximo
        );
    }
    pesquisarProdutos(texto) {
        const termo = texto.toLowerCase();
        return this.produtos.filter(
            produto => produto.nome.toLowerCase().includes(termo)
        );
    }
    quantidadeTotalItens() {
        return this.produtos.reduce(
            (total, produto) => total + produto.quantidade,
            0
        );
    }
    limparEstoque() {
        this.produtos = [];
        return true;
    }
    aplicarDesconto(nome, percentual) {
        const produto = this.buscarProduto(nome);
        if (!produto || percentual < 0 || percentual > 100) {
            return false;
        }
        produto.preco = produto.preco * (1 - percentual / 100);
        return true;
    }
}

module.exports = Estoque;
