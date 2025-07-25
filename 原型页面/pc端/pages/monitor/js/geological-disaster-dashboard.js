// 地质灾害预警系统 - 实时监控大屏脚本
// 从 geological-disaster-dashboard.html 自动提取

// 调试模式开关（设置为false可减少控制台日志输出）
window.DEBUG_MODE = false;

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
            if (window.DEBUG_MODE) {
                console.log('🏔️ 世界地形已自动启用（异步方式）');
            }
        } else if (typeof Cesium.createWorldTerrain === 'function') {
            viewer.terrainProvider = Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            isTerrainEnabled = true;
            if (window.DEBUG_MODE) {
                console.log('🏔️ 世界地形已自动启用（同步方式）');
            }
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

        // 抑制Cesium的Service Worker相关错误（这些错误不影响功能）
        const originalConsoleError = console.error;
        console.error = function(...args) {
            const message = args.join(' ');
            if (message.includes('cross-origin redirects') ||
                message.includes('worker script') ||
                message.includes('Service Worker')) {
                return; // 忽略这些错误
            }
            originalConsoleError.apply(console, args);
        };

        // 设置Cesium Ion Token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjZlZDZhMS0xZGMzLTRlMjAtOWMyMC1hY2U2ZGI1OWM3YzIiLCJpZCI6MzIyMjE3LCJpYXQiOjE3NTI3MTgyMDZ9.ESrgN3eQQTxnHv-UUG5aJz7ojlnK9EAzfqFqgXPmH7M';

        // 禁用Cesium的一些可能导致跨域问题的功能
        if (window.location.protocol === 'file:') {
            console.log('🔧 检测到本地文件环境，优化Cesium配置...');
            // 在本地文件环境中禁用某些功能以避免跨域错误
            Cesium.RequestScheduler.maximumRequestsPerServer = 6;
        }

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

// 添加示例设备 - 使用真实的成都地区坐标
function addSampleMonitoringPoints() {
    const sampleDevices = [
        // 气象站设备
        { name: '锦江气象站', type: 'weather', lon: 104.0810, lat: 30.5702, status: 'online' },
        { name: '双流气象站', type: 'weather', lon: 103.9467, lat: 30.5785, status: 'warning' },
        { name: '新都气象站', type: 'weather', lon: 104.1500, lat: 30.8200, status: 'online' },

        // 水位计设备
        { name: '府河水位计', type: 'water', lon: 104.0665, lat: 30.5723, status: 'online' },
        { name: '沱江水位计', type: 'water', lon: 104.4167, lat: 30.8667, status: 'online' },
        { name: '岷江水位计', type: 'water', lon: 103.8333, lat: 30.6833, status: 'warning' },

        // 摄像头设备
        { name: '龙泉山摄像头', type: 'camera', lon: 104.2667, lat: 30.5667, status: 'warning' },
        { name: '彭州监控摄像头', type: 'camera', lon: 103.9500, lat: 30.9900, status: 'online' },
        { name: '大邑监控摄像头', type: 'camera', lon: 103.5200, lat: 30.5800, status: 'online' },

        // 位移计设备
        { name: '青城山位移计', type: 'displacement', lon: 103.5667, lat: 30.9000, status: 'online' },
        { name: '汶川位移计', type: 'displacement', lon: 103.5900, lat: 31.4800, status: 'online' },

        // 雨量计设备
        { name: '都江堰雨量计', type: 'rainfall', lon: 103.6167, lat: 31.0167, status: 'offline' },
        { name: '天府新区雨量计', type: 'rainfall', lon: 104.0625, lat: 30.5417, status: 'online' },
        { name: '金堂雨量计', type: 'rainfall', lon: 104.4000, lat: 30.8500, status: 'online' },

        // 土壤监测设备
        { name: '温江土壤监测仪', type: 'soil', lon: 103.8500, lat: 30.6900, status: 'online' },
        { name: '邛崃土壤监测仪', type: 'soil', lon: 103.4600, lat: 30.4100, status: 'online' },
        { name: '崇州土壤监测仪', type: 'soil', lon: 103.6700, lat: 30.6300, status: 'offline' }
    ];

    if (window.DEBUG_MODE) {
        console.log(`🚀 准备添加 ${sampleDevices.length} 个设备:`);
    }
    sampleDevices.forEach((device, index) => {
        if (window.DEBUG_MODE) {
            console.log(`  ${index + 1}. ${device.name} (${device.type}): ${device.status}`);
        }
        addMonitoringPointToMap(device);
    });

    // 初始化完成后更新统计并飞行到成都
    setTimeout(() => {
        if (window.DEBUG_MODE) {
            console.log(`⏰ 延迟更新设备统计...`);
        }
        updateDeviceStatsDisplay();

        // 飞行到成都地区以便查看监测点
        if (viewer) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.6728, 50000),
                duration: 3.0
            });
            if (window.DEBUG_MODE) {
                console.log(`🛩️ 飞行到成都地区查看监测点`);
            }
        }
    }, 1500);
}

// 在地图上添加设备
function addMonitoringPointToMap(device) {
    if (!viewer || !Cesium) {
        console.log('地图未初始化，设备数据已保存:', device);
        return;
    }

    try {
        const color = device.status === 'online' ? Cesium.Color.GREEN :
                     device.status === 'warning' ? Cesium.Color.ORANGE :
                     Cesium.Color.RED;

        // 根据设备类型选择不同的图标
        const deviceIcons = {
            weather: '🌡️',
            water: '💧',
            camera: '📹',
            displacement: '📏',
            rainfall: '🌧️',
            soil: '🌱'
        };

        const icon = deviceIcons[device.type] || '📍';

        const entity = viewer.entities.add({
            name: device.name,
            position: Cesium.Cartesian3.fromDegrees(device.lon, device.lat),
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
                text: `${icon} ${device.name}`,
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
                name: device.name,
                status: device.status,
                type: 'monitoring_device',
                deviceType: device.type
            }
        });

        // 只为预警设备添加动效
        if (device.status === 'warning') {
            addDeviceAnimation(entity, device.status);
        }

        if (window.DEBUG_MODE) {
            console.log(`✅ 成功添加设备: ${device.name} (${device.type}) 状态: ${device.status} 位置: [${device.lon}, ${device.lat}]`);
        }

        monitoringPoints.push(entity);

        // 更新设备统计
        updateDeviceStatsDisplay();
    } catch (error) {
        console.error('添加设备失败:', error);
    }
}

// 工具栏按钮事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    initMap();

    // 初始化任务面板
    initializeTaskPanel();

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
            // 恢复背景页面滚动
            document.body.style.overflow = 'auto';
        }
    });
});

// 模态框操作函数
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    // 阻止背景页面滚动
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // 恢复背景页面滚动
    document.body.style.overflow = 'auto';
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

// 统计实际设备状态
function calculateDeviceStats() {
    let onlineCount = 0;
    let warningCount = 0;
    let offlineCount = 0;

    // 统计viewer中的设备实体
    if (viewer && viewer.entities) {
        const entities = viewer.entities.values;
        if (window.DEBUG_MODE) {
            console.log(`🔍 开始统计设备状态，总实体数: ${entities.length}`);
        }

        entities.forEach(entity => {
            if (entity.properties && entity.properties.type &&
                entity.properties.type.getValue() === 'monitoring_device') {
                const status = entity.properties.status.getValue();
                const deviceType = entity.properties.deviceType ? entity.properties.deviceType.getValue() : '未知';
                const name = entity.name || '未命名';
                if (window.DEBUG_MODE) {
                    console.log(`📍 设备: ${name} (${deviceType}), 状态: ${status}`);
                }

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

    if (window.DEBUG_MODE) {
        console.log(`📊 统计结果: 正常${onlineCount}, 预警${warningCount}, 离线${offlineCount}`);
    }
    return { onlineCount, warningCount, offlineCount };
}

// 暴露给HTML使用的全局函数 - 获取设备数据
window.getDeviceDataFromViewer = function() {
    const devices = [];
    if (viewer && viewer.entities) {
        const entities = viewer.entities.values;
        entities.forEach(entity => {
            if (entity.properties && entity.properties.type &&
                entity.properties.type.getValue() === 'monitoring_device') {
                try {
                    const position = entity.position.getValue(Cesium.JulianDate.now());
                    const cartographic = Cesium.Cartographic.fromCartesian(position);
                    const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                    const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);

                    devices.push({
                        id: entity.id,
                        name: entity.name,
                        type: entity.properties.deviceType ? entity.properties.deviceType.getValue() : 'unknown',
                        status: entity.properties.status.getValue(),
                        location: `${longitude}°E, ${latitude}°N`
                    });
                } catch (error) {
                    console.error('处理设备数据失败:', entity.name, error);
                }
            }
        });
    }
    return devices;
};

// 更新设备统计显示
function updateDeviceStatsDisplay() {
    const stats = calculateDeviceStats();

    // 更新显示数字
    document.getElementById('onlineCount').textContent = stats.onlineCount;
    document.getElementById('warningCount').textContent = stats.warningCount;
    document.getElementById('offlineCount').textContent = stats.offlineCount;

    // 更新tooltip内容
    updateDeviceStatsTooltips();

    // 更新设备列表 - 现在由HTML中的设备筛选功能管理
    // updateDeviceList();
}

// 更新左侧设备列表
function updateDeviceList() {
    const deviceListContainer = document.getElementById('deviceList');
    if (!deviceListContainer) return;

    // 清空现有列表
    deviceListContainer.innerHTML = '';

    // 获取所有设备
    if (viewer && viewer.entities) {
        const entities = viewer.entities.values;
        const monitoringDevices = entities.filter(entity =>
            entity.properties && entity.properties.type &&
            entity.properties.type.getValue() === 'monitoring_device'
        );

        // 按状态排序：online -> warning -> offline
        monitoringDevices.sort((a, b) => {
            const statusOrder = { 'online': 0, 'warning': 1, 'offline': 2 };
            const statusA = a.properties.status.getValue();
            const statusB = b.properties.status.getValue();
            return statusOrder[statusA] - statusOrder[statusB];
        });

        // 创建设备项
        monitoringDevices.forEach(entity => {
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

        if (window.DEBUG_MODE) {
            console.log(`📋 设备列表已更新: ${monitoringPoints.length} 个监测站`);
        }
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

            // 检查是否是监测设备
            if (entity.properties && entity.properties.type &&
                entity.properties.type.getValue() === 'monitoring_device') {

                const name = entity.name;
                const status = entity.properties.status.getValue();
                const deviceType = entity.properties.deviceType ? entity.properties.deviceType.getValue() : '未知';
                const statusText = status === 'online' ? '正常运行' :
                                 status === 'warning' ? '预警状态' : '离线';
                const statusClass = status;

                // 设备类型中文名称映射
                const deviceTypeNames = {
                    weather: '气象站',
                    water: '水位计',
                    camera: '监控摄像头',
                    displacement: '位移计',
                    rainfall: '雨量计',
                    soil: '土壤监测仪'
                };

                const deviceTypeName = deviceTypeNames[deviceType] || '监测设备';

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

                // 更新设备类型信息
                const deviceTypeElement = document.getElementById('deviceType');
                if (deviceTypeElement) {
                    deviceTypeElement.textContent = deviceTypeName;
                }

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

    if (window.DEBUG_MODE) {
        console.log('🖱️ 地图点击事件处理器已初始化');
    }
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
    if (window.DEBUG_MODE) {
        console.log(`🌊 预警设备波纹扩散动效已启用: ${entity.name}`);
    }
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

// 设备操作函数
function deviceControl() {
    showToast('info', '设备控制', '设备控制指令已发送');
}

function deviceMaintenance() {
    showToast('warning', '维护模式', '设备已切换到维护模式');
}

function exportDeviceData() {
    showToast('success', '数据导出', '设备数据导出任务已启动');
}

// 任务操作函数
function acceptTask() {
    showToast('success', '任务接受', '任务已接受，请按时完成');
    closeModal('taskModal');
}

function updateTaskStatus() {
    showToast('info', '状态更新', '任务状态已更新');
}

function viewTaskDetails() {
    showToast('info', '查看详情', '正在加载任务详细信息');
}

// 任务数据管理
const taskData = {
    pending: [
        {
            id: 'task001',
            title: '监测点数据采集',
            description: '前往XX监测点进行例行数据采集，检查设备运行状态',
            type: '数据采集',
            priority: 'high',
            assignee: '张三',
            assignTime: '2025-07-24 09:00',
            deadline: '2025-07-24 18:00',
            location: '成都市武侯区XX监测点',
            status: 'pending'
        },
        {
            id: 'task002',
            title: '设备维护检查',
            description: '对雨量监测设备进行定期维护和校准',
            type: '设备维护',
            priority: 'medium',
            assignee: '李四',
            assignTime: '2025-07-24 10:00',
            deadline: '2025-07-24 16:00',
            location: '成都市锦江区YY监测站',
            status: 'pending'
        },
        {
            id: 'task003',
            title: '异常情况调查',
            description: '调查昨日监测数据异常的原因，提交调查报告',
            type: '异常调查',
            priority: 'high',
            assignee: '王五',
            assignTime: '2025-07-24 08:30',
            deadline: '2025-07-24 20:00',
            location: '成都市青羊区ZZ监测点',
            status: 'pending'
        }
    ],
    processing: [
        {
            id: 'task004',
            title: '预警信息核实',
            description: '核实当前红色预警区域的实际情况',
            type: '预警核实',
            priority: 'high',
            assignee: '赵六',
            assignTime: '2025-07-24 07:00',
            deadline: '2025-07-24 12:00',
            location: '成都市成华区AA监测区域',
            status: 'processing'
        },
        {
            id: 'task005',
            title: '应急设备部署',
            description: '在指定区域部署临时监测设备',
            type: '设备部署',
            priority: 'medium',
            assignee: '孙七',
            assignTime: '2025-07-24 06:00',
            deadline: '2025-07-24 14:00',
            location: '成都市金牛区BB应急点',
            status: 'processing'
        }
    ],
    completed: [
        {
            id: 'task006',
            title: '日常巡检任务',
            description: '完成本周例行巡检，所有设备运行正常',
            type: '日常巡检',
            priority: 'low',
            assignee: '周八',
            assignTime: '2025-07-23 09:00',
            deadline: '2025-07-23 17:00',
            location: '成都市高新区CC监测线路',
            status: 'completed'
        },
        {
            id: 'task007',
            title: '数据备份任务',
            description: '完成本月监测数据的备份工作',
            type: '数据备份',
            priority: 'medium',
            assignee: '吴九',
            assignTime: '2025-07-23 14:00',
            deadline: '2025-07-23 18:00',
            location: '数据中心',
            status: 'completed'
        }
    ]
};

// 初始化任务面板
function initializeTaskPanel() {
    console.log('🔄 初始化任务面板...');

    // 更新任务统计
    updateTaskStats();

    // 渲染任务列表
    renderTaskList('pending');
    renderTaskList('processing');
    renderTaskList('completed');

    // 绑定页卡切换事件
    bindTaskTabEvents();

    console.log('✅ 任务面板初始化完成');
}

// 更新任务统计
function updateTaskStats() {
    document.getElementById('pendingCount').textContent = taskData.pending.length;
    document.getElementById('processingCount').textContent = taskData.processing.length;
    document.getElementById('completedCount').textContent = taskData.completed.length;
}

// 渲染任务列表
function renderTaskList(status) {
    const container = document.getElementById(`${status}TaskList`);
    if (!container) return;

    const tasks = taskData[status] || [];

    container.innerHTML = tasks.map(task => `
        <div class="task-item" onclick="openTaskModal('${task.id}')">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-priority ${task.priority}">${getPriorityText(task.priority)}</div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-meta">
                <div class="task-assignee">
                    <span>👤</span>
                    <span>${task.assignee}</span>
                </div>
                <div class="task-deadline ${isUrgent(task.deadline) ? 'urgent' : ''}">
                    <span>⏰</span>
                    <span>${formatDeadline(task.deadline)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        'high': '高',
        'medium': '中',
        'low': '低'
    };
    return priorityMap[priority] || '中';
}

// 判断是否紧急
function isUrgent(deadline) {
    const deadlineTime = new Date(deadline).getTime();
    const now = new Date().getTime();
    const hoursDiff = (deadlineTime - now) / (1000 * 60 * 60);
    return hoursDiff <= 2; // 2小时内截止为紧急
}

// 格式化截止时间
function formatDeadline(deadline) {
    const date = new Date(deadline);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (taskDate.getTime() === today.getTime()) {
        return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}

// 绑定任务页卡事件
function bindTaskTabEvents() {
    const tabItems = document.querySelectorAll('.task-panel .panel-tab');

    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // 移除所有active类
            tabItems.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.task-panel .tab-pane').forEach(pane => pane.classList.remove('active'));

            // 添加active类
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            showToast('info', '页卡切换', `已切换到${this.querySelector('.tab-text').textContent}`);
        });
    });
}

// 打开任务详情弹窗
function openTaskModal(taskId) {
    const task = findTaskById(taskId);
    if (!task) return;

    // 设置基本信息
    document.getElementById('taskModalTitle').textContent = task.title;
    document.getElementById('taskModalDescription').textContent = task.description;

    // 设置状态徽章
    const statusBadge = document.getElementById('taskStatusBadge');
    statusBadge.textContent = getStatusText(task.status);
    statusBadge.className = `task-status-badge ${task.status}`;

    // 设置详细信息
    document.getElementById('taskType').textContent = task.type;
    document.getElementById('taskPriority').textContent = getPriorityText(task.priority);
    document.getElementById('taskPriority').className = `value priority-${task.priority}`;
    document.getElementById('taskAssignTime').textContent = task.assignTime;
    document.getElementById('taskDeadline').textContent = task.deadline;
    document.getElementById('taskAssignee').textContent = task.assignee;
    document.getElementById('taskLocation').textContent = task.location;

    // 显示弹窗
    openModal('taskModal');
}

// 根据ID查找任务
function findTaskById(taskId) {
    for (const status in taskData) {
        const task = taskData[status].find(t => t.id === taskId);
        if (task) return task;
    }
    return null;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已处理'
    };
    return statusMap[status] || '未知';
}



// ========== 真实行政区划系统 ==========

// 主函数：加载真实的多层级行政区划
async function loadMultiLevelBoundaries() {
    if (window.DEBUG_MODE) {
        console.log('🗾 开始加载真实行政区划数据...');
    }

    try {
        // 清除现有边界
        removeAllBoundaries();

        // 只加载指定的三个数据文件
        const dataSources = [
            // 1. 中国国界
            {
                name: '中国国界',
                urls: ['data/china-boundary-real.json'],
                level: 'country',
                style: {
                    stroke: Cesium.Color.RED,
                    strokeWidth: 4,
                    fill: Cesium.Color.RED.withAlpha(0.02),
                    clampToGround: true
                }
            },
            // 2. 四川省市级区划
            {
                name: '四川省市级区划',
                urls: ['data/sichuan-cities-real.json'],
                level: 'cities_sichuan',
                style: {
                    stroke: Cesium.Color.YELLOW,
                    strokeWidth: 1.5,
                    fill: Cesium.Color.YELLOW.withAlpha(0.02),
                    clampToGround: true
                }
            },
            // 3. 成都市区县边界
            {
                name: '成都市区县边界',
                urls: ['data/chengdu-districts-real.json'],
                level: 'county_chengdu',
                style: {
                    stroke: Cesium.Color.ORANGE,
                    strokeWidth: 3,
                    fill: Cesium.Color.ORANGE.withAlpha(0.02),
                    clampToGround: true
                }
            }
        ];

        // 静默加载区划边界数据
        let loadedCount = 0;

        // 并行加载所有数据源
        const allPromises = dataSources.map(async (source) => {
            const result = await loadRealBoundaryData(source);
            return { source, result };
        });

        const allResults = await Promise.allSettled(allPromises);

        // 处理所有结果
        allResults.forEach((promiseResult, index) => {
            if (promiseResult.status === 'fulfilled') {
                const { source, result } = promiseResult.value;
                if (result && result.success) {
                    loadedCount++;
                }
            }
        });

        // 最终检查：统计所有边界线
        await checkAllBoundaries();

        if (window.DEBUG_MODE) {
            console.log('✅ 真实行政区划数据加载完成');
        }

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
    if (window.DEBUG_MODE) {
        console.log(`🔍 为实体创建边界线: ${entityName} (customName: ${customName})`);
    }

    try {
        if (entity.polygon && entity.polygon.hierarchy) {
            // 处理面要素的边界
            let positions = extractPositionsFromHierarchy(entity.polygon.hierarchy);
            if (positions && positions.length >= 2) {
                if (window.DEBUG_MODE) {
                    console.log(`✅ 提取到 ${positions.length} 个位置点，创建边界线: ${entityName}_边界`);
                }
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
        if (window.DEBUG_MODE) {
            console.log(`🎨 创建简单边界线: ${name}, 位置数量: ${positions.length}`);
        }

        // 增强边界的可见性，特别是区县级
        let enhancedWidth = style.strokeWidth;
        let enhancedGlow = 0.4;
        let enhancedColor = style.stroke;

        // 区县级边界特殊处理
        if (name.includes('区') || name.includes('县') || name.includes('市辖区') || name.includes('自治县')) {
            enhancedWidth = Math.max(style.strokeWidth, 4); // 区县边界至少4px，确保可见
            enhancedGlow = 0.8; // 强发光效果
            enhancedColor = Cesium.Color.ORANGE.brighten(0.3, new Cesium.Color()); // 明亮橙色
            if (window.DEBUG_MODE) {
                console.log(`🎨 区县边界增强: ${name} → 宽度${enhancedWidth}px, 发光${enhancedGlow}`);
            }
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

        if (window.DEBUG_MODE) {
            console.log(`✅ 边界线创建成功: ${name} (宽度: ${enhancedWidth}px, 发光: ${enhancedGlow})`);
        }
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


    let lastError = null;

    // 尝试每个URL直到成功
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];


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



        // 将GeoJSON实体复制到我们的数据源中，并设置高度属性


        geoJsonDataSource.entities.values.forEach((entity, index) => {
            try {
                // 获取实体的真实名称（重点修复区县名称）
                let entityName = `实体${index + 1}`;

                // 简化日志输出，只在调试模式下显示详细信息
                if (window.DEBUG_MODE) {
                    console.log(`🔍 实体 ${index + 1} 详细信息:`);
                    console.log(`  - entity.name: "${entity.name}" (${typeof entity.name})`);
                    console.log(`  - entity.id: "${entity.id}"`);
                }

                if (entity.properties && window.DEBUG_MODE) {
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
                                        if (window.DEBUG_MODE) {
                                            console.log(`  ✅ 从 properties.${field} 获取名称: "${entityName}"`);
                                        }
                                        break;
                                    }
                                }
                            } catch (fieldError) {
                                if (window.DEBUG_MODE) {
                                    console.log(`  ⚠️ 访问 properties.${field} 失败:`, fieldError);
                                }
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
                } else if (window.DEBUG_MODE) {
                    console.log(`  - properties: null`);
                }

                // 如果entity.name存在且是字符串，优先使用
                if (entity.name && typeof entity.name === 'string' && entity.name.trim() !== '') {
                    entityName = entity.name.trim();
                    if (window.DEBUG_MODE) {
                        console.log(`  ✅ 使用 entity.name: "${entityName}"`);
                    }
                }

                // 如果还是没有获取到有效名称，使用ID
                if (entityName.startsWith('实体') && entity.id) {
                    entityName = `区域_${entity.id.substring(0, 8)}`;
                    if (window.DEBUG_MODE) {
                        console.log(`  ⚠️ 使用备用名称: "${entityName}"`);
                    }
                }

                if (window.DEBUG_MODE) {
                    console.log(`🎯 最终实体名称: "${entityName}"`);
                    console.log(`---`);
                    console.log(`🔍 处理实体 ${index + 1}: ${entityName}, 类型: ${entity.polygon ? 'polygon' : entity.polyline ? 'polyline' : '其他'}`);
                }

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

                    if (window.DEBUG_MODE) {
                        console.log(`✅ 创建面要素: ${entityName}`);
                        console.log(`🎨 准备创建边界线，使用名称: "${entityName}"`);
                    }

                    // 强制创建边界线，使用正确的区县名称
                    createEntityBoundaryLine(dataSource, entity, source.style, entityName);

                } else if (entity.polyline) {
                    // 处理线要素
                    console.log(`📏 处理线要素: ${entity.name || '未命名'}`);
                    createEntityBoundaryLine(dataSource, entity, source.style);
                } else if (entity.point || (entity.position && isPointData)) {
                    // 处理点要素（成都市区县中心点）
                    if (window.DEBUG_MODE) {
                        console.log(`📍 处理点要素: ${entityName}`);
                    }

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
            if (window.DEBUG_MODE) {
                console.log(`✅ ${source.name} 加载成功，包含 ${entityCount} 个实体`);
            }

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
    if (window.DEBUG_MODE) {
        console.log(`\n🔍 最终边界检查:`);
    }

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

    if (window.DEBUG_MODE) {
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

// 模拟设备状态变化
function simulateStatusChange() {
    if (!viewer || !viewer.entities) return;

    const entities = viewer.entities.values;
    const monitoringEntities = entities.filter(entity =>
        entity.properties && entity.properties.type &&
        entity.properties.type.getValue() === 'monitoring_device'
    );

    if (monitoringEntities.length === 0) return;

    // 随机选择一个设备
    const randomEntity = monitoringEntities[Math.floor(Math.random() * monitoringEntities.length)];
    const currentStatus = randomEntity.properties.status.getValue();
    const deviceType = randomEntity.properties.deviceType ? randomEntity.properties.deviceType.getValue() : '未知';

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

        if (window.DEBUG_MODE) {
            console.log(`设备状态变化: ${randomEntity.name} (${deviceType}) ${currentStatus} → ${newStatus}`);
        }
    }
}

// ========== 页卡切换功能 ==========

// 初始化页卡切换功能
function initTabSwitching() {
    if (window.DEBUG_MODE) {
        console.log('🔄 初始化页卡切换功能...');
    }

    // 获取预警通知面板的页卡按钮
    const tabButtons = document.querySelectorAll('.warning-notification-panel .panel-tab');
    const tabContents = document.querySelectorAll('.warning-notification-panel .tab-content');

    if (tabButtons.length === 0) {
        console.warn('⚠️ 未找到页卡按钮，跳过页卡功能初始化');
        return;
    }

    if (window.DEBUG_MODE) {
        console.log(`📋 找到 ${tabButtons.length} 个页卡按钮`);
    }

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

    if (window.DEBUG_MODE) {
        console.log('✅ 页卡切换功能初始化完成');
    }
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

    if (window.DEBUG_MODE) {
        console.log(`📊 页卡徽章更新: 预警${warningItems.length}个, 通知${notificationItems.length}个`);
    }
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

// ========== 导航功能 ==========

// 显示敬请期待提示
function showComingSoon(moduleName) {
    showToast('info', `${moduleName}模块正在开发中，敬请期待！`);
}