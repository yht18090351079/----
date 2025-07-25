# 地质灾害预警系统 - 地理边界数据

本目录包含地质灾害预警系统使用的真实地理边界数据文件。

## 数据来源

所有地理边界数据均来自阿里云 DataV.GeoAtlas，这是一个提供高质量、准确的中国行政区划边界数据的服务。

- **数据源**: Alibaba Cloud DataV GeoAtlas
- **数据格式**: GeoJSON
- **坐标系**: WGS84 (EPSG:4326)
- **精度**: 高精度边界数据，包含详细的地理坐标点

## 文件说明

### 国家级边界
- `china-boundary-real.json` - 中华人民共和国国界边界（真实数据）
  - 包含完整的国界边界线
  - 文件大小: ~100MB
  - 要素数量: 34个省级行政区

### 省级边界
`provinces/` 目录包含重要省份的边界数据：

- `110000-北京市.json` - 北京市边界
- `310000-上海市.json` - 上海市边界  
- `440000-广东省.json` - 广东省边界
- `500000-重庆市.json` - 重庆市边界
- `510000-四川省.json` - 四川省边界

### 市级边界
- `sichuan-cities-real.json` - 四川省市级行政区划
  - 包含四川省21个市州的边界
  - 包括成都市、绵阳市、德阳市等所有地级市
  - 包括阿坝州、甘孜州、凉山州等自治州

### 区县级边界
- `chengdu-districts-real.json` - 成都市区县边界
  - 包含成都市20个区县的详细边界
  - 包括锦江区、青羊区等中心城区
  - 包括都江堰市、邛崃市等县级市
  - 包括金堂县、大邑县等县

## 使用方式

在 JavaScript 代码中，这些数据文件通过相对路径引用：

```javascript
// 中国国界
'data/china-boundary-real.json'

// 省级边界
'data/provinces/510000-四川省.json'

// 四川省市级区划
'data/sichuan-cities-real.json'

// 成都市区县边界
'data/chengdu-districts-real.json'
```

## 数据特点

1. **真实性**: 所有边界数据都是真实的地理边界，不是简化的矩形或近似边界
2. **精确性**: 包含详细的地理坐标点，能够准确显示行政区划边界
3. **完整性**: 覆盖国家、省、市、区县多个层级的行政区划
4. **离线性**: 数据保存在本地，无需网络连接即可使用
5. **标准化**: 采用标准的 GeoJSON 格式，兼容各种地图库

## 数据更新

如需更新边界数据，可以运行项目根目录下的 `download-real-boundaries.py` 脚本：

```bash
python3 download-real-boundaries.py
```

该脚本会自动从阿里云 DataV 下载最新的边界数据并保存到本目录。

## 注意事项

1. 这些数据文件较大，请确保有足够的存储空间
2. 数据仅用于地质灾害预警系统的地图显示，请遵守相关使用条款
3. 如需商业使用，请确认数据源的使用许可

## 文件大小参考

- `china-boundary-real.json`: ~100MB
- `sichuan-cities-real.json`: ~25MB  
- `chengdu-districts-real.json`: ~25MB
- 各省级边界文件: 1-10MB

总计约 200MB 的地理数据文件。
