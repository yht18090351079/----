#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
提取 HTML 文件中的 CSS 和 JavaScript 到单独文件
"""

import re
import os

def extract_css_js(html_file_path, css_output_path, js_output_path):
    """从 HTML 文件中提取 CSS 和 JavaScript"""
    
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取 CSS (从 <style> 到 </style>)
    css_pattern = r'<style>(.*?)</style>'
    css_match = re.search(css_pattern, content, re.DOTALL)
    
    if css_match:
        css_content = css_match.group(1).strip()
        # 移除每行开头的空格缩进
        css_lines = css_content.split('\n')
        cleaned_css_lines = []
        for line in css_lines:
            # 移除开头的8个空格（HTML中的缩进）
            if line.startswith('        '):
                cleaned_css_lines.append(line[8:])
            else:
                cleaned_css_lines.append(line)
        
        css_content = '\n'.join(cleaned_css_lines)
        
        # 添加文件头注释
        css_header = """/* 地质灾害预警系统 - 实时监控大屏样式 */
/* 从 geological-disaster-dashboard.html 自动提取 */

"""
        css_content = css_header + css_content
        
        with open(css_output_path, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print(f"✅ CSS 已提取到: {css_output_path}")
    
    # 提取 JavaScript (从 <script> 到 </script>)
    js_pattern = r'<script>(.*?)</script>'
    js_match = re.search(js_pattern, content, re.DOTALL)
    
    if js_match:
        js_content = js_match.group(1).strip()
        # 移除每行开头的空格缩进
        js_lines = js_content.split('\n')
        cleaned_js_lines = []
        for line in js_lines:
            # 移除开头的8个空格（HTML中的缩进）
            if line.startswith('        '):
                cleaned_js_lines.append(line[8:])
            else:
                cleaned_js_lines.append(line)
        
        js_content = '\n'.join(cleaned_js_lines)
        
        # 添加文件头注释
        js_header = """// 地质灾害预警系统 - 实时监控大屏脚本
// 从 geological-disaster-dashboard.html 自动提取

"""
        js_content = js_header + js_content
        
        with open(js_output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✅ JavaScript 已提取到: {js_output_path}")

def update_html_file(html_file_path, css_file_path, js_file_path):
    """更新 HTML 文件，替换内联样式和脚本为外部引用"""
    
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换 CSS
    css_pattern = r'<style>.*?</style>'
    css_replacement = f'<link rel="stylesheet" href="{css_file_path}">'
    content = re.sub(css_pattern, css_replacement, content, flags=re.DOTALL)
    
    # 替换 JavaScript
    js_pattern = r'<script>.*?</script>'
    js_replacement = f'<script src="{js_file_path}"></script>'
    content = re.sub(js_pattern, js_replacement, content, flags=re.DOTALL)
    
    with open(html_file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ HTML 文件已更新: {html_file_path}")

if __name__ == "__main__":
    # 文件路径
    html_file = "原型页面/pc端/pages/monitor/geological-disaster-dashboard.html"
    css_file = "原型页面/pc端/pages/monitor/css/geological-disaster-dashboard.css"
    js_file = "原型页面/pc端/pages/monitor/js/geological-disaster-dashboard.js"
    
    # 确保目录存在
    os.makedirs(os.path.dirname(css_file), exist_ok=True)
    os.makedirs(os.path.dirname(js_file), exist_ok=True)
    
    # 提取文件
    extract_css_js(html_file, css_file, js_file)
    
    # 更新 HTML 文件
    update_html_file(html_file, "css/geological-disaster-dashboard.css", "js/geological-disaster-dashboard.js")
    
    print("🎉 提取完成！")
