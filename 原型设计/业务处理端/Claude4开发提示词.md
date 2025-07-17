# 业务处理端原型开发提示词

## 🎯 基础提示词模板

```
# 地质灾害预警系统 - 业务处理端原型开发

## 角色定位
你是一位专业的前端开发工程师和UI/UX设计师，专门负责地质灾害预警系统业务处理端的原型开发。你需要开发适合预警业务员、应急协调员使用的业务流程处理界面。

## 技术要求
- 使用纯HTML、CSS、JavaScript开发
- 代码结构清晰，注释完整
- 响应式设计，支持PC和移动端
- 流程导向的UI设计风格
- 良好的协作和流程管理体验

## 业务处理端设计规范
### 色彩系统
- 主色调：#1890FF (科技蓝)
- 辅助色：#52C41A (成功绿)、#FA8C16 (警告橙)、#FF4D4F (危险红)
- 流程状态色彩：
  - 待处理：#1890FF
  - 处理中：#FA8C16
  - 已完成：#52C41A
  - 已驳回：#FF4D4F
- 中性色：#262626 (主文字)、#595959 (次要文字)、#8C8C8C (禁用文字)
- 背景色：#FFFFFF (主背景)、#FAFAFA (次背景)、#F5F5F5 (三级背景)

### 字体规范
- 字体族：PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif
- 标题字号：24px (h1)、20px (h2)、16px (h3)、14px (h4)
- 正文字号：14px (基础)、12px (小号)、10px (辅助)
- 行高：1.5 (基础)、1.3 (标题)

### 布局规范
- 最小分辨率：1366×768
- 推荐分辨率：1920×1080
- 侧边栏宽度：280px (展开)、64px (收起)
- 顶部导航高度：64px
- 间距单位：8px、16px、24px、32px
- 圆角：6px (小)、8px (中)、12px (大)
- 阴影：0 2px 8px rgba(0,0,0,0.1)

### 组件规范
- 按钮高度：32px (小)、40px (中)、48px (大)
- 表单控件高度：40px
- 卡片内边距：24px
- 流程节点大小：120px × 80px
- 连接线宽度：2px
```

## 🔄 预警流程管理页面提示词

```
# 业务处理端预警流程管理页面开发

## 页面概述
开发预警流程管理页面，包含流程设计、流程监控、流程优化等功能，这是业务流程的核心管理界面。

## 页面布局结构
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务处理 > 预警业务 > 流程管理                       │
├─────────────────────────────────────────────────────────────┤
│ 功能标签：流程设计 | 流程监控 | 流程优化                    │
├─────────────────────────────────────────────────────────────┤
│ 流程设计器                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 工具栏：[开始] [任务] [网关] [结束] [连线] [保存]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 画布区域                                                │ │
│ │                                                         │ │
│ │  ○ → □ → ◇ → □ → □ → ●                                │ │
│ │ 开始  数据  审核  发布  跟踪  结束                       │ │
│ │      采集  校验  预警  效果                             │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 节点属性配置                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 节点名称: [数据采集]                                    │ │
│ │ 处理人员: [下拉选择]                                    │ │
│ │ 超时时间: [30] 分钟                                     │ │
│ │ 处理规则: [文本框]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 功能模块详细需求

### 1. 流程设计器工具栏
```html
<div class="workflow-toolbar">
  <div class="node-tools">
    <button class="tool-btn" data-type="start" title="开始节点">
      <div class="node-icon start-node">○</div>
      <span>开始</span>
    </button>
    <button class="tool-btn" data-type="task" title="任务节点">
      <div class="node-icon task-node">□</div>
      <span>任务</span>
    </button>
    <button class="tool-btn" data-type="gateway" title="网关节点">
      <div class="node-icon gateway-node">◇</div>
      <span>网关</span>
    </button>
    <button class="tool-btn" data-type="end" title="结束节点">
      <div class="node-icon end-node">●</div>
      <span>结束</span>
    </button>
  </div>
  
  <div class="action-tools">
    <button class="tool-btn" data-action="connect" title="连接线">
      <i class="icon-arrow-right"></i>
      <span>连线</span>
    </button>
    <button class="tool-btn" data-action="delete" title="删除">
      <i class="icon-delete"></i>
      <span>删除</span>
    </button>
  </div>
  
  <div class="file-tools">
    <button class="btn btn-default" onclick="saveWorkflow()">
      <i class="icon-save"></i> 保存
    </button>
    <button class="btn btn-default" onclick="loadWorkflow()">
      <i class="icon-folder"></i> 加载
    </button>
    <button class="btn btn-primary" onclick="deployWorkflow()">
      <i class="icon-play"></i> 部署
    </button>
  </div>
</div>
```

### 2. 流程画布区域
```html
<div class="workflow-canvas" id="workflow-canvas">
  <svg class="canvas-svg" width="100%" height="600">
    <!-- 网格背景 -->
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- 流程节点和连线将动态添加到这里 -->
  </svg>
  
  <!-- 节点模板 -->
  <div class="node-templates" style="display: none;">
    <div class="workflow-node start-node" data-type="start">
      <div class="node-content">
        <div class="node-icon">○</div>
        <div class="node-label">开始</div>
      </div>
    </div>
    
    <div class="workflow-node task-node" data-type="task">
      <div class="node-content">
        <div class="node-icon">□</div>
        <div class="node-label">任务节点</div>
      </div>
    </div>
    
    <div class="workflow-node gateway-node" data-type="gateway">
      <div class="node-content">
        <div class="node-icon">◇</div>
        <div class="node-label">网关</div>
      </div>
    </div>
    
    <div class="workflow-node end-node" data-type="end">
      <div class="node-content">
        <div class="node-icon">●</div>
        <div class="node-label">结束</div>
      </div>
    </div>
  </div>
</div>
```

### 3. 节点属性配置面板
```html
<div class="property-panel" id="property-panel">
  <div class="panel-header">
    <h3>节点属性</h3>
    <button class="close-btn" onclick="closePropertyPanel()">&times;</button>
  </div>
  
  <div class="panel-content">
    <div class="form-group">
      <label>节点名称</label>
      <input type="text" id="node-name" placeholder="请输入节点名称">
    </div>
    
    <div class="form-group">
      <label>节点类型</label>
      <select id="node-type">
        <option value="start">开始节点</option>
        <option value="task">任务节点</option>
        <option value="gateway">网关节点</option>
        <option value="end">结束节点</option>
      </select>
    </div>
    
    <div class="form-group" id="assignee-group">
      <label>处理人员</label>
      <select id="node-assignee">
        <option value="">请选择处理人员</option>
        <option value="user1">张三 (预警员)</option>
        <option value="user2">李四 (审核员)</option>
        <option value="user3">王五 (发布员)</option>
      </select>
    </div>
    
    <div class="form-group" id="timeout-group">
      <label>超时时间</label>
      <div class="input-group">
        <input type="number" id="node-timeout" value="30" min="1" max="1440">
        <span class="input-addon">分钟</span>
      </div>
    </div>
    
    <div class="form-group">
      <label>处理规则</label>
      <textarea id="node-rules" placeholder="请输入处理规则..." rows="4"></textarea>
    </div>
    
    <div class="form-group" id="condition-group" style="display: none;">
      <label>分支条件</label>
      <div class="condition-list">
        <div class="condition-item">
          <input type="text" placeholder="条件表达式" class="condition-input">
          <button class="btn-remove" onclick="removeCondition(this)">删除</button>
        </div>
      </div>
      <button class="btn btn-default btn-sm" onclick="addCondition()">添加条件</button>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn btn-default" onclick="closePropertyPanel()">取消</button>
    <button class="btn btn-primary" onclick="saveNodeProperties()">保存</button>
  </div>
</div>
```

## 交互功能要求
1. **拖拽操作**：
   - 从工具栏拖拽节点到画布
   - 画布上节点可拖拽移动
   - 连接线拖拽创建

2. **节点编辑**：
   - 双击节点打开属性面板
   - 实时保存节点属性
   - 节点删除确认提示

3. **流程验证**：
   - 检查流程完整性
   - 验证节点连接关系
   - 提示错误和警告

4. **流程保存**：
   - 保存流程定义到本地存储
   - 支持导入导出JSON格式
   - 版本管理功能

## JavaScript功能实现
```javascript
// 流程设计器类
class WorkflowDesigner {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.nodes = [];
    this.connections = [];
    this.selectedNode = null;
    this.isDragging = false;
    
    this.initEventListeners();
  }
  
  // 添加节点
  addNode(type, x, y) {
    const node = {
      id: 'node_' + Date.now(),
      type: type,
      x: x,
      y: y,
      name: this.getDefaultNodeName(type),
      properties: this.getDefaultProperties(type)
    };
    
    this.nodes.push(node);
    this.renderNode(node);
    return node;
  }
  
  // 连接节点
  connectNodes(fromNodeId, toNodeId) {
    const connection = {
      id: 'conn_' + Date.now(),
      from: fromNodeId,
      to: toNodeId
    };
    
    this.connections.push(connection);
    this.renderConnection(connection);
    return connection;
  }
  
  // 保存流程
  saveWorkflow() {
    const workflow = {
      nodes: this.nodes,
      connections: this.connections,
      version: '1.0',
      createTime: new Date().toISOString()
    };
    
    localStorage.setItem('workflow_design', JSON.stringify(workflow));
    this.showMessage('流程保存成功', 'success');
  }
  
  // 验证流程
  validateWorkflow() {
    const errors = [];
    
    // 检查是否有开始节点
    const startNodes = this.nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push('流程必须包含开始节点');
    }
    
    // 检查是否有结束节点
    const endNodes = this.nodes.filter(n => n.type === 'end');
    if (endNodes.length === 0) {
      errors.push('流程必须包含结束节点');
    }
    
    // 检查节点连接
    this.nodes.forEach(node => {
      if (node.type !== 'end') {
        const outConnections = this.connections.filter(c => c.from === node.id);
        if (outConnections.length === 0) {
          errors.push(`节点 "${node.name}" 缺少输出连接`);
        }
      }
    });
    
    return errors;
  }
}

// 初始化流程设计器
const designer = new WorkflowDesigner('workflow-canvas');
```

请提供完整的预警流程管理页面，包含流程设计器、属性配置和流程验证功能。
```

## 📋 审批管理页面提示词

```
# 业务处理端审批管理页面开发

## 页面概述
开发审批管理页面，用于处理各类业务审批任务，包括预警发布审批、数据修正审批等。

## 页面布局结构
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务处理 > 预警业务 > 审批管理                       │
├─────────────────────────────────────────────────────────────┤
│ 统计卡片                                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 待办任务 │ │ 今日处理 │ │ 超时任务 │ │ 处理效率 │           │
│ │   15    │ │   8     │ │   2     │ │  95%   │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 任务列表 (60%)                    │ 审批详情 (40%)          │
│                                  │                         │
│ ┌──┬────────┬────────┬────────┐  │ ┌─────────────────────┐ │
│ │☐│ 任务标题│ 申请人 │ 操作   │  │ │ 申请内容            │ │
│ ├──┼────────┼────────┼────────┤  │ │                     │ │
│ │☐│ 滑坡预警│ 张三   │ 审批   │  │ │ 附件资料            │ │
│ │☐│ 数据修正│ 李四   │ 审批   │  │ │                     │ │
│ └──┴────────┴────────┴────────┘  │ │ 审批意见            │ │
│                                  │ │                     │ │
│                                  │ │ 审批结果            │ │
│                                  │ │ ○通过 ○驳回 ○转交  │ │
│                                  │ │                     │ │
│                                  │ │ [提交审批]          │ │
│                                  │ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 功能模块详细需求

### 1. 统计卡片组
```html
<div class="stats-cards">
  <div class="stat-card pending">
    <div class="stat-icon">📋</div>
    <div class="stat-content">
      <div class="stat-number" id="pending-count">15</div>
      <div class="stat-label">待办任务</div>
    </div>
  </div>
  
  <div class="stat-card processed">
    <div class="stat-icon">✅</div>
    <div class="stat-content">
      <div class="stat-number" id="processed-count">8</div>
      <div class="stat-label">今日处理</div>
    </div>
  </div>
  
  <div class="stat-card overdue">
    <div class="stat-icon">⏰</div>
    <div class="stat-content">
      <div class="stat-number" id="overdue-count">2</div>
      <div class="stat-label">超时任务</div>
    </div>
  </div>
  
  <div class="stat-card efficiency">
    <div class="stat-icon">📈</div>
    <div class="stat-content">
      <div class="stat-number" id="efficiency-rate">95%</div>
      <div class="stat-label">处理效率</div>
    </div>
  </div>
</div>
```

### 2. 任务列表
```html
<div class="task-list">
  <div class="list-header">
    <div class="list-filters">
      <select id="task-type-filter">
        <option value="">全部类型</option>
        <option value="warning">预警发布</option>
        <option value="data">数据修正</option>
        <option value="config">配置变更</option>
      </select>
      
      <select id="priority-filter">
        <option value="">全部优先级</option>
        <option value="high">高优先级</option>
        <option value="medium">中优先级</option>
        <option value="low">低优先级</option>
      </select>
      
      <button class="btn btn-default" onclick="refreshTasks()">刷新</button>
    </div>
    
    <div class="list-actions">
      <button class="btn btn-primary" onclick="batchApprove()">批量通过</button>
      <button class="btn btn-default" onclick="batchReject()">批量驳回</button>
    </div>
  </div>
  
  <div class="list-content">
    <table class="task-table">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all"></th>
          <th>任务标题</th>
          <th>申请人</th>
          <th>类型</th>
          <th>优先级</th>
          <th>截止时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="task-list-body">
        <!-- 任务列表项将动态生成 -->
      </tbody>
    </table>
  </div>
</div>
```

### 3. 审批详情面板
```html
<div class="approval-panel" id="approval-panel">
  <div class="panel-header">
    <h3>审批详情</h3>
    <div class="task-info">
      <span class="task-id" id="current-task-id">T001</span>
      <span class="task-priority high" id="current-task-priority">高优先级</span>
    </div>
  </div>
  
  <div class="panel-content">
    <div class="content-section">
      <h4>申请内容</h4>
      <div class="content-display" id="task-content">
        <!-- 申请内容将动态加载 -->
      </div>
    </div>
    
    <div class="content-section">
      <h4>附件资料</h4>
      <div class="attachment-list" id="task-attachments">
        <!-- 附件列表将动态加载 -->
      </div>
    </div>
    
    <div class="content-section">
      <h4>审批历史</h4>
      <div class="approval-history" id="approval-history">
        <!-- 审批历史将动态加载 -->
      </div>
    </div>
    
    <div class="content-section">
      <h4>审批意见</h4>
      <textarea id="approval-comment" placeholder="请输入审批意见..." rows="4"></textarea>
    </div>
    
    <div class="content-section">
      <h4>审批结果</h4>
      <div class="approval-result">
        <label class="radio-label">
          <input type="radio" name="approval-result" value="approve">
          <span class="radio-text approve">通过</span>
        </label>
        <label class="radio-label">
          <input type="radio" name="approval-result" value="reject">
          <span class="radio-text reject">驳回</span>
        </label>
        <label class="radio-label">
          <input type="radio" name="approval-result" value="transfer">
          <span class="radio-text transfer">转交</span>
        </label>
      </div>
      
      <div class="transfer-section" id="transfer-section" style="display: none;">
        <label>转交给:</label>
        <select id="transfer-user">
          <option value="">请选择转交人员</option>
          <option value="user1">张主管</option>
          <option value="user2">李经理</option>
          <option value="user3">王总监</option>
        </select>
      </div>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn btn-default" onclick="clearApproval()">清空</button>
    <button class="btn btn-primary" onclick="submitApproval()">提交审批</button>
  </div>
</div>
```

## 交互功能要求
1. **任务选择**：点击任务行加载详情到右侧面板
2. **批量操作**：支持批量通过、驳回操作
3. **实时更新**：任务状态变化实时更新
4. **审批验证**：提交前验证必填项
5. **快捷操作**：支持键盘快捷键操作

请提供完整的审批管理页面，包含任务列表和审批详情功能。
```

## 📊 业务监控页面提示词

```
# 业务处理端业务监控页面开发

## 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务处理 > 业务监控                                  │
├─────────────────────────────────────────────────────────────┤
│ 业务指标概览                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 预警发布量│ │ 处理效率 │ │ 响应时间 │ │ 满意度  │           │
│ │   23条  │ │  95.2%  │ │ 3.2分钟 │ │ 4.8分  │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 实时业务流程监控                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 流程名称: 滑坡预警发布流程                              │ │
│ │ ○ → □ → ◇ → □ → ●                                     │ │
│ │ 开始  数据  审核  发布  结束                             │ │
│ │      (3)   (2)   (1)                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 异常处理列表                                                │
│ ┌──┬────────────┬────────┬────────┬──────────────────────┐ │
│ │级别│ 发生时间    │ 流程   │ 节点   │ 异常描述             │ │
│ ├──┼────────────┼────────┼────────┼──────────────────────┤ │
│ │🔴│ 14:30:25   │ 预警发布│ 审核   │ 审核超时未处理       │ │
│ │🟡│ 14:28:15   │ 数据采集│ 验证   │ 数据格式不符合要求   │ │
│ └──┴────────────┴────────┴────────┴──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📈 报表分析页面提示词

```
# 业务处理端报表分析页面开发

## 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务处理 > 报表分析                                  │
├─────────────────────────────────────────────────────────────┤
│ 报表类型选择                                                │
│ [预警统计] [处理效率] [用户活跃度] [系统性能] [自定义报表]   │
├─────────────────────────────────────────────────────────────┤
│ 筛选条件                                                    │
│ 时间范围: [____] 部门: [____] 人员: [____] [生成报表]      │
├─────────────────────────────────────────────────────────────┤
│ 图表展示区域                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    预警发布趋势图                        │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    处理效率分析图                        │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作栏：[导出Excel] [导出PDF] [打印报表] [定时推送]         │
└─────────────────────────────────────────────────────────────┘
```

请提供完整的业务监控和报表分析页面。
```

## 🤝 协作管理页面提示词

```
# 业务处理端协作管理页面开发

## 团队协作页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务处理 > 团队协作                                  │
├─────────────────────────────────────────────────────────────┤
│ 在线团队成员                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 👤张三   │ │ 👤李四   │ │ 👤王五   │ │ 👤赵六   │           │
│ │ 在线     │ │ 忙碌     │ │ 离开     │ │ 在线     │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 协作任务看板                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 待办     │ │ 进行中   │ │ 待审核   │ │ 已完成   │           │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │           │
│ │ │任务1 │ │ │ │任务3 │ │ │ │任务5 │ │ │ │任务7 │ │           │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │           │
│ │ ┌─────┐ │ │ ┌─────┐ │ │         │ │ ┌─────┐ │           │
│ │ │任务2 │ │ │ │任务4 │ │ │         │ │ │任务8 │ │           │
│ │ └─────┘ │ │ └─────┘ │ │         │ │ └─────┘ │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 实时消息区域                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 张三: 滑坡预警已发布，请大家关注                        │ │
│ │ 李四: 收到，正在跟踪处理                                │ │
│ │ 系统: 新任务分配给王五                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [输入消息...] [发送]                                        │
└─────────────────────────────────────────────────────────────┘
```

## 功能要求
1. **实时协作**：团队成员状态实时更新
2. **任务看板**：拖拽式任务状态管理
3. **即时通讯**：团队内部消息沟通
4. **文件共享**：协作文档上传下载
5. **视频会议**：集成视频通话功能

请提供完整的协作管理页面。
```

## 🎨 业务处理端样式规范

```
## 业务处理端CSS样式规范

### 流程相关样式
```css
/* 流程节点样式 */
.workflow-node {
  position: absolute;
  width: 120px;
  height: 80px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.workflow-node:hover {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-2px);
}

.workflow-node.selected {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

/* 不同类型节点样式 */
.start-node {
  border-radius: 50%;
  background: #52c41a;
  color: white;
}

.end-node {
  border-radius: 50%;
  background: #ff4d4f;
  color: white;
}

.task-node {
  background: #1890ff;
  color: white;
}

.gateway-node {
  transform: rotate(45deg);
  background: #fa8c16;
  color: white;
}
```

### 审批相关样式
```css
/* 审批状态样式 */
.approval-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.approval-status.pending {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.approval-status.approved {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.approval-status.rejected {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
```

### 协作相关样式
```css
/* 用户状态指示器 */
.user-status {
  position: relative;
}

.user-status::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.user-status.online::after {
  background: #52c41a;
}

.user-status.busy::after {
  background: #fa8c16;
}

.user-status.away::after {
  background: #8c8c8c;
}

/* 看板卡片样式 */
.kanban-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.kanban-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}
```

请确保所有业务处理端页面都遵循这些样式规范。
```
