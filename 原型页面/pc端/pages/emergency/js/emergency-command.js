// 应急指挥中心系统

// 全局变量
let emergencyMode = true;
let currentDrone = 'drone1';
let microphoneEnabled = false;
let speakerEnabled = true;
let allCallActive = false;
let groupCallActive = false;
let incidentStartTime = new Date('2025-01-25T14:32:15');
let taskIdCounter = 1;

// Cesium相关变量
let viewer;
let isTerrainEnabled = true;
let currentImageryIndex = 0;

// 安全的SVG编码函数
function createSvgDataUrl(svgString) {
    try {
        // 使用encodeURIComponent替代btoa，支持Unicode字符
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } catch (error) {
        console.warn('SVG编码失败:', error);
        // 返回一个简单的默认图标
        const defaultSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#ff4444" stroke="#ffffff" stroke-width="2"/>
            </svg>
        `;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(defaultSvg);
    }
}

// 救援人员数据
const rescuePersonnel = [
    { id: 'fire001', name: '张队长', unit: '消防救援', type: 'fire', status: 'online', position: { x: 150, y: 100 }, task: '现场指挥' },
    { id: 'fire002', name: '李班长', unit: '消防救援', type: 'fire', status: 'online', position: { x: 180, y: 120 }, task: '搜救作业' },
    { id: 'fire003', name: '王战士', unit: '消防救援', type: 'fire', status: 'online', position: { x: 160, y: 140 }, task: '搜救作业' },
    { id: 'medical001', name: '陈医生', unit: '医疗救护', type: 'medical', status: 'online', position: { x: 200, y: 80 }, task: '医疗救护' },
    { id: 'medical002', name: '刘护士', unit: '医疗救护', type: 'medical', status: 'online', position: { x: 220, y: 90 }, task: '医疗救护' },
    { id: 'police001', name: '赵警官', unit: '公安民警', type: 'police', status: 'online', position: { x: 100, y: 150 }, task: '现场警戒' },
    { id: 'police002', name: '孙警员', unit: '公安民警', type: 'police', status: 'online', position: { x: 120, y: 170 }, task: '交通管制' },
    { id: 'expert001', name: '周教授', unit: '地质专家', type: 'expert', status: 'online', position: { x: 250, y: 110 }, task: '风险评估' },
    { id: 'expert002', name: '吴工程师', unit: '地质专家', type: 'expert', status: 'online', position: { x: 270, y: 130 }, task: '现场勘查' }
];

// 无人机数据
const droneData = {
    drone1: { name: '无人机-001 (主视角)', altitude: 150, speed: 12, battery: 78, signal: '强' },
    drone2: { name: '无人机-002 (侧视角)', altitude: 200, speed: 8, battery: 65, signal: '中' },
    drone3: { name: '无人机-003 (高空俯视)', altitude: 300, speed: 15, battery: 82, signal: '强' }
};

// 任务数据
let tasks = [
    {
        id: 'task001',
        name: '搜救被困人员',
        type: 'search',
        priority: 'urgent',
        status: 'in-progress',
        assignedPersonnel: ['fire001', 'fire002', 'fire003'],
        description: '在滑坡区域搜救8名被困人员',
        deadline: '2025-01-25T18:00:00',
        progress: 60
    },
    {
        id: 'task002',
        name: '现场医疗救护',
        type: 'medical',
        priority: 'urgent',
        status: 'in-progress',
        assignedPersonnel: ['medical001', 'medical002'],
        description: '对救出人员进行紧急医疗救护',
        deadline: '2025-01-25T17:30:00',
        progress: 40
    },
    {
        id: 'task003',
        name: '地质风险评估',
        type: 'assessment',
        priority: 'high',
        status: 'pending',
        assignedPersonnel: ['expert001', 'expert002'],
        description: '评估次生灾害风险，确定安全区域',
        deadline: '2025-01-25T19:00:00',
        progress: 20
    }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚨 应急指挥中心初始化...');

    initializeEmergencySystem();
    renderPersonnelList();
    renderTaskList();
    renderPersonnelMap();
    initializeCesium();
    startRealTimeUpdates();

    console.log('✅ 应急指挥中心初始化完成');
});

// 初始化应急系统
function initializeEmergencySystem() {
    // 更新事发时间显示
    updateElapsedTime();

    // 设置定时器更新持续时间
    setInterval(updateElapsedTime, 1000);

    // 延迟初始化显示信息，等待DOM完全加载
    setTimeout(() => {
        updateDroneInfo();
    }, 100);
}

// 更新持续时间
function updateElapsedTime() {
    const now = new Date();
    const elapsed = now - incidentStartTime;
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    const elapsedString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('elapsedTime').textContent = elapsedString;
}

// 渲染救援人员列表
function renderPersonnelList() {
    const personnelList = document.getElementById('personnelList');
    personnelList.innerHTML = '';
    
    rescuePersonnel.forEach(person => {
        const personElement = document.createElement('div');
        personElement.className = 'personnel-item';
        personElement.innerHTML = `
            <div class="person-info">
                <div class="person-header">
                    <span class="person-name">${person.name}</span>
                    <span class="person-status ${person.status}">${person.status === 'online' ? '在线' : '离线'}</span>
                </div>
                <div class="person-details">
                    <span class="person-unit">${person.unit}</span>
                    <span class="person-task">${person.task}</span>
                </div>
            </div>
            <div class="person-controls">
                <button class="call-btn" onclick="callPerson('${person.id}')" title="呼叫">📞</button>
                <button class="locate-btn" onclick="locatePerson('${person.id}')" title="定位">📍</button>
            </div>
        `;
        personnelList.appendChild(personElement);
    });
    
    // 更新统计数据
    const onlineCount = rescuePersonnel.filter(p => p.status === 'online').length;
    const taskingCount = rescuePersonnel.filter(p => p.task !== '待命').length;
    
    document.getElementById('onlineCount').textContent = onlineCount;
    document.getElementById('taskingCount').textContent = taskingCount;
}

// 渲染任务列表
function renderTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-header">
                <span class="task-name">${task.name}</span>
                <span class="task-priority ${task.priority}">${getPriorityText(task.priority)}</span>
            </div>
            <div class="task-details">
                <div class="task-info">
                    <span class="task-type">${getTaskTypeText(task.type)}</span>
                    <span class="task-status ${task.status}">${getStatusText(task.status)}</span>
                </div>
                <div class="task-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                    <span class="progress-text">${task.progress}%</span>
                </div>
            </div>
            <div class="task-personnel">
                <span class="personnel-label">执行人员:</span>
                <span class="personnel-names">${getPersonnelNames(task.assignedPersonnel)}</span>
            </div>
            <div class="task-controls">
                <button class="task-btn" onclick="editTask('${task.id}')">编辑</button>
                <button class="task-btn" onclick="updateTaskProgress('${task.id}')">更新进度</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// 渲染人员位置地图
function renderPersonnelMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制地图背景
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制灾害区域
    ctx.fillStyle = 'rgba(255, 68, 68, 0.3)';
    ctx.beginPath();
    ctx.arc(200, 150, 80, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制安全区域
    ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
    ctx.beginPath();
    ctx.arc(100, 250, 60, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 绘制救援人员位置
    rescuePersonnel.forEach(person => {
        const colors = {
            fire: '#ff4444',
            medical: '#00ff88',
            police: '#4488ff',
            expert: '#ffaa00'
        };
        
        ctx.fillStyle = colors[person.type];
        ctx.beginPath();
        ctx.arc(person.position.x, person.position.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制人员编号
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(person.name.charAt(0), person.position.x, person.position.y + 3);
    });
    
    // 绘制图例标签
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('灾害区域', 120, 100);
    ctx.fillText('安全区域', 40, 200);
}

// 初始化Cesium 3D地球
async function initializeCesium() {
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

        // 初始化影像索引
        currentImageryIndex = 0;

        // 创建Cesium Viewer
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
            selectionIndicator: false,
            // 启用鼠标控制
            scene3DOnly: false,
            shouldAnimate: true
        });

        // 配置相机控制器
        const cameraController = viewer.scene.screenSpaceCameraController;

        // 启用所有鼠标手势
        cameraController.enableRotate = true;      // 左键拖拽旋转
        cameraController.enableTranslate = true;   // 右键拖拽平移
        cameraController.enableZoom = true;        // 滚轮缩放
        cameraController.enableTilt = true;        // Ctrl+拖拽倾斜
        cameraController.enableLook = true;        // 自由视角
        cameraController.enableCollisionDetection = true; // 启用碰撞检测

        // 设置缩放限制
        cameraController.minimumZoomDistance = 50;     // 最小缩放距离50米
        cameraController.maximumZoomDistance = 20000;  // 最大缩放距离20公里

        // 设置倾斜角度限制
        cameraController.minimumCollisionTerrainHeight = 100; // 防止穿透地形

        // 设置旋转和平移的惯性
        cameraController.inertiaSpin = 0.9;    // 旋转惯性
        cameraController.inertiaTranslate = 0.9; // 平移惯性
        cameraController.inertiaZoom = 0.8;    // 缩放惯性

        console.log('✅ 相机控制器配置完成');

        // 启用世界地形
        await enableWorldTerrain();

        // 确保默认影像正确加载
        try {
            const defaultImagery = await Cesium.createWorldImageryAsync();
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(defaultImagery);
            console.log('✅ 默认卫星影像已加载');
        } catch (error) {
            console.warn('默认影像加载失败，使用备用影像:', error);
            // 使用OpenStreetMap作为备用
            const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://tile.openstreetmap.org/'
            });
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(osmProvider);
        }

        // 设置初始视角到灾害现场（秀岭村滑坡隐患点）
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(120.1551, 30.2741, 2000),
            orientation: {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-45),
                roll: 0.0
            }
        });

        // 启用视觉增强效果
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.dynamicAtmosphereLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;

        // 设置地形相关选项
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.skyAtmosphere.show = true;

        // 添加灾害现场标记
        try {
            addDisasterSiteMarkers();
            console.log('✅ 灾害现场标记已添加');
        } catch (error) {
            console.warn('添加灾害现场标记失败:', error);
        }

        // 添加救援人员标记
        try {
            addRescuePersonnelMarkers();
            console.log('✅ 救援人员标记已添加');
        } catch (error) {
            console.warn('添加救援人员标记失败:', error);
        }

        // 启动实时更新
        startCesiumUpdates();

        // 添加点击事件处理
        setupCesiumInteractions();

        // 初始化完成后更新显示信息
        setTimeout(() => {
            updateCameraInfo();
        }, 1000);

        // 添加影像加载错误监听
        viewer.imageryLayers.layerAdded.addEventListener(function(layer) {
            layer.imageryProvider.errorEvent.addEventListener(function(error) {
                console.warn('影像加载错误:', error);
                showToast('影像加载出现问题，正在尝试恢复...');
            });
        });

        console.log('✅ Cesium 3D地球初始化完成');

    } catch (error) {
        console.error('Cesium初始化失败:', error);
        document.getElementById('cesiumContainer').innerHTML =
            '<div style="width:100%;height:100%;background:linear-gradient(135deg, #001122 0%, #000a1a 50%, #001133 100%);display:flex;align-items:center;justify-content:center;color:#00ffff;font-size:18px;">地图初始化失败，请检查网络连接</div>';
    }
}

// 启用世界地形
async function enableWorldTerrain() {
    try {
        if (typeof Cesium.createWorldTerrainAsync === 'function') {
            viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            isTerrainEnabled = true;
            console.log('🏔️ 世界地形已启用');
        } else if (typeof Cesium.createWorldTerrain === 'function') {
            viewer.terrainProvider = Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            isTerrainEnabled = true;
            console.log('🏔️ 世界地形已启用');
        }
    } catch (error) {
        console.warn('世界地形启用失败，使用椭球体地形:', error);
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        isTerrainEnabled = false;
    }
}

// 添加灾害现场标记
function addDisasterSiteMarkers() {
    if (!viewer) return;

    // 创建简单的SVG图标（不使用emoji）
    const disasterIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="#ff4444" stroke="#ffffff" stroke-width="3"/>
            <polygon points="24,10 30,20 18,20" fill="white"/>
            <rect x="22" y="20" width="4" height="8" fill="white"/>
            <circle cx="24" cy="32" r="2" fill="white"/>
        </svg>
    `;

    // 滑坡灾害区域
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.1551, 30.2741),
        billboard: {
            image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(disasterIconSvg),
            scale: 1.0,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        label: {
            text: '秀岭村滑坡现场',
            font: '14pt sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -50)
        }
    });

    // 添加安全集结点
    const safetyIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="#00ff88" stroke="#ffffff" stroke-width="2"/>
            <path d="M12 18 L16 22 L24 14" stroke="white" stroke-width="3" fill="none"/>
        </svg>
    `;

    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.1520, 30.2720),
        billboard: {
            image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(safetyIconSvg),
            scale: 1.0,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        label: {
            text: '安全集结点',
            font: '12pt sans-serif',
            fillColor: Cesium.Color.LIME,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -40)
        }
    });

    // 危险区域多边形
    viewer.entities.add({
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                120.1540, 30.2750,
                120.1560, 30.2750,
                120.1560, 30.2730,
                120.1540, 30.2730
            ]),
            material: Cesium.Color.RED.withAlpha(0.3),
            height: 0, // 明确设置高度为0
            extrudedHeight: 10, // 设置挤出高度，使区域更明显
            outline: false, // 在地形上禁用轮廓线
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });

    // 添加危险区域边界线（使用polyline替代polygon outline）
    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                120.1540, 30.2750,
                120.1560, 30.2750,
                120.1560, 30.2730,
                120.1540, 30.2730,
                120.1540, 30.2750 // 闭合线条
            ]),
            width: 3,
            material: Cesium.Color.RED,
            clampToGround: true
        }
    });
}

// 添加救援人员标记
function addRescuePersonnelMarkers() {
    if (!viewer) return;

    const personnelColors = {
        fire: '#ff4444',
        medical: '#00ff88',
        police: '#4488ff',
        expert: '#ffaa00'
    };

    rescuePersonnel.forEach(person => {
        const lon = 120.1551 + (person.position.x - 200) * 0.0001;
        const lat = 30.2741 + (person.position.y - 150) * 0.0001;

        // 创建人员标记SVG
        const personnelIconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="${personnelColors[person.type]}" stroke="#ffffff" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-family="Arial">${person.name.charAt(0)}</text>
            </svg>
        `;

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            billboard: {
                image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(personnelIconSvg),
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
                text: person.name,
                font: '10pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                show: false, // 默认隐藏，鼠标悬停时显示
                scale: 0.8,
                translucencyByDistance: new Cesium.NearFarScalar(100, 1.0, 2000, 0.5)
            },
            properties: {
                type: 'personnel',
                personId: person.id,
                personName: person.name,
                personUnit: person.unit,
                personTask: person.task
            }
        });
    });
}

// 设置Cesium交互功能
function setupCesiumInteractions() {
    if (!viewer) return;

    // 添加点击事件处理
    viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function(click) {
        const pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;
            if (entity.properties && entity.properties.type === 'personnel') {
                const personName = entity.properties.personName;
                const personUnit = entity.properties.personUnit;
                const personTask = entity.properties.personTask;
                showToast(`👤 ${personName}\n🏢 单位: ${personUnit}\n📋 任务: ${personTask}`, 4000);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 添加鼠标悬停效果
    viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function(movement) {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entity = pickedObject.id;
            if (entity.properties && entity.properties.type === 'personnel') {
                document.body.style.cursor = 'pointer';
                // 显示人员标签
                entity.label.show = true;
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
            // 隐藏所有人员标签
            hideAllPersonnelLabels();
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 添加相机移动事件监听
    viewer.camera.moveEnd.addEventListener(function() {
        updateCameraInfo();
    });

    // 测试鼠标事件是否正常
    console.log('🖱️ 鼠标事件处理器已设置');

    // 简单的初始化完成提示
    setTimeout(() => {
        showToast('🌍 3D地球已加载完成，可以开始操作', 2000);
    }, 2000);

    // 添加简单的鼠标事件测试
    const cesiumContainer = document.getElementById('cesiumContainer');
    if (cesiumContainer) {
        cesiumContainer.addEventListener('mousedown', function(e) {
            console.log('🖱️ 鼠标按下事件:', e.button);
        });

        cesiumContainer.addEventListener('wheel', function(e) {
            console.log('🔄 滚轮事件:', e.deltaY);
        });

        console.log('✅ 鼠标事件监听器已添加');
    }
}

// 隐藏所有人员标签
function hideAllPersonnelLabels() {
    if (!viewer) return;

    viewer.entities.values.forEach(entity => {
        if (entity.properties && entity.properties.type === 'personnel') {
            entity.label.show = false;
        }
    });
}

// 启动Cesium实时更新
function startCesiumUpdates() {
    if (!viewer) return;

    setInterval(() => {
        // 更新相机信息显示
        updateCameraInfo();

        // 更新救援人员位置
        updateRescuePersonnelOnMap();
    }, 1000);
}

// 更新相机信息
function updateCameraInfo() {
    if (!viewer || !viewer.camera) return;

    try {
        const camera = viewer.camera;
        const cartographic = camera.positionCartographic;

        if (!cartographic) return;

        const height = Math.round(cartographic.height);
        const pitch = Math.round(Cesium.Math.toDegrees(camera.pitch));
        const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

        // 安全地更新元素
        const heightElement = document.getElementById('cameraHeight');
        const angleElement = document.getElementById('viewAngle');
        const coordElement = document.getElementById('coordinates');
        const statusElement = document.getElementById('systemStatus');

        if (heightElement) {
            heightElement.textContent = height + 'm';
        }
        if (angleElement) {
            angleElement.textContent = `俯视${Math.abs(pitch)}°`;
        }
        if (coordElement) {
            coordElement.textContent = `${lat}°N, ${lon}°E`;
        }
        if (statusElement) {
            statusElement.textContent = '在线';
        }
    } catch (error) {
        console.warn('更新相机信息时出错:', error);
    }
}

// 更新显示信息（兼容无人机和相机模式）
function updateDroneInfo() {
    try {
        // 如果Cesium已初始化，使用相机信息
        if (viewer && viewer.camera) {
            updateCameraInfo();
            return;
        }

        // 否则使用模拟的无人机数据
        const drone = droneData[currentDrone];
        if (drone) {
            // 安全地更新元素
            const altitudeElement = document.getElementById('cameraHeight');
            const coordinatesElement = document.getElementById('coordinates');
            const statusElement = document.getElementById('systemStatus');
            const angleElement = document.getElementById('viewAngle');

            if (altitudeElement) {
                altitudeElement.textContent = drone.altitude + 'm';
            }
            if (coordinatesElement) {
                coordinatesElement.textContent = '30.27°N, 120.16°E';
            }
            if (statusElement) {
                statusElement.textContent = drone.signal === '强' ? '在线' : '离线';
            }
            if (angleElement) {
                angleElement.textContent = '俯视45°';
            }
        }
    } catch (error) {
        console.warn('更新显示信息时出错:', error);
    }
}

// 切换无人机
function switchDrone() {
    const select = document.getElementById('droneSelect');
    currentDrone = select.value;
    updateDroneInfo();
    showToast(`已切换到 ${droneData[currentDrone].name}`);
}

// 简化的地图控制函数
function toggleDroneRecord() {
    showToast('开始录制地图影像');
}

function captureDroneImage() {
    showToast('地图截图已保存');
}

// 重置到灾害现场
function resetToDisasterSite() {
    if (!viewer) return;

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.1551, 30.2741, 2000),
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0
        },
        duration: 2.0 // 飞行动画持续2秒
    });

    showToast('正在飞行到灾害现场...');
}

function toggleTerrain() {
    if (!viewer) return;

    isTerrainEnabled = !isTerrainEnabled;

    if (isTerrainEnabled) {
        enableWorldTerrain();
        showToast('地形已开启');
    } else {
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        showToast('地形已关闭');
    }
}

function toggleImagery() {
    if (!viewer) return;

    try {
        // 只使用两种稳定的影像源
        const imageryConfigs = [
            {
                provider: () => Cesium.createWorldImageryAsync(),
                name: '卫星影像'
            },
            {
                provider: () => new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://tile.openstreetmap.org/'
                }),
                name: '街道地图'
            }
        ];

        currentImageryIndex = (currentImageryIndex + 1) % imageryConfigs.length;
        const config = imageryConfigs[currentImageryIndex];

        // 移除当前影像层
        viewer.imageryLayers.removeAll();

        // 添加新的影像层
        if (typeof config.provider === 'function') {
            const providerPromise = config.provider();

            if (providerPromise && typeof providerPromise.then === 'function') {
                // 异步提供者
                providerPromise.then(provider => {
                    viewer.imageryLayers.addImageryProvider(provider);
                    showToast(`已切换到${config.name}`);
                }).catch(error => {
                    console.warn('影像提供者加载失败:', error);
                    showToast(`${config.name}加载失败，保持当前影像`);
                });
            } else {
                // 同步提供者
                viewer.imageryLayers.addImageryProvider(providerPromise);
                showToast(`已切换到${config.name}`);
            }
        }

    } catch (error) {
        console.error('切换影像时出错:', error);
        showToast('影像切换失败，请稍后重试');
    }
}

// 通讯控制函数
function toggleAllCall() {
    allCallActive = !allCallActive;
    const btn = document.querySelector('[onclick="toggleAllCall()"]');
    btn.classList.toggle('active', allCallActive);
    showToast(allCallActive ? '全员通话已开启' : '全员通话已关闭');
}

function toggleGroupCall() {
    groupCallActive = !groupCallActive;
    const btn = document.querySelector('[onclick="toggleGroupCall()"]');
    btn.classList.toggle('active', groupCallActive);
    showToast(groupCallActive ? '分组通话已开启' : '分组通话已关闭');
}

function toggleMicrophone() {
    microphoneEnabled = !microphoneEnabled;
    const btn = document.querySelector('[onclick="toggleMicrophone()"]');
    btn.classList.toggle('active', microphoneEnabled);
    btn.textContent = microphoneEnabled ? '🎤' : '🔇';
    showToast(microphoneEnabled ? '麦克风已开启' : '麦克风已关闭');
}

function toggleSpeaker() {
    speakerEnabled = !speakerEnabled;
    const btn = document.querySelector('[onclick="toggleSpeaker()"]');
    btn.classList.toggle('active', speakerEnabled);
    btn.textContent = speakerEnabled ? '🔊' : '🔇';
    showToast(speakerEnabled ? '扬声器已开启' : '扬声器已关闭');
}

function callPerson(personId) {
    const person = rescuePersonnel.find(p => p.id === personId);
    if (person) {
        showToast(`正在呼叫 ${person.name}...`);
    }
}

function locatePerson(personId) {
    const person = rescuePersonnel.find(p => p.id === personId);
    if (person) {
        showToast(`${person.name} 位置: (${person.position.x}, ${person.position.y})`);
        // 在地图上高亮显示该人员
        highlightPersonOnMap(person);
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        showToast(`指令已发送: ${message}`);
        input.value = '';
    }
}

// 任务管理函数
function createNewTask() {
    document.getElementById('taskModal').style.display = 'block';
    populatePersonnelSelect();
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function createTask() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);
    
    const newTask = {
        id: `task${String(taskIdCounter++).padStart(3, '0')}`,
        name: document.getElementById('taskName').value,
        type: document.getElementById('taskType').value,
        priority: document.getElementById('taskPriority').value,
        status: 'pending',
        assignedPersonnel: Array.from(document.getElementById('assignedPersonnel').selectedOptions).map(option => option.value),
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        progress: 0
    };
    
    tasks.push(newTask);
    renderTaskList();
    closeTaskModal();
    showToast(`任务 "${newTask.name}" 已创建`);
}

function populatePersonnelSelect() {
    const select = document.getElementById('assignedPersonnel');
    select.innerHTML = '';
    
    rescuePersonnel.forEach(person => {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = `${person.name} (${person.unit})`;
        select.appendChild(option);
    });
}

// 辅助函数
function getPriorityText(priority) {
    const priorities = {
        urgent: '紧急',
        high: '高',
        medium: '中',
        low: '低'
    };
    return priorities[priority] || priority;
}

function getTaskTypeText(type) {
    const types = {
        search: '搜索救援',
        medical: '医疗救护',
        evacuation: '人员疏散',
        assessment: '现场评估',
        logistics: '后勤保障'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        pending: '待执行',
        'in-progress': '执行中',
        completed: '已完成',
        cancelled: '已取消'
    };
    return statuses[status] || status;
}

function getPersonnelNames(personnelIds) {
    return personnelIds.map(id => {
        const person = rescuePersonnel.find(p => p.id === id);
        return person ? person.name : id;
    }).join(', ');
}

function highlightPersonOnMap(person) {
    // 重新渲染地图并高亮指定人员
    renderPersonnelMap();
    
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    
    // 绘制高亮圆圈
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(person.position.x, person.position.y, 15, 0, 2 * Math.PI);
    ctx.stroke();
}

// 更新救援人员在Cesium地图上的位置
function updateRescuePersonnelOnMap() {
    if (!viewer) return;

    // 清除现有的人员标记
    const entities = viewer.entities.values;
    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];
        if (entity.properties && entity.properties.type === 'personnel') {
            viewer.entities.remove(entity);
        }
    }

    // 重新添加人员标记
    addRescuePersonnelMarkers();
}

function startRealTimeUpdates() {
    // 模拟实时数据更新
    setInterval(() => {
        // 随机更新人员位置
        rescuePersonnel.forEach(person => {
            if (Math.random() < 0.1) { // 10%概率更新位置
                person.position.x += (Math.random() - 0.5) * 10;
                person.position.y += (Math.random() - 0.5) * 10;

                // 确保位置在地图范围内
                person.position.x = Math.max(20, Math.min(380, person.position.x));
                person.position.y = Math.max(20, Math.min(280, person.position.y));
            }
        });

        // 更新2D地图
        renderPersonnelMap();

        // 更新无人机数据显示
        Object.values(droneData).forEach(drone => {
            if (Math.random() < 0.2) { // 20%概率更新数据
                drone.battery = Math.max(0, drone.battery - Math.random() * 0.5);
                drone.speed = Math.max(0, drone.speed + (Math.random() - 0.5) * 2);
            }
        });

        updateDroneInfo();

    }, 2000); // 每2秒更新一次
}

function toggleEmergencyMode() {
    emergencyMode = !emergencyMode;
    showToast(emergencyMode ? '紧急模式已激活' : '紧急模式已关闭');
}

// 显示提示信息
function showToast(message, duration = 3000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #00ffff;
        padding: 15px 25px;
        border-radius: 10px;
        border: 1px solid rgba(0, 255, 255, 0.5);
        z-index: 2000;
        font-family: 'Courier New', monospace;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}
