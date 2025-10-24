# 🎬 录制操作指南 - 用于并行执行

## 🚀 核心命令：保存脚本的关键参数

### Playwright Codegen 保存脚本的核心参数：

```bash
playwright codegen -o <输出文件> --target typescript
```

**参数说明：**
- `-o` 或 `--output`：指定输出文件路径（这是保存脚本的关键！）
- `--target`：代码格式（typescript, javascript, python 等）
- `--load-storage`：加载认证状态（使用已保存的登录）

---

## 📝 推荐的录制流程

### 方法 1：直接录制到文件（最简单）⭐

```bash
npm run record:url
```

这会：
1. 打开浏览器（带认证状态）
2. 自动访问目标网址
3. 录制你的操作
4. **自动保存到 `tests/recorded.spec.ts`**

### 方法 2：手动指定文件名

```bash
playwright codegen --load-storage=auth/auth.json -o tests/my-actions.spec.ts --target typescript https://aippt.wps.cn/aippt/
```

### 方法 3：可视化录制（复制代码）

```bash
npm run codegen
```

然后：
1. 在浏览器中执行操作
2. 在 Inspector 窗口中点击 **Copy** 按钮
3. 复制生成的代码

---

## 🎯 将录制的操作转换为并行执行格式

### 步骤 1：录制操作

```bash
npm run record:url
```

完成录制后，会生成 `tests/recorded.spec.ts` 文件，内容类似：

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://aippt.wps.cn/aippt/');
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill('人工智能的未来');
  await page.getByRole('button', { name: '生成' }).click();
  await page.waitForSelector('.result');
});
```

### 步骤 2：提取核心操作

从录制的文件中复制操作代码（去掉 `test` 和 `describe` 部分）：

```typescript
await page.goto('https://aippt.wps.cn/aippt/');
await page.getByRole('button', { name: '开始创作' }).click();
await page.getByPlaceholder('请输入主题').fill('人工智能的未来');
await page.getByRole('button', { name: '生成' }).click();
await page.waitForSelector('.result');
```

### 步骤 3：粘贴到 parallel-run.ts

打开 `parallel-run.ts`，找到 `customActions` 函数，粘贴进去：

```typescript
async function customActions(page: any, tabIndex: number) {
  console.log(`[Tab ${tabIndex}] 开始执行操作...`);
  
  // 粘贴录制的操作（去掉 page.goto，因为主函数已经打开了）
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill(`测试主题 ${tabIndex}`); // 可以根据 tabIndex 自定义
  await page.getByRole('button', { name: '生成' }).click();
  await page.waitForSelector('.result');
  
  console.log(`[Tab ${tabIndex}] ✅ 操作完成`);
  
  return { tabIndex, status: 'success' };
}
```

### 步骤 4：运行并行执行

```bash
npm start
```

5 个标签会同时执行相同的操作！

---

## 🛠️ 快捷命令汇总

| 命令 | 说明 | 保存到文件 |
|------|------|-----------|
| `npm run codegen` | 可视化录制（需手动复制） | ❌ 不自动保存 |
| `npm run record` | 录制并保存（不指定网址） | ✅ `tests/recorded.spec.ts` |
| `npm run record:url` | **推荐** 录制并保存（指定网址） | ✅ `tests/recorded.spec.ts` |
| `npm run record:no-auth` | 录制（无认证） | ✅ `tests/recorded.spec.ts` |

---

## 💡 高级技巧

### 技巧 1：录制时自定义输出文件名

```bash
playwright codegen --load-storage=auth/auth.json -o actions/my-workflow.ts --target typescript https://aippt.wps.cn/aippt/
```

### 技巧 2：录制并直接生成并行脚本

创建一个专门的模板：

```bash
# 录制到临时文件
npm run record:url

# 然后手动将操作复制到 parallel-run.ts
```

### 技巧 3：保留多个录制文件

```bash
# 录制工作流 A
playwright codegen --load-storage=auth/auth.json -o tests/workflow-a.spec.ts --target typescript https://aippt.wps.cn/aippt/

# 录制工作流 B
playwright codegen --load-storage=auth/auth.json -o tests/workflow-b.spec.ts --target typescript https://aippt.wps.cn/aippt/
```

---

## 🎨 完整工作流示例

### 场景：批量生成 AI PPT

#### 1. 录制一次操作

```bash
npm run record:url
```

在浏览器中：
1. 点击"开始创作"
2. 输入主题
3. 点击生成
4. 等待结果

#### 2. 查看生成的文件

```bash
# 查看录制的代码
cat tests/recorded.spec.ts
```

#### 3. 复制核心操作到 parallel-run.ts

```typescript
async function customActions(page: any, tabIndex: number) {
  // 主题列表
  const topics = [
    '人工智能的未来',
    '区块链技术应用',
    '绿色能源发展',
    '太空探索计划',
    '量子计算突破'
  ];
  
  const topic = topics[tabIndex - 1] || `主题 ${tabIndex}`;
  
  console.log(`[Tab ${tabIndex}] 生成主题: ${topic}`);
  
  // 粘贴录制的操作
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill(topic);
  await page.getByRole('button', { name: '生成' }).click();
  
  // 等待生成完成
  await page.waitForSelector('.result', { timeout: 120000 }); // 2分钟超时
  
  // 保存结果截图
  await page.screenshot({ path: `results/ppt-${tabIndex}-${Date.now()}.png` });
  
  console.log(`[Tab ${tabIndex}] ✅ 生成完成`);
  
  return { tabIndex, status: 'success', topic };
}
```

#### 4. 启动并行执行

```bash
npm start
```

5 个标签同时生成不同主题的 PPT！

---

## 📋 录制时的注意事项

### ✅ 推荐做法
1. **操作慢一些**：确保元素加载完成再操作
2. **使用稳定的选择器**：优先使用 role、label、text 等稳定选择器
3. **添加等待**：在关键操作后添加等待元素出现
4. **测试录制结果**：录制完后先单独运行一次验证

### ❌ 避免做法
1. 不要录制过快，容易遗漏加载时间
2. 不要依赖绝对坐标点击
3. 不要在网络不稳定时录制
4. 不要录制登录操作（已有认证状态）

---

## 🔍 选择器类型优先级

录制时 Playwright 会自动选择最佳选择器，优先级从高到低：

1. **Role + Name**（最推荐）
   ```typescript
   await page.getByRole('button', { name: '提交' }).click();
   ```

2. **Label**
   ```typescript
   await page.getByLabel('用户名').fill('test');
   ```

3. **Placeholder**
   ```typescript
   await page.getByPlaceholder('请输入内容').fill('test');
   ```

4. **Test ID**
   ```typescript
   await page.getByTestId('submit-button').click();
   ```

5. **CSS Selector**（最后选择）
   ```typescript
   await page.locator('#submit').click();
   ```

---

## 🎯 快速参考

### 保存脚本的完整命令格式

```bash
playwright codegen \
  --load-storage=auth/auth.json \        # 加载认证
  -o tests/output.spec.ts \               # 输出文件
  --target typescript \                   # 代码格式
  --viewport-size=1920,1080 \            # 窗口大小
  https://aippt.wps.cn/aippt/            # 目标网址
```

### 最简单的方式（推荐）⭐

```bash
# 1. 录制操作
npm run record:url

# 2. 打开录制文件，复制操作代码
# 3. 粘贴到 parallel-run.ts 的 customActions 函数
# 4. 运行
npm start
```

---

**开始录制：`npm run record:url`** 🎬

