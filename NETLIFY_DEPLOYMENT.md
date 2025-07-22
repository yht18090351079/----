# 地质灾害预警系统 - Netlify 部署指南

## 项目概述

这是一个基于 CesiumJS 的地质灾害预警系统，包含 3D 地球监控大屏和多个原型页面。项目已配置为可直接部署到 Netlify 的静态网站。

## 部署步骤

### 方法一：通过 Git 仓库部署（推荐）

1. **准备 Git 仓库**
   ```bash
   # 如果还没有初始化 Git 仓库
   git init
   git add .
   git commit -m "Initial commit for Netlify deployment"
   
   # 推送到 GitHub/GitLab/Bitbucket
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **在 Netlify 中连接仓库**
   - 登录 [Netlify](https://app.netlify.com/)
   - 点击 "New site from Git"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 选择这个项目的仓库
   - 配置构建设置：
     - **Build command**: `echo 'No build step required'`
     - **Publish directory**: `.` (根目录)
     - **Production branch**: `main`

3. **部署完成**
   - Netlify 会自动检测 `netlify.toml` 配置文件
   - 部署完成后会提供一个 `.netlify.app` 域名

### 方法二：手动拖拽部署

1. **准备部署文件**
   - 确保所有文件都在项目根目录
   - 删除或忽略 `node_modules` 文件夹（如果很大）

2. **拖拽部署**
   - 登录 [Netlify](https://app.netlify.com/)
   - 将整个项目文件夹拖拽到 Netlify 的部署区域
   - 等待部署完成

## 配置说明

### netlify.toml 配置文件

项目包含了完整的 `netlify.toml` 配置文件，包括：

- **重定向规则**: 处理中文路径和友好URL
- **CORS 头部**: 解决跨域问题
- **缓存设置**: 优化静态资源加载
- **错误页面**: 自定义404页面

### 主要页面路由

部署后可通过以下URL访问：

- **主页**: `https://your-site.netlify.app/`
- **CesiumJS 稳定版**: `https://your-site.netlify.app/cesium-stable.html`
- **PC端原型**: `https://your-site.netlify.app/原型页面/pc端/index.html`
- **监控仪表板**: `https://your-site.netlify.app/dashboard`
- **地灾监控大屏**: `https://your-site.netlify.app/geological-dashboard`

## 注意事项

### 1. CesiumJS 资源加载

项目使用 CesiumJS CDN 资源，确保：
- 网络连接正常
- CDN 资源可访问
- 如需离线使用，考虑下载 CesiumJS 到本地

### 2. 中文路径处理

项目包含中文路径（如 `原型页面`），Netlify 会自动处理 URL 编码。

### 3. 环境变量（如需要）

如果项目需要环境变量，在 Netlify 控制台中设置：
- 进入 Site settings > Environment variables
- 添加所需的环境变量

### 4. 自定义域名

部署后可以配置自定义域名：
- 进入 Site settings > Domain management
- 添加自定义域名
- 配置 DNS 记录

## 性能优化

### 1. 资源缓存

配置文件已设置适当的缓存策略：
- 静态资源（JS/CSS/图片）：1年缓存
- HTML文件：1小时缓存

### 2. 压缩优化

Netlify 自动启用：
- Gzip 压缩
- Brotli 压缩（支持的浏览器）

### 3. CDN 加速

Netlify 提供全球 CDN，自动优化访问速度。

## 故障排除

### 常见问题

1. **页面无法加载**
   - 检查文件路径是否正确
   - 确认 `netlify.toml` 配置正确

2. **CesiumJS 无法加载**
   - 检查网络连接
   - 确认 CDN 资源可访问
   - 查看浏览器控制台错误信息

3. **中文路径问题**
   - 确保文件编码为 UTF-8
   - 检查重定向规则是否正确

### 调试方法

1. **查看部署日志**
   - 在 Netlify 控制台查看部署日志
   - 检查是否有错误信息

2. **浏览器开发者工具**
   - 检查网络请求
   - 查看控制台错误
   - 验证资源加载状态

## 更新部署

### Git 仓库方式
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

### 手动方式
重新拖拽文件夹到 Netlify 部署区域。

## 联系支持

如遇到部署问题，可以：
- 查看 [Netlify 文档](https://docs.netlify.com/)
- 联系 Netlify 支持团队
- 检查项目配置文件

---

**部署时间**: 通常 1-3 分钟
**支持的浏览器**: Chrome, Firefox, Safari, Edge (现代版本)
**移动端支持**: 响应式设计，支持移动设备访问
