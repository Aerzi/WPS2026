/**
 * 文本格式化工具
 * 解析和处理特殊标记文本，如 **text** 格式
 */

export interface TextSegment {
  text: string
  isPlaceholder: boolean // 是否是占位符（灰色显示）
}

/**
 * 解析文本，识别 **text** 标记
 * @param text 原始文本
 * @returns 文本段落数组
 */
export function parseText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  const regex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // 添加标记前的普通文本
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isPlaceholder: false,
      })
    }

    // 添加标记内的文本（不包含 ** 符号）
    segments.push({
      text: match[1],
      isPlaceholder: true,
    })

    lastIndex = regex.lastIndex
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isPlaceholder: false,
    })
  }

  // 如果没有任何标记，返回整个文本作为普通文本
  if (segments.length === 0) {
    segments.push({
      text,
      isPlaceholder: false,
    })
  }

  return segments
}

/**
 * 将文本段落转换为 HTML
 * @param segments 文本段落数组
 * @returns HTML 字符串
 */
export function segmentsToHtml(segments: TextSegment[]): string {
  return segments
    .map((segment) => {
      const escapedText = escapeHtml(segment.text)
      if (segment.isPlaceholder) {
        return `<span class="text-placeholder">${escapedText}</span>`
      }
      return escapedText
    })
    .join('')
}

/**
 * 转义 HTML 特殊字符
 * @param text 原始文本
 * @returns 转义后的文本
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * 从 HTML 元素中提取纯文本（保留 **text** 标记）
 * @param element HTML 元素
 * @returns 纯文本，包含标记
 */
export function extractTextWithMarkers(element: HTMLElement): string {
  let result = ''
  
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || ''
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (el.classList.contains('text-placeholder')) {
        // 将占位符文本用 ** 包围
        result += `**${el.textContent || ''}**`
      } else {
        result += el.textContent || ''
      }
    }
  }
  
  return result
}

/**
 * 从 contenteditable 元素中提取纯文本（不包含标记）
 * @param element HTML 元素
 * @returns 纯文本
 */
export function extractPlainText(element: HTMLElement): string {
  return element.textContent || ''
}

/**
 * 移除文本中的 ** 标记，返回实际显示的文本
 * @param text 原始文本（可能包含 **text** 标记）
 * @returns 纯文本（不包含 ** 标记）
 */
export function removeMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1')
}

/**
 * 获取去掉 ** 标记后的文本长度
 * @param text 原始文本（可能包含 **text** 标记）
 * @returns 实际显示的文本长度
 */
export function getDisplayTextLength(text: string): number {
  return removeMarkers(text).length
}

