<template>
  <div class="pentagon-container">
    <div class="content-wrapper">
      <!-- 标题 -->
      <div class="chart-header">
        <div class="header-tag">分类类 | 05</div>
        <h1 class="chart-title">五段式版式</h1>
        <div class="chart-subtitle">A FISH DESIGN</div>
      </div>

      <!-- 图表主体 -->
      <div class="pentagon-content">
        <!-- 外围虚线五边形 -->
        <svg class="outer-pentagon-svg" viewBox="0 0 1200 600">
          <defs>
            <linearGradient id="dashedLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: #6a88a8; stop-opacity: 0.6" />
              <stop offset="100%" style="stop-color: #4a6b8a; stop-opacity: 0.6" />
            </linearGradient>
          </defs>
          <!-- 五条虚线连接外部圆点 -->
          <!-- 顶部 → 右上 -->
          <line x1="600" y1="0" x2="1020" y2="80" class="dashed-line" />
          <!-- 右上 → 右下 -->
          <line x1="1020" y1="80" x2="980" y2="540" class="dashed-line" />
          <!-- 右下 → 左下 -->
          <line x1="980" y1="540" x2="220" y2="540" class="dashed-line" />
          <!-- 左下 → 左上 -->
          <line x1="220" y1="540" x2="180" y2="80" class="dashed-line" />
          <!-- 左上 → 顶部 -->
          <line x1="180" y1="80" x2="600" y2="0" class="dashed-line" />
        </svg>

        <!-- 中心五边形 -->
        <div class="center-pentagon">
          <svg class="pentagon-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #4a6b8a; stop-opacity: 1" />
                <stop offset="50%" style="stop-color: #5d7a96; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #4a6b8a; stop-opacity: 1" />
              </linearGradient>
            </defs>
            <!-- 五边形 -->
            <polygon points="100,20 180,75 150,160 50,160 20,75" class="pentagon-shape" />
          </svg>

          <!-- 中心文字 -->
          <div class="center-text">
            <div class="center-title">请输入</div>
            <div class="center-subtitle">内容</div>
          </div>

          <!-- 连接线 -->
          <div class="connection-line line-top">
            <div class="line-end-dot"></div>
          </div>
          <div class="connection-line line-top-right">
            <div class="line-end-dot"></div>
          </div>
          <div class="connection-line line-bottom-right">
            <div class="line-end-dot"></div>
          </div>
          <div class="connection-line line-bottom-left">
            <div class="line-end-dot"></div>
          </div>
          <div class="connection-line line-top-left">
            <div class="line-end-dot"></div>
          </div>
        </div>

        <!-- 顶部卡片 -->
        <div class="info-card card-top">
          <div class="card-header-box">请输入标题</div>
          <p class="card-text">
            请输入正文内容，简洁明了，避免过多的文字，使用图表或要点来辅助说明
          </p>
        </div>

        <!-- 右上卡片 -->
        <div class="info-card card-top-right">
          <div class="card-header-box">请输入标题</div>
          <p class="card-text">
            请输入正文内容，简洁明了，避免过多的文字，使用图表或要点来辅助说明
          </p>
        </div>

        <!-- 右下卡片 -->
        <div class="info-card card-bottom-right">
          <div class="card-header-box">请输入标题</div>
          <p class="card-text">
            请输入正文内容，简洁明了，避免过多的文字，使用图表或要点来辅助说明
          </p>
        </div>

        <!-- 左下卡片 -->
        <div class="info-card card-bottom-left">
          <div class="card-header-box">请输入标题</div>
          <p class="card-text">
            请输入正文内容，简洁明了，避免过多的文字，使用图表或要点来辅助说明
          </p>
        </div>

        <!-- 左上卡片 -->
        <div class="info-card card-top-left">
          <div class="card-header-box">请输入标题</div>
          <p class="card-text">
            请输入正文内容，简洁明了，避免过多的文字，使用图表或要点来辅助说明
          </p>
        </div>
      </div>
    </div>

    <!-- 说明文档区域 -->
    <div class="documentation-section">
      <div class="doc-container">
        <div class="doc-column">
          <h2 class="doc-title">📐 五段式环形图表核心特性</h2>

          <div class="feature-item">
            <h3>1. 中心放射结构</h3>
            <p>采用五边形为中心，5个内容卡片围绕分布，形成对称美观的放射状布局。</p>
          </div>

          <div class="feature-item">
            <h3>2. 几何图形设计</h3>
            <p><strong>核心元素：</strong></p>
            <ul>
              <li><strong>中心五边形：</strong>使用SVG绘制，带渐变填充和阴影效果</li>
              <li><strong>外围虚线框：</strong>连接5个外部圆点，形成虚线五边形边界</li>
              <li><strong>放射连接线：</strong>从中心延伸到各个卡片</li>
              <li><strong>末端圆点：</strong>位于连接线末端，白色渐变 + 蓝色边框</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>3. 精确角度计算</h3>
            <p><strong>五边形顶点分布：</strong></p>
            <ul>
              <li>顶部：0° (正上方)</li>
              <li>右上：72° (顺时针)</li>
              <li>右下：144°</li>
              <li>左下：216°</li>
              <li>左上：288°</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>4. 卡片定位系统</h3>
            <p>使用绝对定位 + transform，确保5个卡片均匀分布在环形周围，与五边形顶点对应。</p>
          </div>

          <div class="feature-item">
            <h3>5. 视觉层次</h3>
            <p><strong>Z轴层叠：</strong></p>
            <ul>
              <li>连接线：z-index: 1（最底层）</li>
              <li>五边形：z-index: 10（中间层）</li>
              <li>卡片：z-index: 20（最上层）</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>6. 对称美学</h3>
            <p>严格的径向对称设计，中心点为视觉焦点，所有元素围绕中心平衡分布。</p>
          </div>

          <div class="feature-item">
            <h3>7. 适用场景</h3>
            <ul>
              <li>要点分类展示（5个维度）</li>
              <li>流程步骤说明</li>
              <li>特性功能介绍</li>
              <li>团队分工展示</li>
            </ul>
          </div>
        </div>

        <div class="doc-column">
          <h2 class="doc-title">🤖 AI修改环形图表的难点</h2>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>1. SVG几何路径计算</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>五边形坐标：</strong>需要使用三角函数计算每个顶点的精确坐标</li>
              <li>
                <strong>公式：</strong>x = centerX + radius * sin(angle), y = centerY - radius *
                cos(angle)
              </li>
              <li><strong>SVG viewBox：</strong>坐标系与CSS像素的映射关系</li>
            </ul>
            <p><strong>AI局限：</strong>数学计算虽准确，但调试视觉效果需要反复测试。</p>
          </div>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>2. 径向布局定位</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>卡片位置：</strong>5个卡片需沿圆周均匀分布，每个相隔72°</li>
              <li><strong>偏移计算：</strong>卡片宽高不同，需计算合适的半径和偏移量</li>
              <li><strong>响应式：</strong>不同屏幕下保持圆形布局比例</li>
            </ul>
            <p><strong>AI局限：</strong>难以判断卡片与中心的最佳距离，易出现重叠或间距过大。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>3. 连接线与虚线框架</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>径向连接线：</strong>从中心延伸到末端圆点，使用CSS rotate控制角度</li>
              <li><strong>外围虚线框：</strong>SVG line连接5个外部圆点，需精确计算坐标</li>
              <li><strong>坐标对应：</strong>虚线端点必须与连接线末端圆点精确对齐</li>
              <li><strong>虚线样式：</strong>stroke-dasharray调整虚线间隔和长度</li>
            </ul>
            <p><strong>AI局限：</strong>多层几何图形叠加，坐标系转换复杂，需反复调试对齐。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>4. 对称性保持</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>视觉平衡：</strong>5个元素必须完美对称，任何偏差都很明显</li>
              <li><strong>像素误差：</strong>浮点数计算可能导致亚像素偏移</li>
              <li><strong>浏览器差异：</strong>不同浏览器渲染SVG可能有细微差异</li>
            </ul>
            <p><strong>AI局限：</strong>无法实时预览，难以发现细微的不对称。</p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>5. 改为N段式布局</h3>
            </div>
            <p><strong>难点：</strong>从五段式改为三段、四段、六段等：</p>
            <ul>
              <li>重新计算角度（360° / N）</li>
              <li>调整多边形 polygon points</li>
              <li>修改卡片数量和位置</li>
            </ul>
            <p><strong>AI优势：</strong>可以通过参数化实现，但需要人工验证视觉效果。</p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>6. 交互动画设计</h3>
            </div>
            <p><strong>潜在优化：</strong></p>
            <ul>
              <li>卡片悬停放大 + 连接线高亮</li>
              <li>五边形旋转动画</li>
              <li>内容卡片依次渐入</li>
            </ul>
            <p><strong>AI局限：</strong>动画的"优雅度"难以量化，需要设计师审美判断。</p>
          </div>

          <div class="summary-box">
            <h3>💡 环形图表 vs 线性图表</h3>
            <div class="summary-grid">
              <div class="summary-col">
                <h4>✅ 环形优势</h4>
                <ul>
                  <li>视觉聚焦性强</li>
                  <li>对称美观</li>
                  <li>适合分类展示</li>
                  <li>空间利用率高</li>
                </ul>
              </div>
              <div class="summary-col">
                <h4>❌ 环形劣势</h4>
                <ul>
                  <li>定位计算复杂</li>
                  <li>响应式困难</li>
                  <li>不适合流程图</li>
                  <li>内容量受限</li>
                </ul>
              </div>
            </div>
            <p class="summary-note">
              <strong>选择建议：</strong>5-8个要点的分类展示用环形，时间流程用线性时间轴
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
  console.log('五段式环形图表已加载')
})
</script>

<style scoped>
.pentagon-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8ecf1 0%, #dde3eb 50%, #d2dae4 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.pentagon-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: radial-gradient(circle at 50% 50%, rgba(58, 90, 122, 0.06) 0%, transparent 60%);
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
  margin-bottom: 30px;
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
.pentagon-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  margin: 0 auto;
  z-index: 1;
}

/* 外围虚线五边形 */
.outer-pentagon-svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.dashed-line {
  stroke: #5d7a96;
  stroke-width: 3;
  stroke-dasharray: 10 8;
  stroke-linecap: round;
  fill: none;
  opacity: 0.5;
  filter: drop-shadow(0 2px 6px rgba(74, 107, 138, 0.25));
  transition: all 0.3s ease;
}

.outer-pentagon-svg:hover .dashed-line {
  opacity: 0.8;
  stroke-width: 4;
}

/* 中心五边形容器 */
.center-pentagon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  z-index: 10;
}

/* SVG五边形 */
.pentagon-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 20px rgba(58, 90, 122, 0.3));
}

.pentagon-shape {
  fill: url(#pentagonGradient);
  stroke: #3a5a7a;
  stroke-width: 3;
  transition: all 0.3s ease;
}

.pentagon-shape:hover {
  stroke: #4a6b8a;
  stroke-width: 4;
}

/* 中心文字 */
.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 15;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.center-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.center-subtitle {
  font-size: 16px;
  font-weight: 500;
}

/* 连接线 */
.connection-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 2px;
  background: linear-gradient(to right, #4a6b8a 0%, rgba(74, 107, 138, 0.3) 100%);
  transform-origin: left center;
  z-index: 1;
}

/* 连接线末端圆点 */
.line-end-dot {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #ffffff 0%, #f0f4f8 100%);
  border: 3px solid #3a5a7a;
  border-radius: 50%;
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.6),
    0 2px 8px rgba(58, 90, 122, 0.4);
  z-index: 5;
}

.line-top {
  transform: translate(0, -50%) rotate(-90deg);
}

.line-top-right {
  transform: translate(0, -50%) rotate(-18deg);
}

.line-bottom-right {
  transform: translate(0, -50%) rotate(54deg);
}

.line-bottom-left {
  transform: translate(0, -50%) rotate(126deg);
}

.line-top-left {
  transform: translate(0, -50%) rotate(198deg);
}

/* 信息卡片 */
.info-card {
  position: absolute;
  width: 200px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  padding: 16px;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(74, 107, 138, 0.15);
  transition: all 0.3s ease;
  z-index: 20;
}

.info-card:hover {
  transform: scale(1.05);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.18),
    0 4px 8px rgba(0, 0, 0, 0.12);
}

.card-header-box {
  background: linear-gradient(135deg, #3a5a7a 0%, #4a6b8a 100%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(58, 90, 122, 0.3);
}

.card-text {
  color: #3a4a5a;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}

/* 卡片位置 - 五个方向 */
.card-top {
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.card-top-right {
  right: 80px;
  top: 80px;
}

.card-bottom-right {
  right: 120px;
  bottom: 60px;
}

.card-bottom-left {
  left: 120px;
  bottom: 60px;
}

.card-top-left {
  left: 80px;
  top: 80px;
}

/* ============================================
   说明文档区域样式
   ============================================ */

.documentation-section {
  width: 100%;
  background: linear-gradient(180deg, #d2dae4 0%, #c2ccd8 100%);
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

  .pentagon-content {
    height: 500px;
  }

  .info-card {
    width: 160px;
    padding: 12px;
  }

  .card-header-box {
    font-size: 12px;
    padding: 6px 10px;
  }

  .card-text {
    font-size: 11px;
  }
}

/* SVG渐变定义 */
.pentagon-svg defs {
  display: none;
}
</style>

<style>
/* 全局SVG渐变 - 需要在非scoped中定义 */
svg defs {
  display: block;
}
</style>
