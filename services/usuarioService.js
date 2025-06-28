const { getSupabaseClient } = require('../configs/database');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;

const createUser = async (usuario, senha) => {
    const supabase = getSupabaseClient();
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ 
            usuario, 
            senha: hashedPassword
        }])
        .select('id, usuario');

    if (error) {
        logger.logError('Erro ao criar usuário', error);
        throw error;
    }

    logger.logDB(`Usuário criado: ${usuario}`);
    return data[0];
};

const findUserByUsername = async (usuario) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignora erro de "nenhuma linha encontrada"
        logger.logError(`Erro ao buscar usuário ${usuario}`, error);
        throw error;
    }

    return data;
};

const updateUserToken = async (usuario, token) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('usuarios')
        .update({ token })
        .eq('usuario', usuario);

    if (error) {
        logger.logError(`Erro ao atualizar token do usuário ${usuario}`, error);
        throw error;
    }

    logger.logDB(`Token atualizado para usuário: ${usuario}`);
};

const clearUserToken = async (usuario) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('usuarios')
        .update({ token: null })
        .eq('usuario', usuario);

    if (error) {
        logger.logError(`Erro ao limpar token do usuário ${usuario}`, error);
        throw error;
    }

    logger.logDB(`Token removido para usuário: ${usuario}`);
};

const getAllUsuarios = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, usuario');

    if (error) {
        logger.logError('Erro ao buscar todos os usuários', error);
        throw error;
    }
    return data;
};

module.exports = {
    createUser,
    findUserByUsername,
    updateUserToken,
    clearUserToken,
    getAllUsuarios,
}; 