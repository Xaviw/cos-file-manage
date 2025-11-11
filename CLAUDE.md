# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **COS 文件上传管理系统**，基于 Vite + React 19 + TypeScript 构建，使用 Supabase 作为后端服务，提供用户认证、文件上传记录管理和用户管理功能。

## 技术栈

- **构建工具**: Vite 7.2.2
- **前端框架**: React 19.2.0
- **语言**: TypeScript 5.9.3
- **样式**: Tailwind CSS 4.1.17
- **UI 组件**: Radix UI + shadcn/ui
- **路由**: React Router DOM 7.9.5
- **后端服务**: Supabase (认证、API)
- **包管理器**: pnpm 10.21.0
- **代码质量**: ESLint + Prettier

## 开发命令

### 基础命令
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

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check
```

### 环境配置

项目使用环境变量进行 Supabase 配置：
- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY`: Supabase 匿名/公钥

环境变量文件位于 `.env.local`。

## 项目结构

```
src/
├── components/           # 可复用组件
│   ├── ui/              # 基础 UI 组件 (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── authenticated-route.tsx  # 路由守卫组件
│   ├── forgot-password-form.tsx
│   ├── header.tsx       # 页面头部导航
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   └── update-password-form.tsx
├── contexts/            # React Context
│   └── user-context.tsx # 用户认证状态管理
├── lib/                 # 工具库
│   ├── client.ts        # Supabase 客户端配置
│   └── utils.ts         # 通用工具函数
├── pages/               # 页面组件
│   ├── forgot-password.tsx
│   ├── home.tsx         # 主页
│   ├── login.tsx        # 登录页
│   ├── sign-up.tsx      # 注册页
│   ├── update-password.tsx
│   ├── upload-records.tsx  # 上传记录页
│   └── user-management.tsx # 用户管理页
├── styles/              # 样式文件
│   └── globals.css      # 全局样式
├── App.tsx              # 应用根组件
├── main.tsx             # 应用入口
└── vite-env.d.ts        # Vite 类型声明
```

## 核心架构

### 1. 路由结构 (src/App.tsx)
- 公开路由: `/login`, `/sign-up`, `/forgot-password`
- 受保护路由: `/`, `/upload-records`, `/user-management`, `/update-password`
- 所有受保护路由使用 `AuthenticatedRoute` 组件包装

### 2. 认证系统 (src/contexts/user-context.tsx)
- 使用 React Context 管理用户状态
- 通过 Supabase Auth 监听认证状态变化
- `useUser` hook 用于获取当前用户信息

### 3. Supabase 客户端 (src/lib/client.ts)
- 统一创建 Supabase 客户端实例
- 从环境变量读取配置

### 4. 页面组件
- 每个页面都包含 `<Header />` 组件
- 统一使用 `min-h-screen bg-gray-50` 布局
- 目前大部分功能页面为占位状态（标注"待开发功能"）

## 关键文件位置

### 认证相关
- 登录逻辑: `src/components/login-form.tsx`
- 注册逻辑: `src/components/sign-up-form.tsx`
- 密码重置: `src/components/forgot-password-form.tsx`
- 密码更新: `src/components/update-password-form.tsx`
- 用户状态: `src/contexts/user-context.tsx`

### 路由守卫
- `src/components/authenticated-route.tsx`

### 页面布局
- 导航头部: `src/components/header.tsx`
- 主页: `src/pages/home.tsx`
- 上传记录: `src/pages/upload-records.tsx`
- 用户管理: `src/pages/user-management.tsx`

### 配置
- Vite 配置: `vite.config.ts`
- TypeScript 配置: `tsconfig.json`
- ESLint 配置: `eslint.config.js`
- Prettier 配置: `.prettierrc`
- shadcn/ui 配置: `components.json`

## 开发注意事项

1. **代码风格**: 项目使用 Prettier 和 ESLint 严格控制代码质量
2. **路径别名**: 配置了 `@/` 指向 `src/` 目录
3. **UI 组件**: 基于 shadcn/ui + Radix UI 组件库
4. **响应式设计**: 使用 Tailwind CSS 的响应式类
5. **状态管理**: 使用 React Context 进行全局状态管理（目前主要是用户状态）

## 当前开发状态

- ✅ 基础项目架构搭建完成
- ✅ 用户认证系统完成
- ✅ 路由系统配置完成
- ⏳ 主页功能待开发
- ⏳ 文件上传功能待开发
- ⏳ 上传记录功能待开发
- ⏳ 用户管理功能待开发

## 相关资源

- [Vite 文档](https://vitejs.dev/)
- [React 19 文档](https://react.dev/)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 4 文档](https://tailwindcss.com/)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [React Router 7 文档](https://reactrouter.com/)
