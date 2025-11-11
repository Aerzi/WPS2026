<script setup lang="ts">
import { ref, watch } from 'vue'
import EditorPanel from '@/components/EditorPanel/EditorPanel.vue'
import InputBox from '@/components/InputBox/InputBox.vue'

interface Props {
  modelValue: string
  placeholder?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '自我评估及成长分析',
  rows: 6,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
}>()

const textValue = ref(props.modelValue)
const focused = ref(false)
const colorless = ref(true)

watch(
  () => props.modelValue,
  (newValue) => {
    textValue.value = newValue
  },
)

watch(textValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleFocus = () => {
  focused.value = true
  colorless.value = false
}

const handleBlur = () => {
  focused.value = false
  colorless.value = true
}

const handleSend = () => {
  emit('send')
}
</script>

<template>
  <div class="inputbox" :class="{ 'inputbox--colorless': colorless, 'inputbox--focused': focused }">
    <EditorPanel
      :model-value="textValue"
      :placeholder="placeholder"
      :rows="rows"
      @update:model-value="textValue = $event"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <InputBox @send="handleSend" />
  </div>
</template>

<style scoped>
.inputbox {
  position: relative;
  width: 100%;
  height: 132px;
  display: flex;
  line-height: 24px;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  outline: 1px solid var(--kd-color-line-light);
  border-radius: 24px;
  box-shadow: 0 -1px 10px rgba(13, 13, 13, 0.08);
  z-index: 2;
}

.inputbox--colorless {
  box-shadow: 0 4px 12px rgba(13, 13, 13, 0.04);
}

.inputbox--focused {
  box-shadow: 0 6px 18px rgba(13, 13, 13, 0.06);
}
</style>
