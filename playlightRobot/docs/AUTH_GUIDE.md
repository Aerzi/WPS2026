# Playwright 认证状态管理指南

## 📖 概述

本项目使用 Playwright 原生的 `storageState` API 来管理登录状态，实现一次登录、多次使用的测试体验。

## 🎯 设计原则

1. **最小侵入性**：使用 Playwright 原生 API，无需修改测试代码
2. **自动化优先**：配置一次，所有测试自动获得登录态
3. **安全第一**：认证文件自动忽略，不会提交到版本控制

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────┐
│                   npm run login                     │
│              (scripts/save-auth.ts)                 │
│  手动登录一次，保存认证状态到 auth/auth.json       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ auth/auth.json  │
         │   - Cookies     │
         │   - LocalStorage│
         │   - SessionStorage
         └────────┬────────┘
                  │
                  │ 自动加载
                  │
                  ▼
      ┌───────────────────────┐
      │ playwright.config.ts  │
      │   storageState: ...   │
      └──────────┬────────────┘
                 │
                 │ 注入到每个测试
                 │
                 ▼
      ┌──────────────────────┐
      │   测试文件            │
      │   (*.spec.ts)        │
      │   自动携带登录态      │
      └──────────────────────┘
```

## 🚀 使用流程

### 第一步：首次登录

```bash
npm run login
```

执行流程：
1. 启动浏览器（有头模式）
2. 打开登录页面
3. 手动完成登录操作
4. 按回车键保存认证状态
5. 认证状态保存到 `auth/auth.json`

### 第二步：运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试（有头模式）
npm run test:headed

# 调试模式
npm run test:debug

# UI 模式
npm run test:ui
```

所有测试会自动使用保存的登录态，无需任何额外代码。

## 📝 测试代码示例

### ✅ 正确写法（推荐）

```typescript
import { test, expect } from '@playwright/test';

test('测试已登录功能', async ({ page }) => {
  // 直接访问需要登录的页面
  // 认证状态已自动加载，无需手动处理
  await page.goto('https://example.com/dashboard');
  
  // 开始你的测试
  await expect(page.locator('.user-profile')).toBeVisible();
});
```

### ❌ 错误写法（不推荐）

```typescript
// ❌ 不要手动加载 cookies
test.beforeEach(async ({ context }) => {
  const cookies = JSON.parse(fs.readFileSync('auth/cookies.json'));
  await context.addCookies(cookies); // 不需要！
});

// ❌ 不要使用自定义 fixture
import { test } from './fixtures/auth.fixture'; // 不需要！
```

## 🛠️ 核心文件说明

### 1. `scripts/save-auth.ts`

登录脚本，用于保存认证状态。

**关键 API：**
```typescript
// 保存完整的浏览器状态
await context.storageState({ path: AUTH_FILE });
```

### 2. `playwright.config.ts`

配置文件，自动加载认证状态。

**关键配置：**
```typescript
export default defineConfig({
  use: {
    // 自动加载认证状态
    storageState: hasAuth ? authFile : undefined,
  },
});
```

### 3. 测试文件

无需任何特殊处理，直接编写测试即可。

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `npm run login` | 手动登录并保存认证状态 |
| `npm test` | 运行测试（自动使用登录态） |
| `npm run test:headed` | 有头模式运行测试 |
| `npm run test:debug` | 调试模式运行测试 |
| `npm run test:ui` | UI 模式运行测试 |
| `npm run auth:show` | 查看认证信息统计 |
| `npm run auth:clear` | 清除认证状态 |

## 🔧 工作原理

### storageState 包含什么？

```json
{
  "cookies": [
    {
      "name": "session_id",
      "value": "abc123...",
      "domain": ".example.com",
      "path": "/",
      "expires": 1234567890,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://example.com",
      "localStorage": [
        {
          "name": "user_token",
          "value": "xyz789..."
        }
      ]
    }
  ]
}
```

### 加载时机

1. **测试启动时**：Playwright 读取 `playwright.config.ts` 配置
2. **创建上下文时**：自动将 `storageState` 注入到浏览器上下文
3. **访问页面时**：Cookies 和 LocalStorage 已经存在

## 🎨 高级用法

### 场景 1：多账号测试

如果需要测试多个账号，可以保存多个认证文件：

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'admin-user',
      use: {
        storageState: 'auth/admin.json',
      },
    },
    {
      name: 'regular-user',
      use: {
        storageState: 'auth/user.json',
      },
    },
  ],
});
```

### 场景 2：动态选择认证

```typescript
// 测试文件中
test.use({
  storageState: process.env.USER_TYPE === 'admin' 
    ? 'auth/admin.json' 
    : 'auth/user.json'
});
```

### 场景 3：测试中更新认证状态

```typescript
test('登出后重新登录', async ({ page, context }) => {
  await page.goto('/logout');
  
  // 清除当前认证
  await context.clearCookies();
  
  // 重新登录
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('#login-btn');
  
  // 可选：保存新的认证状态
  await context.storageState({ path: 'auth/new-auth.json' });
});
```

## 🔒 安全最佳实践

### 1. 不要提交认证文件

`.gitignore` 已配置：
```gitignore
/auth/*.json
auth.json
*.auth.json
cookies.json
```

### 2. 在 CI/CD 中使用

```yaml
# GitHub Actions 示例
- name: 准备认证状态
  run: |
    mkdir -p auth
    echo '${{ secrets.AUTH_STATE }}' > auth/auth.json

- name: 运行测试
  run: npm test
```

### 3. 定期更新认证

登录态可能会过期，建议：
- 每天/每周重新运行 `npm run login`
- 或在 CI/CD 中使用长期有效的测试账号

## 🐛 故障排除

### 问题 1：测试显示未登录

**原因**：认证状态可能已过期

**解决**：重新运行登录
```bash
npm run auth:clear
npm run login
```

### 问题 2：某些测试需要新登录

**原因**：测试修改了登录状态（如登出）

**解决**：使用独立的浏览器上下文
```typescript
test('需要独立登录的测试', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'auth/auth.json'
  });
  const page = await context.newPage();
  // ... 测试代码
  await context.close();
});
```

### 问题 3：无法找到 auth.json

**原因**：还没有运行登录脚本

**解决**：
```bash
npm run login
```

## 📚 参考资料

- [Playwright Authentication 官方文档](https://playwright.dev/docs/auth)
- [Browser Context Storage State API](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

## 💡 最佳实践总结

1. ✅ **使用原生 API**：`storageState` 比手动处理 Cookies 更可靠
2. ✅ **集中配置**：在 `playwright.config.ts` 中统一管理
3. ✅ **保持简洁**：测试代码无需关心认证细节
4. ✅ **安全第一**：永远不要提交认证文件到版本控制
5. ✅ **定期维护**：认证过期时及时更新

## 🎉 收益

- ⚡ **提升效率**：避免每个测试都登录，节省时间
- 🔧 **减少维护**：认证逻辑集中管理，易于维护
- 🐛 **降低风险**：使用稳定的原生 API，减少出错
- 📈 **易于扩展**：支持多账号、多环境等高级场景

