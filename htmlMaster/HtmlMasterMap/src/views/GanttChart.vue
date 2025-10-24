<template>
  <div class="gantt-container">
    <div class="content-wrapper">
      <!-- 标题 -->
      <div class="chart-header">
        <div class="header-tag">项目类 | 009</div>
        <h1 class="chart-title">主要项目完成情况</h1>
        <div class="chart-subtitle">天蝎PPT | 思维模型·数据分析·工作汇报</div>
      </div>

      <!-- 图表主体 -->
      <div class="gantt-content">
        <!-- 左侧信息面板 -->
        <div class="info-panel">
          <!-- 项目情况卡片 -->
          <div class="info-card project-status">
            <h3 class="card-title">项目情况</h3>
            <div class="progress-section">
              <div class="progress-label">
                整体项目进度：<span class="progress-value">80%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 80%">
                  <div class="progress-handle"></div>
                </div>
              </div>
            </div>
            <div class="task-list">
              <div class="task-item completed">
                <div class="task-checkbox checked"></div>
                <span class="task-text">公司发布会开启审批流程启动</span>
              </div>
              <div class="task-item completed">
                <div class="task-checkbox checked"></div>
                <span class="task-text">寻求广告公司设计宣传物料</span>
              </div>
              <div class="task-item completed">
                <div class="task-checkbox checked"></div>
                <span class="task-text">宣发发布会邀请函和时间安排</span>
              </div>
              <div class="task-item completed">
                <div class="task-checkbox checked"></div>
                <span class="task-text">搭建供应商进场安排布展</span>
              </div>
              <div class="task-item pending">
                <div class="task-checkbox"></div>
                <span class="task-text">发布会召开，全员在自身岗位待命</span>
              </div>
              <div class="task-item pending">
                <div class="task-checkbox"></div>
                <span class="task-text">发布会结束总结评估</span>
              </div>
            </div>
          </div>

          <!-- 困难与支持卡片 -->
          <div class="info-card support-info">
            <h3 class="card-title">遇到困难与支持</h3>
            <p class="support-text">
              可以寻求内部支持，如与团队成员、上级领导或相关部门进行沟通和协作，共同解决问题。
              可以帮助项目团队获取更多的资源、知识和经验，从而更好地应对项目中的困难。
            </p>
          </div>
        </div>

        <!-- 右侧甘特图 -->
        <div class="gantt-chart">
          <!-- 时间轴 -->
          <div class="timeline-header">
            <div class="timeline-month">3月</div>
            <div class="timeline-month">4月</div>
            <div class="timeline-month">5月</div>
            <div class="timeline-month">6月</div>
            <div class="timeline-month">7月</div>
            <div class="timeline-month">8月</div>
          </div>

          <!-- 项目条目 -->
          <div class="gantt-rows">
            <!-- 项目一 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目一</div>
                <div class="project-desc">审批流程启动</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar completed" style="left: 0%; width: 50%">
                  <span class="bar-text">完成</span>
                </div>
              </div>
            </div>

            <!-- 项目二 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目二</div>
                <div class="project-desc">设计宣传物料</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar completed-light" style="left: 16.6%; width: 50%">
                  <span class="bar-text">完成</span>
                </div>
              </div>
            </div>

            <!-- 项目三 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目三</div>
                <div class="project-desc">广告发布宣传</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar completed" style="left: 0%; width: 50%">
                  <span class="bar-text">完成</span>
                </div>
              </div>
            </div>

            <!-- 项目四 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目四</div>
                <div class="project-desc">现场安排布展</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar completed-dark" style="left: 16.6%; width: 33.3%">
                  <span class="bar-text">完成</span>
                </div>
              </div>
            </div>

            <!-- 项目五 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目五</div>
                <div class="project-desc">发布会召开</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar in-progress" style="left: 16.6%; width: 66.6%">
                  <span class="bar-text">推进中</span>
                </div>
              </div>
            </div>

            <!-- 项目六 -->
            <div class="gantt-row">
              <div class="project-label">
                <div class="project-name">项目六</div>
                <div class="project-desc">项目总结评估</div>
              </div>
              <div class="gantt-bar-container">
                <div class="gantt-bar in-progress" style="left: 16.6%; width: 66.6%">
                  <span class="bar-text">推进中</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前时间标记 -->
          <div class="current-time-marker" style="left: 66.6%">
            <div class="marker-triangle"></div>
            <div class="marker-text">当前</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 说明文档区域 -->
    <div class="documentation-section">
      <div class="doc-container">
        <div class="doc-column">
          <h2 class="doc-title">📊 甘特图核心特性</h2>

          <div class="feature-item">
            <h3>1. 时间维度展示</h3>
            <p>横轴为时间轴，纵轴为项目列表，直观展示每个项目的时间跨度和进度状态。</p>
          </div>

          <div class="feature-item">
            <h3>2. 项目状态可视化</h3>
            <p><strong>三种状态颜色：</strong></p>
            <ul>
              <li><strong>深红色/暗红色：</strong>已完成项目</li>
              <li><strong>浅红色/橙色：</strong>已完成项目（次要）</li>
              <li><strong>虚线边框：</strong>进行中项目</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>3. 左侧信息面板</h3>
            <p><strong>双卡片布局：</strong></p>
            <ul>
              <li><strong>项目情况卡片：</strong>整体进度条 + 任务清单（带勾选状态）</li>
              <li><strong>困难与支持：</strong>文字说明区域，提供背景信息</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>4. 当前时间标记</h3>
            <p>三角形箭头 + "当前"标签，明确指示当前时间点在甘特图中的位置。</p>
          </div>

          <div class="feature-item">
            <h3>5. 项目条形图</h3>
            <p><strong>关键元素：</strong></p>
            <ul>
              <li>条形位置：起始时间对应时间轴位置</li>
              <li>条形长度：项目持续时长</li>
              <li>条形颜色：项目完成状态</li>
              <li>内部文字：状态标签（完成/推进中）</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>6. 适用场景</h3>
            <ul>
              <li>项目进度管理与汇报</li>
              <li>多项目并行跟踪</li>
              <li>资源分配规划</li>
              <li>里程碑节点展示</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>7. 交互设计</h3>
            <p>条形图悬停时放大并显示详细信息，进度条可交互调整。</p>
          </div>
        </div>

        <div class="doc-column">
          <h2 class="doc-title">🤖 AI修改甘特图的难点</h2>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>1. 时间轴与条形图对齐</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>百分比计算：</strong>项目起始位置和长度需要根据时间轴精确计算百分比</li>
              <li><strong>公式：</strong>left = (开始月 - 起始月) / 总月数 * 100%</li>
              <li><strong>跨月项目：</strong>横跨多个月的项目长度计算复杂</li>
              <li><strong>边界处理：</strong>项目条不能超出时间轴范围</li>
            </ul>
            <p><strong>AI局限：</strong>无法实时预览对齐效果，需要反复调试百分比数值。</p>
          </div>

          <div class="challenge-item critical">
            <div class="challenge-header">
              <span class="difficulty-badge hard">⭐⭐⭐⭐⭐</span>
              <h3>2. 响应式布局挑战</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>左右分栏：</strong>信息面板（固定宽度）+ 甘特图（自适应）</li>
              <li><strong>时间轴缩放：</strong>不同屏幕宽度下保持月份均匀分布</li>
              <li><strong>条形图重绘：</strong>窗口缩放时条形图需重新计算位置</li>
              <li><strong>文字溢出：</strong>条形图过窄时内部文字处理</li>
            </ul>
            <p><strong>AI局限：</strong>难以预测各种屏幕尺寸下的显示效果。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>3. 状态样式系统</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>多种状态：</strong>完成（深红）、完成（浅红）、进行中（虚线）</li>
              <li><strong>虚线边框：</strong>进行中状态需要border-style: dashed + 圆角处理</li>
              <li><strong>颜色语义：</strong>红色系的深浅搭配需要设计经验</li>
              <li><strong>渐变背景：</strong>条形图内部渐变增强立体感</li>
            </ul>
            <p><strong>AI局限：</strong>颜色美学判断困难，深浅搭配可能不协调。</p>
          </div>

          <div class="challenge-item high">
            <div class="challenge-header">
              <span class="difficulty-badge medium">⭐⭐⭐⭐</span>
              <h3>4. 时间标记定位</h3>
            </div>
            <p><strong>核心难点：</strong></p>
            <ul>
              <li><strong>三角形绘制：</strong>使用CSS border技巧绘制向上三角</li>
              <li><strong>动态定位：</strong>根据当前日期计算在时间轴的位置</li>
              <li><strong>文字对齐：</strong>"当前"文字需要居中对齐三角</li>
            </ul>
            <p><strong>AI局限：</strong>CSS几何形状绘制需要技巧，难以一次性正确。</p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>5. 进度条交互</h3>
            </div>
            <p><strong>难点：</strong>拖拽调整进度、实时更新百分比、滑块跟随。</p>
            <p><strong>AI优势：</strong>可以提供基础拖拽逻辑，但精细交互体验需要人工调优。</p>
          </div>

          <div class="challenge-item medium">
            <div class="challenge-header">
              <span class="difficulty-badge normal">⭐⭐⭐</span>
              <h3>6. 任务清单状态</h3>
            </div>
            <p><strong>难点：</strong></p>
            <ul>
              <li>复选框样式自定义（勾选/未勾选）</li>
              <li>完成任务的文字样式（删除线/灰色）</li>
              <li>点击切换状态的交互逻辑</li>
            </ul>
            <p><strong>AI局限：</strong>自定义表单控件样式较复杂，需要覆盖浏览器默认样式。</p>
          </div>

          <div class="summary-box">
            <h3>💡 甘特图 vs 时间轴图表</h3>
            <div class="summary-grid">
              <div class="summary-col">
                <h4>✅ 甘特图优势</h4>
                <ul>
                  <li>并行项目可视化</li>
                  <li>资源冲突一目了然</li>
                  <li>项目持续时长直观</li>
                  <li>进度偏差易发现</li>
                </ul>
              </div>
              <div class="summary-col">
                <h4>❌ 甘特图劣势</h4>
                <ul>
                  <li>实现复杂度高</li>
                  <li>不适合展示流程</li>
                  <li>项目过多显示拥挤</li>
                  <li>依赖关系难表达</li>
                </ul>
              </div>
            </div>
            <p class="summary-note">
              <strong>选择建议：</strong>项目管理用甘特图，流程展示用时间轴，关系展示用网络图
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
  console.log('甘特图已加载')
})
</script>

<style scoped>
.gantt-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #dde3eb 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.gantt-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: radial-gradient(circle at 30% 40%, rgba(212, 163, 74, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 内容包装器 */
.content-wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.header-tag {
  background: linear-gradient(135deg, #c65a3a 0%, #d86a4a 100%);
  color: white;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(198, 90, 58, 0.4);
}

.chart-title {
  font-size: 32px;
  font-weight: bold;
  color: #1a2a3a;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-subtitle {
  color: #7a8a9a;
  font-size: 14px;
  margin-left: auto;
  padding-right: 20px;
}

/* 图表内容区域 */
.gantt-content {
  display: flex;
  gap: 30px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 左侧信息面板 */
.info-panel {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(198, 90, 58, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #c65a3a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #c65a3a;
}

/* 进度条部分 */
.progress-section {
  margin-bottom: 20px;
}

.progress-label {
  font-size: 16px;
  color: #3a4a5a;
  margin-bottom: 12px;
  font-weight: 500;
}

.progress-value {
  color: #c65a3a;
  font-size: 20px;
  font-weight: bold;
}

.progress-bar-container {
  position: relative;
  width: 100%;
  height: 32px;
  background: #e8ecf1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  position: relative;
  height: 100%;
  background: linear-gradient(135deg, #c65a3a 0%, #d86a4a 50%, #c65a3a 100%);
  border-radius: 16px;
  transition: width 0.5s ease;
  box-shadow: 0 2px 8px rgba(198, 90, 58, 0.4);
}

.progress-handle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 3px solid #c65a3a;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* 任务清单 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateX(4px);
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #8a9aaa;
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
}

.task-checkbox.checked {
  background: #c65a3a;
  border-color: #c65a3a;
}

.task-checkbox.checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.task-text {
  font-size: 14px;
  color: #3a4a5a;
  line-height: 1.5;
}

.task-item.completed .task-text {
  color: #6a7a8a;
}

.task-item.pending .task-text {
  color: #5a6a7a;
}

/* 困难与支持卡片 */
.support-text {
  font-size: 14px;
  color: #4a5a6a;
  line-height: 1.8;
  margin: 0;
}

/* 右侧甘特图 */
.gantt-chart {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* 时间轴头部 */
.timeline-header {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #c65a3a;
}

.timeline-month {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #3a4a5a;
  position: relative;
}

.timeline-month::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 16px;
  background: #d8dce1;
}

.timeline-month:last-child::after {
  display: none;
}

/* 甘特图行 */
.gantt-rows {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.gantt-row {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.project-label {
  width: 150px;
  flex-shrink: 0;
}

.project-name {
  font-size: 14px;
  font-weight: bold;
  color: #c65a3a;
  margin-bottom: 4px;
}

.project-desc {
  font-size: 12px;
  color: #6a7a8a;
}

/* 甘特条形图容器 */
.gantt-bar-container {
  flex: 1;
  height: 48px;
  position: relative;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(216, 106, 74, 0.05) 16.6%,
    transparent 16.6%,
    rgba(216, 106, 74, 0.05) 33.2%,
    transparent 33.2%,
    rgba(216, 106, 74, 0.05) 49.8%,
    transparent 49.8%,
    rgba(216, 106, 74, 0.05) 66.4%,
    transparent 66.4%,
    rgba(216, 106, 74, 0.05) 83%,
    transparent 83%
  );
}

/* 甘特条形图 */
.gantt-bar {
  position: absolute;
  height: 100%;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.gantt-bar:hover {
  transform: scaleY(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.gantt-bar.completed {
  background: linear-gradient(135deg, #8a3a2a 0%, #a64a3a 100%);
  box-shadow: 0 2px 8px rgba(138, 58, 42, 0.4);
}

.gantt-bar.completed-light {
  background: linear-gradient(135deg, #c6654a 0%, #d87a5a 100%);
  box-shadow: 0 2px 8px rgba(198, 101, 74, 0.4);
}

.gantt-bar.completed-dark {
  background: linear-gradient(135deg, #7a2a1a 0%, #9a3a2a 100%);
  box-shadow: 0 2px 8px rgba(122, 42, 26, 0.4);
}

.gantt-bar.in-progress {
  background: transparent;
  border: 3px dashed #c65a3a;
  box-shadow: 0 2px 8px rgba(198, 90, 58, 0.2);
}

.bar-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.gantt-bar.in-progress .bar-text {
  color: #c65a3a;
  text-shadow: none;
}

/* 当前时间标记 */
.current-time-marker {
  position: absolute;
  bottom: -40px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.marker-triangle {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 16px solid #c65a3a;
  filter: drop-shadow(0 2px 4px rgba(198, 90, 58, 0.4));
}

.marker-text {
  margin-top: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #c65a3a;
}

/* ============================================
   说明文档区域样式
   ============================================ */

.documentation-section {
  width: 100%;
  background: linear-gradient(180deg, #dde3eb 0%, #d2dae4 100%);
  padding: 60px 20px 80px;
  position: relative;
  z-index: 2;
  border-top: 3px solid rgba(198, 90, 58, 0.3);
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
  border-bottom: 3px solid #c65a3a;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 特性项 */
.feature-item {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #c65a3a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(198, 90, 58, 0.2);
}

.feature-item h3 {
  font-size: 18px;
  color: #c65a3a;
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
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #c65a3a;
  box-shadow: 0 4px 16px rgba(198, 90, 58, 0.2);
}

.summary-box h3 {
  font-size: 20px;
  color: #c65a3a;
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
  background: rgba(198, 90, 58, 0.1);
  border-radius: 8px;
  border-left: 4px solid #c65a3a;
  font-size: 14px;
  color: #2a3a4a;
  line-height: 1.7;
}

.summary-note strong {
  color: #c65a3a;
  font-weight: 700;
}

/* 响应式 */
@media (max-width: 1200px) {
  .gantt-content {
    flex-direction: column;
  }

  .info-panel {
    width: 100%;
  }

  .doc-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
