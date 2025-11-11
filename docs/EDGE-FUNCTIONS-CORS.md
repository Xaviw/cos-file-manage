# Supabase Edge Functions CORS 配置指南

## 🚨 问题描述

调用 Edge Functions 时出现 CORS 错误：
```
Access to fetch at 'https://...supabase.co/functions/v1/get-users' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ 解决方案

Supabase Edge Functions 需要在函数内部**显式设置 CORS 头**。

## 📋 完整的 CORS 配置

### 1. 定义 CORS 头常量

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};
```

### 2. 处理 OPTIONS 预检请求

```typescript
Deno.serve(async (req: Request) => {
  // 🚨 必须处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // ... 其他逻辑
});
```

### 3. 为所有响应添加 CORS 头

```typescript
// 成功响应
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});

// 错误响应
return new Response(JSON.stringify({ error: '...' }), {
  status: 400,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

## 🔧 完整示例

### get-users 函数

```typescript
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
    // ... 函数逻辑

    return new Response(JSON.stringify({ data: ... }), {
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
```

## 📝 CORS 头说明

| 头名称 | 值 | 说明 |
|--------|-----|------|
| `Access-Control-Allow-Origin` | `*` | 允许所有域名访问（生产环境建议指定具体域名） |
| `Access-Control-Allow-Headers` | `authorization, x-client-info, apikey, content-type` | 允许的请求头 |
| `Access-Control-Allow-Methods` | `POST, GET, OPTIONS, PUT, DELETE, PATCH` | 允许的 HTTP 方法 |
| `Access-Control-Max-Age` | `86400` | 预检请求缓存时间（秒） |
| `Access-Control-Allow-Credentials` | `false` | 是否允许携带凭证 |

## 🔒 生产环境建议

### 限制允许的域名

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',  // 指定具体域名
  // 其他设置...
};
```

### 从环境变量读取域名

```typescript
const allowedOrigin = Deno.env.get('ALLOWED_ORIGINS') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  // 其他设置...
};
```

## 🧪 测试 CORS

### 使用 curl 测试 OPTIONS 请求

```bash
curl -X OPTIONS \
  https://your-project.supabase.co/functions/v1/get-users \
  -H 'Origin: http://localhost:5173' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization'
```

**期望响应**：
- 状态码：200
- 包含 CORS 头

### 使用浏览器开发者工具

1. 打开 Chrome DevTools (F12)
2. 切换到 Network 标签
3. 发起请求
4. 查看响应头是否包含 CORS 头

## ❌ 常见错误

### 错误 1：缺少 OPTIONS 处理
```typescript
// ❌ 错误
Deno.serve(async (req: Request) => {
  // 没有处理 OPTIONS
});

// ✅ 正确
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
});
```

### 错误 2：响应中缺少 CORS 头
```typescript
// ❌ 错误
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }  // 缺少 CORS 头
});

// ✅ 正确
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

### 错误 3：Access-Control-Allow-Headers 不完整
```typescript
// ❌ 错误
'Access-Control-Allow-Headers': 'content-type'

// ✅ 正确
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
```

## 📚 参考资源

- [MDN CORS 指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Supabase Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [CORS 预检请求](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)

---

**修复状态**：✅ 已修复，两个函数都已添加完整 CORS 支持
**更新时间**：2025-11-11 18:12
