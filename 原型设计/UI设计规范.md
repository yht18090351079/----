# 地质灾害预警系统UI设计规范

## 1. 设计系统概览

### 1.1 设计理念
- **专业可靠**: 体现应急管理的专业性和可靠性
- **清晰直观**: 信息层次清晰，操作直观易懂
- **高效响应**: 界面响应迅速，支持快速操作
- **现代科技**: 体现智能化和科技感

### 1.2 视觉风格
- **整体风格**: 现代简约、科技感、专业性
- **色彩倾向**: 冷色调为主，暖色调点缀
- **设计语言**: 扁平化设计，适度阴影和渐变
- **品牌特色**: 突出应急管理和地质监测特色

## 2. 色彩规范

### 2.1 主色调
```css
/* 主色调 - 科技蓝 */
--primary-color: #1890FF;
--primary-light: #40A9FF;
--primary-dark: #096DD9;
--primary-bg: #E6F7FF;

/* 辅助色 - 成功绿 */
--success-color: #52C41A;
--success-light: #73D13D;
--success-dark: #389E0D;
--success-bg: #F6FFED;

/* 警告色 - 橙色 */
--warning-color: #FA8C16;
--warning-light: #FFA940;
--warning-dark: #D46B08;
--warning-bg: #FFF7E6;

/* 危险色 - 红色 */
--danger-color: #FF4D4F;
--danger-light: #FF7875;
--danger-dark: #CF1322;
--danger-bg: #FFF2F0;
```

### 2.2 中性色
```css
/* 文字颜色 */
--text-primary: #262626;    /* 主要文字 */
--text-secondary: #595959;  /* 次要文字 */
--text-disabled: #BFBFBF;   /* 禁用文字 */
--text-inverse: #FFFFFF;    /* 反色文字 */

/* 背景颜色 */
--bg-primary: #FFFFFF;      /* 主背景 */
--bg-secondary: #FAFAFA;    /* 次背景 */
--bg-tertiary: #F5F5F5;     /* 三级背景 */
--bg-dark: #001529;         /* 深色背景 */

/* 边框颜色 */
--border-light: #F0F0F0;    /* 浅边框 */
--border-base: #D9D9D9;     /* 基础边框 */
--border-dark: #8C8C8C;     /* 深边框 */
```

### 2.3 功能色彩应用
- **预警等级色彩**:
  - 蓝色预警: #1890FF
  - 黄色预警: #FADB14
  - 橙色预警: #FA8C16
  - 红色预警: #FF4D4F
- **设备状态色彩**:
  - 正常: #52C41A
  - 异常: #FF4D4F
  - 离线: #8C8C8C
  - 维护: #FA8C16

## 3. 字体规范

### 3.1 字体族
```css
/* 中文字体 */
font-family: 
  "PingFang SC",
  "Microsoft YaHei",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;

/* 数字字体 */
font-family: 
  "SF Mono",
  "Monaco",
  "Inconsolata",
  "Roboto Mono",
  "Source Code Pro",
  Consolas,
  "Courier New",
  monospace;
```

### 3.2 字号规范
```css
/* 标题字号 */
--font-size-h1: 32px;  /* 页面主标题 */
--font-size-h2: 24px;  /* 区块标题 */
--font-size-h3: 20px;  /* 卡片标题 */
--font-size-h4: 16px;  /* 小标题 */

/* 正文字号 */
--font-size-base: 14px;    /* 基础字号 */
--font-size-large: 16px;   /* 大号正文 */
--font-size-small: 12px;   /* 小号正文 */
--font-size-mini: 10px;    /* 辅助信息 */
```

### 3.3 行高规范
```css
--line-height-tight: 1.2;   /* 紧凑行高 */
--line-height-base: 1.5;    /* 基础行高 */
--line-height-loose: 1.8;   /* 宽松行高 */
```

## 4. 间距规范

### 4.1 基础间距
```css
/* 基础间距单位 */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-xxl: 48px;
```

### 4.2 组件间距
- **内边距**: 8px、16px、24px
- **外边距**: 16px、24px、32px
- **栅格间距**: 16px、24px
- **表单间距**: 16px、24px

### 4.3 页面布局间距
- **页面边距**: 24px
- **区块间距**: 32px
- **卡片间距**: 16px
- **列表间距**: 8px

## 5. 组件规范

### 5.1 按钮规范
#### 5.1.1 按钮类型
```css
/* 主要按钮 */
.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  height: 40px;
}

/* 次要按钮 */
.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  height: 40px;
}

/* 危险按钮 */
.btn-danger {
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  height: 40px;
}
```

#### 5.1.2 按钮尺寸
- **大按钮**: 48px高度，用于主要操作
- **中按钮**: 40px高度，用于常规操作
- **小按钮**: 32px高度，用于次要操作
- **迷你按钮**: 24px高度，用于表格操作

### 5.2 表单规范
#### 5.2.1 输入框
```css
.form-input {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-bg);
  outline: none;
}
```

#### 5.2.2 下拉选择
```css
.form-select {
  height: 40px;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  font-size: 14px;
  background: white url('arrow-down.svg') no-repeat right 12px center;
}
```

### 5.3 卡片规范
```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}

.card-header {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
```

### 5.4 表格规范
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table th {
  background: var(--bg-secondary);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--border-base);
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.table tr:hover {
  background: var(--bg-tertiary);
}
```

## 6. 图标规范

### 6.1 图标风格
- **线性图标**: 2px线宽，圆角端点
- **填充图标**: 用于状态指示和重要操作
- **尺寸规范**: 16px、20px、24px、32px
- **颜色规范**: 继承文字颜色或使用功能色

### 6.2 常用图标
- **导航图标**: 首页、菜单、返回、搜索
- **操作图标**: 编辑、删除、查看、下载
- **状态图标**: 成功、警告、错误、信息
- **业务图标**: 预警、监测、应急、设备

## 7. 响应式设计

### 7.1 断点设置
```css
/* 移动端 */
@media (max-width: 767px) {
  /* 手机样式 */
}

/* 平板端 */
@media (min-width: 768px) and (max-width: 1199px) {
  /* 平板样式 */
}

/* 桌面端 */
@media (min-width: 1200px) {
  /* 桌面样式 */
}

/* 大屏幕 */
@media (min-width: 1600px) {
  /* 大屏样式 */
}
```

### 7.2 栅格系统
- **12列栅格**: 基于12列的响应式栅格
- **间距**: 16px列间距
- **容器**: 最大宽度1200px，居中对齐
- **流式布局**: 支持百分比宽度

## 8. 动效规范

### 8.1 过渡动画
```css
/* 基础过渡 */
.transition-base {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 快速过渡 */
.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 慢速过渡 */
.transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 8.2 动画效果
- **淡入淡出**: 透明度变化
- **滑动**: 位移动画
- **缩放**: 大小变化
- **旋转**: 角度变化

### 8.3 交互反馈
- **悬停效果**: 颜色变化、阴影增强
- **点击效果**: 按下状态、波纹效果
- **加载状态**: 骨架屏、进度条
- **状态变化**: 平滑过渡动画

## 9. 特殊场景设计

### 9.1 大屏展示
- **字体放大**: 基础字号16px起
- **间距增加**: 1.5倍标准间距
- **对比增强**: 提高颜色对比度
- **信息密度**: 降低信息密度，突出重点

### 9.2 移动端适配
- **触控优化**: 最小点击区域44px
- **字体调整**: 最小字号12px
- **间距压缩**: 适当减少间距
- **导航简化**: 简化导航结构

### 9.3 3D可视化界面
- **控制面板**: 半透明背景，不遮挡3D场景
- **信息提示**: 浮动卡片形式显示
- **操作按钮**: 圆形按钮，易于识别
- **时间轴**: 底部固定，清晰的时间刻度

## 10. 设计交付

### 10.1 设计文件
- **Figma源文件**: 包含所有页面和组件
- **组件库**: 可复用的设计组件
- **图标库**: 系统使用的所有图标
- **样式指南**: 详细的样式规范

### 10.2 切图资源
- **图标资源**: SVG格式，多尺寸
- **背景图片**: 高清图片，多分辨率
- **插图资源**: 业务相关插图
- **3D模型**: 地形和建筑模型文件

### 10.3 开发支持
- **CSS变量**: 完整的CSS变量定义
- **组件代码**: 基础组件的HTML/CSS代码
- **动画代码**: 动效的CSS/JS实现
- **响应式代码**: 媒体查询和栅格代码
