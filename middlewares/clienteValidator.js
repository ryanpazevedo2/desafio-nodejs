/**
 * Middleware de validação de cliente
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Validar dados do cliente
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {void}
 */
const validateCliente = [
    body('nome')
        .isString().withMessage('Nome deve ser um texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Nome deve ter entre 3 e 255 caracteres.'),

    body('sobrenome')
        .isString().withMessage('Sobrenome deve ser um texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Sobrenome deve ter entre 3 e 255 caracteres.'),

    body('email')
        .isEmail().withMessage('Formato de e-mail inválido.')
        .normalizeEmail(),

    body('idade')
        .isInt({ min: 1, max: 120 }).withMessage('Idade deve ser um número entre 1 e 120.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    next();
    },
];

/**
 * Validar ID do cliente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateClienteId = [
    param('id').isInt({ min: 1 }).withMessage('ID do cliente deve ser um inteiro positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
    next();
    },
];

module.exports = {
    validateCliente,
    validateClienteId,
};
