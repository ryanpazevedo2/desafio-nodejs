/**
 * Roteador principal
 */
const express = require('express');
const router = express.Router();

/**
 * GET / - Endpoint principal
 */
router.get('/', (req, res) => {
    if (req.accepts('html')) {
        res.render('index', {
            title: 'Desafio Node.js API'
        });
    } else {
        res.status(200).json({
            message: 'Bem-vindo à API do Desafio Node.js',
            endpoints: {
                clientes: '/clientes',
                produtos: '/produtos',
            },
        });
    }
});

module.exports = router;
