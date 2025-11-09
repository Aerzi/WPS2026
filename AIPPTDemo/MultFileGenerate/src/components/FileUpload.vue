<script setup lang="ts">
import { ref } from 'vue'

interface UploadedFile {
  name: string
  size: number
  type: string
}

defineProps<{
  uploadedFiles: UploadedFile[]
}>()

const emit = defineEmits(['addFile', 'removeFile'])

const isDragging = ref(false)

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    emit('addFile', files[0])
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
    emit('addFile', files[0])
  }
}
</script>

<template>
  <div>
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
        <button class="delete-btn" @click="emit('removeFile', index)">
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
</template>