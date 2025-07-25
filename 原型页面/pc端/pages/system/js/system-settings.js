// 地质灾害预警系统 - 系统设置页面脚本

// ========== 全局变量 ==========
let currentSection = 'general';
let settingsData = {};

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 系统设置页面初始化...');
    
    // 初始化菜单切换
    initializeMenuSwitching();
    
    // 加载设置数据
    loadSettings();
    
    // 初始化表单事件
    initializeFormEvents();
    
    console.log('✅ 系统设置页面初始化完成');
});

// ========== 初始化菜单切换 ==========
function initializeMenuSwitching() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
}

// ========== 切换设置部分 ==========
function switchSection(sectionId) {
    // 更新菜单状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // 更新内容区域
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // 根据不同部分加载相应内容
    loadSectionContent(sectionId);
}

// ========== 加载部分内容 ==========
function loadSectionContent(sectionId) {
    switch (sectionId) {
        case 'general':
            // 基础设置已在HTML中
            break;
        case 'monitoring':
            // 监测配置已在HTML中
            break;
        case 'warning':
            // 预警设置已在HTML中
            break;
        case 'users':
            loadUserManagement();
            break;
        case 'devices':
            loadDeviceManagement();
            break;
        case 'logs':
            loadLogManagement();
            break;
        case 'backup':
            loadBackupManagement();
            break;
    }
}

// ========== 加载用户管理 ==========
function loadUserManagement() {
    // 用户管理内容已在HTML中，这里可以添加动态加载逻辑
    console.log('📋 加载用户管理数据');
}

// ========== 加载设备管理 ==========
function loadDeviceManagement() {
    // 设备管理内容已在HTML中，这里可以添加动态加载逻辑
    console.log('📱 加载设备管理数据');
}

// ========== 加载日志管理 ==========
function loadLogManagement() {
    const logsSection = document.getElementById('logs');
    if (!logsSection.querySelector('.section-content').innerHTML.trim()) {
        logsSection.querySelector('.section-content').innerHTML = `
            <div class="setting-group">
                <h4>系统日志</h4>
                <div class="log-controls">
                    <select id="logLevel">
                        <option value="all">全部级别</option>
                        <option value="error">错误</option>
                        <option value="warning">警告</option>
                        <option value="info">信息</option>
                        <option value="debug">调试</option>
                    </select>
                    <input type="date" id="logDate" value="${new Date().toISOString().split('T')[0]}">
                    <button class="btn btn-primary" onclick="searchLogs()">🔍 查询</button>
                    <button class="btn btn-secondary" onclick="exportLogs()">📤 导出</button>
                </div>
                <div class="log-list">
                    <div class="log-item">
                        <span class="log-time">2025-07-24 15:30:25</span>
                        <span class="log-level info">INFO</span>
                        <span class="log-message">用户admin登录系统</span>
                    </div>
                    <div class="log-item">
                        <span class="log-time">2025-07-24 15:25:12</span>
                        <span class="log-level warning">WARN</span>
                        <span class="log-message">设备002电量低于30%</span>
                    </div>
                    <div class="log-item">
                        <span class="log-time">2025-07-24 15:20:08</span>
                        <span class="log-level error">ERROR</span>
                        <span class="log-message">数据传输失败，重试中...</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// ========== 加载备份管理 ==========
function loadBackupManagement() {
    const backupSection = document.getElementById('backup');
    if (!backupSection.querySelector('.section-content').innerHTML.trim()) {
        backupSection.querySelector('.section-content').innerHTML = `
            <div class="setting-group">
                <h4>数据备份</h4>
                <div class="backup-controls">
                    <button class="btn btn-primary" onclick="createBackup()">💾 创建备份</button>
                    <button class="btn btn-secondary" onclick="scheduleBackup()">⏰ 定时备份</button>
                </div>
                <div class="backup-list">
                    <div class="backup-item">
                        <div class="backup-info">
                            <span class="backup-name">系统备份_20250724_1530</span>
                            <span class="backup-size">2.3 GB</span>
                            <span class="backup-date">2025-07-24 15:30</span>
                        </div>
                        <div class="backup-actions">
                            <button class="btn-small" onclick="restoreBackup('20250724_1530')">恢复</button>
                            <button class="btn-small" onclick="downloadBackup('20250724_1530')">下载</button>
                            <button class="btn-small danger" onclick="deleteBackup('20250724_1530')">删除</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="setting-group">
                <h4>系统恢复</h4>
                <div class="restore-controls">
                    <input type="file" id="backupFile" accept=".backup" style="display: none;">
                    <button class="btn btn-secondary" onclick="selectBackupFile()">📁 选择备份文件</button>
                    <button class="btn btn-warning" onclick="restoreFromFile()">🔄 恢复系统</button>
                </div>
                <div class="restore-warning">
                    <p>⚠️ 警告：系统恢复将覆盖当前所有数据，请确保已做好备份。</p>
                </div>
            </div>
        `;
    }
}

// ========== 初始化表单事件 ==========
function initializeFormEvents() {
    // 监听所有表单元素的变化
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        element.addEventListener('change', function() {
            markAsModified();
        });
    });
}

// ========== 标记为已修改 ==========
function markAsModified() {
    // 可以在这里添加未保存更改的提示
    console.log('⚠️ 设置已修改，请记得保存');
}

// ========== 加载设置 ==========
function loadSettings() {
    // 从localStorage或API加载设置
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
        settingsData = JSON.parse(savedSettings);
        applySettingsToForm();
    }
}

// ========== 应用设置到表单 ==========
function applySettingsToForm() {
    // 这里可以根据settingsData填充表单
    console.log('📋 应用设置到表单');
}

// ========== 保存设置 ==========
function saveSettings() {
    // 收集表单数据
    collectFormData();
    
    // 保存到localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settingsData));
    
    showToast('success', '设置已保存');
}

// ========== 应用设置 ==========
function applySettings() {
    // 收集表单数据
    collectFormData();
    
    // 应用设置（这里可以调用API）
    console.log('🔧 应用设置:', settingsData);
    
    showToast('success', '设置已应用');
}

// ========== 重置设置 ==========
function resetSettings() {
    if (confirm('确认重置所有设置到默认值吗？')) {
        // 清除保存的设置
        localStorage.removeItem('systemSettings');
        settingsData = {};
        
        // 重新加载页面或重置表单
        location.reload();
    }
}

// ========== 收集表单数据 ==========
function collectFormData() {
    const formData = {};
    
    // 收集所有表单元素的值
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        if (element.type === 'checkbox') {
            formData[element.name || element.id] = element.checked;
        } else if (element.type === 'radio') {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else {
            formData[element.name || element.id] = element.value;
        }
    });
    
    settingsData = formData;
}

// ========== 用户管理功能 ==========
function addUser() {
    showToast('info', '添加用户功能开发中');
}

function editUser(username) {
    showToast('info', `编辑用户 ${username} 功能开发中`);
}

function deleteUser(username) {
    if (confirm(`确认删除用户 ${username} 吗？`)) {
        showToast('success', `用户 ${username} 已删除`);
    }
}

// ========== 设备管理功能 ==========
function addDevice() {
    showToast('info', '添加设备功能开发中');
}

function configDevice(deviceId) {
    showToast('info', `配置设备 ${deviceId} 功能开发中`);
}

function calibrateDevice(deviceId) {
    showToast('info', `校准设备 ${deviceId} 功能开发中`);
}

// ========== 日志管理功能 ==========
function searchLogs() {
    const level = document.getElementById('logLevel').value;
    const date = document.getElementById('logDate').value;
    showToast('info', `查询 ${date} 的 ${level} 级别日志`);
}

function exportLogs() {
    showToast('info', '正在导出日志文件...');
    setTimeout(() => {
        showToast('success', '日志文件已导出');
    }, 2000);
}

// ========== 备份管理功能 ==========
function createBackup() {
    showToast('info', '正在创建系统备份...');
    setTimeout(() => {
        showToast('success', '系统备份创建完成');
    }, 3000);
}

function scheduleBackup() {
    showToast('info', '定时备份设置功能开发中');
}

function restoreBackup(backupId) {
    if (confirm(`确认恢复备份 ${backupId} 吗？此操作将覆盖当前数据。`)) {
        showToast('info', '正在恢复备份...');
        setTimeout(() => {
            showToast('success', '备份恢复完成');
        }, 5000);
    }
}

function downloadBackup(backupId) {
    showToast('info', `正在下载备份 ${backupId}...`);
}

function deleteBackup(backupId) {
    if (confirm(`确认删除备份 ${backupId} 吗？`)) {
        showToast('success', `备份 ${backupId} 已删除`);
    }
}

function selectBackupFile() {
    document.getElementById('backupFile').click();
}

function restoreFromFile() {
    const fileInput = document.getElementById('backupFile');
    if (fileInput.files.length === 0) {
        showToast('warning', '请先选择备份文件');
        return;
    }
    
    if (confirm('确认从文件恢复系统吗？此操作将覆盖当前所有数据。')) {
        showToast('info', '正在从文件恢复系统...');
        setTimeout(() => {
            showToast('success', '系统恢复完成');
        }, 5000);
    }
}

// ========== 全屏切换 ==========
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ========== 显示提示消息 ==========
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
