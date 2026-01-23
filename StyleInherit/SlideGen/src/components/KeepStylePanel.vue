<template>
  <div class="keepstyle-panel">
    <div class="panel-header">
      <h1>🎨 样式保持生成</h1>
      <p class="subtitle">上传图片提取样式，根据样式和提示词生成幻灯片</p>
    </div>

    <div class="panel-content">
      <!-- 左侧：配置区域 -->
      <div class="left-panel">
        <div class="form-section">
          <!-- 上传图片 -->
          <div class="form-field">
            <label class="form-label">上传参考图片</label>
            <div class="upload-section">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                multiple
                style="display: none"
                @change="handleImageSelect"
              />
              <div
                v-if="imagePreviews.length === 0"
                class="upload-area"
                :class="{ dragging: isDragging }"
                @click="triggerImageSelect"
                @dragenter.prevent="handleDragEnter"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
              >
                <div class="upload-placeholder">
                  <i class="upload-icon">📷</i>
                  <p>点击或拖拽上传图片（支持多张）</p>
                </div>
              </div>
              <div v-else class="images-preview-container">
                <div
                  v-for="(preview, index) in imagePreviews"
                  :key="index"
                  class="image-preview-item"
                >
                  <img :src="preview" alt="预览" class="preview-image" />
                  <button
                    class="remove-image-btn"
                    @click="removeImage(index)"
                    title="移除图片"
                  >
                    ×
                  </button>
                  <div class="image-index">{{ index + 1 }}</div>
                  <div class="image-controls">
                    <button
                      class="move-btn"
                      @click="moveImageUp(index)"
                      :disabled="index === 0"
                      title="上移"
                    >
                      ↑
                    </button>
                    <button
                      class="move-btn"
                      @click="moveImageDown(index)"
                      :disabled="index === imagePreviews.length - 1"
                      title="下移"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 配置区域 -->
          <div class="config-section">
            <!-- 阶段一配置 -->
            <div class="config-group">
              <h3 class="config-title">阶段一：分析图片</h3>
              
              <div class="form-field">
                <label class="form-label">分析模型</label>
                <select
                  v-model="selectedModel"
                  class="model-select"
                  :disabled="isProcessing"
                >
                  <option value="">使用默认模型</option>
                  <option v-for="model in filteredModelList" :key="model.id" :value="model.id">
                    {{ model.id }}
                  </option>
                </select>
              </div>

              <div class="form-field">
                <label class="form-label">
                  系统提示词
                  <span class="hint">（可选，留空使用默认提示词）</span>
                </label>
                <textarea
                  v-model="extractSystemPrompt"
                  class="prompt-input"
                  placeholder="留空使用默认的视觉风格提取策略逻辑"
                  rows="3"
                  :disabled="isProcessing"
                ></textarea>
              </div>

              <div class="form-field">
                <label class="form-label">
                  用户输入
                  <span class="hint">（用户指令，如"我要一张红色的封面"）</span>
                </label>
                <textarea
                  v-model="extractUserInput"
                  class="prompt-input"
                  placeholder="例如：我要一张红色的封面"
                  rows="3"
                  :disabled="isProcessing"
                ></textarea>
              </div>

              <div class="form-field">
                <label class="form-label">
                  调用次数
                  <span class="hint">（连续调用n次，结果会追加显示）</span>
                </label>
                <input
                  v-model.number="extractLoopCount"
                  type="number"
                  min="1"
                  max="10"
                  class="number-input"
                  :disabled="isProcessing"
                />
              </div>
            </div>

            <!-- 阶段二配置 -->
            <div class="config-group">
              <h3 class="config-title">阶段二：生成结果</h3>
              
              <div class="form-field">
                <label class="form-label">输出类型</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      type="radio"
                      value="html"
                      v-model="outputType"
                      :disabled="isProcessing"
                    />
                    <span>HTML</span>
                  </label>
                  <label class="radio-item">
                    <input
                      type="radio"
                      value="image"
                      v-model="outputType"
                      :disabled="isProcessing"
                    />
                    <span>图片</span>
                  </label>
                </div>
              </div>

              <!-- HTML生成模型选择 -->
              <div v-if="outputType === 'html'" class="form-field">
                <label class="form-label">HTML生成模型</label>
                <select
                  v-model="selectedHtmlModel"
                  class="model-select"
                  :disabled="isProcessing"
                >
                  <option value="">使用默认模型</option>
                  <option v-for="model in modelList" :key="model.id" :value="model.id">
                    {{ model.id }}
                  </option>
                </select>
              </div>

              <!-- HTML模板选择 -->
              <div v-if="outputType === 'html'" class="form-field">
                <label class="form-label">
                  HTML模板
                  <span class="hint">（可选，选择模板或输入自定义HTML）</span>
                </label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <select
                    v-model="selectedHtmlTemplateId"
                    class="model-select"
                    :disabled="isProcessing || useCustomHtmlTemplate"
                    @change="handleTemplateSelect"
                  >
                    <option value="">不使用模板</option>
                    <option
                      v-for="template in htmlTemplates"
                      :key="template.id"
                      :value="template.id"
                      :disabled="template.is_blacklist"
                    >
                      {{ template.label.logical_relation }} - {{ template.label.chart_type }}
                      {{ template.is_blacklist ? '(已禁用)' : '' }}
                    </option>
                  </select>
                  
                  <div class="form-field" style="margin: 0;">
                    <label class="form-label" style="font-size: 0.9rem;">
                      <input
                        type="checkbox"
                        v-model="useCustomHtmlTemplate"
                        :disabled="isProcessing"
                        style="margin-right: 8px;"
                      />
                      使用自定义HTML模板
                    </label>
                  </div>
                  
                  <textarea
                    v-if="useCustomHtmlTemplate"
                    v-model="customHtmlTemplate"
                    class="prompt-input"
                    placeholder="请输入自定义HTML模板代码..."
                    rows="8"
                    :disabled="isProcessing"
                  ></textarea>
                  
                  <div v-if="selectedHtmlTemplateId && !useCustomHtmlTemplate" class="template-preview">
                    <p v-if="isTemplateLoading" style="font-size: 0.85rem; color: var(--accent-color); margin-bottom: 4px;">
                      ⏳ 正在加载模板...
                    </p>
                    <div v-else>
                      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">
                        已选择模板: {{ getSelectedTemplateInfo() }}
                        <span v-if="selectedHtmlTemplateContent" style="color: var(--success-color);">✓ 已加载</span>
                        <span v-else style="color: var(--error-color);">✗ 加载失败</span>
                      </p>
                      <a
                        v-if="getSelectedTemplateUrl()"
                        :href="getSelectedTemplateUrl()"
                        target="_blank"
                        style="font-size: 0.85rem; color: var(--accent-color);"
                      >
                        预览模板 →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 图片生成专用配置 -->
              <div v-if="outputType === 'image'" class="form-field">
                <label class="form-label">图片生成模型</label>
                <select
                  v-model="selectedImageModel"
                  class="model-select"
                  :disabled="isProcessing || isLoadingImageModels"
                >
                  <option v-if="isLoadingImageModels" value="">加载中...</option>
                  <option v-else-if="imageModelList.length === 0" :value="selectedImageModel">
                    {{ selectedImageModel || '默认模型' }}
                  </option>
                  <option v-else value="">使用默认模型</option>
                  <option
                    v-for="model in imageModelList"
                    :key="model.id || model"
                    :value="model.id || model"
                  >
                    {{ model.id || model }}
                  </option>
                </select>
              </div>

              <div v-if="outputType === 'image'" class="form-field">
                <label class="form-label">图片尺寸</label>
                <select
                  v-model="imageSize"
                  class="model-select"
                  :disabled="isProcessing"
                >
                  <option value="1K">1K (1024x1024)</option>
                  <option value="2K">2K (2048x2048)</option>
                  <option value="4K">4K (4096x4096)</option>
                </select>
              </div>

              <div class="form-field">
                <label class="form-label">
                  系统提示词
                  <span class="hint">（可选，留空使用默认提示词）</span>
                </label>
                <textarea
                  v-model="generateSystemPrompt"
                  class="prompt-input"
                  :placeholder="outputType === 'html' ? '例如：你是一个专业的全栈前端开发者，擅长根据设计风格创建高质量的HTML幻灯片（留空使用默认提示词）' : '例如：请根据以下设计风格和用户需求生成一张高质量的幻灯片图片（留空使用默认提示词）'"
                  rows="3"
                  :disabled="isProcessing"
                ></textarea>
              </div>

              <div class="form-field">
                <label class="form-label">
                  用户主题
                  <span class="hint">（用于生成内容的主题）</span>
                </label>
                <textarea
                  v-model="generateUserPrompt"
                  class="prompt-input"
                  :placeholder="outputType === 'html' ? '例如：创建一个关于产品介绍的幻灯片，包含标题、三个特点介绍和底部联系方式' : '例如：跨境电商行业发展前景'"
                  rows="3"
                  :disabled="isProcessing"
                ></textarea>
              </div>

              <div class="form-field">
                <label class="form-label">
                  <input
                    type="checkbox"
                    v-model="sendImagesToStage2"
                    :disabled="isProcessing || imageFiles.length === 0"
                    style="margin-right: 8px;"
                  />
                  发送图片到阶段二
                  <span class="hint">（将阶段一上传的图片一并发送给模型）</span>
                </label>
              </div>

            </div>
          </div>

          <!-- 测试功能区域 -->
          <div class="config-section">
            <div class="config-group">
              <h3 class="config-title">🧪 批量测试</h3>
              
              <div class="form-field">
                <label class="form-label">上传Excel文件</label>
                <input
                  ref="excelInput"
                  type="file"
                  accept=".xlsx,.xls"
                  style="display: none"
                  @change="handleExcelSelect"
                />
                <div class="upload-section">
                  <button
                    class="upload-btn"
                    @click="triggerExcelSelect"
                    :disabled="isTesting"
                  >
                    {{ excelFile ? excelFile.name : '选择Excel文件' }}
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label">选择图片文件夹（可选）</label>
                <input
                  ref="imageFolderInput"
                  type="file"
                  webkitdirectory
                  directory
                  style="display: none"
                  @change="handleImageFolderSelect"
                />
                <div class="upload-section">
                  <button
                    class="upload-btn"
                    @click="triggerImageFolderSelect"
                    :disabled="isTesting"
                  >
                    {{ imageFolderFiles.size > 0 ? `已选择 ${imageFolderFiles.size} 个文件` : '选择图片文件夹（可选）' }}
                  </button>
                </div>
                <p class="hint" style="font-size: 0.8rem; margin-top: 4px;">
                  如果Excel中"正文页"列是图片路径，请选择包含这些图片的文件夹
                </p>
              </div>

              <div class="form-field">
                <button
                  v-if="!isTesting"
                  class="generate-btn test-btn"
                  :disabled="!excelFile || isProcessing"
                  @click="handleStartTest"
                >
                  开始测试
                </button>
                <button
                  v-else
                  class="generate-btn stop-btn"
                  @click="handleStopTest"
                >
                  停止测试
                </button>
              </div>

              <div v-if="testLog" class="form-field">
                <label class="form-label">测试日志</label>
                <textarea
                  v-model="testLog"
                  class="prompt-input"
                  rows="5"
                  readonly
                  style="font-size: 12px;"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 操作按钮组 -->
          <div class="button-group">
            <button
              class="generate-btn stage-btn"
              :disabled="imageFiles.length === 0 || isExtracting"
              @click="handleExtractOnly"
            >
              <span v-if="isExtracting" class="loading-spinner"></span>
              {{ isExtracting ? '分析中...' : '阶段一：分析图片' }}
            </button>
            <button
              class="generate-btn stage-btn"
              :disabled="isGenerating"
              @click="handleGenerateOnly"
            >
              <span v-if="isGenerating" class="loading-spinner"></span>
              {{ isGenerating ? '生成中...' : '阶段二：生成结果' }}
            </button>
            <button
              class="generate-btn primary-btn"
              :disabled="imageFiles.length === 0 || isProcessing"
              @click="handleGenerateAll"
            >
              <span v-if="isProcessing" class="loading-spinner"></span>
              <span v-if="isProcessing">
                {{ currentStage === 'extracting' ? '分析中...' : '生成中...' }}
              </span>
              <span v-else>一键生成（阶段一+二）</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：结果展示区域 -->
      <div class="right-panel">
        <div class="form-section">
          <!-- 最终提示词展示 -->
          <div v-if="extractFinalPrompt || generateFinalPrompt" class="prompt-display-section">
            <div v-if="extractFinalPrompt" class="form-field">
              <div class="field-header">
                <label class="form-label">阶段一：发送给模型的提示词</label>
                <button class="copy-btn" @click="copyToClipboard(extractFinalPrompt)" title="复制">
                  📋 复制
                </button>
              </div>
              <textarea
                :value="extractFinalPrompt"
                readonly
                class="prompt-display resizable"
                rows="6"
              ></textarea>
            </div>
            <div v-if="generateFinalPrompt" class="form-field">
              <div class="field-header">
                <label class="form-label">阶段二：发送给模型的提示词</label>
                <button class="copy-btn" @click="copyToClipboard(generateFinalPrompt)" title="复制">
                  📋 复制
                </button>
              </div>
              <textarea
                :value="generateFinalPrompt"
                readonly
                class="prompt-display resizable"
                rows="8"
              ></textarea>
            </div>
          </div>

          <!-- 流式输出 -->
          <div v-if="extractStreamContent || generateStreamContent" class="stream-output-section">
            <div v-if="extractStreamContent" class="stream-output">
              <div class="field-header">
                <label>阶段一：分析输出</label>
                <button class="copy-btn" @click="copyToClipboard(extractStreamContent)" title="复制">
                  📋 复制
                </button>
              </div>
              <textarea
                ref="extractStreamTextareaRef"
                :value="extractStreamContent"
                readonly
                class="stream-textarea resizable"
                rows="8"
              ></textarea>
            </div>
            <div v-if="generateStreamContent" class="stream-output">
              <div class="field-header">
                <label>阶段二：生成输出</label>
                <button class="copy-btn" @click="copyToClipboard(generateStreamContent)" title="复制">
                  📋 复制
                </button>
              </div>
              <textarea
                ref="generateStreamTextareaRef"
                :value="generateStreamContent"
                readonly
                class="stream-textarea resizable"
                rows="8"
              ></textarea>
            </div>
          </div>

          <!-- 结果显示 -->
          <div v-if="result" class="result-section">
            <h3 class="result-title">生成结果</h3>

            <div v-if="result.success" class="result-content">
              <div v-if="outputType === 'html' && result.html" class="html-result">
                <div class="result-header">
                  <span>HTML 预览</span>
                  <button class="btn-small" @click="downloadHtml">下载 HTML</button>
                </div>
                <iframe
                  :srcdoc="result.html"
                  class="html-preview"
                  frameborder="0"
                ></iframe>
              </div>

              <div v-if="outputType === 'image' && result.imageUrl" class="image-result">
                <div class="result-header">
                  <span>生成的图片</span>
                  <button class="btn-small" @click="downloadImage">下载图片</button>
                </div>
                <img :src="result.imageUrl" alt="生成的图片" class="result-image" />
              </div>
            </div>

            <div v-else class="error-message">
              <p>❌ 生成失败: {{ result.error }}</p>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📄</div>
            <p class="empty-text">生成结果将显示在这里</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { fetchModels, type ModelInfo } from '../services/llmService';
import { extractStyleFromImage } from '../keepstyle/extractStyleService';
import { generateSlide } from '../keepstyle/generateService';
import { fetchImageModels } from '../keepstyle/imageGenerateService';
import { fileToBase64 } from '../keepstyle/utils';
import type { StyleExtractResult, GenerateResult } from '../keepstyle/types';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

// 状态
const imageInput = ref<HTMLInputElement | null>(null);
const imageFiles = ref<File[]>([]); // 支持多张图片
const imagePreviews = ref<string[]>([]); // 多张图片预览
const extractSystemPrompt = ref(''); // 阶段一：系统提示词（可选，留空使用默认）
const extractUserInput = ref(''); // 阶段一：用户输入（用户指令）
const generateSystemPrompt = ref(''); // 阶段二：系统提示词（可选，留空使用默认）
const generateUserPrompt = ref(''); // 阶段二：用户主题（用于图片生成）
const sendImagesToStage2 = ref(false); // 阶段二：是否发送图片
const selectedModel = ref(''); // 第一阶段（样式提取）的模型
const selectedHtmlModel = ref(''); // HTML生成的模型（独立选择）
const selectedImageModel = ref(''); // 图片生成的模型（独立选择）
const outputType = ref<'html' | 'image'>('html');
const imageSize = ref<'1K' | '2K' | '4K'>('1K'); // 图片尺寸
const modelList = ref<ModelInfo[]>([]);
const imageModelList = ref<Array<{ id: string; provider: string }>>([]); // 图片生成模型列表
const isLoadingImageModels = ref(false);

// HTML模板相关
const HTML_TEMPLATES = [
  { id: 1, label: { logical_relation: "对比", chart_type: "柱状图/折线图(左)+表格(右下)+环状图(右上)", id: 1 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_1.html" },
  { id: 10, label: { logical_relation: "总分", chart_type: "饼图/环形图(左)+柱状对比图(右)", id: 10 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_10.html" },
  { id: 11, label: { logical_relation: "总分", chart_type: "数据卡片(左)+堆积柱状图(右)", id: 11 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_11.html" },
  { id: 12, label: { logical_relation: "因果", chart_type: "表格(左)+柱状图(右)+数据卡片", id: 12 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_12.html" },
  { id: 14, label: { logical_relation: "对比", chart_type: "文本卡片(左)+雷达图(中间)+文本卡片(右)+对比说明（底）", id: 14 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_14.html" },
  { id: 15, label: { logical_relation: "对比", chart_type: "对比式文本卡片左右分布", id: 15 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_15.html" },
  { id: 16, label: { logical_relation: "并列", chart_type: "四宫格文本卡片", id: 16 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_16.html" },
  { id: 17, label: { logical_relation: "对比", chart_type: "对比式文本卡片（左纵向）+雷达图（右）", id: 17 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_17.html" },
  { id: 18, label: { logical_relation: "对比", chart_type: "对比式文本卡片（左横向）+雷达能力图（右）", id: 18 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_18.html" },
  { id: 19, label: { logical_relation: "对比", chart_type: "对比式文本卡片(左)+雷达图(右)", id: 19 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_19.html" },
  { id: 2, label: { logical_relation: "递进", chart_type: "趋势分析图(柱状图+折线图)", id: 2 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_2.html" },
  { id: 20, label: { logical_relation: "对比", chart_type: "对比式文本卡片(左)+柱状图(右)", id: 20 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_20.html" },
  { id: 21, label: { logical_relation: "对比", chart_type: "对比式文本卡片(左)+折线图(右)", id: 21 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_21.html" },
  { id: 23, label: { logical_relation: "递进", chart_type: "阶段文本卡片", id: 23 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_23.html" },
  { id: 24, label: { logical_relation: "并列", chart_type: "对比式文本卡片", id: 24 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_24.html" },
  { id: 25, label: { logical_relation: "递进", chart_type: "递进式文本卡片(上)+发展折线图(下)", id: 25 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_25.html" },
  { id: 26, label: { logical_relation: "总分", chart_type: "雷达图(左)+四宫格文本卡片(右)", id: 26 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_26.html" },
  { id: 27, label: { logical_relation: "因果", chart_type: "环状图解释卡片(左)+因果式文本卡片(右)", id: 27 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_27.html" },
  { id: 28, label: { logical_relation: "因果", chart_type: "条形图解释卡片(左)+因果式文本卡片(右)", id: 28 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_28.html" },
  { id: 29, label: { logical_relation: "对比", chart_type: "对比式文本卡片（左）+堆积柱状图（右）", id: 29 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_29.html" },
  { id: 3, label: { logical_relation: "对比", chart_type: "柱状图(左)+数据卡片(右)", id: 3 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_3.html" },
  { id: 30, label: { logical_relation: "因果", chart_type: "折线图解释卡片(左)+因果式文本卡片(右)", id: 30 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_30.html" },
  { id: 31, label: { logical_relation: "递进", chart_type: "递进时间轴", id: 31 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_31.html" },
  { id: 33, label: { logical_relation: "并列", chart_type: "文本解释卡片(左)+因果式文本卡片(右)", id: 33 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_33.html" },
  { id: 4, label: { logical_relation: "对比", chart_type: "表格(左)+柱状图(右)", id: 4 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_4.html" },
  { id: 5, label: { logical_relation: "对比", chart_type: "柱状图(左)+数据卡片(右)", id: 5 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_5.html" },
  { id: 6, label: { logical_relation: "并列", chart_type: "表格(左)+趋势分析图(右)", id: 6 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_6.html" },
  { id: 7, label: { logical_relation: "对比", chart_type: "文本卡片(左)+条形图(右)", id: 7 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_7.html" },
  { id: 8, label: { logical_relation: "递进", chart_type: "漏斗图(左)+数据卡片(右)", id: 8 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_8.html" },
  { id: 9, label: { logical_relation: "总分", chart_type: "直方图(左)+数据卡片(右)", id: 9 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_9.html" },
  { id: 34, label: { logical_relation: "因果", chart_type: "四象限卡片（左）+雷达图（右）", id: 34 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_34.html" },
  { id: 22, label: { logical_relation: "对比", chart_type: "文本解释卡片(左)+雷达图（中）+文本解释卡片(右)", id: 22 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_22.html" },
  { id: 13, label: { logical_relation: "对比", chart_type: "文本解释卡片(左)+雷达图（中）+文本解释卡片(右)", id: 13 }, is_blacklist: false, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_13.html" },
  { id: 32, label: { logical_relation: "对比", chart_type: "文本解释卡片(左)+环形图（右上）+文本解释卡片（右下）", id: 32 }, is_blacklist: true, html_url: "https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_32.html" },
];

const htmlTemplates = ref(HTML_TEMPLATES.sort((a, b) => a.id - b.id));
const selectedHtmlTemplateId = ref<number | ''>('');
const useCustomHtmlTemplate = ref(false);
const customHtmlTemplate = ref('');
const selectedHtmlTemplateContent = ref<string>(''); // 存储选中的模板HTML内容
const isTemplateLoading = ref(false); // 模板加载状态

// 第一阶段调用次数
const extractLoopCount = ref(1); // 默认调用1次

// 检测是否为多模态模型
function isMultimodalModel(modelName: string): boolean {
  const multimodalPrefixes = [
    "claude-",
    "gpt-4-vision-",
    "gpt-4-version-turbo-2024-04-09",
    "gpt-4o",
    "gemini-",
    "qwen-vl-",
    "step-",
    "doubao-",
    "Doubao-"
  ];
  return multimodalPrefixes.some((prefix) => modelName.startsWith(prefix));
}

// 根据是否有图片过滤模型列表（阶段一需要支持图片的模型）
const filteredModelList = computed(() => {
  if (imageFiles.value.length > 0) {
    // 有图片时，只显示支持多模态的模型
    return modelList.value.filter((m: ModelInfo) => isMultimodalModel(m.id));
  }
  return modelList.value;
});

const isExtracting = ref(false);
const isGenerating = ref(false);
const currentStage = ref<'extracting' | 'generating' | ''>(''); // 当前阶段
const extractedStyle = ref<StyleExtractResult | null>(null);
const result = ref<GenerateResult | null>(null);
const extractStreamContent = ref('');
const generateStreamContent = ref('');
const extractStreamTextareaRef = ref<HTMLTextAreaElement | null>(null);
const generateStreamTextareaRef = ref<HTMLTextAreaElement | null>(null);
const isDragging = ref(false);

// 最终发送给模型的提示词
const extractFinalPrompt = ref('');
const generateFinalPrompt = ref('');

// 计算是否正在处理
const isProcessing = computed(() => isExtracting.value || isGenerating.value);

// 测试功能相关状态
const excelInput = ref<HTMLInputElement | null>(null);
const imageFolderInput = ref<HTMLInputElement | null>(null);
const excelFile = ref<File | null>(null);
const imageFolderFiles = ref<Map<string, File>>(new Map()); // 图片文件名 -> File对象
const workbook = ref<XLSX.WorkBook | null>(null);
const exceljsWorkbook = ref<ExcelJS.Workbook | null>(null);
const isTesting = ref(false);
const shouldStopTest = ref(false);
const testLog = ref('');

// 流式输出自动滚动
// 监听模板选择变化，自动加载模板
watch(selectedHtmlTemplateId, async (newId: number | '') => {
  if (newId && !useCustomHtmlTemplate.value) {
    await handleTemplateSelect();
  } else if (!newId) {
    selectedHtmlTemplateContent.value = '';
    isTemplateLoading.value = false;
  }
});

watch(extractStreamContent, () => {
  nextTick(() => {
    if (extractStreamTextareaRef.value) {
      extractStreamTextareaRef.value.scrollTop = extractStreamTextareaRef.value.scrollHeight;
    }
  });
});

watch(generateStreamContent, () => {
  nextTick(() => {
    if (generateStreamTextareaRef.value) {
      generateStreamTextareaRef.value.scrollTop = generateStreamTextareaRef.value.scrollHeight;
    }
  });
});

// 触发文件选择
function triggerImageSelect() {
  imageInput.value?.click();
}

// 拖拽处理
function handleDragEnter() {
  isDragging.value = true;
}

function handleDragOver() {
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer?.files || []);
  const imageFiles = files.filter((file) => file.type.startsWith('image/'));
  if (imageFiles.length > 0) {
    await loadImageFiles(imageFiles);
  }
}

// 处理图片选择（支持多张）
async function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (files.length === 0) return;
  await loadImageFiles(files);
}

async function loadImageFiles(files: File[]) {
  const newFiles: File[] = [];
  const newPreviews: string[] = [];
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      newFiles.push(file);
      const base64 = await fileToBase64(file);
      newPreviews.push(base64);
    }
  }
  
  imageFiles.value.push(...newFiles);
  imagePreviews.value.push(...newPreviews);
}

// 移除图片
function removeImage(index?: number) {
  if (index !== undefined) {
    // 移除指定索引的图片
    imageFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
  } else {
    // 移除所有图片
    imageFiles.value = [];
    imagePreviews.value = [];
    extractedStyle.value = null;
    result.value = null;
    extractStreamContent.value = '';
    generateStreamContent.value = '';
    extractFinalPrompt.value = '';
    generateFinalPrompt.value = '';
    extractSystemPrompt.value = '';
    extractUserInput.value = '';
    generateSystemPrompt.value = '';
    generateUserPrompt.value = '';
    if (imageInput.value) {
      imageInput.value.value = '';
    }
  }
}

// 图片上移
function moveImageUp(index: number) {
  if (index === 0) return;
  const files = [...imageFiles.value];
  const previews = [...imagePreviews.value];
  
  // 交换位置
  [files[index], files[index - 1]] = [files[index - 1], files[index]];
  [previews[index], previews[index - 1]] = [previews[index - 1], previews[index]];
  
  imageFiles.value = files;
  imagePreviews.value = previews;
}

// 图片下移
function moveImageDown(index: number) {
  if (index === imagePreviews.value.length - 1) return;
  const files = [...imageFiles.value];
  const previews = [...imagePreviews.value];
  
  // 交换位置
  [files[index], files[index + 1]] = [files[index + 1], files[index]];
  [previews[index], previews[index + 1]] = [previews[index + 1], previews[index]];
  
  imageFiles.value = files;
  imagePreviews.value = previews;
}

// 阶段一：仅分析图片（支持连续调用n次）
async function handleExtractOnly() {
  if (imageFiles.value.length === 0) return;

  const loopCount = Math.max(1, Math.min(10, extractLoopCount.value || 1));
  
  isExtracting.value = true;
  currentStage.value = 'extracting';
  // 如果是第一次调用，清空之前的结果；否则追加
  if (extractStreamContent.value === '') {
    extractedStyle.value = null;
    extractFinalPrompt.value = '';
  }

  try {
    // 将多张图片转换为 base64 数组（按照当前顺序）
    const imageBase64s = await Promise.all(
      imageFiles.value.map((file: File) => fileToBase64(file))
    );
    
    // 循环调用n次
    for (let i = 0; i < loopCount; i++) {
      if (i > 0) {
        // 每次调用之间添加分隔符
        extractStreamContent.value += `\n\n${'='.repeat(50)}\n第 ${i + 1} 次调用\n${'='.repeat(50)}\n\n`;
      }
      
      const beforeContent = extractStreamContent.value;
      
      const style = await extractStyleFromImage(
        {
          imageBase64s: imageBase64s,
          systemPrompt: extractSystemPrompt.value.trim() || undefined,
          userPrompt: extractUserInput.value.trim() || undefined,
          model: selectedModel.value || undefined,
        },
        {
          onStreamContent(content) {
            // 追加内容
            if (i === 0) {
              extractStreamContent.value = content;
            } else {
              // 从当前内容开始追加（去掉之前的内容）
              const newContent = content.replace(beforeContent, '');
              extractStreamContent.value = beforeContent + newContent;
            }
          },
          onError(error) {
            console.error(`提取样式失败 (第${i + 1}次):`, error);
            extractStreamContent.value += `\n\n❌ 第 ${i + 1} 次调用错误: ${error}`;
          },
          onPromptReady(prompt) {
            // 只保存最后一次的提示词
            if (i === loopCount - 1) {
              extractFinalPrompt.value = prompt;
            }
          },
        }
      );
      
      // 保存最后一次的结果
      if (i === loopCount - 1) {
        extractedStyle.value = style;
      }
      
      extractStreamContent.value += `\n\n✅ 第 ${i + 1} 次提取完成！`;
    }
  } catch (error) {
    console.error('提取样式出错:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    extractStreamContent.value += `\n\n❌ 提取失败: ${errMsg}`;
    alert('提取样式失败: ' + errMsg);
  } finally {
    isExtracting.value = false;
    currentStage.value = '';
  }
}

// 阶段二：仅生成结果（可以单独使用）
async function handleGenerateOnly() {
  // 如果阶段二有提示词，不需要检查阶段一的输出
  const hasStage2Prompt = generateSystemPrompt.value.trim() || generateUserPrompt.value.trim();
  
  // 如果没有阶段一的输出且没有阶段二的提示词，使用默认样式描述
  if (!extractedStyle.value && !hasStage2Prompt) {
    // 允许单独使用阶段二，使用默认样式描述
    console.warn('未检测到阶段一的输出，将使用默认样式描述');
  }

  isGenerating.value = true;
  currentStage.value = 'generating';
  result.value = null;
  generateStreamContent.value = '';
  generateFinalPrompt.value = '';

  // 根据输出类型设置不同的宽高
  // HTML: 1280x720, 图片: 3600x2025
  const width = outputType.value === 'html' ? 1280 : 3600;
  const height = outputType.value === 'html' ? 720 : 2025;

  // 如果选择了发送图片，准备图片的 base64 数组
  let imageBase64s: string[] | undefined = undefined;
  if (sendImagesToStage2.value && imageFiles.value.length > 0) {
    imageBase64s = await Promise.all(
      imageFiles.value.map((file: File) => fileToBase64(file))
    );
  }

  try {
    // 如果选择了HTML模板，确保模板已加载
    if (outputType.value === 'html') {
      await ensureTemplateLoaded();
    }
    
    const htmlTemplate = outputType.value === 'html' ? getHtmlTemplate() : undefined;
    console.log('生成时使用的HTML模板:', htmlTemplate ? `已提供，长度: ${htmlTemplate.length}` : '未提供');
    
    const generateResult = await generateSlide(
      {
        styleDescription: extractedStyle.value?.styleDescription || '请根据用户需求生成一张高质量的幻灯片。',
        systemPrompt: generateSystemPrompt.value.trim() || undefined,
        userPrompt: generateUserPrompt.value.trim() || undefined,
        imageBase64s: imageBase64s,
        model: outputType.value === 'html' 
          ? (selectedHtmlModel.value || selectedModel.value || undefined)
          : undefined,
        imageModel: outputType.value === 'image' ? (selectedImageModel.value || undefined) : undefined,
        outputType: outputType.value,
        imageSize: outputType.value === 'image' ? imageSize.value : undefined,
        width: width,
        height: height,
        htmlTemplate: htmlTemplate,
      },
      {
        onStreamContent(content) {
          generateStreamContent.value = content;
        },
        onError(error) {
          console.error('生成失败:', error);
          generateStreamContent.value += `\n\n❌ 错误: ${error}`;
        },
        onComplete() {
          generateStreamContent.value += `\n\n✅ 生成完成！`;
        },
        onPromptReady(prompt) {
          generateFinalPrompt.value = prompt;
        },
      }
    );
    result.value = generateResult;
  } catch (error) {
    console.error('生成出错:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    result.value = {
      success: false,
      error: errMsg,
    };
    generateStreamContent.value += `\n\n❌ 生成失败: ${errMsg}`;
  } finally {
    isGenerating.value = false;
  }
}

// 一键生成：先执行第一阶段，然后自动执行第二阶段
async function handleGenerateAll() {
  if (imageFiles.value.length === 0) return;

  // 重置状态
  isExtracting.value = true;
  isGenerating.value = false;
  currentStage.value = 'extracting';
  extractedStyle.value = null;
  result.value = null;
  extractStreamContent.value = '';
  generateStreamContent.value = '';
  extractFinalPrompt.value = '';
  generateFinalPrompt.value = '';

  // 默认样式描述（如果第一阶段失败则使用）
  let styleDescription = '请根据用户需求生成一张高质量的幻灯片。';

  // 第一阶段：提取样式（不检验错误，失败也继续）
  try {
    // 将多张图片转换为 base64 数组
    const imageBase64s = await Promise.all(
      imageFiles.value.map((file: File) => fileToBase64(file))
    );
    
    const style = await extractStyleFromImage(
      {
        imageBase64s: imageBase64s,
        systemPrompt: extractSystemPrompt.value.trim() || undefined,
        userPrompt: extractUserInput.value.trim() || undefined,
        model: selectedModel.value || undefined,
      },
      {
        onStreamContent(content) {
          extractStreamContent.value = content;
        },
        onError(error) {
          console.error('提取样式失败:', error);
          extractStreamContent.value += `\n\n⚠️ 警告: ${error}（将继续执行第二阶段）`;
        },
        onPromptReady(prompt) {
          extractFinalPrompt.value = prompt;
        },
      }
    );
    extractedStyle.value = style;
    styleDescription = style.styleDescription;
    extractStreamContent.value += `\n\n✅ 提取完成！`;
  } catch (error) {
    console.error('提取样式出错:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    extractStreamContent.value += `\n\n⚠️ 提取失败: ${errMsg}（将继续执行第二阶段）`;
    // 不抛出错误，继续执行第二阶段
  } finally {
    isExtracting.value = false;
  }

  // 第二阶段：生成结果
  isGenerating.value = true;
  currentStage.value = 'generating';

      // 根据输出类型设置不同的宽高
      // HTML: 1280x720, 图片: 3600x2025
      const width = outputType.value === 'html' ? 1280 : 3600;
      const height = outputType.value === 'html' ? 720 : 2025;

      // 如果选择了发送图片，准备图片的 base64 数组
      let imageBase64s: string[] | undefined = undefined;
      if (sendImagesToStage2.value && imageFiles.value.length > 0) {
        imageBase64s = await Promise.all(
          imageFiles.value.map((file: File) => fileToBase64(file))
        );
      }

      try {
        // 如果选择了HTML模板，确保模板已加载
        if (outputType.value === 'html') {
          await ensureTemplateLoaded();
        }
        
        const htmlTemplate = outputType.value === 'html' ? getHtmlTemplate() : undefined;
        console.log('生成时使用的HTML模板:', htmlTemplate ? `已提供，长度: ${htmlTemplate.length}` : '未提供');
        
        const generateResult = await generateSlide(
          {
            styleDescription: styleDescription, // 使用提取的样式描述，如果失败则使用默认
            systemPrompt: generateSystemPrompt.value.trim() || undefined,
            userPrompt: generateUserPrompt.value.trim() || undefined,
            imageBase64s: imageBase64s,
        model: outputType.value === 'html' 
          ? (selectedHtmlModel.value || selectedModel.value || undefined)
          : undefined,
        imageModel: outputType.value === 'image' ? (selectedImageModel.value || undefined) : undefined,
        outputType: outputType.value,
        imageSize: outputType.value === 'image' ? imageSize.value : undefined,
        width: width,
        height: height,
        htmlTemplate: htmlTemplate,
      },
      {
        onStreamContent(content) {
          generateStreamContent.value = content;
        },
        onError(error) {
          console.error('生成失败:', error);
          generateStreamContent.value += `\n\n❌ 错误: ${error}`;
        },
        onComplete() {
          generateStreamContent.value += `\n\n✅ 生成完成！`;
        },
        onPromptReady(prompt) {
          generateFinalPrompt.value = prompt;
        },
      }
    );
    result.value = generateResult;
  } catch (error) {
    console.error('生成出错:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    result.value = {
      success: false,
      error: errMsg,
    };
    generateStreamContent.value += `\n\n❌ 生成失败: ${errMsg}`;
  } finally {
    isGenerating.value = false;
    currentStage.value = '';
  }
}

// 下载 HTML
function downloadHtml() {
  if (!result.value?.html) return;
  const blob = new Blob([result.value.html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `slide-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 下载图片
function downloadImage() {
  if (!result.value?.imageUrl) return;
  const a = document.createElement('a');
  a.href = result.value.imageUrl;
  a.download = `slide-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 复制到剪贴板（静默复制，不弹提示）
async function copyToClipboard(text: string) {
  if (!text || text.trim() === '') {
    return;
  }
  
  try {
    // 使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // 降级方案：使用 execCommand
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('复制失败:', err);
      }
      
      document.body.removeChild(textarea);
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
}

// 触发Excel文件选择
function triggerExcelSelect() {
  excelInput.value?.click();
}

// 触发图片文件夹选择
function triggerImageFolderSelect() {
  imageFolderInput.value?.click();
}

// 处理模板选择
async function handleTemplateSelect() {
  if (!selectedHtmlTemplateId.value) {
    selectedHtmlTemplateContent.value = '';
    isTemplateLoading.value = false;
    return;
  }
  
  const template = htmlTemplates.value.find((t: typeof HTML_TEMPLATES[0]) => t.id === selectedHtmlTemplateId.value);
  if (!template) {
    isTemplateLoading.value = false;
    return;
  }
  
  isTemplateLoading.value = true;
  try {
    // 将原始URL转换为代理路径
    // 例如: https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/template/template_9.html
    // 转换为: /html-template-proxy/html-slides/static/template/template_9.html
    let templateUrl = template.html_url;
    if (templateUrl.startsWith('https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com')) {
      templateUrl = templateUrl.replace('https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com', '/html-template-proxy');
    }
    
    console.log('开始加载HTML模板，原始URL:', template.html_url);
    console.log('使用代理URL:', templateUrl);
    const response = await fetch(templateUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    selectedHtmlTemplateContent.value = htmlContent;
    console.log('HTML模板加载成功，长度:', htmlContent.length);
    console.log('模板内容预览（前200字符）:', htmlContent.substring(0, 200));
  } catch (error) {
    console.error('加载HTML模板失败:', error);
    selectedHtmlTemplateContent.value = '';
    alert(`加载HTML模板失败: ${error instanceof Error ? error.message : String(error)}\n请检查网络连接或模板URL是否可访问。`);
  } finally {
    isTemplateLoading.value = false;
  }
}

// 确保模板已加载（如果选择了模板但还没加载，则等待加载）
async function ensureTemplateLoaded(): Promise<boolean> {
  if (!selectedHtmlTemplateId.value || useCustomHtmlTemplate.value) {
    return true; // 没有选择模板或使用自定义模板，不需要等待
  }
  
  if (selectedHtmlTemplateContent.value) {
    return true; // 模板已加载
  }
  
  // 模板未加载，尝试加载
  console.log('模板未加载，开始加载...');
  await handleTemplateSelect();
  return !!selectedHtmlTemplateContent.value;
}

// 获取选中的模板信息
function getSelectedTemplateInfo(): string {
  if (!selectedHtmlTemplateId.value) return '';
  const template = htmlTemplates.value.find((t: typeof HTML_TEMPLATES[0]) => t.id === selectedHtmlTemplateId.value);
  if (!template) return '';
  return `${template.label.logical_relation} - ${template.label.chart_type}`;
}

// 获取选中的模板URL
function getSelectedTemplateUrl(): string {
  if (!selectedHtmlTemplateId.value) return '';
  const template = htmlTemplates.value.find((t: typeof HTML_TEMPLATES[0]) => t.id === selectedHtmlTemplateId.value);
  return template?.html_url || '';
}

// 获取要使用的HTML模板内容
function getHtmlTemplate(): string | undefined {
  if (useCustomHtmlTemplate.value && customHtmlTemplate.value.trim()) {
    console.log('使用自定义HTML模板，长度:', customHtmlTemplate.value.trim().length);
    return customHtmlTemplate.value.trim();
  }
  if (selectedHtmlTemplateId.value && selectedHtmlTemplateContent.value) {
    console.log('使用预设HTML模板，ID:', selectedHtmlTemplateId.value, '长度:', selectedHtmlTemplateContent.value.length);
    return selectedHtmlTemplateContent.value;
  }
  if (selectedHtmlTemplateId.value && !selectedHtmlTemplateContent.value) {
    console.warn('警告: 已选择模板但内容为空，模板ID:', selectedHtmlTemplateId.value);
  }
  console.log('未使用HTML模板');
  return undefined;
}

// 处理图片文件夹选择
function handleImageFolderSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  imageFolderFiles.value.clear();
  
  // 将所有文件存储到Map中，以文件名为key
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 使用文件名（不包含路径）作为key
    const fileName = file.name.toLowerCase();
    imageFolderFiles.value.set(fileName, file);
  }
  
  testLog.value = `已选择图片文件夹，包含 ${imageFolderFiles.value.size} 个文件\n`;
}

// 处理Excel文件选择
async function handleExcelSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  excelFile.value = file;
  testLog.value = `已选择Excel文件: ${file.name}\n`;

  try {
    // 使用FileReader读取文件，避免大文件堆栈溢出
    const reader = new FileReader();
    
    await new Promise<void>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('文件读取失败'));
            return;
          }
          
          // 读取XLSX格式（用于数据读取）
          workbook.value = XLSX.read(data, { type: 'binary' });
          
          // 读取ExcelJS格式（用于图片插入和写入）
          const arrayBuffer = await file.arrayBuffer();
          const wb = new ExcelJS.Workbook();
          await wb.xlsx.load(arrayBuffer);
          exceljsWorkbook.value = wb;
          
          testLog.value += `Excel文件加载成功\n`;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsBinaryString(file);
    });
  } catch (error) {
    testLog.value += `加载Excel文件失败: ${error}\n`;
    console.error('加载Excel文件失败:', error);
  }
}

// 查找列索引
function findColumnIndex(sheet: XLSX.WorkSheet, columnName: string): number | null {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  for (let col = 0; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = sheet[cellAddress];
    if (cell && cell.v && String(cell.v).trim() === columnName) {
      return col;
    }
  }
  return null;
}

// HTML转PNG
async function htmlToPng(html: string): Promise<string> {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:absolute;left:-9999px;width:1280px;height:720px;border:none;';
  iframe.sandbox.add('allow-same-origin', 'allow-scripts');
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error('无法创建iframe文档');

    doc.open();
    doc.write(html);
    doc.close();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const canvas = await html2canvas(iframe.contentDocument!.body, {
      width: 1280,
      height: 720,
      scale: 1,
      useCORS: true,
      logging: false,
    } as any);

    return canvas.toDataURL('image/png');
  } finally {
    document.body.removeChild(iframe);
  }
}

// 将PNG插入Excel
async function insertPngToExcel(row: number, col: number, pngBase64: string): Promise<void> {
  if (!exceljsWorkbook.value) {
    testLog.value += `✗ 插入图片失败: exceljsWorkbook为空\n`;
    return;
  }

  try {
    const worksheet = exceljsWorkbook.value.worksheets[0];
    if (!worksheet) {
      testLog.value += `✗ 插入图片失败: worksheet为空\n`;
      return;
    }

    testLog.value += `正在处理图片数据...\n`;
    
    // 处理base64数据（支持不同的格式）
    let base64Data = pngBase64;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    } else if (base64Data.startsWith('data:image')) {
      base64Data = base64Data.replace(/^data:image\/[^;]+;base64,/, '');
    }
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    testLog.value += `图片数据已转换，大小: ${bytes.length} 字节\n`;

    const imageId = exceljsWorkbook.value.addImage({
      buffer: bytes.buffer,
      extension: 'png',
    });

    testLog.value += `图片已添加到workbook，imageId: ${imageId}\n`;

    // 设置行高和列宽
    worksheet.getRow(row + 1).height = 120;
    worksheet.getColumn(col + 1).width = 20;

    // 插入图片
    worksheet.addImage(imageId, {
      tl: { col: col, row: row },
      ext: { width: 256, height: 144 },
    });

    testLog.value += `✓ 图片已插入到Excel (行${row + 1}, 列${col + 1})\n`;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    testLog.value += `✗ 插入图片失败: ${errMsg}\n`;
    console.error('插入图片失败:', error);
  }
}

// 写入文本到Excel
function writeTextToExcel(row: number, col: number, value: string) {
  if (workbook.value) {
    const sheet = workbook.value.Sheets[workbook.value.SheetNames[0]];
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    sheet[cellAddress] = { t: 's', v: value };
  }
  
  if (exceljsWorkbook.value) {
    const worksheet = exceljsWorkbook.value.worksheets[0];
    if (worksheet) {
      const cell = worksheet.getCell(row + 1, col + 1);
      cell.value = value;
    }
  }
}

// 导出Excel
async function exportExcel() {
  if (!exceljsWorkbook.value) {
    alert('没有可导出的Excel数据');
    return;
  }

  try {
    const buffer = await exceljsWorkbook.value.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = excelFile.value
      ? excelFile.value.name.replace(/\.(xlsx|xls)$/i, '_测试结果.xlsx')
      : '测试结果.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    testLog.value += `\nExcel文件已导出\n`;
  } catch (error) {
    testLog.value += `\n导出Excel失败: ${error}\n`;
    console.error('导出Excel失败:', error);
  }
}

// 通过图片ID提取图片
async function extractImageById(imageId: string): Promise<string | null> {
  if (!exceljsWorkbook.value) {
    console.log('extractImageById: exceljsWorkbook为空');
    return null;
  }
  
  try {
    console.log(`尝试通过ID提取图片: ${imageId}`);
    
    // 方法1: 直接使用字符串ID
    let imageData = null;
    try {
      imageData = exceljsWorkbook.value.getImage(imageId);
      console.log(`方法1: 直接使用字符串ID，结果:`, imageData ? '成功' : '失败');
    } catch (e) {
      console.log(`方法1失败:`, e);
    }
    
    // 方法2: 尝试作为数字ID（如果ID是数字字符串）
    if (!imageData && /^\d+$/.test(imageId)) {
      try {
        imageData = exceljsWorkbook.value.getImage(parseInt(imageId));
        console.log(`方法2: 作为数字ID，结果:`, imageData ? '成功' : '失败');
      } catch (e) {
        console.log(`方法2失败:`, e);
      }
    }
    
    // 方法3: 尝试从workbook.model.media中查找
    if (!imageData) {
      try {
        const workbookModel = (exceljsWorkbook.value as any).model;
        if (workbookModel && workbookModel.media) {
          // 遍历所有媒体，查找匹配的ID
          for (const [mediaId, mediaData] of Object.entries(workbookModel.media)) {
            if (String(mediaId) === imageId || mediaId === imageId) {
              imageData = mediaData;
              console.log(`方法3: 从model.media中找到，ID: ${mediaId}`);
              break;
            }
          }
        }
      } catch (e) {
        console.log(`方法3失败:`, e);
      }
    }
    
    // 方法4: 尝试从所有图片中查找匹配的ID
    if (!imageData) {
      try {
        const worksheet = exceljsWorkbook.value.worksheets[0];
        if (worksheet) {
          const images = worksheet.getImages();
          for (const image of images) {
            const imgId = String(image.imageId || '');
            if (imgId === imageId || imgId.includes(imageId) || imageId.includes(imgId)) {
              imageData = exceljsWorkbook.value.getImage(image.imageId);
              console.log(`方法4: 从getImages中找到匹配，imageId: ${image.imageId}`);
              break;
            }
          }
        }
      } catch (e) {
        console.log(`方法4失败:`, e);
      }
    }
    
    if (imageData && imageData.buffer) {
      const buffer = imageData.buffer;
      const ext = imageData.extension || 'png';
      
      console.log(`图片数据获取成功: 扩展名=${ext}, buffer类型=${buffer.constructor.name}`);
      
      const mimeType = ext === 'png' ? 'image/png' : 
                      ext === 'jpeg' || ext === 'jpg' ? 'image/jpeg' : 
                      ext === 'gif' ? 'image/gif' :
                      'image/png';
      
      // 将buffer转换为Uint8Array
      let uint8Array: Uint8Array;
      if (buffer instanceof Uint8Array) {
        uint8Array = buffer;
      } else if (buffer instanceof ArrayBuffer) {
        uint8Array = new Uint8Array(buffer);
      } else if ((buffer as any).buffer instanceof ArrayBuffer) {
        // 可能是TypedArray
        uint8Array = new Uint8Array((buffer as any).buffer);
      } else {
        try {
          uint8Array = new Uint8Array(buffer as any);
        } catch (e) {
          console.error('无法转换buffer:', e, buffer);
          return null;
        }
      }
      
      console.log(`Uint8Array长度: ${uint8Array.length}`);
      
      // 创建Blob并转换为base64
      const blob = new Blob([uint8Array], { type: mimeType });
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          console.log(`Base64转换成功，长度: ${result.length}, 前缀: ${result.substring(0, 50)}`);
          resolve(result);
        };
        reader.onerror = (error) => {
          console.error('FileReader错误:', error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
      
      return base64;
    } else {
      console.log(`未找到图片数据，imageData:`, imageData);
    }
  } catch (error) {
    console.error(`通过ID ${imageId} 提取图片失败:`, error);
  }
  
  return null;
}

// 从Excel中提取指定行的图片（使用ExcelJS的getImages API）
async function extractImageFromExcelRow(row: number, col: number): Promise<string | null> {
  if (!exceljsWorkbook.value) {
    console.log('exceljsWorkbook为空');
    return null;
  }
  
  try {
    const worksheet = exceljsWorkbook.value.worksheets[0];
    if (!worksheet) {
      console.log('worksheet为空');
      return null;
    }
    
    // 使用ExcelJS的getImages()方法获取所有图片
    const images = worksheet.getImages();
    console.log(`找到 ${images.length} 张图片，查找行${row}列${col}的图片`);
    
    // 遍历所有图片，找到目标单元格的图片
    for (const image of images) {
      if (image && image.range && image.range.tl) {
        const imageRow = image.range.tl.row;
        const imageCol = image.range.tl.col;
        
        console.log(`检查图片：行${imageRow}列${imageCol}，目标：行${row}列${col}`);
        
        // 检查图片是否在目标单元格（ExcelJS使用0-based索引）
        if (imageRow === row && imageCol === col) {
          const imageId = image.imageId;
          console.log(`找到匹配的图片，imageId: ${imageId}`);
          
          // 从workbook中获取图片数据
          const imageData = exceljsWorkbook.value.getImage(imageId);
          if (imageData && imageData.buffer) {
            // 获取图片的二进制数据和扩展名
            const buffer = imageData.buffer;
            const ext = imageData.extension || 'png';
            
            console.log(`图片数据：扩展名=${ext}，buffer长度=${buffer.byteLength || buffer.length}`);
            
            // 确定MIME类型
            const mimeType = ext === 'png' ? 'image/png' : 
                            ext === 'jpeg' || ext === 'jpg' ? 'image/jpeg' : 
                            ext === 'gif' ? 'image/gif' :
                            'image/png';
            
            // 将buffer转换为Uint8Array
            let uint8Array: Uint8Array;
            if (buffer instanceof Uint8Array) {
              uint8Array = buffer;
            } else if (buffer instanceof ArrayBuffer) {
              uint8Array = new Uint8Array(buffer);
            } else {
              // 尝试直接转换
              try {
                uint8Array = new Uint8Array(buffer as any);
              } catch (e) {
                console.error('无法转换buffer:', e);
                return null;
              }
            }
            
            console.log(`转换后的Uint8Array长度: ${uint8Array.length}`);
            
            // 创建Blob并转换为base64
            const blob = new Blob([uint8Array], { type: mimeType });
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                console.log(`Base64转换成功，长度: ${result.length}，前缀: ${result.substring(0, 30)}`);
                resolve(result);
              };
              reader.onerror = (error) => {
                console.error('FileReader错误:', error);
                reject(error);
              };
              reader.readAsDataURL(blob);
            });
            
            return base64;
          } else {
            console.log('imageData或buffer为空');
          }
        }
      }
    }
    
    console.log('未找到匹配的图片');
  } catch (error) {
    console.error('从Excel提取图片失败:', error);
  }
  
  return null;
}

// 停止测试
function handleStopTest() {
  shouldStopTest.value = true;
  testLog.value += `\n\n⚠️ 用户请求停止测试...\n`;
}

// 开始测试
async function handleStartTest() {
  if (!excelFile.value || !workbook.value || !exceljsWorkbook.value) {
    alert('请先选择Excel文件');
    return;
  }

  isTesting.value = true;
  shouldStopTest.value = false;
  testLog.value = '开始测试...\n';

  try {
    const sheet = workbook.value.Sheets[workbook.value.SheetNames[0]];
    if (!sheet) {
      throw new Error('Excel文件中没有找到工作表');
    }

    // 查找列索引
    const bodyPageCol = findColumnIndex(sheet, '正文页');
    const themeCol = findColumnIndex(sheet, '主题');
    const extractModelCol = findColumnIndex(sheet, '风格提取模型');
    const extractTextCol = findColumnIndex(sheet, '风格提取文本');
    const htmlModelCol = findColumnIndex(sheet, 'html使用模型');
    const htmlImageCol = findColumnIndex(sheet, 'html生成');
    const htmlSourceCol = findColumnIndex(sheet, 'html源码');
    const imageModelCol = findColumnIndex(sheet, '图片使用模型');
    const imageGenCol = findColumnIndex(sheet, '图片生成');

    if (bodyPageCol === null || themeCol === null) {
      throw new Error('Excel文件中未找到"正文页"或"主题"列');
    }

    // 获取数据范围，遍历所有行
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const totalRows = range.e.r;
    
    testLog.value += `找到 ${totalRows} 行数据，开始遍历处理...\n\n`;
    
    // 遍历每一行（从第1行开始，第0行是表头）
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      // 检查是否请求停止
      if (shouldStopTest.value) {
        testLog.value += `\n⚠️ 测试已停止，正在导出Excel...\n`;
        await exportExcel();
        testLog.value += `✓ Excel已导出\n`;
        break;
      }
      
      testLog.value += `\n========== 处理第 ${rowIndex} 行 ==========\n`;
      
      const bodyPageCell = XLSX.utils.encode_cell({ r: rowIndex, c: bodyPageCol });
      const themeCell = XLSX.utils.encode_cell({ r: rowIndex, c: themeCol });

      const bodyPageValue = sheet[bodyPageCell]?.v;
      const themeValue = sheet[themeCell]?.v;

      // 跳过没有图片的行
      if (!bodyPageValue) {
        testLog.value += `第 ${rowIndex} 行"正文页"列为空，跳过\n`;
        continue;
      }

      testLog.value += `读取第 ${rowIndex} 行数据:\n`;
      testLog.value += `  正文页: ${typeof bodyPageValue === 'string' ? bodyPageValue.substring(0, 50) + '...' : bodyPageValue}\n`;
      testLog.value += `  主题: ${themeValue || '(空)'}\n`;

      // 重试机制：最多重试10次
      const maxRetries = 10;
      let retryCount = 0;
      let rowSuccess = false;
      
      while (retryCount < maxRetries && !rowSuccess) {
        // 检查是否请求停止
        if (shouldStopTest.value) {
          break;
        }
        
        if (retryCount > 0) {
          testLog.value += `\n[重试 ${retryCount}/${maxRetries}] 重新处理第 ${rowIndex} 行...\n`;
          // 等待一段时间再重试
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
        
        try {
          // 处理图片：从文件路径或文件名读取图片
          let imageBase64s: string[] = [];
      
      if (typeof bodyPageValue === 'string' && bodyPageValue.trim()) {
        const imagePathOrName = bodyPageValue.trim();
        testLog.value += `图片路径/文件名: ${imagePathOrName}\n`;
        
        let imageFile: File | null = null;
        
        // 方法1: 如果选择了图片文件夹，尝试从文件夹中查找
        if (imageFolderFiles.value.size > 0) {
          // 从路径中提取文件名（处理Windows路径）
          const fileName = imagePathOrName.split(/[/\\]/).pop() || imagePathOrName;
          const fileNameLower = fileName.toLowerCase();
          
          testLog.value += `在图片文件夹中查找文件: ${fileName}\n`;
          
          // 尝试精确匹配
          imageFile = imageFolderFiles.value.get(fileNameLower) || null;
          
          // 如果精确匹配失败，尝试模糊匹配（忽略大小写）
          if (!imageFile) {
            for (const [key, file] of imageFolderFiles.value.entries()) {
              if (key === fileNameLower || key.includes(fileNameLower) || fileNameLower.includes(key)) {
                imageFile = file;
                testLog.value += `找到匹配的文件: ${file.name}\n`;
                break;
              }
            }
          }
        }
        
          // 方法2: 如果找到了文件，读取它
          if (imageFile) {
            testLog.value += `正在读取图片文件: ${imageFile.name}\n`;
            const base64 = await fileToBase64(imageFile);
            imageBase64s = [base64];
            testLog.value += `✓ 图片已从文件加载并转换为base64 (大小: ${(imageFile.size / 1024).toFixed(2)}KB)\n`;
          } 
          // 方法3: 尝试作为URL或base64处理
          else if (imagePathOrName.startsWith('http://') || imagePathOrName.startsWith('https://')) {
            testLog.value += `尝试作为URL加载...\n`;
            const response = await fetch(imagePathOrName);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const blob = await response.blob();
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            imageBase64s = [base64];
            testLog.value += `✓ 图片已从URL加载并转换为base64\n`;
          } 
          // 方法4: 尝试作为base64处理
          else if (imagePathOrName.startsWith('data:image')) {
            imageBase64s = [imagePathOrName];
            testLog.value += `✓ 使用单元格中的base64图片\n`;
          } 
          // 方法5: 本地文件系统路径（无法直接访问）
          else if (imagePathOrName.match(/^[A-Za-z]:[\\/]/) || imagePathOrName.startsWith('file://')) {
            throw new Error('检测到本地文件系统路径，浏览器无法直接访问。请在上方选择包含这些图片的文件夹');
          } 
          else {
            throw new Error(`无法处理图片路径/文件名。提示：请在上方选择包含图片的文件夹，或使用URL/base64格式`);
          }
        } else {
          throw new Error('"正文页"列中没有找到有效的图片路径/文件名');
        }
      
          if (imageBase64s.length === 0) {
            throw new Error('无法获取图片');
          }
          
          testLog.value += `已准备 ${imageBase64s.length} 张图片用于处理\n`;

          // 第一阶段：提取样式
          testLog.value += `开始第一阶段：提取样式...\n`;
          const extractModel = selectedModel.value || 'gpt-4o';
          
          let styleDescription = '';
          const styleResult = await extractStyleFromImage(
            {
              imageBase64s: imageBase64s,
              systemPrompt: extractSystemPrompt.value.trim() || undefined,
              userPrompt: (themeValue as string) || undefined,
              model: extractModel,
            },
            {
              onStreamContent(_content) {
                // 可以在这里更新日志
              },
              onError(error) {
                testLog.value += `第一阶段错误: ${error}\n`;
              },
            }
          );
          styleDescription = styleResult.styleDescription;
          
          // 写入结果
          if (extractModelCol !== null) {
            writeTextToExcel(rowIndex, extractModelCol, extractModel);
          }
          if (extractTextCol !== null) {
            writeTextToExcel(rowIndex, extractTextCol, styleDescription);
          }
          
          testLog.value += `✓ 第一阶段完成\n`;

          // 第二阶段：生成结果
          testLog.value += `开始第二阶段：生成结果...\n`;
          
          if (outputType.value === 'html') {
            // HTML生成
            const htmlModel = selectedHtmlModel.value || selectedModel.value || 'gpt-4o';
            
            // 确保模板已加载
            await ensureTemplateLoaded();
            const htmlTemplate = getHtmlTemplate();
            console.log('测试生成时使用的HTML模板:', htmlTemplate ? `已提供，长度: ${htmlTemplate.length}` : '未提供');
            
            const generateResult = await generateSlide(
              {
                styleDescription: styleDescription,
                systemPrompt: generateSystemPrompt.value.trim() || undefined,
                userPrompt: (themeValue as string) || undefined,
                model: htmlModel,
                outputType: 'html',
                width: 1280,
                height: 720,
                imageBase64s: sendImagesToStage2.value ? imageBase64s : undefined,
                htmlTemplate: htmlTemplate,
              },
              {
                onStreamContent(_content) {
                  // 可以在这里更新日志
                },
                onError(error) {
                  testLog.value += `第二阶段错误: ${error}\n`;
                },
              }
            );

            if (!generateResult.success || !generateResult.html) {
              throw new Error(generateResult.error || '生成失败');
            }
            
            // 写入HTML模型
            if (htmlModelCol !== null) {
              writeTextToExcel(rowIndex, htmlModelCol, htmlModel);
            }
            
            // 写入HTML源码
            if (htmlSourceCol !== null) {
              writeTextToExcel(rowIndex, htmlSourceCol, generateResult.html);
            }
            
            // HTML转图片并插入
            testLog.value += `正在将HTML转换为图片...\n`;
            const pngBase64 = await htmlToPng(generateResult.html);
            if (htmlImageCol !== null) {
              await insertPngToExcel(rowIndex, htmlImageCol, pngBase64);
            }
            
            testLog.value += `✓ 第二阶段完成\n`;
          } else {
            // 图片生成
            const imgModel = selectedImageModel.value || 'Doubao-image-seedream-v4.5';
            
            const generateResult = await generateSlide(
              {
                styleDescription: styleDescription,
                systemPrompt: generateSystemPrompt.value.trim() || undefined,
                userPrompt: (themeValue as string) || undefined,
                imageModel: imgModel,
                outputType: 'image',
                imageSize: imageSize.value,
                width: 3600,
                height: 2025,
                imageBase64s: sendImagesToStage2.value ? imageBase64s : undefined,
              },
              {
                onStreamContent(_content) {
                  // 可以在这里更新日志
                },
                onError(error) {
                  testLog.value += `第二阶段错误: ${error}\n`;
                },
              }
            );

            if (!generateResult.success || !generateResult.imageUrl) {
              throw new Error(generateResult.error || '生成失败');
            }
            
            // 写入图片模型
            if (imageModelCol !== null) {
              writeTextToExcel(rowIndex, imageModelCol, imgModel);
            }
            
            // 将图片URL转换为base64并插入
            testLog.value += `正在加载生成的图片: ${generateResult.imageUrl}\n`;
            const response = await fetch(generateResult.imageUrl);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            testLog.value += `图片已下载，大小: ${(blob.size / 1024).toFixed(2)}KB\n`;
            
            const reader = new FileReader();
            const pngBase64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                testLog.value += `图片已转换为base64，长度: ${result.length}\n`;
                resolve(result);
              };
              reader.onerror = (error) => {
                testLog.value += `FileReader错误: ${error}\n`;
                reject(error);
              };
              reader.readAsDataURL(blob);
            });
            
            if (imageGenCol !== null) {
              testLog.value += `正在将图片插入到Excel第${rowIndex + 1}行，第${imageGenCol + 1}列...\n`;
              await insertPngToExcel(rowIndex, imageGenCol, pngBase64);
              testLog.value += `✓ 图片已插入到Excel\n`;
            } else {
              testLog.value += `⚠️ 未找到"图片生成"列，无法插入图片\n`;
            }
            testLog.value += `✓ 第二阶段完成\n`;
          }
          
          // 如果执行到这里，说明成功了
          rowSuccess = true;
          testLog.value += `✓ 第 ${rowIndex} 行处理完成\n`;
          
        } catch (error) {
          retryCount++;
          const errMsg = error instanceof Error ? error.message : String(error);
          testLog.value += `✗ 第 ${rowIndex} 行处理失败 (尝试 ${retryCount}/${maxRetries}): ${errMsg}\n`;
          
          if (retryCount >= maxRetries) {
            testLog.value += `✗ 第 ${rowIndex} 行已达到最大重试次数，跳过\n`;
            // 写入失败信息
            if (extractTextCol !== null) {
              writeTextToExcel(rowIndex, extractTextCol, `失败: 重试${maxRetries}次后仍失败 - ${errMsg}`);
            }
            if (outputType.value === 'html' && htmlSourceCol !== null) {
              writeTextToExcel(rowIndex, htmlSourceCol, `失败: 重试${maxRetries}次后仍失败 - ${errMsg}`);
            }
            if (outputType.value === 'image' && imageGenCol !== null) {
              writeTextToExcel(rowIndex, imageGenCol, `失败: 重试${maxRetries}次后仍失败 - ${errMsg}`);
            }
            break; // 跳出重试循环，继续下一行
          }
        }
      }
      
      if (!rowSuccess) {
        testLog.value += `⚠️ 第 ${rowIndex} 行最终处理失败，已跳过\n`;
      }
      
      // 每处理完一行后检查是否请求停止
      if (shouldStopTest.value) {
        testLog.value += `\n⚠️ 测试已停止，正在导出Excel...\n`;
        await exportExcel();
        testLog.value += `✓ Excel已导出\n`;
        break;
      }
    }

    // 所有行处理完成后导出Excel（如果没有被停止）
    if (!shouldStopTest.value) {
      testLog.value += `\n========== 所有行处理完成，正在导出Excel... ==========\n`;
      await exportExcel();
      testLog.value += `✓ 测试完成！\n`;
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    testLog.value += `\n测试失败: ${errMsg}\n`;
    console.error('测试失败:', error);
    
    // 即使出错也尝试导出Excel
    try {
      testLog.value += `正在导出已处理的数据...\n`;
      await exportExcel();
      testLog.value += `✓ Excel已导出\n`;
    } catch (exportError) {
      testLog.value += `✗ 导出Excel失败: ${exportError}\n`;
    }
  } finally {
    isTesting.value = false;
    shouldStopTest.value = false;
  }
}

// 加载模型列表
onMounted(async () => {
  try {
    const models = await fetchModels();
    modelList.value = models;
    // 设置默认模型为列表第一个
    if (models.length > 0 && !selectedModel.value) {
      selectedModel.value = models[0].id;
    }
    // HTML生成模型也默认使用第一个
    if (models.length > 0 && !selectedHtmlModel.value) {
      selectedHtmlModel.value = models[0].id;
    }
  } catch (error) {
    console.error('加载模型列表失败:', error);
  }

  // 加载图片生成模型列表（固定列表）
  isLoadingImageModels.value = true;
  try {
    const models = await fetchImageModels();
    imageModelList.value = models;
    // 设置默认模型为列表第一个
    if (models.length > 0 && !selectedImageModel.value) {
      selectedImageModel.value = models[0].id;
    }
  } catch (error) {
    console.error('加载图片生成模型列表失败:', error);
  } finally {
    isLoadingImageModels.value = false;
  }
});
</script>

<style scoped>
.keepstyle-panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--main-bg);
}

.panel-header {
  padding: 24px 32px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.panel-content {
  display: flex;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.left-panel {
  width: 420px;
  min-width: 380px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  background: var(--main-bg);
}

.right-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background: var(--main-bg);
}

.form-section {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.form-field {
  margin-bottom: 16px;
}

.form-field:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.hint {
  font-weight: 400;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

/* 配置区域 */
.config-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px 0;
}

.config-group {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.config-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.model-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s;
}

.model-select:focus {
  outline: none;
  border-color: var(--accent-color);
}

.model-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-section {
  margin-bottom: 0;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--input-bg);
}

.upload-area:hover,
.upload-area.dragging {
  border-color: var(--accent-color);
  background: var(--hover-bg);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.upload-icon {
  font-size: 3rem;
}

.images-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.image-preview-item {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-index {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.image-controls {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.move-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  user-select: none;
}

.move-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.number-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.number-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.number-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.prompt-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.prompt-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.prompt-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.prompt-display {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--card-bg);
  color: var(--text-secondary);
  line-height: 1.6;
  cursor: text;
  min-height: 100px;
  resize: vertical !important;
  overflow-y: auto;
}

.resizable {
  resize: vertical !important;
  overflow-y: auto;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.copy-btn {
  padding: 4px 12px;
  font-size: 0.8rem;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.copy-btn:active {
  transform: translateY(0);
}

.prompt-display-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.generate-btn {
  width: 100%;
  background: var(--accent-gradient);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: var(--shadow-md);
}

.stage-btn {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.stage-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-1px);
}

.primary-btn {
  background: var(--accent-gradient);
  color: #ffffff;
  border: none;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184, 115, 51, 0.3);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.test-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.stop-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stop-btn:hover {
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

.upload-btn {
  width: 100%;
  padding: 10px 16px;
  background: var(--card-bg);
  color: var(--text-primary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-align: center;
}

.upload-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  background: var(--input-bg);
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 流式输出展示 */
.stream-output-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stream-output {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stream-output label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.stream-output .field-header {
  margin-bottom: 6px;
}

.stream-textarea {
  width: 100%;
  min-height: 150px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  font-size: 0.72rem;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--text-secondary);
  line-height: 1.5;
  overflow-y: auto;
  resize: vertical !important;
}

.stream-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-item input[type='radio'] {
  cursor: pointer;
}

.result-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid var(--border-color);
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.result-content {
  margin-top: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-small:hover {
  transform: translateY(-1px);
}

.html-preview {
  width: 1280px;
  height: 720px;
  max-width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.result-image {
  width: 100%;
  max-width: 1280px;
  height: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.error-message {
  padding: 16px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-top: 16px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--text-tertiary);
  min-height: 300px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .panel-content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .form-section {
    height: auto;
    max-height: none;
  }
}
</style>

