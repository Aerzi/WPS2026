<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import starIcon from '@/assets/starPure.svg'
import loadingIcon from '@/assets/loading.svg'
import { calculatePositions } from '@/utils/textPosition'
import { getDisplayTextLength } from '@/utils/textFormatter'
import { HINT_TEXT } from '@/constants/hintText'
import promptOptimizationMap from '@/assets/data/promptOptimizationMap.json'
import UndoButton from '@/components/EditorPanel/UndoButton.vue'
import RichTextEditor from '@/components/EditorPanel/RichTextEditor.vue'

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
  focus: []
  blur: []
}>()

const textareaRef = ref<HTMLDivElement | null>(null)
const richTextEditorRef = ref<InstanceType<typeof RichTextEditor> | null>(null)
const floatingContainerRef = ref<HTMLDivElement | null>(null)
const hintTextWrapperRef = ref<HTMLDivElement | null>(null)
const hintTextRef = ref<HTMLSpanElement | null>(null)
const undoHintTextWrapperRef = ref<HTMLDivElement | null>(null)
const undoHintTextRef = ref<HTMLSpanElement | null>(null)

const textValue = ref(props.modelValue)
const showHintText = ref(true)
const hintTextStatus = ref<'default' | 'optimizing' | 'completed'>('default')
const isLoading = ref(false)
const isStreaming = ref(false)
const originalTextBeforeOptimization = ref('')
const isUndoing = ref(false) // 标记是否正在执行撤回操作
let inputTimer: ReturnType<typeof setTimeout> | null = null
let streamingTimer: ReturnType<typeof setTimeout> | null = null

// 判断是否显示 floating-container
// 1. 输入框完全为空且有 placeholder 时显示
// 2. 输入框有实际内容时显示
// 3. 输入框只有空格或回车时隐藏
const showFloatingContainer = computed(() => {
  // 如果输入框完全为空，检查是否有 placeholder
  if (textValue.value === '') {
    return props.placeholder && props.placeholder.trim() !== ''
  }
  // 如果输入框有内容，检查是否有实际文本（去除空白字符后）
  return textValue.value.trim() !== ''
})

watch(
  () => props.modelValue,
  (newValue) => {
    textValue.value = newValue
  },
)

watch(textValue, (newValue) => {
  emit('update:modelValue', newValue)

  // 如果正在执行撤回操作，跳过处理
  if (isUndoing.value) {
    console.log('watch: 正在执行撤回操作，跳过处理')
    return
  }

  // 如果正在流式输出，不处理用户修改逻辑
  if (isStreaming.value) {
    console.log('watch: isStreaming 为 true，跳过处理')
    return
  }

  // 如果正在优化中，用户修改了文本，停止流式输出
  if (hintTextStatus.value === 'optimizing' || isLoading.value) {
    console.log('watch: 检测到优化中状态，重置状态')
    if (streamingTimer) {
      clearInterval(streamingTimer)
      streamingTimer = null
    }
    hintTextStatus.value = 'default'
    isLoading.value = false
    originalTextBeforeOptimization.value = ''
    updateHintText()
  }
  // 如果用户修改了文本，且之前处于优化完成状态，则重置状态
  else if (
    hintTextStatus.value === 'completed' &&
    newValue !== originalTextBeforeOptimization.value
  ) {
    hintTextStatus.value = 'default'
    originalTextBeforeOptimization.value = ''
    updateHintText()
  }

  handleInputChange()
})

const handleInputChange = () => {
  // 如果正在优化中或已完成，不处理自动隐藏逻辑
  if (
    hintTextStatus.value === 'optimizing' ||
    hintTextStatus.value === 'completed' ||
    isLoading.value
  ) {
    return
  }

  // 用户输入时，立即隐藏提示文本
  if (textValue.value.trim() !== '') {
    // 先获取当前宽度，然后隐藏
    if (hintTextWrapperRef.value) {
      const currentWidth = hintTextWrapperRef.value.scrollWidth
      hintTextWrapperRef.value.style.width = `${currentWidth}px`
      // 强制重排，确保宽度已设置
      void hintTextWrapperRef.value.offsetWidth
      // 然后设置为0，触发过渡动画
      nextTick(() => {
        if (hintTextWrapperRef.value) {
          hintTextWrapperRef.value.style.width = '0px'
        }
      })
    }
    showHintText.value = false
  } else {
    // 如果输入为空，立即显示
    showHintText.value = true
    if (hintTextWrapperRef.value) {
      hintTextWrapperRef.value.style.width = 'auto'
    }
    return
  }

  // 清除之前的定时器
  if (inputTimer) {
    clearTimeout(inputTimer)
  }

  // 停止输入0.5秒后，显示提示文本
  inputTimer = setTimeout(() => {
    if (
      hintTextStatus.value === 'optimizing' ||
      hintTextStatus.value === 'completed' ||
      isLoading.value
    ) {
      return
    }

    if (hintTextWrapperRef.value) {
      // 先设置为0，确保从0开始动画
      hintTextWrapperRef.value.style.width = '0px'
      // 移除hidden类，让内容可见以便获取宽度
      showHintText.value = true
      nextTick(() => {
        if (hintTextWrapperRef.value) {
          // 获取目标宽度
          const targetWidth = hintTextWrapperRef.value.scrollWidth
          // 强制重排
          void hintTextWrapperRef.value.offsetWidth
          // 设置为目标宽度，触发展开动画
          nextTick(() => {
            if (hintTextWrapperRef.value) {
              hintTextWrapperRef.value.style.width = `${targetWidth}px`
              // 动画完成后设置为auto
              setTimeout(() => {
                if (hintTextWrapperRef.value) {
                  hintTextWrapperRef.value.style.width = 'auto'
                }
              }, 300)
            }
          })
        }
      })
    } else {
      showHintText.value = true
    }
  }, 500) // 0.5秒延迟
}

const updateButtonPosition = () => {
  // 获取富文本编辑器的 DOM 元素
  const editorElement = richTextEditorRef.value?.getElement()
  if (!editorElement || !floatingContainerRef.value) return

  nextTick(() => {
    calculatePositions({
      textarea: editorElement,
      container: floatingContainerRef.value!,
      textValue: textValue.value,
    })
  })
}

// 统一的浮动容器点击处理函数
const handleFloatingContainerClick = (e: MouseEvent) => {
  e.stopPropagation()

  // 根据状态决定触发哪个函数
  if (hintTextStatus.value === 'completed') {
    handleUndoClick()
  } else {
    handleOptimizeClick(e)
  }
}

// 处理撤回点击
const handleUndoClick = () => {
  console.log('handleUndoClick 被调用')
  console.log('hintTextStatus:', hintTextStatus.value)
  console.log('originalTextBeforeOptimization:', originalTextBeforeOptimization.value)
  console.log('当前文本:', textValue.value)

  // 只要状态是 'completed'，就允许撤回，即使 originalTextBeforeOptimization 是空字符串
  if (hintTextStatus.value === 'completed') {
    console.log('执行撤回操作')
    // 设置撤回标志，防止 watch 干扰
    isUndoing.value = true

    // 恢复原始文本
    const originalText = originalTextBeforeOptimization.value
    console.log('恢复文本为:', originalText)
    textValue.value = originalText

    // 重置状态
    hintTextStatus.value = 'default'
    originalTextBeforeOptimization.value = ''
    isStreaming.value = false
    isLoading.value = false

    // 在下一个 tick 中重置撤回标志，并更新 UI
    nextTick(() => {
      // 更新提示文本
      updateHintText()
      // 显示提示文本
      showHintText.value = true
      if (hintTextWrapperRef.value) {
        hintTextWrapperRef.value.style.width = '0px'
        nextTick(() => {
          if (hintTextWrapperRef.value) {
            const targetWidth = hintTextWrapperRef.value.scrollWidth
            void hintTextWrapperRef.value.offsetWidth
            nextTick(() => {
              if (hintTextWrapperRef.value) {
                hintTextWrapperRef.value.style.width = `${targetWidth}px`
                setTimeout(() => {
                  if (hintTextWrapperRef.value) {
                    hintTextWrapperRef.value.style.width = 'auto'
                  }
                  // 重置撤回标志
                  isUndoing.value = false
                }, 300)
              } else {
                isUndoing.value = false
              }
            })
          } else {
            isUndoing.value = false
          }
        })
      } else {
        isUndoing.value = false
      }

      // 更新按钮位置
      updateButtonPosition()
    })
  } else {
    console.log('撤回条件不满足，hintTextStatus:', hintTextStatus.value)
  }
}

// 更新提示文本内容
const updateHintText = () => {
  if (!hintTextRef.value) return

  // 使用去掉 ** 标记后的实际显示文本长度来判断
  const displayLength = getDisplayTextLength(textValue.value)
  const shouldShrink = displayLength > HINT_TEXT.SHRINK_THRESHOLD
  const defaultText = shouldShrink ? HINT_TEXT.SHRINK : HINT_TEXT.FULL

  // 确定新文本内容
  let newText = ''
  switch (hintTextStatus.value) {
    case 'optimizing':
      newText = HINT_TEXT.OPTIMIZING
      break
    case 'completed':
      newText = HINT_TEXT.COMPLETED
      break
    default:
      newText = defaultText
  }

  // 获取当前文本
  const currentText = hintTextRef.value.textContent || ''

  // 如果文本相同，不需要切换
  if (currentText === newText) {
    return
  }

  // 如果提示文本当前是显示的，先执行收缩动画
  if (hintTextWrapperRef.value && showHintText.value && currentText) {
    // 先获取当前宽度
    const currentWidth = hintTextWrapperRef.value.scrollWidth
    hintTextWrapperRef.value.style.width = `${currentWidth}px`
    void hintTextWrapperRef.value.offsetWidth

    // 执行收缩动画
    nextTick(() => {
      if (hintTextWrapperRef.value) {
        hintTextWrapperRef.value.style.width = '0px'

        // 等待收缩动画完成（300ms）后再切换文本
        setTimeout(() => {
          if (hintTextRef.value) {
            // 切换文本
            hintTextRef.value.textContent = newText

            // 等待100ms缓冲后再执行展开动画
            setTimeout(() => {
              // 执行展开动画
              if (hintTextWrapperRef.value && showHintText.value) {
                nextTick(() => {
                  if (hintTextWrapperRef.value) {
                    const targetWidth = hintTextWrapperRef.value.scrollWidth
                    void hintTextWrapperRef.value.offsetWidth
                    nextTick(() => {
                      if (hintTextWrapperRef.value) {
                        hintTextWrapperRef.value.style.width = `${targetWidth}px`
                        setTimeout(() => {
                          if (hintTextWrapperRef.value) {
                            hintTextWrapperRef.value.style.width = 'auto'
                          }
                        }, 300)
                      }
                    })
                  }
                })
              }
            }, 100) // 100ms缓冲时间
          }
        }, 300) // 等待收缩动画完成
      }
    })
  } else {
    // 如果提示文本当前是隐藏的，直接切换文本（不执行动画）
    hintTextRef.value.textContent = newText
  }
}

// 查找匹配的优化文本
const findOptimizedText = (original: string): string | null => {
  const trimmed = original.trim()
  const mapping = promptOptimizationMap.mappings.find((item) => item.original.trim() === trimmed)
  return mapping ? mapping.optimized : null
}

// 流式输出文本
const streamText = (targetText: string) => {
  console.log('streamText 开始，目标文本:', targetText)

  if (!textareaRef.value) {
    console.log('textareaRef 不存在')
    isStreaming.value = false
    return
  }

  let currentIndex = 0

  // 清除之前的流式输出定时器
  if (streamingTimer) {
    clearInterval(streamingTimer)
  }

  // 确保流式输出标志已设置（可能在延迟期间已设置）
  isStreaming.value = true
  console.log('isStreaming 设置为 true，开始流式输出')

  // 先清空文本，准备流式输出
  textValue.value = ''
  console.log('文本已清空，开始流式输出')

  streamingTimer = setInterval(() => {
    if (currentIndex < targetText.length) {
      currentIndex++
      textValue.value = targetText.slice(0, currentIndex)
      // 滚动到底部
      const editorElement = richTextEditorRef.value?.getElement()
      if (editorElement) {
        editorElement.scrollTop = editorElement.scrollHeight
      }
    } else {
      // 流式输出完成
      if (streamingTimer) {
        clearInterval(streamingTimer)
        streamingTimer = null
      }
      isStreaming.value = false
      isLoading.value = false
      hintTextStatus.value = 'completed'
      updateHintText()
      // 显示撤回按钮的提示文本
      if (undoHintTextWrapperRef.value) {
        undoHintTextWrapperRef.value.style.width = '0px'
        nextTick(() => {
          if (undoHintTextWrapperRef.value) {
            const targetWidth = undoHintTextWrapperRef.value.scrollWidth
            void undoHintTextWrapperRef.value.offsetWidth
            nextTick(() => {
              if (undoHintTextWrapperRef.value) {
                undoHintTextWrapperRef.value.style.width = `${targetWidth}px`
                setTimeout(() => {
                  if (undoHintTextWrapperRef.value) {
                    undoHintTextWrapperRef.value.style.width = 'auto'
                  }
                }, 300)
              }
            })
          }
        })
      }
      // 更新按钮位置
      nextTick(() => {
        updateButtonPosition()
      })
    }
  }, 30) // 每30ms输出一个字符，可以根据需要调整速度
}

// 处理优化点击
const handleOptimizeClick = (e: MouseEvent) => {
  e.stopPropagation()

  console.log('handleOptimizeClick 被调用')
  console.log('isLoading:', isLoading.value)
  console.log('hintTextStatus:', hintTextStatus.value)

  // 如果正在优化中，不允许重复触发
  if (isLoading.value || hintTextStatus.value === 'optimizing') {
    console.log('已在优化中，返回')
    return
  }

  const currentText = textValue.value.trim()
  console.log('当前文本:', currentText)

  // 如果文本为空，使用 placeholder 作为优化基础
  const textToOptimize = currentText || props.placeholder
  console.log('用于优化的文本:', textToOptimize)

  if (!textToOptimize) {
    console.log('没有文本和placeholder，返回')
    return
  }

  console.log('开始优化流程')

  // 设置 loading 状态
  console.log('步骤1: 设置 loading 状态')
  isLoading.value = true
  hintTextStatus.value = 'optimizing'
  console.log('步骤2: 调用 updateHintText')
  updateHintText()
  console.log('步骤3: updateHintText 完成')

  // 隐藏提示文本
  console.log('步骤4: 隐藏提示文本')
  showHintText.value = false
  if (hintTextWrapperRef.value) {
    const currentWidth = hintTextWrapperRef.value.scrollWidth
    hintTextWrapperRef.value.style.width = `${currentWidth}px`
    void hintTextWrapperRef.value.offsetWidth
    nextTick(() => {
      if (hintTextWrapperRef.value) {
        hintTextWrapperRef.value.style.width = '0px'
      }
    })
  }
  console.log('步骤5: 提示文本隐藏完成')

  // 保存原始文本（如果为空则保存空字符串，因为实际优化的是placeholder）
  console.log('步骤6: 保存原始文本')
  // 注意：这里应该保存当前输入框的文本，而不是 currentText
  // 因为如果用户清空后优化，currentText 为空，但我们需要能够撤回到空状态
  originalTextBeforeOptimization.value = textValue.value
  console.log('原始文本已保存:', originalTextBeforeOptimization.value)

  // 先设置流式输出标志，防止在延迟期间被watch重置
  console.log('步骤7: 设置 isStreaming = true')
  isStreaming.value = true
  console.log('设置 isStreaming = true，准备延迟1.5秒')

  // 等待1.5秒后开始流式输出
  setTimeout(() => {
    console.log('setTimeout 回调执行')
    console.log('检查状态 - isLoading:', isLoading.value)
    console.log('检查状态 - hintTextStatus:', hintTextStatus.value)
    console.log('检查状态 - isStreaming:', isStreaming.value)

    // 检查是否仍在loading状态（防止用户在此期间修改了文本导致状态被重置）
    if (!isLoading.value || hintTextStatus.value !== 'optimizing') {
      console.log('状态已改变，取消流式输出')
      console.log('isLoading:', isLoading.value, 'hintTextStatus:', hintTextStatus.value)
      isStreaming.value = false
      return
    }

    // 查找匹配的优化文本
    const optimizedText = findOptimizedText(textToOptimize)

    if (!optimizedText) {
      console.log('未找到匹配的优化文本，取消流式输出')
      isLoading.value = false
      hintTextStatus.value = 'default'
      isStreaming.value = false
      updateHintText()
      return
    }

    console.log('找到匹配的优化文本，开始流式输出')
    streamText(optimizedText)
  }, 1000)
}

onMounted(() => {
  // 等待富文本编辑器渲染完成后再执行逻辑
  nextTick(() => {
    textareaRef.value = richTextEditorRef.value?.getElement() || null
    updateButtonPosition()
    updateHintText()
    // 初始化时，如果有文本内容，隐藏提示文本
    if (textValue.value.trim() !== '') {
      if (hintTextWrapperRef.value) {
        const currentWidth = hintTextWrapperRef.value.scrollWidth
        hintTextWrapperRef.value.style.width = `${currentWidth}px`
        void hintTextWrapperRef.value.offsetWidth
        nextTick(() => {
          if (hintTextWrapperRef.value) {
            hintTextWrapperRef.value.style.width = '0px'
          }
        })
      }
      showHintText.value = false
    } else {
      // 确保初始状态时宽度是auto
      if (hintTextWrapperRef.value) {
        hintTextWrapperRef.value.style.width = 'auto'
      }
    }
  })
  window.addEventListener('resize', updateButtonPosition)
})

watch(textValue, () => {
  nextTick(() => {
    updateButtonPosition()
  })
})

onBeforeUnmount(() => {
  if (inputTimer) {
    clearTimeout(inputTimer)
  }
  if (streamingTimer) {
    clearInterval(streamingTimer)
  }
})
</script>

<template>
  <div class="textarea-wrapper">
    <RichTextEditor
      ref="richTextEditorRef"
      :model-value="textValue"
      :placeholder="placeholder"
      @update:model-value="textValue = $event"
      @focus="emit('focus')"
      @blur="emit('blur')"
      @scroll="updateButtonPosition"
    />
    <div
      v-if="showFloatingContainer"
      ref="floatingContainerRef"
      class="floating-container"
      @click="handleFloatingContainerClick"
    >
      <!-- 优化按钮状态 -->
      <template v-if="hintTextStatus !== 'completed'">
        <img v-if="!isLoading" :src="starIcon" alt="star" class="floating-button" />
        <img
          v-else
          :src="loadingIcon"
          alt="loading"
          class="floating-button floating-button--loading"
        />
        <div
          ref="hintTextWrapperRef"
          class="hint-text-wrapper"
          :class="{ 'hint-text-wrapper--hidden': !showHintText }"
        >
          <span ref="hintTextRef" class="hint-text"></span>
        </div>
      </template>
      <!-- 撤回按钮状态 -->
      <template v-else>
        <UndoButton />
        <div ref="undoHintTextWrapperRef" class="hint-text-wrapper">
          <span ref="undoHintTextRef" class="hint-text">{{ HINT_TEXT.COMPLETED }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.textarea-wrapper {
  position: relative;
  width: 780px;
  height: 90px;
  min-height: 86px;
  padding: 10px 5px 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 22px;
  flex-direction: column;
  z-index: 2;
  box-sizing: border-box;
}

/* RichTextEditor 组件已包含所有样式 */

.floating-container {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
}

.floating-button {
  width: 16px;
  height: 16px;
  cursor: pointer;
  pointer-events: auto;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
  object-fit: contain;
  flex-shrink: 0;
}

.floating-button:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(150, 126, 235, 0.4));
}

.floating-button--loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hint-text-wrapper {
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  height: 22px;
  width: auto;
  max-width: 200px;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hint-text {
  font-size: 14px;
  line-height: 22px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  cursor: pointer;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  height: 22px;
  min-width: max-content;
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateX(0);
  will-change: transform, opacity;
}

.hint-text-wrapper--hidden .hint-text {
  opacity: 0;
  transform: translateX(-15px);
  pointer-events: none;
}

.hint-text:hover {
  opacity: 0.8;
}
</style>
