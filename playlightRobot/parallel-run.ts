import { chromium } from 'playwright';
import path from 'path';

// ============ 配置区域 ============
const CONFIG = {
  numTabs: 5,                                    // 并行标签数量
  targetUrl: 'https://aippt.wps.cn/aippt/',    // 目标网址
  authFile: 'auth/auth.json',                   // 认证文件路径
  headless: false,                              // 是否显示浏览器窗口
  viewport: { width: 1280, height: 800 },      // 窗口大小
};

// ============ 自定义操作函数 ============
async function customActions(page: any, tabIndex: number) {
  // 在这里编写你想要执行的操作
  console.log(`[Tab ${tabIndex}] 开始执行操作...`);
  
  // 示例操作：
  // await page.waitForLoadState('networkidle');
  // await page.fill('#input-selector', `测试内容 ${tabIndex}`);
  // await page.click('#submit-button');
  
  // 等待页面加载完成
  await page.waitForLoadState('domcontentloaded');
  
  console.log(`[Tab ${tabIndex}] ✅ 操作完成`);
  
  return { tabIndex, status: 'success' };
}

// ============ 主执行函数 ============
async function runParallel() {
  console.log('🚀 启动并行执行模式...');
  console.log(`📊 配置: ${CONFIG.numTabs} 个标签 | URL: ${CONFIG.targetUrl}\n`);
  
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
  });
  
  const tasks = Array.from({ length: CONFIG.numTabs }, (_, i) => {
    return (async (tabIndex: number) => {
      try {
        // 创建独立上下文
        const context = await browser.newContext({
          storageState: path.join(__dirname, CONFIG.authFile),
          viewport: CONFIG.viewport,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });
        
        const page = await context.newPage();
        
        // 设置超时时间
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        
        // 打开目标网址
        console.log(`[Tab ${tabIndex}] 📖 正在打开页面...`);
        try {
          await page.goto(CONFIG.targetUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
          });
        } catch (gotoError: any) {
          console.error(`[Tab ${tabIndex}] ⚠️ 页面加载失败: ${gotoError.message}`);
          throw gotoError;
        }
        
        // 执行自定义操作
        const result = await customActions(page, tabIndex);
        
        return result;
      } catch (error: any) {
        console.error(`[Tab ${tabIndex}] ❌ 错误: ${error.message || error}`);
        return { tabIndex, status: 'failed', error: error.message };
      }
    })(i + 1);
  });
  
  // 并行执行所有任务
  const results = await Promise.all(tasks);
  
  // 输出结果摘要
  console.log('\n' + '='.repeat(50));
  console.log('📋 执行结果摘要:');
  results.forEach(r => {
    const icon = r.status === 'success' ? '✅' : '❌';
    console.log(`   ${icon} Tab ${r.tabIndex}: ${r.status}`);
  });
  console.log('='.repeat(50));
  
  console.log('\n💡 所有标签保持打开状态，按 Ctrl+C 关闭所有窗口');
  
  // 保持浏览器打开
  await new Promise(() => {});
}

// 启动
runParallel().catch(console.error);

