import { createClient } from "npm:@supabase/supabase-js@2.32.0";

// CORS 头设置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

Deno.serve(async (req: Request) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Parse request body
    const { userId, role, banned, bannedUntil } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (role) {
      updateData.app_metadata = { role };
    }

    if (typeof banned === 'boolean') {
      if (banned) {
        updateData.banned_until = bannedUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        updateData.banned_until = null;
      }
    }

    // Update user using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(userId, updateData);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Return formatted user data
    const formattedUser = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.app_metadata?.role || 'user',
      is_banned: !!data.user.banned_until,
      banned_until: data.user.banned_until,
    };

    return new Response(JSON.stringify({ 
      data: { 
        success: true, 
        user: formattedUser 
      } 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
