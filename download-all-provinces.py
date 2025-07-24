#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载全国所有省份的边界数据
从阿里云 DataV 获取全国34个省级行政区的真实边界数据
"""

import requests
import json
import os
import time

def download_boundary_data(url, filename, description=""):
    """下载边界数据并保存到文件"""
    print(f"📡 正在下载: {description}")
    
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
            print(f"✅ 下载成功: {filename} ({feature_count} 个要素)")
            return True
        else:
            print(f"❌ 数据格式错误: 不是有效的 GeoJSON")
            return False
            
    except Exception as e:
        print(f"❌ 下载失败: {e}")
        return False

def main():
    """主函数：下载全国所有省份边界数据"""
    print("🚀 开始下载全国所有省份的边界数据...")
    
    # 数据保存目录
    data_dir = "原型页面/pc端/pages/monitor/data"
    
    # 全国34个省级行政区
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
    
    # 执行下载任务
    success_count = 0
    total_count = len(provinces)
    
    for i, province in enumerate(provinces, 1):
        print(f"\n📥 任务 {i}/{total_count}")
        
        url = f'https://geo.datav.aliyun.com/areas_v3/bound/{province["code"]}.json'
        filename = f'{data_dir}/provinces/{province["code"]}-{province["name"]}.json'
        description = f'{province["name"]}省级边界'
        
        if download_boundary_data(url, filename, description):
            success_count += 1
        
        # 添加延迟，避免请求过于频繁
        if i < total_count:
            print("⏸️ 等待 1 秒...")
            time.sleep(1)
    
    print(f"\n🎉 下载完成！")
    print(f"📊 成功: {success_count}/{total_count}")
    
    if success_count > 0:
        print(f"\n📁 数据文件保存在: {data_dir}/provinces/")
        print("💡 现在系统可以加载全国所有省份的真实边界数据了")
        
        # 显示下载统计
        print(f"\n📋 下载统计:")
        print(f"   - 直辖市: 4个 (北京、天津、上海、重庆)")
        print(f"   - 省份: 23个")
        print(f"   - 自治区: 5个")
        print(f"   - 特别行政区: 2个 (香港、澳门)")
        print(f"   - 台湾省: 1个")
        print(f"   - 总计: 34个省级行政区")

if __name__ == "__main__":
    main()
