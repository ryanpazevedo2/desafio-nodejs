const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.logInfo('Tentativa de acesso sem token');
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const isBlacklisted = await authService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            logger.logInfo('Tentativa de acesso com token na blacklist');
            return res.status(403).json({ message: 'Token inválido (blacklist).' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                logger.logInfo('Falha na verificação do token JWT', err);
                return res.status(403).json({ message: 'Token inválido.' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        logger.logError('Erro no middleware de autenticação', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

module.exports = {
    authenticateToken,
}; 