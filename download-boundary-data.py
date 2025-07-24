#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载真实的中国行政区划边界数据
从阿里云 DataV 等数据源获取真实的 GeoJSON 边界数据
"""

import requests
import json
import os
import time
from urllib.parse import quote

def download_boundary_data(url, filename, description=""):
    """下载边界数据并保存到文件"""
    print(f"📡 正在下载: {description}")
    print(f"🌐 数据源: {url}")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://datav.aliyun.com/',
            'Accept': 'application/json, text/plain, */*'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # 尝试解析 JSON
        data = response.json()
        
        # 验证是否为有效的 GeoJSON
        if data.get('type') == 'FeatureCollection' and 'features' in data:
            # 添加元数据
            data['name'] = description
            data['source'] = 'Alibaba DataV GeoAtlas'
            data['download_time'] = time.strftime('%Y-%m-%d %H:%M:%S')
            
            # 保存到文件
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            feature_count = len(data['features'])
            print(f"✅ 下载成功: {filename}")
            print(f"📊 包含 {feature_count} 个地理要素")
            return True
        else:
            print(f"❌ 数据格式错误: 不是有效的 GeoJSON")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 网络请求失败: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失败: {e}")
        return False
    except Exception as e:
        print(f"❌ 下载失败: {e}")
        return False

def main():
    """主函数：下载所有边界数据"""
    print("🚀 开始下载真实的中国行政区划边界数据...")
    
    # 数据保存目录
    data_dir = "原型页面/pc端/pages/monitor/data"
    
    # 下载任务列表
    download_tasks = [
        {
            'url': 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
            'filename': f'{data_dir}/china-boundary-real.json',
            'description': '中华人民共和国国界边界（真实数据）'
        },
        {
            'url': 'https://geo.datav.aliyun.com/areas_v3/bound/110000_full.json',
            'filename': f'{data_dir}/beijing-boundary.json',
            'description': '北京市边界'
        },
        {
            'url': 'https://geo.datav.aliyun.com/areas_v3/bound/510000_full.json',
            'filename': f'{data_dir}/sichuan-cities-real.json',
            'description': '四川省市级行政区划（真实数据）'
        },
        {
            'url': 'https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json',
            'filename': f'{data_dir}/chengdu-districts-real.json',
            'description': '成都市区县边界（真实数据）'
        }
    ]
    
    # 省级行政区代码列表
    provinces = [
        {'name': '北京市', 'code': '110000'},
        {'name': '天津市', 'code': '120000'},
        {'name': '河北省', 'code': '130000'},
        {'name': '山西省', 'code': '140000'},
        {'name': '内蒙古自治区', 'code': '150000'},
        {'name': '辽宁省', 'code': '210000'},
        {'name': '吉林省', 'code': '220000'},
        {'name': '黑龙江省', 'code': '230000'},
        {'name': '上海市', 'code': '310000'},
        {'name': '江苏省', 'code': '320000'},
        {'name': '浙江省', 'code': '330000'},
        {'name': '安徽省', 'code': '340000'},
        {'name': '福建省', 'code': '350000'},
        {'name': '江西省', 'code': '360000'},
        {'name': '山东省', 'code': '370000'},
        {'name': '河南省', 'code': '410000'},
        {'name': '湖北省', 'code': '420000'},
        {'name': '湖南省', 'code': '430000'},
        {'name': '广东省', 'code': '440000'},
        {'name': '广西壮族自治区', 'code': '450000'},
        {'name': '海南省', 'code': '460000'},
        {'name': '重庆市', 'code': '500000'},
        {'name': '四川省', 'code': '510000'},
        {'name': '贵州省', 'code': '520000'},
        {'name': '云南省', 'code': '530000'},
        {'name': '西藏自治区', 'code': '540000'},
        {'name': '陕西省', 'code': '610000'},
        {'name': '甘肃省', 'code': '620000'},
        {'name': '青海省', 'code': '630000'},
        {'name': '宁夏回族自治区', 'code': '640000'},
        {'name': '新疆维吾尔自治区', 'code': '650000'},
        {'name': '台湾省', 'code': '710000'},
        {'name': '香港特别行政区', 'code': '810000'},
        {'name': '澳门特别行政区', 'code': '820000'}
    ]
    
    # 添加省级边界下载任务（仅下载几个重要省份作为示例）
    important_provinces = ['110000', '310000', '440000', '510000', '500000']  # 北京、上海、广东、四川、重庆
    
    for province in provinces:
        if province['code'] in important_provinces:
            download_tasks.append({
                'url': f'https://geo.datav.aliyun.com/areas_v3/bound/{province["code"]}.json',
                'filename': f'{data_dir}/provinces/{province["code"]}-{province["name"]}.json',
                'description': f'{province["name"]}省级边界'
            })
    
    # 执行下载任务
    success_count = 0
    total_count = len(download_tasks)
    
    for i, task in enumerate(download_tasks, 1):
        print(f"\n📥 任务 {i}/{total_count}")
        if download_boundary_data(task['url'], task['filename'], task['description']):
            success_count += 1
        
        # 添加延迟，避免请求过于频繁
        if i < total_count:
            print("⏸️ 等待 2 秒...")
            time.sleep(2)
    
    print(f"\n🎉 下载完成！")
    print(f"📊 成功: {success_count}/{total_count}")
    
    if success_count > 0:
        print(f"\n📁 数据文件保存在: {data_dir}/")
        print("💡 现在可以更新 JavaScript 代码使用本地真实数据了")

if __name__ == "__main__":
    main()
