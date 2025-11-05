<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const textareaRef = ref<HTMLDivElement | null>(null)
const hasContent = ref(false)
const isOptimizing = ref(false)
const showComparison = ref(false)
const originalText = ref('')
const optimizedText = ref('')
const shouldStop = ref(false) // 用于控制是否终止优化

const updateContentState = () => {
  if (textareaRef.value) {
    const text = textareaRef.value.innerText.trim()
    hasContent.value = text.length > 0
    console.log('Content updated:', text, 'hasContent:', hasContent.value)
  }
}

// 流式生成文本函数
const streamText = async (fullText: string) => {
  optimizedText.value = ''
  const chars = fullText.split('')

  for (let i = 0; i < chars.length; i++) {
    // 检查是否需要终止
    if (shouldStop.value) {
      break
    }
    optimizedText.value += chars[i]
    // 随机延迟，模拟真实的流式生成效果
    const delay = Math.random() * 30 + 20 // 20-50ms之间
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

const handleOptimize = async () => {
  if (textareaRef.value) {
    originalText.value = textareaRef.value.innerText.trim()
    isOptimizing.value = true
    showComparison.value = true
    optimizedText.value = ''
    shouldStop.value = false

    // 模拟 AI 优化过程 - 流式生成
    const mockOptimizedText = originalText.value + '（已优化）'

    // 先延迟一小段时间模拟AI思考
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 检查是否被终止
    if (!shouldStop.value) {
      // 开始流式生成
      await streamText(mockOptimizedText)
    }

    isOptimizing.value = false
  }
}

const handleRetry = async () => {
  isOptimizing.value = true
  optimizedText.value = ''
  shouldStop.value = false

  // 模拟重新生成
  const mockOptimizedText = originalText.value + '（重新优化）'

  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!shouldStop.value) {
    await streamText(mockOptimizedText)
  }

  isOptimizing.value = false
}

const handleStop = () => {
  shouldStop.value = true
  isOptimizing.value = false
}

const handleCancel = () => {
  showComparison.value = false
  optimizedText.value = ''
  shouldStop.value = false
}

const handleConfirm = () => {
  if (textareaRef.value) {
    textareaRef.value.innerText = optimizedText.value
    showComparison.value = false
    optimizedText.value = ''
  }
}

onMounted(() => {
  nextTick(() => {
    if (textareaRef.value) {
      console.log('Adding event listener to textarea')
      textareaRef.value.addEventListener('input', updateContentState)
      textareaRef.value.addEventListener('keyup', updateContentState)
      textareaRef.value.addEventListener('paste', updateContentState)
      // 初始检查
      updateContentState()
    }
  })
})
</script>

<template>
  <div class="app-shell">
    <div class="ai-sheet">
      <header class="ai-sheet__header">
        <div class="header-left">
          <div class="logo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient
                  id="logoGradientA"
                  x1="8.3"
                  y1="2.36"
                  x2="-2.52"
                  y2="20.64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#391ef0" />
                  <stop offset="1" stop-color="#5dabff" />
                </linearGradient>
                <linearGradient
                  id="logoGradientB"
                  x1="16.38"
                  y1="3.56"
                  x2="8"
                  y2="3.56"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#37b2fc" />
                  <stop offset="1" stop-color="#2052fc" />
                </linearGradient>
                <linearGradient
                  id="logoGradientC"
                  x1="21.61"
                  y1="19.23"
                  x2="14.34"
                  y2="9.75"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#ffa8f0" />
                  <stop offset="1" stop-color="#ee00ff" />
                </linearGradient>
              </defs>
              <path
                d="M9.79 3.56h5.19c.28 0 .51.23.51.51 0 .08-.02.15-.05.22L8.38 18.88a1.57 1.57 0 0 1-1.43.95H.7a.51.51 0 0 1-.48-.69L7.31 5.12A1.57 1.57 0 0 1 9.79 3.56Z"
                fill="url(#logoGradientA)"
              />
              <path
                d="M15.5 4.08c0-.28-.23-.51-.51-.51H9.79c-.55 0-1.07.17-1.51.45l3.66 7.52 3.51-7.22c.03-.07.05-.14.05-.23Z"
                fill="url(#logoGradientB)"
              />
              <path
                d="M20.45 13.08l3.2 6.61c.13.26.02.57-.23.69a.51.51 0 0 1-.23.06h-5.2c-1.05 0-2.01-.6-2.47-1.54l-3.56-7.35h6.02c1.06 0 2.02.6 2.47 1.54Z"
                fill="url(#logoGradientC)"
              />
            </svg>
          </div>
          <span class="header-title">AI 生成单页</span>
        </div>
        <button class="icon-button" aria-label="关闭">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 13L13 3M3 3l10 10" stroke-linecap="round" />
          </svg>
        </button>
      </header>

      <section class="editor-card">
        <div class="editor-card__input" v-if="!showComparison">
          <div
            ref="textareaRef"
            class="editor-card__textarea"
            contenteditable="true"
            spellcheck="false"
            data-placeholder="请输入幻灯片正文页主题或粘贴大纲内容"
          ></div>
          <div class="editor-card__footer">
            <button class="btn btn-light">
              <span class="btn__icon">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M14.75 8A6.75 6.75 0 1 1 1.25 8m13.5 0A6.75 6.75 0 1 0 1.25 8m13.5 0H1.25m6.31-6.67C4.33 5.16 4.32 10.78 7.52 14.63m.96-13.3c3.23 3.83 3.24 9.45.03 13.3"
                    stroke-linejoin="miter"
                  />
                </svg>
              </span>
              联网搜索
            </button>
            <button class="btn btn-light dropdown">
              <span>生成 1 页</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4.25 6.5 3.74 3.49L11.75 6.5" stroke-linecap="round" />
              </svg>
            </button>
            <button class="btn btn-light dropdown">
              <span>简体中文</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4.25 6.5 3.74 3.49L11.75 6.5" stroke-linecap="round" />
              </svg>
            </button>
            <div class="editor-card__spacer" aria-hidden="true"></div>

            <!-- 一键优化按钮 -->
            <button
              v-show="hasContent && !showComparison"
              class="btn-optimize"
              :class="{ 'btn-optimize-loading': isOptimizing }"
              type="button"
              @click="handleOptimize"
              :disabled="isOptimizing"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" v-if="!isOptimizing">
                <path
                  d="M7.5 7.15 9.49 3.02a.1.1 0 0 1 .18 0L11.5 7.15l3.48 1.84a.1.1 0 0 1 0 .18L11.5 10.85l-1.99 4.13a.1.1 0 0 1-.18 0L7.5 10.85l-3.48-1.84a.1.1 0 0 1 0-.18Z"
                  fill="none"
                  stroke-width=".9"
                />
                <path
                  d="m2.59 2.73.9-1.7a.1.1 0 0 1 .18 0l.9 1.7 1.57.76a.1.1 0 0 1 0 .18l-1.57.76-.9 1.71a.1.1 0 0 1-.18 0l-.9-1.7-1.57-.76a.1.1 0 0 1 0-.18Z"
                  fill="none"
                  stroke-width=".9"
                />
              </svg>
              <!-- Loading 动画 -->
              <svg viewBox="0 0 16 16" aria-hidden="true" v-else class="loading-spinner">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="none"
                  stroke-width="2"
                  stroke-dasharray="31.4 31.4"
                />
              </svg>
              {{ isOptimizing ? '优化中...' : '一键优化' }}
            </button>

            <div class="divider" aria-hidden="true"></div>
            <button class="btn btn-primary" :disabled="!hasContent">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M5.42 3.57c-.35-.21-.78.11-.69.51l.84 3.61c.01.07.07.12.14.12h2.3a.3.3 0 1 1 0 .6H5.71a.15.15 0 0 0-.14.12l-.84 3.6c-.09.4.34.72.68.51l6.87-3.03a.4.4 0 0 0 0-.72Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 优化对比区域 -->
        <div class="comparison-view" v-if="showComparison">
          <div class="comparison-content">
            <!-- 优化前 -->
            <div class="comparison-row">
              <div class="comparison-label-inline">
                <span class="label-badge original">优化前</span>
                <span class="label-content label-content-original">{{ originalText }}</span>
              </div>
            </div>

            <!-- 优化后 -->
            <div class="comparison-row">
              <div class="comparison-label-inline">
                <span class="label-badge optimized">优化后</span>
                <!-- 思考阶段：显示loading点 -->
                <div class="loading-indicator" v-if="isOptimizing && !optimizedText">
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                </div>
                <!-- 生成阶段或完成阶段：显示文本 -->
                <span class="label-content label-content-optimized" v-if="optimizedText">
                  {{ optimizedText }}
                  <!-- 流式生成中显示闪烁光标 -->
                  <span class="typing-cursor" v-if="isOptimizing">|</span>
                </span>
              </div>
            </div>
          </div>

          <div class="comparison-tip">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 11.5V8M8 5.5v.5" stroke-linecap="round" />
            </svg>
            <span>您的指令已经非常清晰明确，无需优化，可直接使用</span>
          </div>

          <!-- 优化中状态的Footer -->
          <div class="editor-card__footer-optimizing" v-if="isOptimizing">
            <div class="optimizing-status">
              <div class="optimizing-text">
                <div class="loading-dots">
                  <div class="loading-dot-small"></div>
                  <div class="loading-dot-small"></div>
                  <div class="loading-dot-small"></div>
                </div>
                <span>提示词优化中...</span>
              </div>
              <button class="btn-stop" @click="handleStop">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke-width="1.5" />
                </svg>
                <span>终止</span>
              </button>
            </div>
          </div>

          <!-- 正常状态的Footer -->
          <div class="editor-card__footer" v-else>
            <button class="btn btn-light">
              <span class="btn__icon">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M14.75 8A6.75 6.75 0 1 1 1.25 8m13.5 0A6.75 6.75 0 1 0 1.25 8m13.5 0H1.25m6.31-6.67C4.33 5.16 4.32 10.78 7.52 14.63m.96-13.3c3.23 3.83 3.24 9.45.03 13.3"
                    stroke-linejoin="miter"
                  />
                </svg>
              </span>
              联网搜索
            </button>
            <button class="btn btn-light dropdown">
              <span>生成 1 页</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4.25 6.5 3.74 3.49L11.75 6.5" stroke-linecap="round" />
              </svg>
            </button>
            <button class="btn btn-light dropdown">
              <span>简体中文</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4.25 6.5 3.74 3.49L11.75 6.5" stroke-linecap="round" />
              </svg>
            </button>
            <div class="editor-card__spacer" aria-hidden="true"></div>

            <!-- 重试和取消按钮 -->
            <button class="action-btn" @click="handleRetry">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2.5 8A5.5 5.5 0 1 1 8 13.5M2.5 8V3.5M2.5 8h4.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>重试</span>
            </button>
            <button class="action-btn" @click="handleCancel">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 12L12 4M4 4l8 8" stroke-linecap="round" />
              </svg>
              <span>取消</span>
            </button>

            <div class="divider" aria-hidden="true"></div>
            <button class="btn btn-primary" @click="handleConfirm">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M5.42 3.57c-.35-.21-.78.11-.69.51l.84 3.61c.01.07.07.12.14.12h2.3a.3.3 0 1 1 0 .6H5.71a.15.15 0 0 0-.14.12l-.84 3.6c-.09.4.34.72.68.51l6.87-3.03a.4.4 0 0 0 0-.72Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section class="format-card">
        <div class="format-card__title">选择版式</div>
        <div class="format-card__list">
          <div class="format-card__item active">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m7.5 7.15 1.99-4.13a.1.1 0 0 1 .18 0l1.99 4.13 3.48 1.84a.1.1 0 0 1 0 .18l-3.48 1.84-1.99 4.13a.1.1 0 0 1-.18 0L7.5 11.01 4.02 9.18a.1.1 0 0 1 0-.18Z"
                fill="none"
                stroke-width=".9"
              />
              <path
                d="m2.59 2.73.9-1.7a.1.1 0 0 1 .18 0l.9 1.7 1.57.76a.1.1 0 0 1 0 .18l-1.57.76-.9 1.71a.1.1 0 0 1-.18 0l-.9-1.7-1.57-.76a.1.1 0 0 1 0-.18Z"
                fill="none"
                stroke-width=".9"
              />
            </svg>
            <span>智能匹配</span>
          </div>
          <div class="format-card__item">
            <div class="layout layout--left-text"></div>
          </div>
          <div class="format-card__item">
            <div class="layout layout--three-cols"></div>
          </div>
          <div class="format-card__item">
            <div class="layout layout--grid-images"></div>
          </div>
          <div class="format-card__item">
            <div class="layout layout--multi-lines"></div>
          </div>
          <div class="format-card__item">
            <div class="layout layout--sidebar"></div>
          </div>
          <div class="format-card__item">
            <div class="layout layout--split"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', sans-serif;
  background: #ffffff;
  color: #1f2329;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.ai-sheet {
  width: min(1340px, 100%);
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e5e6eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ai-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e6eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo svg {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: grid;
  place-items: center;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-button:hover {
  background: #f5f5f5;
}

.icon-button svg {
  width: 16px;
  height: 16px;
  stroke: #8f959e;
  fill: none;
  stroke-width: 1.5;
}

.editor-card {
  position: relative;
}

.editor-card__input {
  background: #fff;
  border: 2px solid #d9dce0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.editor-card__input::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    #ff9a76 0%,
    #c084fc 25%,
    #7ea3ff 50%,
    #60d5ff 75%,
    #ffd976 100%
  );
}

.editor-card__textarea {
  min-height: 168px;
  padding: 20px 24px 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2329;
  outline: none;
}

.editor-card__textarea:empty:before {
  content: attr(data-placeholder);
  color: #c9cdd4;
  pointer-events: none;
  display: block;
}

.btn-optimize {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 32px;
  border-radius: 6px;
  border: 1.5px solid #8b5cf6;
  background: #ffffff;
  color: #8b5cf6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-optimize:hover {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
}

.btn-optimize:hover svg {
  stroke: #ffffff;
}

.btn-optimize:active {
  background: #7c3aed;
  border-color: #7c3aed;
  transform: translateY(1px);
}

.btn-optimize:active svg {
  stroke: #ffffff;
}

.btn-optimize svg {
  width: 14px;
  height: 14px;
  stroke: #8b5cf6;
  fill: none;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.btn-optimize-loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-spinner {
  animation: rotate 1s linear infinite;
}

.loading-spinner circle {
  stroke: #8b5cf6;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: 15.7;
  }
  100% {
    stroke-dashoffset: 31.4;
  }
}

.editor-card__footer {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  gap: 10px;
  border-top: 1px solid #e5e6eb;
  background: #fafbfc;
}

.editor-card__spacer {
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e6eb;
  font-size: 13px;
  color: #1f2329;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn__icon svg,
.btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

.btn-light {
  color: #646a73;
}

.btn-light:hover {
  background: #f7f8fa;
  border-color: #d9dce0;
}

.dropdown {
  padding-right: 10px;
}

.dropdown svg {
  width: 12px;
  height: 12px;
  margin-left: 4px;
}

.btn-primary {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  display: grid;
  place-items: center;
  color: #fff;
  cursor: pointer;
  opacity: 1;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-primary svg {
  width: 20px;
  height: 20px;
  stroke: none;
  fill: currentColor;
}

.divider {
  width: 1px;
  height: 20px;
  background: #e5e6eb;
}

.format-card__title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  color: #1f2329;
}

.format-card__list {
  display: flex;
  align-items: stretch;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.format-card__list::-webkit-scrollbar {
  height: 6px;
}

.format-card__list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.format-card__item {
  flex: 0 0 140px;
  height: 110px;
  border-radius: 12px;
  border: 2px solid #d9dce0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.format-card__item:hover {
  border-color: #8b5cf6;
  background: #faf8ff;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
}

.format-card__item svg {
  width: 40px;
  height: 40px;
  stroke: #8b5cf6;
  fill: none;
  stroke-width: 1;
}

.format-card__item.active {
  background: #f3f0ff;
  border-color: #8b5cf6;
  color: #6d28d9;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.format-card__item .layout {
  width: 90px;
  height: 62px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e6eb;
  position: relative;
  overflow: hidden;
}

.layout::before,
.layout::after {
  content: '';
  position: absolute;
  background: #c9cdd4;
  border-radius: 3px;
}

.layout--left-text::before {
  top: 14px;
  left: 10px;
  width: 28px;
  height: 28px;
  border-radius: 4px;
}

.layout--left-text::after {
  top: 14px;
  left: 44px;
  right: 10px;
  height: 4px;
  box-shadow:
    0 8px 0 #c9cdd4,
    0 16px 0 #c9cdd4;
}

.layout--three-cols::before {
  top: 14px;
  left: 10px;
  right: 10px;
  bottom: 14px;
  background: repeating-linear-gradient(
    90deg,
    #c9cdd4 0,
    #c9cdd4 16px,
    transparent 16px,
    transparent 26px
  );
}

.layout--grid-images::before {
  top: 14px;
  left: 10px;
  width: 20px;
  height: 16px;
  border-radius: 3px;
  background: #c9cdd4;
  box-shadow:
    28px 0 0 #c9cdd4,
    56px 0 0 #c9cdd4;
}

.layout--grid-images::after {
  bottom: 14px;
  left: 10px;
  right: 10px;
  height: 4px;
  background: #c9cdd4;
  box-shadow: 0 8px 0 #c9cdd4;
}

.layout--multi-lines::before {
  top: 14px;
  left: 10px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c9cdd4;
  box-shadow:
    0 10px 0 #c9cdd4,
    0 20px 0 #c9cdd4;
}

.layout--multi-lines::after {
  top: 14px;
  left: 20px;
  right: 10px;
  height: 4px;
  background: #c9cdd4;
  box-shadow:
    0 10px 0 #c9cdd4,
    0 20px 0 #c9cdd4;
}

.layout--sidebar::before {
  top: 14px;
  left: 10px;
  bottom: 14px;
  right: 44px;
  border-radius: 3px;
}

.layout--sidebar::after {
  top: 14px;
  right: 10px;
  bottom: 14px;
  width: 28px;
  border-radius: 3px;
}

.layout--split::before {
  top: 14px;
  left: 10px;
  width: 6px;
  height: 4px;
  background: #c9cdd4;
  box-shadow: 12px 0 0 #c9cdd4;
}

.layout--split::after {
  top: 24px;
  left: 10px;
  right: 10px;
  height: 4px;
  background: #c9cdd4;
  box-shadow:
    0 8px 0 #c9cdd4,
    0 16px 0 #c9cdd4;
}

/* 优化对比视图 */
.comparison-view {
  padding: 0;
  border: 2px solid #d9dce0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 20px;
}

.comparison-row {
  padding: 12px 0;
}

.comparison-row:not(:last-child) {
  border-bottom: 1px solid #e5e6eb;
}

.comparison-label-inline {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.6;
}

.label-badge {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  font-style: italic;
  white-space: nowrap;
}

.label-badge.original {
  background: #f7f8fa;
  color: #8f959e;
}

.label-badge.optimized {
  background: #dcfce7;
  color: #16a34a;
}

.label-content {
  flex: 1;
  color: #1f2329;
}

/* 优化前：单行显示+省略号+灰色 */
.label-content-original {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #8f959e;
}

/* 优化后：正常多行展示 */
.label-content-optimized {
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* 流式生成闪烁光标 */
.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #22c55e;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.loading-indicator {
  display: flex;
  gap: 8px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: loadingDot 1.4s infinite;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDot {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.comparison-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 13px;
  color: #8f959e;
  background: #fafbfc;
  border-top: 1px solid #e5e6eb;
}

.comparison-tip svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e6eb;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f7f8fa;
  border-color: #d9dce0;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.loading-spinner-small {
  animation: rotate 1s linear infinite;
}

.loading-spinner-small circle {
  stroke: currentColor;
  animation: dash 1.5s ease-in-out infinite;
}

/* 优化中状态的Footer */
.editor-card__footer-optimizing {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e5e6eb;
  background: #fafbfc;
}

.optimizing-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.optimizing-text {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #646a73;
  font-size: 14px;
}

.loading-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.loading-dot-small {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8b5cf6;
  animation: loadingDot 1.4s infinite;
}

.loading-dot-small:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot-small:nth-child(3) {
  animation-delay: 0.4s;
}

/* 终止按钮 */
.btn-stop {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  background: #ffffff;
  color: #646a73;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-stop:hover {
  background: #f7f8fa;
  border-color: #d9dce0;
  color: #1f2329;
}

.btn-stop:active {
  transform: translateY(1px);
}

.btn-stop svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .ai-sheet {
    padding: 20px;
  }

  .editor-card__textarea {
    min-height: 140px;
    padding: 16px 20px;
  }

  .editor-card__footer {
    flex-wrap: wrap;
    gap: 10px;
  }

  .editor-card__spacer {
    display: none;
  }

  .dropdown-group {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
