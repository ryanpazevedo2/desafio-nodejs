/**
 * Utilitário de cache - Implementa cache para operações de leitura
 */
const NodeCache = require('node-cache');

// Criar uma instância do cache com 30 segundos de TTL (time-to-live)
const cache = new NodeCache({ stdTTL: 30 });

// Chaves de cache usadas na aplicação
const CACHE_KEYS = {
    ALL_CLIENTES: 'all_clientes',
};

/**
 * Configura a expiração padrão do cache (em segundos)
 * @param {number} ttl - Tempo de expiração em segundos
 */
const setDefaultTTL = (ttl) => {
    cache.options.stdTTL = ttl;
};

/**
 * Obtém um valor do cache
 * @param {string} key - Chave do cache
 * @return {any} - Valor armazenado ou undefined
 */
const get = (key) => {
    return cache.get(key);
};

/**
 * Armazena um valor no cache
 * @param {string} key - Chave do cache
 * @param {any} value - Valor a ser armazenado
 * @param {number} ttl - Tempo de expiração em segundos (opcional)
 * @return {boolean} - Verdadeiro se armazenado com sucesso
 */
const set = (key, value, ttl = undefined) => {
    return cache.set(key, value, ttl);
};

/**
 * Remove um valor do cache
 * @param {string} key - Chave do cache
 * @return {number} - Número de itens removidos
 */
const del = (key) => {
    return cache.del(key);
};

/**
 * Limpa o cache inteiro
 * @return {void}
 */
const flush = () => {
    cache.flushAll();
};

/**
 * Obtém estatísticas do cache
 * @return {Object} - Estatísticas do cache
 */
const getStats = () => {
    return cache.getStats();
};

module.exports = {
    CACHE_KEYS,
    setDefaultTTL,
    get,
    set,
    del,
    flush,
    getStats,
}; 