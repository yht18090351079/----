// VR全景可视化系统 - 简化版

// 全局变量
let currentHazardPoint = 'point1';
let isVRMode = false;
let autoRotateEnabled = false;
let activeSimulations = new Set();

// 隐患点数据 - 匹配真实自然环境
const hazardPoints = {
    point1: {
        name: '秀岭村滑坡隐患点',
        riskLevel: '橙色预警',
        data: { displacement: '2.3mm', rainfall: '15mm/h', tilt: '0.5°' },
        panoramaId: '#panorama1',
        fallbackId: '#fallback1',
        skyColors: { top: '#87CEEB', bottom: '#98FB98' },
        description: '真实山区森林环境，海拔1200米，植被茂密，坡度35°',
        location: '北纬30.2741°, 东经120.1551°',
        environment: '温带山地森林，年降雨量1200mm'
    },
    point2: {
        name: '龙潭沟泥石流隐患点',
        riskLevel: '黄色预警',
        data: { displacement: '5.8mm', rainfall: '32mm/h', tilt: '1.2°' },
        panoramaId: '#panorama2',
        fallbackId: '#fallback2',
        skyColors: { top: '#DEB887', bottom: '#8B7355' },
        description: '真实河谷沟壑环境，集水面积15km²，沟床比降12%',
        location: '北纬30.2851°, 东经120.1661°',
        environment: '高山峡谷地貌，汛期易发泥石流'
    },
    point3: {
        name: '石壁山崩塌隐患点',
        riskLevel: '红色预警',
        data: { displacement: '12.5mm', rainfall: '45mm/h', tilt: '3.8°' },
        panoramaId: '#panorama3',
        fallbackId: '#fallback3',
        skyColors: { top: '#696969', bottom: '#2F4F4F' },
        description: '真实岩石山体环境，花岗岩结构，节理发育',
        location: '北纬30.2961°, 东经120.1771°',
        environment: '陡峭岩壁，风化严重，存在崩塌风险'
    },
    point4: {
        name: '绿野平原地陷隐患点',
        riskLevel: '蓝色预警',
        data: { displacement: '1.1mm', rainfall: '8mm/h', tilt: '0.2°' },
        panoramaId: '#panorama4',
        fallbackId: '#fallback4',
        skyColors: { top: '#8FBC8F', bottom: '#556B2F' },
        description: '真实平原农田环境，地下水丰富，土质疏松',
        location: '北纬30.3071°, 东经120.1881°',
        environment: '冲积平原，地下水位较高，易发地面沉降'
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌄 VR全景系统初始化...');

    // 检查真实全景图片加载状态
    checkRealPanoramaImages();

    // 生成备用全景图片
    generateFallbackImages();

    // 设置初始场景
    setTimeout(() => {
        setupInitialScene();
        updateUI();
        startDataUpdate();
    }, 1000);

    console.log('✅ VR全景系统初始化完成');
});

// 检查真实全景图片
function checkRealPanoramaImages() {
    const panoramaIds = ['#panorama1', '#panorama2', '#panorama3', '#panorama4'];

    panoramaIds.forEach((id, index) => {
        const img = document.querySelector(id);
        if (img) {
            img.addEventListener('load', function() {
                console.log(`✅ 真实全景图片加载成功: ${id}`);
                // 图片加载成功，可以使用真实图片
            });

            img.addEventListener('error', function() {
                console.log(`❌ 真实全景图片加载失败: ${id}，使用备用图片`);
                // 图片加载失败，标记使用备用图片
                this.setAttribute('data-failed', 'true');
            });
        }
    });
}

// 生成备用全景图片
function generateFallbackImages() {
    Object.keys(hazardPoints).forEach((pointId, index) => {
        const canvas = document.querySelector(`#fallback${index + 1}`);
        const pointData = hazardPoints[pointId];

        if (canvas) {
            const ctx = canvas.getContext('2d');

            // 创建高质量渐变背景
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, pointData.skyColors.top);
            gradient.addColorStop(0.3, adjustColor(pointData.skyColors.top, 0.8));
            gradient.addColorStop(0.7, adjustColor(pointData.skyColors.bottom, 1.2));
            gradient.addColorStop(1, pointData.skyColors.bottom);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 添加环境装饰
            addEnvironmentDecorations(ctx, canvas, pointData);

            console.log(`🎨 生成备用全景: ${pointData.name}`);
        }
    });
}

// 调整颜色亮度
function adjustColor(color, factor) {
    // 简单的颜色调整函数
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `rgb(${r}, ${g}, ${b})`;
}

// 添加环境装饰
function addEnvironmentDecorations(ctx, canvas, pointData) {
    const width = canvas.width;
    const height = canvas.height;
    
    // 添加山脉轮廓
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    
    for (let x = 0; x < width; x += 100) {
        const y = height * 0.7 + Math.sin(x * 0.005) * 80 + Math.random() * 40;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
    // 添加云朵
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 6; i++) {
        const x = (width / 6) * i + Math.random() * 200;
        const y = height * 0.2 + Math.random() * 100;
        const radius = 40 + Math.random() * 30;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加太阳
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.25, 50, 0, Math.PI * 2);
    ctx.fill();
}

// 设置初始场景
function setupInitialScene() {
    const panoramaSky = document.querySelector('#panoramaSky');
    if (panoramaSky) {
        // 尝试使用真实全景图片
        const realImg = document.querySelector('#panorama1');
        if (realImg && realImg.complete && realImg.naturalWidth > 0 && !realImg.getAttribute('data-failed')) {
            panoramaSky.setAttribute('src', '#panorama1');
            console.log('🌄 使用真实全景图片');
        } else {
            panoramaSky.setAttribute('src', '#fallback1');
            console.log('🎨 使用备用全景图片');
        }
    }
}

// 切换隐患点
function switchHazardPoint() {
    const selectElement = document.getElementById('hazardPointSelect');
    currentHazardPoint = selectElement.value;

    const pointData = hazardPoints[currentHazardPoint];
    const pointIndex = Object.keys(hazardPoints).indexOf(currentHazardPoint) + 1;

    // 智能选择全景图源
    const panoramaSky = document.querySelector('#panoramaSky');
    if (panoramaSky) {
        const realImg = document.querySelector(`#panorama${pointIndex}`);

        // 检查真实图片是否可用
        if (realImg && realImg.complete && realImg.naturalWidth > 0 && !realImg.getAttribute('data-failed')) {
            panoramaSky.setAttribute('src', pointData.panoramaId);
            console.log(`🌄 使用真实全景: ${pointData.name}`);
            showToast(`已切换到 ${pointData.name}\n🌍 真实自然环境 360° 全景影像`);
            document.getElementById('environmentType').textContent = '真实自然环境';
        } else {
            panoramaSky.setAttribute('src', pointData.fallbackId);
            console.log(`🎨 使用备用全景: ${pointData.name}`);
            showToast(`已切换到 ${pointData.name}\n🎨 模拟环境 (网络图片加载中...)`);
            document.getElementById('environmentType').textContent = '模拟环境';
        }
    }

    // 更新UI
    updateUI();
}

// 灾害模拟
function simulateDisaster(type) {
    const effects = {
        'landslide': '#landslideEffect',
        'debris-flow': '#debrisFlowEffect', 
        'collapse': '#collapseEffect',
        'rainfall': '#rainEffect'
    };
    
    const effectElement = document.querySelector(effects[type]);
    if (effectElement) {
        const isVisible = effectElement.getAttribute('visible') === 'true';
        effectElement.setAttribute('visible', !isVisible);
        
        if (!isVisible) {
            activeSimulations.add(type);
            showToast(`${getDisasterName(type)}模拟已启动`);
        } else {
            activeSimulations.delete(type);
            showToast(`${getDisasterName(type)}模拟已停止`);
        }
    }
}

// 获取灾害名称
function getDisasterName(type) {
    const names = {
        'landslide': '滑坡',
        'debris-flow': '泥石流',
        'collapse': '崩塌',
        'rainfall': '降雨'
    };
    return names[type] || '未知';
}

// 图层控制
function toggleLayer(layerType) {
    const layers = {
        'monitoring': '#monitoringDevices',
        'warning': '#warningAreas',
        'evacuation': '#evacuationRoutes'
    };
    
    const layerElement = document.querySelector(layers[layerType]);
    if (layerElement) {
        const isVisible = layerElement.getAttribute('visible') === 'true';
        layerElement.setAttribute('visible', !isVisible);
        
        const layerNames = {
            'monitoring': '监测设备',
            'warning': '预警区域', 
            'evacuation': '疏散路线'
        };
        
        showToast(`${layerNames[layerType]}${isVisible ? '已隐藏' : '已显示'}`);
    }
}

// 视角控制
function resetView() {
    const camera = document.querySelector('#vrCamera');
    if (camera) {
        camera.setAttribute('rotation', '0 0 0');
        camera.setAttribute('position', '0 1.6 0');
    }
    showToast('视角已重置');
}

function toggleAutoRotate() {
    autoRotateEnabled = !autoRotateEnabled;
    
    if (autoRotateEnabled) {
        startAutoRotation();
        showToast('自动旋转已开启');
    } else {
        showToast('自动旋转已关闭');
    }
}

function startAutoRotation() {
    if (!autoRotateEnabled) return;
    
    const camera = document.querySelector('#vrCamera');
    if (camera) {
        const currentRotation = camera.getAttribute('rotation');
        const newY = (parseFloat(currentRotation.y) + 0.5) % 360;
        camera.setAttribute('rotation', `${currentRotation.x} ${newY} ${currentRotation.z}`);
    }
    
    if (autoRotateEnabled) {
        setTimeout(startAutoRotation, 50);
    }
}

// VR模式
function toggleVRMode() {
    const scene = document.querySelector('#vrScene');
    if (scene) {
        if (!isVRMode) {
            scene.enterVR();
            isVRMode = true;
            showToast('VR模式已开启');
        } else {
            scene.exitVR();
            isVRMode = false;
            showToast('VR模式已关闭');
        }
    }
}

// 清除所有模拟
function clearSimulations() {
    const allEffects = ['#rainEffect', '#landslideEffect', '#debrisFlowEffect', '#collapseEffect'];
    allEffects.forEach(effectId => {
        const effect = document.querySelector(effectId);
        if (effect) {
            effect.setAttribute('visible', 'false');
        }
    });
    
    activeSimulations.clear();
    showToast('所有模拟已清除');
}

// 返回首页
function goBack() {
    window.location.href = '../../index.html';
}

// 显示环境详情
function showEnvironmentInfo() {
    const pointData = hazardPoints[currentHazardPoint];
    if (pointData) {
        const environmentInfo = `
🌍 环境详情信息

📍 隐患点名称: ${pointData.name}
📊 风险等级: ${pointData.riskLevel}
🗺️ 地理位置: ${pointData.location}

🌿 环境描述: ${pointData.description}
🏞️ 环境特征: ${pointData.environment}

📈 实时监测数据:
• 位移量: ${pointData.data.displacement}
• 降雨量: ${pointData.data.rainfall}
• 倾斜度: ${pointData.data.tilt}

🎥 当前显示: 真实自然环境360°全景影像
        `;

        showToast(environmentInfo, 8000); // 显示8秒
    }
}

// 切换全景图片源
function togglePanoramaMode() {
    const panoramaSky = document.querySelector('#panoramaSky');
    const currentSrc = panoramaSky.getAttribute('src');
    const pointData = hazardPoints[currentHazardPoint];

    if (currentSrc === pointData.panoramaId) {
        // 当前是真实图片，切换到备用图片
        panoramaSky.setAttribute('src', pointData.fallbackId);
        showToast('已切换到模拟环境');
    } else {
        // 当前是备用图片，尝试切换到真实图片
        const pointIndex = Object.keys(hazardPoints).indexOf(currentHazardPoint) + 1;
        const realImg = document.querySelector(`#panorama${pointIndex}`);

        if (realImg && realImg.complete && realImg.naturalWidth > 0) {
            panoramaSky.setAttribute('src', pointData.panoramaId);
            showToast('已切换到真实环境');
        } else {
            showToast('真实环境图片未加载，保持模拟环境');
        }
    }
}

// 测试所有全景图片
function testAllPanoramas() {
    const panoramaIds = ['#panorama1', '#panorama2', '#panorama3', '#panorama4'];
    let loadedCount = 0;
    let totalCount = panoramaIds.length;

    panoramaIds.forEach((id, index) => {
        const img = document.querySelector(id);
        if (img) {
            if (img.complete && img.naturalWidth > 0) {
                loadedCount++;
                console.log(`✅ 全景图片 ${index + 1} 已加载`);
            } else {
                console.log(`❌ 全景图片 ${index + 1} 未加载`);
            }
        }
    });

    showToast(`全景图片状态: ${loadedCount}/${totalCount} 已加载`);

    // 如果有图片加载成功，循环展示
    if (loadedCount > 0) {
        let currentIndex = 0;
        const showNext = () => {
            const panoramaSky = document.querySelector('#panoramaSky');
            const img = document.querySelector(panoramaIds[currentIndex]);

            if (img && img.complete && img.naturalWidth > 0) {
                panoramaSky.setAttribute('src', panoramaIds[currentIndex]);
                showToast(`展示全景图片 ${currentIndex + 1}`);
            }

            currentIndex = (currentIndex + 1) % totalCount;

            if (currentIndex !== 0) {
                setTimeout(showNext, 3000);
            } else {
                // 回到当前隐患点
                setTimeout(() => {
                    switchHazardPoint();
                }, 3000);
            }
        };

        showNext();
    }
}

// 设备信息显示
function showDeviceInfo(deviceType) {
    const deviceData = {
        'displacement': {
            name: '位移传感器',
            status: '正常',
            value: '2.3mm',
            battery: '85%'
        },
        'rainfall': {
            name: '雨量计',
            status: '正常', 
            value: '15mm/h',
            battery: '92%'
        }
    };
    
    const device = deviceData[deviceType];
    if (device) {
        showToast(`${device.name}: ${device.value} | 状态: ${device.status} | 电量: ${device.battery}`);
    }
}

// 更新UI
function updateUI() {
    const pointData = hazardPoints[currentHazardPoint];
    if (pointData) {
        document.getElementById('currentPoint').textContent = pointData.name;
        document.getElementById('riskLevel').textContent = pointData.riskLevel;
        document.getElementById('displacement').textContent = pointData.data.displacement;
        document.getElementById('rainfall').textContent = pointData.data.rainfall;
        document.getElementById('tilt').textContent = pointData.data.tilt;

        // 更新时间
        const now = new Date();
        document.getElementById('updateTime').textContent = now.toLocaleTimeString('zh-CN');

        // 显示环境信息
        console.log(`🌍 当前环境: ${pointData.description}`);
        console.log(`📍 地理位置: ${pointData.location}`);
        console.log(`🌿 环境特征: ${pointData.environment}`);
    }
}

// 开始数据更新
function startDataUpdate() {
    setInterval(() => {
        updateUI();
        // 模拟数据变化
        const pointData = hazardPoints[currentHazardPoint];
        if (pointData) {
            pointData.data.displacement = (Math.random() * 5 + 1).toFixed(1) + 'mm';
            pointData.data.rainfall = (Math.random() * 30 + 5).toFixed(0) + 'mm/h';
            pointData.data.tilt = (Math.random() * 2 + 0.1).toFixed(1) + '°';
        }
    }, 5000);
}

// 显示提示信息
function showToast(message, duration = 2000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = 'toast';

    // 处理多行文本
    if (message.includes('\n')) {
        toast.style.whiteSpace = 'pre-line';
        toast.style.textAlign = 'left';
        toast.style.maxWidth = '600px';
        toast.style.fontSize = '11px';
        toast.style.lineHeight = '1.4';
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}
