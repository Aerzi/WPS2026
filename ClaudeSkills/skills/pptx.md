# PowerPoint 操作技能完整指南

本目录包含了一套完整的 PowerPoint 演示文稿创建、编辑和管理工具。所有工具都可以通过编程方式使用，支持自动化批量处理。

---

## 📚 目录结构

```
skills/pptx/
├── html2pptx.md          # HTML转PPTX技术文档
├── ooxml.md              # Office Open XML技术参考
├── SKILL.md              # Python脚本使用技能
├── scripts/              # Python和JavaScript工具脚本
│   ├── html2pptx.js      # HTML到PPTX转换引擎
│   ├── inventory.py      # 文本内容提取工具
│   ├── rearrange.py      # 幻灯片重排工具
│   ├── replace.py        # 文本替换工具
│   └── thumbnail.py      # 缩略图生成工具
└── ooxml/                # Office Open XML底层操作
    ├── schemas/          # XML Schema定义文件
    │   ├── ecma/         # ECMA标准
    │   ├── ISO-IEC29500-4_2016/  # ISO标准
    │   ├── mce/          # 标记兼容性
    │   └── microsoft/    # 微软扩展
    └── scripts/          # OOXML操作脚本
        ├── pack.py       # 打包目录为PPTX
        ├── unpack.py     # 解包PPTX为目录
        └── validate.py   # XML验证工具
```

---

## 🎨 一、创建演示文稿的方法

### 方法1：HTML转PPTX（推荐用于设计导向的内容）

**适用场景**：需要精确控制布局、样式和视觉设计的演示文稿。

**核心工具**：`scripts/html2pptx.js`

**工作流程**：
1. 使用HTML/CSS设计幻灯片布局
2. 通过 `html2pptx.js` 自动转换为PowerPoint
3. 支持文本、图片、形状、列表
4. 自动计算元素位置和尺寸
5. 可预留占位符区域用于后续添加图表

**特点**：
- ✅ 所见即所得的设计体验
- ✅ 精确的像素级定位
- ✅ 支持CSS样式（颜色、字体、边框、阴影等）
- ✅ 自动验证内容溢出
- ✅ 自动生成占位符供PptxGenJS使用

**使用示例**：
```javascript
const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';  // 必须匹配HTML body尺寸

// 转换HTML为幻灯片
const { slide, placeholders } = await html2pptx('slide.html', pptx);

// 在占位符位置添加图表
if (placeholders.length > 0) {
    slide.addChart(pptx.charts.BAR, chartData, placeholders[0]);
}

await pptx.writeFile('output.pptx');
```

**详细文档**：见 `html2pptx.md`

---

### 方法2：PptxGenJS（推荐用于数据驱动的内容）

**适用场景**：动态生成包含大量图表、表格的数据分析演示文稿。

**核心库**：`pptxgenjs`（已全局安装）

**特点**：
- ✅ 直接用JavaScript生成PPTX
- ✅ 强大的图表支持（柱状图、折线图、饼图、散点图等）
- ✅ 表格创建和格式化
- ✅ 形状和文本框
- ✅ 可与html2pptx结合使用

**注意事项**：
- ⚠️ **颜色格式**：必须使用无 `#` 前缀的十六进制（如 `"FF0000"` 而非 `"#FF0000"`）
- ⚠️ **图表数据**：使用单一系列配合所有标签，避免单点图表
- ⚠️ **坐标轴**：大多数图表需要设置 `catAxisTitle` 和 `valAxisTitle`

**详细文档**：见 `html2pptx.md` 的 "Using PptxGenJS" 部分

---

### 方法3：OOXML直接操作（高级用户）

**适用场景**：需要底层控制或批量修改现有演示文稿。

**核心工具**：
- `ooxml/scripts/unpack.py` - 解包PPTX为XML目录
- `ooxml/scripts/pack.py` - 打包XML目录为PPTX
- `ooxml/scripts/validate.py` - 验证XML合法性

**工作流程**：
```bash
# 1. 解包PPTX
python ooxml/scripts/unpack.py presentation.pptx unpacked/

# 2. 编辑XML文件
# - ppt/slides/slide1.xml (幻灯片内容)
# - ppt/presentation.xml (演示文稿结构)
# - [Content_Types].xml (文件类型声明)

# 3. 验证修改
python ooxml/scripts/validate.py unpacked/ --original presentation.pptx

# 4. 重新打包
python ooxml/scripts/pack.py unpacked/ modified.pptx
```

**详细文档**：见 `ooxml.md`

---

## 🛠️ 二、演示文稿编辑工具

### 1. 文本内容提取工具 (`inventory.py`)

**功能**：提取演示文稿中的所有文本内容，包括格式、位置信息。

**用途**：
- 内容审查和翻译准备
- 检测文本溢出和重叠问题
- 生成内容清单用于批量替换

**使用方法**：
```bash
# 提取所有文本
python scripts/inventory.py presentation.pptx inventory.json

# 仅提取有问题的文本（溢出/重叠）
python scripts/inventory.py presentation.pptx issues.json --issues-only
```

**输出格式**（JSON）：
```json
{
  "slide-0": {
    "shape-0": {
      "left": 1.0,
      "top": 1.5,
      "width": 8.0,
      "height": 2.0,
      "paragraphs": [
        {
          "text": "标题文本",
          "font_name": "Arial",
          "font_size": 44,
          "bold": true,
          "alignment": "CENTER"
        }
      ],
      "overflow": {
        "frame": {
          "overflow_bottom": 0.25
        }
      }
    }
  }
}
```

**检测功能**：
- ✅ 文本框溢出检测（文本超出框架边界）
- ✅ 幻灯片溢出检测（元素超出幻灯片边界）
- ✅ 形状重叠检测（文本框相互重叠）
- ✅ 手动项目符号警告

---

### 2. 文本替换工具 (`replace.py`)

**功能**：根据JSON配置批量替换演示文稿中的文本内容。

**用途**：
- 多语言翻译
- 内容本地化
- 批量更新数据

**使用方法**：
```bash
python scripts/replace.py input.pptx replacements.json output.pptx
```

**替换规则**：
- ⚠️ inventory.py识别的所有文本框都会被清空
- ✅ 只有在replacements.json中指定 `"paragraphs"` 的形状才会填充新内容
- ✅ 自动验证文本溢出（禁止溢出加剧）
- ✅ 自动检测格式问题（如手动项目符号）

**replacements.json 格式**：
```json
{
  "slide-0": {
    "shape-0": {
      "paragraphs": [
        {
          "text": "新的标题文本",
          "font_name": "Arial",
          "font_size": 44,
          "bold": true,
          "alignment": "CENTER"
        }
      ]
    }
  }
}
```

**验证特性**：
- ❌ 如果替换后文本溢出加剧，操作失败
- ❌ 如果使用手动项目符号，发出警告
- ✅ 自动验证所有shape_id有效性

---

### 3. 幻灯片重排工具 (`rearrange.py`)

**功能**：根据索引序列重新排列、复制或删除幻灯片。

**用途**：
- 快速生成定制版本的演示文稿
- 复用模板幻灯片
- 重新组织内容结构

**使用方法**：
```bash
# 重排幻灯片顺序
python scripts/rearrange.py template.pptx output.pptx 0,5,3,2,4

# 复制幻灯片（索引可重复）
python scripts/rearrange.py template.pptx output.pptx 0,34,34,50,52
```

**特点**：
- ✅ 支持幻灯片复制（索引可重复出现）
- ✅ 自动处理图片和媒体关系
- ✅ 保留幻灯片布局和格式
- ✅ 删除未使用的幻灯片
- ⚠️ 索引从0开始（第一张幻灯片是0）

**示例**：
```bash
# 从50张幻灯片的模板中选择特定幻灯片
python scripts/rearrange.py big-template.pptx custom.pptx 0,12,12,25,30,30,30
# 结果：7张幻灯片（索引12和30被复制）
```

---

### 4. 缩略图生成工具 (`thumbnail.py`)

**功能**：生成演示文稿幻灯片的缩略图网格。

**用途**：
- 快速预览演示文稿内容
- 生成幻灯片索引
- 检查布局一致性
- 标记文本占位符位置（调试用）

**使用方法**：
```bash
# 基本用法（默认5列）
python scripts/thumbnail.py presentation.pptx

# 自定义列数
python scripts/thumbnail.py presentation.pptx grid --cols 4

# 标记文本占位符（红色边框）
python scripts/thumbnail.py presentation.pptx analysis --outline-placeholders
```

**输出**：
- 单网格：`thumbnails.jpg`（幻灯片数量 ≤ 30张，5列配置）
- 多网格：`prefix-1.jpg`, `prefix-2.jpg`, ...（自动分页）

**网格布局**：
- 3列：最多12张/网格 (3×4)
- 4列：最多20张/网格 (4×5)
- 5列：最多30张/网格 (5×6) **[默认]**
- 6列：最多42张/网格 (6×7)

**特殊功能**：
- ✅ 自动处理隐藏幻灯片（显示为灰色交叉）
- ✅ `--outline-placeholders`：用红色边框标记所有文本区域（用于检查布局）

---

## 📖 三、技术参考文档

### 1. `html2pptx.md` - HTML转PPTX完整指南

**内容涵盖**：
- HTML幻灯片创建规范
- 支持的HTML元素和CSS样式
- 文本格式化（粗体、斜体、下划线、颜色）
- 列表（有序/无序、多级）
- 形状（背景、边框、圆角、阴影）
- 图片和图标处理
- 渐变背景（需预先栅格化）
- 布局验证规则
- PptxGenJS图表添加
- 完整示例代码

**关键约定**：
- 所有文本必须包裹在 `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` 中
- 使用Web安全字体（Arial, Helvetica, Times New Roman等）
- CSS渐变必须预先转换为PNG图片
- 16:9布局：`width: 720pt; height: 405pt`

---

### 2. `ooxml.md` - Office Open XML技术参考

**内容涵盖**：
- PPTX文件结构和XML架构
- 幻灯片基本结构
- 文本框和文本格式化
- 列表（项目符号和编号）
- 形状（矩形、圆角矩形、椭圆）
- 图片和表格
- 幻灯片布局（标题幻灯片、内容幻灯片）
- 文件关系管理
- 幻灯片操作（添加、复制、删除、重排）
- 常见错误和验证清单

**适用对象**：需要直接编辑PPTX XML的高级用户

---

### 3. `SKILL.md` - Python脚本使用技能

需要读取该文件了解具体内容。

---

## 🔧 四、底层工具（OOXML操作）

### 1. `unpack.py` - 解包工具

**功能**：将PPTX文件解包为格式化的XML目录。

**用途**：
- 查看PPTX内部结构
- 手动编辑XML
- 调试和学习OOXML格式

**使用方法**：
```bash
python ooxml/scripts/unpack.py presentation.pptx unpacked/
```

**输出**：
- 自动格式化所有XML文件（缩进、换行）
- 建议RSID（用于Word文档跟踪更改）

**目录结构**：
```
unpacked/
├── [Content_Types].xml     # 文件类型声明
├── _rels/                  # 包级关系
├── docProps/               # 文档属性
│   ├── app.xml
│   └── core.xml
└── ppt/                    # 演示文稿内容
    ├── presentation.xml    # 演示文稿结构
    ├── slides/             # 幻灯片
    │   ├── slide1.xml
    │   └── _rels/          # 幻灯片关系
    ├── slideLayouts/       # 幻灯片布局
    ├── slideMasters/       # 幻灯片母版
    ├── theme/              # 主题
    └── media/              # 图片和媒体
```

---

### 2. `pack.py` - 打包工具

**功能**：将XML目录打包回PPTX文件。

**用途**：
- 编辑后重新生成PPTX
- 验证XML修改

**使用方法**：
```bash
# 打包并验证
python ooxml/scripts/pack.py unpacked/ output.pptx

# 跳过验证（强制打包）
python ooxml/scripts/pack.py unpacked/ output.pptx --force
```

**处理过程**：
1. 移除XML格式化空白（压缩文件大小）
2. 创建ZIP归档（PPTX实际上是ZIP文件）
3. 验证文件完整性（通过LibreOffice转换测试）

**验证**：
- 默认使用 `soffice` 验证文件可打开
- `--force` 跳过验证（用于调试损坏文件）

---

### 3. `validate.py` - XML验证工具

**功能**：对照XSD架构验证XML文件。

**用途**：
- 编辑前后验证XML合法性
- 确保符合Office Open XML标准

**使用方法**：
```bash
# 验证PPTX
python ooxml/scripts/validate.py unpacked/ --original presentation.pptx -v

# 验证DOCX（包括跟踪更改验证）
python ooxml/scripts/validate.py unpacked/ --original document.docx
```

**验证项**：
- XML架构合规性（对照ISO标准XSD）
- Word文档：跟踪更改一致性（RedliningValidator）
- 文件结构完整性

---

### 4. XML Schema文件 (`ooxml/schemas/`)

**目录结构**：
```
schemas/
├── ecma/                   # ECMA-376标准
│   └── fouth-edition/      # 第四版
│       ├── opc-contentTypes.xsd
│       ├── opc-coreProperties.xsd
│       ├── opc-digSig.xsd
│       └── opc-relationships.xsd
├── ISO-IEC29500-4_2016/    # ISO/IEC 29500-4:2016标准
│   ├── pml.xsd             # PresentationML主架构
│   ├── dml-main.xsd        # DrawingML主架构
│   ├── dml-chart.xsd       # 图表
│   ├── sml.xsd             # SpreadsheetML
│   ├── wml.xsd             # WordprocessingML
│   └── ...
├── mce/                    # 标记兼容性扩展
│   └── mc.xsd
└── microsoft/              # 微软专有扩展
    ├── wml-2010.xsd
    ├── wml-2012.xsd
    └── ...
```

**用途**：
- `validate.py` 使用这些架构验证XML
- 参考标准架构进行XML编辑

---

## 🎯 五、典型使用场景

### 场景1：从零创建数据报告演示文稿

```javascript
// 1. 使用html2pptx设计布局
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// 2. 加载HTML幻灯片模板
const { slide, placeholders } = await html2pptx('template.html', pptx);

// 3. 在占位符添加数据图表
slide.addChart(pptx.charts.BAR, [{
    name: "销售额",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [4500, 5500, 6200, 7100]
}], {
    ...placeholders[0],
    chartColors: ["4472C4"]
});

// 4. 保存
await pptx.writeFile('report.pptx');
```

---

### 场景2：批量翻译演示文稿

```bash
# 1. 提取文本内容
python scripts/inventory.py original.pptx inventory.json

# 2. 翻译JSON文件（手动或使用翻译API）
# 编辑 inventory.json，翻译所有 "text" 字段

# 3. 应用翻译
python scripts/replace.py original.pptx translated.json translated.pptx
```

---

### 场景3：从模板快速生成定制版本

```bash
# 1. 生成缩略图预览（选择需要的幻灯片）
python scripts/thumbnail.py master-template.pptx preview --cols 6

# 2. 根据索引生成定制版本
python scripts/rearrange.py master-template.pptx client-a.pptx 0,5,12,18,25,30

# 3. 替换定制内容
python scripts/replace.py client-a.pptx client-a-content.json final.pptx
```

---

### 场景4：调试布局问题

```bash
# 1. 生成标记版缩略图（查看文本占位符）
python scripts/thumbnail.py problematic.pptx debug --outline-placeholders

# 2. 提取问题清单
python scripts/inventory.py problematic.pptx issues.json --issues-only

# 3. 检查issues.json中的溢出和重叠信息
# - overflow.frame.overflow_bottom: 文本溢出底部
# - overflow.slide: 元素超出幻灯片边界
# - overlap.overlapping_shapes: 重叠的形状

# 4. 修复后验证
python scripts/inventory.py fixed.pptx verify.json --issues-only
# 如果没有输出 "No issues discovered"，则修复成功
```

---

### 场景5：高级XML编辑

```bash
# 1. 解包
python ooxml/scripts/unpack.py presentation.pptx unpacked/

# 2. 编辑XML
# 例如：修改 unpacked/ppt/slides/slide1.xml

# 3. 验证修改
python ooxml/scripts/validate.py unpacked/ --original presentation.pptx -v

# 4. 打包
python ooxml/scripts/pack.py unpacked/ modified.pptx
```

---

## ⚠️ 六、注意事项和最佳实践

### HTML2PPTX注意事项

1. **文本必须包裹**：
   ```html
   ✅ <div><p>文本</p></div>
   ❌ <div>文本</div>  <!-- 不会显示 -->
   ```

2. **颜色格式**：
   - HTML/CSS：使用 `#` 前缀 (`#FF0000`)
   - PptxGenJS：**不使用** `#` 前缀 (`"FF0000"`)

3. **字体选择**：
   - 仅使用Web安全字体
   - ❌ 避免：'Segoe UI', 'SF Pro', 'Roboto'
   - ✅ 使用：Arial, Helvetica, Times New Roman

4. **渐变和图标**：
   - 必须预先转换为PNG
   - 使用Sharp库栅格化SVG

### 文本替换注意事项

1. **清空规则**：所有inventory识别的文本框都会被清空，除非在replacements.json中指定

2. **验证失败**：
   - 文本溢出加剧 → 操作失败
   - 使用手动项目符号 → 警告

3. **shape_id验证**：确保replacements.json中的shape_id在inventory中存在

### OOXML编辑注意事项

1. **元素顺序**：XML元素顺序很重要（如 `<a:bodyPr>`, `<a:lstStyle>`, `<a:p>`）

2. **关系文件**：
   - 添加图片需更新 `_rels/slideN.xml.rels`
   - 添加幻灯片需更新 `presentation.xml.rels`

3. **ID唯一性**：所有元素的ID必须唯一

4. **验证重要**：编辑后务必验证，避免生成损坏文件

---

## 📦 七、依赖库

### 全局已安装

- `pptxgenjs` - JavaScript PPTX生成库
- `playwright` - 浏览器自动化（html2pptx使用）
- `sharp` - 图像处理（图标和渐变栅格化）

### Python依赖（需要安装）

- `python-pptx` - Python PPTX操作库
- `Pillow` - 图像处理
- `defusedxml` - 安全的XML解析
- `six` - Python 2/3兼容

### 系统依赖

- `soffice` (LibreOffice) - 用于PPTX验证和转换
- `pdftoppm` - PDF转图片（缩略图生成）

---

## 🚀 快速开始

### 创建第一个演示文稿

```javascript
// demo.js
const pptxgen = require('pptxgenjs');
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// 添加标题幻灯片
const titleSlide = pptx.addSlide();
titleSlide.addText('我的第一个演示文稿', {
    x: 1, y: 2, w: 8, h: 1.5,
    fontSize: 44, bold: true, align: 'center'
});

// 添加内容幻灯片
const contentSlide = pptx.addSlide();
contentSlide.addText('要点列表', {
    x: 1, y: 0.5, w: 8, h: 0.75,
    fontSize: 32, bold: true
});

contentSlide.addText([
    { text: '第一点', options: { bullet: true } },
    { text: '第二点', options: { bullet: true } },
    { text: '第三点', options: { bullet: true } }
], { x: 1.5, y: 1.5, w: 7, h: 3 });

// 保存
pptx.writeFile({ fileName: 'first-presentation.pptx' });
console.log('演示文稿已创建！');
```

运行：
```bash
node demo.js
```

---

## 📚 更多资源

- **HTML2PPTX详细文档**：`html2pptx.md`
- **OOXML技术参考**：`ooxml.md`
- **Python脚本技能**：`SKILL.md`
- **PptxGenJS官方文档**：https://gitbrent.github.io/PptxGenJS/
- **Office Open XML标准**：ISO/IEC 29500

---

## 💡 总结

本工具集提供了三个层次的PowerPoint操作能力：

1. **高层API**（推荐）：
   - HTML2PPTX：设计导向
   - PptxGenJS：数据导向

2. **中层工具**：
   - inventory.py：内容提取
   - replace.py：批量替换
   - rearrange.py：幻灯片重组
   - thumbnail.py：预览生成

3. **底层操作**（高级）：
   - OOXML直接编辑
   - XML验证和打包

根据需求选择合适的工具组合，可以高效完成各种演示文稿自动化任务！

