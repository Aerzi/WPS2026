import { HINT_TEXT } from '../constants/hintText'
import { getDisplayTextLength, removeMarkers } from './textFormatter'

export interface TextPositionConfig {
  textarea: HTMLTextAreaElement | HTMLElement  // rich-text-editor元素
  container: HTMLElement  // floating-container元素
  textValue: string
  placeholder?: string
  forceEndPosition?: boolean  // 强制使用文本末尾位置（流式输出时用）
}

export interface ComputedStyles {
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  lineHeight: number
  fontSize: number
  fontFamily: string
  fontWeight: string
  fontStyle: string
}

/**
 * 获取文本域的样式信息
 */
export function getComputedStyles(textarea: HTMLTextAreaElement | HTMLElement): ComputedStyles {
  const computedStyle = window.getComputedStyle(textarea)
  
  const getPaddingValue = (value: string, defaultValue: number): number => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }
  
  return {
    paddingLeft: getPaddingValue(computedStyle.paddingLeft, 16),
    paddingRight: getPaddingValue(computedStyle.paddingRight, 16),
    paddingTop: getPaddingValue(computedStyle.paddingTop, 0),
    lineHeight: parseFloat(computedStyle.lineHeight) || 22,
    fontSize: parseFloat(computedStyle.fontSize) || 14,
    fontFamily: computedStyle.fontFamily,
    fontWeight: computedStyle.fontWeight,
    fontStyle: computedStyle.fontStyle,
  }
}

/**
 * 创建文本测量上下文
 */
export function createTextContext(styles: ComputedStyles): CanvasRenderingContext2D | null {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return null

  context.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize}px ${styles.fontFamily}`
  return context
}

/**
 * 获取光标位置的Range对象
 */
function getCaretRange(): Range | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  return selection.getRangeAt(0)
}

/**
 * 获取contenteditable元素中最后一个文本节点的位置
 */
function getLastTextNodePosition(element: HTMLElement): { left: number; top: number; height: number } | null {
  // 创建一个range来获取最后的位置
  const range = document.createRange()
  
  // 获取最后一个可见的节点
  let lastNode: Node | null = null
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)
  
  while (walker.nextNode()) {
    lastNode = walker.currentNode
  }
  
  if (!lastNode || !lastNode.textContent) {
    return null
  }
  
  try {
    range.setStart(lastNode, lastNode.textContent.length)
    range.setEnd(lastNode, lastNode.textContent.length)
    const rect = range.getBoundingClientRect()
    return {
      left: rect.left,
      top: rect.top,
      height: rect.height || 22
    }
  } catch {
    return null
  }
}

/**
 * 计算按钮和提示文本的位置
 */
export function calculatePositions(config: TextPositionConfig): void {
  const { textarea, container, textValue, placeholder = '', forceEndPosition = false } = config
  const styles = getComputedStyles(textarea)
  const context = createTextContext(styles)
  if (!context) return

  // 获取容器内的提示文本元素
  const hintText = container.querySelector('.hint-text') as HTMLElement
  if (!hintText) return

  // 获取wrapper（floating-container的父元素，也是定位上下文）
  const wrapper = container.parentElement
  if (!wrapper) return

  // 获取位置信息（用于计算相对位置）
  const wrapperRect = wrapper.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()

  // 获取当前文本内容，如果已经是优化中或优化完成状态，优先保持该状态
  const currentText = hintText.textContent || ''
  let hintTextContent: string
  
  // 如果当前文本是优化完成或正在优化，优先保持该状态
  if (currentText === HINT_TEXT.COMPLETED || currentText === HINT_TEXT.OPTIMIZING) {
    hintTextContent = currentText
  } else {
    // 否则根据文本长度决定是否收缩提示文本
    const displayLength = getDisplayTextLength(textValue)
    const shouldShrink = displayLength > HINT_TEXT.SHRINK_THRESHOLD
    hintTextContent = shouldShrink ? HINT_TEXT.SHRINK : HINT_TEXT.FULL
    hintText.textContent = hintTextContent
  }

  // 按钮宽度（16px）
  const buttonWidth = 16
  // 容器内间距（2px）
  const containerGap = 2

  if (textValue.trim() === '') {
    // 如果没有文本，容器显示在placeholder后面
    const displayPlaceholder = removeMarkers(placeholder)
    const textWidth = context.measureText(displayPlaceholder).width
    
    // textarea相对于wrapper的left偏移
    const textareaOffsetLeft = textareaRect.left - wrapperRect.left
    
    // 计算容器位置（相对于wrapper）
    const containerLeft = textareaOffsetLeft + textWidth + 8
    const containerTop = textareaRect.top - wrapperRect.top

    container.style.left = `${containerLeft}px`
    container.style.top = `${containerTop}px`

    // 计算容器总宽度
    const hintTextWidth = context.measureText(hintTextContent).width
    const containerWidth = buttonWidth + containerGap + hintTextWidth

    // 检查是否会超出边界（相对于wrapper的宽度）
    const wrapperWidth = wrapper.clientWidth
    if (containerLeft + containerWidth > wrapperWidth) {
      // 如果超出，将容器移到下一行
      container.style.left = `${textareaOffsetLeft}px`
      container.style.top = `${containerTop + styles.lineHeight}px`
    }
  } else {
    // 判断使用哪种定位方式
    let positionRect: { left: number; top: number; height?: number } | null = null
    
    // 如果强制使用文本末尾位置（流式输出），或者无法获取光标位置
    if (forceEndPosition) {
      // 流式输出：使用文本末尾位置
      positionRect = getLastTextNodePosition(textarea)
    } else {
      // 正常编辑：优先使用光标位置
      const range = getCaretRange()
      if (range) {
        const rangeRect = range.getBoundingClientRect()
        positionRect = {
          left: rangeRect.left,
          top: rangeRect.top,
          height: rangeRect.height || styles.lineHeight
        }
      } else {
        // 如果无法获取光标，回退到文本末尾位置
        positionRect = getLastTextNodePosition(textarea)
      }
    }
    
    if (positionRect) {
      // 计算相对于wrapper的位置
      const containerLeft = positionRect.left - wrapperRect.left + 8
      const containerTop = positionRect.top - wrapperRect.top
      
      container.style.left = `${containerLeft}px`
      container.style.top = `${containerTop}px`
      
      // 计算容器总宽度
      const hintTextWidth = context.measureText(hintTextContent).width
      const containerWidth = buttonWidth + containerGap + hintTextWidth
      
      // 检查是否会超出边界
      const wrapperWidth = wrapper.clientWidth
      if (containerLeft + containerWidth > wrapperWidth) {
        // 如果超出，将容器移到下一行
        const textareaOffsetLeft = textareaRect.left - wrapperRect.left
        container.style.left = `${textareaOffsetLeft}px`
        container.style.top = `${containerTop + styles.lineHeight}px`
      }
    }
  }
}
