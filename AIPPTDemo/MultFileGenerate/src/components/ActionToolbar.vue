<script setup lang="ts">
import IconSearch from './icons/IconSearch.vue'
import IconThink from './icons/IconThink.vue'
import IconImage from './icons/IconImage.vue'
import IconLanguage from './icons/IconLanguage.vue'
import IconDropdown from './icons/IconDropdown.vue'
import IconArrowRight from './icons/IconArrowRight.vue'
import IconMagicWand from './icons/IconMagicWand.vue'
import IconRetry from './icons/IconRetry.vue'
import IconCancel from './icons/IconCancel.vue'

interface UploadedFile {
  name: string
  size: number
  type: string
}

interface Props {
  activeTab: string
  inputText: string
  uploadedFiles: UploadedFile[]
  isOptimizing: boolean
  isStreaming: boolean
  optimizedText: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: []
  optimize: []
  stop: []
  retry: []
  cancel: []
}>()

const showToolbar = () => {
  // 工具栏在整个流程中始终显示
  return true
}

const showOptimizedButtons = () => {
  return props.optimizedText && !props.isOptimizing && !props.isStreaming
}
</script>

<template>
  <div v-show="showToolbar()" class="inputbox__action">
    <!-- 输入主题和粘贴大纲时显示的工具栏 -->
    <template v-if="activeTab === 'topic' || activeTab === 'paste'">
      <!-- 优化或流式输出时的状态 - 替换整个操作栏 -->
      <template v-if="isOptimizing || isStreaming">
        <div class="optimizing-status">
          <span class="optimizing-text">提示词优化中</span>
          <button v-if="isStreaming && isOptimizing" class="stop-btn-inline" @click="emit('stop')">
            <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M512 928A416 416 0 1 1 928 512 416 416 0 0 1 512 928z m0-768A352 352 0 1 0 864 512 352 352 0 0 0 512 160z m96 512h-192a64 64 0 0 1-64-64v-192a64 64 0 0 1 64-64h192a64 64 0 0 1 64 64v192a64 64 0 0 1-64 64z"
                fill="currentColor"
              />
            </svg>
            <span>终止</span>
          </button>
        </div>
      </template>

      <!-- 非优化状态 -->
      <template v-else>
        <button class="action-btn">
          <IconSearch />
          <span class="action__text">联网搜索</span>
        </button>

        <button class="action-btn action-btn--dropdown">
          <IconThink />
          <span>深度思考</span>
          <IconDropdown />
        </button>

        <button class="action-btn action-btn--dropdown">
          <IconImage />
          <span>AI 生图</span>
          <IconDropdown />
        </button>

        <button class="action-btn action-btn--dropdown">
          <IconLanguage />
          <span>中文</span>
          <IconDropdown />
        </button>

        <div class="action__spacer"></div>

        <!-- 优化完成后显示重试、放弃和立即生成按钮 -->
        <template v-if="showOptimizedButtons()">
          <button class="retry-btn" @click="emit('retry')">
            <IconRetry />
            <span>重试</span>
          </button>

          <button class="cancel-btn" @click="emit('cancel')">
            <IconCancel />
            <span>放弃</span>
          </button>

          <div class="inputbox__action-divider"></div>

          <button class="submit-btn submit-btn--text" @click="emit('submit')">
            <span>立即生成</span>
            <IconArrowRight />
          </button>
        </template>

        <!-- 正常状态显示一键优化和立即生成按钮 -->
        <template v-else>
          <button
            v-if="!isOptimizing"
            class="optimize-btn optimize-btn--highlight"
            @click="emit('optimize')"
          >
            <IconMagicWand />
            <span class="optimize-tooltip">针对输入框中的提示词进行内容与结构上的优化</span>
          </button>

          <div class="inputbox__action-divider"></div>

          <button class="submit-btn submit-btn--text" @click="emit('submit')">
            <span>立即生成</span>
            <IconArrowRight />
          </button>
        </template>
      </template>
    </template>

    <!-- 上传文档时显示的工具栏 -->
    <template v-else-if="activeTab === 'upload'">
      <button class="action-btn action-btn--dropdown">
        <IconImage />
        <span>AI 生图</span>
        <IconDropdown />
      </button>

      <div class="action__spacer"></div>

      <button
        class="submit-btn submit-btn--text"
        :disabled="uploadedFiles.length === 0"
        @click="emit('submit')"
      >
        <span>立即生成</span>
        <IconArrowRight />
      </button>
    </template>
  </div>
</template>

<style scoped>
.inputbox__action {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--kd-space-150, 6px) var(--kd-space-250, 10px) var(--kd-space-150, 6px) var(--kd-space-250, 10px);
  height: 32px;
  min-width: 0;
  transition: all .3s;
  box-sizing: border-box;
  border-radius: var(--kd-border-radius-circle, 999px);
  border: none;
  background: var(--kd-color-state-normal);
  font-weight: 400;
  cursor: pointer;
}

.action-btn:hover {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-icon {
  width: 14px;
  height: 14px;
  margin-left: -2px;
}

.action__spacer {
  flex: 1;
}

.inputbox__action-divider {
  width: 1px;
  height: 20px;
  background: #e1e4e8;
  margin: 0 4px;
}

.optimize-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  vertical-align: middle;
  width: auto;
  height: auto;
  box-sizing: border-box;
  position: relative;
}

.optimize-btn:hover {
  background: #f5f5f5;
  border: none;
  box-shadow: none;
}

.optimize-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #667eea;
  transition: all 0.3s ease;
  display: block;
  margin: 0;
}

.optimize-btn:hover svg {
  color: #667eea;
}

/* 高亮样式 */
.optimize-btn--highlight {
  background: transparent;
}

.optimize-btn--highlight:hover {
  background: rgba(102, 126, 234, 0.15);
}

.optimize-btn--highlight svg {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.optimize-btn--highlight:hover svg {
  color: #667eea;
  filter: drop-shadow(0 0 4px rgba(102, 126, 234, 0.7));
}

.optimize-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  padding: 6px 12px;
  background: rgba(45, 50, 56, 0.95);
  color: #ffffff;
  border-radius: 6px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  font-weight: 500;
  z-index: 1000;
}

.optimize-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(45, 50, 56, 0.95);
}

.optimize-btn:hover .optimize-tooltip {
  opacity: 1;
  visibility: visible;
}

/* 优化状态样式 */
.optimizing-status {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: space-between;
}

.optimizing-text {
  font-size: 14px;
  color: #8f959e;
  font-weight: 400;
}

.stop-btn-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 16px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.stop-btn-inline:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.stop-btn-inline svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.stop-btn-inline span {
  font-weight: 500;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e1e4e8;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 13px;
  color: #8f959e;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  background: rgba(156, 117, 240, 1);
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: #ffffff;
  white-space: nowrap;
  vertical-align: middle;
  height: 40px;
  box-sizing: border-box;
}

.submit-btn:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
  margin: 0;
}

.submit-btn span {
  font-weight: 500;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}

.retry-btn,
.cancel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e1e4e8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  height: 40px;
  box-sizing: border-box;
}

.retry-btn {
  background: #ffffff;
  color: #646a73;
}

.retry-btn:hover {
  background: #f7f8fa;
  border-color: #c9cdd4;
  color: #1f2329;
}

.cancel-btn {
  background: #ffffff;
  color: #646a73;
}

.cancel-btn:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.retry-btn svg,
.cancel-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
}
</style>
