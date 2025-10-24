# 🚀 并行执行快速启动

一条命令启动多个浏览器标签，并行执行相同操作，实时查看结果。

## ⚡ 快速开始

### 1️⃣ 确保已登录（首次使用）

```bash
npm run login
```

这会保存你的登录状态，之后所有标签都会自动使用这个认证。

### 2️⃣ 启动并行执行

```bash
npm start
```

就这么简单！会自动打开 5 个浏览器窗口并行执行操作。

---

## 🎛️ 自定义配置

编辑 `parallel-run.ts` 文件顶部的配置区域：

```typescript
const CONFIG = {
  numTabs: 5,                                   // 🔢 标签数量（改成你需要的数量）
  targetUrl: 'https://aippt.wps.cn/aippt/',   // 🌐 目标网址
  authFile: 'auth/auth.json',                  // 🔐 认证文件
  headless: false,                             // 👁️ 是否显示窗口（改成 true 后台运行）
  viewport: { width: 1280, height: 800 },     // 📐 窗口大小
};
```

---

## ✍️ 自定义操作

在 `parallel-run.ts` 中找到 `customActions` 函数，添加你想要执行的操作：

```typescript
async function customActions(page: any, tabIndex: number) {
  // 示例：等待页面加载
  await page.waitForLoadState('networkidle');
  
  // 示例：输入文本（每个标签输入不同内容）
  await page.fill('#input-selector', `我的内容 ${tabIndex}`);
  
  // 示例：点击按钮
  await page.click('#submit-button');
  
  // 示例：等待结果
  await page.waitForSelector('.result');
  
  // 示例：获取结果文本
  const result = await page.textContent('.result');
  console.log(`[Tab ${tabIndex}] 结果: ${result}`);
  
  return { tabIndex, status: 'success', result };
}
```

### 💡 常用操作

| 操作 | 代码 |
|------|------|
| 点击元素 | `await page.click('selector');` |
| 输入文本 | `await page.fill('selector', 'text');` |
| 等待元素 | `await page.waitForSelector('selector');` |
| 获取文本 | `const text = await page.textContent('selector');` |
| 截图保存 | `await page.screenshot({ path: \`tab-\${tabIndex}.png\` });` |
| 执行JS代码 | `await page.evaluate(() => { /* JS代码 */ });` |

---

## 🎯 使用场景

- ✅ 批量测试不同输入参数的结果
- ✅ 并行生成多个 AI 内容
- ✅ 同时对比多个配置的效果
- ✅ 压力测试网站并发性能
- ✅ 批量数据采集和处理

---

## 🎬 录制操作（重要！）

### 推荐流程：录制 → 复制 → 粘贴 → 运行

#### 第 1 步：录制操作并保存为脚本

```bash
npm run record
```

这会：
1. 打开浏览器（自动加载登录状态）
2. 打开目标网址
3. 你在浏览器中执行的所有操作都会被录制
4. **自动保存到 `tests/recorded.spec.ts` 文件**

#### 第 2 步：复制录制的操作代码

录制完成后，打开 `tests/recorded.spec.ts`，你会看到类似这样的代码：

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://aippt.wps.cn/aippt/');
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill('人工智能');
  await page.getByRole('button', { name: '生成' }).click();
});
```

**复制操作部分**（去掉 test 包装和 page.goto）：
```typescript
await page.getByRole('button', { name: '开始创作' }).click();
await page.getByPlaceholder('请输入主题').fill('人工智能');
await page.getByRole('button', { name: '生成' }).click();
```

#### 第 3 步：粘贴到 parallel-run.ts

打开 `parallel-run.ts`，找到 `customActions` 函数，粘贴你的操作：

```typescript
async function customActions(page: any, tabIndex: number) {
  console.log(`[Tab ${tabIndex}] 开始执行操作...`);
  
  // 粘贴你录制的操作（去掉 page.goto）
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill(`主题 ${tabIndex}`); // 可自定义每个标签的内容
  await page.getByRole('button', { name: '生成' }).click();
  
  console.log(`[Tab ${tabIndex}] ✅ 操作完成`);
  return { tabIndex, status: 'success' };
}
```

#### 第 4 步：运行并行执行

```bash
npm start
```

5 个标签同时执行你录制的操作！🎉

---

## 🔍 查找元素选择器

如果只是想查看选择器（不保存）：

```bash
npm run codegen
```

在打开的浏览器中点击你想要操作的元素，右侧会自动显示选择器代码。

---

## 🛠️ 进阶技巧

### 技巧1：每个标签执行不同操作

```typescript
async function customActions(page: any, tabIndex: number) {
  // 根据标签编号执行不同操作
  if (tabIndex === 1) {
    await page.click('#option-A');
  } else if (tabIndex === 2) {
    await page.click('#option-B');
  } else {
    await page.click('#option-C');
  }
}
```

### 技巧2：从数组读取不同的输入

```typescript
const inputs = ['内容1', '内容2', '内容3', '内容4', '内容5'];

async function customActions(page: any, tabIndex: number) {
  const input = inputs[tabIndex - 1];
  await page.fill('#input', input);
  await page.click('#submit');
}
```

### 技巧3：保存每个标签的结果

```typescript
async function customActions(page: any, tabIndex: number) {
  // 执行操作...
  
  // 截图保存
  await page.screenshot({ path: `results/tab-${tabIndex}.png` });
  
  // 保存页面内容
  const content = await page.content();
  require('fs').writeFileSync(`results/tab-${tabIndex}.html`, content);
}
```

---

## ⚠️ 注意事项

1. **资源占用**：每个标签会占用一定内存，建议同时不超过 10 个
2. **网站限制**：注意目标网站的并发限制，避免被封禁
3. **认证过期**：如果认证过期，重新运行 `npm run login`
4. **关闭窗口**：执行完成后按 `Ctrl+C` 关闭所有窗口

---

## 📚 相关命令

| 命令 | 说明 |
|------|------|
| `npm start` | 🚀 启动并行执行 |
| `npm run login` | 🔐 保存登录状态 |
| `npm run codegen` | 🎬 打开录制工具 |
| `npm run auth:show` | 📊 查看认证状态 |
| `npm run auth:clear` | 🗑️ 清除认证状态 |

---

## 💬 问题排查

**Q: 提示找不到认证文件？**  
A: 先运行 `npm run login` 保存登录状态

**Q: 某些标签执行失败？**  
A: 检查网络连接，或者减少并发标签数量

**Q: 想要后台运行不显示窗口？**  
A: 修改配置 `headless: true`

**Q: 如何找到正确的选择器？**  
A: 运行 `npm run codegen` 使用可视化工具

---

**开始使用：`npm start`** 🎉

