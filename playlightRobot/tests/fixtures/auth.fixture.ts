import { test as base } from '@playwright/test';

/**
 * 认证 Fixture（已弃用）
 * 
 * ⚠️ 注意：此文件已不再需要使用
 * 
 * 现在认证状态通过 playwright.config.ts 中的 storageState 自动加载
 * 你可以直接从 '@playwright/test' 导入 test，无需使用此 fixture
 * 
 * 使用步骤：
 * 1. 运行 npm run login 保存登录状态
 * 2. 在测试文件中直接使用：import { test, expect } from '@playwright/test';
 * 3. 认证状态会自动注入到所有测试中
 * 
 * 保留此文件仅供参考，如果你需要更高级的认证控制，可以参考这里的实现
 */

// 为了向后兼容，直接导出标准的 test
export const test = base;
export { expect } from '@playwright/test';

