# Edge Functions 部署说明

## 概述

本项目包含两个 Supabase Edge Functions，使用官方推荐的 Deno 运行时和 `@supabase/supabase-js@2.32.0` 客户端：

1. **get-users** - 获取用户列表
2. **update-user** - 更新用户状态

## Edge Functions 位置

```
supabase/
└── functions/
    ├── get-users/
    │   └── index.ts
    └── update-user/
        └── index.ts
```

## 部署步骤

### 1. 安装 Supabase CLI

```bash
npm install -g supabase
```

### 2. 登录 Supabase

```bash
supabase login
```

### 3. 关联项目

```bash
supabase link --project-ref <your-project-ref>
```

### 4. 部署 Edge Functions

```bash
# 部署 get-users 函数
supabase functions deploy get-users

# 部署 update-user 函数
supabase functions deploy update-user
```

### 5. 设置环境变量

确保以下环境变量已设置：

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## 函数功能

### get-users

**功能**: 获取所有用户的信息

**请求**:
- 方法: GET 或 POST
- 认证: 需要

**返回数据**:
```json
{
  "data": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "last_sign_in_at": "2024-01-01T00:00:00Z",
      "role": "admin" | "user",
      "is_banned": true | false,
      "banned_until": "2024-12-31T23:59:59Z"
    }
  ]
}
```

### update-user

**功能**: 更新用户的角色或状态

**请求**:
- 方法: POST
- 认证: 需要
- Body:
```json
{
  "userId": "user-id",
  "role": "admin" | "user",
  "banned": true | false,
  "bannedUntil": "2024-12-31T23:59:59Z"
}
```

**返回数据**:
```json
{
  "data": {
    "success": true,
    "user": { ... }
  }
}
```

## 测试函数

部署完成后，可以通过以下方式测试：

### 1. 使用 curl

```bash
# 获取用户列表
curl -X POST \
  https://<your-project-ref>.supabase.co/functions/v1/get-users \
  -H 'Authorization: Bearer <your-anon-key>'

# 更新用户状态
curl -X POST \
  https://<your-project-ref>.supabase.co/functions/v1/update-user \
  -H 'Authorization: Bearer <your-anon-key>' \
  -H 'Content-Type: application/json' \
  -d '{"userId": "user-id", "role": "admin"}'
```

### 2. 在应用中调用

```typescript
// 获取用户
const { data } = await supabase.functions.invoke('get-users')

// 更新用户
const { data } = await supabase.functions.invoke('update-user', {
  body: {
    userId: 'user-id',
    role: 'admin'
  }
})
```

## 技术实现

### 使用的库

- `@supabase/supabase-js@2.32.0` - Supabase JavaScript 客户端
- Deno 运行时 - Edge Functions 的执行环境

### 核心特性

1. **Service Role 权限**: 使用 `SUPABASE_SERVICE_ROLE_KEY` 访问受保护资源
2. **认证管理**: 
   - `get-users` 使用 `supabase.auth.admin.listUsers()` 获取所有用户
   - `update-user` 使用 `supabase.auth.admin.updateUserById()` 更新用户
3. **数据格式化**: 统一返回格式，提取关键字段
4. **错误处理**: 完整的错误捕获和返回机制

## 注意事项

1. **权限控制**: 这些函数需要 `SUPABASE_SERVICE_ROLE_KEY` 权限
2. **安全性**: 函数使用 Admin API，需要妥善保管 Service Role Key
3. **错误处理**: 所有函数都包含错误处理机制
4. **性能**: 函数使用 Deno 运行时，性能优异

## 故障排除

### 1. 部署失败

检查：
- Supabase CLI 版本
- 项目关联是否正确
- 网络连接

### 2. 调用失败

检查：
- 认证 token 是否有效
- 函数是否已部署
- 请求格式是否正确
- SUPABASE_SERVICE_ROLE_KEY 是否正确设置

### 3. 权限错误

检查：
- `SUPABASE_SERVICE_ROLE_KEY` 是否正确设置
- 环境变量是否生效
- 是否有权限调用 Admin API

## 参考资料

- [Supabase Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [Supabase CLI 文档](https://supabase.com/docs/reference/cli)
- [Supabase Admin API 文档](https://supabase.com/docs/reference/javascript/auth-admin)
