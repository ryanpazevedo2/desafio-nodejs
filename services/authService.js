const { getSupabaseClient } = require('../configs/database');
const logger = require('../utils/logger');

const blacklistToken = async (token, expiresAt) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('token_blacklist')
        .insert([{ token, expires_at: expiresAt }]);

    if (error) {
        logger.logError('Erro ao adicionar token na blacklist', error);
        throw error;
    }
    logger.logInfo('Token adicionado à blacklist');
};

const isTokenBlacklisted = async (token) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('token_blacklist')
        .select('id')
        .eq('token', token)
        .single();

    if (error && error.code !== 'PGRST116') {
        logger.logError('Erro ao verificar token na blacklist', error);
        throw error;
    }

    return !!data;
};

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
}; 