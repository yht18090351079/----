# Netlify 部署检查清单

## 📋 部署前检查

### ✅ 必需文件
- [x] `netlify.toml` - Netlify 配置文件
- [x] `_headers` - HTTP 头部配置
- [x] `_redirects` - 重定向规则
- [x] `index.html` - 主页文件
- [x] `404.html` - 错误页面
- [x] `package.json` - 项目配置
- [x] `.gitignore` - Git 忽略文件
- [x] `README.md` - 项目说明

### ✅ 项目结构检查
- [x] 主要HTML文件存在
- [x] CesiumJS 依赖已安装
- [x] 原型页面目录完整
- [x] 静态资源路径正确

### ✅ 配置文件检查
- [x] `netlify.toml` 配置正确
- [x] 重定向规则设置完整
- [x] CORS 头部配置正确
- [x] 缓存策略设置合理

## 🚀 部署步骤

### 方法一：Git 仓库部署（推荐）

1. **初始化 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Netlify deployment"
   ```

2. **推送到远程仓库**
   ```bash
   # GitHub
   git remote add origin https://github.com/username/geological-disaster-warning.git
   git push -u origin main
   
   # 或 GitLab
   git remote add origin https://gitlab.com/username/geological-disaster-warning.git
   git push -u origin main
   ```

3. **在 Netlify 中连接仓库**
   - 访问 https://app.netlify.com/
   - 点击 "New site from Git"
   - 选择 Git 提供商
   - 选择项目仓库
   - 确认构建设置（会自动读取 netlify.toml）
   - 点击 "Deploy site"

### 方法二：手动部署

1. **准备部署包**
   - 确保所有文件都在项目根目录
   - 可以删除 `node_modules` 文件夹（Netlify 会自动安装）

2. **拖拽部署**
   - 访问 https://app.netlify.com/
   - 将项目文件夹拖拽到部署区域
   - 等待部署完成

## 🔍 部署后验证

### ✅ 基本功能测试
- [ ] 主页 (`/`) 正常加载
- [ ] CesiumJS 页面 (`/cesium-stable.html`) 正常显示
- [ ] 3D 地球正常渲染
- [ ] 原型页面可以访问
- [ ] 监控仪表板功能正常

### ✅ 路由测试
- [ ] 友好URL重定向正常 (`/dashboard`, `/monitor` 等)
- [ ] 中文路径正常访问
- [ ] 404页面正常显示
- [ ] 错误处理正确

### ✅ 性能测试
- [ ] 页面加载速度正常
- [ ] 静态资源缓存生效
- [ ] CesiumJS 资源加载正常
- [ ] 移动端访问正常

### ✅ 安全检查
- [ ] CORS 头部设置正确
- [ ] 安全头部配置生效
- [ ] 没有敏感信息泄露

## 🛠️ 常见问题解决

### 问题1：CesiumJS 无法加载
**症状**: 3D地球不显示，控制台有错误
**解决方案**:
- 检查网络连接
- 确认 CDN 资源可访问
- 检查 CORS 配置

### 问题2：中文路径无法访问
**症状**: 包含中文的URL返回404
**解决方案**:
- 确认 `_redirects` 文件配置正确
- 检查文件编码为 UTF-8
- 验证重定向规则

### 问题3：页面样式丢失
**症状**: 页面显示但样式不正确
**解决方案**:
- 检查 CSS 文件路径
- 确认 MIME 类型设置正确
- 验证缓存配置

### 问题4：构建失败
**症状**: Netlify 构建过程出错
**解决方案**:
- 检查 `package.json` 配置
- 确认 Node.js 版本兼容
- 查看构建日志详细信息

## 📊 性能优化建议

### 缓存策略
- 静态资源：1年缓存
- HTML文件：1小时缓存
- API响应：根据需要设置

### 压缩优化
- Netlify 自动启用 Gzip/Brotli 压缩
- 图片资源建议使用 WebP 格式
- 考虑使用 CDN 加速

### 监控设置
- 配置 Netlify Analytics
- 设置部署通知
- 监控网站性能指标

## 🔄 更新部署

### Git 仓库方式
```bash
# 修改代码后
git add .
git commit -m "Update: 描述更改内容"
git push origin main
# Netlify 会自动重新部署
```

### 手动方式
重新拖拽文件夹到 Netlify 部署区域

## 📞 获取帮助

如果遇到问题：
1. 查看 [Netlify 文档](https://docs.netlify.com/)
2. 检查 [Netlify 社区](https://community.netlify.com/)
3. 查看项目的 `NETLIFY_DEPLOYMENT.md` 详细说明
4. 联系技术支持团队

---

**部署完成后记得**:
- [ ] 更新 README.md 中的部署状态徽章
- [ ] 配置自定义域名（如需要）
- [ ] 设置环境变量（如需要）
- [ ] 配置表单处理（如需要）
- [ ] 设置分析和监控
