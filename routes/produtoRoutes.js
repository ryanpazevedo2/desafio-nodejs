/**
 * Rotas de produto
 */
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const {
    validateProduto,
    validateProdutoId,
} = require('../middlewares/produtoValidator');

// GET /produtos - Obter todos os produtos
router.get('/', produtoController.getAllProdutos);

// GET /produtos/:id - Obter produto por id
router.get('/:id', validateProdutoId, produtoController.getProdutoById);

// POST /produtos - Criar novo produto
router.post('/', validateProduto, produtoController.createProduto);

// PUT /produtos/:id - Atualizar produto
router.put('/:id',
    validateProdutoId,
    validateProduto,
    produtoController.updateProduto,
);

// POST /produtos/:id/update - Rota alternativa para atualizar produto
router.post('/:id/update',
    validateProdutoId,
    validateProduto,
    produtoController.updateProduto,
);

// DELETE /produtos/:id - Excluir produto
router.delete('/:id', validateProdutoId, produtoController.deleteProduto);

// POST /produtos/:id/delete - Rota alternativa para excluir produto
router.post('/:id/delete', validateProdutoId, produtoController.deleteProduto);

module.exports = router;
