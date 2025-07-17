/**
 * 现代化CesiumJS 3D地球 - 基于npm安装版本
 * 参考: https://blog.csdn.net/weixin_43073383/article/details/148268421
 */

// 导入Cesium模块（如果使用ES6模块）
// import * as Cesium from 'cesium';

class ModernCesium3D {
    constructor(container) {
        this.container = container;
        this.viewer = null;
        this.entities = new Map(); // 存储实体引用
        this.init();
    }

    /**
     * 初始化现代化Cesium 3D地球
     */
    async init() {
        if (!this.container || typeof Cesium === 'undefined') {
            console.error('❌ Cesium未加载或容器不存在');
            this.showError('Cesium库未正确加载');
            return;
        }

        try {
            console.log('🌍 开始初始化现代化Cesium...');
            
            // 设置Cesium Ion访问令牌
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjZlZDZhMS0xZGMzLTRlMjAtOWMyMC1hY2U2ZGI1OWM3YzIiLCJpZCI6MzIyMjE3LCJpYXQiOjE3NTI3MTgyMDZ9.ESrgN3eQQTxnHv-UUG5aJz7ojlnK9EAzfqFqgXPmH7M';

            // 配置代理服务器
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // 本地开发环境，使用代理
                Cesium.Ion.defaultServer = new Cesium.Resource({
                    url: `${window.location.protocol}//${window.location.host}/cesium-ion/`
                });
            }

            // 创建现代化的Viewer配置
            this.viewer = new Cesium.Viewer(this.container, {
                // 地形提供者 - 使用Cesium世界地形
                terrainProvider: await Cesium.createWorldTerrainAsync({
                    requestWaterMask: true,
                    requestVertexNormals: true
                }),
                
                // 影像提供者 - 使用高分辨率卫星影像
                baseLayerPicker: false,
                
                // UI控件配置
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                animation: false,
                timeline: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                infoBox: true,
                selectionIndicator: true,
                
                // 场景配置
                scene3DOnly: true,
                shouldAnimate: true,
                
                // 性能优化
                requestRenderMode: true,
                maximumRenderTimeChange: Infinity
            });

            console.log('✅ 现代化Cesium Viewer创建成功');

            // 配置场景
            this.configureScene();

            // 设置初始视角到成都地区
            await this.flyToChengdu();

            // 添加测试内容
            this.addTestContent();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 隐藏加载提示
            this.hideLoading();
            
            console.log('🎉 现代化Cesium 3D地球初始化完成');
            
        } catch (error) {
            console.error('❌ 现代化Cesium初始化失败:', error);
            this.showError(`Cesium初始化失败: ${error.message}`);
        }
    }

    /**
     * 配置场景
     */
    configureScene() {
        const scene = this.viewer.scene;
        
        // 启用深度测试，确保地形遮挡正确
        scene.globe.depthTestAgainstTerrain = true;
        
        // 设置大气效果
        scene.skyAtmosphere.show = true;
        scene.sun.show = true;
        scene.moon.show = true;
        scene.skyBox.show = true;
        
        // 设置光照
        scene.globe.enableLighting = true;
        
        // 设置雾效
        scene.fog.enabled = true;
        scene.fog.density = 0.0001;
        
        // 性能优化设置
        scene.globe.maximumScreenSpaceError = 2;
        scene.globe.tileCacheSize = 100;
        
        // 设置相机约束
        scene.screenSpaceCameraController.minimumZoomDistance = 100;
        scene.screenSpaceCameraController.maximumZoomDistance = 50000000;
        
        console.log('🎬 现代化场景配置完成');
    }

    /**
     * 飞行到成都地区
     */
    async flyToChengdu() {
        return this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 50000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0.0
            },
            duration: 3.0
        });
    }

    /**
     * 添加测试内容
     */
    addTestContent() {
        try {
            // 添加成都市标记
            this.addCityMarker();
            
            // 添加监测点
            this.addMonitoringPoints();
            
            // 添加预警区域
            this.addWarningAreas();
            
            console.log('📍 测试内容已添加');
        } catch (error) {
            console.warn('添加测试内容失败:', error);
        }
    }

    /**
     * 添加城市标记
     */
    addCityMarker() {
        const cityEntity = this.viewer.entities.add({
            id: 'chengdu-city',
            name: '成都市',
            position: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728),
            billboard: {
                image: this.createCityIcon(),
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
                text: '成都市',
                font: '16pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        
        this.entities.set('chengdu-city', cityEntity);
    }

    /**
     * 添加监测点
     */
    addMonitoringPoints() {
        const monitoringPoints = [
            { id: 'DEV001', name: '龙泉山监测点', lon: 104.2668, lat: 30.5728, status: 'normal', value: '2.3mm' },
            { id: 'DEV002', name: '青城山监测点', lon: 103.5668, lat: 30.8728, status: 'warning', value: '15mm/h' },
            { id: 'DEV003', name: '峨眉山监测点', lon: 103.4668, lat: 29.5728, status: 'danger', value: '5.2°' },
            { id: 'DEV004', name: '都江堰监测点', lon: 103.6668, lat: 31.0728, status: 'normal', value: '35%' },
            { id: 'DEV005', name: '九寨沟监测点', lon: 103.9668, lat: 33.2728, status: 'offline', value: '--' }
        ];

        const statusColors = {
            normal: Cesium.Color.LIME,
            warning: Cesium.Color.YELLOW,
            danger: Cesium.Color.RED,
            offline: Cesium.Color.GRAY
        };

        monitoringPoints.forEach(point => {
            const entity = this.viewer.entities.add({
                id: point.id,
                name: point.name,
                position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 100),
                cylinder: {
                    length: 300,
                    topRadius: 80,
                    bottomRadius: 80,
                    material: statusColors[point.status].withAlpha(0.8),
                    outline: true,
                    outlineColor: statusColors[point.status],
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: point.id,
                    font: '12pt sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -150),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                description: this.createPointDescription(point)
            });
            
            this.entities.set(point.id, entity);
        });
    }

    /**
     * 添加预警区域
     */
    addWarningAreas() {
        // 高风险区域
        const highRiskArea = this.viewer.entities.add({
            id: 'high-risk-area',
            name: '高风险区域',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    104.0000, 30.5000,
                    104.1000, 30.5000,
                    104.1000, 30.6000,
                    104.0000, 30.6000
                ]),
                height: 0,
                extrudedHeight: 500,
                material: Cesium.Color.RED.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.RED
            }
        });
        
        this.entities.set('high-risk-area', highRiskArea);

        // 中风险区域
        const mediumRiskArea = this.viewer.entities.add({
            id: 'medium-risk-area',
            name: '中风险区域',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    103.9000, 30.4000,
                    104.0000, 30.4000,
                    104.0000, 30.5000,
                    103.9000, 30.5000
                ]),
                height: 0,
                extrudedHeight: 300,
                material: Cesium.Color.ORANGE.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.ORANGE
            }
        });
        
        this.entities.set('medium-risk-area', mediumRiskArea);
    }

    /**
     * 创建城市图标
     */
    createCityIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // 绘制城市图标
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏙️', 32, 40);
        
        return canvas;
    }

    /**
     * 创建监测点描述
     */
    createPointDescription(point) {
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 10px;">
                <h3 style="color: #00D4FF; margin-top: 0; border-bottom: 1px solid #00D4FF; padding-bottom: 5px;">${point.name}</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 3px 0;"><strong>设备ID:</strong></td><td>${point.id}</td></tr>
                    <tr><td style="padding: 3px 0;"><strong>当前状态:</strong></td><td><span style="color: ${this.getStatusColor(point.status)}; font-weight: bold;">${this.getStatusName(point.status)}</span></td></tr>
                    <tr><td style="padding: 3px 0;"><strong>监测数值:</strong></td><td>${point.value}</td></tr>
                    <tr><td style="padding: 3px 0;"><strong>经纬度:</strong></td><td>${point.lon.toFixed(4)}°E, ${point.lat.toFixed(4)}°N</td></tr>
                    <tr><td style="padding: 3px 0;"><strong>更新时间:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                </table>
            </div>
        `;
    }

    /**
     * 获取状态颜色
     */
    getStatusColor(status) {
        const colors = {
            normal: '#00FF88',
            warning: '#FFD700',
            danger: '#FF4757',
            offline: '#666666'
        };
        return colors[status] || '#666666';
    }

    /**
     * 获取状态名称
     */
    getStatusName(status) {
        const names = {
            normal: '正常',
            warning: '预警',
            danger: '危险',
            offline: '离线'
        };
        return names[status] || '未知';
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 点击事件
        this.viewer.selectedEntityChanged.addEventListener((selectedEntity) => {
            if (selectedEntity && selectedEntity.id) {
                console.log('选中实体:', selectedEntity.id);
            }
        });

        // 相机移动事件
        this.viewer.camera.moveEnd.addEventListener(() => {
            console.log('相机移动结束');
        });
    }

    /**
     * 隐藏加载提示
     */
    hideLoading() {
        setTimeout(() => {
            const loadingEl = this.container.querySelector('.loading-3d');
            if (loadingEl) {
                loadingEl.style.opacity = '0';
                setTimeout(() => {
                    loadingEl.style.display = 'none';
                }, 500);
            }
        }, 2000);
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        const loadingEl = this.container.querySelector('.loading-3d');
        if (loadingEl) {
            const textEl = loadingEl.querySelector('.loading-text');
            const progressEl = loadingEl.querySelector('.progress-bar');
            if (textEl) textEl.textContent = `❌ ${message}`;
            if (progressEl) progressEl.style.display = 'none';
        }
    }

    /**
     * 飞行到指定位置
     */
    flyTo(longitude, latitude, height = 10000) {
        if (!this.viewer) return;
        
        return this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            duration: 2.0
        });
    }

    /**
     * 切换地形显示
     */
    async toggleTerrain(enabled) {
        if (!this.viewer) return;
        
        if (enabled) {
            try {
                this.viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
                    requestWaterMask: true,
                    requestVertexNormals: true
                });
                console.log('🏔️ 世界地形已启用');
            } catch (error) {
                console.warn('世界地形加载失败:', error);
                this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            }
        } else {
            this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            console.log('🌍 椭球体地形已启用');
        }
    }

    /**
     * 调整大小
     */
    resize() {
        if (this.viewer) {
            this.viewer.resize();
        }
    }

    /**
     * 销毁3D地球
     */
    destroy() {
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = null;
        }
        this.entities.clear();
        console.log('🌍 现代化Cesium 3D地球已销毁');
    }
}

// 导出到全局
window.ModernCesium3D = ModernCesium3D;
