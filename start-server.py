#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地质灾害预警系统本地开发服务器
解决Cesium跨域问题，提供更好的开发体验
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器，添加CORS头部"""
    
    def end_headers(self):
        # 添加CORS头部，解决跨域问题
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # 添加缓存控制头部
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f"🌐 {self.address_string()} - {format % args}")

def find_free_port(start_port=8000, max_attempts=10):
    """查找可用端口"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"无法找到可用端口 (尝试了 {start_port}-{start_port + max_attempts - 1})")

def main():
    """主函数"""
    print("🚀 启动地质灾害预警系统本地开发服务器...")
    
    # 切换到项目根目录
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    print(f"📁 工作目录: {project_root}")
    
    # 查找可用端口
    try:
        port = find_free_port()
        print(f"🔍 找到可用端口: {port}")
    except RuntimeError as e:
        print(f"❌ {e}")
        sys.exit(1)
    
    # 创建服务器
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://localhost:{port}"
            dashboard_url = f"{server_url}/原型页面/pc端/pages/monitor/geological-disaster-dashboard.html"
            
            print(f"\n✅ 服务器启动成功！")
            print(f"🌐 服务器地址: {server_url}")
            print(f"📊 监控大屏: {dashboard_url}")
            print(f"\n💡 提示:")
            print(f"   - 使用 Ctrl+C 停止服务器")
            print(f"   - 修改文件后刷新浏览器即可看到更新")
            print(f"   - 服务器会自动处理跨域问题")
            
            # 自动打开浏览器
            try:
                print(f"\n🔗 正在打开浏览器...")
                webbrowser.open(dashboard_url)
            except Exception as e:
                print(f"⚠️ 无法自动打开浏览器: {e}")
                print(f"请手动访问: {dashboard_url}")
            
            print(f"\n🔄 服务器运行中，等待请求...")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n\n👋 服务器已停止")
    except Exception as e:
        print(f"❌ 服务器启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
