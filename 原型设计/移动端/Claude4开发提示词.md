# 地质灾害预警系统 - 移动端原型开发提示词

## 📋 文档概述

本文档为地质灾害预警系统移动端原型开发提供完整的技术指导，涵盖现场作业人员使用的核心功能页面。移动端作为现场数据采集和应急响应的重要工具，需要具备高可用性、离线能力和触控优化的特点。

### 🎯 移动端定位
- **主要用户**：现场作业人员、监测技术员、应急响应人员
- **核心场景**：野外数据采集、实时监测、应急求救、安全导航
- **技术特点**：离线优先、触控友好、性能优化、电池节能

## 🛠️ 技术架构与规范

### 开发技术栈
```
前端技术：HTML5 + CSS3 + JavaScript (ES6+)
地图引擎：Cesium.js (与大屏版本保持一致)
UI框架：原生开发，无第三方UI库依赖
存储方案：LocalStorage + IndexedDB
网络通信：Fetch API + WebSocket
多媒体：MediaDevices API + Canvas
定位服务：Geolocation API + GPS
```

### 移动端设计系统

#### 色彩规范
```css
/* 主色调 */
--primary-color: #1890FF;        /* 科技蓝 - 主要操作 */
--success-color: #52C41A;        /* 成功绿 - 正常状态 */
--warning-color: #FA8C16;        /* 警告橙 - 注意状态 */
--danger-color: #FF4D4F;         /* 危险红 - 紧急状态 */

/* 预警等级色彩 */
--warning-blue: #1890FF;         /* 蓝色预警 */
--warning-yellow: #FADB14;       /* 黄色预警 */
--warning-orange: #FA8C16;       /* 橙色预警 */
--warning-red: #FF4D4F;          /* 红色预警 */

/* 中性色彩 */
--text-primary: #262626;         /* 主要文字 */
--text-secondary: #8C8C8C;       /* 次要文字 */
--text-disabled: #BFBFBF;        /* 禁用文字 */
--background-color: #F5F5F5;     /* 页面背景 */
--card-background: #FFFFFF;      /* 卡片背景 */
--border-color: #E8E8E8;         /* 边框颜色 */
```

#### 字体系统
```css
/* 字体族 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "PingFang SC", "Microsoft YaHei", sans-serif;

/* 字号规范 */
--font-size-h1: 24px;            /* 主标题 */
--font-size-h2: 20px;            /* 副标题 */
--font-size-h3: 18px;            /* 三级标题 */
--font-size-h4: 16px;            /* 四级标题 */
--font-size-body: 16px;          /* 正文 */
--font-size-small: 14px;         /* 小号文字 */
--font-size-caption: 12px;       /* 辅助文字 */

/* 行高规范 */
--line-height-title: 1.3;        /* 标题行高 */
--line-height-body: 1.5;         /* 正文行高 */
--line-height-compact: 1.2;      /* 紧凑行高 */
```

#### 布局规范
```css
/* 设备尺寸适配 */
--mobile-small: 320px;           /* 小屏手机 */
--mobile-medium: 375px;          /* 标准手机 */
--mobile-large: 414px;           /* 大屏手机 */
--tablet-small: 768px;           /* 小平板 */
--tablet-large: 1024px;          /* 大平板 */

/* 触控区域 */
--touch-target-min: 44px;        /* 最小触控区域 */
--touch-target-comfortable: 48px; /* 舒适触控区域 */

/* 间距系统 */
--spacing-xs: 4px;               /* 极小间距 */
--spacing-sm: 8px;               /* 小间距 */
--spacing-md: 12px;              /* 中等间距 */
--spacing-lg: 16px;              /* 大间距 */
--spacing-xl: 24px;              /* 超大间距 */

/* 圆角规范 */
--border-radius-sm: 4px;         /* 小圆角 */
--border-radius-md: 6px;         /* 中圆角 */
--border-radius-lg: 8px;         /* 大圆角 */
--border-radius-xl: 12px;        /* 超大圆角 */

/* 阴影规范 */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);      /* 小阴影 */
--shadow-md: 0 2px 8px rgba(0,0,0,0.1);      /* 中阴影 */
--shadow-lg: 0 4px 16px rgba(0,0,0,0.15);    /* 大阴影 */
```

#### 组件规范
```css
/* 导航组件 */
--navbar-height: 56px;           /* 导航栏高度 */
--tabbar-height: 50px;           /* 标签栏高度 */

/* 表单组件 */
--input-height: 44px;            /* 输入框高度 */
--button-height: 44px;           /* 按钮高度 */
--select-height: 44px;           /* 选择器高度 */

/* 列表组件 */
--list-item-height: 56px;        /* 列表项高度 */
--list-item-padding: 16px;       /* 列表项内边距 */

/* 卡片组件 */
--card-padding: 16px;            /* 卡片内边距 */
--card-margin: 12px;             /* 卡片外边距 */
```

## 📱 移动端页面架构

### 应用导航结构
```
地质灾害预警系统移动端
├── 🏠 首页 (Dashboard)
│   ├── 预警概览卡片
│   ├── 快捷操作网格
│   └── 消息通知列表
├── 🗺️ 地图页面 (Map)
│   ├── 3D地形展示
│   ├── 监测点管理
│   ├── 预警区域显示
│   └── 图层控制
├── ⚠️ 预警中心 (Warnings)
│   ├── 预警列表
│   ├── 预警详情
│   └── 预警确认
├── 🔧 现场作业 (Field Work)
│   ├── GPS定位
│   ├── 数据采集
│   ├── 多媒体记录
│   └── 离线同步
├── 🚨 应急功能 (Emergency)
│   ├── 应急联系
│   ├── 求救功能
│   └── 安全导航
└── 👤 个人中心 (Profile)
    ├── 用户信息
    ├── 系统设置
    └── 数据统计
```

### 底部导航配置
```javascript
const bottomNavigation = [
    { id: 'home', name: '首页', icon: '🏠', route: '/home' },
    { id: 'map', name: '地图', icon: '🗺️', route: '/map' },
    { id: 'warnings', name: '预警', icon: '⚠️', route: '/warnings' },
    { id: 'field', name: '作业', icon: '🔧', route: '/field' },
    { id: 'profile', name: '我的', icon: '👤', route: '/profile' }
];
```

## 🏠 首页界面开发

### 页面概述
首页作为移动端的核心入口，需要快速展示关键信息和提供便捷操作入口。设计重点是信息密度适中、操作路径清晰、响应速度快。

### 页面布局结构
```
┌─────────────────────────────────┐
│ 状态栏：信号 | 时间 | 电池      │ ← 系统状态栏 (自动适配)
├─────────────────────────────────┤
│ 导航栏：标题 | 搜索 | 设置      │ ← 高度: 56px + 安全区域
├─────────────────────────────────┤
│ 预警概览卡片                    │ ← 高度: 120px (可展开)
│ ┌─────────────────────────────┐ │
│ │ 🔴 当前预警状态 | 风险等级   │ │
│ │ 📍 影响区域 | ⏰ 发布时间   │ │
│ │ 📝 预警内容摘要...          │ │
│ │ [查看详情] [确认收到]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 快捷操作网格 (3×2布局)          │ ← 高度: 200px
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │⚠️预警  │ │🗺️地图  │ │📞应急  │ │
│ │查看    │ │监控    │ │联系    │ │
│ └───────┘ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │🔧数据  │ │🧭导航  │ │🆘求救  │ │
│ │采集    │ │安全    │ │功能    │ │
│ └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│ 实时消息流 (下拉刷新)           │ ← 可滚动区域
│ ┌─────────────────────────────┐ │
│ │ 🔴 [14:30] 新增红色预警     │ │
│ │ 📊 [14:25] 数据同步完成     │ │
│ │ 📱 [14:20] 系统更新提醒     │ │
│ │ ⚡ [14:15] 设备状态正常     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 底部导航：🏠|🗺️|⚠️|🔧|👤        │ ← 高度: 50px + 安全区域
└─────────────────────────────────┘
```

### 核心功能模块

#### 1. 智能导航栏
```html
<header class="app-header safe-area-top">
    <div class="header-content">
        <div class="header-left">
            <h1 class="app-title">地质灾害预警</h1>
        </div>
        <div class="header-right">
            <button class="header-btn" id="searchBtn">
                <span class="icon">🔍</span>
            </button>
            <button class="header-btn" id="settingsBtn">
                <span class="icon">⚙️</span>
            </button>
            <div class="connection-status" id="connectionStatus">
                <span class="status-dot online"></span>
            </div>
        </div>
    </div>
</header>
```

#### 2. 预警概览卡片
```html
<div class="warning-overview-card" id="warningOverview">
    <div class="warning-header">
        <div class="warning-level-badge" id="warningLevel">
            <span class="level-dot"></span>
            <span class="level-text">橙色预警</span>
        </div>
        <div class="warning-time" id="warningTime">14:30</div>
    </div>

    <div class="warning-content">
        <h3 class="warning-title" id="warningTitle">XX村滑坡橙色预警</h3>
        <p class="warning-description" id="warningDescription">
            受持续降雨影响，该区域发生滑坡风险较高，请相关人员注意防范...
        </p>
        <div class="warning-meta">
            <span class="meta-item">
                <span class="icon">📍</span>
                <span class="text" id="warningLocation">成都市XX区</span>
            </span>
            <span class="meta-item">
                <span class="icon">👥</span>
                <span class="text" id="affectedPeople">影响人数: 120人</span>
            </span>
        </div>
    </div>

    <div class="warning-actions">
        <button class="btn btn-primary" onclick="viewWarningDetails()">
            查看详情
        </button>
        <button class="btn btn-secondary" onclick="confirmWarningReceived()">
            确认收到
        </button>
    </div>
</div>
```

#### 3. 智能快捷操作网格
```html
<div class="quick-actions-grid">
    <div class="grid-container">
        <button class="action-btn" data-action="warnings" data-permission="all">
            <div class="btn-icon">⚠️</div>
            <div class="btn-label">预警查看</div>
            <div class="btn-badge" id="warningsBadge">3</div>
        </button>

        <button class="action-btn" data-action="map" data-permission="all">
            <div class="btn-icon">🗺️</div>
            <div class="btn-label">地图监控</div>
        </button>

        <button class="action-btn" data-action="emergency" data-permission="all">
            <div class="btn-icon">📞</div>
            <div class="btn-label">应急联系</div>
        </button>

        <button class="action-btn" data-action="field" data-permission="field">
            <div class="btn-icon">🔧</div>
            <div class="btn-label">数据采集</div>
        </button>

        <button class="action-btn" data-action="navigation" data-permission="field">
            <div class="btn-icon">🧭</div>
            <div class="btn-label">安全导航</div>
        </button>

        <button class="action-btn emergency" data-action="sos" data-permission="all">
            <div class="btn-icon">🆘</div>
            <div class="btn-label">紧急求救</div>
        </button>
    </div>
</div>
```

#### 4. 实时消息流
```html
<div class="message-stream">
    <div class="stream-header">
        <h3>实时消息</h3>
        <button class="refresh-btn" onclick="refreshMessages()">
            <span class="icon">🔄</span>
        </button>
    </div>

    <div class="stream-content" id="messageList">
        <!-- 消息项将由JavaScript动态生成 -->
    </div>

    <div class="stream-footer">
        <button class="view-all-btn" onclick="viewAllMessages()">
            查看全部消息
        </button>
    </div>
</div>
```

#### 5. 底部导航栏
```html
<nav class="bottom-navigation safe-area-bottom">
    <div class="nav-container">
        <button class="nav-item active" data-route="home">
            <span class="nav-icon">🏠</span>
            <span class="nav-label">首页</span>
        </button>
        <button class="nav-item" data-route="map">
            <span class="nav-icon">🗺️</span>
            <span class="nav-label">地图</span>
        </button>
        <button class="nav-item" data-route="warnings">
            <span class="nav-icon">⚠️</span>
            <span class="nav-label">预警</span>
            <span class="nav-badge" id="warningsNavBadge">3</span>
        </button>
        <button class="nav-item" data-route="field">
            <span class="nav-icon">🔧</span>
            <span class="nav-label">作业</span>
        </button>
        <button class="nav-item" data-route="profile">
            <span class="nav-icon">👤</span>
            <span class="nav-label">我的</span>
        </button>
    </div>
</nav>
```

### 交互行为设计

#### 1. 触控交互优化
```javascript
// 触控反馈配置
const touchFeedback = {
    // 按钮点击反馈
    buttonPress: {
        scale: 0.95,
        duration: 150,
        haptic: 'light'
    },

    // 卡片点击反馈
    cardPress: {
        scale: 0.98,
        duration: 200,
        haptic: 'medium'
    },

    // 紧急按钮反馈
    emergencyPress: {
        scale: 0.92,
        duration: 100,
        haptic: 'heavy'
    }
};

// 实现触控反馈
function addTouchFeedback(element, type = 'buttonPress') {
    const config = touchFeedback[type];

    element.addEventListener('touchstart', () => {
        element.style.transform = `scale(${config.scale})`;
        element.style.transition = `transform ${config.duration}ms ease`;

        // 触觉反馈 (如果支持)
        if (navigator.vibrate && config.haptic) {
            const vibrationPattern = {
                'light': [10],
                'medium': [20],
                'heavy': [30]
            };
            navigator.vibrate(vibrationPattern[config.haptic]);
        }
    });

    element.addEventListener('touchend', () => {
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, config.duration);
    });
}
```

#### 2. 手势操作支持
```javascript
// 手势识别器
class GestureRecognizer {
    constructor(element) {
        this.element = element;
        this.startX = 0;
        this.startY = 0;
        this.threshold = 50; // 手势触发阈值
        this.init();
    }

    init() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        // 防止页面滚动
        if (Math.abs(e.touches[0].clientX - this.startX) > this.threshold) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;

        // 水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.threshold) {
            if (deltaX > 0) {
                this.onSwipeRight();
            } else {
                this.onSwipeLeft();
            }
        }

        // 垂直滑动
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.threshold) {
            if (deltaY > 0) {
                this.onSwipeDown();
            } else {
                this.onSwipeUp();
            }
        }
    }

    onSwipeLeft() {
        // 左滑切换到下一页
        navigateToNext();
    }

    onSwipeRight() {
        // 右滑切换到上一页
        navigateToPrevious();
    }

    onSwipeDown() {
        // 下拉刷新
        refreshCurrentPage();
    }

    onSwipeUp() {
        // 上滑显示更多
        showMoreContent();
    }
}
```

#### 3. 实时数据更新
```javascript
// 实时数据管理器
class RealTimeDataManager {
    constructor() {
        this.updateInterval = 30000; // 30秒更新一次
        this.websocket = null;
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        // 监听网络状态
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.connectWebSocket();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });

        // 启动定时更新
        this.startPeriodicUpdate();

        // 尝试建立WebSocket连接
        if (this.isOnline) {
            this.connectWebSocket();
        }
    }

    connectWebSocket() {
        try {
            this.websocket = new WebSocket('wss://api.example.com/ws');

            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealTimeUpdate(data);
            };

            this.websocket.onerror = () => {
                console.warn('WebSocket连接失败，使用轮询模式');
                this.fallbackToPolling();
            };
        } catch (error) {
            this.fallbackToPolling();
        }
    }

    handleRealTimeUpdate(data) {
        switch (data.type) {
            case 'warning':
                this.updateWarningData(data.payload);
                this.showWarningNotification(data.payload);
                break;
            case 'message':
                this.updateMessageList(data.payload);
                this.showNewMessageBadge();
                break;
            case 'device_status':
                this.updateDeviceStatus(data.payload);
                break;
        }
    }

    startPeriodicUpdate() {
        setInterval(() => {
            if (this.isOnline) {
                this.fetchLatestData();
            }
        }, this.updateInterval);
    }
}
```

### 数据模型设计

#### 预警数据模型
```javascript
const warningDataModel = {
    id: "warning_001",
    level: "orange",                    // blue, yellow, orange, red
    type: "landslide",                  // landslide, debris_flow, collapse
    title: "XX村滑坡橙色预警",
    description: "受持续降雨影响，该区域发生滑坡风险较高...",
    location: {
        name: "成都市XX区XX村",
        coordinates: [104.0668, 30.5728],
        affectedArea: "2.5平方公里",
        affectedPopulation: 120
    },
    timing: {
        publishTime: "2024-07-16T14:30:00Z",
        effectiveTime: "2024-07-16T15:00:00Z",
        expiryTime: "2024-07-17T15:00:00Z",
        lastUpdate: "2024-07-16T14:35:00Z"
    },
    severity: {
        riskLevel: "high",              // low, medium, high, critical
        confidence: 0.85,               // 0-1
        urgency: "immediate"            // immediate, expected, future
    },
    actions: {
        required: ["evacuate", "monitor", "restrict_access"],
        recommended: ["prepare_supplies", "check_communication"],
        prohibited: ["outdoor_activities", "construction_work"]
    },
    status: {
        isActive: true,
        isConfirmed: false,
        confirmationCount: 0,
        viewCount: 15
    },
    metadata: {
        source: "automatic_monitoring",
        publisher: "成都市地质灾害监测中心",
        version: "1.2",
        language: "zh-CN"
    }
};
```

#### 快捷操作数据模型
```javascript
const quickActionsModel = [
    {
        id: "warnings",
        name: "预警查看",
        icon: "⚠️",
        color: "#FA8C16",
        route: "/warnings",
        permission: ["all"],
        badge: {
            show: true,
            count: 3,
            type: "number"
        },
        priority: 1,
        isEnabled: true
    },
    {
        id: "map",
        name: "地图监控",
        icon: "�️",
        color: "#1890FF",
        route: "/map",
        permission: ["all"],
        badge: {
            show: false
        },
        priority: 2,
        isEnabled: true
    },
    {
        id: "emergency",
        name: "应急联系",
        icon: "📞",
        color: "#FF4D4F",
        route: "/emergency",
        permission: ["all"],
        badge: {
            show: false
        },
        priority: 3,
        isEnabled: true
    },
    {
        id: "field_work",
        name: "数据采集",
        icon: "�",
        color: "#52C41A",
        route: "/field",
        permission: ["field_worker", "technician"],
        badge: {
            show: true,
            count: 2,
            type: "dot"
        },
        priority: 4,
        isEnabled: true
    },
    {
        id: "navigation",
        name: "安全导航",
        icon: "🧭",
        color: "#722ED1",
        route: "/navigation",
        permission: ["field_worker"],
        badge: {
            show: false
        },
        priority: 5,
        isEnabled: true
    },
    {
        id: "sos",
        name: "紧急求救",
        icon: "🆘",
        color: "#FF4D4F",
        route: "/sos",
        permission: ["all"],
        badge: {
            show: false
        },
        priority: 6,
        isEnabled: true,
        isEmergency: true
    }
];
```

### 响应式适配策略

#### 小屏设备优化 (320px - 374px)
```css
@media (max-width: 374px) {
    .quick-actions-grid .action-btn {
        min-height: 40px;
        font-size: 14px;
    }

    .warning-overview-card {
        padding: 12px;
        margin: 8px;
    }

    .app-header .app-title {
        font-size: 18px;
    }

    .bottom-navigation .nav-label {
        font-size: 10px;
    }
}
```

#### 标准手机适配 (375px - 413px)
```css
@media (min-width: 375px) and (max-width: 413px) {
    .quick-actions-grid .action-btn {
        min-height: 44px;
        font-size: 16px;
    }

    .warning-overview-card {
        padding: 16px;
        margin: 12px;
    }
}
```

#### 大屏手机优化 (414px+)
```css
@media (min-width: 414px) and (max-width: 767px) {
    .quick-actions-grid .action-btn {
        min-height: 48px;
        font-size: 16px;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
    }
}
```

#### 平板设备适配 (768px+)
```css
@media (min-width: 768px) {
    .app-container {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
    }

    .main-content {
        flex: 1;
        padding: 0 20px;
    }

    .sidebar {
        width: 300px;
        display: block;
    }

    .quick-actions-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    .bottom-navigation {
        display: none; /* 平板使用侧边栏导航 */
    }
}
```

### 开发实现要求

#### 必需功能
1. **实时数据展示**：预警信息、设备状态、消息通知
2. **快捷操作入口**：权限控制、状态反馈、路由跳转
3. **响应式布局**：多设备适配、安全区域处理
4. **离线支持**：数据缓存、状态提示、自动同步
5. **性能优化**：懒加载、虚拟滚动、图片压缩

#### 技术实现
```javascript
// 首页初始化
class HomePage {
    constructor() {
        this.dataManager = new RealTimeDataManager();
        this.gestureHandler = new GestureRecognizer(document.body);
        this.init();
    }

    async init() {
        await this.loadInitialData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.initializeComponents();
    }

    async loadInitialData() {
        try {
            const [warnings, messages, userProfile] = await Promise.all([
                this.fetchWarnings(),
                this.fetchMessages(),
                this.fetchUserProfile()
            ]);

            this.renderWarningOverview(warnings[0]);
            this.renderQuickActions(userProfile.permissions);
            this.renderMessageStream(messages);
        } catch (error) {
            this.handleLoadError(error);
        }
    }
}

// 启动首页应用
document.addEventListener('DOMContentLoaded', () => {
    const homePage = new HomePage();
});
```

**请提供完整的移动端首页HTML文件，包含所有CSS样式和JavaScript交互逻辑，确保实现上述所有功能要求。**

## 🔧 现场作业页面开发

### 页面概述
现场作业页面是移动端的核心功能模块，专为野外作业人员设计。该页面集成GPS定位、数据采集、多媒体记录、离线存储等功能，确保在各种网络环境下都能正常工作。

### 功能架构
```
现场作业系统
├── 📍 位置服务模块
│   ├── GPS自动定位
│   ├── 手动坐标输入
│   ├── 位置精度显示
│   └── 地址解析服务
├── 📊 数据采集模块
│   ├── 监测点选择
│   ├── 数据类型配置
│   ├── 数值输入验证
│   └── 备注信息记录
├── 📱 多媒体模块
│   ├── 拍照功能
│   ├── 录音功能
│   ├── 录像功能
│   └── 文件管理
├── 💾 数据管理模块
│   ├── 本地存储
│   ├── 数据同步
│   ├── 状态跟踪
│   └── 冲突解决
└── 🔄 离线支持模块
    ├── 离线检测
    ├── 数据缓存
    ├── 自动同步
    └── 状态提示
```

### 页面布局结构
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 数据采集 | 同步状态│ ← 高度: 56px + 安全区域
├─────────────────────────────────┤
│ 位置信息卡片 (可折叠)           │ ← 高度: 100px (展开140px)
│ ┌─────────────────────────────┐ │
│ │ 📍 GPS: 104.0668, 30.5728   │ │
│ │ 🎯 精度: ±3米 | 📍 地址信息  │ │
│ │ [🔄刷新] [✏️手动] [📍导航]   │ │
│ │ ▼ 详细信息 (可展开)          │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 数据采集表单 (分步骤)           │ ← 可滚动区域
│ ┌─────────────────────────────┐ │
│ │ 步骤 1/4: 监测点选择         │ │
│ │ [下拉选择] XX村滑坡监测点    │ │
│ │ ────────────────────────── │ │
│ │ 步骤 2/4: 数据类型          │ │
│ │ ○ 位移数据  ○ 降雨量       │ │
│ │ ○ 土壤含水量 ○ 其他        │ │
│ │ ────────────────────────── │ │
│ │ 步骤 3/4: 数值输入          │ │
│ │ [数值输入框] 单位: mm       │ │
│ │ ────────────────────────── │ │
│ │ 步骤 4/4: 备注说明          │ │
│ │ [文本区域] 可选填写...       │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 多媒体采集工具栏                │ ← 高度: 120px
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │ 📷拍照 │ │ 🎤录音 │ │ 📹录像 │ │
│ │ (3/5) │ │ 00:45 │ │ 待录制 │ │
│ └───────┘ └───────┘ └───────┘ │
│ [📁文件管理] [🗑️清空] [👁️预览] │
├─────────────────────────────────┤
│ 数据记录列表 (滑动操作)         │ ← 可滚动区域
│ ┌─────────────────────────────┐ │
│ │ 📊 位移数据 | 12.5mm        │ │
│ │ 📍 XX监测点 | 14:30 ✅已保存│ │
│ │ ← 滑动删除 | 点击编辑 →     │ │
│ │ ────────────────────────── │ │
│ │ 📊 降雨量 | 25.8mm          │ │
│ │ 📍 XX监测点 | 14:25 🔄待上传│ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 操作按钮区域                    │ ← 高度: 80px + 安全区域
│ [💾保存草稿] [📤提交数据] [🔄同步]│
│ 离线模式: 3条待同步 | 网络: WiFi │
└─────────────────────────────────┘
```

### 核心功能模块实现

#### 1. 智能位置服务模块
```html
<div class="location-card collapsible" id="locationCard">
    <div class="card-header" onclick="toggleLocationCard()">
        <div class="location-status">
            <span class="status-indicator" id="gpsStatus">🔴</span>
            <span class="status-text" id="gpsStatusText">定位中...</span>
        </div>
        <div class="location-accuracy">
            <span class="accuracy-value" id="accuracyValue">±--米</span>
            <button class="expand-btn" id="locationExpandBtn">▼</button>
        </div>
    </div>

    <div class="card-content" id="locationContent">
        <div class="coordinates-display">
            <div class="coordinate-item">
                <span class="label">经度:</span>
                <span class="value" id="longitude">---.------</span>
                <button class="copy-btn" onclick="copyCoordinate('longitude')">📋</button>
            </div>
            <div class="coordinate-item">
                <span class="label">纬度:</span>
                <span class="value" id="latitude">---.------</span>
                <button class="copy-btn" onclick="copyCoordinate('latitude')">📋</button>
            </div>
        </div>

        <div class="location-details">
            <div class="detail-item">
                <span class="label">海拔高度:</span>
                <span class="value" id="altitude">---米</span>
            </div>
            <div class="detail-item">
                <span class="label">定位时间:</span>
                <span class="value" id="locationTime">--:--:--</span>
            </div>
            <div class="detail-item">
                <span class="label">地址信息:</span>
                <span class="value" id="address">获取中...</span>
            </div>
        </div>

        <div class="location-actions">
            <button class="action-btn primary" onclick="refreshLocation()">
                <span class="icon">🔄</span>
                <span class="text">刷新位置</span>
            </button>
            <button class="action-btn secondary" onclick="openManualInput()">
                <span class="icon">✏️</span>
                <span class="text">手动输入</span>
            </button>
            <button class="action-btn secondary" onclick="navigateToLocation()">
                <span class="icon">🧭</span>
                <span class="text">导航到此</span>
            </button>
        </div>
    </div>
</div>

<!-- 手动输入位置弹窗 -->
<div id="manualLocationModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>手动输入坐标</h3>
            <button class="close-btn" onclick="closeModal('manualLocationModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>经度 (Longitude)</label>
                <input type="number" id="manualLongitude" step="0.000001"
                       placeholder="例: 104.066800" min="-180" max="180">
            </div>
            <div class="form-group">
                <label>纬度 (Latitude)</label>
                <input type="number" id="manualLatitude" step="0.000001"
                       placeholder="例: 30.572800" min="-90" max="90">
            </div>
            <div class="form-group">
                <label>海拔高度 (可选)</label>
                <input type="number" id="manualAltitude" step="0.1"
                       placeholder="例: 500.0" min="-1000" max="9000">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" onclick="setManualLocation()">确认设置</button>
            <button class="btn btn-secondary" onclick="closeModal('manualLocationModal')">取消</button>
        </div>
    </div>
</div>
```

```javascript
// 位置服务管理器
class LocationService {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.isTracking = false;
        this.accuracy = null;
        this.lastUpdateTime = null;
        this.init();
    }

    init() {
        this.checkGeolocationSupport();
        this.setupLocationUpdates();
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showError('设备不支持GPS定位功能');
            this.enableManualInputOnly();
            return false;
        }
        return true;
    }

    async getCurrentLocation(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        };

        const finalOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            this.updateStatus('定位中...', 'loading');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.handleLocationSuccess(position);
                    resolve(position);
                },
                (error) => {
                    this.handleLocationError(error);
                    reject(error);
                },
                finalOptions
            );
        });
    }

    startWatching() {
        if (!this.checkGeolocationSupport()) return;

        this.isTracking = true;
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handleLocationSuccess(position),
            (error) => this.handleLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );
    }

    stopWatching() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.isTracking = false;
        }
    }

    handleLocationSuccess(position) {
        this.currentPosition = position;
        this.accuracy = position.coords.accuracy;
        this.lastUpdateTime = new Date();

        this.updateLocationDisplay(position);
        this.updateStatus('定位成功', 'success');
        this.reverseGeocode(position.coords.latitude, position.coords.longitude);
    }

    handleLocationError(error) {
        let errorMessage = '';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = '用户拒绝了定位请求';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = '位置信息不可用';
                break;
            case error.TIMEOUT:
                errorMessage = '定位请求超时';
                break;
            default:
                errorMessage = '定位发生未知错误';
                break;
        }

        this.updateStatus(errorMessage, 'error');
        this.showLocationError(errorMessage);
    }

    updateLocationDisplay(position) {
        const coords = position.coords;

        document.getElementById('longitude').textContent = coords.longitude.toFixed(6);
        document.getElementById('latitude').textContent = coords.latitude.toFixed(6);
        document.getElementById('accuracy').textContent = `±${Math.round(coords.accuracy)}米`;
        document.getElementById('altitude').textContent = coords.altitude ?
            `${Math.round(coords.altitude)}米` : '未知';
        document.getElementById('locationTime').textContent =
            new Date().toLocaleTimeString();
    }

    async reverseGeocode(lat, lng) {
        try {
            // 这里可以调用地理编码服务
            // 示例使用模拟数据
            const address = await this.mockReverseGeocode(lat, lng);
            document.getElementById('address').textContent = address;
        } catch (error) {
            document.getElementById('address').textContent = '地址解析失败';
        }
    }

    mockReverseGeocode(lat, lng) {
        // 模拟地址解析
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`成都市武侯区XX街道XX号附近`);
            }, 1000);
        });
    }

    updateStatus(message, type) {
        const statusIndicator = document.getElementById('gpsStatus');
        const statusText = document.getElementById('gpsStatusText');

        statusText.textContent = message;

        switch (type) {
            case 'loading':
                statusIndicator.textContent = '🟡';
                break;
            case 'success':
                statusIndicator.textContent = '🟢';
                break;
            case 'error':
                statusIndicator.textContent = '🔴';
                break;
        }
    }
}

// 初始化位置服务
const locationService = new LocationService();
```

### 2. 数据录入表单
```html
<form class="data-form">
  <div class="form-group">
    <label>监测点</label>
    <select id="monitoring-point">
      <option value="">请选择监测点</option>
      <option value="point1">XX村滑坡监测点</option>
      <option value="point2">XX镇泥石流监测点</option>
    </select>
  </div>

  <div class="form-group">
    <label>数据类型</label>
    <select id="data-type">
      <option value="">请选择数据类型</option>
      <option value="displacement">位移数据</option>
      <option value="rainfall">降雨量</option>
      <option value="soil-moisture">土壤含水量</option>
    </select>
  </div>

  <div class="form-group">
    <label>数值</label>
    <input type="number" id="data-value" placeholder="请输入数值" step="0.01">
    <span class="unit" id="data-unit">mm</span>
  </div>

  <div class="form-group">
    <label>备注说明</label>
    <textarea id="remarks" placeholder="请输入备注信息..." rows="3"></textarea>
  </div>
</form>
```

### 3. 多媒体采集模块
```html
<div class="media-capture">
  <div class="capture-buttons">
    <button class="capture-btn photo" onclick="capturePhoto()">
      <div class="icon">📷</div>
      <div class="label">拍照</div>
    </button>
    <button class="capture-btn audio" onclick="captureAudio()">
      <div class="icon">🎤</div>
      <div class="label">录音</div>
    </button>
    <button class="capture-btn video" onclick="captureVideo()">
      <div class="icon">📹</div>
      <div class="label">录像</div>
    </button>
  </div>

  <div class="captured-files" id="captured-files">
    <!-- 已采集的文件列表 -->
  </div>
</div>
```

### 4. 已采集数据列表
- 数据项卡片显示
- 状态标识：已保存、待上传、上传失败
- 滑动删除功能
- 点击查看详情

## 交互功能要求
1. **GPS定位**：
   - 页面加载时自动获取位置
   - 位置精度实时显示
   - 定位失败时提供手动输入选项

2. **表单验证**：
   - 实时验证必填项
   - 数值范围检查
   - 错误提示样式

3. **多媒体功能**：
   - 拍照：调用相机或模拟上传
   - 录音：显示录音时长和波形
   - 录像：显示录制状态

4. **离线支持**：
   - 数据本地存储
   - 网络恢复时自动同步
   - 离线状态提示

5. **触控优化**：
   - 按钮最小44px触控区域
   - 滑动手势支持
   - 触觉反馈效果

## JavaScript功能实现
```javascript
// GPS定位功能
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        updateLocationDisplay(lat, lng, accuracy);
        reverseGeocode(lat, lng);
      },
      error => {
        showLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }
}

// 数据保存功能
function saveData() {
  const data = {
    id: Date.now(),
    monitoringPoint: document.getElementById('monitoring-point').value,
    dataType: document.getElementById('data-type').value,
    value: document.getElementById('data-value').value,
    remarks: document.getElementById('remarks').value,
    location: getCurrentLocationData(),
    timestamp: new Date().toISOString(),
    status: 'saved'
  };

  // 保存到本地存储
  saveToLocalStorage(data);

  // 显示成功提示
  showSuccessMessage('数据保存成功');

  // 清空表单
  clearForm();
}
```

请提供完整的现场作业页面，包含GPS定位、表单验证、多媒体采集等功能。
```

## 🚨 应急功能页面提示词

```
# 移动端应急功能页面开发

## 页面概述
开发应急响应相关页面，包括应急联系、求救功能、撤离指引等，这些是关键时刻的生命线功能。

## 应急联系页面布局
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 应急联系 | 编辑   │
├─────────────────────────────────┤
│ 紧急联系按钮                    │
│ ┌─────────────────────────────┐ │
│ │ 🚨 一键报警：110            │ │ ← 高度: 60px
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🚑 医疗急救：120            │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🚒 消防救援：119            │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 应急指挥联系                    │
│ ┌─────────────────────────────┐ │
│ │ 👤 张指挥员  📞 138****1234 │ │
│ │ 💬 发消息    📹 视频通话    │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 现场团队联系                    │
│ ┌─────────────────────────────┐ │
│ │ 👥 现场小组 (5人在线)       │ │
│ │ 💬 群组聊天  📹 群组通话    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## 求救功能页面布局
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 紧急求救 | 取消   │
├─────────────────────────────────┤
│ 紧急情况选择                    │
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │人员受伤│ │设备故障│ │迷路困难│ │
│ └───────┘ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │地质灾害│ │恶劣天气│ │其他紧急│ │
│ └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│ 当前位置信息                    │
│ ┌─────────────────────────────┐ │
│ │ 📍 经度：104.0668           │ │
│ │ 📍 纬度：30.5728            │ │
│ │ 📍 地址：成都市武侯区...     │ │
│ │ 📍 精度：±5米               │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 紧急描述                        │
│ ┌─────────────────────────────┐ │
│ │ 请简要描述紧急情况...       │ │
│ │                             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 联系信息                        │
│ 姓名：[_______] 手机：[_______] │
├─────────────────────────────────┤
│ 求救按钮                        │
│ ┌─────────────────────────────┐ │
│ │        🆘 发送求救信号       │ │ ← 高度: 80px
│ │      (长按3秒确认发送)       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## 功能要求
### 1. 紧急联系功能
```javascript
// 一键拨号功能
function emergencyCall(number) {
  // 显示确认对话框
  if (confirm(`确认拨打 ${number} 吗？`)) {
    // 调用拨号功能
    window.location.href = `tel:${number}`;

    // 记录拨号日志
    logEmergencyCall(number);
  }
}

// 快速发送位置信息
function sendLocationToContact(contactId) {
  const location = getCurrentLocation();
  const message = `紧急情况！我的位置：${location.address}，坐标：${location.lat},${location.lng}`;

  // 发送短信
  window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
}
```

### 2. 求救信号功能
```javascript
// 长按发送求救信号
let pressTimer;
let pressProgress = 0;

function startEmergencyPress() {
  pressTimer = setInterval(() => {
    pressProgress += 100;
    updateProgressBar(pressProgress / 3000 * 100);

    if (pressProgress >= 3000) {
      sendEmergencySignal();
      clearInterval(pressTimer);
    }
  }, 100);
}

function sendEmergencySignal() {
  const emergencyData = {
    type: getSelectedEmergencyType(),
    location: getCurrentLocation(),
    description: document.getElementById('emergency-description').value,
    contact: {
      name: document.getElementById('contact-name').value,
      phone: document.getElementById('contact-phone').value
    },
    timestamp: new Date().toISOString()
  };

  // 发送求救信号
  submitEmergencySignal(emergencyData);

  // 显示发送成功提示
  showEmergencyConfirmation();
}
```

## 安全导航页面提示词
```
# 移动端安全导航页面开发

## 页面布局
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 安全导航 | 设置   │
├─────────────────────────────────┤
│ 目的地信息                      │
│ ┌─────────────────────────────┐ │
│ │ 目标：XX监测点               │ │
│ │ 距离：2.3公里  预计：15分钟  │ │
│ │ 风险等级：低风险             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 地图导航区域                    │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │        📍 当前位置           │ │
│ │          ↓                  │ │
│ │        🛣️ 安全路径          │ │
│ │          ↓                  │ │
│ │        🎯 目标位置           │ │
│ │                             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 路况信息                        │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ 前方500米有积水路段       │ │
│ │ ✅ 备选路径畅通             │ │
│ │ 📡 GPS信号：强               │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 操作按钮：开始导航 | 紧急求助    │
└─────────────────────────────────┘
```

## 导航功能要求
1. **路径规划**：计算最安全的路径，避开高风险区域
2. **实时导航**：语音播报、转向提示
3. **安全提醒**：危险区域警告、天气提醒
4. **离线地图**：支持离线导航功能
5. **紧急求助**：导航过程中的一键求助

请提供完整的应急功能页面，包含紧急联系、求救信号、安全导航等功能。
```

## 📋 预警信息页面提示词

```
# 移动端预警信息页面开发

## 预警列表页面布局
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 预警信息 | 筛选   │
├─────────────────────────────────┤
│ 筛选标签                        │
│ [全部] [蓝色] [黄色] [橙色] [红色] │
├─────────────────────────────────┤
│ 预警卡片列表                    │
│ ┌─────────────────────────────┐ │
│ │ 🔴 红色预警  14:30          │ │
│ │ XX村滑坡红色预警             │ │
│ │ 立即撤离，注意安全...        │ │
│ │ [查看详情] [确认收到]        │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🟡 黄色预警  13:20          │ │
│ │ XX镇泥石流黄色预警           │ │
│ │ 注意观察，做好准备...        │ │
│ │ [查看详情] [确认收到]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 下拉刷新提示                    │
└─────────────────────────────────┘
```

## 预警详情页面布局
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 预警详情 | 分享   │
├─────────────────────────────────┤
│ 预警头部信息                    │
│ ┌─────────────────────────────┐ │
│ │ 🔴 红色预警                 │ │
│ │ XX村滑坡红色预警             │ │
│ │ 发布时间：2024-07-16 14:30  │ │
│ │ 有效期至：2024-07-17 14:30  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 预警内容                        │
│ ┌─────────────────────────────┐ │
│ │ 受持续强降雨影响，XX村发生滑 │ │
│ │ 坡的风险极高，请立即组织人员 │ │
│ │ 撤离，确保生命安全...        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 影响范围地图                    │
│ ┌─────────────────────────────┐ │
│ │        🗺️ 影响区域图         │ │
│ │                             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 防护建议                        │
│ • 立即撤离到安全区域             │
│ • 避免在山坡下方停留             │
│ • 保持通讯畅通                  │
├─────────────────────────────────┤
│ 操作按钮                        │
│ [确认收到] [查看撤离路线] [求助] │
└─────────────────────────────────┘
```

## 功能要求
1. **实时推送**：新预警自动推送通知
2. **确认机制**：用户确认收到预警信息
3. **分享功能**：分享预警信息给他人
4. **离线查看**：已接收的预警支持离线查看
5. **语音播报**：重要预警支持语音播报

请提供完整的预警信息页面，包含列表展示和详情查看功能。
```

## 📱 通用组件提示词

```
# 移动端通用组件开发

## 组件列表
请分别开发以下移动端通用组件：

### 1. 底部弹窗组件
```javascript
// 使用示例
showBottomSheet({
  title: '选择操作',
  options: [
    { text: '编辑', action: () => editItem() },
    { text: '删除', action: () => deleteItem(), danger: true },
    { text: '取消', action: () => hideBottomSheet() }
  ]
});
```

### 2. 下拉刷新组件
- 下拉动画效果
- 释放刷新提示
- 加载状态指示
- 刷新完成反馈

### 3. 无限滚动组件
- 滚动到底部自动加载
- 加载状态提示
- 没有更多数据提示
- 加载失败重试

### 4. 图片预览组件
- 全屏预览
- 缩放功能
- 滑动切换
- 保存到相册

### 5. 位置选择组件
- 地图选点
- 搜索地址
- 当前位置获取
- 历史位置记录

### 6. 表单验证组件
- 实时验证
- 错误提示样式
- 成功状态指示
- 自定义验证规则

请为每个组件提供完整的HTML/CSS/JS代码和使用示例。
```

## 🎨 移动端样式规范

```
## 移动端CSS规范

### 基础样式重置
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.5;
  color: #262626;
  background-color: #f5f5f5;
}
```

### 触控优化样式
```css
/* 触控区域最小尺寸 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 禁用选择和缩放 */
.no-select {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* 触控反馈 */
.touch-feedback:active {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(0.98);
}
```

### 安全区域适配
```css
/* 状态栏安全区域 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

/* 底部安全区域 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 侧边安全区域 */
.safe-area-sides {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 响应式断点
```css
/* 小屏手机 */
@media (max-width: 374px) {
  .container { padding: 12px; }
  .btn { height: 40px; font-size: 14px; }
}

/* 标准手机 */
@media (min-width: 375px) and (max-width: 413px) {
  .container { padding: 16px; }
  .btn { height: 44px; font-size: 16px; }
}

/* 大屏手机 */
@media (min-width: 414px) and (max-width: 767px) {
  .container { padding: 20px; }
  .btn { height: 48px; font-size: 16px; }
}

/* 平板竖屏 */
@media (min-width: 768px) and (max-width: 1023px) {
  .container { max-width: 600px; margin: 0 auto; }
}

/* 平板横屏 */
@media (min-width: 1024px) {
  .container { max-width: 800px; margin: 0 auto; }
  .sidebar { display: block; }
}
```

请确保所有移动端页面都遵循这些样式规范。
```

## 🗺️ 地图页面提示词

```
# 移动端地图页面开发

## 页面概述
开发与大屏版本功能对等的移动端地图页面，支持3D地形展示、监测点管理、预警区域显示、图层控制等核心功能，针对移动设备进行触控优化。

## 页面布局结构
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 地图 | 图层控制   │ ← 高度: 56px
├─────────────────────────────────┤
│ 地图容器区域                    │ ← 全屏显示
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │        3D地图显示区域        │ │
│ │                             │ │
│ │  📍 监测点标记               │ │
│ │  ⚠️ 预警区域                │ │
│ │  🗺️ 地形地貌                │ │
│ │                             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 浮动工具栏                      │ ← 底部浮动
│ [🏠][🏔️][🗺️][📍][⚠️][🔧]      │
└─────────────────────────────────┘
```

## 核心功能模块

### 1. 地图初始化配置
```javascript
// 移动端地图初始化
async function initMobileMap() {
    try {
        // 检测设备类型
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // 设置Cesium Ion Token (与大屏版本相同)
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjZlZDZhMS0xZGMzLTRlMjAtOWMyMC1hY2U2ZGI1OWM3YzIiLCJpZCI6MzIyMjE3LCJpYXQiOjE3NTI3MTgyMDZ9.ESrgN3eQQTxnHv-UUG5aJz7ojlnK9EAzfqFqgXPmH7M';

        viewer = new Cesium.Viewer('mapContainer', {
            // 移动端优化配置
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false,
            // 移动端性能优化
            requestRenderMode: true,
            maximumRenderTimeChange: Infinity
        });

        // 移动端触控优化
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.scene.globe.enableLighting = false; // 移动端关闭光照以提升性能

        // 性能优化设置
        viewer.scene.globe.maximumScreenSpaceError = 4; // 移动端降低精度
        viewer.scene.globe.tileCacheSize = 50; // 减少缓存大小

        // 初始视角设置为成都
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 50000),
            orientation: {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-45),
                roll: 0.0
            }
        });

        // 添加监测点数据
        await loadMonitoringPoints();

        // 初始化触控事件
        initMobileTouchEvents();

        console.log('移动端地图初始化完成');

    } catch (error) {
        console.error('地图初始化失败:', error);
        showFallbackMap();
    }
}
```

### 2. 监测点管理 (与大屏版本同步)
```javascript
// 监测点数据结构 (与大屏版本保持一致)
const monitoringPoints = [
    { name: '天府广场监测站', lon: 104.0665, lat: 30.5723, status: 'online' },
    { name: '春熙路监测站', lon: 104.0810, lat: 30.5702, status: 'online' },
    { name: '宽窄巷子监测站', lon: 104.0556, lat: 30.6739, status: 'warning' },
    { name: '武侯祠监测站', lon: 104.0438, lat: 30.6417, status: 'offline' },
    // ... 更多监测点
];

// 添加监测点到地图
function addMonitoringPointToMap(point) {
    if (!viewer) return;

    // 根据状态设置颜色
    const statusColors = {
        'online': Cesium.Color.GREEN,
        'warning': Cesium.Color.ORANGE,
        'offline': Cesium.Color.RED
    };

    const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
        billboard: {
            image: createMonitoringPointIcon(point.status),
            scale: 0.8, // 移动端适当缩小
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
            text: point.name,
            font: '12pt sans-serif', // 移动端字体
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            show: false // 默认隐藏，点击时显示
        },
        properties: {
            type: 'monitoring-point',
            data: point
        }
    });

    return entity;
}

// 创建监测点图标
function createMonitoringPointIcon(status) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // 绘制圆形背景
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, 2 * Math.PI);

    // 根据状态设置颜色
    switch(status) {
        case 'online':
            ctx.fillStyle = '#52C41A';
            break;
        case 'warning':
            ctx.fillStyle = '#FA8C16';
            break;
        case 'offline':
            ctx.fillStyle = '#FF4D4F';
            break;
    }

    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制状态图标
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('●', 16, 20);

    return canvas.toDataURL();
}
```

### 3. 移动端工具栏
```html
<!-- 浮动工具栏 -->
<div class="mobile-map-toolbar">
    <div class="toolbar-container">
        <button class="tool-btn" id="homeBtn" data-tooltip="回到成都">
            <span class="icon">🏠</span>
        </button>
        <button class="tool-btn" id="terrainBtn" data-tooltip="地形切换">
            <span class="icon">🏔️</span>
        </button>
        <button class="tool-btn" id="layerBtn" data-tooltip="图层控制">
            <span class="icon">🗺️</span>
        </button>
        <button class="tool-btn" id="pointBtn" data-tooltip="监测点">
            <span class="icon">📍</span>
        </button>
        <button class="tool-btn" id="warningBtn" data-tooltip="预警区域">
            <span class="icon">⚠️</span>
        </button>
        <button class="tool-btn" id="settingsBtn" data-tooltip="设置">
            <span class="icon">⚙️</span>
        </button>
    </div>
</div>
```

### 4. 移动端工具栏样式
```css
.mobile-map-toolbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 25px;
    padding: 8px 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.toolbar-container {
    display: flex;
    gap: 12px;
    align-items: center;
}

.tool-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.tool-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
}

.tool-btn.active {
    background: #1890FF;
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
}

/* 触控反馈 */
.tool-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
}

.tool-btn:active::after {
    width: 100%;
    height: 100%;
}
```

### 5. 触控事件处理
```javascript
// 移动端触控事件初始化
function initMobileTouchEvents() {
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 单击事件 - 选择监测点
    handler.setInputAction(function(click) {
        const pickedObject = viewer.scene.pick(click.position);

        if (Cesium.defined(pickedObject) && pickedObject.id.properties) {
            const properties = pickedObject.id.properties;

            if (properties.type && properties.type.getValue() === 'monitoring-point') {
                const pointData = properties.data.getValue();
                showMonitoringPointDetails(pointData);

                // 显示/隐藏标签
                const label = pickedObject.id.label;
                label.show = !label.show.getValue();
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 长按事件 - 添加监测点
    let pressTimer;
    let pressStartTime;

    handler.setInputAction(function(down) {
        pressStartTime = Date.now();
        pressTimer = setTimeout(() => {
            const cartesian = viewer.camera.pickEllipsoid(down.position, viewer.scene.globe.ellipsoid);
            if (cartesian) {
                const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);

                showAddPointDialog(longitude, latitude);
            }
        }, 1000); // 长按1秒触发
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function(up) {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 双击事件 - 飞行到位置
    handler.setInputAction(function(doubleClick) {
        const cartesian = viewer.camera.pickEllipsoid(doubleClick.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            viewer.camera.flyTo({
                destination: cartesian,
                duration: 1.5
            });
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}
```

### 6. 图层控制面板
```html
<!-- 图层控制弹窗 -->
<div id="layerControlModal" class="modal mobile-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>图层控制</h3>
            <button class="close-btn" onclick="closeModal('layerControlModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="layer-section">
                <h4>基础图层</h4>
                <div class="layer-item">
                    <label class="switch">
                        <input type="checkbox" id="terrainToggle" checked>
                        <span class="slider"></span>
                    </label>
                    <span class="layer-name">地形显示</span>
                </div>
                <div class="layer-item">
                    <label class="switch">
                        <input type="checkbox" id="boundaryToggle">
                        <span class="slider"></span>
                    </label>
                    <span class="layer-name">行政区划</span>
                </div>
            </div>

            <div class="layer-section">
                <h4>影像图层</h4>
                <div class="radio-group">
                    <label class="radio-item">
                        <input type="radio" name="imagery" value="osm" checked>
                        <span class="radio-label">OpenStreetMap</span>
                    </label>
                    <label class="radio-item">
                        <input type="radio" name="imagery" value="satellite">
                        <span class="radio-label">卫星影像</span>
                    </label>
                </div>
            </div>

            <div class="layer-section">
                <h4>数据图层</h4>
                <div class="layer-item">
                    <label class="switch">
                        <input type="checkbox" id="monitoringPointsToggle" checked>
                        <span class="slider"></span>
                    </label>
                    <span class="layer-name">监测点</span>
                </div>
                <div class="layer-item">
                    <label class="switch">
                        <input type="checkbox" id="warningAreasToggle" checked>
                        <span class="slider"></span>
                    </label>
                    <span class="layer-name">预警区域</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 7. 监测点详情弹窗
```html
<!-- 监测点详情弹窗 -->
<div id="pointDetailsModal" class="modal mobile-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="pointName">监测点详情</h3>
            <button class="close-btn" onclick="closeModal('pointDetailsModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="point-status">
                <div class="status-indicator" id="pointStatus"></div>
                <span class="status-text" id="pointStatusText">正常</span>
            </div>

            <div class="point-info">
                <div class="info-row">
                    <span class="label">位置坐标:</span>
                    <span class="value" id="pointCoordinates">104.0665, 30.5723</span>
                </div>
                <div class="info-row">
                    <span class="label">最后更新:</span>
                    <span class="value" id="pointLastUpdate">2024-07-16 14:30</span>
                </div>
                <div class="info-row">
                    <span class="label">数据完整性:</span>
                    <span class="value" id="pointDataIntegrity">98.5%</span>
                </div>
            </div>

            <div class="point-actions">
                <button class="btn btn-primary" onclick="navigateToPoint()">导航到此</button>
                <button class="btn btn-secondary" onclick="viewPointData()">查看数据</button>
            </div>
        </div>
    </div>
</div>
```

## 移动端特殊优化

### 1. 性能优化
```javascript
// 移动端性能优化配置
const mobileOptimizations = {
    // 降低渲染精度
    maximumScreenSpaceError: 4,

    // 减少缓存大小
    tileCacheSize: 50,

    // 启用请求渲染模式
    requestRenderMode: true,

    // 禁用不必要的效果
    enableLighting: false,
    fog: false,

    // 简化材质
    simplifyMaterials: true
};

// 根据设备性能调整设置
function adjustPerformanceSettings() {
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    if (deviceMemory < 4 || hardwareConcurrency < 4) {
        // 低端设备优化
        viewer.scene.globe.maximumScreenSpaceError = 8;
        viewer.scene.globe.tileCacheSize = 25;
        viewer.resolutionScale = 0.8;
    }
}
```

### 2. 触控手势支持
```javascript
// 手势识别
class MobileGestureHandler {
    constructor(viewer) {
        this.viewer = viewer;
        this.canvas = viewer.scene.canvas;
        this.initGestures();
    }

    initGestures() {
        // 双指缩放
        let lastDistance = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                const scale = currentDistance / lastDistance;
                this.handlePinchZoom(scale);
                lastDistance = currentDistance;
            }
        });
    }

    handlePinchZoom(scale) {
        const camera = this.viewer.camera;
        const height = camera.positionCartographic.height;
        const newHeight = height / scale;

        // 限制缩放范围
        const minHeight = 100;
        const maxHeight = 100000;
        const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                camera.positionCartographic.longitude,
                camera.positionCartographic.latitude,
                clampedHeight
            )
        });
    }
}
```

### 3. 离线支持
```javascript
// 离线地图支持
class OfflineMapManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.cachedTiles = new Map();
        this.initOfflineSupport();
    }

    initOfflineSupport() {
        // 监听网络状态
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncCachedData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });
    }

    showOfflineNotification() {
        showToast('warning', '离线模式', '当前处于离线状态，显示缓存数据');
    }

    syncCachedData() {
        showToast('success', '网络恢复', '正在同步最新数据...');
        // 同步逻辑
    }
}
```

## 响应式适配

### 小屏手机 (320px - 374px)
- 工具栏按钮缩小到40px
- 弹窗占满屏幕
- 字体适当缩小

### 标准手机 (375px - 413px)
- 标准44px触控区域
- 舒适的间距和字体

### 大屏手机 (414px+)
- 增大工具栏按钮到48px
- 更多信息展示空间

### 平板设备 (768px+)
- 侧边栏布局
- 多列信息展示
- 更丰富的交互功能

请提供完整的移动端地图页面，包含3D地图显示、监测点管理、图层控制、触控优化等功能，确保与大屏版本功能对等。

## 📋 开发实施指南

### 开发优先级

#### 第一阶段：核心功能 (MVP)
1. **首页框架** - 基础布局、导航系统、预警展示
2. **地图基础** - 3D地图初始化、监测点显示、基础交互
3. **数据采集** - GPS定位、表单录入、本地存储
4. **应急功能** - 紧急联系、求救信号、基础通信

#### 第二阶段：功能完善
1. **预警系统** - 实时推送、详情展示、确认机制
2. **多媒体** - 拍照录音、文件管理、压缩上传
3. **离线支持** - 数据缓存、离线检测、自动同步
4. **性能优化** - 懒加载、虚拟滚动、内存管理

#### 第三阶段：体验优化
1. **高级交互** - 手势识别、触觉反馈、动画效果
2. **智能功能** - 数据分析、趋势预测、智能提醒
3. **个性化** - 用户偏好、主题切换、快捷设置
4. **集成测试** - 端到端测试、性能测试、兼容性测试

### 技术实现要点

#### 性能优化策略
```javascript
// 移动端性能优化配置
const mobileOptimizations = {
    // 图片优化
    imageOptimization: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'webp'
    },

    // 数据分页
    pagination: {
        pageSize: 20,
        preloadPages: 2,
        virtualScrolling: true
    },

    // 缓存策略
    caching: {
        staticAssets: '7d',
        apiData: '1h',
        userData: '24h'
    },

    // 网络优化
    network: {
        timeout: 10000,
        retryAttempts: 3,
        compressionEnabled: true
    }
};
```

#### 安全性考虑
```javascript
// 数据安全配置
const securityConfig = {
    // 数据加密
    encryption: {
        algorithm: 'AES-256-GCM',
        keyRotation: '30d'
    },

    // 访问控制
    accessControl: {
        tokenExpiry: '8h',
        refreshThreshold: '1h',
        maxFailedAttempts: 5
    },

    // 数据验证
    validation: {
        inputSanitization: true,
        xssProtection: true,
        csrfProtection: true
    }
};
```

#### 兼容性支持
```javascript
// 浏览器兼容性检查
const compatibilityCheck = {
    requiredFeatures: [
        'geolocation',
        'localStorage',
        'webgl',
        'mediaDevices',
        'serviceWorker'
    ],

    fallbackStrategies: {
        noGeolocation: 'manualInput',
        noWebGL: 'canvas2D',
        noServiceWorker: 'appCache'
    },

    minimumVersions: {
        chrome: 70,
        firefox: 65,
        safari: 12,
        edge: 79
    }
};
```

### 测试验收标准

#### 功能测试清单
- [ ] 所有页面正常加载和导航
- [ ] GPS定位功能准确可靠
- [ ] 数据采集和存储完整
- [ ] 多媒体功能正常工作
- [ ] 离线模式数据同步
- [ ] 应急功能快速响应
- [ ] 地图交互流畅稳定
- [ ] 预警推送及时准确

#### 性能测试指标
- [ ] 首屏加载时间 < 3秒
- [ ] 页面切换响应 < 500ms
- [ ] 内存使用 < 100MB
- [ ] 电池续航影响 < 10%/小时
- [ ] 网络流量优化 < 50MB/天
- [ ] 离线功能可用时长 > 8小时

#### 兼容性测试范围
- [ ] iOS 12+ (iPhone 6s及以上)
- [ ] Android 8+ (API Level 26+)
- [ ] 主流浏览器最新版本
- [ ] 不同屏幕尺寸适配
- [ ] 横竖屏切换正常
- [ ] 网络环境适应性

### 部署发布流程

#### 构建配置
```javascript
// 生产环境构建配置
const buildConfig = {
    target: 'mobile',
    minify: true,
    sourceMaps: false,
    bundleAnalyzer: true,

    optimization: {
        splitChunks: true,
        treeShaking: true,
        deadCodeElimination: true
    },

    output: {
        path: './dist/mobile',
        publicPath: '/mobile/',
        filename: '[name].[contenthash].js'
    }
};
```

#### 发布检查清单
- [ ] 代码质量检查通过
- [ ] 安全漏洞扫描通过
- [ ] 性能测试达标
- [ ] 功能测试完整
- [ ] 文档更新完成
- [ ] 版本号更新正确

## 📚 总结

本移动端开发提示词文档提供了地质灾害预警系统移动端的完整开发指南，涵盖了从基础架构到具体实现的所有关键环节。

### 核心特色
1. **现场作业导向** - 专为野外作业人员设计，注重实用性和可靠性
2. **离线优先策略** - 确保在网络不稳定环境下的正常使用
3. **触控体验优化** - 针对移动设备特点进行深度优化
4. **功能对等保证** - 与大屏版本保持功能一致性
5. **性能安全并重** - 平衡用户体验与系统安全

### 开发建议
1. **渐进式开发** - 按优先级分阶段实施，确保核心功能优先
2. **用户测试驱动** - 邀请实际用户参与测试，持续优化体验
3. **性能监控** - 建立完善的性能监控体系，及时发现问题
4. **安全第一** - 严格遵循安全开发规范，保护用户数据
5. **文档同步** - 保持代码与文档同步更新，便于维护

通过遵循本文档的指导原则和技术规范，可以开发出功能完善、性能优异、用户体验良好的地质灾害预警系统移动端应用。
```