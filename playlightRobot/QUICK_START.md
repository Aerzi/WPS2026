# 🚀 快速开始指南

## 三步完成登录状态管理

### 第一步：保存登录状态

```bash
npm run login
```

1. 浏览器会自动打开
2. 手动完成登录
3. 回到终端按回车键
4. ✅ 登录状态已保存！

### 第二步：编写测试

```typescript
// tests/my-test.spec.ts
import { test, expect } from '@playwright/test';

test('我的测试', async ({ page }) => {
  // 直接访问页面，已经是登录状态！
  await page.goto('https://example.com/dashboard');
  
  // 开始测试
  await expect(page.locator('.user-profile')).toBeVisible();
});
```

**就这么简单！** 无需任何额外代码，认证状态自动加载。

### 第三步：运行测试

```bash
npm test
```

## 📋 常用命令速查

| 命令 | 作用 |
|------|------|
| `npm run login` | 保存登录状态（首次必须） |
| `npm test` | 运行测试 |
| `npm run test:headed` | 有头模式运行 |
| `npm run test:debug` | 调试模式 |
| `npm run auth:show` | 查看认证信息 |
| `npm run auth:clear` | 清除认证状态 |

## ❓ 常见问题

### Q: 测试显示未登录？

A: 登录可能过期，重新运行：
```bash
npm run auth:clear
npm run login
```

### Q: 需要测试多个账号？

A: 保存多个认证文件：
```bash
# 保存管理员账号
npm run login  # 然后重命名为 auth/admin.json

# 在测试中指定
test.use({ storageState: 'auth/admin.json' });
```

### Q: 某些测试不需要登录？

A: 在测试中禁用认证：
```typescript
test.use({ storageState: undefined });
```

## 📚 更多文档

- 📖 [完整认证指南](docs/AUTH_GUIDE.md)
- 📖 [完整 README](README.md)
- 📖 [Auth 目录说明](auth/README.md)

## 🎯 核心优势

✅ **零侵入**：使用 Playwright 原生 API  
✅ **自动化**：一次配置，全局生效  
✅ **简洁**：测试代码无需关心认证  
✅ **安全**：认证文件自动忽略  

---

**开始你的自动化测试之旅吧！** 🎉

