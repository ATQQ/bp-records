# Docker 部署指南

本项目支持使用 Docker 进行容器化部署，提供了生产环境和开发环境两种配置。

## 快速开始

### 生产环境部署

```bash
# 构建并运行生产环境容器
pnpm docker:prod

# 或者使用原生 Docker 命令
docker build -t bp-records .
docker run -p 3000:80 bp-records
```

访问 http://localhost:3000 查看应用。

### 开发环境

```bash
# 启动开发环境容器（支持热重载）
pnpm docker:dev
```

访问 http://localhost:8080 查看开发环境。

## 文件说明

### Dockerfile
生产环境的多阶段构建文件：
- **构建阶段**: 使用 Node.js 18 Alpine 镜像安装依赖并构建应用
- **生产阶段**: 使用 Nginx Alpine 镜像提供静态文件服务

### Dockerfile.dev
开发环境的构建文件，支持热重载和实时开发。

### docker-compose.yml
Docker Compose 配置文件，包含：
- `bp-records`: 生产环境服务（端口 3000）
- `bp-records-dev`: 开发环境服务（端口 8080，需要 `--profile dev`）

### nginx.conf
Nginx 配置文件，包含：
- Gzip 压缩
- 静态资源缓存策略
- SPA 路由支持
- 安全头设置
- 健康检查端点

### .dockerignore
排除不需要复制到镜像中的文件，减小镜像体积。

## 可用命令

```bash
# 构建生产镜像
pnpm docker:build

# 运行生产容器
pnpm docker:run

# 启动开发环境
pnpm docker:dev

# 启动生产环境
pnpm docker:prod

# 停止所有容器
pnpm docker:stop
```

## 高级配置

### 环境变量

可以通过环境变量配置应用：

```bash
# 设置生产环境
docker run -p 3000:80 -e NODE_ENV=production bp-records
```

### 数据持久化

如果需要持久化数据，可以挂载卷：

```bash
docker run -p 3000:80 -v /path/to/data:/app/data bp-records
```

### 自定义 Nginx 配置

可以挂载自定义的 Nginx 配置：

```bash
docker run -p 3000:80 -v /path/to/nginx.conf:/etc/nginx/nginx.conf bp-records
```

## 生产部署建议

### 1. 使用 Docker Compose

```yaml
version: '3.8'
services:
  bp-records:
    image: bp-records:latest
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### 2. 反向代理

建议在生产环境中使用反向代理（如 Nginx 或 Traefik）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. HTTPS 配置

使用 Let's Encrypt 或其他 SSL 证书提供商配置 HTTPS。

### 4. 健康检查

容器提供了健康检查端点 `/health`：

```bash
curl http://localhost:3000/health
```

### 5. 日志管理

配置日志驱动程序：

```yaml
services:
  bp-records:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   
   # 使用不同端口
   docker run -p 8080:80 bp-records
   ```

2. **构建失败**
   ```bash
   # 清理 Docker 缓存
   docker system prune -a
   
   # 重新构建
   docker build --no-cache -t bp-records .
   ```

3. **容器无法启动**
   ```bash
   # 查看容器日志
   docker logs bp-records-app
   
   # 进入容器调试
   docker exec -it bp-records-app sh
   ```

### 性能优化

1. **多阶段构建**: 已使用多阶段构建减小镜像体积
2. **Gzip 压缩**: Nginx 配置中已启用 Gzip
3. **静态资源缓存**: 配置了合适的缓存策略
4. **代码分割**: Vite 配置中已启用代码分割

## 监控和维护

### 容器监控

```bash
# 查看容器状态
docker ps

# 查看资源使用情况
docker stats

# 查看容器日志
docker logs -f bp-records-app
```

### 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并部署
docker-compose up --build -d
```