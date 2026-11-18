import { supabase } from '../lib/supabase.js';

function client() {
  if (!supabase) throw new Error('O Supabase ainda não foi configurado. Consulte o README.');
  return supabase;
}

export const householdService = {
  async getMyHouseholds() {
    const { data, error } = await client()
      .from('household_members')
      .select('role, household:households(id, name, address, created_at)')
      .order('created_at', { foreignTable: 'households', ascending: false });
    if (error) throw error;
    return (data ?? []).map((membership) => ({ ...membership.household, role: membership.role }));
  },
  async createHousehold(name, address = '') {
    const { data, error } = await client().rpc('create_household', {
      household_name: name,
      household_address: address || null,
    });
    if (error) throw error;
    return data;
  },
};
