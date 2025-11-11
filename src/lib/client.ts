import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY!;

// 创建单例实例
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// 保留 createClient 函数以兼容旧代码（但不推荐使用）
export function createClient() {
  return supabase;
}
