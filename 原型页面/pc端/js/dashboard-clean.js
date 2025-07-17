/**
 * 地质灾害预警系统 - 监控大屏脚本（无地图版本）
 */

class DashboardController {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.init();
    }

    /**
     * 初始化大屏
     */
    init() {
        this.initTime();
        this.initCharts();
        this.initEventListeners();
        this.startRealTimeUpdate();
        this.initAnimations();
        
        // 延迟调整图表大小，确保容器已完全渲染
        setTimeout(() => {
            this.handleResize();
        }, 500);
        
        console.log('🌍 地质灾害预警系统监控大屏已启动');
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
     * 初始化事件监听器
     */
    initEventListeners() {
        // 监测点点击事件
        document.querySelectorAll('.monitoring-point').forEach(point => {
            point.addEventListener('click', (e) => {
                this.showPointDetails(e.target);
            });
        });

        // 预警项点击事件
        document.querySelectorAll('.warning-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.showWarningDetails(e.currentTarget);
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
     * 开始实时数据更新
     */
    startRealTimeUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateKPIData();
            this.updateChartData();
            this.updateWarningList();
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
     * 更新预警列表
     */
    updateWarningList() {
        // 模拟预警列表更新
        console.log('📢 预警列表已更新');
    }

    /**
     * 更新天气数据
     */
    updateWeatherData() {
        const weatherData = MockData.generateWeatherData();
        
        // 更新天气显示
        const weatherItems = document.querySelectorAll('.weather-item');
        if (weatherItems.length >= 6) {
            weatherItems[0].querySelector('.weather-value').textContent = `${weatherData.temperature}°C`;
            weatherItems[1].querySelector('.weather-value').textContent = `${weatherData.humidity}%`;
            weatherItems[2].querySelector('.weather-value').textContent = `${weatherData.rainfall.toFixed(1)}mm/h`;
            weatherItems[3].querySelector('.weather-value').textContent = `${weatherData.windSpeed.toFixed(1)}m/s`;
            weatherItems[4].querySelector('.weather-value').textContent = `${weatherData.pressure}hPa`;
            weatherItems[5].querySelector('.weather-value').textContent = `${weatherData.visibility}km`;
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
    }

    /**
     * 处理键盘事件
     */
    handleKeyboard(e) {
        switch (e.key) {
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
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
     * 显示监测点详情
     */
    showPointDetails(point) {
        console.log('显示监测点详情:', point.dataset.name);
    }

    /**
     * 显示预警详情
     */
    showWarningDetails(item) {
        console.log('显示预警详情');
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
        
        console.log('🌍 监控大屏已关闭');
    }
}

// 页面加载完成后初始化大屏
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardController();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});

// 导出到全局
window.DashboardController = DashboardController;
