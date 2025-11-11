<script setup lang="ts">
import { type Component } from 'vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'

interface Props {
  text: string
  icon?: Component
  variant?: 'primary' | 'default'
  showArrow?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button type="button" :class="['action-button action-button--default']" @click="handleClick">
    <span v-if="icon" class="kd-icon action-button__icon" style="line-height: 0">
      <component :is="icon" />
    </span>
    <span class="action-button__text">{{ text }}</span>
    <span v-if="showArrow" class="kd-icon action-button__arrow" style="line-height: 0">
      <IconArrowDown />
    </span>
  </button>
</template>

<style scoped>
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  height: 32px;
  min-width: 0;
  transition: all 0.2s ease;
  box-sizing: border-box;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;
  border: none;
  outline: none;
}

/* 默认按钮样式 - 透明背景 */
.action-button--default {
  background: transparent;
  color: rgba(13, 13, 13, 1);
}

.action-button--default:hover {
  background: rgba(13, 13, 13, 0.06);
}

.action-button--default:active {
  background: rgba(13, 13, 13, 0.1);
}

.action-button--default .action-button__icon {
  color: rgba(13, 13, 13, 1);
}

.action-button--default .action-button__text {
  color: rgba(13, 13, 13, 1);
}

.kd-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  line-height: 1;
  vertical-align: middle;
  flex-shrink: 0;
}

.action-button__icon {
  font-size: 16px;
}

.action-button__text {
  font-size: 14px;
  line-height: 20px;
}

.action-button__arrow {
  margin-left: 4px;
  font-size: 12px;
  color: rgba(117, 117, 117, 1);
}
</style>
