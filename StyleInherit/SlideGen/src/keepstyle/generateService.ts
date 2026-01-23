/**
 * 生成服务
 * 根据提取的样式和用户输入生成 HTML 或图片
 */

import type { GenerateRequest, GenerateResult, GenerateCallbacks } from './types';
import { generateImageByApi } from './imageGenerateService';

// 从环境变量或默认值获取配置
function getConfig() {
  return {
    apiUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    apiKey: (import.meta as any).env?.VITE_API_KEY || '',
    model: (import.meta as any).env?.VITE_MODEL_NAME || 'gpt-4o',
    stream: true,
  };
}

// 默认的HTML生成提示词
const DEFAULT_HTML_PROMPT = '请根据提取的设计风格生成一张高质量的HTML幻灯片，包含标题、内容和底部信息。';

/**
 * 构建生成 HTML 的提示词
 */
function buildHtmlPrompt(request: GenerateRequest): string {
  // 如果用户提供了系统提示词，则完全使用用户提供的（全替换）
  // 如果用户没有提供，则使用默认提示词 + 固定的任务说明
  let prompt: string;
  
  // HTML 生成时使用 1280x720
  const width = request.width || 1280;
  const height = request.height || 720;
  
  // 如果提供了HTML模板，使用基于模板的提示词
  if (request.htmlTemplate && request.htmlTemplate.trim()) {
    const htmlTemplate = request.htmlTemplate.trim();
    
    // 即使提供了系统提示词，也要包含模板信息
    if (request.systemPrompt && request.systemPrompt.trim()) {
      // 用户提供了系统提示词，替换占位符并在提示词基础上添加模板信息
      const information = request.userPrompt || '根据设计风格生成一张专业的 HTML 幻灯片页面';
      const slideStyle = request.styleDescription || '';
      
      prompt = request.systemPrompt.trim()
        .replace(/\{\^information\^\}/g, information)
        .replace(/\{\^slideStyle\^\}/g, slideStyle)
        .replace(/\{\^width\^\}/g, String(width))
        .replace(/\{\^height\^\}/g, String(height));

      prompt += `\n\n## HTML模板\n以下是参考的HTML模板，请基于此模板的结构和布局，结合提取的设计风格和用户主题，生成新的HTML页面：\n\n\`\`\`html\n${htmlTemplate}\n\`\`\`\n\n**重要说明**：\n- 请保持模板的整体布局和组件结构\n- 将模板的样式替换为提取的设计风格\n- 将模板的内容替换为用户主题的内容`;
    } else {
      // 使用基于模板的默认提示词
      const defaultPrompt = `# 角色

你是一个专业的html设计师，擅长根据用户的输入内容"{^information^}"，请根据用户输入内容创建一张高质量的 HTML 幻灯片页面。



## 输入内容

{^information^}



## 风格样式参数

{^slideStyle^}



## 设计要求

**首要原则**：风格样式参数中明确指定的内容，严格按照参数执行。

1. 尺寸固定为 {^width^}px × {^height^}px

2. 现代、专业的设计风格，配色和谐

3. 文字清晰可读，排版美观

4. 可使用渐变、阴影、圆角等现代设计元素

5. 尽量避免蓝紫渐变色和发光效果

6. 请你确保<header>的元素中，只有main-title，其余的sub-title以及sort元素均不需要

7. 请你确保主体中尽量减少留白与空缺

8. 数据展示：

   -ECharts请使用canvas模式，不要使用svg模式的，请尽量使用canvas模式(renderer: 'canvas')

   -<canvas> 明确 width 与 height，容器使用 shrink-0 与固定 max-h，overflow-hidden 防止溢出，禁止图表溢出页面 {max-height:  {^height^}px}。

   -Chart.js 配置 responsive: false、maintainAspectRatio: false，坐标轴、图例字号与颜色应适配主题与深浅背景，Chart.js 配置中 animation 必须为 false。

9.布局定位原则：

  - 禁止背景、图片块等遮盖文字，，背景badkground的节点, z-index的层级不要太高, 尽量z-index小一些而且不要挡住后续内容，禁止出现背景遮挡正文的情况，不导致元素与正文内容重叠。

  - 图表、卡片及关键内容区域，不得浮动或使用绝对定位，禁止元素因定位不当导致互相重叠或层叠顺序混；

10.尽量避免背景是渐变阴影，页面背景的颜色只有一层即可

10. 保证资源来自于以下可用资源



## 可用资源（必须从中选取使用）

1. **Font Awesome 6** - 用于图标

   \`<link rel="stylesheet" href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/font-awesome/css/all.min.css">\`

   使用示例：\`<i class="fa-solid fa-chart-line"></i>\`

2. **ECharts 5** - 用于数据可视化图表（如果内容涉及数据展示）

   \`<script src="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/echarts.min.js"></script>\`

   图表必须在页面加载时立即渲染，不依赖用户交互

   不要使用svg模式的，请尽量使用canvas模式

   **必须关闭动画**：配置中设置 \`animation: false\`

3. **Fonts** - 用于优质字体

   \`<link href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/css2/css2.css" rel="stylesheet">\`



## 严格禁止

- 禁止任何 CSS 动画（animation、transition、@keyframes）

- 禁止任何 hover、focus、active 等伪类效果

- 禁止滚动条（必须 overflow: hidden）

- 禁止任何需要用户交互才能显示的内容

- 禁止图表动画（ECharts 必须设置 animation: false）

- 禁止元素溢出规定{^width^}px × {^height^}px尺寸的画布，如果溢出，请缩放大小进行调整

- 这是静态 PPT，所有内容必须在页面加载后立即可见



## 如果生成的html不符合严格禁止里的要求，请修复，修复要求：

1. 保持原有的设计风格、配色、字体不变

2. 只修改导致排版问题的部分

3. 确保修复后的页面尺寸严格为 1280px × 720px，无滚动条

4. 如果内容过多导致溢出，可以：

   - 适当减小字体大小

   - 减少间距

   - 精简文字内容

   - 调整布局结构

5. 确保所有内容都在可视区域内



## 输出格式

输出完整的 HTML 文档，以 ===SLIDE_START=== 开始，===SLIDE_END=== 结束，并在html里用注释写上你判断是否符合要求和不符合时修复的想法，此想法控制在20字以内：



===SLIDE_START===

<!DOCTYPE html>

<html lang="zh-CN">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width={^width^}, height={^height^}">

  <link rel="stylesheet" href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/font-awesome/css/all.min.css">

  <link href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/css2/css2.css" rel="stylesheet">

  <style>

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body { width: {^width^}px; height: {^height^}px; overflow: hidden; font-family: 'Noto Sans SC', sans-serif; }

    /* 你的样式 */

  </style>

</head>

<body>

  <!-- 你的内容 -->

  <!-- 如需 ECharts，在此添加 script 标签并立即初始化图表 -->

</body>

</html>

===SLIDE_END===



请直接输出 HTML 代码，不要添加任何解释。



宽高默认是1280*720，风格样式参数就是阶段一的全部输出`;

      // 替换占位符
      const information = request.userPrompt || '根据设计风格生成一张专业的 HTML 幻灯片页面';
      const slideStyle = request.styleDescription || '';
      
      prompt = defaultPrompt
        .replace(/\{\^information\^\}/g, information)
        .replace(/\{\^slideStyle\^\}/g, slideStyle)
        .replace(/\{\^width\^\}/g, String(width))
        .replace(/\{\^height\^\}/g, String(height));
      
      // 如果有HTML模板，添加模板信息
      prompt += `\n\n## HTML模板\n以下是参考的HTML模板，请基于此模板的结构和布局，结合提取的设计风格和用户主题，生成新的HTML页面：\n\n\`\`\`html\n${htmlTemplate}\n\`\`\`\n\n**重要说明**：\n- 请保持模板的整体布局和组件结构\n- 将模板的样式替换为提取的设计风格\n- 将模板的内容替换为用户主题的内容`;
    }
  } else {
    // 没有提供HTML模板，使用原来的逻辑
    if (request.systemPrompt && request.systemPrompt.trim()) {
      // 用户提供了系统提示词，替换占位符后直接使用
      const information = request.userPrompt || '根据设计风格生成一张专业的 HTML 幻灯片页面';
      const slideStyle = request.styleDescription || '';
      
      prompt = request.systemPrompt.trim()
        .replace(/\{\^information\^\}/g, information)
        .replace(/\{\^slideStyle\^\}/g, slideStyle)
        .replace(/\{\^width\^\}/g, String(width))
        .replace(/\{\^height\^\}/g, String(height));
    } else {
      // 用户没有提供系统提示词，使用默认提示词
      const defaultPrompt = `# 角色

你是一个专业的html设计师，擅长根据用户的输入内容"{^information^}"，请根据用户输入内容创建一张高质量的 HTML 幻灯片页面。



## 输入内容

{^information^}



## 风格样式参数

{^slideStyle^}



## 设计要求

**首要原则**：风格样式参数中明确指定的内容，严格按照参数执行。

1. 尺寸固定为 {^width^}px × {^height^}px

2. 现代、专业的设计风格，配色和谐

3. 文字清晰可读，排版美观

4. 可使用渐变、阴影、圆角等现代设计元素

5. 尽量避免蓝紫渐变色和发光效果

6. 请你确保<header>的元素中，只有main-title，其余的sub-title以及sort元素均不需要

7. 请你确保主体中尽量减少留白与空缺

8. 数据展示：

   -ECharts请使用canvas模式，不要使用svg模式的，请尽量使用canvas模式(renderer: 'canvas')

   -<canvas> 明确 width 与 height，容器使用 shrink-0 与固定 max-h，overflow-hidden 防止溢出，禁止图表溢出页面 {max-height:  {^height^}px}。

   -Chart.js 配置 responsive: false、maintainAspectRatio: false，坐标轴、图例字号与颜色应适配主题与深浅背景，Chart.js 配置中 animation 必须为 false。

9.布局定位原则：

  - 禁止背景、图片块等遮盖文字，，背景badkground的节点, z-index的层级不要太高, 尽量z-index小一些而且不要挡住后续内容，禁止出现背景遮挡正文的情况，不导致元素与正文内容重叠。

  - 图表、卡片及关键内容区域，不得浮动或使用绝对定位，禁止元素因定位不当导致互相重叠或层叠顺序混；

10.尽量避免背景是渐变阴影，页面背景的颜色只有一层即可

10. 保证资源来自于以下可用资源



## 可用资源（必须从中选取使用）

1. **Font Awesome 6** - 用于图标

   \`<link rel="stylesheet" href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/font-awesome/css/all.min.css">\`

   使用示例：\`<i class="fa-solid fa-chart-line"></i>\`

2. **ECharts 5** - 用于数据可视化图表（如果内容涉及数据展示）

   \`<script src="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/echarts.min.js"></script>\`

   图表必须在页面加载时立即渲染，不依赖用户交互

   不要使用svg模式的，请尽量使用canvas模式

   **必须关闭动画**：配置中设置 \`animation: false\`

3. **Fonts** - 用于优质字体

   \`<link href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/css2/css2.css" rel="stylesheet">\`



## 严格禁止

- 禁止任何 CSS 动画（animation、transition、@keyframes）

- 禁止任何 hover、focus、active 等伪类效果

- 禁止滚动条（必须 overflow: hidden）

- 禁止任何需要用户交互才能显示的内容

- 禁止图表动画（ECharts 必须设置 animation: false）

- 禁止元素溢出规定{^width^}px × {^height^}px尺寸的画布，如果溢出，请缩放大小进行调整

- 这是静态 PPT，所有内容必须在页面加载后立即可见



## 如果生成的html不符合严格禁止里的要求，请修复，修复要求：

1. 保持原有的设计风格、配色、字体不变

2. 只修改导致排版问题的部分

3. 确保修复后的页面尺寸严格为 1280px × 720px，无滚动条

4. 如果内容过多导致溢出，可以：

   - 适当减小字体大小

   - 减少间距

   - 精简文字内容

   - 调整布局结构

5. 确保所有内容都在可视区域内



## 输出格式

输出完整的 HTML 文档，以 ===SLIDE_START=== 开始，===SLIDE_END=== 结束，并在html里用注释写上你判断是否符合要求和不符合时修复的想法，此想法控制在20字以内：



===SLIDE_START===

<!DOCTYPE html>

<html lang="zh-CN">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width={^width^}, height={^height^}">

  <link rel="stylesheet" href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/html-slides/static/font-awesome/css/all.min.css">

  <link href="https://wpp-figma-slide.ks3-cn-beijing.ksyuncs.com/slide_res/20241121/css2/css2.css" rel="stylesheet">

  <style>

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body { width: {^width^}px; height: {^height^}px; overflow: hidden; font-family: 'Noto Sans SC', sans-serif; }

    /* 你的样式 */

  </style>

</head>

<body>

  <!-- 你的内容 -->

  <!-- 如需 ECharts，在此添加 script 标签并立即初始化图表 -->

</body>

</html>

===SLIDE_END===



请直接输出 HTML 代码，不要添加任何解释。



宽高默认是1280*720，风格样式参数就是阶段一的全部输出`;

      // 替换占位符
      const information = request.userPrompt || '根据设计风格生成一张专业的 HTML 幻灯片页面';
      const slideStyle = request.styleDescription || '';
      
      prompt = defaultPrompt
        .replace(/\{\^information\^\}/g, information)
        .replace(/\{\^slideStyle\^\}/g, slideStyle)
        .replace(/\{\^width\^\}/g, String(width))
        .replace(/\{\^height\^\}/g, String(height));
    }
  }
  
  return prompt;
}

/**
 * 生成 HTML 幻灯片
 */
async function generateHtml(
  request: GenerateRequest,
  callbacks?: GenerateCallbacks
): Promise<string> {
  const config = getConfig();
  const prompt = buildHtmlPrompt(request);
  
  // 通知提示词已准备好
  callbacks?.onPromptReady?.(prompt);

  // 构建消息内容（支持多模态图片）
  let messages: Array<{ role: 'user' | 'assistant' | 'system'; content: any }>;
  
  if (request.imageBase64s && request.imageBase64s.length > 0) {
    // 如果有图片，使用多模态格式
    const imageContents = request.imageBase64s.map((imageBase64) => {
      const imageUrl = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
      return {
        type: 'image_url' as const,
        image_url: { url: imageUrl },
      };
    });
    
    messages = [{
      role: 'user' as const,
      content: [
        ...imageContents,
        {
          type: 'text' as const,
          text: prompt,
        },
      ],
    }];
  } else {
    // 普通文本消息
    messages = [{ role: 'user' as const, content: prompt }];
  }

  if (config.stream) {
    // 流式响应
    let fullContent = '';

    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || config.model,
        messages,
        temperature: 0.2,
        max_tokens: request.maxTokens || 16000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = `生成失败: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      callbacks?.onError?.(error);
      throw new Error(error);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              callbacks?.onStreamContent?.(fullContent);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }

    // 提取 HTML
    const htmlMatch = fullContent.match(/===SLIDE_START===\s*([\s\S]*?)\s*===SLIDE_END===/);
    if (htmlMatch) {
      return htmlMatch[1].trim();
    }

    // 如果没有标记，尝试提取 <!DOCTYPE 或 <html 开始的内容
    const htmlMatch2 = fullContent.match(/(<!DOCTYPE[\s\S]*)/);
    if (htmlMatch2) {
      return htmlMatch2[1].trim();
    }

    throw new Error('未找到 HTML 内容');
  } else {
    // 非流式响应
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || config.model,
        messages,
        temperature: 0.2,
        max_tokens: request.maxTokens || 16000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = `生成失败: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      callbacks?.onError?.(error);
      throw new Error(error);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // 提取 HTML
    const htmlMatch = content.match(/===SLIDE_START===\s*([\s\S]*?)\s*===SLIDE_END===/);
    if (htmlMatch) {
      return htmlMatch[1].trim();
    }

    // 如果没有标记，尝试提取 <!DOCTYPE 或 <html 开始的内容
    const htmlMatch2 = content.match(/(<!DOCTYPE[\s\S]*)/);
    if (htmlMatch2) {
      return htmlMatch2[1].trim();
    }

    throw new Error('未找到 HTML 内容');
  }
}

/**
 * 生成图片（通过提交任务+轮询方式）
 * 参考 D:\jiazaixiang\kwppbeautify_jsaddons\src\components\AiBananaFullPpt.vue
 * 使用 submitImageTask + queryTaskStatus 的方式
 */
async function generateImage(
  request: GenerateRequest,
  callbacks?: GenerateCallbacks
): Promise<string> {
  // 使用图片生成 API（提交任务+轮询），返回图片 URL
  const imageUrl = await generateImageByApi(request, callbacks);
  return imageUrl;
}

/**
 * 生成幻灯片（HTML 或图片）
 */
export async function generateSlide(
  request: GenerateRequest,
  callbacks?: GenerateCallbacks
): Promise<GenerateResult> {
  try {
    if (request.outputType === 'html') {
      const html = await generateHtml(request, callbacks);
      callbacks?.onComplete?.();
      return {
        html,
        success: true,
      };
    } else {
      const imageUrl = await generateImage(request, callbacks);
      callbacks?.onComplete?.();
      return {
        imageUrl,
        success: true,
      };
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    callbacks?.onError?.(errMsg);
    return {
      success: false,
      error: errMsg,
    };
  }
}

