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
        .isInt({ min: 1, max: 119 }).withMessage('Idade deve ser um número maior que 0 e menor que 120.'),

    body('data_atualizado')
        .optional({ checkFalsy: true })
        .custom((value) => {
            // Validar formato DD/MM/AAAA
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const match = value.match(dateRegex);
            
            if (!match) {
                throw new Error('Data deve estar no formato DD/MM/AAAA.');
            }
            
            const [, day, month, year] = match;
            const date = new Date(year, month - 1, day);
            
            // Verificar se a data é válida
            if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
                throw new Error('Data inválida.');
            }
            
            // Verificar se está entre 01/01/2000 e 20/06/2025
            const minDate = new Date(2000, 0, 1); // 01/01/2000
            const maxDate = new Date(2025, 5, 20); // 20/06/2025
            
            if (date < minDate || date > maxDate) {
                throw new Error('Data deve estar entre 01/01/2000 e 20/06/2025.');
            }
            
            return true;
        }),

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
