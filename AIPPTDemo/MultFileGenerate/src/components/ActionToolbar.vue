<script setup lang="ts">
import IconSearch from './icons/IconSearch.vue'
import IconThink from './icons/IconThink.vue'
import IconImage from './icons/IconImage.vue'
import IconLanguage from './icons/IconLanguage.vue'
import IconDropdown from './icons/IconDropdown.vue'
import IconArrowRight from './icons/IconArrowRight.vue'
import IconInspiration from './icons/IconInspiration.vue'

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
  isGeneratingInspiration: boolean
  inspirationCompleted: boolean
  isInspirationEdited: boolean
  optimizedText: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: []
  inspiration: []
  inspirationOptimize: []
  optimize: []
}>()

const showToolbar = () => {
  // 工具栏在整个流程中始终显示
  return true
}

const showOptimizedButtons = () => {
  return props.optimizedText && !props.isOptimizing && !props.isStreaming
}

const showInspirationButtons = () => {
  return props.inspirationCompleted && !showOptimizedButtons()
}

</script>

<template>
  <div v-show="showToolbar()" class="inputbox__action">
    <!-- 输入主题和粘贴大纲时显示的工具栏 -->
    <template v-if="activeTab === 'topic' || activeTab === 'paste'">
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

      <!-- 优化或流式输出时的 loading 状态 -->
      <template v-if="isOptimizing || isStreaming">
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <span class="loading-text">{{ isOptimizing ? '正在优化...' : '正在生成...' }}</span>
        </div>
      </template>

      <!-- 优化完成后显示一键优化/给我灵感和立即生成按钮 -->
      <template v-else-if="showOptimizedButtons()">
        <button
          v-if="!inputText.trim()"
          class="inspiration-btn"
          @click="emit('inspiration')"
        >
          <IconInspiration />
          <span class="inspiration-tooltip">给我灵感</span>
        </button>

        <button
          v-else
          class="optimize-btn"
          @click="emit('optimize')"
        >
          <IconInspiration />
          <span class="optimize-tooltip">一键优化</span>
        </button>

        <div class="inputbox__action-divider"></div>

        <button class="submit-btn submit-btn--text" @click="emit('submit')">
          <span>立即生成</span>
          <IconArrowRight />
        </button>
      </template>

      <!-- 灵感完成后直接显示优化按钮 -->
      <template v-else-if="showInspirationButtons()">
        <button class="optimize-btn" @click="emit('inspirationOptimize')">
          <IconInspiration />
          <span class="optimize-tooltip">一键优化</span>
        </button>

        <div class="inputbox__action-divider"></div>

        <button class="submit-btn submit-btn--text" @click="emit('submit')">
          <span>立即生成</span>
          <IconArrowRight />
        </button>
      </template>

      <!-- 正常状态显示给我灵感/一键优化和立即生成按钮 -->
      <template v-else>
        <!-- 生成灵感时的 loading 状态 -->
        <template v-if="isGeneratingInspiration">
          <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span class="loading-text">正在生成灵感...</span>
          </div>
        </template>

        <!-- 正常按钮状态 -->
        <template v-else>
          <button
            v-if="!inputText.trim() && !isOptimizing"
            class="inspiration-btn"
            @click="emit('inspiration')"
          >
            <IconInspiration />
            <span class="inspiration-tooltip">给我灵感</span>
          </button>

          <button
            v-if="inputText.trim() && !isOptimizing && !inspirationCompleted"
            class="optimize-btn"
            @click="emit('optimize')"
          >
            <IconInspiration />
            <span class="optimize-tooltip">一键优化</span>
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
  gap: 6px;
  padding: 6px 12px;
  background: #f7f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 18px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f2f3f5;
  border-color: #c9cdd4;
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

.inspiration-btn {
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

.inspiration-btn:hover {
  background: #f5f5f5;
  border: none;
  box-shadow: none;
}

.inspiration-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #667eea;
  transition: all 0.3s ease;
  display: block;
  margin: 0;
}

.inspiration-btn:hover svg {
  color: #667eea;
}

.inspiration-tooltip {
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

.inspiration-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(45, 50, 56, 0.95);
}

.inspiration-btn:hover .inspiration-tooltip {
  opacity: 1;
  visibility: visible;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
</style>

