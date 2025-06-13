# 部署指南

本项目支持通过 GitHub Actions 自动部署到 GitHub Pages。

## GitHub Pages 部署

### 自动部署设置

1. **启用 GitHub Pages**
   - 进入仓库的 Settings 页面
   - 找到 "Pages" 选项
   - 在 "Source" 中选择 "GitHub Actions"

2. **推送代码触发部署**
   - 当代码推送到 `main` 或 `master` 分支时，会自动触发构建和部署
   - 部署完成后，可以通过 `https://[username].github.io/[repository-name]/` 访问应用

### 工作流程说明

项目包含以下 GitHub Actions 工作流：

- **构建阶段** (`.github/workflows/deploy.yml`)
  - 安装 Node.js 18
  - 安装 pnpm 包管理器
  - 安装项目依赖
  - 构建生产版本
  - 上传构建产物

- **部署阶段**
  - 仅在 main/master 分支触发
  - 将构建产物部署到 GitHub Pages

### 环境变量

部署过程中会自动设置以下环境变量：
- `GITHUB_PAGES=true` - 标识为 GitHub Pages 部署
- `GITHUB_REPOSITORY` - 自动获取仓库信息用于配置 base path

### Vite 配置适配

项目的 `vite.config.js` 已经配置为支持 GitHub Pages 部署：

- **Base Path**: 自动根据仓库名设置正确的 base path
- **构建优化**: 启用代码分割和资源优化
- **输出目录**: 统一使用 `dist` 目录

### 本地测试

在推送到 GitHub 之前，可以本地测试构建：

```bash
# 安装依赖
pnpm install

# 构建生产版本
GITHUB_PAGES=true pnpm build

# 预览构建结果
pnpm preview
```

### 故障排除

1. **部署失败**
   - 检查 Actions 页面的错误日志
   - 确保 GitHub Pages 已正确启用
   - 检查分支名是否为 main 或 master

2. **资源加载失败**
   - 确认 base path 配置正确
   - 检查静态资源路径是否使用相对路径

3. **权限问题**
   - 确保仓库的 Actions 权限已启用
   - 检查 GITHUB_TOKEN 权限设置

## 手动部署

如果需要手动部署到其他平台，可以使用以下命令：

```bash
# 构建
pnpm build

# dist 目录包含所有静态文件，可以部署到任何静态托管服务
```

支持的部署平台：
- GitHub Pages
- Vercel
- Netlify
- Surge.sh
- 任何支持静态文件的托管服务