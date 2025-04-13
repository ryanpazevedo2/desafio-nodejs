/**
 * Configurações do supabase
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

/**
 * Criar cliente Supabase
 * @return {Object} Cliente Supabase
 */
const getSupabaseClient = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'URL e chave do Supabase devem ser fornecidas no arquivo .env',
        );
    }

    return createClient(supabaseUrl, supabaseKey);
};

module.exports = {
    getSupabaseClient,
};
