const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// POST /login - Autenticar usuário e obter token
router.post('/login', authController.login);

// POST /logout - Invalidar token do usuário
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 