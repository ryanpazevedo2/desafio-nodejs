/**
 * Controle de produtos
 */
const produtoService = require('../services/produtoService');

/**
 * Buscar todos os produtos
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const getAllProdutos = async (req, res) => {
    try {
        const produtos = await produtoService.getAllProdutos();

        if (req.accepts('html')) {
            res.render('produtos', {
                title: 'Lista de Produtos',
                produtos: produtos,
            });
        } else {
            res.status(200).json(produtos);
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao buscar produtos',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao buscar produtos' });
        }
    }
};

/**
 * Pegar produto por id
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const getProdutoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const produto = await produtoService.getProdutoById(id);

        if (!produto) {
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Produto não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Produto não encontrado',
                });
            }
        }

        // Responder com base no cabeçalho Accept
        if (req.accepts('html')) {
            res.render('produto', {
                title: 'Detalhes do Produto',
                produto: produto,
            });
        } else {
            res.status(200).json(produto);
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao buscar produto',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao buscar produto' });
        }
    }
};

/**
 * Criar novo produto
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const createProduto = async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;
        const newProduto = await produtoService.createProduto({
            nome,
            descricao,
            preco: parseFloat(preco),
        });

        // Responder com base no cabeçalho Accept e fonte da requisição
        if (req.accepts('html')) {
            res.redirect('/produtos');
        } else {
            res.status(201).json(newProduto);
        }
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao criar produto',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao criar produto' });
        }
    }
};

/**
 * Atualizar produto
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const updateProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, descricao, preco } = req.body;

        // Verificar se o produto existe
        const existingProduto = await produtoService.getProdutoById(id);
        if (!existingProduto) {
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Produto não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Produto não encontrado',
                });
            }
        }

        const updatedProduto = await produtoService.updateProduto(id, {
            nome,
            descricao,
            preco: parseFloat(preco),
        });

        // Responder com base no cabeçalho Accept
        if (req.accepts('html')) {
            res.redirect('/produtos/' + id);
        } else {
            res.status(200).json(updatedProduto);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao atualizar produto',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao atualizar produto' });
        }
    }
};

/**
 * Excluir produto
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const deleteProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Verificar se o produto existe
        const existingProduto = await produtoService.getProdutoById(id);
        if (!existingProduto) {
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Produto não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Produto não encontrado',
                });
            }
        }

        await produtoService.deleteProduto(id);

        // Responder com base no cabeçalho Accept
        if (req.accepts('html')) {
            res.redirect('/produtos');
        } else {
            res.status(200).json({ message: 'Produto removido com sucesso' });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao remover produto',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao remover produto' });
        }
    }
};

module.exports = {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
};
