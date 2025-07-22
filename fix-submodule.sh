#!/bin/bash

# 修复 Git 子模块问题的脚本

echo "🔧 开始修复 Git 子模块问题..."

# 1. 移除有问题的子模块缓存
echo "📝 移除子模块缓存..."
git rm --cached "3d大屏示例/threejs-demo" 2>/dev/null || true

# 2. 检查并删除可能存在的 .gitmodules 文件
if [ -f ".gitmodules" ]; then
    echo "🗑️ 删除 .gitmodules 文件..."
    rm .gitmodules
fi

# 3. 检查 threejs-demo 目录是否有自己的 .git 目录
if [ -d "3d大屏示例/threejs-demo/.git" ]; then
    echo "🗑️ 删除 threejs-demo 的 .git 目录..."
    rm -rf "3d大屏示例/threejs-demo/.git"
fi

# 4. 将 threejs-demo 作为普通目录添加到 Git
echo "➕ 将 threejs-demo 作为普通目录添加..."
git add "3d大屏示例/threejs-demo"

# 5. 添加所有新创建的 Netlify 配置文件
echo "➕ 添加 Netlify 配置文件..."
git add netlify.toml
git add _headers
git add _redirects
git add index.html
git add 404.html
git add README.md
git add NETLIFY_DEPLOYMENT.md
git add DEPLOYMENT_CHECKLIST.md
git add .gitignore

# 6. 提交更改
echo "💾 提交更改..."
git commit -m "Fix submodule issue and add Netlify deployment configuration

- Remove problematic submodule configuration for 3d大屏示例/threejs-demo
- Add complete Netlify deployment setup
- Set PC端原型页面 as main business system
- Add automatic redirect from homepage to PC prototype
- Include comprehensive deployment documentation"

echo "✅ Git 子模块问题已修复！"
echo "🚀 现在可以推送到 GitHub 并部署到 Netlify 了"

echo ""
echo "📋 下一步操作："
echo "1. 运行: git push origin main"
echo "2. 在 Netlify 中重新部署"
echo "3. 检查部署状态"
