# 认证状态管理

此目录用于存储 Playwright 测试的认证状态（Cookies、LocalStorage、SessionStorage 等）。

## 📁 文件说明

- `auth.json` - 保存的认证状态文件（自动生成，不会提交到 Git）

## 🚀 快速开始

### 1️⃣ 首次登录并保存认证状态

```bash
npm run login
```

这会打开浏览器，让你手动登录：
1. 在打开的浏览器中完成登录操作
2. 登录成功后，回到终端按回车键
3. 认证状态会自动保存到 `auth/auth.json`

### 2️⃣ 运行测试（自动使用登录态）

```bash
npm test
```

所有测试会自动使用保存的认证状态，无需重复登录。

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `npm run login` | 手动登录并保存认证状态 |
| `npm run auth:show` | 查看保存的认证信息统计 |
| `npm run auth:clear` | 清除保存的认证状态 |

## 🔧 工作原理

1. **保存认证**：使用 `context.storageState()` API 保存完整的浏览器状态
2. **自动加载**：在 `playwright.config.ts` 中配置 `storageState` 选项
3. **透明注入**：Playwright 自动将认证状态注入到每个测试上下文

## 💡 优势

- ✅ 使用 Playwright 原生 API，无需手动处理 Cookies
- ✅ 自动保存 Cookies、LocalStorage、SessionStorage 等所有状态
- ✅ 配置一次，所有测试自动使用
- ✅ 减少测试时间，避免重复登录
- ✅ 代码影响最小，测试文件无需修改

## 🔒 安全提醒

⚠️ **认证文件包含敏感信息，请勿提交到版本控制系统！**

`.gitignore` 已配置忽略此目录下的 JSON 文件，确保不会意外提交。

## 📖 参考文档

- [Playwright Authentication](https://playwright.dev/docs/auth)
- [Browser Context Storage State](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)

