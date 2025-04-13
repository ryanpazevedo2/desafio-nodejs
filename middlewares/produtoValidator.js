/**
 * Middleware de validação de produto
 */

/**
 * Validar dados do produto
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateProduto = (req, res, next) => {
    const { nome, descricao, preco } = req.body;
    const errors = [];

    // Validar nome
    if (!nome || nome.trim() === '') {
        errors.push('Nome é obrigatório');
    }

    // Validar descrição
    if (!descricao || descricao.trim() === '') {
        errors.push('Descrição é obrigatória');
    }

    // Validar preço
    if (preco === undefined || preco === null) {
        errors.push('Preço é obrigatório');
    } else if (isNaN(preco) || parseFloat(preco) <= 0) {
        errors.push('Preço deve ser um número positivo');
    }

    // Retornar erros, se houver
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Converter preço para float
    req.body.preco = parseFloat(preco);

    next();
};

/**
 * Validar ID do produto
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware next do Express
 * @return {void}
 */
const validateProdutoId = (req, res, next) => {
    const id = req.params.id;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
            message: 'ID inválido. Deve ser um número positivo',
        });
    }

    next();
};

module.exports = {
    validateProduto,
    validateProdutoId,
};
