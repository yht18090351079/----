# 地质灾害预警系统原型页面

## 🎯 项目概述

这是地质灾害预警系统的前端原型页面，采用纯HTML、CSS、JavaScript开发，无需后端服务器即可直接在浏览器中运行。

## 🚀 快速开始

### 直接访问
```bash
# 打开PC端首页
open 原型页面/pc端/index.html

# 或直接访问监控大屏
open 原型页面/pc端/pages/monitor/dashboard.html
```

### 本地服务器（推荐）
```bash
# 使用Python启动服务器
cd 原型页面
python -m http.server 8080

# 然后访问 http://localhost:8080
```

## ✅ 已完成功能

### PC端监控大屏 ✨
- **文件位置**: `pc端/pages/monitor/dashboard.html`
- **功能特色**:
  - 🖥️ 科技感大屏界面设计
  - 📊 实时数据可视化展示
  - 🗺️ 全域态势地图模拟
  - ⚠️ 智能预警信息推送
  - 📈 ECharts图表集成
  - 🔄 自动数据更新机制
  - 📱 响应式布局适配

### 公共组件库
- **CSS变量系统**: 统一的设计规范
- **工具函数库**: 常用功能封装
- **模拟数据生成**: 完整的测试数据

## 📁 项目结构

```
原型页面/
├── README.md                    # 项目说明文档
├── common/                      # 公共资源
│   ├── css/                     # 公共样式
│   │   ├── reset.css           # 样式重置
│   │   ├── variables.css       # CSS变量定义
│   │   ├── components.css      # 通用组件样式
│   │   └── responsive.css      # 响应式样式
│   ├── js/                     # 公共脚本
│   │   ├── utils.js           # 工具函数
│   │   ├── api.js             # API接口
│   │   ├── components.js      # 通用组件
│   │   └── mock-data.js       # 模拟数据
│   └── assets/                # 静态资源
│       ├── images/            # 图片资源
│       ├── icons/             # 图标资源
│       └── fonts/             # 字体资源
├── pc端/                       # PC端页面
│   ├── index.html             # 首页入口
│   ├── pages/                 # 页面文件
│   │   ├── monitor/           # 监控模块
│   │   │   ├── dashboard.html # 监控大屏
│   │   │   ├── 3d-view.html   # 3D可视化
│   │   │   └── devices.html   # 设备状态
│   │   ├── warning/           # 预警模块
│   │   │   ├── publish.html   # 预警发布
│   │   │   ├── monitor.html   # 预警监控
│   │   │   └── history.html   # 预警历史
│   │   ├── data/              # 数据模块
│   │   │   ├── realtime.html  # 实时数据
│   │   │   ├── history.html   # 历史数据
│   │   │   └── analysis.html  # 数据分析
│   │   └── emergency/         # 应急模块
│   │       ├── command.html   # 指挥调度
│   │       └── resources.html # 资源管理
│   ├── css/                   # PC端样式
│   │   ├── layout.css         # 布局样式
│   │   ├── monitor.css        # 监控模块样式
│   │   ├── warning.css        # 预警模块样式
│   │   ├── data.css           # 数据模块样式
│   │   └── emergency.css      # 应急模块样式
│   └── js/                    # PC端脚本
│       ├── layout.js          # 布局逻辑
│       ├── monitor.js         # 监控模块逻辑
│       ├── warning.js         # 预警模块逻辑
│       ├── data.js            # 数据模块逻辑
│       └── emergency.js       # 应急模块逻辑
├── 移动端/                     # 移动端页面
│   ├── index.html             # 首页入口
│   ├── pages/                 # 页面文件
│   │   ├── home.html          # 首页
│   │   ├── field-work.html    # 现场作业
│   │   ├── emergency.html     # 应急功能
│   │   └── warnings.html      # 预警信息
│   ├── css/                   # 移动端样式
│   │   ├── mobile.css         # 移动端基础样式
│   │   ├── home.css           # 首页样式
│   │   ├── field-work.css     # 现场作业样式
│   │   └── emergency.css      # 应急功能样式
│   └── js/                    # 移动端脚本
│       ├── mobile.js          # 移动端基础逻辑
│       ├── home.js            # 首页逻辑
│       ├── field-work.js      # 现场作业逻辑
│       └── emergency.js       # 应急功能逻辑
├── 管理端/                     # 管理端页面
│   ├── index.html             # 首页入口
│   ├── pages/                 # 页面文件
│   │   ├── users.html         # 用户管理
│   │   ├── system.html        # 系统配置
│   │   ├── data.html          # 数据管理
│   │   └── monitor.html       # 系统监控
│   ├── css/                   # 管理端样式
│   │   ├── admin.css          # 管理端基础样式
│   │   ├── users.css          # 用户管理样式
│   │   ├── system.css         # 系统配置样式
│   │   └── data.css           # 数据管理样式
│   └── js/                    # 管理端脚本
│       ├── admin.js           # 管理端基础逻辑
│       ├── users.js           # 用户管理逻辑
│       ├── system.js          # 系统配置逻辑
│       └── data.js            # 数据管理逻辑
└── 业务处理端/                 # 业务处理端页面
    ├── index.html             # 首页入口
    ├── pages/                 # 页面文件
    │   ├── workflow.html      # 流程管理
    │   ├── approval.html      # 审批管理
    │   ├── monitor.html       # 业务监控
    │   └── collaboration.html # 协作管理
    ├── css/                   # 业务处理端样式
    │   ├── business.css       # 业务端基础样式
    │   ├── workflow.css       # 流程管理样式
    │   ├── approval.css       # 审批管理样式
    │   └── collaboration.css  # 协作管理样式
    └── js/                    # 业务处理端脚本
        ├── business.js        # 业务端基础逻辑
        ├── workflow.js        # 流程管理逻辑
        ├── approval.js        # 审批管理逻辑
        └── collaboration.js   # 协作管理逻辑
```

## 🎯 开发规范

### 文件命名规范
- HTML文件：使用小写字母和连字符，如 `dashboard.html`
- CSS文件：使用小写字母和连字符，如 `monitor.css`
- JS文件：使用小写字母和连字符，如 `monitor.js`
- 图片文件：使用小写字母和连字符，如 `logo-icon.png`

### 代码组织规范
- **HTML**：语义化标签，合理的结构层次
- **CSS**：模块化组织，使用CSS变量，遵循BEM命名规范
- **JavaScript**：模块化开发，功能分离，注释完整

### 响应式设计
- 移动优先的设计理念
- 统一的断点系统
- 弹性布局和网格系统

### 浏览器兼容性
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚀 快速开始

1. 选择对应的端（PC端/移动端/管理端/业务处理端）
2. 打开对应的 `index.html` 文件
3. 根据需要访问具体的功能页面
4. 所有页面都包含完整的样式和交互功能

## 📝 开发说明

- 所有页面都是独立的HTML文件，可以直接在浏览器中打开
- CSS和JS文件已分离，便于维护和复用
- 包含完整的模拟数据和交互功能
- 支持响应式设计，适配不同屏幕尺寸
- 遵循现代前端开发最佳实践

## 🔧 技术栈

- **HTML5**：语义化标签，现代HTML特性
- **CSS3**：Flexbox、Grid、CSS变量、动画
- **JavaScript ES6+**：模块化、异步处理、现代语法
- **响应式设计**：移动优先，多端适配
- **可视化库**：Three.js（3D）、ECharts（图表）

## 📱 各端特色

### PC端
- 大屏监控界面
- 3D可视化场景
- 复杂数据分析
- 专业操作界面

### 移动端
- 触控优化界面
- 现场作业功能
- GPS定位采集
- 应急求救功能

### 管理端
- 系统管理界面
- 用户权限管理
- 数据质量监控
- 系统配置管理

### 业务处理端
- 流程管理界面
- 审批工作流
- 团队协作功能
- 业务监控分析
