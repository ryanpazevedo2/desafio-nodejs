const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');
const logger = require('../utils/logger');

const login = async (req, res) => {
    try {
        const { usuario, senha } = req.body;
        const user = await usuarioService.findUserByUsername(usuario);

        if (!user) {
            logger.logInfo(`Tentativa de login falhou (usuário não encontrado): ${usuario}`);
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            logger.logInfo(`Tentativa de login falhou (senha inválida): ${usuario}`);
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const tokenPayload = { 
            id: user.id, 
            usuario: user.usuario
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        // Salvar token na tabela usuarios
        await usuarioService.updateUserToken(usuario, token);

        logger.logInfo(`Usuário ${usuario} logado com sucesso.`);
        res.status(200).json({ 
            token,
            usuario: {
                id: user.id,
                usuario: user.usuario
            }
        });

    } catch (error) {
        logger.logError('Erro durante o login', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

const logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Token não fornecido.' });
        }

        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Adicionar token na blacklist
        await authService.blacklistToken(token, expiresAt.toISOString());
        
        // Limpar token da tabela usuarios
        await usuarioService.clearUserToken(decoded.usuario);
        
        logger.logInfo(`Token do usuário ${decoded.usuario} invalidado (logout).`);
        res.status(200).json({ message: 'Logout bem-sucedido.' });

    } catch (error) {
        logger.logError('Erro durante o logout', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

module.exports = {
    login,
    logout,
}; 