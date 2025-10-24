# ⚡ 快速参考卡片

## 📋 核心工作流程（3 步完成）

```bash
# 1. 录制操作（自动保存到文件）
npm run record

# 2. 复制 tests/recorded.spec.ts 中的操作代码到 parallel-run.ts

# 3. 启动并行执行
npm start
```

---

## 🎯 关键 Playwright 命令

### 保存脚本的核心参数

```bash
playwright codegen -o <输出文件> --target typescript
```

### 完整录制命令示例

```bash
# 基础：录制并保存
playwright codegen -o tests/recorded.spec.ts --target typescript

# 带认证：使用登录状态录制
playwright codegen --load-storage=auth/auth.json -o tests/recorded.spec.ts --target typescript

# 完整版：指定网址
playwright codegen --load-storage=auth/auth.json -o tests/recorded.spec.ts --target typescript https://aippt.wps.cn/aippt/
```

### 重要参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `-o` 或 `--output` | **输出文件路径**（保存脚本的关键！） | `-o tests/my-script.spec.ts` |
| `--target` | 代码格式 | `--target typescript` |
| `--load-storage` | 加载认证状态 | `--load-storage=auth/auth.json` |
| `--save-storage` | 保存认证状态 | `--save-storage=auth/new.json` |
| `--viewport-size` | 窗口大小 | `--viewport-size=1920,1080` |
| `--device` | 模拟设备 | `--device="iPhone 13"` |

---

## 📦 项目预设命令

| 命令 | 功能 | 保存文件 |
|------|------|----------|
| `npm run record` | 🎬 **录制并保存**（推荐） | ✅ `tests/recorded.spec.ts` |
| `npm run codegen` | 👀 可视化录制（需手动复制） | ❌ 不保存 |
| `npm start` | 🚀 启动并行执行（5个标签） | - |
| `npm run login` | 🔐 保存登录状态 | ✅ `auth/auth.json` |

---

## 🔄 完整示例流程

### 场景：批量生成 5 个不同主题的 AI PPT

#### 1️⃣ 录制操作（一次）

```bash
npm run record
```

在浏览器中执行操作：
- 点击"开始创作"
- 输入主题
- 点击生成
- 关闭 Inspector 窗口（自动保存）

#### 2️⃣ 查看录制的文件

```bash
cat tests/recorded.spec.ts
```

你会看到：
```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://aippt.wps.cn/aippt/');
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill('我的主题');
  await page.getByRole('button', { name: '生成' }).click();
});
```

#### 3️⃣ 提取核心操作

复制这部分（去掉 test 包装和 goto）：
```typescript
await page.getByRole('button', { name: '开始创作' }).click();
await page.getByPlaceholder('请输入主题').fill('我的主题');
await page.getByRole('button', { name: '生成' }).click();
```

#### 4️⃣ 粘贴到 parallel-run.ts

编辑 `parallel-run.ts`：
```typescript
async function customActions(page: any, tabIndex: number) {
  // 定义 5 个不同的主题
  const topics = [
    '人工智能的未来',
    '区块链技术',
    '量子计算',
    '太空探索',
    '绿色能源'
  ];
  
  const topic = topics[tabIndex - 1];
  console.log(`[Tab ${tabIndex}] 生成主题: ${topic}`);
  
  // 粘贴录制的操作
  await page.getByRole('button', { name: '开始创作' }).click();
  await page.getByPlaceholder('请输入主题').fill(topic); // 使用不同主题
  await page.getByRole('button', { name: '生成' }).click();
  
  // 等待结果
  await page.waitForSelector('.result', { timeout: 120000 });
  
  // 可选：保存截图
  await page.screenshot({ path: `results/ppt-${tabIndex}.png` });
  
  console.log(`[Tab ${tabIndex}] ✅ 完成`);
  return { tabIndex, status: 'success', topic };
}
```

#### 5️⃣ 运行

```bash
npm start
```

5 个浏览器窗口同时打开，各自生成不同主题的 PPT！

---

## 🛠️ 常用选择器类型

录制时 Playwright 生成的选择器类型（从优到劣）：

```typescript
// 1. Role（最稳定，推荐）
await page.getByRole('button', { name: '提交' }).click();

// 2. Label
await page.getByLabel('用户名').fill('test');

// 3. Placeholder
await page.getByPlaceholder('请输入').fill('test');

// 4. Text
await page.getByText('点击这里').click();

// 5. Test ID
await page.getByTestId('submit-btn').click();

// 6. CSS Selector（最后选择）
await page.locator('#submit').click();
```

---

## 💡 高级技巧

### 自定义输出文件名

```bash
playwright codegen --load-storage=auth/auth.json -o actions/workflow-name.ts --target typescript https://your-url.com
```

### 录制多个不同的工作流

```bash
# 工作流 A
playwright codegen --load-storage=auth/auth.json -o tests/workflow-a.spec.ts --target typescript https://aippt.wps.cn/aippt/

# 工作流 B
playwright codegen --load-storage=auth/auth.json -o tests/workflow-b.spec.ts --target typescript https://aippt.wps.cn/aippt/
```

### 调试录制的脚本

```bash
# 单独运行录制的脚本测试
npx playwright test tests/recorded.spec.ts --headed

# 调试模式
npx playwright test tests/recorded.spec.ts --debug
```

---

## ⚠️ 注意事项

### 录制时
- ✅ 操作要慢，等待元素加载完成
- ✅ 使用稳定的选择器（role、label）
- ✅ 关键操作后添加等待
- ❌ 不要录制过快
- ❌ 不要录制登录操作（用 auth.json）

### 粘贴代码时
- ✅ 去掉 `page.goto()`（主函数已处理）
- ✅ 去掉 `test()` 和 `import` 语句
- ✅ 根据 `tabIndex` 自定义每个标签的行为
- ✅ 添加适当的超时时间

---

## 🆘 问题排查

| 问题 | 解决方案 |
|------|----------|
| 录制时连接被拒绝 | `npm run login` 重新保存认证 |
| 选择器找不到元素 | 使用 `npm run codegen` 重新获取选择器 |
| 并行执行部分失败 | 减少 `numTabs` 数量或增加超时时间 |
| 认证过期 | `npm run auth:clear` 然后 `npm run login` |

---

**快速开始：**
```bash
npm run record    # 录制
npm start         # 运行
```

🎉 就这么简单！

