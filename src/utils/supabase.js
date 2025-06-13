import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

export const initializeSupabase = (url, key) => {
  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (error) {
    console.error('Supabase 初始化失败:', error);
    throw error;
  }
};

export const getSupabaseClient = () => {
  return supabaseClient;
};

export const isSupabaseConfigured = () => {
  return supabaseClient !== null;
};
