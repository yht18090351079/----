#!/usr/bin/env node

/**
 * CesiumJS 开发服务器启动脚本
 * 地质灾害预警系统 - 开发环境启动器
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 检查必要文件是否存在
function checkRequiredFiles() {
    const requiredFiles = [
        'proxy-server.js',
        'cesium-stable.html',
        'geological-disaster-dashboard.html'
    ];

    const missingFiles = requiredFiles.filter(file => {
        const filePath = path.join(__dirname, file);
        return !fs.existsSync(filePath);
    });

    if (missingFiles.length > 0) {
        console.log('⚠️  警告：以下文件不存在：');
        missingFiles.forEach(file => console.log(`   ❌ ${file}`));
        console.log('   某些功能可能无法正常工作\n');
    }
}

console.log('🌍 启动地质灾害预警系统开发环境...\n');

// 检查文件
checkRequiredFiles();

console.log('🚀 正在启动代理服务器...');

// 启动代理服务器
const serverProcess = spawn('node', ['proxy-server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

// 处理服务器进程事件
serverProcess.on('error', (err) => {
    console.error('\n❌ 启动服务器失败:', err.message);
    console.log('💡 请检查：');
    console.log('   • Node.js 是否正确安装');
    console.log('   • proxy-server.js 文件是否存在');
    console.log('   • 端口 8080 是否被占用');
    console.log('   • 运行 lsof -ti:8080 | xargs kill -9 清理端口\n');
    process.exit(1);
});

serverProcess.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ 服务器正常关闭');
    } else {
        console.log(`\n🛑 服务器异常退出，退出码: ${code}`);
    }
    process.exit(code);
});

// 优雅关闭处理
let isShuttingDown = false;

function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n🛑 收到 ${signal} 信号，正在关闭开发环境...`);
    console.log('⏳ 等待服务器关闭...');

    serverProcess.kill(signal);

    // 如果服务器在5秒内没有关闭，强制退出
    setTimeout(() => {
        console.log('⚠️  强制关闭服务器...');
        serverProcess.kill('SIGKILL');
        process.exit(1);
    }, 5000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 显示帮助信息
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🎉 地质灾害预警系统开发环境已就绪！');
    console.log('='.repeat(60));
    console.log('\n📖 可用页面:');
    console.log('   🌍 CesiumJS稳定版: http://localhost:8080/cesium-stable.html');
    console.log('   📊 地灾监控大屏: http://localhost:8080/原型页面/pc端/pages/monitor/geological-disaster-dashboard.html');
    console.log('   🖥️  PC端原型页面: http://localhost:8080/原型页面/pc端/index.html');
    console.log('   📈 监控仪表板: http://localhost:8080/原型页面/pc端/pages/monitor/dashboard.html');
    console.log('\n🔧 功能特性:');
    console.log('   ✅ CORS代理已启用，解决跨域问题');
    console.log('   ✅ 支持Cesium Ion和Assets资源代理');
    console.log('   ✅ 自动文件服务和MIME类型识别');
    console.log('\n⚡ 操作提示:');
    console.log('   ⏹️  按 Ctrl+C 优雅停止服务器');
    console.log('   🔄 修改文件后刷新浏览器即可看到更改');
    console.log('   🐛 遇到问题请检查控制台输出\n');
}, 3000);
