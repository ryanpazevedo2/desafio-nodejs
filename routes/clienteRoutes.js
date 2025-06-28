/**
 * Rotas de cliente
 */
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const {
    validateCliente,
    validateClienteId,
} = require('../middlewares/clienteValidator');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Aplicar autenticação a todas as rotas de /clientes
router.use(authenticateToken);

// GET /clientes - Obter todos os clientes
router.get('/', clienteController.getAllClientes);

// GET /clientes/:id - Obter cliente por id
router.get('/:id', validateClienteId, clienteController.getClienteById);

// POST /clientes - Criar novo cliente
router.post('/', validateCliente, clienteController.createCliente);

// PUT /clientes/:id - Atualizar cliente
router.put('/:id',
    validateClienteId,
    validateCliente,
    clienteController.updateCliente,
);

// POST /clientes/:id/update - Rota alternativa para atualizar cliente
router.post('/:id/update',
    validateClienteId,
    validateCliente,
    clienteController.updateCliente,
);

// DELETE /clientes/:id - Excluir cliente
router.delete('/:id', validateClienteId, clienteController.deleteCliente);

// POST /clientes/:id/delete - Rota alternativa para excluir cliente
router.post('/:id/delete', validateClienteId, clienteController.deleteCliente);

module.exports = router;
