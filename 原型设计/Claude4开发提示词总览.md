# Claude4开发提示词总览

## 📋 提示词文档结构

本文档汇总了地质灾害预警系统各端的Claude4开发提示词，为HTML/CSS/JavaScript原型开发提供完整的指导。

```
原型设计/
├── PC端/
│   └── Claude4开发提示词.md (824行)
├── 移动端/
│   └── Claude4开发提示词.md (808行)
├── 管理端/
│   └── Claude4开发提示词.md (824行)
├── 业务处理端/
│   └── Claude4开发提示词.md (824行)
└── Claude4开发提示词总览.md (本文件)
```

## 🎯 各端特色功能概览

### **PC端 - 专业监控大屏**
**核心特色**：
- 🖥️ **实时监控大屏**：1920×1080大屏适配，科技感强
- 🌍 **3D可视化场景**：Three.js地形模型，动态效果
- 📊 **数据分析图表**：ECharts多维度图表展示
- 🗺️ **地图可视化**：监测点标记，预警区域显示
- ⚡ **高性能渲染**：LOD技术，视锥剔除优化

**主要页面**：
- 监控大屏页面
- 3D可视化页面  
- 预警管理页面
- 数据分析页面
- 通用组件库

### **移动端 - 现场作业工具**
**核心特色**：
- 📱 **触控优化界面**：44px最小触控区域，手势友好
- 📍 **GPS定位采集**：实时位置获取，精度显示
- 📷 **多媒体采集**：拍照、录音、录像功能
- 🔄 **离线数据同步**：本地存储，网络恢复自动同步
- 🆘 **应急求救功能**：一键报警，位置共享

**主要页面**：
- 首页界面
- 现场作业页面
- 应急功能页面
- 预警信息页面
- 通用组件库

### **管理端 - 系统后台管理**
**核心特色**：
- 👥 **用户权限管理**：角色配置，权限矩阵
- ⚙️ **系统配置管理**：参数配置，安全策略
- 📊 **数据质量监控**：质量指标，问题检测
- 🔧 **设备管理维护**：设备状态，维护记录
- 📈 **系统性能监控**：资源使用，服务状态

**主要页面**：
- 用户管理页面
- 系统配置页面
- 数据管理页面
- 权限管理页面
- 系统监控页面

### **业务处理端 - 流程协作平台**
**核心特色**：
- 🔄 **可视化流程设计**：拖拽式流程编辑器
- ✅ **智能审批管理**：任务分配，批量处理
- 📊 **业务监控分析**：流程监控，效率分析
- 🤝 **团队协作看板**：实时协作，任务看板
- 📈 **报表分析系统**：多维度报表，数据导出

**主要页面**：
- 预警流程管理页面
- 审批管理页面
- 业务监控页面
- 协作管理页面
- 报表分析页面

## 🛠️ 技术栈统一规范

### **前端技术选择**
```javascript
// 基础技术栈
- HTML5 + CSS3 + ES6+ JavaScript
- 响应式设计 (Flexbox + Grid)
- CSS变量和自定义属性

// 可视化库 (CDN引入)
- Three.js (3D可视化)
- ECharts (图表库)
- D3.js (数据可视化)
- Mapbox GL JS (地图)

// UI组件库 (可选)
- Ant Design (管理端)
- Vant (移动端)
- Element UI (PC端)
```

### **设计系统统一**
```css
/* 色彩系统 */
:root {
  /* 主色调 */
  --primary-color: #1890FF;
  --success-color: #52C41A;
  --warning-color: #FA8C16;
  --error-color: #FF4D4F;
  
  /* 预警等级色彩 */
  --warning-blue: #1890FF;
  --warning-yellow: #FADB14;
  --warning-orange: #FA8C16;
  --warning-red: #FF4D4F;
  
  /* 中性色 */
  --text-primary: #262626;
  --text-secondary: #595959;
  --text-disabled: #8C8C8C;
  --background-primary: #FFFFFF;
  --background-secondary: #FAFAFA;
  --background-tertiary: #F5F5F5;
}

/* 字体系统 */
:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --font-size-xxl: 24px;
}

/* 间距系统 */
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

## 📱 响应式断点统一

```css
/* 统一断点系统 */
:root {
  --breakpoint-xs: 480px;   /* 小屏手机 */
  --breakpoint-sm: 768px;   /* 平板竖屏 */
  --breakpoint-md: 992px;   /* 平板横屏 */
  --breakpoint-lg: 1200px;  /* 小桌面 */
  --breakpoint-xl: 1600px;  /* 大桌面 */
}

/* 媒体查询 */
@media (max-width: 480px) { /* 小屏手机 */ }
@media (min-width: 481px) and (max-width: 768px) { /* 标准手机 */ }
@media (min-width: 769px) and (max-width: 992px) { /* 平板 */ }
@media (min-width: 993px) and (max-width: 1200px) { /* 小桌面 */ }
@media (min-width: 1201px) { /* 大桌面 */ }
```

## 🎨 组件库标准化

### **通用组件规范**
```javascript
// 按钮组件
const Button = {
  sizes: ['small', 'medium', 'large'], // 32px, 40px, 48px
  types: ['primary', 'default', 'danger', 'success'],
  states: ['normal', 'hover', 'active', 'disabled', 'loading']
};

// 表单组件
const Form = {
  controls: ['input', 'select', 'textarea', 'checkbox', 'radio'],
  validation: ['required', 'email', 'phone', 'number', 'custom'],
  feedback: ['success', 'error', 'warning', 'validating']
};

// 数据展示组件
const DataDisplay = {
  table: ['sortable', 'filterable', 'pagination', 'selection'],
  chart: ['line', 'bar', 'pie', 'scatter', 'heatmap'],
  card: ['basic', 'hoverable', 'bordered', 'loading']
};
```

## 🔧 开发工作流程

### **1. 需求分析阶段**
```
1. 确定目标端 (PC/移动/管理/业务处理)
2. 选择对应的提示词文件
3. 分析具体页面需求
4. 确定功能优先级
```

### **2. 提示词使用阶段**
```
1. 复制基础提示词模板
2. 根据具体需求调整参数
3. 添加特定功能要求
4. 明确交互和样式需求
```

### **3. 开发实施阶段**
```
1. 使用Claude4生成初始代码
2. 测试基础功能
3. 迭代优化细节
4. 跨端适配验证
```

### **4. 质量保证阶段**
```
1. 功能完整性检查
2. 响应式适配测试
3. 性能优化验证
4. 用户体验评估
```

## 📝 使用建议

### **提示词优化技巧**
1. **具体化需求**：详细描述功能要求和交互细节
2. **分步骤开发**：复杂页面分模块逐步实现
3. **样式统一**：使用统一的设计系统和组件规范
4. **性能考虑**：明确性能要求和优化策略
5. **测试验证**：提供测试用例和验证标准

### **常见问题解决**
1. **样式不一致**：使用CSS变量和统一的设计系统
2. **响应式问题**：明确断点要求和适配策略
3. **交互复杂**：分解为简单的交互单元
4. **性能问题**：使用懒加载和虚拟化技术
5. **兼容性问题**：明确浏览器支持范围

### **最佳实践**
1. **模块化开发**：组件化思维，可复用设计
2. **渐进增强**：基础功能优先，高级功能可选
3. **用户体验**：以用户为中心的设计思维
4. **性能优先**：关注加载速度和运行效率
5. **可维护性**：清晰的代码结构和注释

## 🚀 快速开始

### **选择开发端**
1. **PC端**：适合监控大屏、数据分析等专业界面
2. **移动端**：适合现场作业、应急响应等移动场景
3. **管理端**：适合系统管理、用户管理等后台功能
4. **业务处理端**：适合流程管理、审批协作等业务场景

### **获取提示词**
```bash
# 查看对应端的提示词文件
原型设计/PC端/Claude4开发提示词.md
原型设计/移动端/Claude4开发提示词.md
原型设计/管理端/Claude4开发提示词.md
原型设计/业务处理端/Claude4开发提示词.md
```

### **开始开发**
1. 复制对应端的基础提示词模板
2. 根据具体页面需求调整提示词
3. 使用Claude4生成原型代码
4. 测试和优化生成的代码
5. 迭代完善功能和样式

---

*通过使用这些结构化的提示词，您可以高效地利用Claude4开发出高质量的地质灾害预警系统原型，为后续的产品开发奠定坚实基础。*
