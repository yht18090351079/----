# 地质灾害预警系统 - PC端原型

## 项目概述

基于PC端原型设计大纲开发的地质灾害预警系统前端原型，采用纯前端技术栈，支持Netlify部署和proxy-server代理。

## 技术栈

- **前端框架**: 原生HTML5 + CSS3 + JavaScript ES6+
- **样式系统**: CSS Variables + CSS Grid + Flexbox
- **图表库**: ECharts 5.4.3
- **字体**: Google Fonts (Orbitron, Roboto, Roboto Mono)
- **部署**: Netlify + Proxy Server
- **设计风格**: 科技感深色主题，蓝色发光效果

## 项目结构

```
原型页面/pc端/
├── index.html                          # 系统首页
├── README.md                           # 项目说明
├── common/                             # 公共资源
│   ├── css/
│   │   ├── reset.css                   # CSS重置样式
│   │   └── variables.css               # CSS变量定义
│   └── js/                             # 公共JavaScript
├── pages/                              # 页面目录
│   ├── monitor/                        # 监控模块
│   │   ├── geological-disaster-dashboard.html  # 实时监控大屏
│   │   ├── css/
│   │   │   └── geological-disaster-dashboard.css
│   │   └── js/
│   │       └── geological-disaster-dashboard.js
│   ├── warning/                        # 预警模块
│   │   ├── warning-publish.html        # 预警发布页面
│   │   ├── warning-monitor.html        # 预警监控页面
│   │   ├── css/
│   │   │   ├── warning-publish.css
│   │   │   └── warning-monitor.css
│   │   └── js/
│   │       ├── warning-publish.js
│   │       └── warning-monitor.js
│   ├── data/                           # 数据分析模块
│   │   ├── data-analysis.html          # 数据分析页面
│   │   ├── css/
│   │   │   └── data-analysis.css
│   │   └── js/
│   │       └── data-analysis.js
│   └── system/                         # 系统设置模块
│       ├── system-settings.html        # 系统设置页面
│       ├── css/
│       └── js/
└── assets/                             # 静态资源
    ├── images/
    ├── icons/
    └── fonts/
```

## 功能模块

### 1. 系统首页 (`index.html`)
- **功能**: 系统入口，展示各功能模块
- **特色**: 
  - 科技感设计，发光动画效果
  - 响应式布局，支持多设备访问
  - 快速导航，一键进入各功能模块

### 2. 实时监控大屏 (`pages/monitor/geological-disaster-dashboard.html`)
- **功能**: 全域地质灾害态势监控
- **特色**:
  - 大屏展示设计，适合指挥中心
  - 实时数据更新，30秒自动刷新
  - 多维度数据可视化
  - 智能预警推送
  - 任务管理面板

### 3. 预警发布系统 (`pages/warning/warning-publish.html`)
- **功能**: 预警信息发布和管理
- **特色**:
  - 分步骤预警发布流程
  - 多渠道发布支持（网站、移动端、短信、邮件）
  - 富文本编辑器，支持模板和AI辅助
  - 实时预览功能，支持多端预览
  - 表单验证和数据校验

### 4. 预警监控系统 (`pages/warning/warning-monitor.html`)
- **功能**: 预警信息监控和管理
- **特色**:
  - 预警列表展示和筛选
  - 预警详情查看和操作
  - 发布渠道统计
  - 处置进展时间轴
  - 预警状态管理

### 5. 数据分析系统 (`pages/data/data-analysis.html`)
- **功能**: 多维度数据分析和可视化
- **特色**:
  - 数据筛选和过滤
  - 多种图表类型（折线图、饼图、柱状图、热力图）
  - 全屏图表查看
  - 数据导出功能
  - 实时数据更新

### 6. 系统设置 (`pages/system/system-settings.html`)
- **功能**: 系统配置和管理
- **特色**:
  - 分类设置菜单
  - 基础参数配置
  - 用户权限管理
  - 设备状态监控
  - 系统维护功能

## 设计特色

### 1. 科技感视觉设计
- **色彩方案**: 深色背景 + 蓝色发光主题
- **动画效果**: 呼吸灯、悬停动画、加载动画
- **字体选择**: Orbitron科技字体 + Roboto现代字体
- **布局设计**: 大屏适配 + 响应式布局

### 2. 交互体验优化
- **操作反馈**: Toast提示、状态变化、加载状态
- **数据可视化**: ECharts图表、实时更新、交互操作
- **表单设计**: 分步骤流程、实时验证、智能提示
- **导航设计**: 面包屑导航、快速访问、模块跳转

### 3. 技术实现亮点
- **CSS变量系统**: 统一的设计令牌管理
- **模块化架构**: 独立的页面和组件
- **响应式设计**: 支持多种屏幕尺寸
- **性能优化**: 懒加载、防抖节流、内存管理

## 部署说明

### 1. 本地开发
```bash
# 直接打开index.html文件
open index.html

# 或使用本地服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

### 2. Netlify部署
1. 将整个`pc端`目录上传到Netlify
2. 设置构建命令为空（纯静态站点）
3. 设置发布目录为根目录
4. 配置自定义域名（可选）

### 3. Proxy Server配置
```javascript
// netlify.toml 配置示例
[[redirects]]
  from = "/api/*"
  to = "https://your-api-server.com/api/:splat"
  status = 200
  force = true
```

## 浏览器支持

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 开发规范

### 1. 代码规范
- 使用ES6+语法
- 遵循语义化HTML
- CSS采用BEM命名规范
- JavaScript使用模块化开发

### 2. 文件组织
- HTML、CSS、JS分离
- 公共样式和脚本复用
- 资源文件统一管理
- 模块化目录结构

### 3. 性能优化
- 图片懒加载
- CSS和JS压缩
- 缓存策略配置
- 网络请求优化

## 更新日志

### v1.0.0 (2025-07-24)
- ✅ 完成系统首页设计和开发
- ✅ 完成实时监控大屏功能
- ✅ 完成预警发布系统
- ✅ 完成预警监控系统
- ✅ 完成数据分析系统
- ✅ 完成系统设置基础功能
- ✅ 完成响应式设计适配
- ✅ 完成科技感视觉设计

## 后续计划

### 功能扩展
- [ ] 3D可视化场景开发
- [ ] 应急指挥系统开发
- [ ] 移动端适配优化
- [ ] 离线功能支持

### 技术优化
- [ ] 组件化重构
- [ ] 状态管理优化
- [ ] 性能监控集成
- [ ] 自动化测试

## 联系信息

- **项目**: 地质灾害预警系统PC端原型
- **版本**: v1.0.0
- **更新**: 2025-07-24
- **技术栈**: HTML5 + CSS3 + JavaScript + ECharts

---

*本项目基于PC端原型设计大纲开发，采用纯前端技术实现，支持Netlify部署和proxy-server代理。*
