// 地质灾害预警系统 - 预警监控页面脚本

// ========== 全局变量 ==========
let warningList = [];
let filteredWarnings = [];
let selectedWarning = null;
let currentFilters = {};

// ========== 模拟预警数据 ==========
const mockWarnings = [
    {
        id: 'W001',
        type: 'landslide',
        typeName: '滑坡',
        level: 'red',
        levelName: '红色预警',
        title: '成都市武侯区XX村滑坡红色预警',
        area: '成都市武侯区XX村',
        content: '受持续降雨影响，该区域土壤含水量急剧上升，地表位移加速，存在极高的滑坡风险。建议立即组织人员撤离，并设置警戒区域。',
        publishTime: '2025-07-24 14:30',
        validTime: '2025-07-25 14:30',
        publisher: '张三',
        status: 'active',
        statusName: '生效中',
        confirmRate: '85%',
        channels: [
            { name: '网站发布', status: 'success', count: '浏览 1,234 次' },
            { name: '移动端推送', status: 'success', count: '送达 856 人' },
            { name: '短信通知', status: 'success', count: '送达 432 人' },
            { name: '邮件通知', status: 'pending', count: '队列 89 封' }
        ],
        timeline: [
            { title: '预警发布', time: '2025-07-24 14:30', desc: '预警信息已通过多渠道发布', status: 'completed' },
            { title: '人员疏散', time: '2025-07-24 15:00', desc: '危险区域人员已开始疏散', status: 'completed' },
            { title: '现场监测', time: '进行中', desc: '技术人员正在现场进行监测', status: 'active' },
            { title: '风险解除', time: '待完成', desc: '等待风险解除确认', status: 'pending' }
        ]
    },
    {
        id: 'W002',
        type: 'debris-flow',
        typeName: '泥石流',
        level: 'orange',
        levelName: '橙色预警',
        title: '成都市锦江区YY镇泥石流橙色预警',
        area: '成都市锦江区YY镇',
        content: '强降雨可能引发泥石流灾害，请相关部门和公众注意防范。',
        publishTime: '2025-07-24 10:15',
        validTime: '2025-07-24 22:15',
        publisher: '李四',
        status: 'active',
        statusName: '生效中',
        confirmRate: '92%',
        channels: [
            { name: '网站发布', status: 'success', count: '浏览 856 次' },
            { name: '移动端推送', status: 'success', count: '送达 623 人' },
            { name: '短信通知', status: 'success', count: '送达 298 人' },
            { name: '邮件通知', status: 'success', count: '送达 156 封' }
        ],
        timeline: [
            { title: '预警发布', time: '2025-07-24 10:15', desc: '预警信息已发布', status: 'completed' },
            { title: '现场巡查', time: '2025-07-24 11:00', desc: '技术人员已到达现场', status: 'completed' },
            { title: '监测加强', time: '进行中', desc: '加强监测频次', status: 'active' }
        ]
    },
    {
        id: 'W003',
        type: 'collapse',
        typeName: '崩塌',
        level: 'yellow',
        levelName: '黄色预警',
        title: '成都市青羊区ZZ山崩塌黄色预警',
        area: '成都市青羊区ZZ山',
        content: '山体出现轻微变形，存在崩塌风险，请注意防范。',
        publishTime: '2025-07-23 16:45',
        validTime: '2025-07-24 16:45',
        publisher: '王五',
        status: 'expired',
        statusName: '已过期',
        confirmRate: '78%',
        channels: [
            { name: '网站发布', status: 'success', count: '浏览 432 次' },
            { name: '移动端推送', status: 'success', count: '送达 234 人' },
            { name: '短信通知', status: 'failed', count: '发送失败' },
            { name: '邮件通知', status: 'success', count: '送达 89 封' }
        ],
        timeline: [
            { title: '预警发布', time: '2025-07-23 16:45', desc: '预警信息已发布', status: 'completed' },
            { title: '现场监测', time: '2025-07-23 18:00', desc: '完成现场监测', status: 'completed' },
            { title: '风险评估', time: '2025-07-24 09:00', desc: '风险等级下降', status: 'completed' },
            { title: '预警解除', time: '2025-07-24 16:45', desc: '预警自动过期', status: 'completed' }
        ]
    },
    {
        id: 'W004',
        type: 'landslide',
        typeName: '滑坡',
        level: 'blue',
        levelName: '蓝色预警',
        title: '成都市成华区AA村滑坡蓝色预警',
        area: '成都市成华区AA村',
        content: '降雨量增加，存在轻微滑坡风险，请注意观察。',
        publishTime: '2025-07-24 08:20',
        validTime: '2025-07-24 20:20',
        publisher: '赵六',
        status: 'cancelled',
        statusName: '已取消',
        confirmRate: '65%',
        channels: [
            { name: '网站发布', status: 'success', count: '浏览 156 次' },
            { name: '移动端推送', status: 'success', count: '送达 89 人' }
        ],
        timeline: [
            { title: '预警发布', time: '2025-07-24 08:20', desc: '预警信息已发布', status: 'completed' },
            { title: '现场核实', time: '2025-07-24 10:30', desc: '现场情况良好', status: 'completed' },
            { title: '预警取消', time: '2025-07-24 12:00', desc: '经核实风险解除', status: 'completed' }
        ]
    }
];

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 预警监控页面初始化...');
    
    // 初始化数据
    warningList = [...mockWarnings];
    filteredWarnings = [...warningList];
    
    // 初始化筛选器事件
    initializeFilters();
    
    // 渲染预警列表
    renderWarningList();
    
    // 更新统计数据
    updateStatistics();
    
    // 设置自动刷新
    setInterval(refreshData, 30000); // 30秒刷新一次
    
    console.log('✅ 预警监控页面初始化完成');
});

// ========== 初始化筛选器 ==========
function initializeFilters() {
    const filterElements = ['timeRange', 'warningType', 'riskLevel', 'statusFilter'];
    
    filterElements.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

// ========== 应用筛选器 ==========
function applyFilters() {
    const timeRange = document.getElementById('timeRange').value;
    const warningType = document.getElementById('warningType').value;
    const riskLevel = document.getElementById('riskLevel').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    currentFilters = {
        timeRange,
        warningType,
        riskLevel,
        statusFilter
    };
    
    filteredWarnings = warningList.filter(warning => {
        // 时间范围筛选
        if (timeRange && timeRange !== 'month') {
            const publishDate = new Date(warning.publishTime);
            const now = new Date();
            const diffDays = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));
            
            if (timeRange === 'today' && diffDays > 0) return false;
            if (timeRange === 'week' && diffDays > 7) return false;
        }
        
        // 预警类型筛选
        if (warningType && warning.type !== warningType) return false;
        
        // 风险等级筛选
        if (riskLevel && warning.level !== riskLevel) return false;
        
        // 状态筛选
        if (statusFilter && warning.status !== statusFilter) return false;
        
        return true;
    });
    
    renderWarningList();
    updateStatistics();
    showToast('info', '筛选条件已应用');
}

// ========== 重置筛选器 ==========
function resetFilters() {
    document.getElementById('timeRange').value = 'month';
    document.getElementById('warningType').value = '';
    document.getElementById('riskLevel').value = '';
    document.getElementById('statusFilter').value = '';
    
    currentFilters = {};
    filteredWarnings = [...warningList];
    
    renderWarningList();
    updateStatistics();
    showToast('info', '筛选条件已重置');
}

// ========== 渲染预警列表 ==========
function renderWarningList() {
    const container = document.getElementById('warningList');
    
    if (filteredWarnings.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📋</div>
                <div class="no-data-text">暂无符合条件的预警信息</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredWarnings.map(warning => `
        <div class="warning-item ${selectedWarning?.id === warning.id ? 'selected' : ''}" 
             onclick="selectWarning('${warning.id}')">
            <div class="warning-header">
                <div>
                    <div class="warning-title">${warning.title}</div>
                    <div class="warning-area">📍 ${warning.area}</div>
                </div>
                <div class="warning-level ${warning.level}">${warning.levelName}</div>
            </div>
            <div class="warning-meta">
                <div class="warning-time">🕒 ${warning.publishTime}</div>
                <div class="warning-status ${warning.status}">${warning.statusName}</div>
            </div>
        </div>
    `).join('');
}

// ========== 选择预警 ==========
function selectWarning(warningId) {
    selectedWarning = warningList.find(w => w.id === warningId);
    
    if (selectedWarning) {
        renderWarningDetail(selectedWarning);
        renderWarningList(); // 重新渲染以更新选中状态
    }
}

// ========== 渲染预警详情 ==========
function renderWarningDetail(warning) {
    const container = document.getElementById('warningDetail');
    
    container.innerHTML = `
        <div class="warning-details">
            <div class="detail-header">
                <div class="warning-level-badge ${warning.level}">${warning.levelName}</div>
                <div class="warning-status ${warning.status}">${warning.statusName}</div>
            </div>
            
            <div class="detail-content">
                <div class="detail-section">
                    <h4>基本信息</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">预警类型:</span>
                            <span class="value">${warning.typeName}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">影响区域:</span>
                            <span class="value">${warning.area}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">发布时间:</span>
                            <span class="value">${warning.publishTime}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">有效期至:</span>
                            <span class="value">${warning.validTime}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">发布人:</span>
                            <span class="value">${warning.publisher}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">确认率:</span>
                            <span class="value">${warning.confirmRate}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>预警内容</h4>
                    <div class="warning-content">${warning.content}</div>
                </div>
                
                <div class="detail-section">
                    <h4>发布渠道统计</h4>
                    <div class="channel-stats">
                        ${warning.channels.map(channel => `
                            <div class="channel-item">
                                <span class="channel-name">${channel.name}</span>
                                <span class="channel-status ${channel.status}">${getChannelStatusText(channel.status)}</span>
                                <span class="channel-count">${channel.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>处置进展</h4>
                    <div class="progress-timeline">
                        ${warning.timeline.map(item => `
                            <div class="timeline-item ${item.status}">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">${item.title}</div>
                                    <div class="timeline-time">${item.time}</div>
                                    <div class="timeline-desc">${item.desc}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========== 获取渠道状态文本 ==========
function getChannelStatusText(status) {
    const statusMap = {
        'success': '已完成',
        'pending': '进行中',
        'failed': '失败'
    };
    return statusMap[status] || '未知';
}

// ========== 更新统计数据 ==========
function updateStatistics() {
    const stats = {
        total: filteredWarnings.length,
        active: filteredWarnings.filter(w => w.status === 'active').length,
        confirmed: Math.floor(filteredWarnings.length * 0.8), // 模拟确认数
        processing: Math.floor(filteredWarnings.length * 0.6), // 模拟处置中数
        ended: filteredWarnings.filter(w => w.status === 'expired' || w.status === 'cancelled').length
    };
    
    document.getElementById('totalWarnings').textContent = stats.total;
    document.getElementById('activeWarnings').textContent = stats.active;
    document.getElementById('confirmedWarnings').textContent = stats.confirmed;
    document.getElementById('processingWarnings').textContent = stats.processing;
    document.getElementById('endedWarnings').textContent = stats.ended;
}

// ========== 刷新列表 ==========
function refreshList() {
    // 模拟数据刷新
    showToast('info', '正在刷新数据...');
    
    setTimeout(() => {
        renderWarningList();
        updateStatistics();
        showToast('success', '数据刷新完成');
    }, 1000);
}

// ========== 切换视图 ==========
function toggleView() {
    showToast('info', '视图切换功能开发中');
}

// ========== 刷新数据 ==========
function refreshData() {
    // 模拟实时数据更新
    console.log('🔄 自动刷新数据...');
    updateStatistics();
}

// ========== 预警操作函数 ==========

// 编辑预警
function editWarning() {
    if (!selectedWarning) {
        showToast('warning', '请先选择要编辑的预警');
        return;
    }
    
    if (selectedWarning.status === 'expired' || selectedWarning.status === 'cancelled') {
        showToast('error', '已过期或已取消的预警无法编辑');
        return;
    }
    
    window.location.href = `warning-publish.html?edit=${selectedWarning.id}`;
}

// 取消预警
function cancelWarning() {
    if (!selectedWarning) {
        showToast('warning', '请先选择要取消的预警');
        return;
    }
    
    if (selectedWarning.status !== 'active') {
        showToast('error', '只能取消生效中的预警');
        return;
    }
    
    showConfirmModal(
        '取消预警',
        `确认取消预警"${selectedWarning.title}"吗？取消后将无法恢复。`,
        function() {
            // 执行取消操作
            selectedWarning.status = 'cancelled';
            selectedWarning.statusName = '已取消';
            
            renderWarningList();
            renderWarningDetail(selectedWarning);
            updateStatistics();
            
            showToast('success', '预警已取消');
            closeConfirmModal();
        }
    );
}

// 延期预警
function extendWarning() {
    if (!selectedWarning) {
        showToast('warning', '请先选择要延期的预警');
        return;
    }
    
    if (selectedWarning.status !== 'active') {
        showToast('error', '只能延期生效中的预警');
        return;
    }
    
    showConfirmModal(
        '延期预警',
        `确认将预警"${selectedWarning.title}"延期24小时吗？`,
        function() {
            // 执行延期操作
            const validTime = new Date(selectedWarning.validTime);
            validTime.setHours(validTime.getHours() + 24);
            selectedWarning.validTime = validTime.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/\//g, '-');
            
            renderWarningDetail(selectedWarning);
            
            showToast('success', '预警已延期24小时');
            closeConfirmModal();
        }
    );
}

// ========== 模态框操作 ==========

// 显示预警详情模态框
function showWarningModal(warningId) {
    const warning = warningList.find(w => w.id === warningId);
    if (!warning) return;
    
    // 填充模态框内容
    document.getElementById('modalTitle').textContent = warning.title;
    document.getElementById('modalWarningLevel').textContent = warning.levelName;
    document.getElementById('modalWarningLevel').className = `warning-level-badge ${warning.level}`;
    document.getElementById('modalWarningStatus').textContent = warning.statusName;
    document.getElementById('modalWarningStatus').className = `warning-status ${warning.status}`;
    
    // 填充详细信息
    document.getElementById('modalType').textContent = warning.typeName;
    document.getElementById('modalArea').textContent = warning.area;
    document.getElementById('modalPublishTime').textContent = warning.publishTime;
    document.getElementById('modalValidTime').textContent = warning.validTime;
    document.getElementById('modalPublisher').textContent = warning.publisher;
    document.getElementById('modalConfirmRate').textContent = warning.confirmRate;
    document.getElementById('modalContent').textContent = warning.content;
    
    // 显示模态框
    document.getElementById('warningModal').style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('warningModal').style.display = 'none';
}

// 显示确认对话框
function showConfirmModal(title, message, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'block';
    
    // 设置确认回调
    window.confirmCallback = callback;
}

// 关闭确认对话框
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    window.confirmCallback = null;
}

// 确认操作
function confirmAction() {
    if (window.confirmCallback) {
        window.confirmCallback();
    }
}

// ========== 工具函数 ==========

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 显示提示消息
function showToast(type, message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 添加样式
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: '500',
        zIndex: '3000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // 设置背景色
    const colors = {
        success: '#00ff88',
        error: '#ff4444',
        warning: '#ffaa00',
        info: '#00ffff'
    };
    toast.style.background = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== 事件监听 ==========

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const warningModal = document.getElementById('warningModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (event.target === warningModal) {
        closeModal();
    }
    
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeConfirmModal();
    }
});
