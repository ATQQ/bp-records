# 血压管家 - 智能血压管理应用

一个现代化的血压记录和管理应用，帮助用户轻松追踪血压数据，了解健康状况。

*使用 AI Claude-4-sonnet 生成*

## 🌟 功能特色

### 📊 核心功能
- **血压记录**：快速记录收缩压、舒张压、脉搏和备注信息
- **数据统计**：可视化图表展示血压趋势和统计分析
- **健康科普**：提供血压相关的健康知识和建议
- **回收站**：误删数据可恢复，数据安全有保障
- **存储设置**：支持本地存储和云端同步

### 💾 存储方式
- **本地存储**：数据保存在浏览器本地，无需网络
- **云端同步**：支持 Supabase 云数据库，多设备同步
- **数据导入导出**：支持配置和数据的备份与恢复

### 📱 用户体验
- **响应式设计**：完美适配手机、平板和桌面设备
- **现代化界面**：基于 Tailwind CSS 和 Radix UI 组件
- **流畅动画**：使用 Framer Motion 提供丝滑的交互体验
- **数据可视化**：使用 Recharts 展示清晰的图表分析

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化的前端框架
- **Vite** - 快速的构建工具
- **React Router** - 单页应用路由管理

### UI 组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Radix UI** - 无障碍的组件库
- **Lucide React** - 精美的图标库
- **Framer Motion** - 动画库

### 数据管理
- **React Hook Form** - 表单状态管理
- **Zod** - 数据验证
- **TanStack Query** - 服务端状态管理
- **Supabase** - 云数据库服务

### 图表可视化
- **Recharts** - React 图表库
- **Date-fns** - 日期处理工具

## 🚀 本地快速开始

### 1. 克隆项目并安装依赖
```bash
# 克隆项目
git clone https://github.com/ATQQ/bp-records.git
# 安装依赖（推荐使用 pnpm）
pnpm install
# 或使用 npm
npm install
```

### 2. 启动开发服务器
```bash
# 使用 pnpm
pnpm dev
# 或使用 npm
npm run dev
```

### 3. 访问应用
打开浏览器访问 `http://localhost:5173`

## 📖 使用指南

### 基本操作

#### 记录血压数据
1. 点击首页右上角的「记录」按钮
2. 输入收缩压、舒张压数值
3. 可选择性输入脉搏和备注信息
4. 选择记录时间（默认为当前时间）
5. 点击保存完成记录

#### 查看统计分析
1. 切换到「统计」标签页
2. 查看血压趋势图表
3. 可按日期筛选数据
4. 查看平均值和分类统计

#### 数据管理
1. 在记录列表中可以编辑或删除数据
2. 删除的数据会进入回收站
3. 在回收站中可以恢复或永久删除数据

### 存储配置

#### 本地存储（默认）
- 数据保存在浏览器本地存储中
- 无需额外配置，开箱即用
- 数据仅在当前设备和浏览器中可用

#### 云端同步（Supabase）
1. 进入「设置」页面
2. 选择「云端存储」
3. 输入 Supabase 项目 URL 和 API Key
4. 设置用户名用于数据隔离
5. 保存配置后数据将同步到云端

### 数据导入导出
- **导出配置**：在设置页面可以导出当前配置
- **导入配置**：可以导入之前导出的配置文件
- **数据备份**：云端存储的数据会自动备份

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   ├── ui/             # 基础 UI 组件
│   ├── BloodPressureForm.jsx      # 血压记录表单
│   ├── BloodPressureList.jsx      # 血压记录列表
│   ├── BloodPressureStats.jsx     # 统计图表
│   ├── BloodPressureEducation.jsx # 健康科普
│   ├── RecycleBin.jsx             # 回收站
│   └── StorageSettings.jsx        # 存储设置
├── contexts/           # React Context
│   └── StorageConfigContext.jsx   # 存储配置上下文
├── hooks/              # 自定义 Hooks
│   ├── useBloodPressureStore.js   # 血压数据管理
│   └── useStorageConfig.js        # 存储配置管理
├── pages/              # 页面组件
│   └── Index.jsx       # 主页面
├── services/           # 服务层
│   └── supabaseStorage.js         # Supabase 存储服务
├── utils/              # 工具函数
│   ├── bloodPressureUtils.js      # 血压相关工具
│   ├── dateUtils.js               # 日期工具
│   └── supabase.js                # Supabase 客户端
└── lib/                # 库文件
    └── utils.js        # 通用工具函数
```

## 🔧 开发指南

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 构建开发版本
npm run build:dev

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 React Hooks 最佳实践
- 组件采用函数式组件 + Hooks 模式
- 使用 TypeScript 类型注解（JSDoc）

### 添加新功能
1. 在 `src/components/` 中创建新组件
2. 在 `src/hooks/` 中添加相关的自定义 Hook
3. 在 `src/utils/` 中添加工具函数
4. 更新路由配置（如需要）

## 🌐 部署

### 构建项目
```bash
npm run build
```

### 部署选项
- **Vercel**：推荐，支持自动部署
- **Netlify**：简单易用的静态站点托管
- **GitHub Pages**：免费的静态站点托管
- **自建服务器**：将 `dist` 目录部署到任何 Web 服务器

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您在使用过程中遇到问题，可以：

1. 查看本文档的常见问题部分
2. 在 GitHub 上提交 Issue
3. 联系开发团队

## 📱 截图预览

*注：可以在此处添加应用的截图展示*

---

**血压管家** - 让健康管理更简单 ❤️
