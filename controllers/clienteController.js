/**
 * Controle de clientes
 */
const clienteService = require('../services/clienteService');
const logger = require('../utils/logger');

/**
 * Pegar todos os clientes
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteService.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        logger.logError('Erro ao buscar clientes', error);
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
};

/**
 * Pegar cliente por id
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const getClienteById = async (req, res) => {
    try {
        const cliente = await clienteService.getClienteById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        logger.logError('Erro ao buscar cliente', error);
        res.status(500).json({ message: 'Erro ao buscar cliente' });
    }
};

/**
 * Criar novo cliente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const createCliente = async (req, res) => {
    try {
        const novoCliente = await clienteService.createCliente(req.body);
        res.status(201).json(novoCliente);
    } catch (error) {
        logger.logError('Erro ao criar cliente', error);
        res.status(500).json({ message: 'Erro ao criar cliente' });
    }
};

/**
 * Atualizar cliente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const updateCliente = async (req, res) => {
    try {
        const clienteAtualizado = await clienteService.updateCliente(req.params.id, req.body);
        if (!clienteAtualizado) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.status(200).json(clienteAtualizado);
    } catch (error) {
        logger.logError('Erro ao atualizar cliente', error);
        res.status(500).json({ message: 'Erro ao atualizar cliente' });
    }
};

/**
 * Deletar cliente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @return {Promise<void>}
 */
const deleteCliente = async (req, res) => {
    try {
        const result = await clienteService.deleteCliente(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.status(200).json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        logger.logError('Erro ao deletar cliente', error);
        res.status(500).json({ message: 'Erro ao deletar cliente' });
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
