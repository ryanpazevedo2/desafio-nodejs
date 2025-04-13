/**
 * Serviço de Produto - Operações de banco de dados para produtos
 */
const { getSupabaseClient } = require('../configs/database');

/**
 * Obter todos os produtos
 * @return {Promise<Array>} Lista de produtos
 */
const getAllProdutos = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) throw error;
    return data;
};

/**
 * Obter produto por id
 * @param {number} id - ID do produto
 * @return {Promise<Object>} Dados do produto
 */
const getProdutoById = async (id) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Criar novo produto
 * @param {Object} produto - Dados do produto
 * @return {Promise<Object>} Resultado da operação
 */
const createProduto = async (produto) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('produtos')
        .insert([
            {
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
            },
        ])
        .select();

    if (error) throw error;
    return data[0];
};

/**
 * Atualizar produto
 * @param {number} id - ID do produto
 * @param {Object} produto - Dados do produto
 * @return {Promise<Object>} Resultado da operação
 */
const updateProduto = async (id, produto) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('produtos')
        .update({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
        })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
};

/**
 * Excluir produto
 * @param {number} id - ID do produto
 * @return {Promise<Object>} Resultado da operação
 */
const deleteProduto = async (id) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { id };
};

module.exports = {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
};
