/**
 * Configurações do supabase
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

/**
 * Criar cliente Supabase
 * @param {Object} options - Opções para sobrescrever a configuração padrão.
 * @return {Object} Cliente Supabase
 */
const getSupabaseClient = (options = {}) => {
    const supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL;
    const supabaseKey = options.supabaseKey || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'URL e chave do Supabase devem ser fornecidas no arquivo .env ou como opções',
        );
    }

    const clientOptions = options.fetch ? { global: { fetch: options.fetch } } : {};

    return createClient(supabaseUrl, supabaseKey, clientOptions);
};

module.exports = {
    getSupabaseClient,
};
