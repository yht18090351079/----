// 地质灾害预警系统 - 预警发布页面脚本

// ========== 全局变量 ========== 
let currentStep = 1;
let selectedRiskLevel = '';
let selectedChannels = [];
let warningData = {};

// ========== 预警模板数据 ==========
const warningTemplates = {
    'landslide-template': {
        title: '滑坡预警通知',
        content: `受持续降雨影响，{area}发生滑坡的风险较高。根据气象部门预报，未来24小时内该区域仍有中到大雨，土壤含水量持续上升，地质条件不稳定。

请相关部门和公众注意以下防范措施：
1. 立即组织危险区域人员撤离到安全地带
2. 加强对重点区域的监测和巡查
3. 禁止在危险区域停留或通行
4. 密切关注天气变化和预警信息

如发现异常情况，请立即拨打应急电话：12345`
    },
    'debris-flow-template': {
        title: '泥石流预警通知',
        content: `受强降雨影响，{area}发生泥石流的风险极高。当前降雨量已达到泥石流发生的临界值，山洪暴发可能引发大规模泥石流灾害。

紧急防范措施：
1. 立即撤离沟口、河道两侧居民
2. 关闭通往危险区域的道路
3. 转移重要物资和设备
4. 启动应急预案，做好救援准备

请广大群众保持高度警惕，听从当地政府统一指挥。`
    },
    'collapse-template': {
        title: '崩塌预警通知',
        content: `经监测发现，{area}山体出现明显变形迹象，存在发生崩塌的风险。受近期降雨和地质条件影响，山体稳定性下降。

防范要求：
1. 立即疏散崩塌威胁范围内的人员
2. 设置警戒线，禁止人员车辆通行
3. 加强监测，密切关注山体变化
4. 做好应急物资和救援队伍准备

请相关单位和群众严格按照要求执行，确保人员安全。`
    }
};

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 预警发布页面初始化...');
    
    // 初始化表单事件
    initializeFormEvents();
    
    // 初始化编辑器
    initializeEditor();
    
    // 初始化预览
    initializePreview();
    
    // 设置默认时间
    setDefaultTime();
    
    console.log('✅ 预警发布页面初始化完成');
});

// ========== 表单事件初始化 ==========
function initializeFormEvents() {
    // 风险等级选择
    const riskButtons = document.querySelectorAll('.risk-btn');
    riskButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的active类
            riskButtons.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            selectedRiskLevel = this.getAttribute('data-level');
            updatePreview();
        });
    });

    // 发布渠道选择
    const channelCheckboxes = document.querySelectorAll('input[name="channels"]');
    channelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedChannels();
            updatePreview();
        });
    });

    // 表单字段变化监听
    const formFields = ['warningType', 'affectedArea', 'startTime', 'endTime'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', updatePreview);
            field.addEventListener('input', updatePreview);
        }
    });

    // 模板选择
    const templateSelect = document.getElementById('templateSelect');
    templateSelect.addEventListener('change', function() {
        if (this.value) {
            applyTemplate(this.value);
        }
    });
}

// ========== 编辑器初始化 ==========
function initializeEditor() {
    const editorContent = document.getElementById('warningContent');
    
    // 监听内容变化
    editorContent.addEventListener('input', function() {
        updateWordCount();
        updatePreview();
    });

    // 监听键盘事件
    editorContent.addEventListener('keydown', function(e) {
        // Ctrl+B 加粗
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            formatText('bold');
        }
        // Ctrl+I 斜体
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            formatText('italic');
        }
        // Ctrl+U 下划线
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            formatText('underline');
        }
    });
}

// ========== 预览初始化 ==========
function initializePreview() {
    // 预览标签切换
    const previewTabs = document.querySelectorAll('.tab-btn');
    previewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const previewType = this.getAttribute('data-preview');
            switchPreview(previewType);
            
            // 更新标签状态
            previewTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========== 设置默认时间 ==========
function setDefaultTime() {
    const now = new Date();
    const startTime = new Date(now.getTime() + 10 * 60000); // 10分钟后
    const endTime = new Date(now.getTime() + 24 * 60 * 60000); // 24小时后
    
    document.getElementById('startTime').value = formatDateTimeLocal(startTime);
    document.getElementById('endTime').value = formatDateTimeLocal(endTime);
}

// ========== 格式化日期时间 ==========
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ========== 更新选中的发布渠道 ==========
function updateSelectedChannels() {
    const checkboxes = document.querySelectorAll('input[name="channels"]:checked');
    selectedChannels = Array.from(checkboxes).map(cb => cb.value);
}

// ========== 应用模板 ==========
function applyTemplate(templateKey) {
    const template = warningTemplates[templateKey];
    if (template) {
        const editorContent = document.getElementById('warningContent');
        editorContent.innerHTML = template.content;
        updateWordCount();
        updatePreview();
        showToast('success', '模板应用成功');
    }
}

// ========== 文本格式化 ==========
function formatText(command) {
    document.execCommand(command, false, null);
    updatePreview();
}

// ========== 插入列表 ==========
function insertList(type) {
    const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command, false, null);
    updatePreview();
}

// ========== 插入媒体 ==========
function insertMedia() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;">`;
                document.execCommand('insertHTML', false, img);
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// ========== 更新字数统计 ==========
function updateWordCount() {
    const content = document.getElementById('warningContent').textContent || '';
    const wordCount = content.length;
    document.getElementById('wordCount').textContent = wordCount;
}

// ========== 更新预览 ==========
function updatePreview() {
    const warningType = document.getElementById('warningType').value;
    const affectedArea = document.getElementById('affectedArea').value;
    const startTime = document.getElementById('startTime').value;
    const content = document.getElementById('warningContent').innerHTML;
    
    // 更新PC端预览
    updatePCPreview(warningType, affectedArea, startTime, content);
    
    // 更新移动端预览
    updateMobilePreview(warningType, affectedArea, content);
    
    // 更新短信预览
    updateSMSPreview(warningType, affectedArea, content);
    
    // 更新邮件预览
    updateEmailPreview(warningType, affectedArea, content);
}

// ========== 更新PC端预览 ==========
function updatePCPreview(type, area, time, content) {
    const levelElement = document.getElementById('previewLevel');
    const timeElement = document.getElementById('previewTime');
    const titleElement = document.getElementById('previewTitle');
    const areaElement = document.getElementById('previewArea');
    const contentElement = document.getElementById('previewContent');
    
    // 更新预警等级
    if (selectedRiskLevel) {
        levelElement.textContent = getRiskLevelText(selectedRiskLevel);
        levelElement.className = `warning-level ${selectedRiskLevel}`;
    }
    
    // 更新时间
    if (time) {
        const date = new Date(time);
        timeElement.textContent = `发布时间: ${date.toLocaleString('zh-CN')}`;
    }
    
    // 更新标题
    titleElement.textContent = getWarningTitle(type, area);
    
    // 更新区域
    areaElement.textContent = area ? `影响区域: ${area}` : '影响区域: 待填写';
    
    // 更新内容
    contentElement.innerHTML = content || '预警内容将在这里显示...';
}

// ========== 更新移动端预览 ==========
function updateMobilePreview(type, area, content) {
    const mobileLevel = document.querySelector('#mobilePreview .mobile-level');
    const mobileTitle = document.querySelector('#mobilePreview .mobile-title');
    const mobileContent = document.querySelector('#mobilePreview .mobile-content');
    
    if (selectedRiskLevel) {
        mobileLevel.textContent = getRiskLevelText(selectedRiskLevel);
        mobileLevel.className = `mobile-level ${selectedRiskLevel}`;
    }
    
    mobileTitle.textContent = getWarningTitle(type, area);
    mobileContent.innerHTML = content || '预警内容...';
}

// ========== 更新短信预览 ==========
function updateSMSPreview(type, area, content) {
    const smsBody = document.querySelector('#smsPreview .sms-body');
    const plainContent = content.replace(/<[^>]*>/g, ''); // 移除HTML标签
    const smsText = `${getWarningTitle(type, area)}。${plainContent.substring(0, 60)}...`;
    smsBody.textContent = smsText;
}

// ========== 更新邮件预览 ==========
function updateEmailPreview(type, area, content) {
    const emailSubject = document.querySelector('#emailPreview .email-subject');
    const emailContent = document.querySelector('#emailPreview .email-content');
    
    emailSubject.textContent = `主题: ${getWarningTitle(type, area)}`;
    emailContent.innerHTML = content || '邮件内容...';
}

// ========== 获取风险等级文本 ==========
function getRiskLevelText(level) {
    const levelMap = {
        'blue': '蓝色预警',
        'yellow': '黄色预警',
        'orange': '橙色预警',
        'red': '红色预警'
    };
    return levelMap[level] || '预警等级';
}

// ========== 获取预警标题 ==========
function getWarningTitle(type, area) {
    const typeMap = {
        'landslide': '滑坡',
        'debris-flow': '泥石流',
        'collapse': '崩塌',
        'ground-subsidence': '地面塌陷'
    };
    
    const typeName = typeMap[type] || '地质灾害';
    const levelText = getRiskLevelText(selectedRiskLevel);
    const areaText = area || 'XX区域';
    
    return `${areaText}${typeName}${levelText}`;
}

// ========== 切换预览 ==========
function switchPreview(type) {
    // 隐藏所有预览容器
    const containers = document.querySelectorAll('.preview-container');
    containers.forEach(container => container.classList.remove('active'));
    
    // 显示选中的预览容器
    const targetContainer = document.getElementById(`${type}Preview`);
    if (targetContainer) {
        targetContainer.classList.add('active');
    }
}

// ========== 工具函数 ==========

// 选择模板
function selectTemplate() {
    const templateSelect = document.getElementById('templateSelect');
    templateSelect.focus();
    showToast('info', '请从下拉框中选择模板');
}

// AI辅助生成
function aiAssist() {
    const warningType = document.getElementById('warningType').value;
    const affectedArea = document.getElementById('affectedArea').value;
    
    if (!warningType || !affectedArea) {
        showToast('warning', '请先选择预警类型和影响区域');
        return;
    }
    
    // 模拟AI生成内容
    setTimeout(() => {
        const aiContent = generateAIContent(warningType, affectedArea);
        document.getElementById('warningContent').innerHTML = aiContent;
        updateWordCount();
        updatePreview();
        showToast('success', 'AI内容生成完成');
    }, 1500);
    
    showToast('info', 'AI正在生成预警内容...');
}

// 生成AI内容
function generateAIContent(type, area) {
    const templates = {
        'landslide': `根据最新气象监测数据，${area}地区持续降雨已达到滑坡风险临界值。土壤含水量急剧上升，地表位移监测显示异常变化。

<strong>风险分析：</strong>
• 降雨强度：45mm/h，累计降雨量120mm
• 土壤饱和度：85%，接近临界值
• 地表位移：2.3mm/日，超出正常范围

<strong>防范措施：</strong>
1. 立即组织危险区域人员撤离
2. 设置警戒线，禁止人员进入
3. 加强监测，每小时上报数据
4. 准备应急救援物资

请相关部门和群众高度重视，严格按照预案执行。`,
        
        'debris-flow': `${area}地区强降雨引发泥石流高风险预警。山洪暴发可能引发大规模泥石流灾害。

<strong>监测数据：</strong>
• 降雨量：65mm/h，持续时间3小时
• 沟道流量：15m³/s，超出警戒值
• 泥沙含量：35%，达到泥石流形成条件

<strong>紧急措施：</strong>
1. 立即撤离沟口及河道两侧居民
2. 关闭通往危险区域的交通要道
3. 启动应急预案，调集救援力量
4. 发布公众预警信息

生命安全第一，请严格执行撤离指令。`,
        
        'collapse': `${area}山体监测发现明显变形，崩塌风险急剧上升。

<strong>监测异常：</strong>
• 山体倾斜：15°，超出安全范围
• 裂缝扩展：新增3条，长度2-5米
• 位移速率：5mm/日，呈加速趋势

<strong>应对措施：</strong>
1. 立即疏散威胁范围内所有人员
2. 设置500米安全警戒区
3. 24小时不间断监测
4. 做好应急救援准备

请相关部门立即行动，确保人员安全。`
    };
    
    return templates[type] || `${area}地区地质灾害风险预警，请注意防范。`;
}

// 保存草稿
function saveDraft() {
    collectFormData();
    localStorage.setItem('warningDraft', JSON.stringify(warningData));
    showToast('success', '草稿保存成功');
}

// 预览效果
function previewWarning() {
    if (!validateForm()) {
        return;
    }
    
    collectFormData();
    showToast('info', '预览功能已在右侧面板显示');
}

// 提交审核
function submitForReview() {
    if (!validateForm()) {
        return;
    }
    
    showModal('确认提交', '确认提交预警信息进行审核吗？提交后将无法修改。', function() {
        collectFormData();
        console.log('提交审核数据:', warningData);
        showToast('success', '预警信息已提交审核');
        closeModal();
    });
}

// 取消编辑
function cancelEdit() {
    showModal('确认取消', '确认取消编辑吗？未保存的内容将丢失。', function() {
        window.location.href = 'warning-monitor.html';
    });
}

// 收集表单数据
function collectFormData() {
    warningData = {
        type: document.getElementById('warningType').value,
        riskLevel: selectedRiskLevel,
        affectedArea: document.getElementById('affectedArea').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        channels: selectedChannels,
        content: document.getElementById('warningContent').innerHTML,
        timestamp: new Date().toISOString()
    };
}

// 表单验证
function validateForm() {
    const requiredFields = [
        { id: 'warningType', name: '预警类型' },
        { id: 'affectedArea', name: '影响区域' },
        { id: 'startTime', name: '开始时间' },
        { id: 'endTime', name: '结束时间' }
    ];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showToast('error', `请填写${field.name}`);
            element.focus();
            return false;
        }
    }
    
    if (!selectedRiskLevel) {
        showToast('error', '请选择风险等级');
        return false;
    }
    
    if (selectedChannels.length === 0) {
        showToast('error', '请选择至少一个发布渠道');
        return false;
    }
    
    const content = document.getElementById('warningContent').textContent.trim();
    if (!content) {
        showToast('error', '请填写预警内容');
        return false;
    }
    
    return true;
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 显示模态框
function showModal(title, message, callback) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modal').style.display = 'block';
    
    // 设置确认回调
    window.modalCallback = callback;
}

// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    window.modalCallback = null;
}

// 确认操作
function confirmAction() {
    if (window.modalCallback) {
        window.modalCallback();
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
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
