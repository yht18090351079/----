# PC端原型设计大纲

## 1. PC端架构概览

### 1.1 用户角色与权限
| 用户角色 | 权限范围 | 主要功能 |
|---------|---------|---------|
| 应急管理人员 | 监控+指挥 | 实时监控、预警管理、应急指挥 |
| 政府决策者 | 态势+分析 | 态势感知、决策分析、效果评估 |
| 专业技术人员 | 数据+分析 | 数据分析、系统配置、技术运维 |
| 公众用户 | 信息查看 | 预警信息查看、安全知识学习 |

### 1.2 技术要求
- **最小分辨率**: 1366×768
- **推荐分辨率**: 1920×1080
- **大屏分辨率**: 3840×2160（4K）
- **浏览器支持**: Chrome 80+、Firefox 75+、Safari 13+、Edge 80+

## 2. 页面层级结构

```
PC展示端
├── 1. 实时监控大屏 (/)
│   ├── 1.1 全域态势子页面 (/monitor/overview)
│   ├── 1.2 区域详情子页面 (/monitor/region/:id)
│   ├── 1.3 设备状态子页面 (/monitor/devices)
│   └── 1.4 3D灾情可视化子页面 (/monitor/3d-visualization)
├── 2. 预警管理 (/warning)
│   ├── 2.1 预警发布子页面 (/warning/publish)
│   ├── 2.2 预警监控子页面 (/warning/monitor)
│   ├── 2.3 预警历史子页面 (/warning/history)
│   └── 2.4 预警统计子页面 (/warning/statistics)
├── 3. 数据分析 (/data)
│   ├── 3.1 实时数据子页面 (/data/realtime)
│   ├── 3.2 历史数据子页面 (/data/history)
│   ├── 3.3 数据质量子页面 (/data/quality)
│   └── 3.4 分析报告子页面 (/data/reports)
├── 4. 应急指挥 (/emergency)
│   ├── 4.1 指挥调度子页面 (/emergency/command)
│   ├── 4.2 资源管理子页面 (/emergency/resources)
│   ├── 4.3 通信协调子页面 (/emergency/communication)
│   └── 4.4 事件管理子页面 (/emergency/events)
└── 5. 系统设置 (/settings)
    ├── 5.1 个人设置子页面 (/settings/profile)
    ├── 5.2 通知设置子页面 (/settings/notifications)
    └── 5.3 显示设置子页面 (/settings/display)
```

## 3. 实时监控大屏设计

### 3.1 主页面布局 (/)
**页面结构**：
```
┌─────────────────────────────────────────────────────────────┐
│ 顶部导航栏 (Header)                                          │
├─────────────────────────────────────────────────────────────┤
│ 左侧菜单 │              中央地图区域                        │
│ (Sidebar)│                                                 │
│          │                                                 │
│          ├─────────────────────────────────────────────────┤
│          │              右侧信息面板                        │
├─────────────────────────────────────────────────────────────┤
│ 底部状态栏 (Footer)                                          │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **顶部导航栏模块**
  - 系统Logo + 标题
  - 面包屑导航
  - 用户头像 + 下拉菜单
  - 全屏切换按钮
  - 系统状态指示器

- **左侧菜单模块**
  - 一级菜单：监控、预警、数据、应急、设置
  - 二级菜单：展开显示子功能
  - 菜单折叠/展开控制
  - 快捷操作按钮

- **中央地图模块**
  - 地图容器 (MapContainer)
  - 图层控制器 (LayerController)
  - 监测点标记 (MarkerLayer)
  - 预警区域 (WarningLayer)
  - 地图工具栏 (MapToolbar)

- **右侧信息面板模块**
  - 关键指标卡片组 (KPICards)
  - 预警信息列表 (WarningList)
  - 设备状态列表 (DeviceStatus)
  - 实时通知 (Notifications)

### 3.2 交互逻辑设计
**页面加载流程**：
1. 用户访问首页 → 验证登录状态
2. 加载用户权限 → 渲染对应菜单
3. 初始化地图 → 加载基础图层
4. 获取监测点数据 → 渲染设备标记
5. 获取预警数据 → 渲染预警区域
6. 启动实时数据推送 → WebSocket连接
7. 定时刷新关键指标 → 每30秒更新

**地图交互逻辑**：
- **点击监测点** → 显示设备详情弹窗 → 可跳转设备详情页
- **点击预警区域** → 显示预警详情弹窗 → 可跳转预警详情页
- **地图缩放** → 自动聚合/分散标记 → 优化显示性能
- **图层切换** → 切换地图底图 → 保存用户偏好
- **区域选择** → 框选区域 → 筛选该区域数据

**数据更新逻辑**：
- **实时数据推送** → WebSocket接收 → 更新对应组件
- **预警状态变化** → 实时推送 → 弹窗提醒 + 声音提示
- **设备状态变化** → 实时推送 → 更新设备标记颜色
- **系统异常** → 推送异常信息 → 顶部横幅提示

### 3.3 3D灾情可视化子页面 (/monitor/3d-visualization)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 导航栏：返回监控 | 3D可视化 | 视角控制 | 播放控制           │
├─────────────────────────────────────────────────────────────┤
│ 控制面板                                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │历史灾情 │ │预警模拟 │ │时间轴   │ │图层控制 │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 3D场景区域                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │              3D地形模型                                 │ │
│ │                                                         │ │
│ │  🏔️ 山体模型    💧 水流动画    🌧️ 降雨效果            │ │
│ │                                                         │ │
│ │  📍 监测点位    ⚠️ 预警区域    🔴 灾害点位            │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 时间轴控制                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⏮️ ⏸️ ▶️ ⏭️ [████████████████████████████] 2024.07.16 │ │
│ │ 播放速度: 1x 2x 4x 8x    时间范围: 最近7天              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 信息面板                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 当前时间: 2024-07-16 14:30                              │ │
│ │ 降雨量: 45mm/h    风险等级: 橙色预警                    │ │
│ │ 影响范围: 5个村庄  预计影响人数: 1200人                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **3D渲染引擎模块 (3DRenderer)**
  - 地形渲染器 (TerrainRenderer)
  - 天气效果器 (WeatherEffects)
  - 粒子系统 (ParticleSystem)
  - 光照系统 (LightingSystem)

- **动画控制模块 (AnimationController)**
  - 时间轴控制器 (TimelineController)
  - 播放控制器 (PlaybackController)
  - 速度控制器 (SpeedController)
  - 场景切换器 (SceneSwitcher)

- **数据可视化模块 (DataVisualization)**
  - 历史数据加载器 (HistoryDataLoader)
  - 预警数据渲染器 (WarningRenderer)
  - 监测点可视化 (MonitoringPointViz)
  - 影响范围显示器 (ImpactAreaDisplay)

- **交互控制模块 (InteractionControl)**
  - 视角控制器 (CameraController)
  - 缩放控制器 (ZoomController)
  - 选择交互器 (SelectionInteractor)
  - 信息提示器 (InfoTooltip)

**功能特性**：
1. **历史灾情回放**
   - 选择历史灾害事件 → 3D场景重现
   - 时间轴拖拽 → 查看灾害发展过程
   - 多角度观察 → 360度视角切换
   - 关键节点标记 → 重要时刻高亮显示

2. **预警情景模拟**
   - 当前气象数据输入 → 预测灾害发展
   - 不同降雨强度模拟 → 多种情景对比
   - 影响范围动态显示 → 实时更新预警区域
   - 撤离路径规划 → 安全路线可视化

3. **动态效果展示**
   - 降雨动画效果 → 雨滴粒子系统
   - 水流汇聚动画 → 地表径流模拟
   - 山体变形动画 → 地质变化过程
   - 预警信号动画 → 警报闪烁效果

**交互逻辑**：
1. **场景初始化** → 加载3D地形模型 → 设置默认视角
2. **选择模式** → 历史回放/预警模拟 → 加载对应数据
3. **时间控制** → 播放/暂停/快进 → 更新场景状态
4. **视角操作** → 鼠标拖拽旋转 → 滚轮缩放 → 键盘移动
5. **信息查看** → 点击监测点 → 显示详细信息弹窗
6. **场景切换** → 选择不同区域 → 切换到对应3D场景

## 4. 预警管理模块设计

### 4.1 预警发布子页面 (/warning/publish)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 步骤导航：信息录入 → 内容编辑 → 预览确认 → 发布审核          │
├─────────────────────────────────────────────────────────────┤
│ 左侧信息录入区 │ 中央内容编辑区 │ 右侧预览区                │
│               │               │                           │
│ - 预警类型     │ - 富文本编辑器 │ - PC端预览                │
│ - 风险等级     │ - 模板选择     │ - 移动端预览              │
│ - 影响区域     │ - AI辅助生成   │ - 短信预览                │
│ - 有效时间     │ - 多媒体插入   │ - 邮件预览                │
│ - 发布渠道     │               │                           │
├─────────────────────────────────────────────────────────────┤
│ 底部操作栏：保存草稿 | 预览效果 | 提交审核 | 取消编辑        │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **信息录入模块 (InfoInput)**
  - 预警类型选择器 (WarningTypeSelector)
  - 风险等级选择器 (RiskLevelSelector)
  - 影响区域选择器 (AreaSelector)
  - 时间范围选择器 (TimeRangeSelector)
  - 发布渠道配置 (ChannelConfig)

- **内容编辑模块 (ContentEditor)**
  - 富文本编辑器 (RichTextEditor)
  - 模板选择器 (TemplateSelector)
  - AI辅助生成 (AIAssistant)
  - 媒体上传器 (MediaUploader)
  - 内容验证器 (ContentValidator)

- **预览模块 (PreviewPanel)**
  - 多端预览器 (MultiDevicePreview)
  - 渠道预览器 (ChannelPreview)
  - 效果模拟器 (EffectSimulator)

**交互逻辑**：
1. **页面初始化** → 检查草稿 → 恢复编辑状态
2. **信息录入** → 实时验证 → 联动更新预览
3. **模板选择** → 加载模板内容 → 填充编辑器
4. **AI辅助** → 分析当前数据 → 生成预警建议
5. **实时预览** → 监听编辑变化 → 更新预览效果
6. **提交审核** → 验证完整性 → 进入审核流程

### 4.2 预警监控子页面 (/warning/monitor)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 筛选工具栏：时间范围 | 预警类型 | 风险等级 | 状态筛选        │
├─────────────────────────────────────────────────────────────┤
│ 预警列表区域                    │ 预警详情区域              │
│                                │                           │
│ - 预警卡片列表                  │ - 预警基本信息            │
│ - 状态标识                      │ - 发布渠道统计            │
│ - 时间信息                      │ - 接收确认统计            │
│ - 操作按钮                      │ - 反馈信息列表            │
│                                │ - 处置进展跟踪            │
├─────────────────────────────────────────────────────────────┤
│ 底部统计栏：总数 | 有效预警 | 已确认 | 处置中 | 已结束      │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **筛选工具栏模块 (FilterToolbar)**
  - 时间筛选器 (TimeFilter)
  - 类型筛选器 (TypeFilter)
  - 状态筛选器 (StatusFilter)
  - 搜索框 (SearchBox)

- **预警列表模块 (WarningList)**
  - 预警卡片 (WarningCard)
  - 分页器 (Pagination)
  - 排序控制 (SortControl)
  - 批量操作 (BatchActions)

- **详情面板模块 (DetailPanel)**
  - 基本信息 (BasicInfo)
  - 发布统计 (PublishStats)
  - 接收统计 (ReceiveStats)
  - 反馈列表 (FeedbackList)
  - 操作历史 (ActionHistory)

**交互逻辑**：
1. **列表加载** → 获取预警数据 → 渲染预警卡片
2. **筛选操作** → 更新查询条件 → 重新加载列表
3. **点击预警** → 加载详情数据 → 显示详情面板
4. **状态更新** → WebSocket推送 → 实时更新状态
5. **批量操作** → 选择多个预警 → 执行批量处理

## 5. 数据分析模块设计

### 5.1 实时数据子页面 (/data/realtime)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 数据概览卡片组                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │在线设备 │ │数据完整性│ │异常数据 │ │更新频率 │           │
│ │ 98.5%  │ │  95.2%  │ │  2.1%  │ │ 1分钟  │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 左侧筛选面板 │              右侧数据展示区域                │
│             │                                             │
│ - 监测点选择 │ ┌─────────────────────────────────────────┐ │
│ - 数据类型   │ │              实时数据图表                │ │
│ - 时间范围   │ │                                         │ │
│ - 质量等级   │ └─────────────────────────────────────────┘ │
│             │ ┌─────────────────────────────────────────┐ │
│             │ │              数据列表表格                │ │
│             │ │                                         │ │
│             │ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **数据概览模块 (DataOverview)**
  - 统计卡片组 (StatCards)
  - 实时指标 (RealtimeMetrics)
  - 状态指示器 (StatusIndicators)

- **筛选面板模块 (FilterPanel)**
  - 监测点选择器 (SiteSelector)
  - 数据类型选择器 (DataTypeSelector)
  - 时间范围选择器 (TimeRangeSelector)
  - 质量等级筛选器 (QualityFilter)

- **数据展示模块 (DataDisplay)**
  - 实时图表 (RealtimeCharts)
  - 数据表格 (DataTable)
  - 导出功能 (ExportFunction)
  - 详情查看 (DetailView)

### 5.2 历史数据子页面 (/data/history)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 查询条件栏                                                  │
│ 时间范围: [____] 监测点: [____] 数据类型: [____] [查询]     │
├─────────────────────────────────────────────────────────────┤
│ 图表展示区域                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    趋势分析图表                          │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 数据表格区域                                                │
│ ┌──┬────────┬────────┬────────┬────────┬────────┬────────┐ │
│ │☐│ 时间   │ 监测点 │ 数据类型│ 数值   │ 质量   │ 操作   │ │
│ └──┴────────┴────────┴────────┴────────┴────────┴────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作栏：导出数据 | 生成报告 | 数据对比 | 异常分析            │
└─────────────────────────────────────────────────────────────┘
```

## 6. 应急指挥模块设计

### 6.1 指挥调度子页面 (/emergency/command)
**页面布局**：
```
┌─────────────────────────────────────────────────────────────┐
│ 事件信息栏：事件名称 | 等级 | 开始时间 | 指挥员 | 状态     │
├─────────────────────────────────────────────────────────────┤
│ 左侧态势展示 │ 中央地图区域 │ 右侧资源面板                  │
│             │             │                               │
│ - 事件概况   │ - 事件位置   │ - 人员资源                    │
│ - 影响范围   │ - 资源分布   │ - 设备资源                    │
│ - 处置进展   │ - 任务标记   │ - 物资资源                    │
│ - 关键指标   │ - 路径规划   │ - 通信状态                    │
├─────────────────────────────────────────────────────────────┤
│ 底部通信面板：视频会议 | 语音通话 | 消息推送 | 文档共享    │
└─────────────────────────────────────────────────────────────┘
```

**模块组成**：
- **态势展示模块 (SituationDisplay)**
  - 事件概况 (EventOverview)
  - 影响范围 (ImpactArea)
  - 处置进展 (ProgressTracker)
  - 关键指标 (KeyMetrics)

- **地图调度模块 (MapDispatch)**
  - 事件标记 (EventMarkers)
  - 资源标记 (ResourceMarkers)
  - 路径规划 (RouteePlanning)
  - 区域分析 (AreaAnalysis)

- **资源管理模块 (ResourceManagement)**
  - 人员管理 (PersonnelManagement)
  - 设备管理 (EquipmentManagement)
  - 物资管理 (SupplyManagement)
  - 通信管理 (CommunicationManagement)

- **通信协调模块 (CommunicationCoordination)**
  - 视频会议 (VideoConference)
  - 语音通话 (VoiceCall)
  - 消息推送 (MessagePush)
  - 文档共享 (DocumentSharing)

## 7. 响应式设计要点

### 7.1 断点设计
- **大屏幕**: ≥1600px (4K显示器优化)
- **标准桌面**: 1200px-1599px (主要适配)
- **小桌面**: 992px-1199px (笔记本适配)
- **平板横屏**: 768px-991px (平板适配)

### 7.2 布局适配
- **大屏幕**: 三栏布局，信息密度高
- **标准桌面**: 标准三栏布局
- **小桌面**: 可折叠侧边栏
- **平板横屏**: 两栏布局，隐藏次要信息

### 7.3 交互优化
- **鼠标交互**: 悬停效果、右键菜单
- **键盘快捷键**: 常用操作快捷键
- **触控支持**: 支持触摸屏操作
- **手势识别**: 缩放、拖拽手势

## 8. 性能优化策略

### 8.1 加载优化
- **懒加载**: 非首屏内容延迟加载
- **预加载**: 预测用户行为，提前加载
- **缓存策略**: 合理使用浏览器缓存
- **CDN加速**: 静态资源CDN分发

### 8.2 渲染优化
- **虚拟滚动**: 大数据列表虚拟化
- **分页加载**: 数据分页显示
- **图片优化**: 响应式图片、懒加载
- **动画优化**: CSS3动画，避免重排重绘

### 8.3 3D性能优化
- **LOD技术**: 根据距离调整模型精度
- **视锥剔除**: 只渲染可见区域
- **纹理压缩**: 优化纹理大小和格式
- **帧率控制**: 保持稳定的60FPS