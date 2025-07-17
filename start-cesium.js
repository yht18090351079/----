#!/usr/bin/env node

/**
 * CesiumJS 开发服务器启动脚本
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🌍 启动CesiumJS开发环境...\n');

// 启动代理服务器
const serverProcess = spawn('node', ['proxy-server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

// 处理服务器进程事件
serverProcess.on('error', (err) => {
    console.error('❌ 启动服务器失败:', err);
    process.exit(1);
});

serverProcess.on('close', (code) => {
    console.log(`\n🛑 服务器进程退出，退出码: ${code}`);
    process.exit(code);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭开发环境...');
    serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 正在关闭开发环境...');
    serverProcess.kill('SIGTERM');
});

// 显示帮助信息
setTimeout(() => {
    console.log('\n📖 使用说明:');
    console.log('   🌍 CesiumJS测试页面: http://localhost:8080/cesium-test.html');
    console.log('   📊 监控大屏: http://localhost:8080/原型页面/pc端/pages/monitor/dashboard-cesium.html');
    console.log('   ⏹️  按 Ctrl+C 停止服务器');
    console.log('   🔄 代理功能已启用，解决CORS问题\n');
}, 2000);
