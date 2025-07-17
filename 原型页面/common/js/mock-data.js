/**
 * 地质灾害预警系统 - 模拟数据
 */

// 模拟数据生成器
window.MockData = {
    
    /**
     * 生成监测设备数据
     * @param {number} count - 设备数量
     * @returns {Array} 设备数据数组
     */
    generateDevices(count = 50) {
        const devices = [];
        const types = ['位移监测仪', '雨量计', '倾斜仪', '土壤含水量计', '地下水位计'];
        const locations = ['XX村', 'XX镇', 'XX县', 'XX乡', 'XX区', 'XX街道'];
        const statuses = ['normal', 'warning', 'danger', 'offline'];
        const statusWeights = [0.7, 0.15, 0.1, 0.05]; // 正常设备占70%
        
        for (let i = 1; i <= count; i++) {
            const deviceId = `DEV${String(i).padStart(3, '0')}`;
            const type = types[Math.floor(Math.random() * types.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const status = this.weightedRandom(statuses, statusWeights);
            
            devices.push({
                id: deviceId,
                name: `${location}${type}`,
                type: type,
                location: location,
                status: status,
                latitude: 30.5 + (Math.random() - 0.5) * 2, // 成都周边
                longitude: 104.0 + (Math.random() - 0.5) * 2,
                installDate: this.randomDate(new Date(2020, 0, 1), new Date()),
                lastUpdate: this.randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
                data: this.generateDeviceData(type, status)
            });
        }
        
        return devices;
    },

    /**
     * 生成设备数据
     * @param {string} type - 设备类型
     * @param {string} status - 设备状态
     * @returns {object} 设备数据
     */
    generateDeviceData(type, status) {
        const baseData = {
            位移监测仪: () => ({
                displacement: status === 'normal' ? Math.random() * 5 : 
                            status === 'warning' ? 5 + Math.random() * 10 :
                            status === 'danger' ? 15 + Math.random() * 20 : 0,
                unit: 'mm',
                threshold: { warning: 5, danger: 15 }
            }),
            雨量计: () => ({
                rainfall: status === 'normal' ? Math.random() * 10 : 
                         status === 'warning' ? 10 + Math.random() * 20 :
                         status === 'danger' ? 30 + Math.random() * 50 : 0,
                unit: 'mm/h',
                threshold: { warning: 10, danger: 30 }
            }),
            倾斜仪: () => ({
                inclination: status === 'normal' ? Math.random() * 2 : 
                           status === 'warning' ? 2 + Math.random() * 3 :
                           status === 'danger' ? 5 + Math.random() * 10 : 0,
                unit: '°',
                threshold: { warning: 2, danger: 5 }
            }),
            土壤含水量计: () => ({
                moisture: status === 'normal' ? 20 + Math.random() * 30 : 
                         status === 'warning' ? 50 + Math.random() * 20 :
                         status === 'danger' ? 70 + Math.random() * 30 : 0,
                unit: '%',
                threshold: { warning: 50, danger: 70 }
            }),
            地下水位计: () => ({
                waterLevel: status === 'normal' ? Math.random() * 5 : 
                           status === 'warning' ? 5 + Math.random() * 5 :
                           status === 'danger' ? 10 + Math.random() * 10 : 0,
                unit: 'm',
                threshold: { warning: 5, danger: 10 }
            })
        };
        
        return baseData[type] ? baseData[type]() : { value: 0, unit: '', threshold: {} };
    },

    /**
     * 生成预警数据
     * @param {number} count - 预警数量
     * @returns {Array} 预警数据数组
     */
    generateWarnings(count = 20) {
        const warnings = [];
        const types = ['滑坡', '泥石流', '崩塌', '地面塌陷', '地裂缝'];
        const levels = ['blue', 'yellow', 'orange', 'red'];
        const levelNames = ['蓝色', '黄色', '橙色', '红色'];
        const locations = ['XX村', 'XX镇', 'XX县', 'XX乡', 'XX区'];
        const statuses = ['active', 'processing', 'resolved', 'cancelled'];
        const statusNames = ['生效中', '处理中', '已解除', '已取消'];
        
        for (let i = 1; i <= count; i++) {
            const warningId = `W${String(i).padStart(3, '0')}`;
            const type = types[Math.floor(Math.random() * types.length)];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const publishTime = this.randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
            
            warnings.push({
                id: warningId,
                title: `${location}${type}${levelNames[levels.indexOf(level)]}预警`,
                type: type,
                level: level,
                levelName: levelNames[levels.indexOf(level)],
                location: location,
                status: status,
                statusName: statusNames[statuses.indexOf(status)],
                content: this.generateWarningContent(type, level, location),
                publishTime: publishTime,
                effectiveTime: new Date(publishTime.getTime() + 24 * 60 * 60 * 1000),
                publisher: '预警中心',
                affectedArea: this.generateAffectedArea(location),
                riskLevel: this.getRiskLevel(level),
                suggestions: this.getWarningSuggestions(type, level)
            });
        }
        
        return warnings.sort((a, b) => b.publishTime - a.publishTime);
    },

    /**
     * 生成预警内容
     * @param {string} type - 灾害类型
     * @param {string} level - 预警等级
     * @param {string} location - 位置
     * @returns {string} 预警内容
     */
    generateWarningContent(type, level, location) {
        const templates = {
            滑坡: {
                blue: `${location}地区地质条件较为稳定，但近期降雨较多，请注意观察地质变化。`,
                yellow: `${location}地区受降雨影响，发生滑坡的可能性增加，请加强监测。`,
                orange: `${location}地区降雨量较大，发生滑坡的风险较高，请做好防范准备。`,
                red: `${location}地区受持续强降雨影响，发生滑坡的风险极高，请立即组织人员撤离。`
            },
            泥石流: {
                blue: `${location}地区地质环境基本稳定，但需关注天气变化。`,
                yellow: `${location}地区降雨增多，可能引发泥石流，请提高警惕。`,
                orange: `${location}地区降雨量达到预警阈值，泥石流风险增加，请做好应急准备。`,
                red: `${location}地区强降雨持续，泥石流风险极高，请立即撤离危险区域。`
            },
            崩塌: {
                blue: `${location}地区岩体结构基本稳定，请定期检查。`,
                yellow: `${location}地区受降雨影响，岩体稳定性下降，请加强观测。`,
                orange: `${location}地区岩体出现松动迹象，崩塌风险增加，请限制通行。`,
                red: `${location}地区岩体严重松动，随时可能发生崩塌，请立即封闭道路。`
            }
        };
        
        return templates[type] ? templates[type][level] : `${location}地区发布${level}级地质灾害预警。`;
    },

    /**
     * 生成历史数据
     * @param {number} days - 天数
     * @param {string} deviceType - 设备类型
     * @returns {Array} 历史数据数组
     */
    generateHistoricalData(days = 30, deviceType = '位移监测仪') {
        const data = [];
        const now = new Date();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            
            // 每天生成24个小时的数据
            for (let hour = 0; hour < 24; hour++) {
                const timestamp = new Date(date.getTime() + hour * 60 * 60 * 1000);
                const baseValue = this.getBaseValue(deviceType);
                const noise = (Math.random() - 0.5) * baseValue * 0.2; // 20%的噪声
                const trend = Math.sin((i + hour / 24) * 0.1) * baseValue * 0.1; // 趋势变化
                
                data.push({
                    timestamp: timestamp,
                    value: Math.max(0, baseValue + noise + trend),
                    deviceType: deviceType,
                    quality: Math.random() > 0.05 ? 'good' : 'poor' // 95%的数据质量良好
                });
            }
        }
        
        return data;
    },

    /**
     * 生成实时数据流
     * @param {string} deviceType - 设备类型
     * @returns {object} 实时数据
     */
    generateRealtimeData(deviceType = '位移监测仪') {
        const baseValue = this.getBaseValue(deviceType);
        const noise = (Math.random() - 0.5) * baseValue * 0.1;
        
        return {
            timestamp: new Date(),
            value: Math.max(0, baseValue + noise),
            deviceType: deviceType,
            quality: Math.random() > 0.02 ? 'good' : 'poor'
        };
    },

    /**
     * 生成天气数据
     * @returns {object} 天气数据
     */
    generateWeatherData() {
        const conditions = ['晴', '多云', '阴', '小雨', '中雨', '大雨', '暴雨'];
        const conditionWeights = [0.2, 0.25, 0.2, 0.15, 0.1, 0.07, 0.03];
        
        return {
            condition: this.weightedRandom(conditions, conditionWeights),
            temperature: Math.round(15 + Math.random() * 20), // 15-35度
            humidity: Math.round(40 + Math.random() * 50), // 40-90%
            rainfall: Math.random() * 50, // 0-50mm/h
            windSpeed: Math.random() * 10, // 0-10m/s
            pressure: Math.round(950 + Math.random() * 100), // 950-1050hPa
            visibility: Math.round(5 + Math.random() * 15), // 5-20km
            updateTime: new Date()
        };
    },

    /**
     * 生成系统状态数据
     * @returns {object} 系统状态数据
     */
    generateSystemStatus() {
        return {
            cpu: Math.round(20 + Math.random() * 60), // 20-80%
            memory: Math.round(30 + Math.random() * 50), // 30-80%
            disk: Math.round(10 + Math.random() * 70), // 10-80%
            network: Math.random() > 0.05 ? 'online' : 'offline', // 95%在线
            database: Math.random() > 0.02 ? 'connected' : 'disconnected', // 98%连接
            services: {
                webServer: Math.random() > 0.01 ? 'running' : 'stopped',
                dataProcessor: Math.random() > 0.02 ? 'running' : 'stopped',
                alertService: Math.random() > 0.01 ? 'running' : 'stopped',
                backupService: Math.random() > 0.05 ? 'running' : 'stopped'
            },
            updateTime: new Date()
        };
    },

    // 工具方法

    /**
     * 加权随机选择
     * @param {Array} items - 选项数组
     * @param {Array} weights - 权重数组
     * @returns {any} 选中的项
     */
    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    },

    /**
     * 生成随机日期
     * @param {Date} start - 开始日期
     * @param {Date} end - 结束日期
     * @returns {Date} 随机日期
     */
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    /**
     * 获取设备基础值
     * @param {string} deviceType - 设备类型
     * @returns {number} 基础值
     */
    getBaseValue(deviceType) {
        const baseValues = {
            '位移监测仪': 2.5,
            '雨量计': 5,
            '倾斜仪': 1,
            '土壤含水量计': 35,
            '地下水位计': 3
        };
        return baseValues[deviceType] || 1;
    },

    /**
     * 生成影响区域
     * @param {string} location - 位置
     * @returns {Array} 影响区域数组
     */
    generateAffectedArea(location) {
        const areas = [`${location}中心区`, `${location}东部`, `${location}西部`, `${location}南部`, `${location}北部`];
        const count = Math.floor(Math.random() * 3) + 1; // 1-3个区域
        return areas.slice(0, count);
    },

    /**
     * 获取风险等级
     * @param {string} level - 预警等级
     * @returns {string} 风险等级
     */
    getRiskLevel(level) {
        const riskMap = {
            blue: '低风险',
            yellow: '中风险',
            orange: '高风险',
            red: '极高风险'
        };
        return riskMap[level] || '未知风险';
    },

    /**
     * 获取预警建议
     * @param {string} type - 灾害类型
     * @param {string} level - 预警等级
     * @returns {Array} 建议数组
     */
    getWarningSuggestions(type, level) {
        const suggestions = {
            滑坡: {
                blue: ['定期巡查', '关注天气变化'],
                yellow: ['加强监测', '准备应急物资'],
                orange: ['限制通行', '组织演练', '准备撤离'],
                red: ['立即撤离', '封闭道路', '启动应急预案']
            },
            泥石流: {
                blue: ['清理排水沟', '检查防护设施'],
                yellow: ['加强巡查', '疏通河道'],
                orange: ['转移物资', '准备撤离路线'],
                red: ['紧急撤离', '断路封桥', '救援待命']
            }
        };
        
        return suggestions[type] ? suggestions[type][level] : ['加强防范', '密切关注'];
    }
};

// 初始化模拟数据
window.MockData.devices = window.MockData.generateDevices(50);
window.MockData.warnings = window.MockData.generateWarnings(20);
window.MockData.weather = window.MockData.generateWeatherData();
window.MockData.systemStatus = window.MockData.generateSystemStatus();

console.log('📊 模拟数据已生成', {
    devices: window.MockData.devices.length,
    warnings: window.MockData.warnings.length
});
