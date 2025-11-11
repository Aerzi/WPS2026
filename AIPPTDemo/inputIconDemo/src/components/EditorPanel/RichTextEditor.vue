<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { parseText, segmentsToHtml, extractTextWithMarkers, removeMarkers } from '@/utils/textFormatter'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

// 计算去掉 ** 标记后的 placeholder
const displayPlaceholder = computed(() => removeMarkers(props.placeholder))

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  input: [value: string]
  scroll: []
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const isComposing = ref(false) // 中文输入法标志

// 保存光标位置
let savedSelection: { start: number; end: number } | null = null

// 渲染格式化文本
const renderFormattedText = (text: string, preserveCursor = false) => {
  if (!editorRef.value) return

  // 保存当前光标位置（仅在需要时）
  if (preserveCursor) {
    savedSelection = getCaretPosition()
  }

  // 如果文本为空，清空编辑器（让 :empty 伪元素生效）
  if (!text || text.trim() === '') {
    editorRef.value.textContent = ''
    return
  }

  // 解析文本并转换为 HTML
  const segments = parseText(text)
  const html = segmentsToHtml(segments)

  // 更新内容
  if (html) {
    editorRef.value.innerHTML = html
  } else {
    editorRef.value.textContent = ''
  }

  // 恢复光标位置（仅在保存了光标时）
  if (preserveCursor && savedSelection) {
    nextTick(() => {
      if (savedSelection) {
        setCaretPosition(savedSelection.start)
      }
    })
  }
}

// 获取光标位置
const getCaretPosition = (): { start: number; end: number } | null => {
  if (!editorRef.value) return null

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(editorRef.value)
  preCaretRange.setEnd(range.startContainer, range.startOffset)

  const start = preCaretRange.toString().length
  const end = start + range.toString().length

  return { start, end }
}

// 设置光标位置
const setCaretPosition = (position: number) => {
  if (!editorRef.value) return

  const selection = window.getSelection()
  if (!selection) return

  let charCount = 0

  const findPosition = (node: Node): { node: Node; offset: number } | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length || 0
      if (charCount + textLength >= position) {
        return { node, offset: position - charCount }
      }
      charCount += textLength
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const child of Array.from(node.childNodes)) {
        const found = findPosition(child)
        if (found) return found
      }
    }
    return null
  }

  const foundResult = findPosition(editorRef.value)

  if (foundResult) {
    try {
      const range = document.createRange()
      const { node, offset } = foundResult
      let maxOffset = 0
      if (node.nodeType === Node.TEXT_NODE) {
        maxOffset = (node as Text).length
      } else {
        maxOffset = node.textContent?.length || 0
      }
      range.setStart(node, Math.min(offset, maxOffset))
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } catch (e) {
      console.error('设置光标位置失败:', e)
    }
  }
}

// 处理输入事件
const handleInput = () => {
  if (!editorRef.value || isComposing.value) return

  const textWithMarkers = extractTextWithMarkers(editorRef.value)
  
  // 如果文本为空，强制清空编辑器，确保placeholder可以显示
  if (textWithMarkers.trim() === '') {
    editorRef.value.textContent = ''
  }
  
  emit('update:modelValue', textWithMarkers)
  emit('input', textWithMarkers)

  // 注意：不在这里重新渲染，让 watch 来处理
  // 避免用户输入时的无限循环
}

// 处理中文输入法
const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
  handleInput()
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (!editorRef.value) return

    // 如果新值为空，强制清空编辑器
    if (!newValue || newValue.trim() === '') {
      editorRef.value.textContent = ''
      return
    }

    // 检查是否是流式输出场景（文本在末尾增长）
    const isStreamingGrowth = oldValue && newValue.length > oldValue.length && newValue.startsWith(oldValue)

    // 获取当前显示的文本（带标记）
    const currentText = extractTextWithMarkers(editorRef.value)

    // 如果外部值和当前DOM文本不同，或者文本包含未渲染的标记，需要更新
    if (newValue !== currentText) {
      // 流式输出时不保存光标位置，避免干扰
      renderFormattedText(newValue, !isStreamingGrowth)
    } else if (isStreamingGrowth && newValue.includes('**')) {
      // 流式输出过程中，即使文本相同，也要检查是否需要重新格式化
      // 因为可能有新的完整 ** 标记出现
      renderFormattedText(newValue, false)
    }
  },
)

// 初始化
onMounted(() => {
  if (props.modelValue) {
    renderFormattedText(props.modelValue)
  }
})

// 暴露方法给父组件
defineExpose({
  focus: () => {
    editorRef.value?.focus()
  },
  blur: () => {
    editorRef.value?.blur()
  },
  getElement: () => editorRef.value,
})
</script>

<template>
  <div
    ref="editorRef"
    class="rich-text-editor"
    contenteditable="true"
    :data-placeholder="displayPlaceholder"
    @input="handleInput"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @focus="emit('focus')"
    @blur="emit('blur')"
    @scroll="emit('scroll')"
  ></div>
</template>

<style scoped>
.rich-text-editor {
  width: 100%;
  height: 66px;
  font-size: 14px;
  font-family: inherit;
  line-height: 22px;
  border: none;
  background: transparent;
  overflow-y: auto;
  transition: all 0.3s ease;
  box-sizing: content-box;
  outline: none;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  /* 确保与 textarea 对齐 */
  min-height: 66px;
  max-height: 66px;
}

/* 占位符样式 */
.rich-text-editor:empty:before {
  content: attr(data-placeholder);
  color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

/* 灰色占位符文本 */
.rich-text-editor :deep(.text-placeholder) {
  color: rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.04);
  padding: 0 2px;
  border-radius: 2px;
}

/* 自定义滚动条样式 */
.rich-text-editor::-webkit-scrollbar {
  width: 6px;
}

.rich-text-editor::-webkit-scrollbar-button {
  display: none;
}

.rich-text-editor::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.rich-text-editor::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.rich-text-editor::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}

/* Firefox 滚动条样式 */
.rich-text-editor {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.rich-text-editor:focus {
  outline: none;
}
</style>

