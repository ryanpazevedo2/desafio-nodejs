/**
 * Middleware de validação de produto
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Validar dados do produto
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateProduto = [
    body('nome')
        .isString().withMessage('Nome do produto deve ser um texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Nome do produto deve ter entre 3 e 255 caracteres.'),

    body('descricao')
        .isString().withMessage('Descrição deve ser um texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Descrição deve ter entre 3 e 255 caracteres.'),

    body('preco')
        .isFloat({ gt: 0 }).withMessage('Preço deve ser um número positivo.'),

    body('data_atualizado')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Data deve estar no formato ISO8601.')
        .isAfter('2000-01-01T00:00:00.000Z').withMessage('A data deve ser posterior a 01/01/2000.')
        .isBefore('2025-06-20T00:00:00.000Z').withMessage('A data deve ser anterior a 20/06/2025.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    next();
    },
];

/**
 * Validar ID do produto
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateProdutoId = [
    param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser um inteiro positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
    next();
    },
];

module.exports = {
    validateProduto,
    validateProdutoId,
};
