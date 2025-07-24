// 地质灾害预警系统 - 数据分析页面脚本

// ========== 全局变量 ==========
let charts = {};
let currentFilters = {};
let updateInterval = null;

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 数据分析页面初始化...');

    // 初始化筛选器事件
    initializeFilters();

    // 初始化图表
    initializeCharts();

    // 设置自动更新
    startAutoUpdate();

    // 更新最后更新时间
    updateLastUpdateTime();

    console.log('✅ 数据分析页面初始化完成');
});

// ========== 初始化筛选器 ==========
function initializeFilters() {
    // 时间范围变化监听
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', function() {
        const customTimeRange = document.getElementById('customTimeRange');
        if (this.value === 'custom') {
            customTimeRange.style.display = 'block';
            setDefaultCustomTime();
        } else {
            customTimeRange.style.display = 'none';
        }
    });

    // 监测点选择变化监听
    const pointCheckboxes = document.querySelectorAll('#monitoringPoints input[type="checkbox"]');
    pointCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChartsData);
    });

    // 数据类型选择变化监听
    const typeCheckboxes = document.querySelectorAll('#dataTypes input[type="checkbox"]');
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChartsData);
    });

    // 数据质量选择变化监听
    const qualityRadios = document.querySelectorAll('#dataQuality input[type="radio"]');
    qualityRadios.forEach(radio => {
        radio.addEventListener('change', updateChartsData);
    });
}

// ========== 设置默认自定义时间 ==========
function setDefaultCustomTime() {
    const now = new Date();
    const endTime = new Date(now);
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24小时前

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

// ========== 初始化图表 ==========
function initializeCharts() {
    // 初始化实时数据折线图
    initLineChart();

    // 初始化设备状态饼图
    initPieChart();

    // 初始化预警统计柱状图
    initBarChart();

    // 初始化风险热力图
    initHeatmapChart();
}

// ========== 初始化折线图 ==========
function initLineChart() {
    const chartDom = document.getElementById('lineChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.lineChart = myChart;

    // 生成模拟时间数据
    const times = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    }

    const option = {
        title: {
            text: '监测数据趋势',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            data: ['位移', '降雨量', '土壤含水量'],
            textStyle: {
                color: '#99ccff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: times,
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '位移',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 0, 10),
                lineStyle: {
                    color: '#00ffff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 255, 0.05)' }
                        ]
                    }
                }
            },
            {
                name: '降雨量',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 0, 50),
                lineStyle: {
                    color: '#0099ff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 153, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 153, 255, 0.05)' }
                        ]
                    }
                }
            },
            {
                name: '土壤含水量',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 20, 80),
                lineStyle: {
                    color: '#00ff88'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 136, 0.05)' }
                        ]
                    }
                }
            }
        ]
    };

    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化饼图 ==========
function initPieChart() {
    const chartDom = document.getElementById('pieChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.pieChart = myChart;

    const option = {
        title: {
            text: '设备状态分布',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#99ccff'
            }
        },
        series: [
            {
                name: '设备状态',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 85, name: '正常设备', itemStyle: { color: '#00ff88' } },
                    { value: 8, name: '异常设备', itemStyle: { color: '#ff4444' } },
                    { value: 5, name: '离线设备', itemStyle: { color: '#666666' } },
                    { value: 2, name: '维护设备', itemStyle: { color: '#ffaa00' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                },
                label: {
                    color: '#ccddff'
                }
            }
        ]
    };

    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化柱状图 ==========
function initBarChart() {
    const chartDom = document.getElementById('barChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.barChart = myChart;

    const option = {
        title: {
            text: '预警统计分析',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            data: ['蓝色预警', '黄色预警', '橙色预警', '红色预警'],
            textStyle: {
                color: '#99ccff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['滑坡', '泥石流', '崩塌', '地陷'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '蓝色预警',
                type: 'bar',
                stack: '预警',
                data: [5, 3, 2, 1],
                itemStyle: {
                    color: '#1890FF'
                }
            },
            {
                name: '黄色预警',
                type: 'bar',
                stack: '预警',
                data: [3, 4, 2, 2],
                itemStyle: {
                    color: '#FADB14'
                }
            },
            {
                name: '橙色预警',
                type: 'bar',
                stack: '预警',
                data: [2, 2, 1, 1],
                itemStyle: {
                    color: '#FA8C16'
                }
            },
            {
                name: '红色预警',
                type: 'bar',
                stack: '预警',
                data: [1, 1, 0, 0],
                itemStyle: {
                    color: '#FF4D4F'
                }
            }
        ]
    };

    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化热力图 ==========
function initHeatmapChart() {
    const chartDom = document.getElementById('heatmapChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.heatmapChart = myChart;

    // 生成热力图数据
    const data = [];
    const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < hours.length; j++) {
            data.push([j, i, Math.round(Math.random() * 100)]);
        }
    }

    const option = {
        title: {
            text: '区域风险热力图',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            position: 'top',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'category',
            data: days,
            splitArea: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            textStyle: {
                color: '#99ccff'
            },
            inRange: {
                color: ['#00ff88', '#ffaa00', '#ff4444']
            }
        },
        series: [
            {
                name: '风险值',
                type: 'heatmap',
                data: data,
                label: {
                    show: true,
                    color: '#000'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                }
            }
        ]
    };

    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 生成随机数据 ==========
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.round(Math.random() * (max - min) + min));
    }
    return data;
}

// ========== 应用筛选器 ==========
function applyFilters() {
    // 收集筛选条件
    const selectedPoints = Array.from(document.querySelectorAll('#monitoringPoints input:checked')).map(cb => cb.value);
    const selectedTypes = Array.from(document.querySelectorAll('#dataTypes input:checked')).map(cb => cb.value);
    const timeRange = document.getElementById('timeRange').value;
    const quality = document.querySelector('#dataQuality input:checked').value;

    currentFilters = {
        points: selectedPoints,
        types: selectedTypes,
        timeRange: timeRange,
        quality: quality
    };

    // 更新图表数据
    updateChartsData();

    showToast('success', '筛选条件已应用');
}

// ========== 重置筛选器 ==========
function resetFilters() {
    // 重置监测点选择
    document.querySelectorAll('#monitoringPoints input[type="checkbox"]').forEach((cb, index) => {
        cb.checked = index < 2; // 默认选中前两个
    });

    // 重置数据类型选择
    document.querySelectorAll('#dataTypes input[type="checkbox"]').forEach((cb, index) => {
        cb.checked = index < 2; // 默认选中前两个
    });

    // 重置时间范围
    document.getElementById('timeRange').value = '1d';
    document.getElementById('customTimeRange').style.display = 'none';

    // 重置数据质量
    document.querySelector('#dataQuality input[value="all"]').checked = true;

    // 清空筛选条件
    currentFilters = {};

    // 更新图表数据
    updateChartsData();

    showToast('info', '筛选条件已重置');
}

// ========== 更新图表数据 ==========
function updateChartsData() {
    // 这里可以根据筛选条件重新生成数据
    // 为了演示，我们只是重新设置一些随机数据

    // 更新折线图
    if (charts.lineChart) {
        const option = charts.lineChart.getOption();
        option.series[0].data = generateRandomData(24, 0, 10);
        option.series[1].data = generateRandomData(24, 0, 50);
        option.series[2].data = generateRandomData(24, 20, 80);
        charts.lineChart.setOption(option);
    }

    // 更新饼图
    if (charts.pieChart) {
        const option = charts.pieChart.getOption();
        const total = 100;
        const normal = Math.round(Math.random() * 20 + 80);
        const abnormal = Math.round(Math.random() * 10 + 5);
        const offline = Math.round(Math.random() * 8 + 2);
        const maintenance = total - normal - abnormal - offline;

        option.series[0].data = [
            { value: normal, name: '正常设备' },
            { value: abnormal, name: '异常设备' },
            { value: offline, name: '离线设备' },
            { value: maintenance, name: '维护设备' }
        ];
        charts.pieChart.setOption(option);
    }

    console.log('📊 图表数据已更新');
}

// ========== 刷新图表 ==========
function refreshChart(chartId) {
    if (charts[chartId]) {
        updateChartsData();
        showToast('success', '图表数据已刷新');
    }
}

// ========== 全屏显示图表 ==========
function fullscreenChart(chartId) {
    const sourceChart = charts[chartId];
    if (!sourceChart) return;

    // 获取原图表配置
    const option = sourceChart.getOption();

    // 显示模态框
    document.getElementById('chartModal').style.display = 'block';

    // 设置标题
    const titles = {
        'lineChart': '实时监测数据趋势',
        'pieChart': '设备状态分布',
        'barChart': '预警统计分析',
        'heatmapChart': '区域风险热力图'
    };
    document.getElementById('modalChartTitle').textContent = titles[chartId] || '图表详情';

    // 初始化全屏图表
    setTimeout(() => {
        const modalChartDom = document.getElementById('modalChart');
        const modalChart = echarts.init(modalChartDom, 'dark');
        modalChart.setOption(option);

        // 保存引用以便关闭时销毁
        window.modalChart = modalChart;

        // 响应式调整
        const resizeHandler = () => modalChart.resize();
        window.addEventListener('resize', resizeHandler);
        window.modalChartResizeHandler = resizeHandler;
    }, 100);
}

// ========== 关闭全屏图表 ==========
function closeChartModal() {
    document.getElementById('chartModal').style.display = 'none';

    // 销毁全屏图表
    if (window.modalChart) {
        window.modalChart.dispose();
        window.modalChart = null;
    }

    // 移除事件监听
    if (window.modalChartResizeHandler) {
        window.removeEventListener('resize', window.modalChartResizeHandler);
        window.modalChartResizeHandler = null;
    }
}

// ========== 导出数据 ==========
function exportData() {
    showToast('info', '正在生成报告...');

    // 模拟导出过程
    setTimeout(() => {
        showToast('success', '数据报告已导出');
    }, 2000);
}

// ========== 导出筛选数据 ==========
function exportFilteredData() {
    if (Object.keys(currentFilters).length === 0) {
        showToast('warning', '请先应用筛选条件');
        return;
    }

    showToast('info', '正在导出筛选数据...');

    // 模拟导出过程
    setTimeout(() => {
        showToast('success', '筛选数据已导出');
    }, 1500);
}

// ========== 开始自动更新 ==========
function startAutoUpdate() {
    updateInterval = setInterval(() => {
        updateChartsData();
        updateLastUpdateTime();
        updateOverviewCards();
    }, 30000); // 30秒更新一次
}

// ========== 停止自动更新 ==========
function stopAutoUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// ========== 更新最后更新时间 ==========
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdateTime').textContent = timeString;
}

// ========== 更新概览卡片 ==========
function updateOverviewCards() {
    // 模拟数据更新
    const onlineRate = (Math.random() * 5 + 95).toFixed(1);
    const integrityRate = (Math.random() * 10 + 90).toFixed(1);
    const abnormalRate = (Math.random() * 3 + 1).toFixed(1);

    document.getElementById('onlineDevices').textContent = onlineRate + '%';
    document.getElementById('dataIntegrity').textContent = integrityRate + '%';
    document.getElementById('abnormalData').textContent = abnormalRate + '%';
}

// ========== 全屏切换 ==========
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
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
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== 事件监听 ==========

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('chartModal');
    if (event.target === modal) {
        closeChartModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeChartModal();
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    stopAutoUpdate();

    // 销毁所有图表
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.dispose();
        }
    });
});

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 数据分析页面初始化...');
    
    // 初始化筛选器事件
    initializeFilters();
    
    // 初始化图表
    initializeCharts();
    
    // 设置自动更新
    startAutoUpdate();
    
    // 更新最后更新时间
    updateLastUpdateTime();
    
    console.log('✅ 数据分析页面初始化完成');
});

// ========== 初始化筛选器 ==========
function initializeFilters() {
    // 时间范围变化监听
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', function() {
        const customTimeRange = document.getElementById('customTimeRange');
        if (this.value === 'custom') {
            customTimeRange.style.display = 'block';
            setDefaultCustomTime();
        } else {
            customTimeRange.style.display = 'none';
        }
    });
    
    // 监测点选择变化监听
    const pointCheckboxes = document.querySelectorAll('#monitoringPoints input[type="checkbox"]');
    pointCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChartsData);
    });
    
    // 数据类型选择变化监听
    const typeCheckboxes = document.querySelectorAll('#dataTypes input[type="checkbox"]');
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChartsData);
    });
    
    // 数据质量选择变化监听
    const qualityRadios = document.querySelectorAll('#dataQuality input[type="radio"]');
    qualityRadios.forEach(radio => {
        radio.addEventListener('change', updateChartsData);
    });
}

// ========== 设置默认自定义时间 ==========
function setDefaultCustomTime() {
    const now = new Date();
    const endTime = new Date(now);
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24小时前
    
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

// ========== 初始化图表 ==========
function initializeCharts() {
    // 初始化实时数据折线图
    initLineChart();
    
    // 初始化设备状态饼图
    initPieChart();
    
    // 初始化预警统计柱状图
    initBarChart();
    
    // 初始化风险热力图
    initHeatmapChart();
}

// ========== 初始化折线图 ==========
function initLineChart() {
    const chartDom = document.getElementById('lineChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.lineChart = myChart;
    
    // 生成模拟时间数据
    const times = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    }
    
    const option = {
        title: {
            text: '监测数据趋势',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            data: ['位移', '降雨量', '土壤含水量'],
            textStyle: {
                color: '#99ccff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: times,
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '位移',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 0, 10),
                lineStyle: {
                    color: '#00ffff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 255, 0.05)' }
                        ]
                    }
                }
            },
            {
                name: '降雨量',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 0, 50),
                lineStyle: {
                    color: '#0099ff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 153, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 153, 255, 0.05)' }
                        ]
                    }
                }
            },
            {
                name: '土壤含水量',
                type: 'line',
                smooth: true,
                data: generateRandomData(24, 20, 80),
                lineStyle: {
                    color: '#00ff88'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 136, 0.05)' }
                        ]
                    }
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化饼图 ==========
function initPieChart() {
    const chartDom = document.getElementById('pieChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.pieChart = myChart;
    
    const option = {
        title: {
            text: '设备状态分布',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#99ccff'
            }
        },
        series: [
            {
                name: '设备状态',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 85, name: '正常设备', itemStyle: { color: '#00ff88' } },
                    { value: 8, name: '异常设备', itemStyle: { color: '#ff4444' } },
                    { value: 5, name: '离线设备', itemStyle: { color: '#666666' } },
                    { value: 2, name: '维护设备', itemStyle: { color: '#ffaa00' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                },
                label: {
                    color: '#ccddff'
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化柱状图 ==========
function initBarChart() {
    const chartDom = document.getElementById('barChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.barChart = myChart;
    
    const option = {
        title: {
            text: '预警统计分析',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        legend: {
            data: ['蓝色预警', '黄色预警', '橙色预警', '红色预警'],
            textStyle: {
                color: '#99ccff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['滑坡', '泥石流', '崩塌', '地陷'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '蓝色预警',
                type: 'bar',
                stack: '预警',
                data: [5, 3, 2, 1],
                itemStyle: {
                    color: '#1890FF'
                }
            },
            {
                name: '黄色预警',
                type: 'bar',
                stack: '预警',
                data: [3, 4, 2, 2],
                itemStyle: {
                    color: '#FADB14'
                }
            },
            {
                name: '橙色预警',
                type: 'bar',
                stack: '预警',
                data: [2, 2, 1, 1],
                itemStyle: {
                    color: '#FA8C16'
                }
            },
            {
                name: '红色预警',
                type: 'bar',
                stack: '预警',
                data: [1, 1, 0, 0],
                itemStyle: {
                    color: '#FF4D4F'
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 初始化热力图 ==========
function initHeatmapChart() {
    const chartDom = document.getElementById('heatmapChart');
    const myChart = echarts.init(chartDom, 'dark');
    charts.heatmapChart = myChart;
    
    // 生成热力图数据
    const data = [];
    const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < hours.length; j++) {
            data.push([j, i, Math.round(Math.random() * 100)]);
        }
    }
    
    const option = {
        title: {
            text: '区域风险热力图',
            textStyle: {
                color: '#00ffff',
                fontSize: 14
            }
        },
        tooltip: {
            position: 'top',
            backgroundColor: 'rgba(0, 25, 50, 0.9)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            textStyle: {
                color: '#ccddff'
            }
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        yAxis: {
            type: 'category',
            data: days,
            splitArea: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#99ccff'
            }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            textStyle: {
                color: '#99ccff'
            },
            inRange: {
                color: ['#00ff88', '#ffaa00', '#ff4444']
            }
        },
        series: [
            {
                name: '风险值',
                type: 'heatmap',
                data: data,
                label: {
                    show: true,
                    color: '#000'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// ========== 生成随机数据 ==========
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.round(Math.random() * (max - min) + min));
    }
    return data;
}

// ========== 应用筛选器 ==========
function applyFilters() {
    // 收集筛选条件
    const selectedPoints = Array.from(document.querySelectorAll('#monitoringPoints input:checked')).map(cb => cb.value);
    const selectedTypes = Array.from(document.querySelectorAll('#dataTypes input:checked')).map(cb => cb.value);
    const timeRange = document.getElementById('timeRange').value;
    const quality = document.querySelector('#dataQuality input:checked').value;
    
    currentFilters = {
        points: selectedPoints,
        types: selectedTypes,
        timeRange: timeRange,
        quality: quality
    };
    
    // 更新图表数据
    updateChartsData();
    
    showToast('success', '筛选条件已应用');
}

// ========== 重置筛选器 ==========
function resetFilters() {
    // 重置监测点选择
    document.querySelectorAll('#monitoringPoints input[type="checkbox"]').forEach((cb, index) => {
        cb.checked = index < 2; // 默认选中前两个
    });
    
    // 重置数据类型选择
    document.querySelectorAll('#dataTypes input[type="checkbox"]').forEach((cb, index) => {
        cb.checked = index < 2; // 默认选中前两个
    });
    
    // 重置时间范围
    document.getElementById('timeRange').value = '1d';
    document.getElementById('customTimeRange').style.display = 'none';
    
    // 重置数据质量
    document.querySelector('#dataQuality input[value="all"]').checked = true;
    
    // 清空筛选条件
    currentFilters = {};
    
    // 更新图表数据
    updateChartsData();
    
    showToast('info', '筛选条件已重置');
}

// ========== 更新图表数据 ==========
function updateChartsData() {
    // 这里可以根据筛选条件重新生成数据
    // 为了演示，我们只是重新设置一些随机数据
    
    // 更新折线图
    if (charts.lineChart) {
        const option = charts.lineChart.getOption();
        option.series[0].data = generateRandomData(24, 0, 10);
        option.series[1].data = generateRandomData(24, 0, 50);
        option.series[2].data = generateRandomData(24, 20, 80);
        charts.lineChart.setOption(option);
    }
    
    // 更新饼图
    if (charts.pieChart) {
        const option = charts.pieChart.getOption();
        const total = 100;
        const normal = Math.round(Math.random() * 20 + 80);
        const abnormal = Math.round(Math.random() * 10 + 5);
        const offline = Math.round(Math.random() * 8 + 2);
        const maintenance = total - normal - abnormal - offline;
        
        option.series[0].data = [
            { value: normal, name: '正常设备' },
            { value: abnormal, name: '异常设备' },
            { value: offline, name: '离线设备' },
            { value: maintenance, name: '维护设备' }
        ];
        charts.pieChart.setOption(option);
    }
    
    console.log('📊 图表数据已更新');
}

// ========== 刷新图表 ==========
function refreshChart(chartId) {
    if (charts[chartId]) {
        updateChartsData();
        showToast('success', '图表数据已刷新');
    }
}

// ========== 全屏显示图表 ==========
function fullscreenChart(chartId) {
    const sourceChart = charts[chartId];
    if (!sourceChart) return;
    
    // 获取原图表配置
    const option = sourceChart.getOption();
    
    // 显示模态框
    document.getElementById('chartModal').style.display = 'block';
    
    // 设置标题
    const titles = {
        'lineChart': '实时监测数据趋势',
        'pieChart': '设备状态分布',
        'barChart': '预警统计分析',
        'heatmapChart': '区域风险热力图'
    };
    document.getElementById('modalChartTitle').textContent = titles[chartId] || '图表详情';
    
    // 初始化全屏图表
    setTimeout(() => {
        const modalChartDom = document.getElementById('modalChart');
        const modalChart = echarts.init(modalChartDom, 'dark');
        modalChart.setOption(option);
        
        // 保存引用以便关闭时销毁
        window.modalChart = modalChart;
        
        // 响应式调整
        const resizeHandler = () => modalChart.resize();
        window.addEventListener('resize', resizeHandler);
        window.modalChartResizeHandler = resizeHandler;
    }, 100);
}

// ========== 关闭全屏图表 ==========
function closeChartModal() {
    document.getElementById('chartModal').style.display = 'none';
    
    // 销毁全屏图表
    if (window.modalChart) {
        window.modalChart.dispose();
        window.modalChart = null;
    }
    
    // 移除事件监听
    if (window.modalChartResizeHandler) {
        window.removeEventListener('resize', window.modalChartResizeHandler);
        window.modalChartResizeHandler = null;
    }
}

// ========== 导出数据 ==========
function exportData() {
    showToast('info', '正在生成报告...');
    
    // 模拟导出过程
    setTimeout(() => {
        showToast('success', '数据报告已导出');
    }, 2000);
}

// ========== 导出筛选数据 ==========
function exportFilteredData() {
    if (Object.keys(currentFilters).length === 0) {
        showToast('warning', '请先应用筛选条件');
        return;
    }
    
    showToast('info', '正在导出筛选数据...');
    
    // 模拟导出过程
    setTimeout(() => {
        showToast('success', '筛选数据已导出');
    }, 1500);
}

// ========== 开始自动更新 ==========
function startAutoUpdate() {
    updateInterval = setInterval(() => {
        updateChartsData();
        updateLastUpdateTime();
        updateOverviewCards();
    }, 30000); // 30秒更新一次
}

// ========== 停止自动更新 ==========
function stopAutoUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// ========== 更新最后更新时间 ==========
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdateTime').textContent = timeString;
}

// ========== 更新概览卡片 ==========
function updateOverviewCards() {
    // 模拟数据更新
    const onlineRate = (Math.random() * 5 + 95).toFixed(1);
    const integrityRate = (Math.random() * 10 + 90).toFixed(1);
    const abnormalRate = (Math.random() * 3 + 1).toFixed(1);
    
    document.getElementById('onlineDevices').textContent = onlineRate + '%';
    document.getElementById('dataIntegrity').textContent = integrityRate + '%';
    document.getElementById('abnormalData').textContent = abnormalRate + '%';
}

// ========== 全屏切换 ==========
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
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
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== 事件监听 ==========

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('chartModal');
    if (event.target === modal) {
        closeChartModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeChartModal();
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    stopAutoUpdate();
    
    // 销毁所有图表
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.dispose();
        }
    });
});
