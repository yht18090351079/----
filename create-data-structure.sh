#!/bin/bash
# 地质灾害预警系统 - 创建数据文件目录结构

echo "🚀 创建地质灾害预警系统数据目录结构..."

# 进入监控页面目录
cd "原型页面/pc端/pages/monitor" || exit 1

# 创建provinces目录
echo "📁 创建provinces目录..."
mkdir -p data/provinces

# 创建省份数据文件占位符
echo "📄 创建省份数据文件占位符..."

provinces=(
    "110000-北京市"
    "120000-天津市"
    "130000-河北省"
    "140000-山西省"
    "150000-内蒙古自治区"
    "210000-辽宁省"
    "220000-吉林省"
    "230000-黑龙江省"
    "310000-上海市"
    "320000-江苏省"
    "330000-浙江省"
    "340000-安徽省"
    "350000-福建省"
    "360000-江西省"
    "370000-山东省"
    "410000-河南省"
    "420000-湖北省"
    "430000-湖南省"
    "440000-广东省"
    "450000-广西壮族自治区"
    "460000-海南省"
    "500000-重庆市"
    "510000-四川省"
    "520000-贵州省"
    "530000-云南省"
    "540000-西藏自治区"
    "610000-陕西省"
    "620000-甘肃省"
    "630000-青海省"
    "640000-宁夏回族自治区"
    "650000-新疆维吾尔自治区"
    "710000-台湾省"
    "810000-香港特别行政区"
    "820000-澳门特别行政区"
)

# 为每个省份创建占位符文件
for province in "${provinces[@]}"; do
    filename="data/provinces/${province}.json"
    if [ ! -f "$filename" ]; then
        echo "  创建: $filename"
        cat > "$filename" << EOF
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "${province#*-}",
        "adcode": "${province%-*}",
        "level": "province"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [100, 30],
            [110, 30],
            [110, 40],
            [100, 40],
            [100, 30]
          ]
        ]
      }
    }
  ]
}
EOF
    fi
done

# 创建中国国界占位符文件
if [ ! -f "data/china-boundary-real.json" ]; then
    echo "📄 创建中国国界占位符文件..."
    cat > "data/china-boundary-real.json" << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "中华人民共和国",
        "adcode": "100000",
        "level": "country"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [73, 18],
            [135, 18],
            [135, 54],
            [73, 54],
            [73, 18]
          ]
        ]
      }
    }
  ]
}
EOF
fi

# 创建四川省市级区划占位符文件
if [ ! -f "data/sichuan-cities-real.json" ]; then
    echo "📄 创建四川省市级区划占位符文件..."
    cat > "data/sichuan-cities-real.json" << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "成都市",
        "adcode": "510100",
        "level": "city"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [103.5, 30.2],
            [104.5, 30.2],
            [104.5, 31.2],
            [103.5, 31.2],
            [103.5, 30.2]
          ]
        ]
      }
    }
  ]
}
EOF
fi

# 创建成都市区县占位符文件
if [ ! -f "data/chengdu-districts-real.json" ]; then
    echo "📄 创建成都市区县占位符文件..."
    cat > "data/chengdu-districts-real.json" << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "锦江区",
        "adcode": "510104",
        "level": "district"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [104.08, 30.65],
            [104.12, 30.65],
            [104.12, 30.69],
            [104.08, 30.69],
            [104.08, 30.65]
          ]
        ]
      }
    }
  ]
}
EOF
fi

echo ""
echo "✅ 数据目录结构创建完成！"
echo ""
echo "📋 创建的文件："
echo "   - data/china-boundary-real.json (中国国界)"
echo "   - data/provinces/*.json (34个省级行政区)"
echo "   - data/sichuan-cities-real.json (四川省市级区划)"
echo "   - data/chengdu-districts-real.json (成都市区县)"
echo ""
echo "⚠️  注意："
echo "   - 这些是占位符文件，包含简化的示例数据"
echo "   - 请用真实的GeoJSON数据替换这些文件"
echo "   - 参考 data/数据文件结构说明.md 获取详细信息"
echo ""
echo "🎯 下一步："
echo "   1. 获取真实的行政区划GeoJSON数据"
echo "   2. 替换占位符文件"
echo "   3. 刷新浏览器测试加载效果"
