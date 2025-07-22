/**
 * CesiumJS 代理服务器 - 解决CORS和资源加载问题
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 服务器配置
const PORT = process.env.PORT || 8080;
const HOST = 'localhost';

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.wasm': 'application/wasm',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream',
    '.terrain': 'application/octet-stream'
};

// 代理目标映射
const proxyTargets = {
    '/cesium-ion/': 'https://api.cesium.com/',
    '/cesium-assets/': 'https://assets.cesium.com/',
    '/cesium-tiles/': 'https://assets.cesium.com/'
};

/**
 * 代理请求到外部服务
 */
function proxyRequest(req, res, targetUrl) {
    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + (targetUrl.search || ''),
        method: req.method,
        headers: {
            ...req.headers,
            'host': targetUrl.hostname,
            'origin': `${targetUrl.protocol}//${targetUrl.hostname}`,
            'referer': `${targetUrl.protocol}//${targetUrl.hostname}/`
        }
    };

    const protocol = targetUrl.protocol === 'https:' ? https : http;
    
    const proxyReq = protocol.request(options, (proxyRes) => {
        // 设置CORS头部
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // 复制响应头
        Object.keys(proxyRes.headers).forEach(key => {
            if (key.toLowerCase() !== 'access-control-allow-origin') {
                res.setHeader(key, proxyRes.headers[key]);
            }
        });
        
        res.writeHead(proxyRes.statusCode);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error('代理请求错误:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '代理请求失败', message: err.message }));
    });

    // 转发请求体
    req.pipe(proxyReq);
}

/**
 * 服务本地文件
 */
function serveLocalFile(req, res, filePath) {
    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`❌ 文件不存在: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html>
                    <head><title>404 - 文件未找到</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>404 - 文件未找到</h1>
                        <p>请求的文件 <code>${req.url}</code> 不存在。</p>
                        <p>文件路径: <code>${filePath}</code></p>
                        <p><a href="/cesium-stable.html">🌍 CesiumJS稳定版</a></p>
                        <p><a href="/geological-disaster-dashboard.html">📊 地灾监控大屏</a></p>
                        <p><a href="/原型页面/pc端/index.html">🖥️ PC端原型页面</a></p>
                        <p><a href="/原型页面/pc端/pages/monitor/dashboard.html">� 监控仪表板</a></p>
                    </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // 只记录HTML文件的服务日志，减少噪音
        if (ext === '.html') {
            console.log(`📁 服务页面: ${path.basename(filePath)}`);
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`❌ 读取文件失败: ${filePath}`, err);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <html>
                        <head><title>500 - 服务器错误</title></head>
                        <body style="font-family: Arial, sans-serif; padding: 20px;">
                            <h1>500 - 服务器错误</h1>
                            <p>读取文件时发生错误：${err.message}</p>
                            <p>文件路径: <code>${filePath}</code></p>
                        </body>
                    </html>
                `);
                return;
            }

            // 设置CORS头部
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            // 设置缓存头部
            if (['.js', '.css', '.png', '.jpg', '.jpeg', '.woff', '.woff2', '.json'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    try {
        // 处理OPTIONS预检请求
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.writeHead(200);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url, true);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // 只记录非静态资源请求，减少日志噪音
        if (!pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf)$/)) {
            console.log(`📥 ${req.method} ${pathname}`);
        }

        // 处理根路径
        if (pathname === '/') {
            pathname = '/cesium-stable.html';
        }

        // 检查是否需要代理到外部服务
        let needProxy = false;
        let targetUrl = null;

        // 只代理明确的外部API请求
        if (pathname.startsWith('/cesium-ion/')) {
            needProxy = true;
            const targetPath = pathname.replace('/cesium-ion/', '/');
            targetUrl = new URL(targetPath + (parsedUrl.search || ''), 'https://api.cesium.com');
        } else if (pathname.startsWith('/cesium-assets/')) {
            needProxy = true;
            const targetPath = pathname.replace('/cesium-assets/', '/');
            targetUrl = new URL(targetPath + (parsedUrl.search || ''), 'https://assets.cesium.com');
        }

        // 不代理本地node_modules中的资源，直接作为本地文件处理

        if (needProxy && targetUrl) {
            console.log(`🔄 代理请求: ${pathname} -> ${targetUrl.href}`);
            proxyRequest(req, res, targetUrl);
        } else {
            // 服务本地文件
            const filePath = path.join(__dirname, pathname);
            serveLocalFile(req, res, filePath);
        }

    } catch (error) {
        console.error('服务器错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: '服务器内部错误', 
            message: error.message 
        }));
    }
});

// 启动服务器
server.listen(PORT, HOST, () => {
    console.log(`🚀 地质灾害预警系统代理服务器已启动`);
    console.log(`📍 服务地址: http://${HOST}:${PORT}`);
    console.log(`🕐 启动时间: ${new Date().toLocaleString()}`);
    console.log(`📁 工作目录: ${__dirname}`);
    console.log(`\n📄 可用页面:`);
    console.log(`   🌍 CesiumJS稳定版: http://${HOST}:${PORT}/cesium-stable.html`);
    console.log(`   📊 地灾监控大屏: http://${HOST}:${PORT}/原型页面/pc端/pages/monitor/geological-disaster-dashboard.html`);
    console.log(`   🖥️  PC端原型页面: http://${HOST}:${PORT}/原型页面/pc端/index.html`);
    console.log(`   📈 监控仪表板: http://${HOST}:${PORT}/原型页面/pc端/pages/monitor/dashboard.html`);
    console.log(`\n� 服务功能:`);
    console.log(`   ✅ 静态文件服务`);
    console.log(`   ✅ CORS跨域支持`);
    console.log(`   ✅ Cesium Ion API代理`);
    console.log(`   ✅ Cesium Assets代理`);
    console.log(`   ✅ 自动MIME类型识别`);
    console.log(`\n⏹️  按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭代理服务器...');
    console.log('⏳ 等待现有连接完成...');
    server.close(() => {
        console.log('✅ 代理服务器已安全关闭');
        console.log(`🕐 关闭时间: ${new Date().toLocaleString()}`);
        process.exit(0);
    });
});

// 错误处理
server.on('error', (err) => {
    console.log('\n' + '='.repeat(50));
    console.error('❌ 服务器启动失败');
    console.log('='.repeat(50));

    if (err.code === 'EADDRINUSE') {
        console.error(`🚫 端口 ${PORT} 已被占用`);
        console.log('\n💡 解决方案:');
        console.log(`   1. 查找占用进程: lsof -ti:${PORT}`);
        console.log(`   2. 终止占用进程: lsof -ti:${PORT} | xargs kill -9`);
        console.log(`   3. 或使用其他端口: PORT=3000 npm start`);
    } else if (err.code === 'EACCES') {
        console.error(`🚫 权限不足，无法绑定端口 ${PORT}`);
        console.log('\n💡 解决方案:');
        console.log('   1. 使用大于1024的端口号');
        console.log('   2. 或使用sudo运行（不推荐）');
    } else {
        console.error(`🚫 未知错误: ${err.message}`);
        console.log('\n💡 错误详情:');
        console.log(`   代码: ${err.code}`);
        console.log(`   消息: ${err.message}`);
    }

    console.log('\n🔄 请解决问题后重新启动服务器\n');
    process.exit(1);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('未处理的Promise拒绝:', reason);
});

module.exports = server;
