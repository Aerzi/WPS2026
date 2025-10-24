# Playwright Robot - 操作录制与自动化测试

一个基于 Playwright 的自动化测试项目，支持操作录制、脚本生成和**登录状态保存**。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装浏览器

```bash
npm run install:browsers
```

或者使用：

```bash
npx playwright install
```

### 3. 保存登录状态（重要！⭐）

**首次使用前，先保存你的登录状态，这样以后就不用重复登录了！**

```bash
npm run login
```

这个命令会：
1. 打开浏览器访问登录页面
2. 让你手动完成登录
3. 登录完成后，回到终端按回车键
4. 自动保存登录状态（Cookies + LocalStorage 等）
5. 之后所有测试都会自动使用这个登录状态

认证状态保存在 `auth/auth.json` 文件中（已在 `.gitignore` 中，不会泄露）

> 💡 使用 Playwright 原生 `storageState` API，自动加载，无需手动处理！

## 🎬 录制操作

### 方式一：使用登录状态录制（推荐）⭐

**在已登录状态下录制操作：**

```bash
npm run codegen:auth
```

这会加载你之前保存的登录状态，直接在登录后的页面录制操作，无需重新登录！

### 方式二：基础录制

启动 Playwright Inspector 并开始录制：

```bash
npm run codegen
```

然后在打开的浏览器中输入你要测试的网址，Playwright 会自动录制你的操作。

### 方式三：带登录状态录制到文件

将录制的操作直接保存为 TypeScript 测试文件（使用已保存的登录状态）：

```bash
npm run record:auth
```

这会将录制的测试保存到 `tests/recorded.spec.ts`，并且自动使用你的登录状态。

### 方式四：录制到文件（不使用登录）

```bash
npm run record:ts
```

### 方式五：指定网址录制（带登录）

直接打开指定网址开始录制（使用登录状态）：

```bash
npx playwright codegen --load-storage=auth/user.json https://aippt.wps.cn/aippt/
```

### 方式六：指定浏览器录制

在特定浏览器中录制（如 Chrome）：

```bash
npx playwright codegen --browser chromium --load-storage=auth/user.json
```

支持的浏览器：`chromium`, `firefox`, `webkit`

### 方式七：模拟移动设备

模拟移动设备进行录制：

```bash
npx playwright codegen --device="iPhone 13" --load-storage=auth/user.json
```

### 方式八：设置视口大小

自定义浏览器窗口大小：

```bash
npx playwright codegen --load-storage=auth/user.json --viewport-size=2181,1352 https://aippt.wps.cn/aippt/
```

## 🎯 录制操作步骤

1. 运行录制命令（如 `npm run codegen`）
2. 会打开两个窗口：
   - **浏览器窗口** - 在这里执行你的操作
   - **Playwright Inspector** - 显示生成的代码
3. 在浏览器中进行操作（点击、输入、导航等）
4. 查看 Inspector 中生成的代码
5. 点击 **Record** 按钮可以暂停/继续录制
6. 点击 **Copy** 按钮复制生成的代码
7. 将代码粘贴到测试文件中

## 📝 运行测试

### 运行所有测试

```bash
npm test
```

### 带界面运行测试

```bash
npm run test:headed
```

### 调试模式

```bash
npm run test:debug
```

### UI 模式（交互式）

```bash
npm run test:ui
```

推荐使用 UI 模式，可以可视化地查看测试执行过程。

### 运行指定测试文件

```bash
npx playwright test tests/recorded.spec.ts
```

### 运行指定测试用例

```bash
npx playwright test --grep "测试用例名称"
```

## 📊 查看测试报告

```bash
npm run report
```

会自动打开 HTML 报告，显示测试结果、截图、视频等。

## 🔐 登录状态管理

### 保存登录状态

```bash
npm run login
```

这会打开浏览器，让你手动登录，然后保存完整的认证状态到 `auth/auth.json`。

### 查看保存的认证信息

```bash
npm run auth:show
```

这会显示当前保存的 Cookies 和 LocalStorage 数量。

### 清除认证状态

如果需要重新登录或清除当前认证状态：

```bash
npm run auth:clear
```

然后重新运行 `npm run login` 来保存新的认证状态。

### 认证文件说明

- **文件位置**: `auth/auth.json`
- **包含内容**: 
  - Cookies（会话信息、登录令牌等）
  - LocalStorage（本地存储数据）
  - SessionStorage（会话存储数据）
- **安全性**: 已在 `.gitignore` 中，不会被提交到 Git
- **有效期**: 取决于网站的会话设置，通常几天到几周
- **工作原理**: 通过 `playwright.config.ts` 中的 `storageState` 自动加载到所有测试

## 📁 项目结构

```
playlightRobot/
├── auth/                      # 认证状态目录
│   ├── auth.json             # 保存的认证状态（自动生成，不提交到 Git）
│   └── README.md             # 认证管理说明
├── scripts/                  # 脚本目录
│   └── save-auth.ts          # 登录状态保存脚本
├── docs/                     # 文档目录
│   └── AUTH_GUIDE.md         # 认证管理完整指南
├── tests/                    # 测试文件目录
│   ├── fixtures/            # Fixtures 目录
│   │   └── auth.fixture.ts  # 认证 fixture（可选）
│   ├── example.spec.ts      # 示例测试（自动使用认证状态）
│   └── recorded.spec.ts     # 录制的测试文件（运行 record 命令后生成）
├── playwright-report/        # 测试报告目录（自动生成）
├── test-results/            # 测试结果目录（自动生成）
├── package.json             # 项目依赖和脚本
├── playwright.config.ts     # Playwright 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目文档
```

## 🔧 高级录制选项

### 使用已保存的认证状态

使用 `npm run login` 保存的认证状态：

```bash
# 带登录状态录制
npx playwright codegen --load-storage=auth/user.json https://aippt.wps.cn/aippt/

# 或使用快捷命令
npm run codegen:auth
```

### 录制时保存新的认证状态

```bash
# 录制并保存新的认证状态
npx playwright codegen --save-storage=auth/user.json https://example.com
```

### 设置请求头

```bash
npx playwright codegen --add-init-script="() => { window.localStorage.setItem('token', 'your-token'); }"
```

### 自定义用户代理

```bash
npx playwright codegen --user-agent="Mozilla/5.0 Custom Agent"
```

## 📖 常用测试代码模板

### 标准写法（推荐）⭐

认证状态会自动加载，无需手动处理！参考 `tests/example.spec.ts`：

```typescript
import { test, expect } from '@playwright/test';

test.describe('我的测试', () => {
  test.beforeEach(async ({ page }) => {
    // 直接访问页面，认证状态已自动加载
    await page.goto('https://aippt.wps.cn/aippt/');
  });

  test('你的测试用例', async ({ page }) => {
    // 测试会在已登录状态下运行，无需额外代码！
    await expect(page).toHaveTitle(/AIPPT/);
  });
});
```

**工作原理**：
- 认证状态通过 `playwright.config.ts` 中的 `storageState` 自动加载
- Playwright 自动将 Cookies、LocalStorage 注入到每个测试上下文
- 无需手动处理，代码更简洁！

### 不带登录态的测试

如果某些测试需要在未登录状态下运行：

```typescript
test.use({ storageState: undefined });

test('未登录用户测试', async ({ page }) => {
  await page.goto('https://example.com');
  // 这个测试不会加载认证状态
});
```

## 🛠️ 配置说明

### `playwright.config.ts`

主要配置项：

- `timeout`: 测试总超时时间（默认 60 秒）
- `expect.timeout`: 断言超时时间（默认 10 秒）
- `actionTimeout`: 操作超时时间（默认 10 秒）
- `navigationTimeout`: 页面导航超时时间（默认 30 秒）
- `trace`: 跟踪记录（失败时自动记录）
- `screenshot`: 截图（失败时自动截图）
- `video`: 视频录制（失败时保留）

## 💡 小贴士

1. **认证状态管理**：⭐
   - 首次使用先运行 `npm run login` 保存认证状态
   - 测试会自动加载认证状态，无需手动处理
   - 如果登录过期，运行 `npm run auth:clear` 后重新登录
   - 认证文件 `auth/auth.json` 已被 `.gitignore`，不会泄露
   - 可以用 `npm run auth:show` 查看保存的认证信息
   - 详细文档：查看 `docs/AUTH_GUIDE.md`

2. **录制质量提升**：
   - 录制时操作尽量慢一些，确保页面元素加载完成
   - 使用明确的选择器（ID、data-testid 等）
   - 录制后手动优化生成的代码
   - 使用已登录状态录制可以跳过登录流程

3. **调试技巧**：
   - 使用 `npm run test:debug` 逐步调试
   - 使用 `await page.pause()` 在代码中暂停
   - 使用 Playwright Inspector 查看元素选择器
   - 测试会自动使用保存的登录状态

4. **性能优化**：
   - 只在必要时录制视频
   - 使用 headless 模式运行测试（默认）
   - 合理设置超时时间
   - 保存登录状态避免每次都重复登录

5. **录制建议**：
   - 一个测试只测试一个功能点
   - 给测试用例起有意义的名称
   - 添加适当的等待和断言
   - 需要登录的操作使用带 auth 的命令

## 📚 参考资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright 中文文档](https://playwright.dev/docs/intro)
- [Codegen 录制工具](https://playwright.dev/docs/codegen-intro)
- [测试最佳实践](https://playwright.dev/docs/best-practices)

## 🤝 技术支持

如有问题，请参考：
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

