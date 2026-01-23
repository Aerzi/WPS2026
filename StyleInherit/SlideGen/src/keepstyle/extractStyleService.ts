/**
 * 样式提取服务
 * 根据图片和提示词提取样式和风格
 */

import type { StyleExtractRequest, StyleExtractResult } from './types';

// 从环境变量或默认值获取配置
function getConfig() {
  return {
    apiUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    apiKey: (import.meta as any).env?.VITE_API_KEY || '',
    model: (import.meta as any).env?.VITE_MODEL_NAME || 'gpt-4o',
  };
}

// 默认的样式提取系统提示词 - PPT 视觉基因提取协议
const DEFAULT_EXTRACT_SYSTEM_PROMPT = `# PPT视觉基因提取协议



## 0. 任务角色



你是一位资深 PPT 视觉总监。你的任务是将识别传入的一张PPT 页面，将其样式信息解构为"参数（Spec）"与"感官（Desc）"的双重标准，并在结尾输出一段高质量的画面整体描述，用于驱动生图模型生成完美的 PPT 背景。



## 1. 核心布局约束 (Content & Layout Constraints)



* 内容区定义：进行视觉提取时必须将画面中心 [60%-70% 区域] 识别为"PPT内容区"。对于内容区，允许模型自己根据其他输入信息进行自由创作。

* 装饰位置锚定：所有视觉元素（底纹、几何体、光效）必须精确锚定在 [四个角落]、[侧边出血位] 或 [底部基座区]。确保"内容归内容，装饰归装饰"，生成的图片可直接作为 PPT 容器使用。

* 艺术感美观定义：视觉提取的最终目的是样式美观，如果提取到的色彩体系不存在美感关系，请你在保持背景色不变动的情况下，尽可能优化强调色与字体色的选取，使其在色相接近的同时保持高对比度，保护用户的阅读体验。



## 2. 极端场景适配描述 (Extreme Scenario Handling)



针对极端场景，最核心目的是要保证用户的样式视觉体验在"基因一脉相承"的基础上，通过专业干预实现更丰富、更易读的视觉呈现。



* 用户明确要求 (Explicit User Requirements)

* 处理方案：将用户指令置于最高优先级。用户有明确要求与约束的（不需要根据主题泛化，看用户语义即可），按照用户要求生成；用户自身不明确的，按照PPT页面进行补充，保证最终的样式层信息完整。

* 用户输入：{^input^}



* 极简/纯色场景 (Ultra-Minimalist)

* 处理方案：保证纯色信息获取的同时，允许根据已有信息与用户主题进行一定程度上的色彩体系补充，去丰富页面范围。



* 低对比度/哑光场景 (Low Contrast/Matte)

* 处理方案：核心干预策略——保持背景色与强调色的基调不变，但强制将字体色推向色彩空间的极端（极黑或极白）。通过 *Extreme luminance contrast (极端明度对比)* 确保信息识别，同时利用 *Textural micro-shadows (文本微阴影)* 增加文字的穿透力。



* 简单色彩/高亮场景 (Primary Colors/High-Key)

* 处理方案：引入工业设计质感，防止色彩显得廉价。使用词汇如：*High-end plastic/anodized aluminum texture (高级塑料/阳极氧化铝质感), Studio soft-box lighting (摄影棚柔光箱布光).*



* 内容极度拥挤场景 (Overcrowded Layout)

* 处理方案：强制执行"视觉消隐"。将背景细节降至最低，仅在边缘保留 [0.5pt Hairline (极细装饰线)]，通过 *Clean background void (清空背景感)* 来对冲内容的拥挤感，严禁任何可能与文字重叠的底纹。



* 复杂图形/摄影背景场景 (Busy/Image-Heavy)

* 处理方案：引入"数字屏障"。在内容区与背景之间增加一层 [Gaussian Blur Panel (高斯模糊面板)] 或 [Frosted Glass Layer (毛玻璃层)]。通过降低背景区域的 *Visual Noise (视觉噪点)*，实现背景的丰富度与文字的可读性并存。



* 高饱和度/荧光色场景 (High Saturation/Neon)

* 处理方案：采用"黑体/白体压制"。背景使用高饱和色彩时，装饰物使用 [Glassmorphism (玻璃拟态)] 来稀释色彩浓度，光源使用 *Neutral white light (中性白光)* 修正色温，防止长时间观看导致视觉疲劳。



## 3. 结构化输出协议 (Spec & Desc)



[Color System - 色彩体系]



* Slide Background (页面背景)：[Spec: HEX/渐变] | [Desc: 主色调的冷暖倾向，以及如何通过微弱的明度变化营造空间深度。]

* Accent Color (强调色)：[Spec: HEX数组] | [Desc: 局部点缀色、边框颜色、辅助板块色的分布位置，通常用于边缘轮廓线或微小的几何锚点，需要明确出强相关的颜色数组给到选择]

* Font Color（字体色）：[Spec: HEX] | [Desc: 直接描述字体的样式与观感]



[Typography & Border - 视觉骨架]



* Container Style (容器感)：[Spec: 字体观感与边框参数] | [Desc: 描述背景中隐含的"虚拟边框"。例如：具有毛玻璃质感的浮动面板边缘，或半透明的线条框架。]



[Shape & Material - 材质进化]



* Physical Properties (物理特性)：[Spec: 圆角/透明度] | [Desc: 描述形状的物理触感。如：超大圆角带来的亲和力、30%透明度的层叠感、深度的外阴影带来的悬浮视觉。]



## 4. 风格总描述提示词模板 (Global Style Prompt)



> 这页 PPT 呈现一种 [风格属性，如：科技极简] 的视觉特征。

> 空间定位：画面中心区域保持绝对清爽，视觉重心锚定在 [具体位置，如：左上角与右下角的对角线]。

> 光影细节：光源设定在 [方向]，产生 [软/硬] 阴影，使背景元素具有 [浮雕感/悬浮感]。

> 极端环境控制：在 [颜色/对比度] 极端的情况下，通过 [材质微纹理/0.5pt 细线] 维持画面的高级感与结构清晰度。

> 艺术流派：参考 [流派，如：Neumorphism/Apple-style Minimalism]，整体呈现出一种专业演示稿的通透感与呼吸感。"`;

/**
 * 提取图片样式
 */
export async function extractStyleFromImage(
  request: StyleExtractRequest,
  callbacks?: {
    onStreamContent?: (content: string) => void;
    onError?: (error: string) => void;
    onPromptReady?: (prompt: string) => void; // 提示词准备好后回调
  }
): Promise<StyleExtractResult> {
  const config = getConfig();

  if (!config.apiKey) {
    const error = '未配置 API Key，请在环境变量中设置 VITE_API_KEY';
    callbacks?.onError?.(error);
    throw new Error(error);
  }

  // 如果用户提供了系统提示词，则完全使用用户提供的（全替换）
  // 如果用户没有提供，则使用默认提示词 + 固定的分析任务部分
  let prompt: string;
  
  if (request.systemPrompt && request.systemPrompt.trim()) {
    // 用户提供了系统提示词，直接使用，不再添加任何固定内容
    // 如果提示词中包含 {^input^}，则替换为用户输入
    let userPrompt = request.userPrompt?.trim() || '';
    prompt = request.systemPrompt.trim().replace(/\{\^input\^\}/g, userPrompt);
  } else {
    // 用户没有提供系统提示词，使用默认提示词
    const systemPrompt = DEFAULT_EXTRACT_SYSTEM_PROMPT;
    // 用户输入（如果有）
    const userInput = request.userPrompt?.trim() || '';
    
    // 替换提示词中的 {^input^} 占位符
    prompt = systemPrompt.replace(/\{\^input\^\}/g, userInput);
  }

  // 通知提示词已准备好
  callbacks?.onPromptReady?.(prompt);

  // 构建多模态消息 - 支持多张图片
  const imageContents = request.imageBase64s.map((imageBase64) => {
    const imageUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;
    return {
      type: 'image_url' as const,
      image_url: { url: imageUrl },
    };
  });

  const messages = [
    {
      role: 'user' as const,
      content: [
        ...imageContents,
        {
          type: 'text' as const,
          text: prompt,
        },
      ],
    },
  ];

  try {
    // 使用流式响应
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || config.model,
        messages,
        temperature: 0.3,
        max_tokens: 65535,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = `提取样式失败: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      callbacks?.onError?.(error);
      throw new Error(error);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

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

    // 直接返回流式输出的完整内容，不进行JSON校验和解析
    const result: StyleExtractResult = {
      styleDescription: fullContent, // 直接使用完整的流式输出内容
      extractedStyle: {} // 保留结构，但不再解析
    };

    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    callbacks?.onError?.(errMsg);
    throw error;
  }
}
