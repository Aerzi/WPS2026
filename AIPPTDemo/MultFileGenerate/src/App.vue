<script setup lang="ts">
import { ref } from 'vue'
import PreferenceModal from './components/PreferenceModal.vue'

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

const handleSubmit = () => {
  if (activeTab.value === 'upload' && uploadedFiles.value.length > 0) {
    // 上传模式且有文件，显示偏好弹窗
    showPreferenceModal.value = true
  } else if (inputText.value.trim()) {
    // 其他模式，直接提交
    showPreferenceModal.value = true
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

const refreshExamples = () => {
  console.log('刷新示例')
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
    return '输入幻灯片主题，智能生成大纲，例如"人工智能的发展"'
  } else if (activeTab.value === 'paste') {
    return '粘贴大纲内容...'
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
          <textarea
            v-model="inputText"
            class="editor"
            :placeholder="getPlaceholder()"
            :maxlength="maxLength"
          ></textarea>
        </div>

        <!-- 工具栏 -->
        <div class="inputbox__action">
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

            <div class="count">
              <span class="count__text">{{ inputText.length }}/{{ maxLength }}</span>
            </div>

            <div class="inputbox__action-divider"></div>

            <button class="submit-btn" :disabled="!inputText.trim()" @click="handleSubmit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.13268 1.68855C3.66286 1.41273 3.09188 1.8348 3.21662 2.36571L4.34287 7.15944C4.34886 7.18494 4.37302 7.20156 4.39922 7.20156V7.20156H7.59922C7.82013 7.20156 7.99922 7.38065 7.99922 7.60156C7.99922 7.82248 7.82013 8.00156 7.59922 8.00156H4.39922V8.00156C4.37302 8.00156 4.34886 8.01818 4.34287 8.04369L3.21661 12.8374C3.09188 13.3683 3.66286 13.7904 4.13268 13.5146L13.2931 8.13665C13.7013 7.89703 13.7013 7.3061 13.2931 7.06647L4.13268 1.68855Z"
                  fill="#fff"
                ></path>
              </svg>
            </button>
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

            <button class="submit-btn" :disabled="uploadedFiles.length === 0" @click="handleSubmit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.13268 1.68855C3.66286 1.41273 3.09188 1.8348 3.21662 2.36571L4.34287 7.15944C4.34886 7.18494 4.37302 7.20156 4.39922 7.20156V7.20156H7.59922C7.82013 7.20156 7.99922 7.38065 7.99922 7.60156C7.99922 7.82248 7.82013 8.00156 7.59922 8.00156H4.39922V8.00156C4.37302 8.00156 4.34886 8.01818 4.34287 8.04369L3.21661 12.8374C3.09188 13.3683 3.66286 13.7904 4.13268 13.5146L13.2931 8.13665C13.7013 7.89703 13.7013 7.3061 13.2931 7.06647L4.13268 1.68855Z"
                  fill="#fff"
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

            <div class="count">
              <span class="count__text">{{ inputText.length }}/{{ maxLength }}</span>
            </div>

            <div class="inputbox__action-divider"></div>

            <button class="submit-btn" :disabled="!inputText.trim()" @click="handleSubmit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.13268 1.68855C3.66286 1.41273 3.09188 1.8348 3.21662 2.36571L4.34287 7.15944C4.34886 7.18494 4.37302 7.20156 4.39922 7.20156V7.20156H7.59922C7.82013 7.20156 7.99922 7.38065 7.99922 7.60156C7.99922 7.82248 7.82013 8.00156 7.59922 8.00156H4.39922V8.00156C4.37302 8.00156 4.34886 8.01818 4.34287 8.04369L3.21661 12.8374C3.09188 13.3683 3.66286 13.7904 4.13268 13.5146L13.2931 8.13665C13.7013 7.89703 13.7013 7.3061 13.2931 7.06647L4.13268 1.68855Z"
                  fill="#fff"
                ></path>
              </svg>
            </button>
          </template>
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
  border-radius: 8px;
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

/* 输入区域 */
.ppt-input-container {
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.editor-panel {
  margin-bottom: 12px;
}

.editor {
  width: 100%;
  min-height: 120px;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2329;
  font-family: inherit;
  padding: 0;
}

.editor::placeholder {
  color: #bbbfc4;
}

/* 文件上传区域 */
.file-upload-area {
  min-height: 300px;
  background: #f7f8fa;
  border-radius: 8px;
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
  border-radius: 6px;
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
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 20px;
  height: 20px;
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
  border-radius: 20px;
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
  transform: rotate(90deg);
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
}
</style>
