const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validateUsuario } = require('../middlewares/usuarioValidator');
const { authenticateToken } = require('../middlewares/authMiddleware');

// POST /usuarios - Criar novo usuário (público)
router.post('/', validateUsuario, usuarioController.createUsuario);

// GET /usuarios - Obter todos os usuários (protegido)
router.get('/', authenticateToken, usuarioController.getAllUsuarios);

module.exports = router; 