const usuarioService = require('../services/usuarioService');
const logger = require('../utils/logger');

const createUsuario = async (req, res) => {
    try {
        const { usuario, senha } = req.body;
        const newUser = await usuarioService.createUser(usuario, senha);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === '23505') { // Código de violação de constraint unique
            logger.logInfo(`Tentativa de criar usuário duplicado: ${req.body.usuario}`);
            return res.status(409).json({ message: 'Usuário já existe.' });
        }
        logger.logError('Erro ao criar usuário', error);
        res.status(500).json({ message: 'Erro interno ao criar usuário.' });
    }
};

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        logger.logError('Erro ao buscar usuários', error);
        res.status(500).json({ message: 'Erro interno ao buscar usuários.' });
    }
};

module.exports = {
    createUsuario,
    getAllUsuarios,
}; 