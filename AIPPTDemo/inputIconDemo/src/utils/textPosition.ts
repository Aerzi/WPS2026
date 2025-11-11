import { HINT_TEXT, PLACEHOLDER_TEXT } from '../constants/hintText'

export interface TextPositionConfig {
  textarea: HTMLTextAreaElement
  container: HTMLElement
  textValue: string
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
export function getComputedStyles(textarea: HTMLTextAreaElement): ComputedStyles {
  const computedStyle = window.getComputedStyle(textarea)
  return {
    paddingLeft: parseFloat(computedStyle.paddingLeft) || 16,
    paddingRight: parseFloat(computedStyle.paddingRight) || 16,
    paddingTop: parseFloat(computedStyle.paddingTop) || 16,
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
 * 计算按钮和提示文本的位置
 */
export function calculatePositions(config: TextPositionConfig): void {
  const { textarea, container, textValue } = config
  const styles = getComputedStyles(textarea)
  const context = createTextContext(styles)
  if (!context) return

  // 获取容器内的提示文本元素
  const hintText = container.querySelector('.hint-text') as HTMLElement
  if (!hintText) return

  // 获取wrapper的padding（如果有）
  const wrapper = textarea.parentElement
  const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null
  const wrapperPaddingLeft = wrapperStyle ? parseFloat(wrapperStyle.paddingLeft) || 0 : 0

  // 获取textarea相对于wrapper的位置
  const textareaRect = textarea.getBoundingClientRect()
  const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : textareaRect
  const textareaOffsetTop = textareaRect.top - wrapperRect.top

  const textareaWidth = textarea.clientWidth

  // 根据文本长度决定是否收缩提示文本
  const shouldShrink = textValue.length > HINT_TEXT.SHRINK_THRESHOLD
  const hintTextContent = shouldShrink ? HINT_TEXT.SHORT : HINT_TEXT.FULL
  hintText.textContent = hintTextContent

  // 计算文本垂直中心位置
  // 第一行文本的顶部位置 = textarea在wrapper中的偏移 + textarea的paddingTop（如果有）
  const firstLineTop = textareaOffsetTop + styles.paddingTop
  // 文本的垂直中心位置 = 顶部 + lineHeight / 2
  const firstLineCenter = firstLineTop + styles.lineHeight / 2

  // 按钮宽度（16px）
  const buttonWidth = 16
  // 容器内间距（2px）
  const containerGap = 2

  if (textValue.trim() === '') {
    // 如果没有文本，容器显示在placeholder后面
    const textWidth = context.measureText(PLACEHOLDER_TEXT).width
    const containerLeft = wrapperPaddingLeft + textWidth + 8
    // 容器与文本垂直中心对齐：容器高度由lineHeight决定，所以容器中心应该在文本中心
    const containerTop = firstLineCenter - styles.lineHeight / 2

    container.style.left = `${containerLeft}px`
    container.style.top = `${containerTop}px`

    // 计算容器总宽度
    const hintTextWidth = context.measureText(hintTextContent).width
    const containerWidth = buttonWidth + containerGap + hintTextWidth

    // 检查是否会超出边界
    if (containerLeft + containerWidth > textarea.clientWidth + wrapperPaddingLeft) {
      // 如果超出，将容器移到下一行
      container.style.left = `${wrapperPaddingLeft}px`
      container.style.top = `${firstLineCenter + styles.lineHeight - styles.lineHeight / 2}px`
    }
  } else {
    // 如果有文本，计算文本末尾位置
    const lines = textValue.split('\n')
    const lastLine = lines[lines.length - 1]

    // 计算最后一行文本的实际宽度（考虑自动换行）
    const lastLineWidth = context.measureText(lastLine || '').width

    // 计算实际占用的宽度（考虑textarea宽度限制导致的换行）
    let actualWidth = lastLineWidth
    if (lastLineWidth > textareaWidth) {
      // 如果文本宽度超过textarea宽度，计算余数（即当前行实际占用的宽度）
      actualWidth = lastLineWidth % textareaWidth
      if (actualWidth === 0) {
        // 如果正好换行，则宽度为textarea宽度
        actualWidth = textareaWidth
      }
    }

    // 计算所有行的总行数（手动换行 + 自动换行）
    let totalLines = 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] || ''
      const lineWidth = context.measureText(line).width
      if (lineWidth > textareaWidth) {
        // 计算这一行自动换行的行数
        const lineAutoWrap = Math.ceil(lineWidth / textareaWidth)
        totalLines += lineAutoWrap
      } else {
        totalLines += 1
      }
    }

    // 计算最后一行文本的垂直中心位置
    // 总行数 - 1 是因为行号从0开始
    const lastLineCenter =
      firstLineTop + (totalLines - 1) * styles.lineHeight + styles.lineHeight / 2

    const containerLeft = wrapperPaddingLeft + actualWidth + 8
    // 容器与文本垂直中心对齐
    const containerTop = lastLineCenter - styles.lineHeight / 2

    container.style.left = `${containerLeft}px`
    container.style.top = `${containerTop}px`

    // 计算容器总宽度
    const hintTextWidth = context.measureText(hintTextContent).width
    const containerWidth = buttonWidth + containerGap + hintTextWidth

    // 检查是否会超出边界
    if (containerLeft + containerWidth > textarea.clientWidth + wrapperPaddingLeft) {
      // 如果超出，将容器移到下一行
      container.style.left = `${wrapperPaddingLeft}px`
      container.style.top = `${lastLineCenter + styles.lineHeight - styles.lineHeight / 2}px`
    }
  }
}
