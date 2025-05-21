/**
 * Serviço de Cliente - Operações de banco de dados para clientes
 */
const { getSupabaseClient } = require('../configs/database');
const cacheUtil = require('../utils/cache');
const logger = require('../utils/logger');

/**
 * Obter todos os clientes
 * @param {boolean} useCache - Se deve usar cache (padrão: true)
 * @return {Promise<Array>} Lista de clientes
 */
const getAllClientes = async (useCache = true) => {
    // Verificar se os dados estão em cache
    if (useCache) {
        const cachedData = cacheUtil.get(cacheUtil.CACHE_KEYS.ALL_CLIENTES);
        if (cachedData) {
            logger.logCache('Listando clientes do cache');
            return cachedData;
        }
    }

    // Se não estiver em cache ou se o cache não for usado, buscar do banco
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('clientes')
        .select('*');

    if (error) throw error;
    
    // Armazenar no cache (por 30 segundos por padrão)
    if (useCache) {
        cacheUtil.set(cacheUtil.CACHE_KEYS.ALL_CLIENTES, data);
    }
    
    logger.logDB('Listando clientes do banco de dados');
    return data;
};

/**
 * Obter cliente por id
 * @param {number} id - ID do cliente
 * @return {Promise<Object>} Dados do cliente
 */
const getClienteById = async (id) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    logger.logDB(`Buscando cliente ID ${id} do banco de dados`);
    return data;
};

/**
 * Criar novo cliente
 * @param {Object} cliente - Dados do cliente
 * @return {Promise<Object>} Resultado da operação
 */
const createCliente = async (cliente) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('clientes')
        .insert([
            {
                nome: cliente.nome,
                sobrenome: cliente.sobrenome,
                email: cliente.email,
                idade: cliente.idade,
            },
        ])
        .select();

    if (error) throw error;
    
    // Invalidar cache após criação
    invalidateCache();
    
    logger.logDB(`Cliente criado: ${cliente.nome} ${cliente.sobrenome}`);
    return data[0];
};

/**
 * Atualizar cliente
 * @param {number} id - ID do cliente
 * @param {Object} cliente - Dados do cliente
 * @return {Promise<Object>} Resultado da operação
 */
const updateCliente = async (id, cliente) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('clientes')
        .update({
            nome: cliente.nome,
            sobrenome: cliente.sobrenome,
            email: cliente.email,
            idade: cliente.idade,
        })
        .eq('id', id)
        .select();

    if (error) throw error;
    
    // Invalidar cache após atualização
    invalidateCache();
    
    logger.logDB(`Cliente atualizado: ID ${id}`);
    return data[0];
};

/**
 * Excluir cliente
 * @param {number} id - ID do cliente
 * @return {Promise<Object>} Resultado da operação
 */
const deleteCliente = async (id) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

    if (error) throw error;
    
    // Invalidar cache após exclusão
    invalidateCache();
    
    logger.logDB(`Cliente excluído: ID ${id}`);
    return { id };
};

/**
 * Invalidar o cache de clientes
 */
const invalidateCache = () => {
    cacheUtil.del(cacheUtil.CACHE_KEYS.ALL_CLIENTES);
    logger.logInfo('Cache de clientes invalidado');
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
