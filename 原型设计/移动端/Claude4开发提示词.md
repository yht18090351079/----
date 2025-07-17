# 移动端原型开发提示词

## 🎯 基础提示词模板

```
# 地质灾害预警系统 - 移动端原型开发

## 角色定位
你是一位专业的移动端前端开发工程师和UI/UX设计师，专门负责地质灾害预警系统移动端的原型开发。你需要开发适合现场作业人员使用的移动端应用界面。

## 技术要求
- 使用纯HTML、CSS、JavaScript开发
- 移动优先的响应式设计
- 触控友好的交互体验
- 支持离线功能模拟
- 现代化的移动端UI设计
- 良好的性能和加载速度

## 移动端设计规范
### 色彩系统
- 主色调：#1890FF (科技蓝)
- 辅助色：#52C41A (成功绿)、#FA8C16 (警告橙)、#FF4D4F (危险红)
- 预警等级色彩：
  - 蓝色预警：#1890FF
  - 黄色预警：#FADB14
  - 橙色预警：#FA8C16
  - 红色预警：#FF4D4F
- 中性色：#262626 (主文字)、#8C8C8C (次要文字)、#F5F5F5 (背景)

### 字体规范
- 字体族：-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif
- 标题字号：24px (h1)、20px (h2)、18px (h3)、16px (h4)
- 正文字号：16px (基础)、14px (小号)、12px (辅助)
- 行高：1.5 (基础)、1.3 (标题)

### 移动端布局规范
- 设计尺寸：375px (iPhone SE) 至 414px (iPhone 11 Pro Max)
- 平板尺寸：768px (iPad) 至 1024px (iPad Pro)
- 最小触控区域：44px × 44px
- 间距单位：4px、8px、12px、16px、24px
- 圆角：4px (小)、6px (中)、8px (大)
- 阴影：0 2px 8px rgba(0,0,0,0.1)

### 移动端组件规范
- 按钮最小高度：44px
- 表单控件高度：44px
- 列表项高度：56px
- 导航栏高度：56px
- 标签栏高度：50px
- 卡片内边距：16px
```

## 📱 首页界面提示词

```
# 移动端首页界面开发

## 页面概述
开发移动端首页，这是用户打开App后看到的第一个页面，需要快速展示关键信息和提供便捷操作入口。

## 页面布局结构
```
┌─────────────────────────────────┐
│ 状态栏：信号 | 时间 | 电池      │ ← 系统状态栏
├─────────────────────────────────┤
│ 导航栏：标题 | 搜索 | 设置      │ ← 高度: 56px
├─────────────────────────────────┤
│ 预警概览卡片                    │ ← 高度: 120px
│ ┌─────────────────────────────┐ │
│ │ 当前预警状态 | 风险等级     │ │
│ │ 最新预警信息 | 查看详情     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 快捷操作区域                    │ ← 高度: 200px
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │预警查看│ │现场上报│ │应急联系│ │
│ └───────┘ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │数据采集│ │安全导航│ │求救功能│ │
│ └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│ 消息通知列表                    │ ← 可滚动区域
│ - 系统消息                      │
│ - 任务通知                      │
│ - 预警更新                      │
├─────────────────────────────────┤
│ 底部导航：首页|预警|作业|消息|我的│ ← 高度: 50px
└─────────────────────────────────┘
```

## 功能模块详细需求

### 1. 导航栏
- 左侧：系统标题 "地质灾害预警"
- 右侧：搜索图标、设置图标
- 背景：渐变色或纯色
- 状态栏适配：安全区域处理

### 2. 预警概览卡片
```html
<div class="warning-overview-card">
  <div class="warning-status">
    <div class="status-indicator orange"></div>
    <span class="status-text">橙色预警</span>
  </div>
  <div class="warning-content">
    <h3>XX村滑坡橙色预警</h3>
    <p>受持续降雨影响，发生滑坡风险较高...</p>
    <button class="view-detail-btn">查看详情</button>
  </div>
</div>
```

### 3. 快捷操作网格
- 3×2网格布局
- 每个按钮包含图标+文字
- 点击动画效果
- 根据用户权限显示不同功能

### 4. 消息通知列表
- 最新5条消息
- 未读消息红点提示
- 下拉刷新功能
- 点击跳转详情页

### 5. 底部导航栏
- 5个主要功能入口
- 当前页面高亮显示
- 图标+文字标签
- 安全区域适配

## 交互要求
1. **下拉刷新**：首页支持下拉刷新数据
2. **快捷操作**：按钮点击有触觉反馈效果
3. **预警提醒**：新预警时卡片闪烁提示
4. **消息推送**：新消息时底部导航显示红点
5. **手势操作**：支持左右滑动切换功能

## 数据模拟
### 预警数据
```javascript
const currentWarning = {
  level: "orange",
  type: "滑坡",
  title: "XX村滑坡橙色预警",
  content: "受持续降雨影响，XX村发生滑坡的风险较高，请相关人员注意防范...",
  publishTime: "2024-07-16 14:30",
  isActive: true
};
```

### 快捷操作数据
```javascript
const quickActions = [
  { id: 1, name: "预警查看", icon: "⚠️", color: "#FA8C16", permission: "all" },
  { id: 2, name: "现场上报", icon: "📝", color: "#1890FF", permission: "field" },
  { id: 3, name: "应急联系", icon: "📞", color: "#FF4D4F", permission: "all" },
  { id: 4, name: "数据采集", icon: "📊", color: "#52C41A", permission: "field" },
  { id: 5, name: "安全导航", icon: "🧭", color: "#722ED1", permission: "field" },
  { id: 6, name: "求救功能", icon: "🆘", color: "#FF4D4F", permission: "all" }
];
```

## 响应式适配
### iPhone SE (375px)
- 快捷操作按钮较小
- 文字适当缩小
- 间距紧凑

### iPhone 12 (390px)
- 标准布局
- 舒适的间距
- 清晰的视觉层次

### iPad (768px)
- 横向布局优化
- 增加侧边栏
- 更多信息展示

请提供完整的移动端首页HTML文件，包含所有CSS样式和JavaScript交互逻辑。
```

## 🔧 现场作业页面提示词

```
# 移动端现场作业页面开发

## 页面概述
开发现场作业人员使用的数据采集页面，这是移动端的核心功能页面，需要支持GPS定位、数据录入、多媒体采集等功能。

## 页面布局结构
```
┌─────────────────────────────────┐
│ 导航栏：返回 | 数据采集 | 帮助   │ ← 高度: 56px
├─────────────────────────────────┤
│ 位置信息卡片                    │ ← 高度: 100px
│ ┌─────────────────────────────┐ │
│ │ 📍 GPS坐标 | 精度 | 地址信息 │ │
│ │ 刷新位置 | 手动输入坐标     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 数据录入表单                    │ ← 可滚动区域
│ - 监测点选择                    │
│ - 数据类型选择                  │
│ - 数值输入                      │
│ - 备注说明                      │
├─────────────────────────────────┤
│ 多媒体采集                      │ ← 高度: 120px
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │ 📷拍照 │ │ 🎤录音 │ │ 📹录像 │ │
│ └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│ 已采集数据列表                  │ ← 可滚动区域
│ - 数据项1 [已保存]              │
│ - 数据项2 [待上传]              │
├─────────────────────────────────┤
│ 操作按钮：保存草稿 | 提交数据    │ ← 高度: 60px
└─────────────────────────────────┘
```

## 功能模块详细需求

### 1. 位置信息模块
```html
<div class="location-card">
  <div class="location-info">
    <div class="coordinates">
      <span class="label">经度:</span>
      <span class="value" id="longitude">104.0668</span>
      <span class="label">纬度:</span>
      <span class="value" id="latitude">30.5728</span>
    </div>
    <div class="accuracy">
      <span class="label">精度:</span>
      <span class="value" id="accuracy">±5米</span>
    </div>
    <div class="address" id="address">成都市武侯区...</div>
  </div>
  <div class="location-actions">
    <button class="refresh-btn" onclick="refreshLocation()">🔄 刷新位置</button>
    <button class="manual-btn" onclick="manualInput()">✏️ 手动输入</button>
  </div>
</div>
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