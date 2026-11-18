import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from '../config/env.js';

// A aplicação continua navegável sem configuração, mas operações reais exigem Supabase.
export const supabase = hasSupabaseConfig
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
    })
  : null;
