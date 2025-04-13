/**
 * Serviço de Cliente - Operações de banco de dados para clientes
 */
const { getSupabaseClient } = require('../configs/database');

/**
 * Obter todos os clientes
 * @return {Promise<Array>} Lista de clientes
 */
const getAllClientes = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('clientes')
        .select('*');

    if (error) throw error;
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
                idade: cliente.idade
            }
        ])
        .select();

    if (error) throw error;
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
            idade: cliente.idade
        })
        .eq('id', id)
        .select();

    if (error) throw error;
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
    return { id };
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
