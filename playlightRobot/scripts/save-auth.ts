import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import path from 'path';
import fs from 'fs';

/**
 * 手动登录脚本 - 保存认证状态（Cookies + LocalStorage）
 * 
 * 使用方法：
 * 1. 运行 npm run login
 * 2. 在打开的浏览器中完成登录
 * 3. 登录成功后，按回车键保存认证状态
 * 4. 之后的测试将自动使用保存的认证状态
 */

const AUTH_FILE = path.join(__dirname, '../auth/auth.json');
const LOGIN_URL = 'https://aippt.wps.cn/aippt/';

async function saveAuthState() {
  console.log('🚀 启动浏览器，准备登录...\n');
  
  // 启动浏览器（有头模式）
  const browser: Browser = await chromium.launch({
    headless: false,
    slowMo: 100,
    args: [
      '--disable-blink-features=AutomationControlled', // 避免被检测为自动化
      '--no-sandbox',
    ],
  });

  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page: Page = await context.newPage();
  
  // 设置更长的超时时间
  page.setDefaultTimeout(60000); // 60秒
  page.setDefaultNavigationTimeout(60000);

  try {
    // 打开登录页面
    console.log(`📄 正在打开页面: ${LOGIN_URL}`);
    console.log('⏳ 请稍候，正在连接...\n');
    
    try {
      await page.goto(LOGIN_URL, {
        waitUntil: 'domcontentloaded', // 只等待 DOM 加载，不等待所有资源
        timeout: 60000,
      });
      console.log('✅ 页面加载成功！\n');
    } catch (gotoError: any) {
      console.error('❌ 无法访问页面，可能的原因：');
      console.error('   1. 网络连接问题 - 请检查网络');
      console.error('   2. 网站无法访问 - 请在浏览器中手动访问测试');
      console.error('   3. 防火墙/代理问题 - 请检查代理设置');
      console.error('   4. VPN/网络代理 - 尝试关闭或切换\n');
      console.error('错误详情:', gotoError.message);
      
      console.log('\n💡 解决方案：');
      console.log('   方式1: 手动在浏览器中输入网址并登录');
      console.log('   方式2: 检查网络后重新运行 npm run login\n');
      
      // 不立即退出，给用户手动导航的机会
      console.log('🔧 浏览器将保持打开，你可以：');
      console.log('   1. 在打开的浏览器窗口中手动输入网址');
      console.log('   2. 完成登录');
      console.log('   3. 回到终端按回车键继续\n');
    }
    
    console.log('📝 请在浏览器中完成登录操作...');
    console.log('💡 提示：');
    console.log('   1. 如果页面未自动打开，请手动输入网址');
    console.log('   2. 请手动登录到你的账号');
    console.log('   3. 登录成功后，确保你已经到达登录后的页面');
    console.log('   4. 登录完成后，回到终端按回车键继续\n');
    
    // 等待用户手动登录
    await waitForUserInput();
    
    // 确保 auth 目录存在
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // 保存认证状态（包括 cookies, localStorage, sessionStorage）
    console.log('\n💾 正在保存认证状态...');
    await context.storageState({ path: AUTH_FILE });
    
    console.log(`✅ 认证状态已保存到: ${AUTH_FILE}`);
    
    // 验证保存的内容
    const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    console.log(`\n📊 保存统计：`);
    console.log(`   - Cookies: ${authData.cookies?.length || 0} 个`);
    console.log(`   - LocalStorage: ${authData.origins?.reduce((sum: number, o: any) => sum + (o.localStorage?.length || 0), 0) || 0} 项`);
    
    console.log('\n🎉 认证状态保存成功！');
    console.log('💡 现在你可以运行测试了：npm test');
    console.log('💡 测试将自动使用保存的认证状态，无需重复登录\n');
    
  } catch (error) {
    console.error('\n❌ 保存认证状态时出错:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

/**
 * 等待用户在终端输入
 */
function waitForUserInput(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    const listener = (key: string) => {
      // 按回车键 (Enter)
      if (key === '\r' || key === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', listener);
        console.log('');
        resolve();
      }
      // 按 Ctrl+C 退出
      if (key === '\u0003') {
        console.log('\n\n❌ 已取消操作');
        process.exit(0);
      }
    };
    
    process.stdin.on('data', listener);
  });
}

// 运行脚本
saveAuthState().catch((error) => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});

