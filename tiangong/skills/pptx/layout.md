2. 正文页的页面排版布局只能从以下六类模板中选择，总元素模块数禁止超过6项。（每个布局在HTML生成时对应data-layout属性。）【布局类型】：
2.1 二等分布局（左右1:1或上下1:1） → data-layout="2col-1-1"
- 两个等宽区块（A区/B区）可用于文本+图片、图表+要点卡片等组合。
- A/B区必须为不同元素类型（如A区卡片、B区图表）。
# 正文一级容器：grid grid-cols-2 gap-4 h-full
# 槽位：A、B（各 1/2）
# 代码骨架：
# <div class="w-[1230px] h-[600px] mx-auto px-2 pt-3 pb-3 overflow-hidden">
#   <div class="grid grid-cols-2 gap-4 h-full" data-layout="2col-1-1">
#     <section class="h-full占位卡片类">A</section>
#     <section class="h-full占位卡片类">B</section>
#   </div>
# </div>
2.2 主次分栏布局（2:1） → data-layout="2col-2-1"
- 左主右辅或上下主辅。主区约2/3，辅区约1/3。
- 主区建议放主要论点、核心图表；辅区放要点卡片或说明性图片。
-代码骨架：
# 正文一级容器：grid grid-cols-3 gap-4 h-full
# 槽位：A(col-span-2)、B(col-span-1)
# 代码骨架：
# <div class="...正文区容器">
#   <div class="grid grid-cols-3 gap-4 h-full" data-layout="2col-2-1">
#     <section class="col-span-2 h-full占位卡片类">A</section>
#     <section class="col-span-1 h-full占位卡片类">B</section>
#   </div>
# </div>
2.3 三等分布局（1:1:1） → data-layout="3col-1-1-1"
- 三个并列区域，可放3个要点卡片、3张图片、或图表+文字组合。
- 禁止使用图表超过1个；卡片须对齐。
# 正文一级容器：grid grid-cols-3 gap-4 h-full
# 槽位：col-1、col-2、col-3
# 代码骨架：
# <div class="...正文区容器">
#   <div class="grid grid-cols-3 gap-4 h-full" data-layout="3col-1-1-1">
#     <section class="h-full占位卡片类">col-1</section>
#     <section class="h-full占位卡片类">col-2</section>
#     <section class="h-full占位卡片类">col-3</section>
#   </div>
# </div>
2.4 四象限布局（2×2） → data-layout="grid-2x2"
- 四个等分模块，可作为4项要点卡片、4张小图或4个步骤模块。
- 禁止同时存在图片与图表；所有模块严格对齐。
# D. 四象限（2×2） data-layout="grid-2x2"
# 正文一级容器：grid grid-cols-2 grid-rows-2 gap-4 h-full
# 槽位：q1、q2、q3、q4
# 代码骨架：
# <div class="...正文区容器">
#   <div class="grid grid-cols-2 grid-rows-2 gap-4 h-full" data-layout="grid-2x2">
#     <section class="占位卡片类">q1</section>
#     <section class="占位卡片类">q2</section>
#     <section class="占位卡片类">q3</section>
#     <section class="占位卡片类">q4</section>
#   </div>
# </div>
2.5 左1/2 + 右上下堆叠布局 → data-layout="combo-1-2-stack"
- 左侧为主要内容（图片或图表），右侧上下两个块为文字要点或说明。
- 常用于“图示+两层分析”类内容。
# 正文一级容器：grid grid-cols-2 gap-4 h-full；右列二级容器：grid grid-rows-2 gap-4 h-full
# 槽位：left、right-top、right-bottom
# 代码骨架：
# <div class="...正文区容器">
#   <div class="grid grid-cols-2 gap-4 h-full" data-layout="combo-1-2-stack">
#     <section class="h-full占位卡片类">left</section>
#     <div class="grid grid-rows-2 gap-4 h-full">
#       <section class="占位卡片类">right-top</section>
#       <section class="占位卡片类">right-bottom</section>
#     </div>
#   </div>
# </div>
2.6 左1/3 + 右2/3（1:2） → data-layout="2col-1-2"
- 左侧放辅助元素（如标题卡片、图例），右侧展示主要内容（图表、图片或要点）。
# 正文一级容器：grid grid-cols-3 gap-4 h-full
# 槽位：left(col-span-1)、right(col-span-2)
# 代码骨架：
# <div class="...正文区容器">
#   <div class="grid grid-cols-3 gap-4 h-full" data-layout="2col-1-2">
#     <section class="col-span-1 h-full占位卡片类">left</section>
#     <section class="col-span-2 h-full占位卡片类">right</section>
#   </div>
# </div>