/**
 * Arquivo principal da aplicação
 */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const path = require('path');
const methodOverride = require('method-override');

// Importar rotas
const indexRouter = require('./routes/index');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

// Criar aplicação Express
const app = express();

// Configuração do motor de visualização
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware - permite usar PUT e DELETE em formulários
app.use(methodOverride('_method'));

// Rotas
app.use('/', indexRouter);
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);

// Capturar erro 404 e encaminhar para o manipulador de erros
app.use((req, res, next) => {
    next(createError(404));
});

// Manipulador de erros
app.use((err, req, res, next) => {
    // Definir variáveis locais, fornecendo erro apenas em desenvolvimento
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Renderizar a página de erro ou enviar resposta JSON
    // com base no cabeçalho Accept
    res.status(err.status || 500);
    if (req.accepts('html')) {
        res.render('error');
    } else {
        res.json({
            message: err.message,
            error: req.app.get('env') === 'development' ? err : {},
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
