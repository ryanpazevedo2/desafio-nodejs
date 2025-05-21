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
        // Obter do serviço com suporte a cache
        const clientes = await clienteService.getAllClientes();

        if (req.accepts('html')) {
            res.render('clientes', {
                title: 'Lista de Clientes',
                clientes: clientes,
            });
        } else {
            res.status(200).json(clientes);
        }
    } catch (error) {
        logger.logError('Erro ao buscar clientes', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao buscar clientes',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao buscar clientes' });
        }
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
        const id = parseInt(req.params.id);
        const cliente = await clienteService.getClienteById(id);

        if (!cliente) {
            logger.logInfo(`Cliente ID ${id} não encontrado`);
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Cliente não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Cliente não encontrado',
                });
            }
        }

        if (req.accepts('html')) {
            res.render('cliente', {
                title: 'Detalhes do Cliente',
                cliente: cliente,
            });
        } else {
            res.status(200).json(cliente);
        }
    } catch (error) {
        logger.logError(`Erro ao buscar cliente ID ${req.params.id}`, error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao buscar cliente',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao buscar cliente' });
        }
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
        const { nome, sobrenome, email, idade } = req.body;
        const newCliente = await clienteService.createCliente({
            nome,
            sobrenome,
            email,
            idade: parseInt(idade),
        });

        // Responder com base no cabeçalho e fonte de solicitação
        if (req.accepts('html')) {
            res.redirect('/clientes');
        } else {
            res.status(201).json(newCliente);
        }
    } catch (error) {
        logger.logError('Erro ao criar cliente', error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao criar cliente',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao criar cliente' });
        }
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
        const id = parseInt(req.params.id);
        const { nome, sobrenome, email, idade } = req.body;

        // Verificar se o cliente existe
        const existingCliente = await clienteService.getClienteById(id);
        if (!existingCliente) {
            logger.logInfo(`Tentativa de atualizar cliente inexistente ID ${id}`);
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Cliente não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Cliente não encontrado',
                });
            }
        }

        const updatedCliente = await clienteService.updateCliente(id, {
            nome,
            sobrenome,
            email,
            idade: parseInt(idade),
        });

        // Responder com base no cabeçalho
        if (req.accepts('html')) {
            res.redirect('/clientes/' + id);
        } else {
            res.status(200).json(updatedCliente);
        }
    } catch (error) {
        logger.logError(`Erro ao atualizar cliente ID ${req.params.id}`, error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao atualizar cliente',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao atualizar cliente' });
        }
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
        const id = parseInt(req.params.id);

        // Verificar se o cliente existe
        const existingCliente = await clienteService.getClienteById(id);
        if (!existingCliente) {
            logger.logInfo(`Tentativa de excluir cliente inexistente ID ${id}`);
            if (req.accepts('html')) {
                return res.render('error', {
                    message: 'Cliente não encontrado',
                    error: { status: 404 },
                });
            } else {
                return res.status(404).json({
                    message: 'Cliente não encontrado',
                });
            }
        }

        await clienteService.deleteCliente(id);

        if (req.accepts('html')) {
            res.redirect('/clientes');
        } else {
            res.status(200).json({ message: 'Cliente removido com sucesso' });
        }
    } catch (error) {
        logger.logError(`Erro ao deletar cliente ID ${req.params.id}`, error);
        if (req.accepts('html')) {
            res.render('error', {
                message: 'Erro ao remover cliente',
                error: error,
            });
        } else {
            res.status(500).json({ message: 'Erro ao remover cliente' });
        }
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
