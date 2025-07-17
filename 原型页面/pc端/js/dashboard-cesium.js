/**
 * 地质灾害预警系统 - 3D地球监控大屏脚本
 * 基于现代化CesiumJS实现
 */

class CesiumDashboardController {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.cesium3D = null;
        this.init();
    }

    /**
     * 初始化大屏
     */
    init() {
        this.initTime();
        this.initCharts();
        this.initCesium3D();
        this.initEventListeners();
        this.startRealTimeUpdate();
        this.initAnimations();
        
        // 延迟调整图表大小，确保容器已完全渲染
        setTimeout(() => {
            this.handleResize();
        }, 500);
        
        console.log('🌍 3D地球监控大屏已启动');
    }

    /**
     * 初始化时间显示
     */
    initTime() {
        this.updateTime();
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    /**
     * 更新时间显示
     */
    updateTime() {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        const updateTimeEl = document.getElementById('updateTime');
        
        if (timeEl) {
            timeEl.textContent = Utils.formatTime(now, 'YYYY年MM月DD日 HH:mm:ss');
        }
        
        if (updateTimeEl) {
            updateTimeEl.textContent = Utils.formatTime(now, 'YYYY-MM-DD HH:mm:ss');
        }
    }

    /**
     * 初始化图表
     */
    initCharts() {
        this.initRealtimeChart();
        this.initWarningChart();
    }

    /**
     * 初始化实时数据图表
     */
    initRealtimeChart() {
        const chartEl = document.getElementById('realtimeChart');
        if (!chartEl) return;

        this.charts.realtime = echarts.init(chartEl);
        
        const option = {
            backgroundColor: 'transparent',
            grid: {
                left: '10%',
                right: '10%',
                top: '15%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: Array.from({length: 24}, (_, i) => `${String(i).padStart(2, '0')}:00`),
                axisLine: { lineStyle: { color: '#2A3441' } },
                axisLabel: { color: '#B8C5D6', fontSize: 10 },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#2A3441' } },
                axisLabel: { color: '#B8C5D6', fontSize: 10 },
                splitLine: {
                    lineStyle: {
                        color: '#2A3441',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '位移',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: { color: '#00D4FF', width: 2 },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                                { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
                            ]
                        }
                    },
                    data: MockData.generateHistoricalData(1, '位移监测仪').slice(-24).map(d => d.value.toFixed(2))
                },
                {
                    name: '降雨量',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: { color: '#00FF88', width: 2 },
                    data: MockData.generateHistoricalData(1, '雨量计').slice(-24).map(d => d.value.toFixed(1))
                }
            ],
            legend: {
                data: ['位移', '降雨量'],
                textStyle: { color: '#B8C5D6' },
                top: 10
            }
        };

        this.charts.realtime.setOption(option);
        console.log('📈 实时数据图表已初始化');
    }

    /**
     * 初始化预警统计图表
     */
    initWarningChart() {
        const chartEl = document.getElementById('warningChart');
        if (!chartEl) return;

        this.charts.warning = echarts.init(chartEl);
        
        const option = {
            backgroundColor: 'transparent',
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: [
                    { value: 2, name: '红色预警', itemStyle: { color: '#FF4757' } },
                    { value: 5, name: '橙色预警', itemStyle: { color: '#FF8C00' } },
                    { value: 8, name: '黄色预警', itemStyle: { color: '#FFD700' } },
                    { value: 3, name: '蓝色预警', itemStyle: { color: '#00D4FF' } }
                ],
                label: {
                    color: '#FFFFFF',
                    fontSize: 12
                },
                labelLine: {
                    lineStyle: { color: '#FFFFFF' }
                }
            }],
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center',
                textStyle: { color: '#B8C5D6', fontSize: 12 },
                itemGap: 15
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#2A3441',
                textStyle: { color: '#FFFFFF' }
            }
        };

        this.charts.warning.setOption(option);
        console.log('📊 预警统计图表已初始化');
    }

    /**
     * 初始化现代化Cesium 3D地球
     */
    initCesium3D() {
        const container = document.getElementById('cesiumContainer');
        if (!container) {
            console.warn('3D容器不存在');
            return;
        }

        try {
            // 使用现代化Cesium3D类
            if (typeof ModernCesium3D !== 'undefined') {
                this.cesium3D = new ModernCesium3D(container);
                console.log('🌍 现代化Cesium 3D地球模块已加载');
            } else {
                throw new Error('ModernCesium3D类未定义');
            }
        } catch (error) {
            console.error('Cesium 3D地球初始化失败:', error);
            this.showCesiumError(error.message);
        }
    }

    /**
     * 显示Cesium错误
     */
    showCesiumError(message) {
        const container = document.getElementById('cesiumContainer');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #FF4757; text-align: center;">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                        <div style="font-size: 18px; margin-bottom: 10px;">3D地球加载失败</div>
                        <div style="font-size: 14px; color: #B8C5D6;">${message}</div>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #00D4FF; color: white; border: none; border-radius: 4px; cursor: pointer;">重新加载</button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        // 3D控制按钮事件
        this.setupCesiumControls();

        // 设备项点击事件
        document.querySelectorAll('.device-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.showDeviceDetails(e.currentTarget);
            });
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    /**
     * 设置Cesium控制按钮
     */
    setupCesiumControls() {
        // 回到成都按钮
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                if (this.cesium3D) {
                    this.cesium3D.flyTo(104.0668, 30.5728, 50000);
                }
            });
        }

        // 地形切换按钮
        const terrainBtn = document.getElementById('terrainBtn');
        if (terrainBtn) {
            let terrainEnabled = true;
            terrainBtn.addEventListener('click', () => {
                if (this.cesium3D) {
                    terrainEnabled = !terrainEnabled;
                    this.cesium3D.toggleTerrain(terrainEnabled);
                    terrainBtn.textContent = terrainEnabled ? '🏔️ 关闭地形' : '🏔️ 开启地形';
                    terrainBtn.classList.toggle('active', terrainEnabled);
                }
            });
        }

        // 监测点显示按钮
        const layerBtn = document.getElementById('layerBtn');
        if (layerBtn) {
            layerBtn.addEventListener('click', () => {
                layerBtn.classList.toggle('active');
                console.log('切换监测点显示');
            });
        }

        // 预警区域显示按钮
        const warningBtn = document.getElementById('warningBtn');
        if (warningBtn) {
            warningBtn.addEventListener('click', () => {
                warningBtn.classList.toggle('active');
                console.log('切换预警区域显示');
            });
        }
    }

    /**
     * 开始实时数据更新
     */
    startRealTimeUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateKPIData();
            this.updateChartData();
            this.updateDeviceList();
            this.updateWeatherData();
        }, 5000); // 每5秒更新一次
    }

    /**
     * 更新KPI数据
     */
    updateKPIData() {
        // 模拟KPI数据更新
        console.log('📊 KPI数据已更新');
    }

    /**
     * 更新图表数据
     */
    updateChartData() {
        // 模拟图表数据更新
        console.log('📈 图表数据已更新');
    }

    /**
     * 更新设备列表
     */
    updateDeviceList() {
        // 模拟设备列表更新
        console.log('📱 设备列表已更新');
    }

    /**
     * 更新天气数据
     */
    updateWeatherData() {
        const weatherData = MockData.generateWeatherData();
        
        // 更新天气显示
        const weatherItems = document.querySelectorAll('.weather-item');
        if (weatherItems.length >= 4) {
            weatherItems[0].querySelector('.weather-value').textContent = `${weatherData.temperature}°C`;
            weatherItems[1].querySelector('.weather-value').textContent = `${weatherData.humidity}%`;
            weatherItems[2].querySelector('.weather-value').textContent = `${weatherData.rainfall.toFixed(1)}mm/h`;
            weatherItems[3].querySelector('.weather-value').textContent = `${weatherData.windSpeed.toFixed(1)}m/s`;
        }
        
        console.log('🌤️ 天气数据已更新');
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 重新调整图表大小
        Object.values(this.charts).forEach((chart, index) => {
            if (chart && chart.resize) {
                setTimeout(() => {
                    chart.resize();
                    console.log(`图表 ${index} 已调整大小`);
                }, 100);
            }
        });

        // 调整Cesium大小
        if (this.cesium3D && this.cesium3D.resize) {
            this.cesium3D.resize();
        }
    }

    /**
     * 处理键盘事件
     */
    handleKeyboard(e) {
        if (!this.cesium3D) return;

        switch (e.key.toLowerCase()) {
            case 'h':
                // H键 - 回到成都
                this.cesium3D.flyTo(104.0668, 30.5728, 50000);
                console.log('🏠 已飞回成都地区');
                break;
                
            case 't':
                // T键 - 切换地形
                const terrainBtn = document.getElementById('terrainBtn');
                if (terrainBtn) {
                    terrainBtn.click();
                }
                break;
                
            case 'l':
                // L键 - 切换监测点
                const layerBtn = document.getElementById('layerBtn');
                if (layerBtn) {
                    layerBtn.click();
                }
                break;
                
            case 'w':
                // W键 - 切换预警区域
                const warningBtn = document.getElementById('warningBtn');
                if (warningBtn) {
                    warningBtn.click();
                }
                break;
                
            case 'f11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    /**
     * 切换全屏
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * 初始化动画
     */
    initAnimations() {
        // 添加页面加载动画
        console.log('🎬 动画已初始化');
    }

    /**
     * 显示设备详情
     */
    showDeviceDetails(device) {
        const deviceName = device.querySelector('.device-name').textContent;
        const deviceId = device.querySelector('.device-id').textContent;
        console.log('显示设备详情:', deviceName, deviceId);
        
        // 如果有对应的3D实体，飞行到该位置
        if (this.cesium3D && this.cesium3D.entities.has(deviceId)) {
            // 这里可以添加飞行到设备位置的逻辑
            console.log('飞行到设备位置:', deviceId);
        }
    }

    /**
     * 销毁大屏
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.dispose) {
                chart.dispose();
            }
        });
        
        if (this.cesium3D && this.cesium3D.destroy) {
            this.cesium3D.destroy();
        }
        
        console.log('🌍 3D地球监控大屏已关闭');
    }
}

// 页面加载完成后初始化大屏
document.addEventListener('DOMContentLoaded', () => {
    window.cesiumDashboard = new CesiumDashboardController();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.cesiumDashboard) {
        window.cesiumDashboard.destroy();
    }
});

// 导出到全局
window.CesiumDashboardController = CesiumDashboardController;
