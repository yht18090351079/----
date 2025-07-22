# 地质灾害预警系统

基于 CesiumJS 的 3D 地球监控大屏系统，提供实时地质灾害监测、预警和可视化功能。

## 🌟 功能特性

- 🌍 **3D 地球可视化** - 基于 CesiumJS 的高精度三维地球展示
- ⚠️ **实时预警监测** - 多源数据集成的智能预警系统
- 📊 **数据可视化** - 丰富的图表和多维度数据展示
- 🎛️ **智能管控** - 完整的管理控制台和业务流程管控
- 📱 **响应式设计** - 支持桌面端和移动端访问

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或启动代理服务器
npm start
```

访问 http://localhost:8080 查看系统。

### 主要页面

- **主页**: `/` 或 `/index.html`
- **CesiumJS 演示**: `/cesium-stable.html`
- **PC端原型**: `/原型页面/pc端/index.html`
- **监控仪表板**: `/原型页面/pc端/pages/monitor/dashboard.html`
- **地灾监控大屏**: `/原型页面/pc端/pages/monitor/geological-disaster-dashboard.html`

## 🌐 Netlify 部署

### 自动部署（推荐）

1. **推送到 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **连接 Netlify**
   - 登录 [Netlify](https://app.netlify.com/)
   - 点击 "New site from Git"
   - 选择你的仓库
   - 部署设置会自动从 `netlify.toml` 读取

3. **访问部署的网站**
   - 部署完成后获得 `*.netlify.app` 域名
   - 可配置自定义域名

### 手动部署

直接将项目文件夹拖拽到 Netlify 部署区域即可。

## 📁 项目结构

```
地灾预警/
├── index.html                 # 主页
├── cesium-stable.html         # CesiumJS 演示页面
├── 404.html                   # 错误页面
├── netlify.toml              # Netlify 配置
├── package.json              # 项目配置
├── proxy-server.js           # 本地开发服务器
├── 原型页面/                  # 原型页面目录
│   ├── pc端/                 # PC端页面
│   └── common/               # 公共资源
├── 建设方案/                  # 项目文档
└── node_modules/             # 依赖包
```

## 🛠️ 技术栈

- **前端框架**: 原生 HTML/CSS/JavaScript
- **3D 引擎**: CesiumJS 1.131.0
- **部署平台**: Netlify
- **开发服务器**: Node.js

## 📋 部署配置

项目包含完整的 Netlify 配置文件 (`netlify.toml`)，包括：

- ✅ 重定向规则处理
- ✅ CORS 跨域支持
- ✅ 静态资源缓存优化
- ✅ 自定义错误页面
- ✅ 中文路径支持

## 🔧 环境要求

- **Node.js**: >= 14.0.0
- **浏览器**: Chrome, Firefox, Safari, Edge (现代版本)
- **网络**: 需要访问 CesiumJS CDN 资源

## 📖 使用说明

### 开发环境

1. 克隆项目到本地
2. 运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器
4. 在浏览器中访问 http://localhost:8080

### 生产环境

项目已配置为静态网站，可直接部署到任何静态托管平台：

- Netlify（推荐）
- Vercel
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 🐛 故障排除

### 常见问题

1. **CesiumJS 无法加载**
   - 检查网络连接
   - 确认 CDN 资源可访问

2. **中文路径问题**
   - 确保文件编码为 UTF-8
   - 检查服务器配置

3. **页面无法访问**
   - 检查文件路径
   - 确认重定向规则

### 调试方法

- 查看浏览器开发者工具
- 检查网络请求状态
- 查看控制台错误信息

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：

- 📧 邮箱: [your-email@example.com]
- 🐛 问题反馈: [GitHub Issues]

---

**版本**: v1.0.0  
**更新时间**: 2024年  
**部署状态**: [![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)
