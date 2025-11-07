<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  xhtmlOut: true  // 确保输出正确闭合的 XHTML 标签
})

interface SearchResult {
  title: string
  summary: string
  link: string
  authors: string[]
  published: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  searchResults?: SearchResult[]
  isLoading?: boolean
  showGenerateButton?: boolean
  report?: string
  isGenerating?: boolean
  topic?: string
  collapseResults?: boolean
}

const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(false)
const mainContentRef = ref<HTMLElement | null>(null)
const loadingTexts = ['正在生成开题报告', '请耐心等候', '分析文献中', '撰写报告中']
const currentLoadingTextIndex = ref(0)

// 报告相关状态
const activeReport = ref<{
  topic: string
  content: string
  isGenerating: boolean
  messageIndex: number
} | null>(null)

// 参数设置
const startYear = ref('2020')
const endYear = ref(new Date().getFullYear().toString())
const maxResults = ref(10)

// 字数统计
const charCount = computed(() => inputText.value.length)
const maxChars = 5000

const scrollToBottom = async (force = false) => {
  await nextTick()
  // 等待DOM更新后再滚动
  setTimeout(() => {
    if (mainContentRef.value) {
      mainContentRef.value.scrollTo({
        top: mainContentRef.value.scrollHeight,
        behavior: force ? 'auto' : 'smooth'
      })
    }
  }, 100)
}

const handleSend = async () => {
  if (!inputText.value.trim() || isLoading.value || charCount.value > maxChars) return

  const userMessage = inputText.value.trim()
  inputText.value = ''

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage
  })

  // 滚动到底部
  scrollToBottom()

  // 添加loading消息
  const loadingMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '正在搜索文献...',
    isLoading: true
  })

  isLoading.value = true
  scrollToBottom()

  try {
    // 调用后端搜索API
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userMessage,
        startYear: parseInt(startYear.value),
        endYear: parseInt(endYear.value),
        maxResults: maxResults.value,
      }),
    })

    if (!response.ok) {
      throw new Error('搜索失败')
    }

    const data = await response.json()

    // 替换loading消息为实际结果
    messages.value[loadingMessageIndex] = {
      role: 'assistant',
      content: `找到 ${data.results.length} 篇相关文献`,
      searchResults: data.results,
      isLoading: false,
      showGenerateButton: true,
      topic: userMessage
    }

    // 数据更新后立即滚动
    await nextTick()
    scrollToBottom()

    // 再次确保滚动到底部（等待内容完全渲染）
    setTimeout(() => scrollToBottom(), 300)
  } catch {
    // 替换loading消息为错误消息
    messages.value[loadingMessageIndex] = {
      role: 'assistant',
      content: '抱歉，搜索过程中出现错误，请稍后重试。',
      isLoading: false
    }

    await nextTick()
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Markdown格式化
const formatMarkdown = (text: string) => {
  try {
    // 预处理：修复可能的格式问题
    let processedText = text

    // 0. 首先清理所有可能残留的 <BR> 标签（不区分大小写）
    processedText = processedText.replace(/<BR>/gi, '\n')
    processedText = processedText.replace(/&lt;BR&gt;/gi, '\n')
    processedText = processedText.replace(/<br>/gi, '\n')

    // 1. 替换全角破折号为标准连字符（表格分隔符）
    processedText = processedText.replace(/\|(\s*)—+(\s*)\|/g, '| --- |')

    // 2. 确保标题格式正确（# 后面有空格）
    processedText = processedText.replace(/^(#{1,6})([^\s#])/gm, '$1 $2')

    // 3. 修复表格格式
    // 3.1 确保表格分隔行格式正确（支持多个连字符）
    processedText = processedText.replace(/\|\s*[-—]+\s*\|/g, '| --- |')
    // 3.2 确保表格每行都以 | 开头和结尾
    processedText = processedText.replace(/^\|(.+)\|$/gm, '|$1|')
    // 3.3 确保表格前后有空行
    processedText = processedText.replace(/([^\n])\n(\|.+\|)/gm, '$1\n\n$2')
    processedText = processedText.replace(/(\|.+\|)\n([^\n|])/gm, '$1\n\n$2')

    // 4. 确保标题行独立（标题前后都有换行）
    // 4.1 标题前添加换行（如果前面不是换行符）
    processedText = processedText.replace(/([^\n])(#{1,6}\s+)/gm, '$1\n\n$2')
    // 4.2 标题后添加换行（使用正向预查，不消耗字符）
    processedText = processedText.replace(/(#{1,6}\s+.+?)$/gm, '$1\n\n')

    // 5. 清理多余的连续换行（最多保留两个换行）
    processedText = processedText.replace(/\n{3,}/g, '\n\n')

    console.log('📝 Markdown内容预览（前500字符）:')
    console.log(processedText.substring(0, 500))
    console.log('---')

    // 使用 MarkdownIt 渲染
    const html = md.render(processedText)

    console.log('🎨 渲染后的HTML预览（前500字符）:')
    console.log(html.substring(0, 500))
    console.log('---')

    return html
  } catch (error) {
    console.error('❌ Markdown渲染错误:', error)
    return text.replace(/\n/g, '<br>')
  }
}

// 生成年份选项
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= 1990; i--) {
    years.push(i.toString())
  }
  return years
})

// 下载DOCX
const handleDownloadDocx = async (messageIndex: number) => {
  const message = messages.value[messageIndex]
  if (!message || !message.report || !message.topic) return

  try {
    console.log('📥 开始下载DOCX...')
    const response = await fetch('/api/export-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: message.topic,
        content: message.report,
      }),
    })

    if (!response.ok) {
      throw new Error('导出失败')
    }

    // 获取文件名
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = '开题报告.docx'
    if (contentDisposition) {
      const matches = /filename="(.+)"/.exec(contentDisposition)
      if (matches && matches[1]) {
        filename = decodeURIComponent(matches[1])
      }
    }

    // 创建blob并下载
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log('✅ DOCX下载完成')
  } catch (error) {
    console.error('❌ 下载DOCX失败:', error)
    alert('下载失败，请稍后重试')
  }
}

// 生成开题报告
const handleGenerateReport = async (messageIndex: number) => {
  const message = messages.value[messageIndex]
  if (!message || !message.searchResults || !message.topic) return

  console.log('🚀 开始生成报告，消息索引:', messageIndex)

  // 隐藏生成按钮，显示生成中状态
  message.showGenerateButton = false
  message.isGenerating = true
  message.report = ''
  message.collapseResults = true  // 默认收起文献列表

  // 初始化右侧报告面板
  activeReport.value = {
    topic: message.topic,
    content: '',
    isGenerating: true,
    messageIndex: messageIndex
  }

  // 启动loading文字切换动画
  currentLoadingTextIndex.value = 0
  const loadingInterval = setInterval(() => {
    currentLoadingTextIndex.value = (currentLoadingTextIndex.value + 1) % loadingTexts.length
  }, 2000)

  scrollToBottom()

  try {
    console.log('📤 发送请求到后端...')
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: message.topic,
        results: message.searchResults,
      }),
    })

    console.log('📥 收到响应，状态码:', response.status)

    if (!response.ok) {
      throw new Error('生成报告失败')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('无法读取响应流')
    }

    console.log('📖 开始读取流数据...')
    const currentMessage = messages.value[messageIndex]
    if (!currentMessage) {
      console.error('❌ 无法找到消息对象')
      return
    }

    let chunkCount = 0
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log('✅ 流读取完成，共接收', chunkCount, '个数据块')
        currentMessage.isGenerating = false
        clearInterval(loadingInterval)
        break
      }

      const text = decoder.decode(value, { stream: true })
      console.log('📦 收到数据块 #' + (++chunkCount) + ':', text.substring(0, 100) + (text.length > 100 ? '...' : ''))

      const lines = text.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line || line.trim() === '') continue

        console.log('📝 处理行 [' + i + ']:', line.substring(0, 100))

        // 格式：event: data 后面跟着 data: 内容
        if (line.startsWith('event: data')) {
          console.log('🎯 发现 event: data，查找下一行的 data:')
          // 查找下一个非空行
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j]
            if (!nextLine || nextLine.trim() === '') continue

            if (nextLine.startsWith('data: ')) {
              const content = nextLine.substring(6) // 保留原始内容（包括空格）
              console.log('💬 提取到内容，长度:', content.length, '预览:', content.substring(0, 50))

              // 修复：不要过滤空格，即使内容只是空格也要保留
              if (content !== undefined && content !== null && content !== '') {
                const msg = messages.value[messageIndex]
                if (msg) {
                  const oldLength = (msg.report || '').length
                  // 将 <BR> 替换为真正的换行符 \n（不区分大小写，处理所有变体）
                  const processedContent = content.replace(/<BR>/gi, '\n').replace(/&lt;BR&gt;/gi, '\n')
                  msg.report = (msg.report || '') + processedContent
                  const newLength = msg.report.length
                  console.log('📊 报告长度: %d → %d (+%d)', oldLength, newLength, processedContent.length)

                  // 同时更新右侧报告面板
                  if (activeReport.value && activeReport.value.messageIndex === messageIndex) {
                    activeReport.value.content = msg.report
                  }

                  await nextTick()
                  scrollToBottom()
                }
              }
              i = j // 跳过已处理的行
              break
            }
          }
        } else if (line.startsWith('event: done')) {
          console.log('🏁 收到完成事件 (event: done)')
          const msg = messages.value[messageIndex]
          if (msg) {
            msg.isGenerating = false
            clearInterval(loadingInterval)

            // 更新右侧报告面板状态
            if (activeReport.value && activeReport.value.messageIndex === messageIndex) {
              activeReport.value.isGenerating = false
            }
          }
          break
        }
      }
    }

    console.log('✨ 报告生成完成！最终长度:', currentMessage.report?.length || 0)
  } catch (error) {
    console.error('❌ 生成报告错误:', error)
    clearInterval(loadingInterval)
    const msg = messages.value[messageIndex]
    if (msg) {
      msg.isGenerating = false
      msg.report = '生成报告时出现错误，请稍后重试。'

      // 更新右侧报告面板
      if (activeReport.value && activeReport.value.messageIndex === messageIndex) {
        activeReport.value.isGenerating = false
        activeReport.value.content = '生成报告时出现错误，请稍后重试。'
      }
    }
  }
}

// 关闭报告面板
const closeReportPanel = () => {
  activeReport.value = null
}
</script>

<template>
  <div class="app-container">
    <!-- 头部 -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">AI开题报告写作助手</h1>
        <p class="subtitle">基于OpenAlex的学术文献搜索工具</p>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main ref="mainContentRef" class="main-content" :class="{ 'has-report-panel': activeReport }">
      <!-- 左侧：消息区域 -->
      <div class="chat-container" :class="{ 'with-report': activeReport }">
        <!-- 欢迎页面 -->
        <div v-if="messages.length === 0" class="welcome-screen">
          <div class="welcome-icon">📚</div>
          <h2 class="welcome-title">开始您的学术研究</h2>
          <p class="welcome-desc">输入研究主题，在OpenAlex数据库中搜索全球学术文献</p>

          <div class="suggestion-cards">
            <div class="suggestion-card" @click="inputText = '深度学习在图像识别中的应用'">
              <span class="suggestion-icon">🤖</span>
              <span class="suggestion-text">深度学习在图像识别中的应用</span>
            </div>
            <div class="suggestion-card" @click="inputText = '量子计算的最新进展'">
              <span class="suggestion-icon">⚛️</span>
              <span class="suggestion-text">量子计算的最新进展</span>
            </div>
            <div class="suggestion-card" @click="inputText = '自然语言处理技术研究'">
              <span class="suggestion-icon">💬</span>
              <span class="suggestion-text">自然语言处理技术研究</span>
            </div>
          </div>
        </div>

        <!-- 对话消息列表 -->
        <div v-else class="messages-list">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message-item', `message-${message.role}`]"
          >
            <div class="message-avatar">
              <span v-if="message.role === 'user'">👤</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-content">
              <div class="message-header">
                <!-- 状态标签 -->
                <span v-if="message.role === 'assistant' && message.isLoading" class="status-badge status-loading">
                  拉取文献中
                </span>
                <span v-else-if="message.role === 'assistant' && message.searchResults && message.searchResults.length > 0" class="status-badge status-success">
                  请查看文献
                </span>

                <div class="message-text">{{ message.content }}</div>
              </div>

              <!-- Loading状态 -->
              <div v-if="message.isLoading" class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <!-- 生成报告按钮 -->
              <div v-if="message.showGenerateButton" class="generate-section">
                <p class="generate-prompt">📝 请问要生成开题报告吗？</p>
                <button @click="handleGenerateReport(index)" class="generate-btn">
                  生成开题报告
                </button>
              </div>

              <!-- 报告生成中 -->
              <div v-if="message.isGenerating" class="report-generating">
                <div class="generating-header">
                  <span class="status-badge status-loading">生成中</span>
                  <span class="generating-text">
                    <span class="loading-text-animated">{{ loadingTexts[currentLoadingTextIndex] }}</span>
                    <span class="loading-dots-text">
                      <span class="dot">.</span>
                      <span class="dot">.</span>
                      <span class="dot">.</span>
                    </span>
                  </span>
                </div>
                <div class="loading-progress">
                  <div class="progress-bar"></div>
                </div>
              </div>

              <!-- 搜索结果列表 -->
              <div v-if="message.searchResults && message.searchResults.length > 0" class="search-results-container">
                <div
                  class="results-toggle"
                  @click="message.collapseResults = !message.collapseResults"
                  v-if="message.report || message.isGenerating"
                >
                  <span class="toggle-icon" :class="{ 'toggle-icon-collapsed': message.collapseResults }">▼</span>
                  <span class="toggle-text">{{ message.collapseResults ? '展开' : '收起' }}文献列表（{{ message.searchResults.length }}篇）</span>
                </div>
                <div
                  class="search-results"
                  :class="{ 'search-results-collapsed': message.collapseResults }"
                >
                  <div
                    v-for="(result, idx) in message.searchResults"
                    :key="idx"
                    class="result-card"
                  >
                    <div class="result-header">
                      <span class="result-number">{{ idx + 1 }}</span>
                      <h3 class="result-title">{{ result.title }}</h3>
                    </div>
                    <p class="result-authors">
                      <span class="author-icon">👥</span>
                      {{ result.authors.slice(0, 3).join(', ') }}
                      <span v-if="result.authors.length > 3" class="more-authors">等{{ result.authors.length }}位作者</span>
                    </p>
                    <p class="result-summary">{{ result.summary }}</p>
                    <div class="result-footer">
                      <span class="result-date">📅 {{ result.published }}</span>
                      <a :href="result.link" target="_blank" class="result-link">
                        查看原文 →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：报告面板 -->
      <div v-if="activeReport" class="report-panel">
        <div class="report-panel-header">
          <div class="report-panel-title">
            <span class="report-icon">📝</span>
            <span>开题报告</span>
          </div>
          <button @click="closeReportPanel" class="close-panel-btn" title="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="report-panel-content">
          <!-- 生成中状态 -->
          <div v-if="activeReport.isGenerating" class="report-generating">
            <div class="generating-header">
              <span class="status-badge status-loading">生成中</span>
              <span class="generating-text">
                <span class="loading-text-animated">{{ loadingTexts[currentLoadingTextIndex] }}</span>
                <span class="loading-dots-text">
                  <span class="dot">.</span>
                  <span class="dot">.</span>
                  <span class="dot">.</span>
                </span>
              </span>
            </div>
            <div class="loading-progress">
              <div class="progress-bar"></div>
            </div>
          </div>

          <!-- 报告内容 -->
          <div v-if="activeReport.content" class="report-content-wrapper">
            <!-- 只在生成完成后显示下载按钮 -->
            <div v-if="!activeReport.isGenerating" class="report-actions">
              <button @click="handleDownloadDocx(activeReport.messageIndex)" class="download-btn" title="下载为Word文档">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下载DOCX
              </button>
            </div>
            <div class="report-body" v-html="formatMarkdown(activeReport.content)"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- 输入框 -->
    <footer class="input-footer">
      <div class="input-container">
        <!-- 参数选择器 -->
        <div class="input-options">
          <div class="option-item">
            <label class="option-label">年份范围</label>
            <div class="year-range">
              <select v-model="startYear" class="year-select">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
              <span class="year-separator">至</span>
              <select v-model="endYear" class="year-select">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <div class="option-item">
            <label class="option-label">结果数量</label>
            <select v-model.number="maxResults" class="result-select">
              <option :value="5">5 篇</option>
              <option :value="6">6 篇</option>
              <option :value="7">7 篇</option>
              <option :value="8">8 篇</option>
              <option :value="9">9 篇</option>
              <option :value="10">10 篇</option>
            </select>
          </div>
        </div>

        <div class="input-wrapper">
          <textarea
            v-model="inputText"
            @keydown="handleKeyDown"
            placeholder="输入您的研究主题，建议简洁明确..."
            class="input-field"
            rows="1"
            :maxlength="maxChars"
          />

          <div class="input-actions">
            <span class="char-count" :class="{ 'char-count-warn': charCount > maxChars * 0.9 }">
              {{ charCount }}/{{ maxChars }}
            </span>
            <button
              class="send-btn"
              :class="{ 'send-btn-active': inputText.trim() && charCount <= maxChars }"
              @click="handleSend"
              :disabled="!inputText.trim() || isLoading || charCount > maxChars"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* 头部 */
.header {
  padding: 2rem 1rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #f4a261 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0.5rem 0 0;
  font-weight: 300;
}

/* 主体内容 */
.main-content {
  flex: 1;
  overflow: hidden;
  padding: 2rem 1rem;
  display: flex;
  gap: 1rem;
}

/* 有报告面板时的布局 */
.main-content.has-report-panel {
  gap: 1rem;
}

.main-content.has-report-panel .chat-container {
  flex: 0 0 28%;  /* 左侧约30% (3/10) */
  overflow-y: auto;
}

.main-content .chat-container:not(.with-report) {
  flex: 1;
  overflow-y: auto;
}

.chat-container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* 有报告时的聊天容器 */
.chat-container.with-report {
  max-width: none;
  margin: 0;
}

/* 欢迎页面 */
.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.welcome-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.welcome-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem;
}

.welcome-desc {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 3rem;
  max-width: 500px;
}

.suggestion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.suggestion-card {
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.05);
}

.suggestion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(30, 60, 114, 0.2);
  background: rgba(74, 144, 226, 0.02);
}

.suggestion-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.suggestion-text {
  color: #333;
  font-size: 0.95rem;
  text-align: left;
  font-weight: 500;
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;
}

.message-item {
  display: flex;
  gap: 1rem;
  animation: messageSlideIn 0.3s ease;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.1);
}

.message-content {
  flex: 1;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.08);
  display: flex;
  flex-direction: column;
}

/* 报告面板 */
.report-panel {
  flex: 0 0 68%;  /* 右侧约70% (7/10) */
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(30, 60, 114, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 报告面板头部 */
.report-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 2px solid rgba(74, 144, 226, 0.1);
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(42, 82, 152, 0.05) 100%);
  flex-shrink: 0;
}

.report-panel-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2a5298;
}

.report-icon {
  font-size: 1.5rem;
}

.close-panel-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(30, 60, 114, 0.1);
  color: #2a5298;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-panel-btn:hover {
  background: rgba(30, 60, 114, 0.2);
  transform: rotate(90deg);
}

/* 报告面板内容 */
.report-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.report-panel-content::-webkit-scrollbar {
  width: 6px;
}

.report-panel-content::-webkit-scrollbar-track {
  background: rgba(30, 60, 114, 0.05);
  border-radius: 3px;
}

.report-panel-content::-webkit-scrollbar-thumb {
  background: rgba(74, 144, 226, 0.3);
  border-radius: 3px;
}

.report-panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 144, 226, 0.5);
}

/* 报告内容包装器 */
.report-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 报告操作按钮 */
.report-actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(74, 144, 226, 0.1);
}

.message-user .message-content {
  background: rgba(74, 144, 226, 0.15);
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.message-text {
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
  flex: 1;
}

.message-user .message-text {
  color: #2a5298;
  font-weight: 500;
}

/* 状态标签 */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 500;
  height: 1.6em;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 加载中状态 - 灰色 */
.status-loading {
  background: rgba(128, 128, 128, 0.15);
  color: #666;
}

/* 成功状态 - 绿色 */
.status-success {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}

/* 生成报告区域 */
.generate-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 16px;
  border: 1px dashed rgba(74, 144, 226, 0.3);
  text-align: center;
}

.generate-prompt {
  font-size: 1rem;
  color: #2a5298;
  margin: 0 0 1rem;
  font-weight: 500;
}

.generate-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #4a90e2 0%, #2a5298 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
}

.generate-btn:active {
  transform: translateY(0);
}

/* 报告生成中 */
.report-generating {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(128, 128, 128, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(74, 144, 226, 0.1);
}

.generating-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.generating-text {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.loading-text-animated {
  display: inline-block;
  animation: fadeInOut 2s ease-in-out infinite;
  font-weight: 500;
  color: #4a90e2;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.loading-dots-text {
  display: inline-flex;
  gap: 2px;
}

.loading-dots-text .dot {
  animation: dotPulse 1.4s infinite ease-in-out;
  color: #4a90e2;
  font-weight: bold;
}

.loading-dots-text .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots-text .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.loading-progress {
  margin-top: 1rem;
  height: 4px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4a90e2, #2a5298, #4a90e2);
  background-size: 200% 100%;
  animation: progressAnimation 2s linear infinite;
  border-radius: 2px;
}

@keyframes progressAnimation {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 报告内容 */
.report-content {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(76, 175, 80, 0.2);
}

.report-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2e7d32;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.download-btn:active {
  transform: translateY(0);
}

.download-btn svg {
  flex-shrink: 0;
}

.report-body {
  color: #333;
  line-height: 1.8;
  font-size: 0.95rem;
}

.report-body h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2a5298;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(74, 144, 226, 0.2);
}

.report-body h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2a5298;
  margin: 1.3rem 0 0.8rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(74, 144, 226, 0.15);
}

.report-body h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a90e2;
  margin: 1rem 0 0.6rem;
}

.report-body p {
  margin: 0.8rem 0;
  text-align: justify;
}

.report-body strong {
  color: #2a5298;
  font-weight: 600;
}

.report-body em {
  color: #666;
  font-style: italic;
}

.report-body ul,
.report-body ol {
  margin: 0.8rem 0;
  padding-left: 1.5rem;
}

.report-body li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.report-body code {
  background: rgba(74, 144, 226, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
  color: #2a5298;
}

.report-body pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.report-body pre code {
  background: none;
  padding: 0;
  color: #333;
}

.report-body blockquote {
  border-left: 4px solid #4a90e2;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

.report-body a {
  color: #4a90e2;
  text-decoration: none;
  border-bottom: 1px solid rgba(74, 144, 226, 0.3);
  transition: all 0.2s ease;
}

.report-body a:hover {
  color: #2a5298;
  border-bottom-color: #2a5298;
}

.report-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: #fff;
  border: 1px solid rgba(30, 60, 114, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.report-body thead {
  background: linear-gradient(135deg, #4a90e2 0%, #2a5298 100%);
}

.report-body thead th {
  color: #fff;
  font-weight: 600;
  padding: 0.8rem 1rem;
  text-align: left;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.report-body tbody tr {
  transition: background-color 0.2s ease;
}

.report-body tbody tr:nth-child(even) {
  background: rgba(74, 144, 226, 0.03);
}

.report-body tbody tr:hover {
  background: rgba(74, 144, 226, 0.08);
}

.report-body td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(30, 60, 114, 0.1);
  color: #333;
}

.report-body tbody tr:last-child td {
  border-bottom: none;
}


/* 搜索结果容器 */
.search-results-container {
  margin-top: 1rem;
  flex-shrink: 0;
}

/* 折叠/展开按钮 */
.results-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(74, 144, 226, 0.15);
}

.results-toggle:hover {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.3);
}

.toggle-icon {
  font-size: 0.9rem;
  color: #4a90e2;
  transition: transform 0.3s ease;
}

.toggle-icon-collapsed {
  transform: rotate(-90deg);
}

.toggle-text {
  font-size: 0.9rem;
  color: #4a90e2;
  font-weight: 500;
}

/* 搜索结果 */
.search-results {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px;
  padding-right: 0.5rem;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease;
  opacity: 1;
}

.search-results-collapsed {
  max-height: 0 !important;
  opacity: 0;
  margin-top: 0;
  overflow: hidden !important;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(30, 60, 114, 0.05);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(30, 60, 114, 0.2);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 60, 114, 0.3);
}

.result-card {
  background: #f8f9fa;
  border: 1px solid rgba(30, 60, 114, 0.1);
  border-radius: 16px;
  padding: 1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.result-card:hover {
  border-color: rgba(74, 144, 226, 0.3);
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.1);
}

.result-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.result-number {
  background: #4a90e2;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.result-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.result-authors {
  color: #666;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-icon {
  font-size: 0.9rem;
}

.more-authors {
  color: #999;
  font-size: 0.8rem;
  margin-left: 0.25rem;
}

.result-summary {
  color: #555;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(30, 60, 114, 0.1);
}

.result-date {
  font-size: 0.85rem;
  color: #666;
}

.result-link {
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.result-link:hover {
  color: #2a5298;
  transform: translateX(3px);
}

/* 加载动画 */
.loading-dots {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0;
  justify-content: center;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #2a5298 100%);
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入框区域 */
.input-footer {
  background: white;
  border-top: 1px solid rgba(30, 60, 114, 0.1);
  padding-bottom: 1.5rem;
}

.input-options {
  max-width: 900px;
  margin: 0 auto;
  padding: 0.75rem 1rem 0.5rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  border-bottom: 1px solid rgba(30, 60, 114, 0.05);
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-select,
.result-select {
  padding: 0.35rem 0.65rem;
  border: 1px solid rgba(30, 60, 114, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-select:hover,
.result-select:hover {
  border-color: #4a90e2;
  background: rgba(74, 144, 226, 0.02);
}

.year-select:focus,
.result-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.year-separator {
  color: #999;
  font-size: 0.85rem;
}

.input-container {
  max-width: 900px;
  margin: 0 auto;
}

.input-wrapper {
  background: #f8f9fa;
  border-radius: 32px;
  padding: 0.75rem 1rem;
  margin: 0.75rem 1rem 1rem;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.08);
  border: 1px solid rgba(30, 60, 114, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  padding: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
}

.input-field::placeholder {
  color: #999;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.char-count {
  font-size: 0.85rem;
  color: #999;
  font-variant-numeric: tabular-nums;
}

.char-count-warn {
  color: #e74c3c;
  font-weight: 500;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn-active {
  background: #4a90e2;
  color: white;
  cursor: pointer;
}

.send-btn-active:hover {
  transform: scale(1.1);
  background: #2a5298;
}

/* 聊天容器滚动条 */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(30, 60, 114, 0.2);
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 60, 114, 0.3);
}
</style>
