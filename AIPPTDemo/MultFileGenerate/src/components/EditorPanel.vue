<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder: string
  maxLength: number
  showLabel?: boolean
  originalText?: string
}>()

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const editorRef = ref<HTMLDivElement | null>(null)
const LABEL_ID = 'editor-label'

// 更新编辑器内容
const updateEditorContent = () => {
  if (!editorRef.value) return
  
  const label = editorRef.value.querySelector(`#${LABEL_ID}`)
  // 获取当前文本（如果存在 label，需要排除 label 文本）
  let currentText = editorRef.value.innerText
  if (props.showLabel) {
    currentText = currentText.replace(/修改后/g, '').trim()
  } else {
    currentText = currentText.trim()
  }
  
  // 如果文本内容与 modelValue 不一致，更新内容
  if (currentText !== props.modelValue) {
    editorRef.value.innerHTML = ''
    
    // 只在 showLabel 为 true 时添加 label
    if (props.showLabel) {
      const labelSpan = document.createElement('span')
      labelSpan.id = LABEL_ID
      labelSpan.className = 'editor-label'
      labelSpan.contentEditable = 'false'
      labelSpan.textContent = '优化对比'
      // 添加内联样式以确保样式应用
      labelSpan.style.cssText = 'display: inline-block; padding: 2px 8px; background: rgba(120, 193, 61, 0.2); color: #389e0d; font-size: 12px; font-weight: 500; border-radius: 6px; margin-right: 6px; user-select: none; vertical-align: text-top; line-height: 1.5; position: relative; cursor: pointer;'
      
      // 添加 tooltip
      if (props.originalText) {
        const tooltip = document.createElement('div')
        tooltip.className = 'editor-label-tooltip'
        tooltip.textContent = props.originalText
        tooltip.style.cssText = 'position: absolute; top: calc(100% + 8px); left: 0; padding: 8px 12px; background: rgba(45, 50, 56, 0.95); color: #ffffff; font-size: 12px; line-height: 1.5; border-radius: 4px; white-space: pre-wrap; word-break: break-word; max-width: 500px; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 10000; pointer-events: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
        labelSpan.appendChild(tooltip)
        
        // 添加 hover 事件
        labelSpan.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1'
          tooltip.style.visibility = 'visible'
        })
        labelSpan.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0'
          tooltip.style.visibility = 'hidden'
        })
      }
      
      editorRef.value.appendChild(labelSpan)
    }
    
    if (props.modelValue) {
      const textNode = document.createTextNode(props.modelValue)
      editorRef.value.appendChild(textNode)
    }
  } else {
    // 根据 showLabel 状态添加或移除 label
    if (props.showLabel && !label) {
      // 需要添加 label
      const labelSpan = document.createElement('span')
      labelSpan.id = LABEL_ID
      labelSpan.className = 'editor-label'
      labelSpan.contentEditable = 'false'
      labelSpan.textContent = '优化对比'
      // 添加内联样式以确保样式应用
      labelSpan.style.cssText = 'display: inline-block; padding: 2px 8px; background: rgba(120, 193, 61, 0.2); color: #389e0d; font-size: 12px; font-weight: 500; border-radius: 6px; margin-right: 6px; user-select: none; vertical-align: text-top; line-height: 1.5; position: relative; cursor: pointer;'
      
      // 添加 tooltip
      if (props.originalText) {
        const tooltip = document.createElement('div')
        tooltip.className = 'editor-label-tooltip'
        tooltip.textContent = props.originalText
        tooltip.style.cssText = 'position: absolute; top: calc(100% + 8px); left: 0; padding: 8px 12px; background: rgba(45, 50, 56, 0.95); color: #ffffff; font-size: 12px; line-height: 1.5; border-radius: 4px; white-space: pre-wrap; word-break: break-word; max-width: 500px; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 10000; pointer-events: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
        labelSpan.appendChild(tooltip)
        
        // 添加 hover 事件
        labelSpan.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1'
          tooltip.style.visibility = 'visible'
        })
        labelSpan.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0'
          tooltip.style.visibility = 'hidden'
        })
      }
      
      editorRef.value.insertBefore(labelSpan, editorRef.value.firstChild)
    } else if (!props.showLabel && label) {
      // 需要移除 label
      label.remove()
    }
  }
}

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
  nextTick(() => {
    updateEditorContent()
  })
})

watch(() => props.showLabel, () => {
  nextTick(() => {
    updateEditorContent()
  })
})

const onInput = (event: Event) => {
  const target = event.target as HTMLDivElement
  if (!target) return
  
  // 获取文本内容（排除 label，如果存在）
  let text = target.innerText
  if (props.showLabel) {
    text = text.replace(/优化对比/g, '').trim()
  } else {
    text = text.trim()
  }
  
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
          node => node.nodeType === Node.TEXT_NODE
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

// 防止删除 label
const onKeyDown = (event: KeyboardEvent) => {
  if (!editorRef.value || !props.showLabel) return
  
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  
  const range = selection.getRangeAt(0)
  const label = editorRef.value.querySelector(`#${LABEL_ID}`)
  
  if (!label) {
    // 如果 label 不存在，重新添加
    nextTick(() => {
      updateEditorContent()
    })
    return
  }
  
  // 检查是否尝试删除 label
  const isDeletingLabel = 
    (range.startContainer === label || range.endContainer === label) ||
    (range.startContainer.nodeType === Node.TEXT_NODE && 
     range.startContainer.parentElement === label) ||
    (range.endContainer.nodeType === Node.TEXT_NODE && 
     range.endContainer.parentElement === label)
  
  // 如果尝试删除 label，阻止删除并移动光标
  if ((event.key === 'Backspace' || event.key === 'Delete') && isDeletingLabel) {
    event.preventDefault()
    // 将光标移动到 label 后的第一个文本节点
    nextTick(() => {
      const textNodes = Array.from(editorRef.value!.childNodes).filter(
        node => node.nodeType === Node.TEXT_NODE && node !== label
      )
      if (textNodes.length > 0) {
        const firstTextNode = textNodes[0] as Text
        const newRange = document.createRange()
        newRange.setStart(firstTextNode, 0)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        // 如果没有文本节点，在 label 后创建一个
        const textNode = document.createTextNode('')
        editorRef.value!.insertBefore(textNode, label.nextSibling)
        const newRange = document.createRange()
        newRange.setStart(textNode, 0)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    })
  }
  
  // 确保 label 始终在开头
  if (label.previousSibling) {
    nextTick(() => {
      editorRef.value!.insertBefore(label, editorRef.value!.firstChild)
    })
  }
}

onMounted(() => {
  nextTick(() => {
    updateEditorContent()
  })
})
</script>

<template>
  <div class="editor-panel">
    <div class="textarea-wrapper">
      <div
        ref="editorRef"
        class="ppt-input"
        contenteditable="true"
        :data-placeholder="placeholder"
        @input="onInput"
        @keydown="onKeyDown"
      ></div>
    </div>
    <div class="input-toolbar">
      <div class="char-counter">{{ internalValue.length }} / {{ maxLength }}</div>
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

:deep(.editor-label) {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(120, 193, 61, 0.2);
  color: #389e0d;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  margin-right: 6px;
  user-select: none;
  vertical-align: text-top;
  line-height: 1.5;
  position: relative;
  cursor: pointer;
}

:deep(.editor-label-tooltip) {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  padding: 8px 12px;
  background: rgba(45, 50, 56, 0.95);
  color: #ffffff;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 500px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.editor-label:hover .editor-label-tooltip) {
  opacity: 1;
  visibility: visible;
}

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 8px;
  flex-shrink: 0;
}

.char-counter {
  font-size: 12px;
  color: #8f959e;
  user-select: none;
}

/* 滚动条样式 */
.ppt-input::-webkit-scrollbar {
  width: 6px;
}

.ppt-input::-webkit-scrollbar-track {
  background: #f7f8fa;
  border-radius: 3px;
}

.ppt-input::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
  transition: background 0.2s;
}

.ppt-input::-webkit-scrollbar-thumb:hover {
  background: #a8adb5;
}
</style>