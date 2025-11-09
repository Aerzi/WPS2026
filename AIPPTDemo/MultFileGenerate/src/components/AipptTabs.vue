<script setup lang="ts">
import IconTopic from './icons/IconTopic.vue'
import IconUpload from './icons/IconUpload.vue'
import IconPaste from './icons/IconPaste.vue'

defineProps<{
  activeTab: string
}>()

const emit = defineEmits(['update:activeTab'])

const tabs = [
  { id: 'topic', label: '输入主题', icon: 'topic' },
  { id: 'upload', label: '上传文档', icon: 'upload' },
  { id: 'paste', label: '粘贴大纲', icon: 'paste' },
]

const selectTab = (tabId: string) => {
  emit('update:activeTab', tabId)
}
</script>

<template>
  <div class="ppt-switch">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="ppt-switch__btn"
      :class="{ 'ppt-switch__btn--active': activeTab === tab.id }"
      @click="selectTab(tab.id)"
    >
      <IconTopic v-if="tab.icon === 'topic'" />
      <IconUpload v-else-if="tab.icon === 'upload'" />
      <IconPaste v-else-if="tab.icon === 'paste'" />
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>