# COS 文件上传管理系统

基于 **Vite + React 19 + TypeScript + Supabase** 构建的现代化文件上传管理和用户管理系统。

## ✨ 特性

- 🔐 **完整的用户认证系统**
  - 用户注册/登录
  - 密码重置
  - 角色管理（管理员/普通用户）

- 👥 **用户管理**
  - 管理员可查看所有用户
  - 用户启用/禁用功能
  - 角色权限管理

- 📁 **文件管理**
  - 文件上传记录
  - 上传历史追踪

- 🛡️ **安全特性**
  - Supabase Row Level Security (RLS)
  - 基于角色的访问控制
  - 用户状态管理

## 🚀 技术栈

### 前端

- **Vite 7.2.2** - 快速构建工具
- **React 19.2.0** - UI 框架
- **TypeScript 5.9.3** - 类型安全
- **Tailwind CSS 4.1.17** - 样式框架
- **shadcn/ui + Radix UI** - UI 组件库
- **@tanstack/react-table** - 数据表格
- **React Router 7.9.5** - 路由管理

### 后端

- **Supabase** - 后端即服务
  - 用户认证
  - 数据库
  - Edge Functions
  - Row Level Security

### 包管理

- **pnpm 10.21.0** - 快速包管理器

## 📦 安装

```bash
# 克隆仓库
git clone https://github.com/Xaviw/cos-file-manage.git

# 进入项目目录
cd cos-file-manage

# 安装依赖
pnpm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 文件，配置 Supabase 凭据
```

## 🛠️ 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 代码检查
pnpm lint

# 自动修复代码问题
pnpm lint:fix
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/              # 基础 UI 组件
│   ├── authenticated-route.tsx
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   └── ...
├── contexts/            # React Context
│   └── user-context.tsx
├── lib/                 # 工具库
│   ├── client.ts        # Supabase 客户端
│   └── utils.ts
├── pages/               # 页面组件
│   ├── home.tsx
│   ├── login.tsx
│   ├── user-management.tsx
│   └── ...
├── types/               # TypeScript 类型定义
│   └── user.ts
└── styles/              # 样式文件
    └── globals.css

supabase/
└── functions/           # Edge Functions
    ├── get-users/
    └── update-user/

docs/                    # 文档
├── EDGE-FUNCTIONS-DEPLOY.md
└── EDGE-FUNCTIONS-CORS.md
```

## 🔑 环境配置

创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
```

## 🎯 核心功能

### 1. 用户认证

- 用户注册/登录
- 密码重置
- 会话管理
- 路由守卫

### 2. 角色管理

- **管理员**：可管理所有用户
- **普通用户**：只能查看自己的数据

### 3. 用户管理（仅管理员）

- 查看所有用户列表
- 启用/禁用用户
- 设置用户角色
- 自定义列显示

### 4. Edge Functions

#### get-users

获取所有用户信息

```typescript
const { data } = await supabase.functions.invoke('get-users');
```

#### update-user

更新用户角色或状态

```typescript
const { data } = await supabase.functions.invoke('update-user', {
  body: {
    userId: 'user-id',
    role: 'admin' | 'user',
    banned: true | false,
  },
});
```

## 📚 文档

- [Edge Functions 部署指南](./docs/EDGE-FUNCTIONS-DEPLOY.md)
- [CORS 配置说明](./docs/EDGE-FUNCTIONS-CORS.md)
- [用户管理系统开发总结](./USER_MANAGEMENT_SUMMARY.md)
- [Edge Functions 重写说明](./EDGE_FUNCTIONS_REFACTOR.md)
- [CORS 错误修复](./CORS_FIX_SUMMARY.md)

## 🛡️ 安全特性

### Row Level Security (RLS)

- 基于用户角色的数据访问控制
- 用户只能访问自己的数据
- 管理员可以访问所有数据

### 用户状态管理

- 支持用户禁用/启用
- 禁用用户无法登录
- 禁用状态可设置过期时间

## 🎨 UI 特性

- 响应式设计，支持移动端
- 深色/浅色主题支持（可扩展）
- 直观的用户界面
- 实时数据更新
- 加载状态和错误处理

## 📝 开发注意事项

1. **代码规范**：项目使用 ESLint + Prettier 严格控制代码质量
2. **类型安全**：使用 TypeScript 确保类型安全
3. **路径别名**：配置了 `@/` 指向 `src/` 目录
4. **组件设计**：基于 shadcn/ui + Radix UI 的可复用组件
5. **状态管理**：使用 React Context 进行全局状态管理

## 🚀 部署

### 部署 Edge Functions

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录并关联项目
supabase login
supabase link --project-ref <your-project-ref>

# 部署函数
supabase functions deploy get-users
supabase functions deploy update-user

# 设置环境变量
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 部署前端

```bash
# 构建项目
pnpm build

# 将 dist/ 目录部署到您的服务器
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

Claude - Anthropic 的 AI 编程助手

## 🙏 致谢

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Generated with Claude Code** 🤖
