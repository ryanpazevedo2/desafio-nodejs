/**
 * Utilitário de logging - Gerencia logs no console e em arquivo
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const winston = require('winston');

// Configurar o diretório de logs
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Configurar o logger do Winston para arquivos
const fileLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
        }),
    ],
});

/**
 * Log de mensagem de cache no console e arquivo
 * @param {string} message - Mensagem a ser logada
 */
const logCache = (message) => {
    console.log(chalk.blue('[CACHE]'), message);
    fileLogger.info(`[CACHE] ${message}`);
};

/**
 * Log de mensagem de banco de dados no console e arquivo
 * @param {string} message - Mensagem a ser logada
 */
const logDB = (message) => {
    console.log(chalk.green('[DB]'), message);
    fileLogger.info(`[DB] ${message}`);
};

/**
 * Log de mensagem de erro no console e arquivo
 * @param {string} message - Mensagem a ser logada
 * @param {Error} error - Objeto de erro
 */
const logError = (message, error) => {
    console.error(chalk.red('[ERROR]'), message, error);
    fileLogger.error(`[ERROR] ${message} ${error?.message || ''}`);
};

/**
 * Log de mensagem de info no console e arquivo
 * @param {string} message - Mensagem a ser logada
 */
const logInfo = (message) => {
    console.log(chalk.cyan('[INFO]'), message);
    fileLogger.info(`[INFO] ${message}`);
};

module.exports = {
    logCache,
    logDB,
    logError,
    logInfo,
}; 