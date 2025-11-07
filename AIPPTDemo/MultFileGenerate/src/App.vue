<script setup lang="ts">
import { ref } from 'vue'
import PreferenceModal from './components/PreferenceModal.vue'
import IconOptimize from './components/icons/IconOptimize.vue'
import IconInspiration from './components/icons/IconInspiration.vue'

interface UploadedFile {
  name: string
  size: number
  type: string
}

const activeTab = ref('topic')
const inputText = ref('')
const maxLength = 5000
const isDragging = ref(false)
const uploadedFiles = ref<UploadedFile[]>([])
const showPreferenceModal = ref(false)
const isOptimizing = ref(false)
const isGeneratingInspiration = ref(false)
const inspirationCompleted = ref(false)
const inspirationText = ref('')
const optimizedText = ref('')
const originalText = ref('')
const displayedText = ref('')
const isStreaming = ref(false)
let streamIntervalId: number | null = null

const tabs = [
  { id: 'topic', label: '输入主题', icon: 'topic' },
  { id: 'upload', label: '上传文档', icon: 'upload' },
  { id: 'paste', label: '粘贴大纲', icon: 'paste' },
]

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

// 流式输出文本的函数
const streamText = (text: string) => {
  displayedText.value = ''
  isStreaming.value = true
  let index = 0

  streamIntervalId = setInterval(() => {
    if (index < text.length) {
      displayedText.value += text[index]
      index++
    } else {
      if (streamIntervalId) clearInterval(streamIntervalId)
      streamIntervalId = null
      isStreaming.value = false
      // 如果是灵感生成完成
      if (inspirationText.value && !isOptimizing.value) {
        inspirationCompleted.value = true
      }
    }
  }, 30) as unknown as number // 每30毫秒显示一个字符
}

// 终止流式生成
const handleStop = () => {
  // 停止流式输出
  if (streamIntervalId) {
    clearInterval(streamIntervalId)
    streamIntervalId = null
  }

  // 清除所有状态
  isOptimizing.value = false
  isGeneratingInspiration.value = false
  inspirationCompleted.value = false
  isStreaming.value = false
  optimizedText.value = ''
  originalText.value = ''
  displayedText.value = ''
  inspirationText.value = ''
  inputText.value = ''
}

const handleOptimize = () => {
  console.log('一键优化文本:', inputText.value)
  originalText.value = inputText.value
  isOptimizing.value = true
  optimizedText.value = ''
  displayedText.value = ''
  // 清除灵感状态
  inspirationCompleted.value = false
  isGeneratingInspiration.value = false
  inspirationText.value = ''

  // 模拟优化过程
  setTimeout(() => {
    optimizedText.value = `60多年前就提出的AI概念，为何会在今年迎来爆发？1956年，一批年轻且富有远见卓识的科学家们提出"AI"这一术语，其后几十年间，对AI技术的探索始终停留于学术研究层面，其间还曾几度因为遭到质疑而陷入停滞。而AI作为一种通用型技术为社会不同产业所接受则是近两年的事，特别是2017年，以现实的商业需求为主导的新一轮AI复兴，正让AI成为全民关注的焦点。凯文·凯利曾预言AI在未来将会成为一种可供人人购买的智能服务。目前来看虽然AI与商业的融合尚处于初期阶段，但智能终端设备制造商对AI技术的探索，正让这一预言逐步得到应验。最典型莫过于智能手机行业，华为已发布AI芯片麒麟970和首款AI手机Mate10，三星正加大对AI芯片投资力度，苹果则明确表示旗下产品未来将作为AI的主要平台。在愈发激烈的商业竞争带动下，AI产业迎来新一轮复兴。`
    inputText.value = optimizedText.value
    isOptimizing.value = false

    // 开始流式输出
    streamText(optimizedText.value)

    console.log('优化完成:', optimizedText.value)
  }, 3000)
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
  // 不需要清除灵感状态，因为取消后可能还想看灵感
}

const handleInspiration = () => {
  console.log('给我灵感')
  isGeneratingInspiration.value = true
  inspirationCompleted.value = false
  displayedText.value = ''
  inputText.value = ''
  inspirationText.value = ''
  // 清除优化状态
  isOptimizing.value = false
  optimizedText.value = ''
  originalText.value = ''

  // 模拟生成灵感内容
  const inspirations = [
    '人工智能如何改变传统教育模式？探讨AI在个性化学习、智能辅导和教育资源分配中的应用',
    '《西游记》中的人物成长与现代职场发展：从唐僧师徒四人的取经之路看团队协作与个人成长',
    '人形机器人产业链分析：从技术突破到商业应用，探索下一个万亿级市场机遇',
    '运动改变大脑：科学解读体育锻炼如何提升认知能力、改善心理健康与延缓衰老',
    '可持续发展与绿色经济：企业如何在环保浪潮中寻找新的增长点',
    '元宇宙时代的社交革命：虚拟现实如何重塑人际交往与商业模式',
  ]
  const randomIndex = Math.floor(Math.random() * inspirations.length)
  const generatedText = inspirations[randomIndex]

  // 模拟生成过程（延迟后开始流式输出）
  setTimeout(() => {
    isGeneratingInspiration.value = false
    inspirationText.value = generatedText
    inputText.value = generatedText

    // 开始流式输出
    streamText(generatedText)
  }, 1500)
}

// 再来一份灵感
const handleInspirationAgain = () => {
  handleInspiration()
}

// 采纳灵感
const handleAdopt = () => {
  if (inspirationText.value) {
    inputText.value = inspirationText.value
  }
  inspirationCompleted.value = false
  isGeneratingInspiration.value = false
  inspirationText.value = ''
  displayedText.value = ''
}

// 取消灵感
const handleCancelInspiration = () => {
  inspirationCompleted.value = false
  isGeneratingInspiration.value = false
  inspirationText.value = ''
  inputText.value = ''
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
  const fileInfo: UploadedFile = {
    name: file.name,
    size: file.size,
    type: file.type,
  }
  uploadedFiles.value.push(fileInfo)
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    addFile(files[0])
  }
}

const handleCloudFile = () => {
  console.log('选择云端文件')
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    addFile(files[0])
  }
}

const getPlaceholder = () => {
  if (activeTab.value === 'topic') {
    return currentPlaceholder.value || '人工智能发展趋势'
  } else if (activeTab.value === 'paste') {
    return currentPlaceholder.value || '人工智能发展趋势'
  }
  return '请输入内容...'
}
</script>

<template>
  <div class="aippt-container">
    <div class="aippt-header">
      <h1 class="aippt-slogan">与 AI 边聊边改，轻松创作 PPT</h1>
    </div>

    <div class="aippt-content">
      <!-- 选项卡切换 -->
      <div class="ppt-switch">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ppt-switch__btn"
          :class="{ 'ppt-switch__btn--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <svg
            v-if="tab.icon === 'topic'"
            class="ppt-switch__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M14.25 6.25V3.25C14.25 2.42157 13.5784 1.75 12.75 1.75H3.25C2.42157 1.75 1.75 2.42157 1.75 3.25V12.75C1.75 13.5784 2.42157 14.25 3.25 14.25H4.75"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.75 4C5.33579 4 5 4.33579 5 4.75V7.75V9.75C5 10.1642 5.33579 10.5 5.75 10.5C6.16421 10.5 6.5 10.1642 6.5 9.75V8.5H8.75C9.99264 8.5 11 7.49264 11 6.25C11 5.0077 9.9935 4 8.75052 4H5.75ZM6.5 5.5V7H8.75C9.16421 7 9.5 6.66421 9.5 6.25C9.5 5.83545 9.16439 5.5 8.75052 5.5H6.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M12.5 7L13.5889 9.41106L16 10.5L13.5889 11.5889L12.5 14L11.4111 11.5889L9 10.5L11.4111 9.41106L12.5 7Z"
              fill="currentColor"
            ></path>
            <path
              d="M8 12L8.67882 13.3212L10 14L8.67882 14.6788L8 16L7.32118 14.6788L6 14L7.32118 13.3212L8 12Z"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            v-else-if="tab.icon === 'upload'"
            class="ppt-switch__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10.25 11.25H5.75M4.25 14.25H11.75C12.5784 14.25 13.25 13.5784 13.25 12.75V5.16421C13.25 4.899 13.1446 4.64464 12.9571 4.45711L10.5429 2.04289C10.3554 1.85536 10.101 1.75 9.83579 1.75H4.25C3.42157 1.75 2.75 2.42157 2.75 3.25V12.75C2.75 13.5784 3.42157 14.25 4.25 14.25Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9.25 1.75V5.74C9.25 5.74552 9.25448 5.75 9.26 5.75H13.25"
              stroke="currentColor"
              stroke-width="1.5"
            ></path>
          </svg>
          <svg
            v-else-if="tab.icon === 'paste'"
            class="ppt-switch__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M11.25 12C11.25 11.4477 11.6977 11 12.25 11L15 11L11.25 14.75V12Z"
              fill="currentColor"
            ></path>
            <path
              d="M3.5 3.25H3.25C2.42157 3.25 1.75 3.92157 1.75 4.75V11.75C1.75 12.5784 2.42157 13.25 3.25 13.25H4.5M10 3.25H10.25C11.0784 3.25 11.75 3.92157 11.75 4.75V6M5 4.25H8.5C9.19036 4.25 9.75 3.69036 9.75 3C9.75 2.30964 9.19036 1.75 8.5 1.75H5C4.30964 1.75 3.75 2.30964 3.75 3C3.75 3.69036 4.30964 4.25 5 4.25ZM11.5 14.75H8.25C7.42157 14.75 6.75 14.0784 6.75 13.25V9.75C6.75 8.92157 7.42157 8.25 8.25 8.25H13.5C14.3284 8.25 15 8.92157 15 9.75V11.25L11.5 14.75Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- 输入区域包装器 -->
      <div class="ppt-input-wrapper">
        <!-- 输入区域 -->
        <div
          class="ppt-input-container"
          :class="{ 'ppt-input-container--upload': activeTab === 'upload' }"
        >
          <!-- 上传文档界面 -->
          <div v-if="activeTab === 'upload'">
            <!-- 已上传文件列表 -->
            <div v-if="uploadedFiles.length > 0" class="uploaded-files">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                <div class="file-info">
                  <div class="file-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="3" fill="#1D70F5"></rect>
                      <path
                        d="M0 18.375H24V21C24 22.6569 22.6569 24 21 24H3C1.34315 24 0 22.6569 0 21V18.375Z"
                        fill="#0059E8"
                      ></path>
                      <path
                        d="M5.75921 13.4063L3.5625 4.59375H5.32534L6.89431 11.5926L8.35714 4.94932H9.9414L11.5599 11.6474L12.9608 4.59375H14.7188L12.7213 13.4063H10.5142L9.18988 8.06607L7.94836 13.4063H5.75921Z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <div class="file-details">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-size">{{ formatFileSize(file.size) }}</div>
                  </div>
                </div>
                <button class="delete-btn" @click="removeFile(index)">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5.75 1.33203H10.25M1.75 3.75H14.25M12.5 4.25L11.6351 12.8993C11.5584 13.6661 10.9131 14.25 10.1425 14.25H5.85748C5.08685 14.25 4.44161 13.6661 4.36493 12.8993L3.5 4.25"
                      stroke="#646a73"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      fill="none"
                    ></path>
                    <path
                      d="M8 6.75V10.25"
                      stroke="#646a73"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      fill="none"
                    ></path>
                  </svg>
                  删除
                </button>
              </div>
            </div>

            <!-- 拖拽上传区域 -->
            <div
              v-else
              class="file-upload-area"
              :class="{ 'file-upload-area--dragging': isDragging }"
              @dragenter="handleDragEnter"
              @dragleave="handleDragLeave"
              @dragover="handleDragOver"
              @drop="handleDrop"
            >
              <div class="file-upload-content">
                <div class="file-upload-title">拖拽文件到此处</div>
                <div class="file-upload-desc">
                  支持DOC文档，PDF文档，思维导图，在线智能文档导入
                  <svg
                    class="info-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke-width="1.5"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.04004 6C8.59232 6 9.04004 5.55228 9.04004 5C9.04004 4.44772 8.59232 4 8.04004 4C7.48775 4 7.04004 4.44772 7.04004 5C7.04004 5.55228 7.48775 6 8.04004 6Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M7.25 8H7.75C8.02614 8 8.25 8.22386 8.25 8.5V11.5M8.25 11.5H7.25M8.25 11.5H9.25"
                      stroke="currentColor"
                      stroke-linecap="round"
                      fill="none"
                    ></path>
                    <circle cx="8" cy="8" r="6.75" stroke="currentColor" fill="none"></circle>
                  </svg>
                </div>
                <div class="file-upload-buttons">
                  <button class="file-btn file-btn--cloud" @click="handleCloudFile">
                    <svg
                      class="file-btn__icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke-width="1.5"
                    >
                      <path
                        d="M5.75 4.75H10.25"
                        stroke="currentColor"
                        stroke-linecap="round"
                        fill="none"
                      ></path>
                      <path
                        d="M6 14.25H4.25C3.42157 14.25 2.75 13.5784 2.75 12.75V3.25C2.75 2.42157 3.42157 1.75 4.25 1.75H11.75C12.5784 1.75 13.25 2.42157 13.25 3.25V6.5"
                        stroke="currentColor"
                        fill="none"
                      ></path>
                      <path
                        d="M13.5 11C13.5 11.0145 13.4998 11.029 13.4995 11.0434C14.2164 11.2125 14.75 11.8564 14.75 12.625C14.75 13.5208 14.0252 14.2473 13.13 14.25L13.125 14.25H10C9.0335 14.25 8.25 13.4665 8.25 12.5C8.25 11.7043 8.78101 11.0327 9.50798 10.8201C9.59893 9.79983 10.4561 9 11.5 9C12.6046 9 13.5 9.89543 13.5 11Z"
                        stroke="currentColor"
                        fill="none"
                      ></path>
                    </svg>
                    云端文件
                  </button>
                  <button class="file-btn file-btn--local">
                    <input
                      type="file"
                      id="file-upload"
                      class="file-input"
                      accept=".wps,.doc,.wpt,.dotx,.docx,.pos,.pof,.xmind,.mmap,.otl,.pdf"
                      @change="handleFileSelect"
                    />
                    <svg
                      class="file-btn__icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke-width="1.5"
                    >
                      <path
                        d="M11.25 14.25L4.75 14.25M12.75 11.25L3.25 11.25C2.42157 11.25 1.75 10.5784 1.75 9.75L1.75 3.25C1.75 2.42157 2.42157 1.75 3.25 1.75L12.75 1.75C13.5784 1.75 14.25 2.42157 14.25 3.25L14.25 9.75C14.25 10.5784 13.5784 11.25 12.75 11.25Z"
                        stroke="currentColor"
                        stroke-linecap="round"
                        fill="none"
                      ></path>
                    </svg>
                    本地文件
                    <label for="file-upload" class="file-input-label"></label>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 文本输入界面（输入主题/粘贴大纲） -->
          <div v-else class="editor-panel">
            <!-- 灵感生成状态显示 -->
            <div
              v-if="
                isGeneratingInspiration || inspirationCompleted || (isStreaming && inspirationText)
              "
              class="inspiration-view"
            >
              <div class="inspiration-section">
                <div v-if="isGeneratingInspiration || isStreaming" class="inspiration-wrapper">
                  <div
                    class="inspiration-content inspiration-content--loading inspiration-scrollable"
                  >
                    <span class="inspiration-label">为你生成灵感中</span>
                    <span v-if="isStreaming" class="streaming-cursor streaming-text">{{
                      displayedText
                    }}</span>
                  </div>
                  <div class="loading-footer">
                    <div class="loading-text">
                      {{ isGeneratingInspiration ? '正在准备...' : '灵感生成中' }}
                    </div>
                    <button class="stop-btn" @click="handleStop">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5" />
                      </svg>
                      <span>终止</span>
                    </button>
                  </div>
                </div>
                <div
                  v-else-if="inspirationCompleted"
                  class="inspiration-wrapper inspiration-wrapper--completed"
                >
                  <div
                    class="inspiration-content inspiration-content-completed inspiration-scrollable"
                  >
                    <span class="inspiration-label">
                      灵感来咯
                      <!-- 行内操作按钮 -->
                      <span class="inspiration-actions-compact">
                        <button
                          class="compact-action-btn compact-action-btn--adopt"
                          @click="handleAdopt"
                          title="采纳"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3.5 8.5L6.5 11.5L12.5 4.5"
                              stroke="currentColor"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                          <span class="compact-action-text">采纳</span>
                        </button>
                        <button
                          class="compact-action-btn compact-action-btn--cancel"
                          @click="handleCancelInspiration"
                          title="取消"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                              stroke="currentColor"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                          <span class="compact-action-text">取消</span>
                        </button>
                      </span>
                    </span>
                    <span class="inspiration-text">{{ inspirationText }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 优化状态显示 -->
            <div v-else-if="isOptimizing || optimizedText" class="optimize-view">
              <div class="optimize-section optimize-section--before">
                <div class="optimize-content optimize-content--single-line">
                  <span class="optimize-label optimize-label--before">修改前</span>
                  <span class="optimize-text-wrapper">
                    <span class="optimize-text">{{ originalText }}</span>
                    <span class="optimize-tooltip">{{ originalText }}</span>
                  </span>
                </div>
              </div>
              <div class="optimize-section">
                <div v-if="isOptimizing || isStreaming" class="optimize-wrapper">
                  <div class="optimize-content optimize-content--loading optimize-scrollable">
                    <span class="optimize-label optimize-label--after"> 修改后 </span>
                    <div
                      v-if="isStreaming"
                      class="streaming-cursor streaming-text optimize-streaming-text"
                    >
                      {{ displayedText }}
                    </div>
                  </div>
                  <div class="loading-footer">
                    <div class="loading-text">提示词优化中</div>
                    <button class="stop-btn" @click="handleStop">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5" />
                      </svg>
                      <span>终止</span>
                    </button>
                  </div>
                </div>
                <div v-else-if="optimizedText" class="optimize-content optimize-content-completed">
                  <span class="optimize-label optimize-label--after">修改后</span>
                  <span class="optimize-text-content">{{ optimizedText }}</span>
                </div>
              </div>
            </div>
            <!-- 正常输入框 -->
            <textarea
              v-else
              v-model="inputText"
              class="editor"
              :placeholder="getPlaceholder()"
              :maxlength="maxLength"
            ></textarea>
          </div>

          <!-- 工具栏 -->
          <div
            v-show="!isOptimizing && !isStreaming && !isGeneratingInspiration"
            class="inputbox__action"
          >
            <!-- 输入主题时显示的工具栏 -->
            <template v-if="activeTab === 'topic'">
              <button class="action-btn">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <path
                    d="M14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8M14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8M14.75 8H1.25M7.55844 1.32533C4.32517 5.15507 4.31164 10.7831 7.51786 14.6279M8.48214 1.32533C11.7154 5.15507 11.7289 10.7831 8.52272 14.6279"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                </svg>
                <span class="action__text">联网搜索</span>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <ellipse
                    cx="4"
                    cy="8"
                    rx="4"
                    ry="8"
                    transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 16.4854 5.17163)"
                    fill="none"
                    stroke="currentColor"
                  ></ellipse>
                  <ellipse
                    cx="7.99993"
                    cy="8.00006"
                    rx="4"
                    ry="8"
                    transform="rotate(-45 7.99993 8.00006)"
                    fill="none"
                    stroke="currentColor"
                  ></ellipse>
                  <path
                    d="M9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>深度思考</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <path
                    d="M1.75 10.63C3.16858 9.70752 3.97479 9.1607 5.39336 8.23822C5.93042 7.88899 6.64752 7.92699 7.14039 8.33081L13.75 13.75"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                  <path
                    d="M12 5.25C12 5.94036 11.4404 6.5 10.75 6.5C10.0596 6.5 9.5 5.94036 9.5 5.25C9.5 4.55964 10.0596 4 10.75 4C11.4404 4 12 4.55964 12 5.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M1.75 3.25C1.75 2.42157 2.42157 1.75 3.25 1.75H12.75C13.5784 1.75 14.25 2.42157 14.25 3.25V12.75C14.25 13.5784 13.5784 14.25 12.75 14.25H3.25C2.42157 14.25 1.75 13.5784 1.75 12.75V3.25Z"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                </svg>
                <span>AI 生图</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg class="action__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.4502 1.90039H13.4362C14.432 1.90039 15.0474 2.85573 15.0474 3.77039V12.1304C15.0474 13.045 14.432 14.0004 13.4362 14.0004H10.4502V12.9004H13.4362C13.6126 12.9004 13.9474 12.6738 13.9474 12.1304V3.77039C13.9474 3.22702 13.6126 3.00039 13.4362 3.00039H10.4502V1.90039Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.5 4.5C10.7761 4.5 11 4.72386 11 5V11C11 11.2761 10.7761 11.5 10.5 11.5C10.2239 11.5 10 11.2761 10 11V5C10 4.72386 10.2239 4.5 10.5 4.5Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.9502 3.91559C7.9502 3.42903 7.53936 3.04352 7.05378 3.07444L2.83949 3.34278C2.39569 3.37104 2.0502 3.73923 2.0502 4.18393V11.8214C2.0502 12.2661 2.39569 12.6343 2.83949 12.6625L7.05378 12.9309C7.53936 12.9618 7.9502 12.5763 7.9502 12.0897V3.91559ZM6.98388 1.97666C8.10319 1.90539 9.0502 2.79401 9.0502 3.91559V12.0897C9.0502 13.2113 8.10319 14.0999 6.98388 14.0286L2.76959 13.7603C1.74659 13.6952 0.950195 12.8465 0.950195 11.8214V4.18393C0.950195 3.15886 1.74659 2.31014 2.76959 2.245L6.98388 1.97666Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 6.8C8 6.35817 8.35817 6 8.8 6H12.2C12.6418 6 13 6.35817 13 6.8V9.2C13 9.64183 12.6418 10 12.2 10H8.8C8.35817 10 8 9.64183 8 9.2V6.8ZM9 7V9H12V7H9Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.0389 6.61733L6.73396 11.2402C6.83853 11.5254 7.15449 11.6718 7.43968 11.5673C7.72487 11.4627 7.8713 11.1467 7.76673 10.8615L5.67689 5.16201C5.46377 4.58075 4.64383 4.57476 4.42224 5.15284L2.23678 10.854C2.12806 11.1377 2.26985 11.4557 2.55348 11.5644C2.83711 11.6732 3.15518 11.5314 3.2639 11.2478L5.0389 6.61733Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.5498 10.1H3.5498V9H6.5498C6.85356 9 7.0998 9.24624 7.0998 9.55C7.0998 9.85376 6.85356 10.1 6.5498 10.1Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>中文</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <div class="action__spacer"></div>

              <!-- 优化完成后显示重试、取消和立即生成按钮（流式生成时隐藏） -->
              <template v-if="optimizedText && !isOptimizing && !isStreaming">
                <button class="retry-btn" @click="handleRetry">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14.25 8C14.25 11.7279 11.7279 14.75 8 14.75C5.27924 14.75 2.93784 13.1641 1.95703 10.875M1.75 8C1.75 4.27208 4.27208 1.25 8 1.25C10.721 1.25 13.0624 2.83598 14.043 5.125M14.25 2.75V5.75H11.25M1.75 13.25V10.25H4.75"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span>重试</span>
                </button>

                <button class="cancel-btn" @click="handleCancel">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>
                  </svg>
                  <span>取消</span>
                </button>

                <div class="inputbox__action-divider"></div>

                <button class="submit-btn submit-btn--text" @click="handleSubmit">
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>

              <!-- 灵感完成后显示再来一份和立即生成按钮 -->
              <template v-else-if="inspirationCompleted">
                <button class="inspiration-btn" @click="handleInspirationAgain">
                  <IconInspiration />
                  <span>再来一份！</span>
                </button>

                <div class="inputbox__action-divider"></div>

                <button class="submit-btn submit-btn--text" @click="handleSubmit">
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>

              <!-- 正常状态显示给我灵感/一键优化和立即生成按钮 -->
              <template v-else>
                <!-- 给我灵感按钮 - 仅在输入框为空时显示 -->
                <button
                  v-if="!inputText.trim() && !isOptimizing && !isGeneratingInspiration"
                  class="inspiration-btn"
                  @click="handleInspiration"
                >
                  <IconInspiration />
                  <span>给我灵感</span>
                </button>

                <!-- 一键优化按钮 - 仅在有文本时显示（隐藏在灵感状态下） -->
                <button
                  v-if="inputText.trim() && !isOptimizing && !inspirationCompleted"
                  class="optimize-btn"
                  @click="handleOptimize"
                >
                  <IconOptimize />
                  <span>灵感修改</span>
                </button>

                <div v-if="!isOptimizing && !isStreaming" class="inputbox__action-divider"></div>

                <button
                  v-if="!isOptimizing && !isStreaming"
                  class="submit-btn submit-btn--text"
                  @click="handleSubmit"
                >
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>
            </template>

            <!-- 上传文档时显示的工具栏 -->
            <template v-else-if="activeTab === 'upload'">
              <button class="action-btn action-btn--dropdown">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <path
                    d="M1.75 10.63C3.16858 9.70752 3.97479 9.1607 5.39336 8.23822C5.93042 7.88899 6.64752 7.92699 7.14039 8.33081L13.75 13.75"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                  <path
                    d="M12 5.25C12 5.94036 11.4404 6.5 10.75 6.5C10.0596 6.5 9.5 5.94036 9.5 5.25C9.5 4.55964 10.0596 4 10.75 4C11.4404 4 12 4.55964 12 5.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M1.75 3.25C1.75 2.42157 2.42157 1.75 3.25 1.75H12.75C13.5784 1.75 14.25 2.42157 14.25 3.25V12.75C14.25 13.5784 13.5784 14.25 12.75 14.25H3.25C2.42157 14.25 1.75 13.5784 1.75 12.75V3.25Z"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                </svg>
                <span>AI 生图</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <div class="action__spacer"></div>

              <button
                class="submit-btn submit-btn--text"
                :disabled="uploadedFiles.length === 0"
                @click="handleSubmit"
              >
                <span>立即生成</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.5 3L10.5 8L5.5 13"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  ></path>
                </svg>
              </button>
            </template>

            <!-- 粘贴大纲时显示的工具栏（与输入主题相同） -->
            <template v-else>
              <button class="action-btn">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <path
                    d="M14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8M14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8M14.75 8H1.25M7.55844 1.32533C4.32517 5.15507 4.31164 10.7831 7.51786 14.6279M8.48214 1.32533C11.7154 5.15507 11.7289 10.7831 8.52272 14.6279"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                </svg>
                <span class="action__text">联网搜索</span>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <ellipse
                    cx="4"
                    cy="8"
                    rx="4"
                    ry="8"
                    transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 16.4854 5.17163)"
                    fill="none"
                    stroke="currentColor"
                  ></ellipse>
                  <ellipse
                    cx="7.99993"
                    cy="8.00006"
                    rx="4"
                    ry="8"
                    transform="rotate(-45 7.99993 8.00006)"
                    fill="none"
                    stroke="currentColor"
                  ></ellipse>
                  <path
                    d="M9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>深度思考</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg
                  class="action__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke-width="1.5"
                >
                  <path
                    d="M1.75 10.63C3.16858 9.70752 3.97479 9.1607 5.39336 8.23822C5.93042 7.88899 6.64752 7.92699 7.14039 8.33081L13.75 13.75"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                  <path
                    d="M12 5.25C12 5.94036 11.4404 6.5 10.75 6.5C10.0596 6.5 9.5 5.94036 9.5 5.25C9.5 4.55964 10.0596 4 10.75 4C11.4404 4 12 4.55964 12 5.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M1.75 3.25C1.75 2.42157 2.42157 1.75 3.25 1.75H12.75C13.5784 1.75 14.25 2.42157 14.25 3.25V12.75C14.25 13.5784 13.5784 14.25 12.75 14.25H3.25C2.42157 14.25 1.75 13.5784 1.75 12.75V3.25Z"
                    stroke="currentColor"
                    fill="none"
                  ></path>
                </svg>
                <span>AI 生图</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <button class="action-btn action-btn--dropdown">
                <svg class="action__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.4502 1.90039H13.4362C14.432 1.90039 15.0474 2.85573 15.0474 3.77039V12.1304C15.0474 13.045 14.432 14.0004 13.4362 14.0004H10.4502V12.9004H13.4362C13.6126 12.9004 13.9474 12.6738 13.9474 12.1304V3.77039C13.9474 3.22702 13.6126 3.00039 13.4362 3.00039H10.4502V1.90039Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.5 4.5C10.7761 4.5 11 4.72386 11 5V11C11 11.2761 10.7761 11.5 10.5 11.5C10.2239 11.5 10 11.2761 10 11V5C10 4.72386 10.2239 4.5 10.5 4.5Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.9502 3.91559C7.9502 3.42903 7.53936 3.04352 7.05378 3.07444L2.83949 3.34278C2.39569 3.37104 2.0502 3.73923 2.0502 4.18393V11.8214C2.0502 12.2661 2.39569 12.6343 2.83949 12.6625L7.05378 12.9309C7.53936 12.9618 7.9502 12.5763 7.9502 12.0897V3.91559ZM6.98388 1.97666C8.10319 1.90539 9.0502 2.79401 9.0502 3.91559V12.0897C9.0502 13.2113 8.10319 14.0999 6.98388 14.0286L2.76959 13.7603C1.74659 13.6952 0.950195 12.8465 0.950195 11.8214V4.18393C0.950195 3.15886 1.74659 2.31014 2.76959 2.245L6.98388 1.97666Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 6.8C8 6.35817 8.35817 6 8.8 6H12.2C12.6418 6 13 6.35817 13 6.8V9.2C13 9.64183 12.6418 10 12.2 10H8.8C8.35817 10 8 9.64183 8 9.2V6.8ZM9 7V9H12V7H9Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.0389 6.61733L6.73396 11.2402C6.83853 11.5254 7.15449 11.6718 7.43968 11.5673C7.72487 11.4627 7.8713 11.1467 7.76673 10.8615L5.67689 5.16201C5.46377 4.58075 4.64383 4.57476 4.42224 5.15284L2.23678 10.854C2.12806 11.1377 2.26985 11.4557 2.55348 11.5644C2.83711 11.6732 3.15518 11.5314 3.2639 11.2478L5.0389 6.61733Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.5498 10.1H3.5498V9H6.5498C6.85356 9 7.0998 9.24624 7.0998 9.55C7.0998 9.85376 6.85356 10.1 6.5498 10.1Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>中文</span>
                <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.25 6.5L7.99327 9.99363C7.99711 9.99722 8.00307 9.99722 8.00691 9.99363L11.75 6.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  ></path>
                </svg>
              </button>

              <div class="action__spacer"></div>

              <!-- 优化完成后显示重试、取消和立即生成按钮（流式生成时隐藏） -->
              <template v-if="optimizedText && !isOptimizing && !isStreaming">
                <button class="retry-btn" @click="handleRetry">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14.25 8C14.25 11.7279 11.7279 14.75 8 14.75C5.27924 14.75 2.93784 13.1641 1.95703 10.875M1.75 8C1.75 4.27208 4.27208 1.25 8 1.25C10.721 1.25 13.0624 2.83598 14.043 5.125M14.25 2.75V5.75H11.25M1.75 13.25V10.25H4.75"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span>重试</span>
                </button>

                <button class="cancel-btn" @click="handleCancel">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>
                  </svg>
                  <span>取消</span>
                </button>

                <div class="inputbox__action-divider"></div>

                <button class="submit-btn submit-btn--text" @click="handleSubmit">
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>

              <!-- 灵感完成后显示再来一份和立即生成按钮 -->
              <template v-else-if="inspirationCompleted">
                <button class="inspiration-btn" @click="handleInspirationAgain">
                  <IconInspiration />
                  <span>再来一份！</span>
                </button>

                <div class="inputbox__action-divider"></div>

                <button class="submit-btn submit-btn--text" @click="handleSubmit">
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>

              <!-- 正常状态显示给我灵感/一键优化和立即生成按钮 -->
              <template v-else>
                <!-- 给我灵感按钮 - 仅在输入框为空时显示 -->
                <button
                  v-if="!inputText.trim() && !isOptimizing && !isGeneratingInspiration"
                  class="inspiration-btn"
                  @click="handleInspiration"
                >
                  <IconInspiration />
                  <span>给我灵感</span>
                </button>

                <!-- 一键优化按钮 - 仅在有文本时显示（隐藏在灵感状态下） -->
                <button
                  v-if="inputText.trim() && !isOptimizing && !inspirationCompleted"
                  class="optimize-btn"
                  @click="handleOptimize"
                >
                  <IconOptimize />
                  <span>灵感修改</span>
                </button>

                <div v-if="!isOptimizing && !isStreaming" class="inputbox__action-divider"></div>

                <button
                  v-if="!isOptimizing && !isStreaming"
                  class="submit-btn submit-btn--text"
                  @click="handleSubmit"
                >
                  <span>立即生成</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </button>
              </template>
            </template>
          </div>
        </div>
      </div>

      <!-- 示例标签（仅在非上传文档时显示） -->
      <div v-if="activeTab !== 'upload'" class="examples">
        <button
          v-for="example in examples"
          :key="example"
          class="example-tag"
          @click="selectExample(example)"
        >
          {{ example }}
        </button>
        <button class="refresh-btn" @click="refreshExamples">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14.25 8C14.25 11.7279 11.7279 14.75 8 14.75C5.27924 14.75 2.93784 13.1641 1.95703 10.875M1.75 8C1.75 4.27208 4.27208 1.25 8 1.25C10.721 1.25 13.0624 2.83598 14.043 5.125M14.25 2.75V5.75H11.25M1.75 13.25V10.25H4.75"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </div>
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
  max-width: 900px;
  margin: 0 auto;
}

/* 选项卡切换 */
.ppt-switch {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.ppt-switch__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 24px;
  font-size: 14px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.ppt-switch__btn:hover {
  border-color: #3370ff;
  color: #3370ff;
}

.ppt-switch__btn--active {
  background: #f2f5ff;
  border-color: #3370ff;
  color: #3370ff;
}

.ppt-switch__icon {
  width: 16px;
  height: 16px;
}

/* 输入区域包装器 */
.ppt-input-wrapper {
  position: relative;
}

/* 输入区域 */
.ppt-input-container {
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

/* 灵感生成视图 */
.inspiration-view {
  margin-bottom: 12px;
  height: 166px;
  overflow: hidden;
}

.inspiration-section {
  padding: 4px 0;
  border-bottom: 1px solid #e1e4e8;
  height: 100%;
}

.inspiration-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* 灵感内容包装器 */
.inspiration-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.inspiration-wrapper .loading-footer {
  background: #ffffff;
}

/* 可滚动的灵感内容区域 */
.inspiration-scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding: 4px 0;
}

/* 灵感后区域的滚动条样式 */
.inspiration-scrollable::-webkit-scrollbar {
  width: 6px;
}

.inspiration-scrollable::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.inspiration-scrollable::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.inspiration-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
}

.inspiration-label {
  display: inline-block;
  font-size: 13px;
  font-style: italic;
  font-weight: 500;
  color: #667eea;
  background-color: rgba(102, 126, 234, 0.2);
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 8px;
}

.inspiration-content {
  display: block;
  padding: 0;
  background: transparent;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2329;
  white-space: pre-wrap;
  word-break: break-word;
}

.inspiration-content--loading {
  color: #1f2329;
}

/* 灵感生成完成状态 */
.inspiration-wrapper--completed {
  background: transparent;
}

/* 行内操作按钮容器 */
.inspiration-actions-compact {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: rgba(102, 126, 234, 0.08);
  padding: 2px;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  margin-left: 6px;
  vertical-align: middle;
  height: 24px;
  position: relative;
  overflow: visible;
  z-index: 100;
}

/* 紧凑按钮样式 */
.compact-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  z-index: 10;
}

.compact-action-btn svg {
  flex-shrink: 0;
  transition: all 0.2s;
}

/* 文本默认隐藏 */
.compact-action-text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  white-space: nowrap;
  font-size: 11px;
  padding: 3px 6px;
  background: rgba(45, 50, 56, 0.95);
  color: #ffffff;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;
  font-weight: 500;
  z-index: 1000;
}

/* 提示框小三角 */
.compact-action-text::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: rgba(45, 50, 56, 0.95);
}

/* hover 时显示文本 */
.compact-action-btn:hover .compact-action-text {
  opacity: 1;
  visibility: visible;
}

.compact-action-btn--adopt {
  color: #667eea;
}

.compact-action-btn--adopt:hover {
  background: rgba(102, 126, 234, 0.15);
}

.compact-action-btn--adopt svg path {
  stroke: #667eea;
}

.compact-action-btn--cancel {
  color: #646a73;
}

.compact-action-btn--cancel:hover {
  background: rgba(100, 106, 115, 0.1);
}

.compact-action-btn--cancel svg path {
  stroke: #646a73;
}

.inspiration-content-completed {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

.inspiration-content-completed .inspiration-label {
  display: inline-block;
  position: relative;
  overflow: visible;
}

.inspiration-text {
  display: inline;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2329;
  white-space: pre-wrap;
  word-break: break-word;
}

.inspiration-content-completed::-webkit-scrollbar {
  width: 6px;
}

.inspiration-content-completed::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.inspiration-content-completed::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.inspiration-content-completed::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
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
  display: block;
  color: #1f2329;
  margin-top: 0;
}

.optimize-streaming-text {
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

/* 工具栏 */
.inputbox__action {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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

.count {
  padding: 0 8px;
}

.count__text {
  font-size: 12px;
  color: #8f959e;
}

.inputbox__action-divider {
  width: 1px;
  height: 20px;
  background: #e1e4e8;
  margin: 0 4px;
}

/* 给我灵感按钮 - 次要按钮样式 */
.inspiration-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  background: #ffffff;
  border: 1.5px solid transparent;
  background-image:
    linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.inspiration-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1.5px solid transparent;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.inspiration-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #667eea;
  transition: color 0.3s ease;
}

.inspiration-btn:hover svg {
  color: #ffffff;
}

.inspiration-btn span {
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.inspiration-btn:hover span {
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
  color: #ffffff;
}

/* 一键优化按钮 - 与灵感按钮样式统一 */
.optimize-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  background: #ffffff;
  border: 1.5px solid transparent;
  background-image:
    linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.optimize-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1.5px solid transparent;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.optimize-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #667eea;
  transition: color 0.3s ease;
}

.optimize-btn:hover svg {
  color: #ffffff;
}

.optimize-btn span {
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.optimize-btn:hover span {
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
  color: #ffffff;
}

/* 重试和取消按钮 */
.retry-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1.5px solid #e1e4e8;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #646a73;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: 8px;
}

.retry-btn:hover {
  background: #f2f5ff;
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.cancel-btn:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.15);
}

.retry-btn svg,
.cancel-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.submit-btn {
  display: flex;
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
  color: #ffffff;
  white-space: nowrap;
}

.submit-btn:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.submit-btn span {
  font-weight: 500;
}

/* 示例标签 */
.examples {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.example-tag {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 24px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.example-tag:hover {
  background: #f2f5ff;
  border-color: #3370ff;
  color: #3370ff;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f2f3f5;
  border-color: #c9cdd4;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
  color: #646a73;
}

/* 响应式 */
@media (max-width: 768px) {
  .aippt-slogan {
    font-size: 24px;
  }

  .ppt-switch {
    flex-wrap: wrap;
  }

  .ppt-switch__btn {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }

  .inputbox__action {
    gap: 6px;
  }

  .action-btn span {
    display: none;
  }

  .action__icon {
    margin: 0;
  }

  /* 在移动端保持灵感按钮和优化按钮可见性 */
  .inspiration-btn,
  .optimize-btn {
    padding: 7px 14px;
    font-size: 13px;
  }

  .inspiration-btn span,
  .optimize-btn span {
    display: inline;
  }

  /* 移动端的立即生成按钮也调整 */
  .submit-btn {
    padding: 7px 14px;
    font-size: 13px;
  }
}
</style>
