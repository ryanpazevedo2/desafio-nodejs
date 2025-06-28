/**
 * Controle de produtos
 */
const produtoService = require('../services/produtoService');
const logger = require('../utils/logger');

/**
 * Buscar todos os produtos
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const getAllProdutos = async (req, res) => {
    try {
        const produtos = await produtoService.getAllProdutos();
            res.status(200).json(produtos);
    } catch (error) {
        logger.logError('Erro ao buscar produtos', error);
            res.status(500).json({ message: 'Erro ao buscar produtos' });
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
        const produto = await produtoService.getProdutoById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
            }
            res.status(200).json(produto);
    } catch (error) {
        logger.logError('Erro ao buscar produto', error);
            res.status(500).json({ message: 'Erro ao buscar produto' });
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
        const novoProduto = await produtoService.createProduto(req.body);
        res.status(201).json(novoProduto);
    } catch (error) {
        logger.logError('Erro ao criar produto', error);
            res.status(500).json({ message: 'Erro ao criar produto' });
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
        const produtoAtualizado = await produtoService.updateProduto(req.params.id, req.body);
        if (!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        logger.logError('Erro ao atualizar produto', error);
            res.status(500).json({ message: 'Erro ao atualizar produto' });
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
        const result = await produtoService.deleteProduto(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Produto não encontrado' });
            }
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        logger.logError('Erro ao deletar produto', error);
        res.status(500).json({ message: 'Erro ao deletar produto' });
    }
};

module.exports = {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
};
