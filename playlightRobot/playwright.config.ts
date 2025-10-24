import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// 认证状态文件路径（包含 Cookies、LocalStorage 等）
const authFile = path.join(__dirname, 'auth/auth.json');

// 检查认证文件是否存在
const hasAuth = fs.existsSync(authFile);

if (!hasAuth) {
  console.log('⚠️  未检测到认证状态文件');
  console.log('💡 首次使用请先运行: npm run login');
  console.log('📝 这将保存你的登录状态，之后测试将自动使用登录态\n');
}

/**
 * Playwright 配置文件 - 自动加载认证状态
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* 最大测试运行时间 */
  timeout: 60 * 1000,
  
  /* 每个测试的期望超时时间 */
  expect: {
    timeout: 10000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: false, // 避免并发导致 cookies 冲突
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: 1, // 使用单个 worker 避免 cookies 冲突
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* 操作超时时间 */
    actionTimeout: 10000,
    
    /* 导航超时时间 */
    navigationTimeout: 30000,
    
    /* 自动加载认证状态 - Playwright 原生支持 */
    storageState: hasAuth ? authFile : undefined,
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* 录制时的慢动作 */
    // launchOptions: {
    //   slowMo: 100
    // }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // 如需测试其他浏览器，取消注释
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //   },
    // },

    // 移动端测试
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //   },
    // },
  ],
});

