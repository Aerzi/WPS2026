<template>
  <div class="timeline-container">
    <div class="content-wrapper">
      <!-- 标题 -->
      <div class="chart-header">
        <div class="header-tag">流程类 | 03</div>
        <h1 class="chart-title">时间轴/工作成果</h1>
        <div class="chart-subtitle">A FISH DESIGN</div>
      </div>

      <!-- 图表主体 -->
      <div class="timeline-content">
        <!-- 上方卡片组 -->
        <div class="cards-top">
          <!-- 成本控制 -->
          <div class="timeline-card card-blue" style="margin-left: 60px">
            <div class="card-header">成本控制</div>
            <div class="card-body">
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">2024年Q1各部门的支出相较于预算低5%，节省了150万元的费用</div>
              </div>
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">成果：通过优质资源的采购支出精控制在预算范围内</div>
              </div>
            </div>
            <div class="connector-line top-line" style="left: 50%"></div>
          </div>

          <!-- 提升转化率 -->
          <div class="timeline-card card-yellow" style="margin-left: 300px">
            <div class="card-header">提升转化率</div>
            <div class="card-body">
              <div class="card-item">
                <div class="dot yellow-dot"></div>
                <div class="card-text">
                  强化销售培训和CRM系统应用，Q2销售转化率提升至22%，增长4%
                </div>
              </div>
              <div class="card-item">
                <div class="dot yellow-dot"></div>
                <div class="card-text">成果：销售转化率提高4%，带动季度营销额增长约15%</div>
              </div>
            </div>
            <div class="connector-line top-line" style="left: 50%"></div>
          </div>

          <!-- 提高工作效率 -->
          <div class="timeline-card card-blue" style="margin-left: 540px">
            <div class="card-header">提高工作效率</div>
            <div class="card-body">
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">
                  通过引入新的任务管理工具和团队协作平台，提高团队工作效率
                </div>
              </div>
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">成果：缩短项目周期10%，提高完成任务</div>
              </div>
            </div>
            <div class="connector-line top-line" style="left: 50%"></div>
          </div>
        </div>

        <!-- 时间轴主体 -->
        <div class="timeline-axis">
          <div class="axis-line">
            <div class="arrow-head"></div>
          </div>

          <!-- 时间节点 -->
          <div class="timeline-points">
            <div class="time-point" style="left: 10%">
              <div class="point-label">第一季度</div>
              <div class="point-circle"></div>
              <div class="point-date">
                <div class="date-title">项目启动</div>
                <div class="date-text">2024.01 - 03</div>
              </div>
            </div>

            <div class="time-point" style="left: 35%">
              <div class="point-label">第二季度</div>
              <div class="point-circle"></div>
              <div class="point-date">
                <div class="date-title">提高转化率</div>
                <div class="date-text">2024.04 - 06</div>
              </div>
            </div>

            <div class="time-point" style="left: 60%">
              <div class="point-label">第三季度</div>
              <div class="point-circle"></div>
              <div class="point-date">
                <div class="date-title">市场推广</div>
                <div class="date-text">2024.07 - 09</div>
              </div>
            </div>

            <div class="time-point" style="left: 85%">
              <div class="point-label">第四季度</div>
              <div class="point-circle"></div>
              <div class="point-date">
                <div class="date-title">团队协作</div>
                <div class="date-text">2024.10 - 12</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方卡片组 -->
        <div class="cards-bottom">
          <!-- 关键项目进展 -->
          <div class="timeline-card card-yellow" style="margin-left: 180px">
            <div class="connector-line bottom-line" style="left: 50%"></div>
            <div class="card-header">关键项目进展</div>
            <div class="card-body">
              <div class="card-item">
                <div class="dot yellow-dot"></div>
                <div class="card-text">成功启动2个关键项目，交付初步成果，项目进展率达100%</div>
              </div>
              <div class="card-item">
                <div class="dot yellow-dot"></div>
                <div class="card-text">成果：顺利完成项目启动，按时按质量进，达成目标</div>
              </div>
            </div>
          </div>

          <!-- 市场推广 -->
          <div class="timeline-card card-blue" style="margin-left: 420px">
            <div class="connector-line bottom-line" style="left: 50%"></div>
            <div class="card-header">市场推广</div>
            <div class="card-body">
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">新产品已定试初在Q3上线，市场占有率提达5%，超额完成目标</div>
              </div>
              <div class="card-item">
                <div class="dot"></div>
                <div class="card-text">成果：新产品快速获得市场认知，带动销售额增长20%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 说明文档区域 -->
    <div class="documentation-section">
      <div class="doc-container">
        <div class="doc-column">
          <h2 class="doc-title">📊 时间轴图表核心特性</h2>

          <div class="feature-item">
            <h3>1. 水平流程展示</h3>
            <p>采用从左到右的时间轴设计，符合人类阅读习惯，直观展示项目时间线和关键里程碑节点。</p>
          </div>

          <div class="feature-item">
            <h3>2. 多层信息架构</h3>
            <p><strong>三层结构：</strong></p>
            <ul>
              <li><strong>上层卡片：</strong>展示Q1、Q2、Q4的主要工作成果</li>
              <li><strong>时间轴：</strong>4个季度节点，带箭头指向，表示时间流动</li>
              <li><strong>下层卡片：</strong>展示Q1末期、Q3的关键项目进展</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>3. 双色主题系统</h3>
            <p><strong>配色语义化设计：</strong></p>
            <ul>
              <li><strong>深蓝色 (#3a5a7a - #5d7a96)：</strong>管理类、控制类内容</li>
              <li><strong>金黄色 (#c4932a - #e0b560)：</strong>业绩类、提升类内容</li>
              <li><strong>渐变背景：</strong>多层次灰蓝色 + 径向光晕营造专业氛围</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>4. 立体视觉效果</h3>
            <p><strong>6层阴影叠加技术：</strong></p>
            <ul>
              <li>卡片：双层外阴影 + 渐变背景 + 边框</li>
              <li>时间节点：珍珠质感球体（内外阴影 + 光晕 + 高光）</li>
              <li>时间轴线：金属质感（渐变 + 双阴影 + 内高光 + 边框）</li>
              <li>连接线：3px渐变线 + 光晕效果</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>5. 精确定位系统</h3>
            <p><strong>Flexbox + 绝对定位混合布局：</strong></p>
            <ul>
              <li>时间节点使用百分比定位（10% / 35% / 60% / 85%）</li>
              <li>卡片使用固定margin-left对齐时间点</li>
              <li>连接线垂直居中连接卡片与时间轴</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>6. 交互反馈增强</h3>
            <p><strong>悬停动效：</strong></p>
            <ul>
              <li>卡片：上浮8px + 放大1.02倍 + 阴影加深</li>
              <li>时间节点：放大1.15倍 + 光晕扩散</li>
              <li>平滑过渡：0.3s ease动画</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>7. 视口固定布局</h3>
            <p>整个图表固定在100vh视口内，无滚动条，一屏展示所有内容，适合演示和汇报场景。</p>
          </div>
        </div>

        <div class="doc-column">
          <h2 class="doc-title">🤖 AI生成修改HTML的难点分析</h2>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>1. 精确定位与对齐</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li>
                <strong>卡片位置计算：</strong>需要手动调试margin-left值，确保卡片与时间节点视觉对齐
              </li>
              <li><strong>连接线对应：</strong>垂直连接线必须精确连接卡片到时间轴，涉及高度计算</li>
              <li><strong>响应式断点：</strong>不同屏幕尺寸下保持对齐关系极其困难</li>
            </ul>
            <p><strong>AI局限：</strong>无法实时预览，难以判断视觉对齐效果，需要多次迭代调试。</p>
          </div>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>2. 多层阴影与渐变</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li>
                <strong>阴影堆叠顺序：</strong
                >6层box-shadow的参数（偏移、模糊、扩散、颜色）需精确调试
              </li>
              <li><strong>渐变色配比：</strong>时间轴6色渐变，每个色值的位置百分比影响整体视觉</li>
              <li><strong>透明度控制：</strong>rgba的alpha值决定层次感，需反复微调</li>
            </ul>
            <p><strong>AI局限：</strong>无法感知最终渲染效果，难以把握"美感"和"立体感"的平衡点。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>3. 布局逻辑复杂性</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li>
                <strong>混合定位系统：</strong>Flexbox（容器） + 绝对定位（卡片） + 相对定位（圆点）
              </li>
              <li><strong>z-index管理：</strong>圆点(100) > 标签(50) > 时间轴(10) > 背景(0/1)</li>
              <li><strong>溢出控制：</strong>固定视口下的内容裁剪与自适应</li>
            </ul>
            <p><strong>AI局限：</strong>容易产生定位冲突，导致元素错位或被遮挡。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>4. 数学比例计算</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>时间节点分布：</strong>4个节点的left百分比需均匀或按需分布</li>
              <li><strong>卡片间距：</strong>5个卡片的横向间距需考虑宽度(240px) + 边距</li>
              <li>
                <strong>高度协调：</strong>卡片高度(动态) + 连接线(40px) + 时间轴(120px)需和谐
              </li>
            </ul>
            <p>
              <strong>AI局限：</strong>涉及视觉几何学，AI难以理解"视觉平衡"，易产生不协调的比例。
            </p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>5. 交互动画细节</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>缓动函数选择：</strong>ease / ease-in-out / cubic-bezier 影响动画质感</li>
              <li>
                <strong>transform叠加：</strong>translateY + scale 同时作用需考虑transform-origin
              </li>
              <li><strong>性能优化：</strong>避免触发重排（transform优于top/left）</li>
            </ul>
            <p><strong>AI局限：</strong>无法感知动画流畅度和"手感"，只能依赖标准参数。</p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>6. 语义化配色</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>色彩心理学：</strong>蓝色(信任/稳定) vs 黄色(活力/创新)的场景匹配</li>
              <li><strong>对比度控制：</strong>确保文字可读性（WCAG标准）</li>
              <li><strong>品牌一致性：</strong>配色需符合企业VI规范</li>
            </ul>
            <p><strong>AI局限：</strong>缺乏设计美学判断，配色可能"正确但不美"。</p>
          </div>

          <div class="challenge-item easy">
            <div class="challenge-header">
              <span class="difficulty-badge easy">⭐⭐</span>
              <h3>7. 内容文本编辑</h3>
            </div>
            <p><strong>难点：</strong>修改卡片标题、描述、数据，调整季度日期。</p>
            <p><strong>AI优势：</strong>这是AI最擅长的部分，可快速批量修改文本内容。</p>
          </div>

          <div class="summary-box">
            <h3>💡 总结：AI的优势与局限</h3>
            <div class="summary-grid">
              <div class="summary-col">
                <h4>✅ AI擅长的</h4>
                <ul>
                  <li>结构化HTML生成</li>
                  <li>CSS属性编写</li>
                  <li>代码规范维护</li>
                  <li>文本内容修改</li>
                  <li>逻辑问题排查</li>
                </ul>
              </div>
              <div class="summary-col">
                <h4>❌ AI困难的</h4>
                <ul>
                  <li>视觉美感判断</li>
                  <li>精确像素对齐</li>
                  <li>动画流畅度</li>
                  <li>色彩和谐度</li>
                  <li>响应式细节</li>
                </ul>
              </div>
            </div>
            <p class="summary-note">
              <strong>最佳实践：</strong>AI生成初始代码 → 人工微调视觉细节 → AI优化代码结构 →
              迭代完善
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('时间轴图表已加载')
})
</script>

<style scoped>
.timeline-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3e8ef 0%, #d5dce6 50%, #c8d1dd 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.timeline-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background:
    radial-gradient(circle at 20% 30%, rgba(74, 107, 138, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 30%, rgba(212, 163, 74, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 内容包装器 - 图表区域 */
.content-wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

/* 标题区域 */
.chart-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-left: 40px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.header-tag {
  background: linear-gradient(135deg, #3a5a7a 0%, #4a6b8a 100%);
  color: white;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(58, 90, 122, 0.4);
}

.chart-title {
  font-size: 32px;
  font-weight: bold;
  color: #1a2a3a;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-subtitle {
  color: #a0aab6;
  font-size: 18px;
  margin-left: auto;
  padding-right: 40px;
  font-weight: bold;
  letter-spacing: 2px;
}

/* 图表内容区域 */
.timeline-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

/* 卡片通用样式 */
.timeline-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 240px;
  transition: all 0.3s ease;
  border: 1px solid rgba(74, 107, 138, 0.1);
}

.timeline-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-blue .card-header {
  background: linear-gradient(135deg, #3a5a7a 0%, #4a6b8a 50%, #5d7a96 100%);
  box-shadow: 0 4px 12px rgba(58, 90, 122, 0.4);
}

.card-yellow .card-header {
  background: linear-gradient(135deg, #c4932a 0%, #d4a34a 50%, #e0b560 100%);
  box-shadow: 0 4px 12px rgba(196, 147, 42, 0.4);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #3a5a7a 0%, #4a6b8a 100%);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(58, 90, 122, 0.3);
}

.yellow-dot {
  background: linear-gradient(135deg, #c4932a 0%, #d4a34a 100%);
  box-shadow: 0 2px 4px rgba(196, 147, 42, 0.3);
}

.card-text {
  color: #3a4a5a;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 500;
}

/* 连接线 */
.connector-line {
  position: absolute;
  width: 3px;
  height: 40px;
  background: linear-gradient(to bottom, #3a5a7a 0%, #4a6b8a 30%, rgba(74, 107, 138, 0.3) 100%);
  box-shadow: 0 0 4px rgba(58, 90, 122, 0.5);
}

.top-line {
  bottom: -40px;
}

.bottom-line {
  top: -40px;
}

/* 上方卡片容器 */
.cards-top {
  display: flex;
  margin-bottom: 10px;
  position: relative;
  min-height: 160px;
}

/* 时间轴主体 */
.timeline-axis {
  position: relative;
  margin: 60px 0;
  height: 120px;
}

.axis-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 50px;
  height: 40px;
  background: linear-gradient(
    90deg,
    #3a5a7a 0%,
    #4a6b8a 15%,
    #5d7a96 30%,
    #6a88a8 50%,
    #5d7a96 70%,
    #4a6b8a 85%,
    #3a5a7a 100%
  );
  transform: translateY(-50%);
  border-radius: 20px;
  box-shadow:
    0 6px 20px rgba(58, 90, 122, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.arrow-head {
  position: absolute;
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 32px solid transparent;
  border-bottom: 32px solid transparent;
  border-left: 50px solid #4a6b8a;
  filter: drop-shadow(6px 0 12px rgba(58, 90, 122, 0.6)) drop-shadow(2px 0 4px rgba(0, 0, 0, 0.4));
}

/* 时间点 */
.timeline-points {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.time-point {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.point-circle {
  width: 28px;
  height: 28px;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 50%, #f0f4f8 100%);
  border: 5px solid #ffffff;
  border-radius: 50%;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  box-shadow:
    0 0 0 3px #3a5a7a,
    0 0 0 7px rgba(74, 107, 138, 0.4),
    0 0 16px rgba(58, 90, 122, 0.7),
    0 6px 20px rgba(0, 0, 0, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    inset 0 -2px 3px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  transition: all 0.3s ease;
}

/* 时间点圆圈悬停效果 */
.time-point:hover .point-circle {
  transform: scale(1.15);
  box-shadow:
    0 0 0 3px #3a5a7a,
    0 0 0 9px rgba(74, 107, 138, 0.5),
    0 0 20px rgba(58, 90, 122, 0.9),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    inset 0 -2px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.point-label {
  color: #ffffff;
  font-size: 13px;
  white-space: nowrap;
  font-weight: 600;
  text-shadow:
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.6);
  background: rgba(58, 90, 122, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  z-index: 50;
  position: relative;
}

.point-date {
  text-align: center;
  white-space: nowrap;
  z-index: 50;
  position: relative;
  margin-top: 8px;
}

.date-title {
  color: #3a5a7a;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.date-text {
  color: #1a2a3a;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* 下方卡片容器 */
.cards-bottom {
  display: flex;
  margin-top: 10px;
  position: relative;
  min-height: 160px;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .timeline-card {
    width: 240px;
  }

  .cards-top .timeline-card,
  .cards-bottom .timeline-card {
    margin-left: 0 !important;
  }

  .cards-top,
  .cards-bottom {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-around;
  }
}

/* ============================================
   说明文档区域样式
   ============================================ */

.documentation-section {
  width: 100%;
  background: linear-gradient(180deg, #c8d1dd 0%, #b8c3d0 100%);
  padding: 60px 20px 80px;
  position: relative;
  z-index: 2;
  border-top: 3px solid rgba(58, 90, 122, 0.3);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.doc-container {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.doc-column {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  max-height: none;
}

.doc-title {
  font-size: 26px;
  font-weight: bold;
  color: #1a2a3a;
  margin: 0 0 30px 0;
  padding-bottom: 16px;
  border-bottom: 3px solid #4a6b8a;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 特性项 */
.feature-item {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #4a6b8a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(74, 107, 138, 0.2);
}

.feature-item h3 {
  font-size: 18px;
  color: #3a5a7a;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.feature-item p {
  margin: 8px 0;
  color: #3a4a5a;
  line-height: 1.7;
  font-size: 14px;
}

.feature-item ul {
  margin: 10px 0;
  padding-left: 24px;
}

.feature-item li {
  margin: 6px 0;
  color: #4a5a6a;
  line-height: 1.6;
  font-size: 14px;
}

.feature-item strong {
  color: #2a3a4a;
  font-weight: 600;
}

/* 挑战项 */
.challenge-item {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.challenge-item.critical {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border-left: 4px solid #d44444;
}

.challenge-item.high {
  background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
  border-left: 4px solid #e89444;
}

.challenge-item.medium {
  background: linear-gradient(135deg, #fffef0 0%, #ffffff 100%);
  border-left: 4px solid #d4a34a;
}

.challenge-item.easy {
  background: linear-gradient(135deg, #f0fff5 0%, #ffffff 100%);
  border-left: 4px solid #44a464;
}

.challenge-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.difficulty-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.difficulty-badge.hard {
  background: linear-gradient(135deg, #d44444 0%, #e44444 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(212, 68, 68, 0.3);
}

.difficulty-badge.medium {
  background: linear-gradient(135deg, #e89444 0%, #f0a454 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(232, 148, 68, 0.3);
}

.difficulty-badge.normal {
  background: linear-gradient(135deg, #d4a34a 0%, #e0b560 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(212, 163, 74, 0.3);
}

.difficulty-badge.easy {
  background: linear-gradient(135deg, #44a464 0%, #54b474 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(68, 164, 100, 0.3);
}

.challenge-item h3 {
  font-size: 18px;
  color: #2a3a4a;
  margin: 0;
  font-weight: bold;
  flex: 1;
}

.challenge-item p {
  margin: 8px 0;
  color: #3a4a5a;
  line-height: 1.7;
  font-size: 14px;
}

.challenge-item ul {
  margin: 10px 0;
  padding-left: 24px;
}

.challenge-item li {
  margin: 6px 0;
  color: #4a5a6a;
  line-height: 1.6;
  font-size: 14px;
}

.challenge-item strong {
  color: #2a3a4a;
  font-weight: 600;
}

/* 总结框 */
.summary-box {
  margin-top: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #4a6b8a;
  box-shadow: 0 4px 16px rgba(74, 107, 138, 0.2);
}

.summary-box h3 {
  font-size: 20px;
  color: #3a5a7a;
  margin: 0 0 20px 0;
  font-weight: bold;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;
}

.summary-col {
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.summary-col h4 {
  font-size: 16px;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.summary-col:first-child h4 {
  color: #44a464;
}

.summary-col:last-child h4 {
  color: #d44444;
}

.summary-col ul {
  margin: 0;
  padding-left: 20px;
}

.summary-col li {
  margin: 6px 0;
  color: #3a4a5a;
  line-height: 1.6;
  font-size: 14px;
}

.summary-note {
  margin: 16px 0 0 0;
  padding: 16px;
  background: rgba(74, 107, 138, 0.1);
  border-radius: 8px;
  border-left: 4px solid #4a6b8a;
  font-size: 14px;
  color: #2a3a4a;
  line-height: 1.7;
}

.summary-note strong {
  color: #3a5a7a;
  font-weight: 700;
}

/* 响应式 - 文档区域 */
@media (max-width: 1200px) {
  .doc-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
