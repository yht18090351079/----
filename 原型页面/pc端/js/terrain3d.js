/**
 * 3D地形模块 - 使用ES模块
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Terrain3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.rainParticles = null;
        this.animationId = null;
        
        this.init();
    }

    /**
     * 初始化3D场景
     */
    init() {
        if (!this.container) {
            console.warn('3D容器不存在');
            return;
        }

        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        // 创建相机
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 50, 100);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 200;

        // 创建地形
        this.createTerrain();
        
        // 添加光照
        this.addLighting();
        
        // 添加监测点3D标记
        this.add3DMonitoringPoints();
        
        // 添加预警区域3D标记
        this.add3DWarningAreas();
        
        // 添加天气效果
        this.addWeatherEffects();
        
        // 开始渲染循环
        this.animate();
        
        // 隐藏加载提示
        setTimeout(() => {
            const loadingEl = this.container.querySelector('.loading-3d');
            if (loadingEl) {
                loadingEl.style.opacity = '0';
                setTimeout(() => {
                    loadingEl.style.display = 'none';
                }, 500);
            }
        }, 2000);
        
        console.log('🏔️ 3D地形已初始化');
    }

    /**
     * 创建地形
     */
    createTerrain() {
        // 创建地形几何体
        const geometry = new THREE.PlaneGeometry(200, 200, 64, 64);
        
        // 生成高度图数据
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            
            // 使用噪声函数生成地形高度
            const height = this.generateTerrainHeight(x, y);
            vertices[i + 2] = height;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // 创建地形材质
        const material = new THREE.MeshLambertMaterial({
            color: 0x4a5568,
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });
        
        // 创建地形网格
        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        this.scene.add(terrain);
        
        // 添加地形网格线
        const wireframeGeometry = geometry.clone();
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframe.rotation.x = -Math.PI / 2;
        wireframe.position.y = 0.1;
        this.scene.add(wireframe);
    }

    /**
     * 生成地形高度
     */
    generateTerrainHeight(x, y) {
        // 简单的噪声函数生成地形
        const scale = 0.02;
        const amplitude = 15;
        
        const noise1 = Math.sin(x * scale) * Math.cos(y * scale);
        const noise2 = Math.sin(x * scale * 2) * Math.cos(y * scale * 2) * 0.5;
        const noise3 = Math.sin(x * scale * 4) * Math.cos(y * scale * 4) * 0.25;
        
        return (noise1 + noise2 + noise3) * amplitude;
    }

    /**
     * 添加光照
     */
    addLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.scene.add(directionalLight);
        
        // 点光源（模拟预警区域）
        const pointLight = new THREE.PointLight(0xff4757, 1, 100);
        pointLight.position.set(20, 20, 20);
        this.scene.add(pointLight);
    }

    /**
     * 添加3D监测点
     */
    add3DMonitoringPoints() {
        const monitoringPoints = [
            { x: -40, z: -30, status: 'normal', name: 'DEV001' },
            { x: 20, z: 10, status: 'warning', name: 'DEV002' },
            { x: -10, z: 40, status: 'danger', name: 'DEV003' },
            { x: 50, z: -20, status: 'normal', name: 'DEV004' },
            { x: -60, z: 60, status: 'offline', name: 'DEV005' }
        ];
        
        monitoringPoints.forEach(point => {
            this.create3DMonitoringPoint(point);
        });
    }

    /**
     * 创建3D监测点
     */
    create3DMonitoringPoint(pointData) {
        const { x, z, status, name } = pointData;
        
        // 获取地形高度
        const y = this.generateTerrainHeight(x, z) + 5;
        
        // 创建监测点几何体
        const geometry = new THREE.CylinderGeometry(2, 2, 8, 8);
        
        // 根据状态设置颜色
        const colors = {
            normal: 0x00ff88,
            warning: 0xffd700,
            danger: 0xff4757,
            offline: 0x666666
        };
        
        const material = new THREE.MeshLambertMaterial({
            color: colors[status] || 0x666666,
            emissive: colors[status] || 0x666666,
            emissiveIntensity: 0.3
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(x, y, z);
        cylinder.castShadow = true;
        cylinder.userData = { name, status, type: 'monitoring-point' };
        
        this.scene.add(cylinder);
        
        // 添加发光效果
        if (status !== 'offline') {
            const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: colors[status],
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(x, y + 2, z);
            this.scene.add(glow);
            
            // 添加动画
            glow.userData.animate = true;
        }
    }

    /**
     * 添加3D预警区域
     */
    add3DWarningAreas() {
        const warningAreas = [
            { x: 20, z: -10, size: 30, level: 'red', name: '高风险区域' },
            { x: -30, z: 40, size: 20, level: 'orange', name: '中风险区域' },
            { x: 60, z: 30, size: 25, level: 'yellow', name: '低风险区域' }
        ];
        
        warningAreas.forEach(area => {
            this.create3DWarningArea(area);
        });
    }

    /**
     * 创建3D预警区域
     */
    create3DWarningArea(areaData) {
        const { x, z, size, level, name } = areaData;
        
        // 获取地形高度
        const y = this.generateTerrainHeight(x, z) + 1;
        
        // 创建预警区域几何体（圆柱体）
        const geometry = new THREE.CylinderGeometry(size, size, 2, 32);
        
        // 根据预警等级设置颜色
        const colors = {
            red: 0xff4757,
            orange: 0xff8c00,
            yellow: 0xffd700,
            blue: 0x00d4ff
        };
        
        const material = new THREE.MeshLambertMaterial({
            color: colors[level] || 0x666666,
            transparent: true,
            opacity: 0.3,
            emissive: colors[level] || 0x666666,
            emissiveIntensity: 0.1
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(x, y, z);
        cylinder.userData = { name, level, type: 'warning-area' };
        
        this.scene.add(cylinder);
        
        // 添加边界线
        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: colors[level],
            transparent: true,
            opacity: 0.8
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.position.set(x, y, z);
        this.scene.add(edges);
        
        // 添加脉冲效果
        cylinder.userData.animate = true;
        cylinder.userData.pulseSpeed = 1 + Math.random();
    }

    /**
     * 添加天气效果
     */
    addWeatherEffects() {
        // 创建雨滴粒子系统
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 400;
            positions[i3 + 1] = Math.random() * 200 + 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 400;
            
            velocities[i3] = 0;
            velocities[i3 + 1] = -Math.random() * 2 - 1;
            velocities[i3 + 2] = 0;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.5,
            transparent: true,
            opacity: 0.6
        });
        
        this.rainParticles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.rainParticles);
    }

    /**
     * 动画循环
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // 更新控制器
        if (this.controls) {
            this.controls.update();
        }
        
        // 动画效果
        const time = Date.now() * 0.001;
        
        // 监测点发光动画和预警区域脉冲
        this.scene.traverse((object) => {
            if (object.userData.animate) {
                if (object.userData.type === 'warning-area') {
                    // 预警区域脉冲效果
                    const pulseSpeed = object.userData.pulseSpeed || 1;
                    object.scale.setScalar(1 + Math.sin(time * pulseSpeed) * 0.05);
                    object.material.opacity = 0.3 + Math.sin(time * pulseSpeed * 2) * 0.1;
                } else {
                    // 监测点发光效果
                    object.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
                    object.material.opacity = 0.3 + Math.sin(time * 3) * 0.2;
                }
            }
        });
        
        // 雨滴动画
        if (this.rainParticles) {
            const positions = this.rainParticles.geometry.attributes.position.array;
            const velocities = this.rainParticles.geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += velocities[i + 1];
                
                // 重置落到地面的雨滴
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 200;
                    positions[i] = (Math.random() - 0.5) * 400;
                    positions[i + 2] = (Math.random() - 0.5) * 400;
                }
            }
            
            this.rainParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // 渲染场景
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * 调整大小
     */
    resize() {
        if (!this.renderer || !this.camera || !this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * 销毁3D场景
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        if (this.scene) {
            this.scene.clear();
        }
        
        console.log('🏔️ 3D地形已销毁');
    }
}
