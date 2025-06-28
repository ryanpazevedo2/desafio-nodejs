const { body, validationResult } = require('express-validator');

const validateUsuario = [
    body('usuario')
        .isString()
        .withMessage('Usuário deve ser um texto.')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Usuário deve ter entre 3 e 100 caracteres.'),

    body('senha')
        .isString()
        .withMessage('Senha deve ser um texto.')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateUsuario,
}; 