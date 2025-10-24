import { test, expect } from '@playwright/test';

/**
 * 测试示例 - 自动使用保存的认证状态
 * 
 * 认证状态（Cookies、LocalStorage 等）会自动从 playwright.config.ts 加载
 * 无需手动处理，Playwright 会自动注入到每个测试的上下文中
 */
test.describe('AIPPT 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 直接访问页面，认证状态已自动加载
    await page.goto('https://aippt.wps.cn/aippt/');
  });

  test('验证已登录状态', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 这里添加你的测试逻辑
    // 例如：检查是否显示用户头像、用户名等
    console.log('📄 当前页面标题:', await page.title());
    console.log('🔗 当前页面 URL:', page.url());
    
    // 示例：验证页面标题
    await expect(page).toHaveTitle(/AIPPT/);
  });

  test('测试 AI 生成功能', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 这里添加你的测试步骤
    // 1. 输入主题
    // 2. 点击生成按钮
    // 3. 等待生成完成
    // 4. 验证结果
    
    console.log('✅ 测试在已登录状态下运行');
  });
});

