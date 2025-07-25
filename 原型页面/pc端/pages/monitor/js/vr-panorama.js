// 地质灾害预警系统 - VR全景可视化页面脚本

// ========== 全局变量 ==========
let vrScene = null;
let currentHazardPoint = 'point1';
let isVRMode = false;
let simulationPlaying = false;
let simulationTime = 0;
let playbackSpeed = 1;
let autoRotateEnabled = false;
let flyModeEnabled = false;

// 高保真隐患点数据
const hazardPoints = {
    point1: {
        name: 'XX村滑坡隐患点',
        status: '正常监测',
        panoramaId: '#panorama1', // 山区森林全景
        environmentPreset: 'forest',
        lightingConfig: {
            ambient: '#404040',
            directional: '#ffffff',
            hemisphere: '#87CEEB'
        },
        data: {
            displacement: '2.3mm',
            rainfall: '15mm/h',
            tilt: '0.5°',
            soilMoisture: '65%',
            temperature: '18°C',
            windSpeed: '12km/h'
        },
        riskLevel: '橙色预警',
        affectedArea: '半径500米',
        evacuationCount: '156人',
        geologicalType: 'landslide',
        coordinates: { lat: 30.2741, lng: 120.1551 }
    },
    point2: {
        name: 'YY镇泥石流隐患点',
        status: '黄色预警',
        panoramaId: '#panorama2', // 沟谷地貌全景
        environmentPreset: 'canyon',
        lightingConfig: {
            ambient: '#3a3a2a',
            directional: '#ffeeaa',
            hemisphere: '#DEB887'
        },
        data: {
            displacement: '5.8mm',
            rainfall: '32mm/h',
            tilt: '1.2°',
            soilMoisture: '85%',
            temperature: '22°C',
            windSpeed: '8km/h'
        },
        riskLevel: '黄色预警',
        affectedArea: '半径800米',
        evacuationCount: '243人',
        geologicalType: 'debris-flow',
        coordinates: { lat: 30.2851, lng: 120.1661 }
    },
    point3: {
        name: 'ZZ县崩塌隐患点',
        status: '红色预警',
        panoramaId: '#panorama3', // 城市山体全景
        environmentPreset: 'default',
        lightingConfig: {
            ambient: '#2a2a2a',
            directional: '#ff9999',
            hemisphere: '#696969'
        },
        data: {
            displacement: '12.5mm',
            rainfall: '45mm/h',
            tilt: '3.8°',
            soilMoisture: '78%',
            temperature: '25°C',
            windSpeed: '15km/h'
        },
        riskLevel: '红色预警',
        affectedArea: '半径1200米',
        evacuationCount: '567人',
        geologicalType: 'collapse',
        coordinates: { lat: 30.2961, lng: 120.1771 }
    },
    point4: {
        name: 'AA区地陷隐患点',
        status: '正常监测',
        panoramaId: '#panorama4', // 平原森林全景
        environmentPreset: 'forest',
        lightingConfig: {
            ambient: '#404040',
            directional: '#ffffff',
            hemisphere: '#8FBC8F'
        },
        data: {
            displacement: '1.1mm',
            rainfall: '8mm/h',
            tilt: '0.2°',
            soilMoisture: '45%',
            temperature: '20°C',
            windSpeed: '6km/h'
        },
        riskLevel: '蓝色预警',
        affectedArea: '半径300米',
        evacuationCount: '89人',
        geologicalType: 'subsidence',
        coordinates: { lat: 30.3071, lng: 120.1881 }
    }
};

// 灾害模拟配置
const disasterSimulations = {
    landslide: {
        name: '滑坡模拟',
        duration: 30000, // 30秒
        phases: [
            { time: 0, action: 'startRain', intensity: 0.3 },
            { time: 5000, action: 'increaseSoilSaturation', value: 0.8 },
            { time: 10000, action: 'showCracks', positions: ['-10 5 -15', '-8 4 -12'] },
            { time: 15000, action: 'startSliding', velocity: '0 -2 -1' },
            { time: 20000, action: 'debrisFlow', intensity: 0.7 },
            { time: 25000, action: 'triggerAlarm', level: 'critical' }
        ]
    },
    'debris-flow': {
        name: '泥石流模拟',
        duration: 25000,
        phases: [
            { time: 0, action: 'heavyRain', intensity: 0.8 },
            { time: 3000, action: 'waterAccumulation', area: 'upstream' },
            { time: 8000, action: 'debrisFormation', density: 0.6 },
            { time: 12000, action: 'flowInitiation', velocity: '0 -3 -2' },
            { time: 18000, action: 'peakFlow', intensity: 1.0 },
            { time: 22000, action: 'impactZone', radius: 15 }
        ]
    },
    collapse: {
        name: '崩塌模拟',
        duration: 20000,
        phases: [
            { time: 0, action: 'structuralWeakening', intensity: 0.2 },
            { time: 5000, action: 'crackPropagation', speed: 0.5 },
            { time: 10000, action: 'rockFall', intensity: 0.6 },
            { time: 15000, action: 'massCollapse', scale: 1.5 },
            { time: 18000, action: 'dustCloud', radius: 20 }
        ]
    },
    rainfall: {
        name: '降雨模拟',
        duration: 60000,
        phases: [
            { time: 0, action: 'lightRain', intensity: 0.2 },
            { time: 10000, action: 'moderateRain', intensity: 0.5 },
            { time: 20000, action: 'heavyRain', intensity: 0.8 },
            { time: 40000, action: 'extremeRain', intensity: 1.0 },
            { time: 50000, action: 'floodRisk', level: 'high' }
        ]
    }
};

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 VR全景可视化页面初始化...');

    // 立即初始化，不等待
    initVRScene();
    initEventListeners();
    updateUI();
    startDataUpdate();

    // 确保全景图片立即显示
    setTimeout(() => {
        ensurePanoramaVisible();
    }, 500);

    console.log('✅ VR全景可视化页面初始化完成');
});

// ========== 确保全景图片可见 ==========
function ensurePanoramaVisible() {
    // 生成全景图片
    generatePanoramaImages();

    const panoramaSky = document.querySelector('#panoramaSky');
    if (panoramaSky) {
        // 设置全景图片
        panoramaSky.setAttribute('src', '#panorama1');
        console.log('✅ 全景图片已设置');
    }
}

// ========== 生成全景图片 ==========
function generatePanoramaImages() {
    const panoramaConfigs = [
        { id: 'panorama1', topColor: '#87CEEB', bottomColor: '#98FB98', name: '山区环境' },
        { id: 'panorama2', topColor: '#DEB887', bottomColor: '#8B7355', name: '沟谷环境' },
        { id: 'panorama3', topColor: '#696969', bottomColor: '#2F4F4F', name: '岩石环境' },
        { id: 'panorama4', topColor: '#8FBC8F', bottomColor: '#556B2F', name: '平原环境' }
    ];

    panoramaConfigs.forEach(config => {
        const canvas = document.querySelector(`#${config.id}`);
        if (canvas) {
            const ctx = canvas.getContext('2d');

            // 创建渐变全景图
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, config.topColor);
            gradient.addColorStop(0.5, config.bottomColor);
            gradient.addColorStop(1, config.topColor);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 添加一些装饰元素模拟地质环境
            addEnvironmentElements(ctx, canvas, config);

            console.log(`🎨 生成全景图片: ${config.name}`);
        }
    });
}

// ========== 添加环境元素 ==========
function addEnvironmentElements(ctx, canvas, config) {
    const width = canvas.width;
    const height = canvas.height;

    // 添加山脉轮廓
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);

    for (let x = 0; x < width; x += 50) {
        const y = height * 0.7 + Math.sin(x * 0.01) * 100 + Math.random() * 50;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // 添加云朵
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 8; i++) {
        const x = (width / 8) * i + Math.random() * 100;
        const y = height * 0.2 + Math.random() * 100;
        const radius = 30 + Math.random() * 40;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // 添加太阳/月亮
    ctx.fillStyle = config.topColor === '#87CEEB' ? '#FFD700' : '#F0F8FF';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 40, 0, Math.PI * 2);
    ctx.fill();
}

// ========== 初始化VR场景 ==========
function initVRScene() {
    vrScene = document.querySelector('#vrScene');
    
    if (vrScene) {
        // 监听场景加载完成事件
        vrScene.addEventListener('loaded', function() {
            console.log('📱 VR场景加载完成');
            setupInitialScene();
        });
        
        // 监听相机旋转事件
        const camera = document.querySelector('#vrCamera');
        if (camera) {
            camera.addEventListener('componentchanged', function(evt) {
                if (evt.detail.name === 'rotation') {
                    updateCameraPosition();
                }
            });
        }
    }
}

// ========== 设置初始场景 ==========
function setupInitialScene() {
    console.log('🎬 设置初始VR场景...');

    // 立即显示全景
    const panoramaSky = document.querySelector('#panoramaSky');
    if (panoramaSky) {
        panoramaSky.setAttribute('src', '#panorama1');
        console.log('🌄 全景天空已设置');
    }

    // 设置监测设备点击事件
    setupDeviceInteractions();

    // 更新UI信息
    const pointData = hazardPoints[currentHazardPoint];
    if (pointData) {
        updatePointInfo(pointData);
    }

    // 启动自动数据更新
    setInterval(updateRealtimeData, 5000);

    console.log('✅ VR场景设置完成');
}

// ========== 检查全景图片加载状态 ==========
function checkPanoramaImages() {
    const panoramaIds = ['#panorama1', '#panorama2', '#panorama3', '#panorama4'];

    panoramaIds.forEach(id => {
        const img = document.querySelector(id);
        if (img) {
            img.addEventListener('load', function() {
                console.log(`✅ 全景图片加载成功: ${id}`);
            });

            img.addEventListener('error', function() {
                console.log(`❌ 全景图片加载失败: ${id}`);
                // 可以在这里添加备用图片或处理逻辑
            });

            // 如果图片已经加载完成
            if (img.complete) {
                if (img.naturalWidth > 0) {
                    console.log(`✅ 全景图片已缓存: ${id}`);
                } else {
                    console.log(`❌ 全景图片缓存失败: ${id}`);
                }
            }
        }
    });
}

// ========== 设置设备交互 ==========
function setupDeviceInteractions() {
    // 为监测设备添加点击事件
    const devices = document.querySelectorAll('.clickable');
    devices.forEach((device, index) => {
        device.addEventListener('click', function() {
            const deviceId = index === 0 ? 'device1' : 'device2';
            showDeviceInfo(deviceId);
        });
    });
}

// ========== 初始化事件监听 ==========
function initEventListeners() {
    // 时间轴滑块事件
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', function() {
            updateSimulationTime(this.value);
        });
    }
    
    // 播放速度选择事件
    const speedSelect = document.getElementById('playbackSpeed');
    if (speedSelect) {
        speedSelect.addEventListener('change', function() {
            setPlaybackSpeed();
        });
    }
    
    // 隐患点选择事件
    const pointSelect = document.getElementById('hazardPointSelect');
    if (pointSelect) {
        pointSelect.addEventListener('change', function() {
            switchHazardPoint();
        });
    }
}

// ========== 高保真切换隐患点 ==========
function switchHazardPoint() {
    const selectElement = document.getElementById('hazardPointSelect');
    currentHazardPoint = selectElement.value;

    const pointData = hazardPoints[currentHazardPoint];
    if (!pointData) return;

    // 显示切换加载效果
    showLoadingTransition();

    setTimeout(() => {
        // 切换高分辨率全景图
        const panoramaSky = document.querySelector('#panoramaSky');
        if (panoramaSky) {
            // 淡出效果
            panoramaSky.setAttribute('animation__fadeout',
                'property: material.opacity; to: 0; dur: 1000; easing: easeInQuad');

            setTimeout(() => {
                // 尝试切换全景图片，如果失败则使用渐变背景
                try {
                    panoramaSky.setAttribute('src', pointData.panoramaId);

                    // 检查图片是否加载成功
                    const img = document.querySelector(pointData.panoramaId);
                    if (img && img.complete && img.naturalWidth > 0) {
                        console.log(`✅ 全景图片加载成功: ${pointData.panoramaId}`);
                        panoramaSky.removeAttribute('material');
                    } else {
                        // 图片加载失败，使用渐变背景
                        console.log(`⚠️ 全景图片加载失败，使用渐变背景: ${pointData.name}`);
                        panoramaSky.removeAttribute('src');
                        panoramaSky.setAttribute('material',
                            `shader: gradient; topColor: ${pointData.lightingConfig.hemisphere}; bottomColor: ${pointData.lightingConfig.ambient}`);
                    }
                } catch (error) {
                    console.log(`❌ 全景切换错误，使用渐变背景: ${error.message}`);
                    panoramaSky.removeAttribute('src');
                    panoramaSky.setAttribute('material',
                        `shader: gradient; topColor: ${pointData.lightingConfig.hemisphere}; bottomColor: ${pointData.lightingConfig.ambient}`);
                }

                // 更新环境设置
                updateEnvironmentSettings(pointData);

                // 淡入效果
                panoramaSky.setAttribute('animation__fadein',
                    'property: material.opacity; to: 1; dur: 1500; easing: easeOutQuad');

                // 360度旋转展示
                panoramaSky.setAttribute('animation__rotate',
                    'property: rotation; to: 0 360 0; dur: 3000; easing: easeInOutQuad');

                // 清理动画
                setTimeout(() => {
                    panoramaSky.removeAttribute('animation__fadeout');
                    panoramaSky.removeAttribute('animation__fadein');
                    panoramaSky.removeAttribute('animation__rotate');
                    panoramaSky.setAttribute('rotation', '0 0 0');
                }, 3000);

            }, 1000);
        }

        // 更新环境光照
        updateLighting(pointData.lightingConfig);

        // 更新设备位置和状态
        updateDevicePositions(pointData);

        // 更新UI信息
        updatePointInfo(pointData);

        // 播放环境音效
        playEnvironmentAudio(pointData);

        hideLoadingTransition();

    }, 500);

    showToast('info', `正在切换到 ${pointData.name}...`);
}

// ========== 更新环境设置 ==========
function updateEnvironmentSettings(pointData) {
    const environment = document.querySelector('#environment');
    if (environment) {
        // 更新环境预设
        environment.setAttribute('environment', `preset: ${pointData.environmentPreset}; groundColor: #445; grid: cross`);
    }

    // 根据地质类型调整地形
    updateTerrain(pointData.geologicalType);
}

// ========== 更新地形 ==========
function updateTerrain(geologicalType) {
    const terrain = document.querySelector('#terrain');
    if (!terrain) return;

    // 根据地质类型调整地形颜色和纹理
    switch (geologicalType) {
        case 'landslide':
            terrain.setAttribute('material', 'color: #8B7355; roughness: 1');
            break;
        case 'debris-flow':
            terrain.setAttribute('material', 'color: #A0522D; roughness: 0.8');
            break;
        case 'collapse':
            terrain.setAttribute('material', 'color: #696969; roughness: 0.9');
            break;
        case 'subsidence':
            terrain.setAttribute('material', 'color: #9ACD32; roughness: 0.7');
            break;
        default:
            terrain.setAttribute('material', 'color: #8B7355; roughness: 1');
    }
}

// ========== 更新光照系统 ==========
function updateLighting(lightingConfig) {
    // 更新环境光
    const ambientLight = document.querySelector('a-light[type="ambient"]');
    if (ambientLight) {
        ambientLight.setAttribute('color', lightingConfig.ambient);
        ambientLight.setAttribute('animation',
            'property: intensity; to: 0.6; dur: 2000; easing: easeInOutQuad');
    }

    // 更新方向光
    const directionalLight = document.querySelector('a-light[type="directional"]');
    if (directionalLight) {
        directionalLight.setAttribute('color', lightingConfig.directional);
    }

    // 更新半球光
    const hemisphereLight = document.querySelector('a-light[type="hemisphere"]');
    if (hemisphereLight) {
        hemisphereLight.setAttribute('color', lightingConfig.hemisphere);
    }
}

// ========== 更新设备位置 ==========
function updateDevicePositions(pointData) {
    // 根据隐患点类型调整设备位置和类型
    const devices = document.querySelector('#monitoringDevices');
    if (devices) {
        // 添加特定类型的传感器
        addSpecializedSensors(pointData.geologicalType);
    }
}

// ========== 添加专业传感器 ==========
function addSpecializedSensors(geologicalType) {
    const devices = document.querySelector('#monitoringDevices');

    // 清除之前的专业传感器
    const existingSpecial = devices.querySelectorAll('.specialized-sensor');
    existingSpecial.forEach(sensor => sensor.remove());

    switch (geologicalType) {
        case 'landslide':
            // 添加GPS位移监测
            createGPSSensor(devices, '-7 0 -5');
            // 添加孔隙水压力传感器
            createPressureSensor(devices, '-3 0 -7');
            break;
        case 'debris-flow':
            // 添加流量监测
            createFlowSensor(devices, '1 0 -6');
            // 添加泥位传感器
            createMudLevelSensor(devices, '4 0 -8');
            break;
        case 'collapse':
            // 添加声发射传感器
            createAcousticSensor(devices, '-6 0 -4');
            // 添加裂缝监测
            createCrackSensor(devices, '-4 0 -6');
            break;
        case 'subsidence':
            // 添加沉降监测
            createSubsidenceSensor(devices, '2 0 -5');
            break;
    }
}

// ========== 创建专业传感器 ==========
function createGPSSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-tetrahedron radius="0.4" material="color: #ff6600; metalness: 0.8; roughness: 0.2; emissive: #441100; emissiveIntensity: 0.3"
                       animation="property: rotation; to: 360 360 0; loop: true; dur: 6000"></a-tetrahedron>
        <a-text value="GPS监测" position="0 1.2 0" align="center" color="#ff6600" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createPressureSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-sphere radius="0.3" material="color: #9966ff; metalness: 0.7; roughness: 0.3; emissive: #330066; emissiveIntensity: 0.4"
                  animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 2000"></a-sphere>
        <a-text value="水压监测" position="0 1 0" align="center" color="#9966ff" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createFlowSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-torus radius="0.4" radius-tubular="0.1" material="color: #00ccff; metalness: 0.9; roughness: 0.1; emissive: #003366; emissiveIntensity: 0.5"
                 animation="property: rotation; to: 360 0 0; loop: true; dur: 3000"></a-torus>
        <a-text value="流量监测" position="0 1 0" align="center" color="#00ccff" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createMudLevelSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-cone radius-bottom="0.3" radius-top="0.1" height="0.8" material="color: #cc6600; metalness: 0.6; roughness: 0.4"
                animation="property: position; to: ${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) + 0.3} ${position.split(' ')[2]}; dir: alternate; loop: true; dur: 2500"></a-cone>
        <a-text value="泥位监测" position="0 1.5 0" align="center" color="#cc6600" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createAcousticSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-octahedron radius="0.35" material="color: #ff3366; metalness: 0.8; roughness: 0.2; emissive: #660011; emissiveIntensity: 0.6"
                      animation="property: material.emissiveIntensity; to: 0.2; dir: alternate; loop: true; dur: 1000"></a-octahedron>
        <a-text value="声发射监测" position="0 1 0" align="center" color="#ff3366" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createCrackSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-box width="0.6" height="0.1" depth="0.6" material="color: #ffcc00; metalness: 0.7; roughness: 0.3; emissive: #664400; emissiveIntensity: 0.3"
               animation="property: rotation; to: 0 180 0; dir: alternate; loop: true; dur: 4000"></a-box>
        <a-text value="裂缝监测" position="0 0.8 0" align="center" color="#ffcc00" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

function createSubsidenceSensor(parent, position) {
    const sensor = document.createElement('a-entity');
    sensor.className = 'specialized-sensor clickable';
    sensor.setAttribute('position', position);
    sensor.innerHTML = `
        <a-ring radius-inner="0.2" radius-outer="0.4" material="color: #66ff66; metalness: 0.8; roughness: 0.2; emissive: #226622; emissiveIntensity: 0.4"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"></a-ring>
        <a-text value="沉降监测" position="0 1 0" align="center" color="#66ff66" scale="0.5 0.5 0.5"></a-text>
    `;
    parent.appendChild(sensor);
}

// ========== 播放环境音效 ==========
function playEnvironmentAudio(pointData) {
    // 由于浏览器音频策略限制，需要用户交互后才能播放音频
    // 这里只是准备音频，不自动播放
    console.log(`🔊 环境音效已准备就绪: ${pointData.name}`);

    // 可以在用户点击后播放音频
    document.addEventListener('click', function playAudioOnClick() {
        const audioSystem = document.querySelector('#audioSystem');
        if (audioSystem) {
            const ambientAudio = audioSystem.querySelector('a-entity[sound]');
            if (ambientAudio && ambientAudio.components.sound) {
                try {
                    ambientAudio.components.sound.playSound();
                    console.log('🎵 环境音效开始播放');
                } catch (error) {
                    console.log('🔇 音频播放受限，需要用户交互');
                }
            }
        }
        // 移除事件监听器，只播放一次
        document.removeEventListener('click', playAudioOnClick);
    }, { once: true });
}

// ========== 显示/隐藏加载过渡 ==========
function showLoadingTransition() {
    // 创建加载遮罩
    const loadingMask = document.createElement('div');
    loadingMask.id = 'loadingMask';
    loadingMask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(0,0,0,0.8), rgba(0,25,50,0.9));
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5000;
        backdrop-filter: blur(10px);
    `;

    loadingMask.innerHTML = `
        <div style="text-align: center; color: #00ffff;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(0,255,255,0.3); border-top: 3px solid #00ffff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 18px; font-family: 'Orbitron', monospace;">正在加载全景环境...</div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(loadingMask);
}

function hideLoadingTransition() {
    const loadingMask = document.getElementById('loadingMask');
    if (loadingMask) {
        loadingMask.style.opacity = '0';
        loadingMask.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (loadingMask.parentNode) {
                loadingMask.parentNode.removeChild(loadingMask);
            }
        }, 500);
    }
}

// ========== 更新隐患点信息 ==========
function updatePointInfo(pointData) {
    // 更新覆盖层信息
    document.getElementById('currentPointName').textContent = pointData.name;
    document.getElementById('currentPointStatus').textContent = pointData.status;
    
    // 更新实时数据
    document.getElementById('displacementValue').textContent = pointData.data.displacement;
    document.getElementById('rainfallValue').textContent = pointData.data.rainfall;
    document.getElementById('tiltValue').textContent = pointData.data.tilt;
    
    // 更新信息面板
    document.getElementById('riskLevel').textContent = pointData.riskLevel;
    document.getElementById('affectedArea').textContent = pointData.affectedArea;
    document.getElementById('evacuationCount').textContent = pointData.evacuationCount;
    
    // 更新风险等级颜色
    const riskElement = document.getElementById('riskLevel');
    riskElement.className = 'status-value';
    if (pointData.riskLevel.includes('红色')) {
        riskElement.classList.add('red');
    } else if (pointData.riskLevel.includes('橙色')) {
        riskElement.classList.add('orange');
    } else if (pointData.riskLevel.includes('黄色')) {
        riskElement.classList.add('orange');
    } else {
        riskElement.classList.add('green');
    }
}

// ========== 视角控制 ==========
function resetView() {
    const camera = document.querySelector('#vrCamera');
    if (camera) {
        camera.setAttribute('rotation', '0 0 0');
        camera.setAttribute('position', '0 1.6 0');
    }
    showToast('success', '视角已重置');
}

function autoRotate() {
    autoRotateEnabled = !autoRotateEnabled;
    
    if (autoRotateEnabled) {
        startAutoRotation();
        showToast('success', '自动旋转已开启');
    } else {
        stopAutoRotation();
        showToast('info', '自动旋转已关闭');
    }
}

function startAutoRotation() {
    if (!autoRotateEnabled) return;
    
    const camera = document.querySelector('#vrCamera');
    if (camera) {
        const currentRotation = camera.getAttribute('rotation');
        const newY = (parseFloat(currentRotation.y) + 1) % 360;
        camera.setAttribute('rotation', `${currentRotation.x} ${newY} ${currentRotation.z}`);
    }
    
    setTimeout(startAutoRotation, 100);
}

function stopAutoRotation() {
    autoRotateEnabled = false;
}

function toggleFlyMode() {
    flyModeEnabled = !flyModeEnabled;

    const camera = document.querySelector('#vrCamera');
    if (camera) {
        camera.setAttribute('wasd-controls', `enabled: ${flyModeEnabled}`);
    }

    showToast(flyModeEnabled ? 'success' : 'info',
             flyModeEnabled ? '飞行模式已开启' : '飞行模式已关闭');
}

// ========== 测试全景图片 ==========
function testPanorama() {
    const panoramaSky = document.querySelector('#panoramaSky');
    if (!panoramaSky) return;

    // 测试不同的全景图片
    const testImages = [
        '#panorama1',
        '#panorama2',
        '#panorama3',
        '#panorama4'
    ];

    const currentSrc = panoramaSky.getAttribute('src');
    let currentIndex = testImages.indexOf(currentSrc);
    currentIndex = (currentIndex + 1) % testImages.length;

    const nextImage = testImages[currentIndex];

    showToast('info', `正在测试全景图片: ${nextImage}`);

    // 尝试切换
    try {
        panoramaSky.setAttribute('src', nextImage);

        // 检查是否加载成功
        setTimeout(() => {
            const img = document.querySelector(nextImage);
            if (img && img.complete && img.naturalWidth > 0) {
                showToast('success', `全景图片加载成功: ${nextImage}`);
            } else {
                showToast('warning', `全景图片可能未加载，使用渐变背景`);
                panoramaSky.removeAttribute('src');
                panoramaSky.setAttribute('material', 'shader: gradient; topColor: #87CEEB; bottomColor: #98FB98');
            }
        }, 2000);

    } catch (error) {
        showToast('error', `全景切换失败: ${error.message}`);
        // 使用渐变背景作为备用
        panoramaSky.removeAttribute('src');
        panoramaSky.setAttribute('material', 'shader: gradient; topColor: #87CEEB; bottomColor: #98FB98');
    }
}

// ========== 灾害模拟 ==========
function simulateDisaster(type) {
    // 移除之前的激活状态
    document.querySelectorAll('.sim-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 激活当前按钮
    event.target.closest('.sim-btn').classList.add('active');
    
    switch (type) {
        case 'landslide':
            simulateLandslide();
            break;
        case 'debris-flow':
            simulateDebrisFlow();
            break;
        case 'collapse':
            simulateCollapse();
            break;
        case 'rainfall':
            simulateRainfall();
            break;
    }
    
    showToast('info', `${getDisasterName(type)}模拟已启动`);
}

function getDisasterName(type) {
    const names = {
        'landslide': '滑坡',
        'debris-flow': '泥石流',
        'collapse': '崩塌',
        'rainfall': '降雨'
    };
    return names[type] || '未知';
}

function simulateLandslide() {
    // 模拟滑坡效果
    const warningAreas = document.querySelector('#warningAreas');
    if (warningAreas) {
        warningAreas.setAttribute('visible', 'true');
        
        // 添加滑坡动画效果
        const plane = warningAreas.querySelector('a-plane');
        if (plane) {
            plane.setAttribute('animation', 
                'property: position; to: 0 -2 -8; dur: 5000; easing: easeInQuad');
        }
    }
}

function simulateDebrisFlow() {
    // 模拟泥石流效果
    const warningAreas = document.querySelector('#warningAreas');
    if (warningAreas) {
        warningAreas.setAttribute('visible', 'true');
        
        // 改变颜色为泥石流特征色
        const plane = warningAreas.querySelector('a-plane');
        if (plane) {
            plane.setAttribute('color', '#8B4513');
            plane.setAttribute('animation', 
                'property: scale; to: 2 1 2; dur: 3000; easing: easeOutQuad');
        }
    }
}

function simulateCollapse() {
    // 模拟崩塌效果
    const devices = document.querySelector('#monitoringDevices');
    if (devices) {
        const box = devices.querySelector('a-box');
        if (box) {
            box.setAttribute('animation', 
                'property: rotation; to: 45 0 45; dur: 2000; easing: easeInOutQuad');
        }
    }
}

function simulateRainfall() {
    // 显示降雨效果
    const rainEffect = document.querySelector('#rainEffect');
    if (rainEffect) {
        rainEffect.setAttribute('visible', 'true');
        
        // 创建多个雨滴
        for (let i = 0; i < 50; i++) {
            const raindrop = document.createElement('a-sphere');
            raindrop.setAttribute('radius', '0.01');
            raindrop.setAttribute('color', '#87CEEB');
            raindrop.setAttribute('opacity', '0.7');
            raindrop.setAttribute('position', 
                `${(Math.random() - 0.5) * 20} ${Math.random() * 10 + 5} ${(Math.random() - 0.5) * 20}`);
            raindrop.setAttribute('animation', 
                `property: position; to: ${(Math.random() - 0.5) * 20} -5 ${(Math.random() - 0.5) * 20}; dur: ${Math.random() * 2000 + 1000}; loop: true`);
            
            rainEffect.appendChild(raindrop);
        }
    }
}

// ========== 图层控制 ==========
function toggleLayer(layerType) {
    const checkbox = event.target;
    const isVisible = checkbox.checked;
    
    switch (layerType) {
        case 'monitoring':
            const devices = document.querySelector('#monitoringDevices');
            if (devices) devices.setAttribute('visible', isVisible);
            break;
        case 'warning':
            const warnings = document.querySelector('#warningAreas');
            if (warnings) warnings.setAttribute('visible', isVisible);
            break;
        case 'evacuation':
            // 疏散路线图层（可以添加更多元素）
            showToast('info', `疏散路线图层${isVisible ? '已显示' : '已隐藏'}`);
            break;
        case 'historical':
            // 历史灾情图层
            showToast('info', `历史灾情图层${isVisible ? '已显示' : '已隐藏'}`);
            break;
    }
}

// ========== 时间轴控制 ==========
function playSimulation() {
    simulationPlaying = true;
    startSimulationLoop();
    showToast('success', '模拟播放已开始');
}

function pauseSimulation() {
    simulationPlaying = false;
    showToast('info', '模拟播放已暂停');
}

function resetSimulation() {
    simulationPlaying = false;
    simulationTime = 0;
    document.getElementById('timeSlider').value = 0;
    document.getElementById('currentTime').textContent = '00:00';
    
    // 重置所有模拟效果
    resetAllSimulations();
    showToast('info', '模拟已重置');
}

function startSimulationLoop() {
    if (!simulationPlaying) return;
    
    simulationTime += playbackSpeed;
    if (simulationTime > 100) {
        simulationTime = 100;
        simulationPlaying = false;
    }
    
    document.getElementById('timeSlider').value = simulationTime;
    updateSimulationTime(simulationTime);
    
    if (simulationPlaying) {
        setTimeout(startSimulationLoop, 100);
    }
}

function updateSimulationTime(value) {
    simulationTime = parseFloat(value);
    
    // 更新时间显示
    const minutes = Math.floor(simulationTime / 100 * 60);
    const seconds = Math.floor((simulationTime / 100 * 60 - minutes) * 60);
    document.getElementById('currentTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 根据时间更新模拟效果
    updateSimulationEffects(simulationTime);
}

function updateSimulationEffects(time) {
    // 根据时间进度更新各种模拟效果
    const intensity = time / 100;
    
    // 更新预警区域透明度
    const warningPlane = document.querySelector('#warningAreas a-plane');
    if (warningPlane) {
        warningPlane.setAttribute('opacity', 0.3 + intensity * 0.4);
    }
    
    // 更新降雨强度
    if (time > 20) {
        const rainEffect = document.querySelector('#rainEffect');
        if (rainEffect) {
            rainEffect.setAttribute('visible', 'true');
        }
    }
}

function setPlaybackSpeed() {
    const speedSelect = document.getElementById('playbackSpeed');
    playbackSpeed = parseFloat(speedSelect.value);
    showToast('info', `播放速度设置为 ${playbackSpeed}x`);
}

function resetAllSimulations() {
    // 重置所有模拟效果
    const rainEffect = document.querySelector('#rainEffect');
    if (rainEffect) {
        rainEffect.setAttribute('visible', 'false');
        // 清除雨滴
        const raindrops = rainEffect.querySelectorAll('a-sphere');
        raindrops.forEach(drop => drop.remove());
    }
    
    // 重置预警区域
    const warningPlane = document.querySelector('#warningAreas a-plane');
    if (warningPlane) {
        warningPlane.setAttribute('opacity', '0.3');
        warningPlane.setAttribute('color', '#ff4444');
        warningPlane.removeAttribute('animation');
    }
    
    // 重置设备状态
    const deviceBox = document.querySelector('#monitoringDevices a-box');
    if (deviceBox) {
        deviceBox.removeAttribute('animation');
        deviceBox.setAttribute('rotation', '0 0 0');
    }
    
    // 移除模拟按钮激活状态
    document.querySelectorAll('.sim-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// ========== VR模式控制 ==========
function toggleVRMode() {
    if (vrScene) {
        if (!isVRMode) {
            vrScene.enterVR();
            isVRMode = true;
            document.getElementById('vrModeStatus').textContent = '开启';
            showToast('success', 'VR模式已开启');
        } else {
            vrScene.exitVR();
            isVRMode = false;
            document.getElementById('vrModeStatus').textContent = '关闭';
            showToast('info', 'VR模式已关闭');
        }
    }
}

// ========== 设备信息显示 ==========
function showDeviceInfo(deviceId) {
    const deviceData = {
        device1: {
            name: '位移传感器-001',
            type: '位移监测',
            status: '正常',
            data: {
                '当前位移': '2.3mm',
                '累计位移': '15.7mm',
                '位移速率': '0.1mm/h',
                '电池电量': '85%',
                '信号强度': '-65dBm',
                '最后更新': '2025-07-24 15:30:25'
            }
        },
        device2: {
            name: '雨量计-002',
            type: '降雨监测',
            status: '正常',
            data: {
                '当前降雨': '15mm/h',
                '累计降雨': '125mm',
                '24h降雨': '45mm',
                '电池电量': '92%',
                '信号强度': '-58dBm',
                '最后更新': '2025-07-24 15:30:20'
            }
        }
    };

    const device = deviceData[deviceId];
    if (!device) return;

    // 构建设备信息HTML
    let contentHTML = `
        <div class="device-info">
            <div class="device-header">
                <h4>${device.name}</h4>
                <span class="device-type">${device.type}</span>
                <span class="device-status ${device.status === '正常' ? 'normal' : 'warning'}">${device.status}</span>
            </div>
            <div class="device-data">
    `;

    for (const [key, value] of Object.entries(device.data)) {
        contentHTML += `
            <div class="data-row">
                <span class="data-key">${key}:</span>
                <span class="data-value">${value}</span>
            </div>
        `;
    }

    contentHTML += `
            </div>
            <div class="device-actions">
                <button class="btn btn-primary" onclick="calibrateDevice('${deviceId}')">校准设备</button>
                <button class="btn btn-secondary" onclick="downloadDeviceData('${deviceId}')">下载数据</button>
            </div>
        </div>
    `;

    // 显示模态框
    document.getElementById('deviceModalTitle').textContent = device.name;
    document.getElementById('deviceModalContent').innerHTML = contentHTML;
    document.getElementById('deviceModal').style.display = 'block';
}

function closeDeviceModal() {
    document.getElementById('deviceModal').style.display = 'none';
}

function calibrateDevice(deviceId) {
    showToast('info', '设备校准功能开发中...');
    closeDeviceModal();
}

function downloadDeviceData(deviceId) {
    showToast('info', '正在下载设备数据...');
    setTimeout(() => {
        showToast('success', '设备数据下载完成');
    }, 2000);
    closeDeviceModal();
}

// ========== 截图功能 ==========
function captureScreenshot() {
    if (vrScene) {
        // 获取canvas元素
        const canvas = vrScene.canvas;
        if (canvas) {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `VR全景截图_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
            link.href = canvas.toDataURL();
            link.click();

            showToast('success', '截图已保存');
        }
    }
}

// ========== 实时数据更新 ==========
function updateRealtimeData() {
    const pointData = hazardPoints[currentHazardPoint];
    if (!pointData) return;

    // 模拟数据变化
    const displacement = (Math.random() * 2 + 1).toFixed(1) + 'mm';
    const rainfall = (Math.random() * 20 + 10).toFixed(0) + 'mm/h';
    const tilt = (Math.random() * 1 + 0.2).toFixed(1) + '°';

    // 更新显示
    document.getElementById('displacementValue').textContent = displacement;
    document.getElementById('rainfallValue').textContent = rainfall;
    document.getElementById('tiltValue').textContent = tilt;

    // 更新时间
    const now = new Date();
    document.getElementById('updateTime').textContent = now.toLocaleTimeString('zh-CN');
}

function startDataUpdate() {
    // 每5秒更新一次数据
    setInterval(updateRealtimeData, 5000);

    // 每秒更新帧率
    setInterval(updateFPS, 1000);
}

function updateFPS() {
    // 模拟帧率显示
    const fps = Math.floor(Math.random() * 10 + 55);
    document.getElementById('fpsCounter').textContent = fps + ' FPS';
}

// ========== 相机位置更新 ==========
function updateCameraPosition() {
    const camera = document.querySelector('#vrCamera');
    if (camera) {
        const rotation = camera.getAttribute('rotation');
        if (rotation) {
            const x = Math.round(rotation.x);
            const y = Math.round(rotation.y);
            document.getElementById('cameraPosition').textContent = `${x}°, ${y}°`;
        }
    }
}

// ========== UI更新 ==========
function updateUI() {
    // 更新当前隐患点信息
    const pointData = hazardPoints[currentHazardPoint];
    if (pointData) {
        updatePointInfo(pointData);
    }

    // 更新时间显示
    updateRealtimeData();
}

// ========== 全屏切换 ==========
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ========== 导航功能 ==========
function showComingSoon(moduleName) {
    showToast('info', `${moduleName}模块正在开发中，敬请期待！`);
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
        zIndex: '4000',
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
    const modal = document.getElementById('deviceModal');
    if (event.target === modal) {
        closeDeviceModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDeviceModal();
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    // 停止所有定时器和动画
    simulationPlaying = false;
    autoRotateEnabled = false;

    console.log('🔄 VR全景页面清理完成');
});
