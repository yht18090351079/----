# 管理端原型开发提示词

## 🎯 基础提示词模板

```
# 地质灾害预警系统 - 管理端原型开发

## 角色定位
你是一位专业的前端开发工程师和UI/UX设计师，专门负责地质灾害预警系统管理端的原型开发。你需要开发适合系统管理员、业务管理员使用的后台管理界面。

## 技术要求
- 使用纯HTML、CSS、JavaScript开发
- 代码结构清晰，注释完整
- 响应式设计，主要适配PC端
- 专业的后台管理UI设计风格
- 良好的数据管理和操作体验

## 管理端设计规范
### 色彩系统
- 主色调：#1890FF (科技蓝)
- 辅助色：#52C41A (成功绿)、#FA8C16 (警告橙)、#FF4D4F (危险红)
- 管理端专用色：
  - 信息色：#1890FF
  - 成功色：#52C41A
  - 警告色：#FADB14
  - 危险色：#FF4D4F
- 中性色：#262626 (主文字)、#595959 (次要文字)、#8C8C8C (禁用文字)
- 背景色：#FFFFFF (主背景)、#FAFAFA (次背景)、#F5F5F5 (三级背景)

### 字体规范
- 字体族：PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif
- 标题字号：24px (h1)、20px (h2)、16px (h3)、14px (h4)
- 正文字号：14px (基础)、12px (小号)、10px (辅助)
- 行高：1.5 (基础)、1.2 (标题)

### 布局规范
- 最小分辨率：1366×768
- 推荐分辨率：1920×1080
- 侧边栏宽度：240px (展开)、64px (收起)
- 顶部导航高度：64px
- 间距单位：8px、16px、24px、32px
- 圆角：4px (小)、6px (中)、8px (大)
- 阴影：0 2px 8px rgba(0,0,0,0.1)

### 组件规范
- 按钮高度：32px (小)、40px (中)、48px (大)
- 表单控件高度：32px
- 表格行高：48px
- 卡片内边距：24px
- 页面内边距：24px
```

## 👥 用户管理页面提示词

```
# 管理端用户管理页面开发

## 页面概述
开发用户管理页面，这是系统管理员管理用户账户、角色权限的核心页面，需要提供完整的CRUD操作功能。

## 页面布局结构
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：系统管理 > 用户管理                                  │
├─────────────────────────────────────────────────────────────┤
│ 操作工具栏                                                  │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 新增用户 │ │ 批量导入 │ │ 批量操作 │ │ 导出数据 │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 筛选条件栏                                                  │
│ 用户名: [____] 角色: [____] 状态: [____] 部门: [____] [搜索] │
├─────────────────────────────────────────────────────────────┤
│ 用户列表表格                                                │
│ ┌──┬────────┬────────┬────────┬────────┬────────┬────────┐ │
│ │☐│ 用户名  │ 姓名   │ 角色   │ 部门   │ 状态   │ 操作   │ │
│ ├──┼────────┼────────┼────────┼────────┼────────┼────────┤ │
│ │☐│ admin  │ 管理员 │ 超管   │ 技术部 │ 正常   │ 编辑删除│ │
│ │☐│ user01 │ 张三   │ 操作员 │ 应急部 │ 正常   │ 编辑删除│ │
│ │☐│ user02 │ 李四   │ 审核员 │ 业务部 │ 禁用   │ 编辑删除│ │
│ └──┴────────┴────────┴────────┴────────┴────────┴────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 分页控件：共100条 每页20条 [上一页] 1 2 3 4 5 [下一页]      │
└─────────────────────────────────────────────────────────────┘
```

## 功能模块详细需求

### 1. 操作工具栏
```html
<div class="toolbar">
  <div class="toolbar-left">
    <button class="btn btn-primary" onclick="showAddUserModal()">
      <i class="icon-plus"></i> 新增用户
    </button>
    <button class="btn btn-default" onclick="showImportModal()">
      <i class="icon-upload"></i> 批量导入
    </button>
    <div class="dropdown">
      <button class="btn btn-default dropdown-toggle">
        批量操作 <i class="icon-down"></i>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#" onclick="batchEnable()">批量启用</a></li>
        <li><a href="#" onclick="batchDisable()">批量禁用</a></li>
        <li><a href="#" onclick="batchDelete()">批量删除</a></li>
      </ul>
    </div>
  </div>
  <div class="toolbar-right">
    <button class="btn btn-default" onclick="exportUsers()">
      <i class="icon-download"></i> 导出数据
    </button>
  </div>
</div>
```

### 2. 筛选条件栏
```html
<div class="filter-bar">
  <div class="filter-item">
    <label>用户名:</label>
    <input type="text" id="filter-username" placeholder="请输入用户名">
  </div>
  <div class="filter-item">
    <label>角色:</label>
    <select id="filter-role">
      <option value="">全部角色</option>
      <option value="admin">系统管理员</option>
      <option value="business">业务管理员</option>
      <option value="operator">操作员</option>
    </select>
  </div>
  <div class="filter-item">
    <label>状态:</label>
    <select id="filter-status">
      <option value="">全部状态</option>
      <option value="active">正常</option>
      <option value="disabled">禁用</option>
    </select>
  </div>
  <div class="filter-item">
    <label>部门:</label>
    <select id="filter-department">
      <option value="">全部部门</option>
      <option value="tech">技术部</option>
      <option value="business">业务部</option>
      <option value="emergency">应急部</option>
    </select>
  </div>
  <button class="btn btn-primary" onclick="searchUsers()">搜索</button>
  <button class="btn btn-default" onclick="resetFilters()">重置</button>
</div>
```

### 3. 用户表格
- 支持全选/单选功能
- 表头点击排序
- 行悬停高亮效果
- 状态用不同颜色标识
- 操作按钮权限控制

### 4. 新增/编辑用户弹窗
```html
<div class="modal" id="userModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">新增用户</h4>
        <button class="close" onclick="hideUserModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="userForm">
          <div class="form-group">
            <label>用户名 <span class="required">*</span></label>
            <input type="text" id="username" required>
          </div>
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input type="text" id="realname" required>
          </div>
          <div class="form-group">
            <label>邮箱 <span class="required">*</span></label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input type="tel" id="phone">
          </div>
          <div class="form-group">
            <label>角色 <span class="required">*</span></label>
            <select id="role" required>
              <option value="">请选择角色</option>
              <option value="admin">系统管理员</option>
              <option value="business">业务管理员</option>
              <option value="operator">操作员</option>
            </select>
          </div>
          <div class="form-group">
            <label>部门</label>
            <select id="department">
              <option value="">请选择部门</option>
              <option value="tech">技术部</option>
              <option value="business">业务部</option>
              <option value="emergency">应急部</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <div class="radio-group">
              <label><input type="radio" name="status" value="active" checked> 正常</label>
              <label><input type="radio" name="status" value="disabled"> 禁用</label>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" onclick="hideUserModal()">取消</button>
        <button class="btn btn-primary" onclick="saveUser()">保存</button>
      </div>
    </div>
  </div>
</div>
```

## 交互功能要求
1. **表格操作**：
   - 点击表头排序（升序/降序）
   - 全选/反选功能
   - 行点击选中效果
   - 批量操作确认提示

2. **筛选搜索**：
   - 实时筛选功能
   - 组合条件搜索
   - 搜索结果高亮
   - 筛选条件重置

3. **表单验证**：
   - 必填项验证
   - 格式验证（邮箱、手机）
   - 重复性验证（用户名唯一）
   - 实时验证提示

4. **权限控制**：
   - 按钮权限显示/隐藏
   - 操作权限验证
   - 敏感操作二次确认

## 数据模拟
```javascript
const userData = [
  {
    id: 1,
    username: "admin",
    realname: "系统管理员",
    email: "admin@example.com",
    phone: "13800138000",
    role: "admin",
    roleName: "系统管理员",
    department: "tech",
    departmentName: "技术部",
    status: "active",
    createTime: "2024-01-01 10:00:00",
    lastLogin: "2024-07-16 14:30:00"
  },
  {
    id: 2,
    username: "user01",
    realname: "张三",
    email: "zhangsan@example.com",
    phone: "13800138001",
    role: "operator",
    roleName: "操作员",
    department: "emergency",
    departmentName: "应急部",
    status: "active",
    createTime: "2024-02-01 10:00:00",
    lastLogin: "2024-07-16 13:20:00"
  }
  // ... 更多用户数据
];
```

请提供完整的用户管理页面，包含列表展示、筛选搜索、新增编辑、批量操作等功能。
```

## ⚙️ 系统配置页面提示词

```
# 管理端系统配置页面开发

## 页面概述
开发系统配置页面，用于管理系统的各项配置参数，包括基础配置、安全配置、通知配置等。

## 页面布局结构
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：系统管理 > 系统配置                                  │
├─────────────────────────────────────────────────────────────┤
│ 配置分类标签：基础配置 | 安全配置 | 通知配置 | 接口配置      │
├─────────────────────────────────────────────────────────────┤
│ 配置表单区域                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 系统名称: [地质灾害预警系统]                            │ │
│ │ 系统版本: [v1.0.0]                                      │ │
│ │ 部署环境: ○ 开发环境 ○ 测试环境 ● 生产环境              │ │
│ │ 数据保留: [30] 天                                       │ │
│ │ 会话超时: [30] 分钟                                     │ │
│ │ 文件大小: [10] MB                                       │ │
│ │ 并发用户: [1000] 人                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作按钮：[保存配置] [重置] [导出配置] [导入配置]            │
└─────────────────────────────────────────────────────────────┘
```

## 配置分类详细需求

### 1. 基础配置标签页
```html
<div class="config-section" id="basic-config">
  <div class="config-group">
    <h3>系统信息</h3>
    <div class="form-row">
      <div class="form-group">
        <label>系统名称</label>
        <input type="text" id="system-name" value="地质灾害预警系统">
      </div>
      <div class="form-group">
        <label>系统版本</label>
        <input type="text" id="system-version" value="v1.0.0" readonly>
      </div>
    </div>
    <div class="form-group">
      <label>部署环境</label>
      <div class="radio-group">
        <label><input type="radio" name="environment" value="dev"> 开发环境</label>
        <label><input type="radio" name="environment" value="test"> 测试环境</label>
        <label><input type="radio" name="environment" value="prod" checked> 生产环境</label>
      </div>
    </div>
  </div>
  
  <div class="config-group">
    <h3>数据配置</h3>
    <div class="form-row">
      <div class="form-group">
        <label>数据保留期</label>
        <input type="number" id="data-retention" value="30" min="1" max="365">
        <span class="unit">天</span>
      </div>
      <div class="form-group">
        <label>备份频率</label>
        <select id="backup-frequency">
          <option value="daily">每日</option>
          <option value="weekly" selected>每周</option>
          <option value="monthly">每月</option>
        </select>
      </div>
    </div>
  </div>
</div>
```

### 2. 安全配置标签页
```html
<div class="config-section" id="security-config" style="display: none;">
  <div class="config-group">
    <h3>密码策略</h3>
    <div class="form-group">
      <label>最小密码长度</label>
      <input type="number" id="min-password-length" value="8" min="6" max="20">
      <span class="unit">位</span>
    </div>
    <div class="form-group">
      <label>密码复杂度</label>
      <div class="checkbox-group">
        <label><input type="checkbox" checked> 包含大写字母</label>
        <label><input type="checkbox" checked> 包含小写字母</label>
        <label><input type="checkbox" checked> 包含数字</label>
        <label><input type="checkbox"> 包含特殊字符</label>
      </div>
    </div>
    <div class="form-group">
      <label>密码有效期</label>
      <input type="number" id="password-expiry" value="90" min="30" max="365">
      <span class="unit">天</span>
    </div>
  </div>
  
  <div class="config-group">
    <h3>登录安全</h3>
    <div class="form-row">
      <div class="form-group">
        <label>会话超时</label>
        <input type="number" id="session-timeout" value="30" min="5" max="480">
        <span class="unit">分钟</span>
      </div>
      <div class="form-group">
        <label>最大登录失败次数</label>
        <input type="number" id="max-login-attempts" value="5" min="3" max="10">
        <span class="unit">次</span>
      </div>
    </div>
    <div class="form-group">
      <label>账户锁定时间</label>
      <input type="number" id="lockout-duration" value="30" min="5" max="1440">
      <span class="unit">分钟</span>
    </div>
  </div>
</div>
```

### 3. 通知配置标签页
```html
<div class="config-section" id="notification-config" style="display: none;">
  <div class="config-group">
    <h3>邮件配置</h3>
    <div class="form-row">
      <div class="form-group">
        <label>SMTP服务器</label>
        <input type="text" id="smtp-server" placeholder="smtp.example.com">
      </div>
      <div class="form-group">
        <label>SMTP端口</label>
        <input type="number" id="smtp-port" value="587">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>发送邮箱</label>
        <input type="email" id="sender-email" placeholder="noreply@example.com">
      </div>
      <div class="form-group">
        <label>邮箱密码</label>
        <input type="password" id="email-password" placeholder="请输入密码">
      </div>
    </div>
    <div class="form-group">
      <label>
        <input type="checkbox" id="enable-email"> 启用邮件通知
      </label>
    </div>
  </div>
  
  <div class="config-group">
    <h3>短信配置</h3>
    <div class="form-row">
      <div class="form-group">
        <label>短信服务商</label>
        <select id="sms-provider">
          <option value="aliyun">阿里云</option>
          <option value="tencent">腾讯云</option>
          <option value="huawei">华为云</option>
        </select>
      </div>
      <div class="form-group">
        <label>AccessKey</label>
        <input type="text" id="sms-access-key" placeholder="请输入AccessKey">
      </div>
    </div>
    <div class="form-group">
      <label>
        <input type="checkbox" id="enable-sms"> 启用短信通知
      </label>
    </div>
  </div>
</div>
```

## 交互功能要求
1. **标签页切换**：点击标签切换不同配置分类
2. **表单验证**：配置项实时验证和格式检查
3. **配置保存**：保存前确认提示，保存后成功反馈
4. **配置重置**：重置为默认值，需要确认操作
5. **配置导入导出**：支持JSON格式的配置文件

请提供完整的系统配置页面，包含多个配置分类和完整的表单功能。
```

## 📊 数据管理页面提示词

```
# 管理端数据管理页面开发

## 数据质量监控页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：数据管理 > 数据质量                                  │
├─────────────────────────────────────────────────────────────┤
│ 数据质量概览                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 数据完整性│ │ 数据准确性│ │ 数据及时性│ │ 数据一致性│           │
│ │  95.2%  │ │  98.7%  │ │  92.1%  │ │  96.8%  │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 质量问题列表                                                │
│ ┌──┬────────────┬────────┬────────┬──────────────────────┐ │
│ │级别│ 发现时间    │ 数据源 │ 问题类型│ 问题描述             │ │
│ ├──┼────────────┼────────┼────────┼──────────────────────┤ │
│ │🔴│ 14:30:25   │ DEV001 │ 缺失   │ 连续3小时无数据      │ │
│ │🟡│ 14:28:15   │ DEV002 │ 异常   │ 数值超出正常范围     │ │
│ │🟢│ 14:25:10   │ DEV003 │ 延迟   │ 数据延迟5分钟上报    │ │
│ └──┴────────────┴────────┴────────┴──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作栏：[质量检查] [数据修复] [质量报告] [规则配置]          │
└─────────────────────────────────────────────────────────────┘
```

## 设备管理页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：业务管理 > 设备管理                                  │
├─────────────────────────────────────────────────────────────┤
│ 设备统计卡片                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 总设备数 │ │ 在线设备 │ │ 离线设备 │ │ 故障设备 │           │
│ │  156台  │ │  142台  │ │   8台   │ │   6台   │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 设备列表表格                                                │
│ ┌──┬────────┬────────┬────────┬────────┬────────┬────────┐ │
│ │☐│ 设备编号│ 设备名称│ 设备类型│ 安装位置│ 状态   │ 操作   │ │
│ ├──┼────────┼────────┼────────┼────────┼────────┼────────┤ │
│ │☐│ DEV001 │位移监测仪│ 位移   │ XX隐患点│ 正常   │ 查看编辑│ │
│ │☐│ DEV002 │雨量计   │ 降雨   │ XX监测站│ 离线   │ 查看编辑│ │
│ │☐│ DEV003 │倾斜仪   │ 倾斜   │ XX边坡  │ 故障   │ 查看编辑│ │
│ └──┴────────┴────────┴────────┴────────┴────────┴────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作栏：[新增设备] [批量导入] [导出数据] [设备巡检]          │
└─────────────────────────────────────────────────────────────┘
```

## 功能要求
1. **数据质量监控**：
   - 实时质量指标展示
   - 质量问题分级显示
   - 自动质量检查规则
   - 质量报告生成

2. **设备管理**：
   - 设备信息CRUD操作
   - 设备状态实时监控
   - 设备维护记录
   - 设备性能分析

请提供完整的数据管理页面。
```

## 🔐 权限管理页面提示词

```
# 管理端权限管理页面开发

## 角色权限配置页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：系统管理 > 角色权限                                  │
├─────────────────────────────────────────────────────────────┤
│ 左侧角色列表 │              右侧权限配置区域                │
│             │                                             │
│ ┌─────────┐ │ ┌─────────────────────────────────────────┐ │
│ │ 超级管理员│ │ │ 角色信息                              │ │
│ │ [选中]   │ │ │ 角色名称: [超级管理员]                │ │
│ └─────────┘ │ │ 角色描述: [系统最高权限]              │ │
│ ┌─────────┐ │ └─────────────────────────────────────────┘ │
│ │ 业务管理员│ │ ┌─────────────────────────────────────────┐ │
│ └─────────┘ │ │ 权限配置                              │ │
│ ┌─────────┐ │ │ ☑ 用户管理                            │ │
│ │ 运维管理员│ │ │   ☑ 用户查看  ☑ 用户编辑  ☑ 用户删除 │ │
│ └─────────┘ │ │ ☑ 系统配置                            │ │
│ ┌─────────┐ │ │   ☑ 配置查看  ☑ 配置修改            │ │
│ │ + 新增角色│ │ │ ☐ 数据管理                            │ │
│ └─────────┘ │ └─────────────────────────────────────────┘ │
│             │ ┌─────────────────────────────────────────┐ │
│             │ │ 操作按钮: [保存] [重置] [删除角色]      │ │
│             │ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 权限矩阵页面
```html
<div class="permission-matrix">
  <table class="matrix-table">
    <thead>
      <tr>
        <th>功能模块</th>
        <th>系统管理员</th>
        <th>业务管理员</th>
        <th>运维管理员</th>
        <th>操作员</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>用户管理</td>
        <td><input type="checkbox" checked disabled></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
      </tr>
      <tr>
        <td>系统配置</td>
        <td><input type="checkbox" checked disabled></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox" checked></td>
        <td><input type="checkbox"></td>
      </tr>
      <tr>
        <td>数据管理</td>
        <td><input type="checkbox" checked disabled></td>
        <td><input type="checkbox" checked></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
      </tr>
    </tbody>
  </table>
</div>
```

请提供完整的权限管理页面，包含角色配置和权限矩阵功能。
```

## 📈 系统监控页面提示词

```
# 管理端系统监控页面开发

## 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：运维管理 > 系统监控                                  │
├─────────────────────────────────────────────────────────────┤
│ 系统状态概览                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ CPU使用率│ │ 内存使用率│ │ 磁盘使用率│ │ 网络流量 │           │
│ │  45.2%  │ │  67.8%  │ │  23.4%  │ │ 125MB/s │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 服务状态监控                                                │
│ ┌──┬────────────┬────────┬────────┬────────┬────────────┐ │
│ │●│ 服务名称    │ 状态   │ CPU    │ 内存   │ 最后检查   │ │
│ ├──┼────────────┼────────┼────────┼────────┼────────────┤ │
│ │🟢│ Web服务     │ 运行中 │ 12.3%  │ 256MB  │ 1分钟前    │ │
│ │🟢│ 数据库服务  │ 运行中 │ 23.1%  │ 512MB  │ 1分钟前    │ │
│ │🔴│ 消息队列    │ 异常   │ 0%     │ 0MB    │ 5分钟前    │ │
│ └──┴────────────┴────────┴────────┴────────┴────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 实时监控图表                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    系统性能趋势图                        │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 日志管理页面
```
┌─────────────────────────────────────────────────────────────┐
│ 面包屑：运维管理 > 日志管理                                  │
├─────────────────────────────────────────────────────────────┤
│ 日志筛选条件                                                │
│ 时间: [____] 级别: [____] 模块: [____] 关键词: [____] [搜索]│
├─────────────────────────────────────────────────────────────┤
│ 日志列表                                                    │
│ ┌──┬────────────┬────────┬────────┬──────────────────────┐ │
│ │级别│ 时间        │ 模块   │ 用户   │ 日志内容             │ │
│ ├──┼────────────┼────────┼────────┼──────────────────────┤ │
│ │🔴│ 14:30:25   │ 登录   │ admin  │ 用户登录成功         │ │
│ │🟡│ 14:28:15   │ 预警   │ user01 │ 发布橙色预警         │ │
│ │🔴│ 14:25:10   │ 系统   │ system │ 数据库连接异常       │ │
│ └──┴────────────┴────────┴────────┴──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 操作栏：[导出日志] [清理日志] [日志分析] [实时监控]          │
└─────────────────────────────────────────────────────────────┘
```

请提供完整的系统监控页面，包含性能监控和日志管理功能。
```

## 🎨 管理端样式规范

```
## 管理端CSS样式规范

### 基础样式
```css
/* 管理端基础样式 */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-sidebar {
  width: 240px;
  background: #001529;
  color: white;
  transition: width 0.3s;
}

.admin-sidebar.collapsed {
  width: 64px;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
```

### 表格样式
```css
.admin-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.admin-table th {
  background: #fafafa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}

.admin-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.admin-table tr:hover {
  background: #fafafa;
}
```

### 表单样式
```css
.admin-form .form-group {
  margin-bottom: 24px;
}

.admin-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
}

.admin-form input,
.admin-form select,
.admin-form textarea {
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.admin-form input:focus,
.admin-form select:focus,
.admin-form textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}
```

### 按钮样式
```css
.btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-default {
  background: white;
  color: #262626;
  border: 1px solid #d9d9d9;
}

.btn-danger {
  background: #ff4d4f;
  color: white;
}
```

请确保所有管理端页面都遵循这些样式规范。
```
