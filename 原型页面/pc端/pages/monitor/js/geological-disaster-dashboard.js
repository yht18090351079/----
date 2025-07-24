// 地质灾害预警系统 - 实时监控大屏脚本
// 从 geological-disaster-dashboard.html 自动提取

// 全局变量
let viewer;
let monitoringPoints = [];
let warningAreas = [];
let isTerrainEnabled = true; // 地形状态标记，默认开启
let boundaryEnabled = false; // 行政区划状态
let boundaryLayers = {}; // 动态管理所有层级的行政区划数据源
let imageryIndex = 0; // 影像索引

// 启用世界地形函数
async function enableWorldTerrain() {
    try {
        // 尝试启用世界地形
        if (typeof Cesium.createWorldTerrainAsync === 'function') {
            viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            isTerrainEnabled = true;
            console.log('🏔️ 世界地形已自动启用（异步方式）');
        } else if (typeof Cesium.createWorldTerrain === 'function') {
            viewer.terrainProvider = Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            isTerrainEnabled = true;
            console.log('🏔️ 世界地形已自动启用（同步方式）');
        } else {
            throw new Error('世界地形API不可用');
        }

        // 更新按钮状态
        const terrainBtn = document.getElementById('terrainBtn');
        if (terrainBtn) {
            terrainBtn.textContent = '▲ 关闭地形';
            terrainBtn.classList.add('active');
        }

    } catch (error) {
        console.warn('世界地形启用失败，使用椭球体地形:', error);
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        isTerrainEnabled = false;

        // 更新按钮状态
        const terrainBtn = document.getElementById('terrainBtn');
        if (terrainBtn) {
            terrainBtn.textContent = '▲ 开启地形';
            terrainBtn.classList.remove('active');
        }
    }
}

// 初始化Cesium地图
async function initMap() {
    try {
        // 检查Cesium是否可用
        if (typeof Cesium === 'undefined') {
            console.error('Cesium未加载，显示静态背景');
            document.getElementById('cesiumContainer').innerHTML =
                '<div style="width:100%;height:100%;background:linear-gradient(135deg, #001122 0%, #000a1a 50%, #001133 100%);display:flex;align-items:center;justify-content:center;color:#00ffff;font-size:18px;">地图加载中...</div>';
            return;
        }

        // 设置Cesium Ion Token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjZlZDZhMS0xZGMzLTRlMjAtOWMyMC1hY2U2ZGI1OWM3YzIiLCJpZCI6MzIyMjE3LCJpYXQiOjE3NTI3MTgyMDZ9.ESrgN3eQQTxnHv-UUG5aJz7ojlnK9EAzfqFqgXPmH7M';

        viewer = new Cesium.Viewer('cesiumContainer', {
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false
            // 不设置terrainProvider，让Cesium使用默认的世界地形
        });

        // 确保启用世界地形
        await enableWorldTerrain();

    // 设置初始视角到成都，使用更好的角度展示地形
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 80000),
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-45), // 45度俯视角，更好展示地形
            roll: 0.0
        }
    });

    // 启用一些视觉增强效果
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.dynamicAtmosphereLighting = true;
    viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;

    // 启用深度测试，增强立体感
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 启用地形采样，让线条跟随地形起伏
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.dynamicAtmosphereLighting = true;

    // 设置大气效果
    if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true;
    }
    if (viewer.scene.fog) {
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.0002;
    }

    // 性能优化
    viewer.scene.globe.maximumScreenSpaceError = 2;
    viewer.scene.globe.tileCacheSize = 100;

        // 添加一些示例监测点
        addSampleMonitoringPoints();

        // 启动数据更新
        startDataUpdate();

        // 初始化全局tooltip和统计
        setTimeout(() => {
            globalTooltip.init();
            updateDeviceStatsDisplay();
            initMapClickHandler();
        }, 1000);
    } catch (error) {
        console.error('Cesium初始化失败:', error);
        document.getElementById('cesiumContainer').innerHTML =
            '<div style="width:100%;height:100%;background:linear-gradient(135deg, #001122 0%, #000a1a 50%, #001133 100%);display:flex;align-items:center;justify-content:center;color:#00ffff;font-size:18px;">地图初始化失败，请检查网络连接</div>';

        // 即使地图失败，也要启动数据更新
        startDataUpdate();
    }
}

// 添加示例监测点 - 使用真实的成都地区坐标
function addSampleMonitoringPoints() {
    const samplePoints = [
        // 12个正常状态 - 成都主城区及近郊
        { name: '天府广场监测站', lon: 104.0665, lat: 30.5723, status: 'online' },
        { name: '春熙路监测站', lon: 104.0810, lat: 30.5702, status: 'online' },
        { name: '宽窄巷子监测站', lon: 104.0556, lat: 30.6739, status: 'online' },
        { name: '武侯祠监测站', lon: 104.0438, lat: 30.6417, status: 'online' },
        { name: '杜甫草堂监测站', lon: 104.0264, lat: 30.6608, status: 'online' },
        { name: '金沙遗址监测站', lon: 104.0158, lat: 30.6956, status: 'online' },
        { name: '熊猫基地监测站', lon: 104.1469, lat: 30.7328, status: 'online' },
        { name: '东郊记忆监测站', lon: 104.1158, lat: 30.6456, status: 'online' },
        { name: '环球中心监测站', lon: 104.0625, lat: 30.5417, status: 'online' },
        { name: '双流机场监测站', lon: 103.9467, lat: 30.5785, status: 'online' },
        { name: '温江大学城监测站', lon: 103.8333, lat: 30.6833, status: 'online' },
        { name: '郫都犀浦监测站', lon: 103.9667, lat: 30.7667, status: 'online' },

        // 4个预警状态 - 周边区县
        { name: '都江堰水利监测站', lon: 103.6167, lat: 31.0167, status: 'warning' },
        { name: '青城山监测站', lon: 103.5667, lat: 30.9000, status: 'warning' },
        { name: '龙泉山监测站', lon: 104.2667, lat: 30.5667, status: 'warning' },
        { name: '西岭雪山监测站', lon: 103.1333, lat: 30.6167, status: 'warning' },

        // 2个离线状态 - 远郊区县
        { name: '金堂淮口监测站', lon: 104.4167, lat: 30.8667, status: 'offline' },
        { name: '蒲江朝阳湖监测站', lon: 103.5000, lat: 30.1833, status: 'offline' }
    ];

    console.log(`🚀 准备添加 ${samplePoints.length} 个监测点:`);
    samplePoints.forEach((point, index) => {
        console.log(`  ${index + 1}. ${point.name}: ${point.status}`);
        addMonitoringPointToMap(point);
    });

    // 初始化完成后更新统计并飞行到成都
    setTimeout(() => {
        console.log(`⏰ 延迟更新设备统计...`);
        updateDeviceStatsDisplay();

        // 飞行到成都地区以便查看监测点
        if (viewer) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.6728, 50000),
                duration: 3.0
            });
            console.log(`🛩️ 飞行到成都地区查看监测点`);
        }
    }, 1500);
}

// 在地图上添加监测点
function addMonitoringPointToMap(point) {
    if (!viewer || !Cesium) {
        console.log('地图未初始化，监测点数据已保存:', point);
        return;
    }

    try {
        const color = point.status === 'online' ? Cesium.Color.GREEN :
                     point.status === 'warning' ? Cesium.Color.ORANGE :
                     Cesium.Color.RED;

        const entity = viewer.entities.add({
            name: point.name,
            position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
            point: {
                pixelSize: 18,
                color: color,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 3,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                text: point.name,
                font: '14pt Microsoft YaHei, sans-serif',
                pixelOffset: new Cesium.Cartesian2(0, -45),
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                scale: 0.8,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.3),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            properties: {
                name: point.name,
                status: point.status,
                type: 'monitoring_point'
            }
        });

        // 只为预警设备添加动效
        if (point.status === 'warning') {
            addDeviceAnimation(entity, point.status);
        }

        console.log(`✅ 成功添加监测点: ${point.name} (${point.status}) 位置: [${point.lon}, ${point.lat}]`);

        monitoringPoints.push(entity);

        // 更新设备统计
        updateDeviceStatsDisplay();
    } catch (error) {
        console.error('添加监测点失败:', error);
    }
}

// 工具栏按钮事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    initMap();

    // 绑定工具栏按钮事件
    document.getElementById('homeBtn').addEventListener('click', function() {
        if (viewer && Cesium) {
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 80000),
                orientation: {
                    heading: 0.0,
                    pitch: Cesium.Math.toRadians(-45), // 45度俯视角，更好展示地形
                    roll: 0.0
                }
            });
            showToast('success', '视角重置', '已返回成都市中心视角');
        } else {
            showToast('warning', '地图未加载', '地图尚未初始化完成');
        }
    });

    document.getElementById('terrainBtn').addEventListener('click', async function() {
        const btn = this;
        if (!viewer || !Cesium) {
            showToast('warning', '地图未加载', '地图尚未初始化完成');
            return;
        }

        try {
            isTerrainEnabled = !isTerrainEnabled;

            if (isTerrainEnabled) {
                // 开启地形，尝试使用世界地形
                try {
                    if (typeof Cesium.createWorldTerrainAsync === 'function') {
                        viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
                            requestWaterMask: true,
                            requestVertexNormals: true
                        });
                    } else if (typeof Cesium.createWorldTerrain === 'function') {
                        viewer.terrainProvider = Cesium.createWorldTerrain({
                            requestWaterMask: true,
                            requestVertexNormals: true
                        });
                    } else {
                        throw new Error('世界地形API不可用');
                    }
                    btn.textContent = '▲ 关闭地形';
                    btn.classList.add('active');
                    showToast('info', '地形显示', '已开启世界地形');
                } catch (terrainError) {
                    console.warn('世界地形加载失败，保持椭球体地形:', terrainError);
                    isTerrainEnabled = false;
                    btn.textContent = '▲ 开启地形';
                    btn.classList.remove('active');
                    showToast('warning', '地形加载失败', '无法加载世界地形数据');
                }
            } else {
                // 关闭地形，使用椭球体
                viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                btn.textContent = '▲ 开启地形';
                btn.classList.remove('active');
                showToast('info', '地形显示', '已关闭地形显示');
            }
        } catch (error) {
            console.error('地形切换失败:', error);
            showToast('error', '地形切换失败', '请检查网络连接或稍后重试');
        }
    });

    document.getElementById('boundaryBtn').addEventListener('click', async function() {
        const btn = this;
        if (!viewer || !Cesium) {
            showToast('warning', '地图未加载', '地图尚未初始化完成');
            return;
        }

        btn.disabled = true;
        try {
            boundaryEnabled = !boundaryEnabled;

            if (boundaryEnabled) {
                // 开启行政区划
                await loadMultiLevelBoundaries();
                btn.textContent = '◇ 关闭区划';
                btn.classList.add('active');
                showToast('info', '行政区划', '已开启多级行政区划显示');
            } else {
                // 关闭行政区划
                removeAllBoundaries();
                btn.textContent = '◇ 行政区划';
                btn.classList.remove('active');
                showToast('info', '行政区划', '已关闭行政区划显示');
            }
        } catch (error) {
            console.error('行政区划切换失败:', error);
            showToast('error', '区划切换失败', '请检查网络连接或稍后重试');
            boundaryEnabled = false;
            btn.textContent = '◇ 行政区划';
            btn.classList.remove('active');
        } finally {
            btn.disabled = false;
        }
    });

    document.getElementById('imageryBtn').addEventListener('click', function() {
        const btn = this;
        if (!viewer || !Cesium) {
            showToast('warning', '地图未加载', '地图尚未初始化完成');
            return;
        }

        try {
            toggleImagery();
            showToast('info', '影像切换', '已切换到新的影像图层');
        } catch (error) {
            console.error('影像切换失败:', error);
            showToast('error', '影像切换失败', '请检查网络连接或稍后重试');
        }
    });

    document.getElementById('addPointBtn').addEventListener('click', function() {
        openModal('addPointModal');
    });

    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('确定要清除所有监测点和预警区域吗？')) {
            if (viewer && viewer.entities) {
                viewer.entities.removeAll();
            }
            monitoringPoints = [];
            warningAreas = [];
            showToast('warning', '数据清除', '已清除所有监测点和预警区域');
        }
    });

    // 绑定菜单项事件
    document.querySelectorAll('.header-nav .menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            document.querySelectorAll('.header-nav .menu-item').forEach(i => i.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');

            const menuText = this.textContent.trim();
            if (menuText.includes('系统设置')) {
                openModal('settingsModal');
            } else {
                showToast('info', '功能切换', `已切换到${menuText}模块`);
            }
        });
    });

    // 设备项点击事件现在在updateDeviceList()中动态绑定

    // 绑定预警项点击事件
    document.querySelectorAll('.warning-item').forEach(item => {
        item.addEventListener('click', function() {
            const level = this.querySelector('.warning-level').textContent;
            const content = this.querySelector('.warning-content').textContent;
            const time = this.querySelector('.warning-time').textContent;

            // 更新弹窗内容
            document.getElementById('warningLevelBadge').textContent = level;
            document.getElementById('warningLevelBadge').className = 'warning-level-badge ' +
                (level.includes('红色') ? 'red' : level.includes('橙色') ? 'orange' : 'yellow');
            document.getElementById('warningTitle').textContent = content;
            document.getElementById('warningLevel').textContent = level;
            document.getElementById('warningTime').textContent = '2025-07-18 ' + time;

            openModal('warningModal');
        });
    });

    // 绑定模态框关闭事件
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

// 模态框操作函数
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 通知提示函数
function showToast(type, title, message) {
    const toast = document.getElementById('notificationToast');
    const icon = document.getElementById('toastIcon');
    const titleEl = document.getElementById('toastTitle');
    const textEl = document.getElementById('toastText');

    // 设置图标和样式
    switch(type) {
        case 'success':
            icon.textContent = '✓';
            toast.className = 'toast show success';
            break;
        case 'warning':
            icon.textContent = '⚠';
            toast.className = 'toast show warning';
            break;
        case 'error':
            icon.textContent = '✕';
            toast.className = 'toast show error';
            break;
        default:
            icon.textContent = 'ℹ';
            toast.className = 'toast show info';
    }

    titleEl.textContent = title;
    textEl.textContent = message;

    // 3秒后自动隐藏
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('notificationToast');
    toast.classList.remove('show');
}

// 设置相关函数
function switchTab(tabName) {
    // 移除所有active类
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // 添加active类
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function saveSettings() {
    showToast('success', '设置保存', '系统设置已成功保存');
    closeModal('settingsModal');
}

// 监测点相关函数
function saveMonitoringPoint() {
    const form = document.getElementById('addPointForm');
    const formData = new FormData(form);

    const point = {
        name: formData.get('pointName'),
        type: formData.get('pointType'),
        lon: parseFloat(formData.get('pointLongitude')),
        lat: parseFloat(formData.get('pointLatitude')),
        elevation: parseFloat(formData.get('pointElevation')) || 0,
        description: formData.get('pointDescription'),
        status: 'online'
    };

    // 验证数据
    if (!point.name || !point.type || !point.lon || !point.lat) {
        showToast('error', '输入错误', '请填写所有必填字段');
        return;
    }

    // 添加到地图
    addMonitoringPointToMap(point);

    // 重置表单并关闭弹窗
    form.reset();
    closeModal('addPointModal');
    showToast('success', '监测点添加', `监测点 ${point.name} 已成功添加`);
}

// 全局tooltip管理
const globalTooltip = {
    element: null,

    init() {
        this.element = document.getElementById('globalTooltip');
        this.bindEvents();
    },

    bindEvents() {
        const statItems = document.querySelectorAll('.stat-item-inline[data-tooltip]');

        statItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const tooltipText = item.getAttribute('data-tooltip');
                this.show(e.target, tooltipText);
            });

            item.addEventListener('mouseleave', () => {
                this.hide();
            });
        });
    },

    show(target, text) {
        if (!this.element) return;

        const rect = target.getBoundingClientRect();
        const tooltipWidth = 120; // 估算宽度

        // 计算位置
        const left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        const top = rect.top - 50; // 在元素上方50px

        this.element.textContent = text;
        this.element.style.left = Math.max(10, left) + 'px';
        this.element.style.top = Math.max(10, top) + 'px';
        this.element.classList.add('show');
    },

    hide() {
        if (!this.element) return;
        this.element.classList.remove('show');
    }
};

// 统计实际监测点状态
function calculateDeviceStats() {
    let onlineCount = 0;
    let warningCount = 0;
    let offlineCount = 0;

    // 统计viewer中的监测点实体
    if (viewer && viewer.entities) {
        const entities = viewer.entities.values;
        console.log(`🔍 开始统计设备状态，总实体数: ${entities.length}`);

        entities.forEach(entity => {
            if (entity.properties && entity.properties.type &&
                entity.properties.type.getValue() === 'monitoring_point') {
                const status = entity.properties.status.getValue();
                const name = entity.name || '未命名';
                console.log(`📍 监测点: ${name}, 状态: ${status}`);

                switch (status) {
                    case 'online':
                        onlineCount++;
                        break;
                    case 'warning':
                        warningCount++;
                        break;
                    case 'offline':
                        offlineCount++;
                        break;
                    default:
                        console.warn(`⚠️ 未知状态: ${status} (${name})`);
                }
            }
        });
    }

    console.log(`📊 统计结果: 正常${onlineCount}, 预警${warningCount}, 离线${offlineCount}`);
    return { onlineCount, warningCount, offlineCount };
}

// 更新设备统计显示
function updateDeviceStatsDisplay() {
    const stats = calculateDeviceStats();

    // 更新显示数字
    document.getElementById('onlineCount').textContent = stats.onlineCount;
    document.getElementById('warningCount').textContent = stats.warningCount;
    document.getElementById('offlineCount').textContent = stats.offlineCount;

    // 更新tooltip内容
    updateDeviceStatsTooltips();

    // 更新设备列表
    updateDeviceList();
}

// 更新左侧设备列表
function updateDeviceList() {
    const deviceListContainer = document.getElementById('deviceList');
    if (!deviceListContainer) return;

    // 清空现有列表
    deviceListContainer.innerHTML = '';

    // 获取所有监测点
    if (viewer && viewer.entities) {
        const entities = viewer.entities.values;
        const monitoringPoints = entities.filter(entity =>
            entity.properties && entity.properties.type &&
            entity.properties.type.getValue() === 'monitoring_point'
        );

        // 按状态排序：online -> warning -> offline
        monitoringPoints.sort((a, b) => {
            const statusOrder = { 'online': 0, 'warning': 1, 'offline': 2 };
            const statusA = a.properties.status.getValue();
            const statusB = b.properties.status.getValue();
            return statusOrder[statusA] - statusOrder[statusB];
        });

        // 创建设备项
        monitoringPoints.forEach(entity => {
            const name = entity.name;
            const status = entity.properties.status.getValue();
            const statusClass = status; // online, warning, offline

            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            deviceItem.innerHTML = `
                <span class="device-name">${name}</span>
                <div class="device-status-dot ${statusClass}"></div>
            `;

            // 添加点击事件 - 弹出详细信息弹窗
            deviceItem.addEventListener('click', function() {
                const statusText = status === 'online' ? '正常运行' :
                                 status === 'warning' ? '预警状态' : '离线';
                const statusClass = status; // online, warning, offline

                // 获取位置信息
                const position = entity.position.getValue(Cesium.JulianDate.now());
                const cartographic = Cesium.Cartographic.fromCartesian(position);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);

                // 更新设备详情弹窗内容
                document.getElementById('deviceName').textContent = name;
                document.getElementById('deviceStatus').textContent = statusText;
                document.getElementById('deviceStatus').className = `value status ${statusClass}`;
                document.getElementById('deviceLocation').textContent = `${longitude}°E, ${latitude}°N`;

                // 更新其他设备信息（模拟数据）
                const currentTime = new Date().toLocaleString('zh-CN');
                document.getElementById('deviceLastUpdate').textContent = currentTime;

                // 根据状态设置不同的数据完整性
                if (status === 'online') {
                    document.getElementById('deviceDataIntegrity').textContent = (95 + Math.random() * 5).toFixed(1) + '%';
                } else if (status === 'warning') {
                    document.getElementById('deviceDataIntegrity').textContent = (80 + Math.random() * 15).toFixed(1) + '%';
                } else {
                    document.getElementById('deviceDataIntegrity').textContent = '--';
                }

                // 飞行到该监测点
                if (viewer) {
                    const cartographic = Cesium.Cartographic.fromCartesian(position);
                    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    const latitude = Cesium.Math.toDegrees(cartographic.latitude);

                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
                        duration: 2.0
                    });
                }

                // 打开设备详情弹窗
                openModal('deviceModal');

                showToast('info', '设备详情', `查看 ${name} 详细信息`);
            });

            deviceListContainer.appendChild(deviceItem);
        });

        console.log(`📋 设备列表已更新: ${monitoringPoints.length} 个监测站`);
    }
}

// 更新设备统计tooltip
function updateDeviceStatsTooltips() {
    const onlineCount = document.getElementById('onlineCount').textContent;
    const warningCount = document.getElementById('warningCount').textContent;
    const offlineCount = document.getElementById('offlineCount').textContent;

    // 更新data-tooltip属性
    const statItems = document.querySelectorAll('.stat-item-inline[data-tooltip]');
    if (statItems.length >= 3) {
        statItems[0].setAttribute('data-tooltip', `正常 ${onlineCount}`);
        statItems[1].setAttribute('data-tooltip', `预警 ${warningCount}`);
        statItems[2].setAttribute('data-tooltip', `离线 ${offlineCount}`);
    }
}



// 初始化地图点击事件处理
function initMapClickHandler() {
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function(event) {
        const pickedObject = viewer.scene.pick(event.position);

        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;

            // 检查是否是监测点
            if (entity.properties && entity.properties.type &&
                entity.properties.type.getValue() === 'monitoring_point') {

                const name = entity.name;
                const status = entity.properties.status.getValue();
                const statusText = status === 'online' ? '正常运行' :
                                 status === 'warning' ? '预警状态' : '离线';
                const statusClass = status;

                // 获取位置信息
                const position = entity.position.getValue(Cesium.JulianDate.now());
                const cartographic = Cesium.Cartographic.fromCartesian(position);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);

                // 更新设备详情弹窗内容
                document.getElementById('deviceName').textContent = name;
                document.getElementById('deviceStatus').textContent = statusText;
                document.getElementById('deviceStatus').className = `value status ${statusClass}`;
                document.getElementById('deviceLocation').textContent = `${longitude}°E, ${latitude}°N`;

                // 更新其他设备信息（模拟数据）
                const currentTime = new Date().toLocaleString('zh-CN');
                document.getElementById('deviceLastUpdate').textContent = currentTime;

                // 根据状态设置不同的数据完整性
                if (status === 'online') {
                    document.getElementById('deviceDataIntegrity').textContent = (95 + Math.random() * 5).toFixed(1) + '%';
                } else if (status === 'warning') {
                    document.getElementById('deviceDataIntegrity').textContent = (80 + Math.random() * 15).toFixed(1) + '%';
                } else {
                    document.getElementById('deviceDataIntegrity').textContent = '--';
                }

                // 打开设备详情弹窗
                openModal('deviceModal');

                showToast('info', '监测点详情', `查看 ${name} 详细信息`);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    console.log('🖱️ 地图点击事件处理器已初始化');
}

// 存储动画定时器
const animationTimers = new Map();

// 为地图上的预警设备添加波纹扩散动效
function addDeviceAnimation(entity, status) {
    if (!entity || !entity.point || status !== 'warning') return;

    // 清除之前的动画
    if (animationTimers.has(entity.id)) {
        const oldData = animationTimers.get(entity.id);
        if (oldData.timer) clearInterval(oldData.timer);
        if (oldData.ripples) {
            oldData.ripples.forEach(ripple => viewer.entities.remove(ripple));
        }
        animationTimers.delete(entity.id);
    }

    // 获取监测站位置
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);

    // 创建波纹圆圈 - 设置足够高度避免被地形遮挡
    const ripples = [];
    for (let i = 0; i < 2; i++) {
        const ripple = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 100), // 提高到100米高度
            ellipse: {
                semiMajorAxis: 500,
                semiMinorAxis: 500,
                height: 100, // 设置100米高度，确保在地形之上
                material: Cesium.Color.ORANGE.withAlpha(0.2),
                outline: false,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // 相对地面高度
                extrudedHeight: 0 // 不拉伸
            }
        });
        ripples.push(ripple);
    }

    // 动画逻辑
    let time = 0;
    const timer = setInterval(() => {
        time += 0.1;

        // 更新波纹
        ripples.forEach((ripple, index) => {
            const phase = time - index * 2; // 2秒延迟

            if (phase < 0) {
                // 隐藏未开始的波纹
                ripple.ellipse.semiMajorAxis = 50;
                ripple.ellipse.semiMinorAxis = 50;
                ripple.ellipse.material = Cesium.Color.TRANSPARENT;
                return;
            }

            const progress = (phase % 4) / 4; // 4秒周期
            const radius = 100 + progress * 1400; // 100-1500米

            // 使用极高的透明度和鲜艳颜色，确保非常显眼
            let alpha, color;
            if (progress < 0.5) {
                // 前50%时间使用几乎不透明的颜色
                alpha = 0.95; // 几乎完全不透明
                color = new Cesium.Color(1.0, 0.2, 0.0, alpha); // 鲜艳的红橙色
            } else {
                // 后50%时间仍然保持较高透明度
                alpha = Math.max(0.6, 0.95 * (1 - (progress - 0.5) / 0.5));
                color = new Cesium.Color(1.0, 0.3, 0.0, alpha); // 橙红色
            }

            ripple.ellipse.semiMajorAxis = radius;
            ripple.ellipse.semiMinorAxis = radius;
            ripple.ellipse.material = color;
        });

        // 中心点保持稳定
        entity.point.color = Cesium.Color.ORANGE;
        entity.point.pixelSize = 22;
        entity.point.outlineColor = Cesium.Color.YELLOW.withAlpha(0.7);
        entity.point.outlineWidth = 4;

    }, 100); // 10FPS

    animationTimers.set(entity.id, { timer, ripples });
    console.log(`🌊 预警设备波纹扩散动效已启用: ${entity.name}`);
}

// 停止设备动效
function stopDeviceAnimation(entity) {
    if (animationTimers.has(entity.id)) {
        const animationData = animationTimers.get(entity.id);

        // 清除定时器
        if (animationData.timer) {
            clearInterval(animationData.timer);
        }

        // 重置中心点属性为静态
        if (entity.point) {
            entity.point.color = Cesium.Color.ORANGE;
            entity.point.pixelSize = 18;
            entity.point.outlineColor = Cesium.Color.WHITE;
            entity.point.outlineWidth = 3;
        }

        animationTimers.delete(entity.id);
        console.log(`🛑 停止设备脉冲动效: ${entity.name}`);
    }
}

// 设备控制函数
function controlDevice() {
    showToast('info', '设备控制', '设备控制指令已发送');
}

function exportData() {
    showToast('info', '数据导出', '数据导出任务已启动');
}

// 预警响应函数
function emergencyResponse() {
    showToast('warning', '应急响应', '应急响应程序已启动');
    closeModal('warningModal');
}

function sendNotification() {
    showToast('info', '通知发送', '预警通知已发送给相关人员');
}

function updateWarning() {
    showToast('success', '状态更新', '预警状态已更新');
}



// ========== 真实行政区划系统 ==========

// 主函数：加载真实的多层级行政区划
async function loadMultiLevelBoundaries() {
    console.log('🗾 开始加载真实行政区划数据...');

    try {
        // 清除现有边界
        removeAllBoundaries();

        // 全国省级行政区划边界 - 使用多个备用数据源
        const dataSources = [
            // 1. 中国国界 - 使用可靠的数据源
            {
                name: '中国国界',
                urls: [
                    // 备用数据源1: 阿里云数据源（最可靠）
                    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
                    // 备用数据源2: 创建简化的中国边界（确保有数据显示）
                    'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "properties": { "name": "中华人民共和国" },
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": [[
                                        [73, 18], [135, 18], [135, 54], [73, 54], [73, 18]
                                    ]]
                                }
                            }
                        ]
                    }))
                ],
                level: 'country',
                style: {
                    stroke: Cesium.Color.RED,
                    strokeWidth: 4,
                    fill: Cesium.Color.RED.withAlpha(0.02),
                    clampToGround: true
                }
            }
        ];

        // 2. 全国34个省级行政区
        const provinces = [
            { code: '110000', name: '北京市' },
            { code: '120000', name: '天津市' },
            { code: '130000', name: '河北省' },
            { code: '140000', name: '山西省' },
            { code: '150000', name: '内蒙古自治区' },
            { code: '210000', name: '辽宁省' },
            { code: '220000', name: '吉林省' },
            { code: '230000', name: '黑龙江省' },
            { code: '310000', name: '上海市' },
            { code: '320000', name: '江苏省' },
            { code: '330000', name: '浙江省' },
            { code: '340000', name: '安徽省' },
            { code: '350000', name: '福建省' },
            { code: '360000', name: '江西省' },
            { code: '370000', name: '山东省' },
            { code: '410000', name: '河南省' },
            { code: '420000', name: '湖北省' },
            { code: '430000', name: '湖南省' },
            { code: '440000', name: '广东省' },
            { code: '450000', name: '广西壮族自治区' },
            { code: '460000', name: '海南省' },
            { code: '500000', name: '重庆市' },
            { code: '510000', name: '四川省' },
            { code: '520000', name: '贵州省' },
            { code: '530000', name: '云南省' },
            { code: '540000', name: '西藏自治区' },
            { code: '610000', name: '陕西省' },
            { code: '620000', name: '甘肃省' },
            { code: '630000', name: '青海省' },
            { code: '640000', name: '宁夏回族自治区' },
            { code: '650000', name: '新疆维吾尔自治区' },
            { code: '710000', name: '台湾省' },
            { code: '810000', name: '香港特别行政区' },
            { code: '820000', name: '澳门特别行政区' }
        ];

        // 为所有省份添加边界数据源
        provinces.forEach(province => {
            dataSources.push({
                name: `${province.name}边界`,
                urls: [
                    // 备用数据源1: 阿里云数据源（主要数据源）
                    `https://geo.datav.aliyun.com/areas_v3/bound/${province.code}_full.json`
                ],
                level: `province_${province.code}`,
                style: {
                    stroke: Cesium.Color.CYAN,
                    strokeWidth: 2,
                    fill: Cesium.Color.CYAN.withAlpha(0.03),
                    clampToGround: true
                }
            });
        });

        // 3. 特别添加成都市的区县边界（详细展示）
        dataSources.push({
            name: '成都市区县边界',
            urls: [
                // 备用数据源1: 阿里云数据源（主要数据源）
                'https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json',
                // 备用数据源2: 使用成都市各区县的点位标记（当边界数据无法加载时）
                'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
                    "type": "FeatureCollection",
                    "features": [
                        {"type": "Feature", "properties": {"name": "锦江区", "adcode": "510104"}, "geometry": {"type": "Point", "coordinates": [104.0830, 30.6522]}},
                        {"type": "Feature", "properties": {"name": "青羊区", "adcode": "510105"}, "geometry": {"type": "Point", "coordinates": [104.0614, 30.6745]}},
                        {"type": "Feature", "properties": {"name": "金牛区", "adcode": "510106"}, "geometry": {"type": "Point", "coordinates": [104.0465, 30.6927]}},
                        {"type": "Feature", "properties": {"name": "武侯区", "adcode": "510107"}, "geometry": {"type": "Point", "coordinates": [104.0430, 30.6302]}},
                        {"type": "Feature", "properties": {"name": "成华区", "adcode": "510108"}, "geometry": {"type": "Point", "coordinates": [104.1015, 30.6598]}},
                        {"type": "Feature", "properties": {"name": "龙泉驿区", "adcode": "510112"}, "geometry": {"type": "Point", "coordinates": [104.2748, 30.5565]}},
                        {"type": "Feature", "properties": {"name": "青白江区", "adcode": "510113"}, "geometry": {"type": "Point", "coordinates": [104.2513, 30.8831]}},
                        {"type": "Feature", "properties": {"name": "新都区", "adcode": "510114"}, "geometry": {"type": "Point", "coordinates": [104.1590, 30.8238]}},
                        {"type": "Feature", "properties": {"name": "温江区", "adcode": "510115"}, "geometry": {"type": "Point", "coordinates": [103.8426, 30.6827]}},
                        {"type": "Feature", "properties": {"name": "双流区", "adcode": "510116"}, "geometry": {"type": "Point", "coordinates": [103.9209, 30.5746]}},
                        {"type": "Feature", "properties": {"name": "郫都区", "adcode": "510117"}, "geometry": {"type": "Point", "coordinates": [103.8878, 30.7948]}},
                        {"type": "Feature", "properties": {"name": "新津区", "adcode": "510118"}, "geometry": {"type": "Point", "coordinates": [103.8111, 30.4097]}},
                        {"type": "Feature", "properties": {"name": "都江堰市", "adcode": "510181"}, "geometry": {"type": "Point", "coordinates": [103.6470, 30.9882]}},
                        {"type": "Feature", "properties": {"name": "彭州市", "adcode": "510182"}, "geometry": {"type": "Point", "coordinates": [103.9580, 30.9903]}},
                        {"type": "Feature", "properties": {"name": "邛崃市", "adcode": "510183"}, "geometry": {"type": "Point", "coordinates": [103.4641, 30.4147]}},
                        {"type": "Feature", "properties": {"name": "崇州市", "adcode": "510184"}, "geometry": {"type": "Point", "coordinates": [103.6739, 30.6302]}},
                        {"type": "Feature", "properties": {"name": "金堂县", "adcode": "510121"}, "geometry": {"type": "Point", "coordinates": [104.4118, 30.8620]}},
                        {"type": "Feature", "properties": {"name": "大邑县", "adcode": "510129"}, "geometry": {"type": "Point", "coordinates": [103.5218, 30.5877]}},
                        {"type": "Feature", "properties": {"name": "蒲江县", "adcode": "510131"}, "geometry": {"type": "Point", "coordinates": [103.5061, 30.1967]}},
                        {"type": "Feature", "properties": {"name": "简阳市", "adcode": "510185"}, "geometry": {"type": "Point", "coordinates": [104.5477, 30.4106]}}
                    ]
                }))
            ],
            level: 'county_chengdu',
            style: {
                stroke: Cesium.Color.ORANGE,
                strokeWidth: 3,
                fill: Cesium.Color.ORANGE.withAlpha(0.02),
                clampToGround: true
            }
        });

        // 全国省级行政区划 + 成都市区县
        console.log(`📊 全国省级行政区划 + 成都市区县：需要加载 ${dataSources.length} 个数据源`);
        console.log(`📋 包括：国界 + ${provinces.length}个省级行政区边界 + 成都市区县边界`);
        console.log(`🗺️ 省份列表: ${provinces.map(p => p.name).join(', ')}`);

        // 分阶段加载：基础层级 → 区县边界
        let loadedCount = 0;

        // 第一阶段：加载国界
        const countrySources = dataSources.slice(0, 1);
        console.log(`\n🚀 第一阶段：加载国界 (${countrySources.length} 个)`);

        for (const source of countrySources) {
            console.log(`📡 加载: ${source.name}`);
            const result = await loadRealBoundaryData(source);
            if (result && result.success) {
                loadedCount++;
                console.log(`✅ ${source.name} 成功 (${result.entityCount || 0} 个实体)`);
            } else {
                console.log(`❌ ${source.name} 失败`);
            }
        }

        // 第二阶段：加载所有省级边界
        const provinceSources = dataSources.slice(1, -1); // 排除最后的成都市区县
        console.log(`\n🏛️ 第二阶段：加载省级边界 (${provinceSources.length} 个省份)`);

        // 第三阶段：成都市区县边界
        const chengduCountySource = dataSources[dataSources.length - 1];
        console.log(`\n🏘️ 第三阶段：加载成都市区县边界`);

        const batchSize = 3; // 每批3个省份，避免过多并发请求
        for (let i = 0; i < provinceSources.length; i += batchSize) {
            const batch = provinceSources.slice(i, i + batchSize);
            const batchNum = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(provinceSources.length / batchSize);

            console.log(`\n📦 批次 ${batchNum}/${totalBatches}: ${batch.map(s => s.name).join(', ')}`);

            // 并行加载同一批次
            const batchPromises = batch.map(async (source) => {
                const result = await loadRealBoundaryData(source);
                return { source, result };
            });

            const batchResults = await Promise.allSettled(batchPromises);

            // 处理批次结果
            batchResults.forEach((promiseResult, index) => {
                if (promiseResult.status === 'fulfilled') {
                    const { source, result } = promiseResult.value;
                    if (result && result.success) {
                        loadedCount++;
                        console.log(`  ✅ ${source.name} 成功 (${result.entityCount || 0} 个实体)`);
                    } else {
                        console.log(`  ❌ ${source.name} 失败`);
                    }
                } else {
                    console.log(`  ❌ ${batch[index].name} 异常: ${promiseResult.reason}`);
                }
            });

            // 批次间延迟
            if (i + batchSize < provinceSources.length) {
                console.log(`⏸️ 批次间暂停2秒...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // 加载成都市区县边界
        console.log(`📡 加载: ${chengduCountySource.name}`);
        const chengduResult = await loadRealBoundaryData(chengduCountySource);
        if (chengduResult && chengduResult.success) {
            loadedCount++;
            console.log(`✅ ${chengduCountySource.name} 成功 (${chengduResult.entityCount || 0} 个区县)`);

            // 详细检查成都市区县
            const dataSource = boundaryLayers[chengduCountySource.level];
            if (dataSource) {
                const entities = dataSource.entities.values;
                const countyEntities = entities.filter(e => e.name && typeof e.name === 'string' &&
                    (e.name.includes('区') || e.name.includes('县')));
                console.log(`🏘️ 成都市区县详情: 总共 ${entities.length} 个实体，其中 ${countyEntities.length} 个区县`);

                // 显示前5个区县名称
                countyEntities.slice(0, 5).forEach((entity, index) => {
                    console.log(`  ${index + 1}. ${entity.name}`);
                });
                if (countyEntities.length > 5) {
                    console.log(`  ... 还有 ${countyEntities.length - 5} 个区县`);
                }
            }
        } else {
            console.log(`❌ ${chengduCountySource.name} 失败`);
        }

        console.log(`\n🎉 全国省级行政区划 + 成都市区县加载完成！`);
        console.log(`📊 最终统计: 成功 ${loadedCount}/${dataSources.length} 个数据源`);
        console.log(`🗺️ 包含: 国界 + ${Math.max(0, loadedCount - 2)}个省级行政区边界 + 成都市区县边界`);
        console.log(`🌏 预期加载: 1个国界 + ${provinces.length}个省份 + 1个成都市区县 = ${1 + provinces.length + 1}个边界`);

        // 最终检查：统计所有边界线
        await checkAllBoundaries();

        console.log('✅ 真实行政区划数据加载完成');

        // 强制刷新场景
        viewer.scene.requestRender();

    } catch (error) {
        console.error('❌ 真实行政区划加载失败:', error);
        // 如果在线数据加载失败，显示提示
        showToast('warning', '行政区划', '在线数据加载失败，请检查网络连接');
        throw error;
    }
}

// 为实体创建边界线
function createEntityBoundaryLine(dataSource, entity, style, customName = null) {
    const entityName = customName || entity.name || '未命名';
    console.log(`🔍 为实体创建边界线: ${entityName} (customName: ${customName})`);

    try {
        if (entity.polygon && entity.polygon.hierarchy) {
            // 处理面要素的边界
            let positions = extractPositionsFromHierarchy(entity.polygon.hierarchy);
            if (positions && positions.length >= 2) {
                console.log(`✅ 提取到 ${positions.length} 个位置点，创建边界线: ${entityName}_边界`);
                createSimpleBoundaryLine(dataSource, entity.id + '_boundary', entityName + '_边界', positions, style);
            } else {
                console.log(`❌ 无法提取位置数据`);
            }
        } else if (entity.polyline && entity.polyline.positions) {
            // 处理线要素
            let positions = entity.polyline.positions;
            if (positions.getValue) {
                positions = positions.getValue(Cesium.JulianDate.now());
            }
            if (positions && positions.length >= 2) {
                console.log(`✅ 创建线要素边界: ${entityName}_边界`);
                createSimpleBoundaryLine(dataSource, entity.id + '_boundary', entityName + '_边界', positions, style);
            }
        }
    } catch (error) {
        console.error(`❌ 创建边界线失败: ${entityName}`, error);
    }
}

// 从hierarchy中提取位置数据
function extractPositionsFromHierarchy(hierarchy) {
    try {
        if (hierarchy._value) {
            const hierarchyValue = hierarchy._value;
            if (hierarchyValue.positions && Array.isArray(hierarchyValue.positions)) {
                return hierarchyValue.positions;
            } else if (Array.isArray(hierarchyValue)) {
                return hierarchyValue;
            }
        } else if (hierarchy.getValue) {
            const hierarchyValue = hierarchy.getValue(Cesium.JulianDate.now());
            if (hierarchyValue && hierarchyValue.positions) {
                return hierarchyValue.positions;
            }
        } else if (Array.isArray(hierarchy)) {
            return hierarchy;
        }
        return null;
    } catch (error) {
        console.error('提取位置数据失败:', error);
        return null;
    }
}

// 创建简单的边界线
function createSimpleBoundaryLine(dataSource, id, name, positions, style) {
    try {
        console.log(`🎨 创建简单边界线: ${name}, 位置数量: ${positions.length}`);

        // 增强边界的可见性，特别是区县级
        let enhancedWidth = style.strokeWidth;
        let enhancedGlow = 0.4;
        let enhancedColor = style.stroke;

        // 区县级边界特殊处理
        if (name.includes('区') || name.includes('县') || name.includes('市辖区') || name.includes('自治县')) {
            enhancedWidth = Math.max(style.strokeWidth, 4); // 区县边界至少4px，确保可见
            enhancedGlow = 0.8; // 强发光效果
            enhancedColor = Cesium.Color.ORANGE.brighten(0.3, new Cesium.Color()); // 明亮橙色
            console.log(`🎨 区县边界增强: ${name} → 宽度${enhancedWidth}px, 发光${enhancedGlow}`);
        } else if (name.includes('市') || name.includes('州')) {
            enhancedWidth = Math.max(style.strokeWidth, 3); // 市级边界至少3px
            enhancedGlow = 0.6; // 增强发光效果
            enhancedColor = style.stroke.brighten(0.2, new Cesium.Color()); // 稍微提亮颜色
        }

        const entity = dataSource.entities.add({
            id: id,
            name: name,
            polyline: {
                positions: positions,
                width: enhancedWidth,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: enhancedGlow,
                    color: enhancedColor
                }),
                clampToGround: true,
                zIndex: 1000,
                // 添加深度失效材质，确保在任何角度都可见
                depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: enhancedGlow * 0.5,
                    color: enhancedColor.withAlpha(0.6)
                })
            }
        });

        console.log(`✅ 边界线创建成功: ${name} (宽度: ${enhancedWidth}px, 发光: ${enhancedGlow})`);
        return entity;

    } catch (error) {
        console.error(`❌ 边界线创建失败: ${name}`, error);
        return null;
    }
}

// 创建地形跟随的polyline
function createTerrainFollowingPolyline(dataSource, id, name, positions, width, color) {
    console.log(`🏔️ 开始创建地形跟随边界线: ${name}, 位置数量: ${positions.length}`);

    try {
        // 检查Cesium版本和功能支持
        console.log(`🔍 检查Cesium功能支持...`);
        console.log(`- GroundPolylinePrimitive: ${typeof Cesium.GroundPolylinePrimitive !== 'undefined'}`);
        console.log(`- GroundPolylineGeometry: ${typeof Cesium.GroundPolylineGeometry !== 'undefined'}`);

        // 方法1：使用GroundPolylinePrimitive（最佳地形跟随）
        if (typeof Cesium.GroundPolylinePrimitive !== 'undefined' &&
            typeof Cesium.GroundPolylineGeometry !== 'undefined') {

            console.log(`🚀 使用GroundPolylinePrimitive创建: ${name}`);

            const groundPolyline = new Cesium.GroundPolylinePrimitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.GroundPolylineGeometry({
                        positions: positions,
                        width: width
                    }),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                    },
                    id: id
                }),
                appearance: new Cesium.PolylineColorAppearance(),
                asynchronous: false
            });

            viewer.scene.primitives.add(groundPolyline);
            console.log(`✅ GroundPolylinePrimitive创建成功: ${name}`);
            return;
        }

        // 方法2：使用Entity with clampToGround
        console.log(`🔄 使用Entity clampToGround创建: ${name}`);

        const entity = dataSource.entities.add({
            id: id,
            name: name,
            polyline: {
                positions: positions,
                width: width,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.5,
                    color: color
                }),
                clampToGround: true,
                zIndex: 1000
            }
        });

        console.log(`✅ Entity clampToGround创建成功: ${name}`);

    } catch (error) {
        console.error(`❌ 创建地形跟随边界线失败: ${name}`, error);

        // 最终备用方案：简单polyline
        try {
            const fallbackEntity = dataSource.entities.add({
                id: id + '_fallback',
                name: name + '_备用',
                polyline: {
                    positions: positions,
                    width: width,
                    material: color,
                    clampToGround: true
                }
            });

            console.log(`⚠️ 备用方案创建成功: ${name}`);
        } catch (fallbackError) {
            console.error(`❌ 备用方案也失败了: ${name}`, fallbackError);
        }
    }
}

// 核心函数：加载真实的GeoJSON边界数据（支持多个备用URL）
async function loadRealBoundaryData(source) {
    const urls = source.urls || [source.url]; // 支持新的 urls 数组或旧的 url 字段
    console.log(`🌐 正在加载 ${source.name}... 可用数据源: ${urls.length} 个`);

    let lastError = null;

    // 尝试每个URL直到成功
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`📡 尝试数据源 ${i + 1}/${urls.length}: ${url.substring(0, 100)}${url.length > 100 ? '...' : ''}`);

        try {
            // 创建数据源
            const dataSource = new Cesium.CustomDataSource(source.name);
            boundaryLayers[source.level] = dataSource;
            await viewer.dataSources.add(dataSource);

            // 检查是否是点位数据（备用数据源）
            const isPointData = url.includes('data:application/json') && url.includes('Point');

            // 加载GeoJSON数据
            const geoJsonDataSource = await Cesium.GeoJsonDataSource.load(url, {
                stroke: isPointData ? Cesium.Color.ORANGE : source.style.stroke,
                strokeWidth: source.style.strokeWidth,
                fill: isPointData ? Cesium.Color.ORANGE.withAlpha(0.8) : source.style.fill,
                clampToGround: false,
                extrudedHeight: source.style.extrudedHeight,
                markerSize: isPointData ? 20 : undefined,
                markerSymbol: isPointData ? '?' : undefined
            });

            console.log(`✅ 数据源 ${i + 1} 加载成功: ${source.name}`);

        // 将GeoJSON实体复制到我们的数据源中，并设置高度属性
        console.log(`📋 处理 ${geoJsonDataSource.entities.values.length} 个实体`);

        geoJsonDataSource.entities.values.forEach((entity, index) => {
            try {
                // 获取实体的真实名称（重点修复区县名称）
                let entityName = `实体${index + 1}`;

                // 详细调试实体属性
                console.log(`🔍 实体 ${index + 1} 详细信息:`);
                console.log(`  - entity.name: "${entity.name}" (${typeof entity.name})`);
                console.log(`  - entity.id: "${entity.id}"`);

                if (entity.properties) {
                    console.log(`  - properties:`, entity.properties);
                    console.log(`  - properties._propertyNames:`, entity.properties._propertyNames);

                    // 尝试使用Cesium的getValue方法获取properties
                    try {
                        const nameFields = ['name', 'NAME', 'Name', 'fullname', 'FULLNAME', 'adcode99', 'adcode'];

                        for (const field of nameFields) {
                            try {
                                // 尝试直接访问
                                if (entity.properties[field]) {
                                    let value = entity.properties[field];
                                    // 如果是Cesium的Property对象，尝试getValue
                                    if (value && typeof value.getValue === 'function') {
                                        value = value.getValue(Cesium.JulianDate.now());
                                    }
                                    if (value && typeof value === 'string' && value.trim() !== '') {
                                        entityName = value.trim();
                                        console.log(`  ✅ 从 properties.${field} 获取名称: "${entityName}"`);
                                        break;
                                    }
                                }
                            } catch (fieldError) {
                                console.log(`  ⚠️ 访问 properties.${field} 失败:`, fieldError);
                            }
                        }

                        // 优先从properties.name获取真正的区县名称
                        if (entity.properties._propertyNames) {
                            console.log(`  🔍 检查 properties.name 获取区县名称`);

                            // 首先尝试获取name属性（这是真正的区县名）
                            try {
                                const nameProp = entity.properties.name;
                                if (nameProp && typeof nameProp.getValue === 'function') {
                                    const nameValue = nameProp.getValue(Cesium.JulianDate.now());
                                    console.log(`    - properties.name: "${nameValue}"`);

                                    if (typeof nameValue === 'string' && nameValue.trim() !== '') {
                                        entityName = nameValue.trim();
                                        console.log(`  ✅ 从 properties.name 获取区县名称: "${entityName}"`);
                                    }
                                }
                            } catch (nameError) {
                                console.log(`    ❌ 获取 properties.name 失败:`, nameError);
                            }

                            // 如果还没找到，遍历所有属性寻找区县名
                            if (entityName.startsWith('实体')) {
                                console.log(`  🔍 遍历所有属性寻找区县名:`, entity.properties._propertyNames);
                                for (const propName of entity.properties._propertyNames) {
                                    try {
                                        const prop = entity.properties[propName];
                                        if (prop && typeof prop.getValue === 'function') {
                                            const value = prop.getValue(Cesium.JulianDate.now());
                                            console.log(`    - ${propName}: "${value}"`);

                                            // 寻找包含"区"或"县"的值
                                            if (typeof value === 'string' && value.trim() !== '' &&
                                                (value.includes('区') || value.includes('县') || value.includes('市辖区'))) {
                                                entityName = value.trim();
                                                console.log(`  ✅ 发现区县名称 ${propName}: "${entityName}"`);
                                                break;
                                            }
                                        }
                                    } catch (propError) {
                                        console.log(`    ❌ 访问属性 ${propName} 失败:`, propError);
                                    }
                                }
                            }
                        }

                    } catch (propsError) {
                        console.log(`  ❌ 处理properties失败:`, propsError);
                    }
                } else {
                    console.log(`  - properties: null`);
                }

                // 如果entity.name存在且是字符串，优先使用
                if (entity.name && typeof entity.name === 'string' && entity.name.trim() !== '') {
                    entityName = entity.name.trim();
                    console.log(`  ✅ 使用 entity.name: "${entityName}"`);
                }

                // 如果还是没有获取到有效名称，使用ID
                if (entityName.startsWith('实体') && entity.id) {
                    entityName = `区域_${entity.id.substring(0, 8)}`;
                    console.log(`  ⚠️ 使用备用名称: "${entityName}"`);
                }

                console.log(`🎯 最终实体名称: "${entityName}"`);
                console.log(`---`);

                console.log(`🔍 处理实体 ${index + 1}: ${entityName}, 类型: ${entity.polygon ? 'polygon' : entity.polyline ? 'polyline' : '其他'}`);

                if (entity.polygon) {
                    // 处理面要素 - 跟随地形起伏
                    const newEntity = dataSource.entities.add({
                        id: entity.id,
                        name: entityName,
                        polygon: {
                            hierarchy: entity.polygon.hierarchy,
                            material: source.style.fill,
                            outline: true,
                            outlineColor: source.style.stroke,
                            height: 50,  // 稍微高于地面50米，确保可见
                            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                        }
                    });

                    console.log(`✅ 创建面要素: ${entityName}`);

                    // 强制创建边界线，使用正确的区县名称
                    console.log(`🎨 准备创建边界线，使用名称: "${entityName}"`);
                    createEntityBoundaryLine(dataSource, entity, source.style, entityName);

                } else if (entity.polyline) {
                    // 处理线要素
                    console.log(`📏 处理线要素: ${entity.name || '未命名'}`);
                    createEntityBoundaryLine(dataSource, entity, source.style);
                } else if (entity.point || (entity.position && isPointData)) {
                    // 处理点要素（成都市区县中心点）
                    console.log(`📍 处理点要素: ${entityName}`);

                    const pointEntity = dataSource.entities.add({
                        id: entity.id,
                        name: entityName,
                        position: entity.position,
                        point: {
                            pixelSize: 15,
                            color: Cesium.Color.ORANGE,
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        },
                        label: {
                            text: entityName,
                            font: '14pt Microsoft YaHei',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            pixelOffset: new Cesium.Cartesian2(0, -30),
                            showBackground: true,
                            backgroundColor: Cesium.Color.ORANGE.withAlpha(0.7),
                            backgroundPadding: new Cesium.Cartesian2(8, 4)
                        }
                    });

                    console.log(`✅ 创建区县中心点: ${entityName}`);
                } else {
                    console.log(`❓ 未知实体类型: ${entity.name || '未命名'}`);
                }

            } catch (entityError) {
                console.warn(`处理实体 ${entity.id || '未知'} 时出错:`, entityError);
            }
        });

            // 移除临时的GeoJSON数据源
            viewer.dataSources.remove(geoJsonDataSource);

            // 统计加载的实体数量
            const entityCount = dataSource.entities.values.length;
            console.log(`✅ ${source.name} 加载成功，包含 ${entityCount} 个实体`);

            return { success: true, entityCount };

        } catch (error) {
            console.warn(`❌ 数据源 ${i + 1} 失败:`, error.message);
            lastError = error;

            // 清理失败的数据源
            if (boundaryLayers[source.level]) {
                try {
                    await viewer.dataSources.remove(boundaryLayers[source.level]);
                    delete boundaryLayers[source.level];
                } catch (cleanupError) {
                    console.warn('清理数据源时出错:', cleanupError);
                }
            }

            // 如果不是最后一个URL，继续尝试下一个
            if (i < urls.length - 1) {
                console.log(`🔄 尝试下一个数据源...`);
                continue;
            }
        }
    }

    // 所有数据源都失败了，显示用户友好的提示
    console.error(`❌ ${source.name} 所有数据源都失败了`);
    await handleBoundaryLoadFailure(source, lastError);
    return { success: false, error: lastError, fallbackShown: true };
}

// 边界加载失败处理 - 显示用户友好的提示
async function handleBoundaryLoadFailure(source, error) {
    console.warn(`⚠️ ${source.name} 加载失败，显示提示信息`);

    try {
        // 创建一个提示数据源
        const fallbackDataSource = new Cesium.CustomDataSource(source.name + '_提示');
        boundaryLayers[source.level] = fallbackDataSource;
        await viewer.dataSources.add(fallbackDataSource);

        if (source.level === 'county_chengdu') {
            // 在成都市中心显示提示信息
            fallbackDataSource.entities.add({
                name: '边界数据加载提示',
                position: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 1000),
                label: {
                    text: '成都市区县边界数据加载中...\n请检查网络连接',
                    font: '16pt Microsoft YaHei',
                    fillColor: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -50),
                    showBackground: true,
                    backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
                    backgroundPadding: new Cesium.Cartesian2(10, 5)
                },
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2
                }
            });

            console.log('📍 已在成都市中心显示边界数据加载提示');
        }

        // 显示用户提示
        showToast('warning', '边界数据', `${source.name}加载失败，请检查网络连接`);

    } catch (fallbackError) {
        console.error('创建提示信息失败:', fallbackError);
    }
}



// 检查所有边界线
async function checkAllBoundaries() {
    console.log(`\n🔍 最终边界检查:`);

    let totalEntities = 0;
    let totalPolylines = 0;
    let totalPolygons = 0;
    let countyBoundaries = 0;

    Object.keys(boundaryLayers).forEach(layerKey => {
        const dataSource = boundaryLayers[layerKey];
        if (dataSource && dataSource.entities) {
            const entities = dataSource.entities.values;
            totalEntities += entities.length;

            const polylines = entities.filter(e => e.polyline);
            const polygons = entities.filter(e => e.polygon);

            totalPolylines += polylines.length;
            totalPolygons += polygons.length;

            // 统计区县边界
            if (layerKey.startsWith('county_')) {
                const countyPolylines = polylines.filter(e =>
                    e.name && typeof e.name === 'string' &&
                    (e.name.includes('区') || e.name.includes('县'))
                );
                countyBoundaries += countyPolylines.length;

                console.log(`  📋 ${layerKey}: ${entities.length} 实体 (${polylines.length} 线条, ${polygons.length} 面)`);

                // 显示前3个区县名称
                const sampleNames = polylines.slice(0, 3).map(e => e.name).filter(n => n);
                if (sampleNames.length > 0) {
                    console.log(`    示例: ${sampleNames.join(', ')}`);
                }
            }
        }
    });

    console.log(`\n📊 边界统计总览:`);
    console.log(`  🎯 总实体数: ${totalEntities}`);
    console.log(`  📏 总边界线: ${totalPolylines}`);
    console.log(`  📐 总面要素: ${totalPolygons}`);
    console.log(`  🏘️ 区县边界线: ${countyBoundaries}`);

    if (countyBoundaries === 0) {
        console.log(`\n❌ 警告: 没有检测到区县边界线！`);
        console.log(`🔧 建议检查:`);
        console.log(`  1. 数据源URL是否正确`);
        console.log(`  2. 实体名称是否包含"区"或"县"`);
        console.log(`  3. 边界线创建逻辑是否正确`);
    } else {
        console.log(`\n✅ 区县边界检查通过！`);
    }
}

// 清除所有行政区划
function removeAllBoundaries() {
    console.log('🧹 清除所有行政区划...');

    // 清除所有数据源
    Object.keys(boundaryLayers).forEach(layerKey => {
        if (boundaryLayers[layerKey]) {
            viewer.dataSources.remove(boundaryLayers[layerKey]);
            delete boundaryLayers[layerKey];
        }
    });

    // 清除所有primitives（如果有GroundPolylinePrimitive）
    const primitivesToRemove = [];
    for (let i = 0; i < viewer.scene.primitives.length; i++) {
        const primitive = viewer.scene.primitives.get(i);
        if (primitive.id && primitive.id.includes('boundary')) {
            primitivesToRemove.push(primitive);
        }
    }
    primitivesToRemove.forEach(primitive => {
        viewer.scene.primitives.remove(primitive);
    });

    console.log(`✅ 已清除 ${Object.keys(boundaryLayers).length} 个边界层`);

    // 强制刷新场景
    viewer.scene.requestRender();
}

// 影像切换函数
function toggleImagery() {
    const imageryProviders = [
        // OpenStreetMap
        () => new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        }),
        // Google卫星
        () => new Cesium.UrlTemplateImageryProvider({
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            maximumLevel: 18,
            credit: 'Google Satellite'
        })
    ];

    imageryIndex = (imageryIndex + 1) % imageryProviders.length;

    try {
        const providerNames = ['OpenStreetMap', 'Google卫星'];
        console.log(`尝试切换到: ${providerNames[imageryIndex]}`);

        const newProvider = imageryProviders[imageryIndex]();

        // 安全地移除现有图层
        try {
            viewer.imageryLayers.removeAll();
        } catch (removeError) {
            console.warn('移除图层时出错:', removeError);
        }

        // 添加新图层
        const newLayer = new Cesium.ImageryLayer(newProvider);
        viewer.imageryLayers.add(newLayer);

        console.log(`✅ 成功切换到: ${providerNames[imageryIndex]}`);

        // 强制刷新场景
        viewer.scene.requestRender();

    } catch (error) {
        console.error('❌ 影像切换失败:', error);

        // 回退到OpenStreetMap（第一个选项）
        try {
            imageryIndex = 0;
            console.log('🔄 回退到OpenStreetMap...');

            viewer.imageryLayers.removeAll();
            const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });
            viewer.imageryLayers.add(new Cesium.ImageryLayer(osmProvider));

            console.log('✅ 已回退到OpenStreetMap');
            viewer.scene.requestRender();

        } catch (fallbackError) {
            console.error('❌ 回退也失败:', fallbackError);
            alert('影像切换出现问题，页面将重新加载。');
            setTimeout(() => location.reload(), 1000);
        }
    }
}

// 数据更新函数
function startDataUpdate() {
    setInterval(() => {
        updateSystemData();
    }, 10000); // 每10秒更新一次
}

function updateSystemData() {
    // 更新时间
    const now = new Date();
    const timeString = now.getFullYear() + '/' +
                      String(now.getMonth() + 1).padStart(2, '0') + '/' +
                      String(now.getDate()).padStart(2, '0') + ' ' +
                      String(now.getHours()).padStart(2, '0') + ':' +
                      String(now.getMinutes()).padStart(2, '0') + ':' +
                      String(now.getSeconds()).padStart(2, '0');

    document.getElementById('lastUpdate').textContent = timeString;

    // 随机更新一些数据
    const onlineDevices = document.getElementById('onlineDevices');
    const dataIntegrity = document.getElementById('dataIntegrity');

    if (Math.random() > 0.8) {
        const newOnlineRate = (95 + Math.random() * 5).toFixed(1) + '%';
        onlineDevices.textContent = newOnlineRate;

        const newIntegrity = (90 + Math.random() * 10).toFixed(1) + '%';
        dataIntegrity.textContent = newIntegrity;
    }

    // 模拟监测点状态变化（偶尔）
    if (Math.random() > 0.9) {
        simulateStatusChange();
    }
}

// 模拟监测点状态变化
function simulateStatusChange() {
    if (!viewer || !viewer.entities) return;

    const entities = viewer.entities.values;
    const monitoringEntities = entities.filter(entity =>
        entity.properties && entity.properties.type &&
        entity.properties.type.getValue() === 'monitoring_point'
    );

    if (monitoringEntities.length === 0) return;

    // 随机选择一个监测点
    const randomEntity = monitoringEntities[Math.floor(Math.random() * monitoringEntities.length)];
    const currentStatus = randomEntity.properties.status.getValue();

    // 状态转换逻辑
    let newStatus = currentStatus;
    const rand = Math.random();

    if (currentStatus === 'online') {
        if (rand < 0.1) newStatus = 'warning';
        else if (rand < 0.05) newStatus = 'offline';
    } else if (currentStatus === 'warning') {
        if (rand < 0.3) newStatus = 'online';
        else if (rand < 0.1) newStatus = 'offline';
    } else if (currentStatus === 'offline') {
        if (rand < 0.5) newStatus = 'online';
        else if (rand < 0.2) newStatus = 'warning';
    }

    // 如果状态发生变化，更新实体
    if (newStatus !== currentStatus) {
        randomEntity.properties.status = newStatus;

        // 先停止之前的动效
        stopDeviceAnimation(randomEntity);

        // 重置为静态颜色
        const newColor = newStatus === 'online' ? Cesium.Color.GREEN :
                        newStatus === 'warning' ? Cesium.Color.ORANGE :
                        Cesium.Color.RED;

        if (randomEntity.point) {
            // 重置基本属性
            randomEntity.point.color = newColor;
            randomEntity.point.pixelSize = 18;
            randomEntity.point.outlineColor = Cesium.Color.WHITE;
            randomEntity.point.outlineWidth = 3;

            // 重置标签颜色
            if (randomEntity.label) {
                randomEntity.label.fillColor = Cesium.Color.WHITE;
            }
        }

        // 只为预警状态添加动效
        if (newStatus === 'warning') {
            setTimeout(() => {
                addDeviceAnimation(randomEntity, newStatus);
            }, 100); // 稍微延迟以确保重置完成
        }

        // 更新统计显示
        updateDeviceStatsDisplay();

        console.log(`监测点状态变化: ${randomEntity.name} ${currentStatus} → ${newStatus}`);
    }
}

// ========== 页卡切换功能 ==========

// 初始化页卡切换功能
function initTabSwitching() {
    console.log('🔄 初始化页卡切换功能...');

    // 获取所有页卡按钮
    const tabButtons = document.querySelectorAll('.panel-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) {
        console.warn('⚠️ 未找到页卡按钮，跳过页卡功能初始化');
        return;
    }

    console.log(`📋 找到 ${tabButtons.length} 个页卡按钮`);

    // 为每个页卡按钮添加点击事件
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            console.log(`🔄 切换到页卡: ${targetTab}`);

            // 移除所有按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // 隐藏所有页卡内容
            tabContents.forEach(content => content.classList.remove('active'));

            // 激活当前按钮
            this.classList.add('active');

            // 显示对应的页卡内容
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`✅ 页卡内容已显示: ${targetTab}Tab`);

                // 显示切换成功的提示
                const tabText = this.querySelector('.tab-text').textContent;
                showToast('info', '页卡切换', `已切换到${tabText}页卡`);

                // 如果切换到预警信息，更新预警数据
                if (targetTab === 'warnings') {
                    updateWarningData();
                }

                // 如果切换到通知，更新通知数据
                if (targetTab === 'notifications') {
                    updateNotificationData();
                }
            } else {
                console.error(`❌ 未找到页卡内容: ${targetTab}Tab`);
            }
        });
    });

    // 初始化页卡徽章数字
    updateTabBadges();

    console.log('✅ 页卡切换功能初始化完成');
}

// 更新页卡徽章数字
function updateTabBadges() {
    // 统计预警数量
    const warningItems = document.querySelectorAll('#warningListMerged .warning-item');
    const warningBadge = document.getElementById('warningBadge');
    if (warningBadge) {
        warningBadge.textContent = warningItems.length;
    }

    // 统计通知数量
    const notificationItems = document.querySelectorAll('#notificationListMerged .notification-item');
    const notificationBadge = document.getElementById('notificationBadge');
    if (notificationBadge) {
        notificationBadge.textContent = notificationItems.length;
    }

    console.log(`📊 页卡徽章更新: 预警${warningItems.length}个, 通知${notificationItems.length}个`);
}

// 更新预警数据
function updateWarningData() {
    console.log('🚨 更新预警数据...');

    // 模拟添加新预警（演示用）
    const warningList = document.getElementById('warningListMerged');
    if (warningList && Math.random() < 0.1) { // 10%概率添加新预警
        const newWarning = document.createElement('div');
        newWarning.className = 'warning-item blue';
        newWarning.innerHTML = `
            <div class="warning-header">
                <span class="warning-level blue">蓝色预警</span>
                <span class="warning-time">${new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            <div class="warning-content">系统检测到轻微地质变化，请保持关注</div>
        `;

        // 添加点击事件
        newWarning.addEventListener('click', handleWarningItemClick);

        warningList.insertBefore(newWarning, warningList.firstChild);
        updateTabBadges();

        console.log('➕ 添加了新的预警信息');
    }
}

// 更新通知数据
function updateNotificationData() {
    console.log('📢 更新通知数据...');

    // 模拟添加新通知（演示用）
    const notificationList = document.getElementById('notificationListMerged');
    if (notificationList && Math.random() < 0.2) { // 20%概率添加新通知
        const newNotification = document.createElement('div');
        newNotification.className = 'notification-item';
        newNotification.innerHTML = `
            <span class="notification-content">系统状态检查完成，所有服务正常运行</span>
            <span class="notification-time">${new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}</span>
        `;

        notificationList.insertBefore(newNotification, notificationList.firstChild);
        updateTabBadges();

        console.log('➕ 添加了新的系统通知');
    }
}

// 预警项点击处理函数
function handleWarningItemClick() {
    const level = this.querySelector('.warning-level').textContent;
    const content = this.querySelector('.warning-content').textContent;
    const time = this.querySelector('.warning-time').textContent;

    // 更新弹窗内容
    document.getElementById('warningLevelBadge').textContent = level;
    document.getElementById('warningLevelBadge').className = 'warning-level-badge ' +
        (level.includes('红色') ? 'red' :
         level.includes('橙色') ? 'orange' :
         level.includes('黄色') ? 'yellow' :
         level.includes('蓝色') ? 'blue' : 'yellow');
    document.getElementById('warningTitle').textContent = content;
    document.getElementById('warningLevel').textContent = level;
    document.getElementById('warningTime').textContent = '2025-07-18 ' + time;

    openModal('warningModal');
}

// 在DOM加载完成后初始化页卡功能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化页卡功能，确保HTML完全加载
    setTimeout(() => {
        initTabSwitching();

        // 绑定预警项点击事件
        document.querySelectorAll('.warning-item').forEach(item => {
            item.addEventListener('click', handleWarningItemClick);
        });
    }, 1000);
});