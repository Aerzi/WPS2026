<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder: string
  maxLength: number
  showLabel?: boolean
  originalText?: string
  isStreaming?: boolean
  isOptimizing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const internalValue = ref(props.modelValue)
const editorRef = ref<HTMLDivElement | null>(null)
const textWrapperRef = ref<HTMLSpanElement | null>(null)
const tooltipRef = ref<HTMLSpanElement | null>(null)
const optimizedTextRef = ref<HTMLDivElement | null>(null)

// 是否显示对比视图
const showCompareView = computed(() => {
  return props.showLabel && props.originalText
})

// 更新编辑器内容
const updateEditorContent = () => {
  if (!editorRef.value || showCompareView.value) return

  // 获取当前文本
  const currentText = editorRef.value.innerText.trim()

  // 如果文本内容与 modelValue 不一致，更新内容
  if (currentText !== props.modelValue) {
    editorRef.value.innerHTML = ''
    if (props.modelValue) {
      const textNode = document.createTextNode(props.modelValue)
      editorRef.value.appendChild(textNode)
    }
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
    if (!showCompareView.value) {
      nextTick(() => {
        updateEditorContent()
      })
    } else if (showCompareView.value && optimizedTextRef.value) {
      // 在对比视图中，如果优化后的文本内容与 modelValue 不一致，更新内容
      // 但需要确保label始终存在
      if (document.activeElement !== optimizedTextRef.value) {
        const labelText = '优化后 '
        const labelElement = optimizedTextRef.value.querySelector('.compare-label--after')

        if (!labelElement) {
          // 如果label不存在，创建它
          const label = document.createElement('span')
          label.className = 'compare-label compare-label--after'
          label.textContent = labelText
          label.contentEditable = 'false'
          optimizedTextRef.value.innerHTML = ''
          optimizedTextRef.value.appendChild(label)
          if (newValue) {
            optimizedTextRef.value.appendChild(document.createTextNode(newValue))
          }
        } else {
          // 只更新文本内容，保留label
          const currentFullText = optimizedTextRef.value.innerText.trim()
          const currentText = currentFullText.startsWith(labelText)
            ? currentFullText.substring(labelText.length).trim()
            : currentFullText

          if (currentText !== newValue) {
            // 移除所有文本节点，保留label
            const textNodes = Array.from(optimizedTextRef.value.childNodes).filter(
              (node) => node.nodeType === Node.TEXT_NODE,
            )
            textNodes.forEach((node) => node.remove())

            // 添加新的文本内容
            if (newValue) {
              optimizedTextRef.value.appendChild(document.createTextNode(newValue))
            }
          }
        }
      }
    }
  },
)

watch(
  () => props.showLabel,
  () => {
    if (!showCompareView.value) {
      nextTick(() => {
        updateEditorContent()
      })
    } else if (showCompareView.value) {
      // 当显示对比视图时，确保label存在
      nextTick(() => {
        ensureLabelExists()
      })
    }
  },
)

const onInput = (event: Event) => {
  if (showCompareView.value) return

  const target = event.target as HTMLDivElement
  if (!target) return

  // 获取文本内容
  let text = target.innerText.trim()

  // 限制字符数
  if (text.length > props.maxLength) {
    text = text.substring(0, props.maxLength)
    // 重新设置内容
    nextTick(() => {
      updateEditorContent()
      // 移动光标到末尾
      const range = document.createRange()
      const sel = window.getSelection()
      if (sel && editorRef.value) {
        const textNodes = Array.from(editorRef.value.childNodes).filter(
          (node) => node.nodeType === Node.TEXT_NODE,
        )
        if (textNodes.length > 0) {
          const lastTextNode = textNodes[textNodes.length - 1] as Text
          range.setStart(lastTextNode, lastTextNode.length)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    })
  }

  internalValue.value = text
  emit('update:modelValue', text)
}

// 确保label始终存在
const ensureLabelExists = () => {
  if (!optimizedTextRef.value || !showCompareView.value) return

  const labelText = '优化后 '
  const labelElement = optimizedTextRef.value.querySelector('.compare-label--after')

  // 如果label不存在，创建它
  if (!labelElement) {
    const label = document.createElement('span')
    label.className = 'compare-label compare-label--after'
    label.textContent = labelText
    label.contentEditable = 'false'

    // 获取当前文本内容（不包含label）
    const currentText = optimizedTextRef.value.innerText.replace(labelText, '').trim()

    // 重新设置内容：label + 文本
    optimizedTextRef.value.innerHTML = ''
    optimizedTextRef.value.appendChild(label)
    if (currentText) {
      optimizedTextRef.value.appendChild(document.createTextNode(currentText))
    }
  }
}

// 处理优化后文本的输入
const onOptimizedTextInput = (event: Event) => {
  if (!showCompareView.value) return

  const target = event.target as HTMLDivElement
  if (!target) return

  // 保存当前光标位置
  const selection = window.getSelection()
  let cursorPosition = 0
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(target)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    cursorPosition = preCaretRange.toString().length
  }

  // 检查label是否存在
  const labelText = '优化后 '
  const label = target.querySelector('.compare-label--after')

  // 如果label不存在，需要重新创建
  if (!label) {
    // 获取当前文本内容（不包含label）
    const currentText = target.innerText.replace(labelText, '').trim()

    // 限制字符数
    let text = currentText
    if (text.length > props.maxLength) {
      text = text.substring(0, props.maxLength)
    }

    // 重新构建DOM
    nextTick(() => {
      const labelElement = document.createElement('span')
      labelElement.className = 'compare-label compare-label--after'
      labelElement.textContent = labelText
      labelElement.contentEditable = 'false'
      target.innerHTML = ''
      target.appendChild(labelElement)
      if (text) {
        target.appendChild(document.createTextNode(text))
      }

      // 恢复光标位置（减去label的长度）
      const adjustedPosition = Math.max(0, cursorPosition - labelText.length)
      const range = document.createRange()
      const sel = window.getSelection()
      if (sel && target) {
        const textNode = Array.from(target.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE,
        ) as Text
        if (textNode) {
          const position = Math.min(adjustedPosition, textNode.length)
          range.setStart(textNode, position)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    })

    emit('update:modelValue', text)
    return
  }

  // 如果label存在，只提取文本内容并更新
  const fullText = target.innerText
  let text = fullText.startsWith(labelText) ? fullText.substring(labelText.length) : fullText

  // 限制字符数
  if (text.length > props.maxLength) {
    text = text.substring(0, props.maxLength)

    // 如果文本被截断，需要重新设置
    nextTick(() => {
      // 只更新文本节点，保留label
      const textNodes = Array.from(target.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE,
      )
      textNodes.forEach((node) => node.remove())

      if (text) {
        target.appendChild(document.createTextNode(text))
      }

      // 恢复光标位置到末尾
      const range = document.createRange()
      const sel = window.getSelection()
      if (sel && target) {
        const textNode = Array.from(target.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE,
        ) as Text
        if (textNode) {
          range.setStart(textNode, textNode.length)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    })
  } else {
    // 文本没有超限，直接emit，不重新构建DOM
    // 这样可以保持光标位置
    emit('update:modelValue', text.trim())
  }
}

// 更新tooltip位置
const updateTooltipPosition = () => {
  if (!textWrapperRef.value || !tooltipRef.value) return

  const wrapper = textWrapperRef.value
  const tooltip = tooltipRef.value
  const rect = wrapper.getBoundingClientRect()

  // 先显示tooltip以获取其尺寸
  tooltip.style.visibility = 'visible'
  tooltip.style.opacity = '0'
  const tooltipHeight = tooltip.offsetHeight
  const tooltipWidth = tooltip.offsetWidth
  tooltip.style.visibility = 'hidden'
  tooltip.style.opacity = '0'

  // 计算位置：在文本上方居中
  let top = rect.top - tooltipHeight - 8
  let left = rect.left + rect.width / 2 - tooltipWidth / 2

  // 如果上方空间不够，显示在下方
  if (top < 0) {
    top = rect.bottom + 8
  }

  // 确保不超出右边界
  const maxLeft = window.innerWidth - tooltipWidth - 16
  if (left > maxLeft) {
    left = maxLeft
  }

  // 确保不超出左边界
  if (left < 16) {
    left = 16
  }

  // 设置tooltip位置
  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
}

// 监听hover事件更新tooltip位置
const onTextWrapperMouseEnter = () => {
  nextTick(() => {
    updateTooltipPosition()
  })
}

onMounted(() => {
  if (!showCompareView.value) {
    nextTick(() => {
      updateEditorContent()
    })
  } else if (showCompareView.value) {
    // 当显示对比视图时，确保label存在
    nextTick(() => {
      ensureLabelExists()
    })
  }
})
</script>

<template>
  <div class="editor-panel">
    <div class="textarea-wrapper">
      <!-- 对比视图 -->
      <div v-if="showCompareView" class="compare-view">
        <!-- 优化前 -->
        <div class="compare-section compare-section--before">
          <span class="compare-label compare-label--before"> 优化前 </span>
          <span
            class="compare-text-wrapper"
            ref="textWrapperRef"
            @mouseenter="onTextWrapperMouseEnter"
          >
            <span class="compare-text">{{ originalText }}</span>
            <span v-if="originalText" class="compare-text-tooltip" ref="tooltipRef">{{
              originalText
            }}</span>
          </span>
        </div>
        <!-- 分隔线 -->
        <div class="compare-divider"></div>
        <!-- 优化后 -->
        <div class="compare-section compare-section--after">
          <div
            ref="optimizedTextRef"
            class="compare-text compare-text--editable"
            contenteditable="true"
            @input="onOptimizedTextInput"
          >
            <span class="compare-label compare-label--after" contenteditable="false">优化后 </span
            >{{ modelValue }}
          </div>
        </div>
      </div>
      <!-- 普通编辑器 -->
      <div
        v-else
        ref="editorRef"
        class="ppt-input"
        contenteditable="true"
        :data-placeholder="placeholder"
        @input="onInput"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.editor-panel {
  margin-bottom: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.textarea-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ppt-input {
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
  flex: 1;
  min-height: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.ppt-input:empty:before {
  content: attr(data-placeholder);
  color: #bbbfc4;
  pointer-events: none;
}

.compare-label-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  vertical-align: middle;
  flex-shrink: 0;
}

.compare-label-button svg {
  width: 12px;
  height: 12px;
  display: block;
}

.cancel-button {
  background-color: rgba(185, 191, 202, 0.2);
  color: #8f959e;
}

.cancel-button:hover {
  background-color: rgba(185, 191, 202, 0.35);
}

.cancel-button svg {
  color: #8f959e;
}

.cancel-button:hover svg {
  color: #646a73;
}

.submit-button {
  background-color: rgba(120, 193, 61, 0.2);
  color: #a0d911;
}

.submit-button:hover {
  background-color: rgba(120, 193, 61, 0.35);
}

.submit-button svg {
  color: #a0d911;
}

.submit-button:hover svg {
  color: #7cb305;
}

.button-tooltip {
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
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
  z-index: 10001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.button-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: rgba(45, 50, 56, 0.95);
}

.compare-label-button:hover .button-tooltip {
  opacity: 1;
  visibility: visible;
}

/* 对比视图样式 */
.compare-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.compare-section {
  padding: 4px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2329;
}

.compare-section--before {
  flex-shrink: 0;
  color: #8f959e;
  user-select: none;
  overflow: visible;
  min-width: 0;
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
}

.compare-section--after {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.compare-label {
  display: inline-block;
  padding: 2px 9px;
  font-size: 14px;
  font-style: italic;
  font-weight: 500;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.compare-label--before {
  background-color: rgba(185, 191, 202, 0.2);
  color: #8f959e;
  user-select: none;
}

.compare-label--after {
  background-color: rgba(120, 193, 61, 0.2);
  color: #a0d911;
}

.compare-text {
  display: inline;
  color: #1f2329;
  white-space: pre-wrap;
  word-break: break-word;
}

.compare-text--editable {
  display: block;
  width: 100%;
  min-height: 20px;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2329;
  font-family: inherit;
  cursor: text;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

.compare-text--editable:focus {
  outline: none;
}

.compare-text--editable .compare-label {
  display: inline-block;
  vertical-align: baseline;
  margin-right: 8px;
  user-select: none;
  cursor: default;
  pointer-events: none;
}

.compare-section--before .compare-text-wrapper {
  position: relative;
  display: block;
  flex: 1;
  min-width: 0;
  min-height: 20px;
  cursor: help;
  overflow: visible;
}

.compare-section--before .compare-text {
  color: #8f959e;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
}

.compare-text-tooltip {
  position: fixed;
  padding: 12px 16px;
  background: rgba(45, 50, 56, 0.95);
  color: #ffffff;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 500px;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  pointer-events: none;
  font-weight: normal;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.compare-text-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20px;
  border: 6px solid transparent;
  border-top-color: rgba(45, 50, 56, 0.95);
}

.compare-text-wrapper:hover .compare-text-tooltip {
  opacity: 1;
  visibility: visible;
}

.compare-divider {
  width: 100%;
  height: 1px;
  background-color: #e1e4e8;
  margin: 2px 0;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* 滚动条样式 */
.ppt-input::-webkit-scrollbar,
.compare-section--after::-webkit-scrollbar {
  width: 6px;
}

.ppt-input::-webkit-scrollbar-track,
.compare-section--after::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.ppt-input::-webkit-scrollbar-thumb,
.compare-section--after::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.ppt-input::-webkit-scrollbar-thumb:hover,
.compare-section--after::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
}
</style>
