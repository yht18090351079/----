/**
 * 地质灾害预警系统 - 公共工具函数
 */

// 全局工具对象
window.Utils = {
    
    /**
     * 格式化时间
     * @param {Date|string|number} date - 时间
     * @param {string} format - 格式化字符串
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 限制时间
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 生成随机ID
     * @param {number} length - ID长度
     * @returns {string} 随机ID
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * 深拷贝对象
     * @param {any} obj - 要拷贝的对象
     * @returns {any} 拷贝后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    /**
     * 获取URL参数
     * @param {string} name - 参数名
     * @returns {string|null} 参数值
     */
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    /**
     * 设置URL参数
     * @param {string} name - 参数名
     * @param {string} value - 参数值
     */
    setUrlParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },

    /**
     * 本地存储操作
     */
    storage: {
        /**
         * 设置本地存储
         * @param {string} key - 键
         * @param {any} value - 值
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('localStorage set error:', e);
            }
        },

        /**
         * 获取本地存储
         * @param {string} key - 键
         * @param {any} defaultValue - 默认值
         * @returns {any} 存储的值
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('localStorage get error:', e);
                return defaultValue;
            }
        },

        /**
         * 删除本地存储
         * @param {string} key - 键
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('localStorage remove error:', e);
            }
        },

        /**
         * 清空本地存储
         */
        clear() {
            try {
                localStorage.clear();
            } catch (e) {
                console.error('localStorage clear error:', e);
            }
        }
    },

    /**
     * 数字格式化
     * @param {number} num - 数字
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的数字
     */
    formatNumber(num, decimals = 2) {
        if (isNaN(num)) return '0';
        return Number(num).toFixed(decimals);
    },

    /**
     * 文件大小格式化
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * 颜色工具
     */
    color: {
        /**
         * 十六进制转RGB
         * @param {string} hex - 十六进制颜色
         * @returns {object} RGB对象
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * RGB转十六进制
         * @param {number} r - 红色值
         * @param {number} g - 绿色值
         * @param {number} b - 蓝色值
         * @returns {string} 十六进制颜色
         */
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        /**
         * 获取随机颜色
         * @returns {string} 随机十六进制颜色
         */
        random() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    },

    /**
     * 设备检测
     */
    device: {
        /**
         * 是否为移动设备
         * @returns {boolean}
         */
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        /**
         * 是否为平板设备
         * @returns {boolean}
         */
        isTablet() {
            return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        },

        /**
         * 是否为桌面设备
         * @returns {boolean}
         */
        isDesktop() {
            return !this.isMobile() && !this.isTablet();
        },

        /**
         * 获取屏幕尺寸
         * @returns {object} 屏幕尺寸对象
         */
        getScreenSize() {
            return {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight
            };
        }
    },

    /**
     * 网络状态检测
     */
    network: {
        /**
         * 是否在线
         * @returns {boolean}
         */
        isOnline() {
            return navigator.onLine;
        },

        /**
         * 获取网络信息
         * @returns {object} 网络信息对象
         */
        getNetworkInfo() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                return {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
            }
            return null;
        }
    },

    /**
     * 动画工具
     */
    animation: {
        /**
         * 平滑滚动到指定元素
         * @param {string|Element} target - 目标元素或选择器
         * @param {number} duration - 动画时长
         */
        scrollTo(target, duration = 500) {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;

            const targetPosition = element.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            requestAnimationFrame(animation.bind(this));
        },

        /**
         * 缓动函数
         * @param {number} t - 当前时间
         * @param {number} b - 起始值
         * @param {number} c - 变化量
         * @param {number} d - 持续时间
         * @returns {number} 计算后的值
         */
        easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
    },

    /**
     * 表单验证
     */
    validate: {
        /**
         * 验证邮箱
         * @param {string} email - 邮箱地址
         * @returns {boolean}
         */
        email(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        /**
         * 验证手机号
         * @param {string} phone - 手机号
         * @returns {boolean}
         */
        phone(phone) {
            const re = /^1[3-9]\d{9}$/;
            return re.test(phone);
        },

        /**
         * 验证身份证号
         * @param {string} idCard - 身份证号
         * @returns {boolean}
         */
        idCard(idCard) {
            const re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return re.test(idCard);
        }
    }
};

// 全局事件总线
window.EventBus = {
    events: {},

    /**
     * 监听事件
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    /**
     * 触发事件
     * @param {string} event - 事件名
     * @param {any} data - 事件数据
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    },

    /**
     * 移除事件监听
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
};

console.log('🔧 公共工具函数已加载');
