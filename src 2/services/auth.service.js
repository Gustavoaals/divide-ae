import { supabase } from '../lib/supabase.js';

function requireClient() {
  if (!supabase) throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.');
  return supabase;
}

export const authService = {
  async getSession() {
    const { data, error } = await requireClient().auth.getSession();
    if (error) throw error;
    return data.session;
  },
  async signIn(email, password) {
    const { data, error } = await requireClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async signUp(name, email, password) {
    const { data, error } = await requireClient().auth.signUp({
      email, password, options: { data: { full_name: name } },
    });
    if (error) throw error;
    return data;
  },
  async resetPassword(email) {
    const { error } = await requireClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/redefinir-senha`,
    });
    if (error) throw error;
  },
  async updatePassword(password) {
    const { error } = await requireClient().auth.updateUser({ password });
    if (error) throw error;
  },
  async signOut() {
    const { error } = await requireClient().auth.signOut();
    if (error) throw error;
  },
  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe() {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },
};
