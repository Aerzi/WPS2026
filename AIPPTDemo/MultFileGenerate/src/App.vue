<script setup lang="ts">
import { ref } from 'vue'
import PreferenceModal from './components/PreferenceModal.vue'
import FileUpload from './components/FileUpload.vue'
import EditorPanel from './components/EditorPanel.vue'
import ActionToolbar from './components/ActionToolbar.vue'
import ExampleTags from './components/ExampleTags.vue'

interface UploadedFile {
  name: string
  size: number
  type: string
}

const activeTab = ref('topic')
const inputText = ref('')
const maxLength = 5000
const uploadedFiles = ref<UploadedFile[]>([])
const showPreferenceModal = ref(false)
const isOptimizing = ref(false)
const optimizedText = ref('')
const originalText = ref('')
const displayedText = ref('')
const isStreaming = ref(false)
let streamIntervalId: number | null = null

const examples = [
  'AI对传统教育的影响',
  '《西游记》名著导读后感',
  '人形机器人行业分析',
  '体育运动与健康',
]

// 热点提示词（用于placeholder）
const hotTopics = [
  '人工智能发展趋势',
  '可持续能源革命',
  '元宇宙商业应用',
  '量子计算突破',
  '生物科技创新',
]

const currentPlaceholder = ref('')

// 随机选择一个热点提示词
const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * hotTopics.length)
  currentPlaceholder.value = hotTopics[randomIndex]
}

// 初始化placeholder
getRandomPlaceholder()

const handleSubmit = () => {
  if (activeTab.value === 'upload' && uploadedFiles.value.length > 0) {
    // 上传模式且有文件，显示偏好弹窗
    showPreferenceModal.value = true
  } else {
    // 如果输入框为空，使用placeholder的内容
    if (!inputText.value.trim() && currentPlaceholder.value) {
      inputText.value = currentPlaceholder.value
    }
    // 提交（现在始终可以提交，因为有placeholder作为后备）
    if (inputText.value.trim() || currentPlaceholder.value) {
      showPreferenceModal.value = true
    }
  }
}

const handlePreferenceConfirm = (preference: string) => {
  console.log('选择的偏好:', preference)
  console.log('开始生成大纲...')
  showPreferenceModal.value = false
}

const handlePreferenceClose = () => {
  showPreferenceModal.value = false
}

// 将文本分割成板块（按句子、段落分割）
const splitIntoChunks = (text: string): string[] => {
  // 按句号、问号、感叹号、换行符等分割
  const chunks: string[] = []
  let currentChunk = ''

  for (let i = 0; i < text.length; i++) {
    currentChunk += text[i]

    // 遇到句号、问号、感叹号、分号、换行符时，作为一个板块
    if (/[。！？；\n]/.test(text[i])) {
      // 如果下一个字符是引号或括号，也包含进去
      if (i + 1 < text.length && /[""''）]/.test(text[i + 1])) {
        currentChunk += text[i + 1]
        i++
      }
      chunks.push(currentChunk)
      currentChunk = ''
    }
    // 遇到逗号、顿号时，如果当前板块已经有内容，也作为一个板块
    else if (/[，、]/.test(text[i]) && currentChunk.length > 10) {
      chunks.push(currentChunk)
      currentChunk = ''
    }
  }

  // 如果还有剩余内容，也作为一个板块
  if (currentChunk.trim()) {
    chunks.push(currentChunk)
  }

  return chunks.length > 0 ? chunks : [text]
}

// 终止流式生成
const handleStop = () => {
  // 停止流式输出
  if (streamIntervalId) {
    clearInterval(streamIntervalId)
    streamIntervalId = null
  }

  // 更新状态
  isStreaming.value = false
  isOptimizing.value = false

  // 如果正在优化，保留已生成的内容
  if (optimizedText.value) {
    inputText.value = displayedText.value || optimizedText.value
  }
}

const handleOptimize = () => {
  // 如果输入框为空，使用placeholder作为优化文本
  const textToOptimize = inputText.value.trim() || currentPlaceholder.value
  console.log('一键优化文本:', textToOptimize)

  // 立即保存原始文本并显示优化前板块
  const currentText = textToOptimize
  // 保存上一次优化后的文本（在清空之前）
  const previousOptimizedText = optimizedText.value

  // 先停止之前的流式输出（如果存在）
  if (streamIntervalId) {
    clearInterval(streamIntervalId)
    streamIntervalId = null
  }

  // 清除之前的状态
  displayedText.value = ''
  isStreaming.value = false

  // 设置新的优化状态 - 确保顺序正确
  // 如果 originalText 为空，保存当前文本
  // 如果 originalText 不为空，但当前文本等于上一次优化后的文本，说明是再次优化，保持 originalText 不变
  // 如果 originalText 不为空，但当前文本不等于上一次优化后的文本，说明用户输入了新文本，更新 originalText
  if (!originalText.value) {
    // 第一次优化，保存原始文本
    originalText.value = currentText
  } else if (previousOptimizedText && currentText !== previousOptimizedText) {
    // 用户输入了新文本（当前文本既不是 originalText 也不是上一次的 optimizedText）
    originalText.value = currentText
  }
  // 如果 currentText === previousOptimizedText，说明是再次优化，保持 originalText 不变
  isOptimizing.value = true // 先设置 isOptimizing，确保 showLabel 立即为 true
  optimizedText.value = '' // 清空优化后的文本，让对比视图显示优化前
  inputText.value = '' // 清空输入框，准备显示流式生成的优化后文本

  // 模拟优化过程，生成优化后的文本
  const optimizedContent = `60多年前就提出的AI概念，为何会在今年迎来爆发？1956年，一批年轻且富有远见卓识的科学家们提出"AI"这一术语，其后几十年间，对AI技术的探索始终停留于学术研究层面，其间还曾几度因为遭到质疑而陷入停滞。而AI作为一种通用型技术为社会不同产业所接受则是近两年的事，特别是2017年，以现实的商业需求为主导的新一轮AI复兴，正让AI成为全民关注的焦点。凯文·凯利曾预言AI在未来将会成为一种可供人人购买的智能服务。目前来看虽然AI与商业的融合尚处于初期阶段，但智能终端设备制造商对AI技术的探索，正让这一预言逐步得到应验。最典型莫过于智能手机行业，华为已发布AI芯片麒麟970和首款AI手机Mate10，三星正加大对AI芯片投资力度，苹果则明确表示旗下产品未来将作为AI的主要平台。在愈发激烈的商业竞争带动下，AI产业迎来新一轮复兴。`

  // 模拟优化延迟后开始流式输出
  setTimeout(() => {
    optimizedText.value = optimizedContent
    // 开始流式输出，在流式输出过程中更新 inputText
    streamTextForOptimize(optimizedContent)
    console.log('优化完成:', optimizedContent)
  }, 1000)
}

// 优化专用的流式输出函数，同时更新 inputText（按板块输出）
const streamTextForOptimize = (text: string) => {
  displayedText.value = ''
  inputText.value = ''
  isStreaming.value = true
  const chunks = splitIntoChunks(text)
  let chunkIndex = 0

  streamIntervalId = setInterval(() => {
    if (chunkIndex < chunks.length) {
      displayedText.value += chunks[chunkIndex]
      inputText.value += chunks[chunkIndex]
      chunkIndex++
    } else {
      if (streamIntervalId) clearInterval(streamIntervalId)
      streamIntervalId = null
      isStreaming.value = false
      isOptimizing.value = false
    }
  }, 150) as unknown as number // 每150毫秒输出一个板块
}

const handleRetry = () => {
  // 重新使用原始文本进行优化
  inputText.value = originalText.value
  displayedText.value = ''
  handleOptimize()
}

const handleCancel = () => {
  // 恢复原始文本并清除优化状态
  inputText.value = originalText.value
  isOptimizing.value = false
  isStreaming.value = false
  optimizedText.value = ''
  originalText.value = ''
  displayedText.value = ''
}

const refreshExamples = () => {
  console.log('刷新示例')
  // 同时刷新placeholder
  getRandomPlaceholder()
}

const selectExample = (example: string) => {
  inputText.value = example
}

const addFile = (file: File) => {
  uploadedFiles.value.push({
    name: file.name,
    size: file.size,
    type: file.type,
  })
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// 获取 placeholder（保留以备将来使用）
// const getPlaceholder = () => {
//   if (activeTab.value === 'topic') {
//     return currentPlaceholder.value || '人工智能发展趋势'
//   } else if (activeTab.value === 'paste') {
//     return currentPlaceholder.value || '人工智能发展趋势'
//   }
//   return '请输入内容...'
// }
</script>

<template>
  <div class="aippt-container">
    <div class="aippt-header">
      <h1 class="aippt-slogan">与 AI 边聊边改，轻松创作 PPT</h1>
    </div>

    <div class="aippt-content">
      <!-- 输入区域包装器 -->
      <div class="ppt-input-wrapper">
        <!-- 输入区域 -->
        <div
          class="ppt-input-container"
          :class="{ 'ppt-input-container--upload': activeTab === 'upload' }"
        >
          <!-- 上传文档界面 -->
          <FileUpload
            v-if="activeTab === 'upload'"
            v-model:uploadedFiles="uploadedFiles"
            @addFile="addFile"
            @removeFile="removeFile"
          />

          <!-- 文本输入界面（输入主题/粘贴大纲） -->
          <EditorPanel
            v-else
            v-model="inputText"
            :placeholder="currentPlaceholder"
            :maxLength="maxLength"
            :showLabel="!!optimizedText || (!!originalText && isOptimizing)"
            :originalText="originalText"
            :isStreaming="isStreaming"
            :isOptimizing="isOptimizing"
          />

          <!-- 工具栏 -->
          <ActionToolbar
            :activeTab="activeTab"
            :inputText="inputText"
            :uploadedFiles="uploadedFiles"
            :isOptimizing="isOptimizing"
            :isStreaming="isStreaming"
            :optimizedText="optimizedText"
            @retry="handleRetry"
            @cancel="handleCancel"
            @submit="handleSubmit"
            @optimize="handleOptimize"
            @stop="handleStop"
          />
        </div>
      </div>

      <!-- 示例标签（仅在非上传文档时显示） -->
      <ExampleTags
        v-if="activeTab !== 'upload'"
        :examples="examples"
        @selectExample="selectExample"
        @refresh="refreshExamples"
      />
    </div>

    <!-- 偏好设置弹窗 -->
    <PreferenceModal
      :show="showPreferenceModal"
      @close="handlePreferenceClose"
      @confirm="handlePreferenceConfirm"
    />
  </div>
</template>

<style scoped>
.aippt-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding: 40px 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', sans-serif;
}

.aippt-header {
  text-align: center;
  margin-bottom: 40px;
}

.aippt-slogan {
  font-size: 36px;
  font-weight: 600;
  color: #1f2329;
  margin: 0;
  letter-spacing: -0.5px;
}

.aippt-content {
  width: 1000px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 输入区域包装器 */
.ppt-input-wrapper {
  position: relative;
}

/* 输入区域 */
.ppt-input-container {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 234px;
  display: flex;
  flex-direction: column;
}

.editor-panel {
  margin-bottom: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor {
  width: 100%;
  height: 166px;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2329;
  font-family: inherit;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.editor::placeholder {
  color: #bbbfc4;
}

/* 优化视图 */
.optimize-view {
  margin-bottom: 12px;
  height: 166px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.optimize-section {
  padding: 4px 0;
  border-bottom: 1px solid #e1e4e8;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.optimize-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
  flex: 1;
  min-height: 0;
}

/* 优化前区域 - 单行显示 */
.optimize-section--before {
  position: relative;
  padding-bottom: 8px;
  flex: 0 0 auto;
  height: auto;
  min-height: 0;
}

.optimize-text-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
  display: inline-block;
  cursor: help;
}

.optimize-text {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #1f2329;
  vertical-align: middle;
  line-height: 1.8;
}

/* 悬浮提示框 */
.optimize-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 12px);
  padding: 16px 20px;
  background: rgba(45, 50, 56, 0.95);
  color: #ffffff;
  font-size: 14px;
  line-height: 1.8;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 600px;
  min-width: 300px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  z-index: 1000;
  pointer-events: none;
}

/* 悬浮提示框的小三角 */
.optimize-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: rgba(45, 50, 56, 0.95);
}

.optimize-text-wrapper:hover .optimize-tooltip {
  opacity: 1;
  visibility: visible;
}

/* 优化内容包装器 */
.optimize-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.optimize-wrapper .loading-footer {
  background: #ffffff;
}

/* 可滚动的优化内容区域 */
.optimize-scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding: 4px 0;
}

/* 优化后区域的滚动条样式 */
.optimize-scrollable::-webkit-scrollbar {
  width: 6px;
}

.optimize-scrollable::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.optimize-scrollable::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.optimize-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
}

.optimize-label {
  display: inline-block;
  font-size: 13px;
  font-style: italic;
  font-weight: 500;
  color: #646a73;
  width: 60px;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 8px;
  vertical-align: middle;
}

.optimize-label--before {
  color: #5b6066;
  background-color: rgba(185, 191, 202, 0.2);
}

.optimize-label--after {
  display: inline-block;
  color: #52c41a;
  background-color: rgba(120, 193, 61, 0.2);
}

.optimize-text-content {
  display: inline;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2329;
  white-space: pre-wrap;
  word-break: break-word;
}

.optimizing-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f9ff;
  border: 1px solid #91d5ff;
  border-radius: 12px;
  font-size: 12px;
  color: #1890ff;
  font-weight: normal;
  margin-left: 6px;
  margin-right: 8px;
  vertical-align: middle;
}

.optimize-content {
  display: block;
  padding: 0;
  background: transparent;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2329;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 覆盖基础样式，确保单行显示 */
.optimize-content.optimize-content--single-line {
  display: flex !important;
  align-items: center;
  white-space: nowrap !important;
  word-break: normal !important;
  overflow: hidden;
  line-height: 1.8;
}

.optimize-content.optimize-content--single-line .optimize-label {
  flex-shrink: 0;
  display: inline-block;
}

.optimize-scrollable .optimize-label {
  display: block;
  margin-bottom: 8px;
}

/* 优化完成后的内容区域 */
.optimize-content-completed {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

.optimize-content-completed::-webkit-scrollbar {
  width: 6px;
}

.optimize-content-completed::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.optimize-content-completed::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.optimize-content-completed::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
}

.optimize-content--loading {
  color: #1f2329;
}

.loading-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  flex-shrink: 0;
  background: transparent;
}

.loading-text {
  display: inline-block;
  position: relative;
  padding-left: 22px;
  font-size: 13px;
  color: #8f959e;
}

.loading-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border: 2px solid #e1e4e8;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* 终止按钮 */
.stop-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 16px;
  font-size: 12px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.stop-btn:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.stop-btn svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* 流式输出文本样式 */
.streaming-text {
  display: inline;
  color: #1f2329;
  margin-top: 0;
}

.optimize-streaming-text {
  display: block;
  margin-top: 8px;
}

.streaming-cursor::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
  color: #667eea;
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

/* 文件上传区域 */
.file-upload-area {
  min-height: 300px;
  background: #f7f8fa;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  transition: all 0.3s;
  border: 2px dashed #e1e4e8;
  margin-bottom: 16px;
}

.file-upload-area--dragging {
  background: #f2f5ff;
  border-color: #3370ff;
}

.file-upload-content {
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.file-upload-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 12px;
}

.file-upload-desc {
  font-size: 13px;
  color: #8f959e;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #8f959e;
}

.file-upload-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.file-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 24px;
  font-size: 14px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.file-btn:hover {
  background: #f2f3f5;
  border-color: #3370ff;
  color: #3370ff;
}

.file-btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.file-input-label {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
}

.ppt-input-container--upload {
  padding: 20px;
}

.ppt-input-container--upload .inputbox__action {
  border-top: 1px solid #e1e4e8;
  padding-top: 12px;
  margin-top: 0;
}

/* 已上传文件列表 */
.uploaded-files {
  background: #f7f8fa;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-item:hover {
  border-color: #3370ff;
  box-shadow: 0 2px 8px rgba(51, 112, 255, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon svg {
  width: 24px;
  height: 24px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #8f959e;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f7f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 20px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.delete-btn:hover svg path {
  stroke: #ff4d4f;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

/* 响应式 */
@media (max-width: 1300px) {
  .aippt-content {
    width: 100%;
    max-width: 100%;
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .aippt-slogan {
    font-size: 24px;
  }
}
</style>
