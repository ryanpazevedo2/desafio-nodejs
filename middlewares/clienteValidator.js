/**
 * Middleware de validação de cliente
 */

/**
 * Validar dados do cliente
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {void}
 */
const validateCliente = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;
    const errors = [];

    // Validar nome
    if (!nome || nome.trim() === '') {
        errors.push('Nome é obrigatório');
    }

    // Validar sobrenome
    if (!sobrenome || sobrenome.trim() === '') {
        errors.push('Sobrenome é obrigatório');
    }

    // Validar email
    if (!email || email.trim() === '') {
        errors.push('Email é obrigatório');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Email inválido');
        }
    }

    // Validar idade
    if (idade === undefined || idade === null) {
        errors.push('Idade é obrigatória');
    } else if (isNaN(idade) || idade < 0) {
        errors.push('Idade deve ser um número positivo');
    }

    // Retornar erros, se houver
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Converter idade para inteiro
    req.body.idade = parseInt(idade);

    next();
};

/**
 * Validar ID do cliente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateClienteId = (req, res, next) => {
    const id = req.params.id;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
            message: 'ID inválido. Deve ser um número positivo'
        });
    }

    next();
};

module.exports = {
    validateCliente,
    validateClienteId,
};
