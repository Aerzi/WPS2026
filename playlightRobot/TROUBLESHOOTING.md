# 🔧 常见问题解决方案

## ❌ ERR_CONNECTION_REFUSED 错误

### 问题描述
运行 `npm run login` 时出现：`net::ERR_CONNECTION_REFUSED`

### 已修复内容 ✅
1. **增加超时时间**：从默认 30 秒增加到 60 秒
2. **更好的错误处理**：即使页面加载失败也不会退出，可以手动输入网址
3. **浏览器参数优化**：添加了反检测和沙盒参数
4. **用户代理设置**：使用真实的浏览器 User-Agent

### 解决方案

#### 方案 1：自动重试（推荐）
现在直接重新运行即可，脚本会自动处理：
```bash
npm run login
```

#### 方案 2：手动导航
如果自动打开失败，脚本会保持浏览器打开，你可以：
1. 在打开的浏览器窗口中手动输入网址：`https://aippt.wps.cn/aippt/`
2. 完成登录操作
3. 回到终端按回车键保存认证

#### 方案 3：检查网络
- **检查网络连接**：确保能访问目标网站
- **测试访问**：在普通浏览器中打开 `https://aippt.wps.cn/aippt/`
- **关闭 VPN/代理**：某些代理可能导致连接问题
- **检查防火墙**：确保防火墙没有阻止连接

### 其他可能的原因

#### 1. 网站临时不可用
```bash
# 等待几分钟后重试
npm run login
```

#### 2. DNS 解析问题
```bash
# Windows 刷新 DNS
ipconfig /flushdns

# 然后重试
npm run login
```

#### 3. 代理设置问题
```bash
# 检查系统代理设置
# Windows: 设置 -> 网络和 Internet -> 代理
```

---

## 🔐 认证相关问题

### 问题：提示找不到认证文件
**解决**：先运行 `npm run login` 保存认证状态

### 问题：认证已过期
**解决**：
```bash
npm run auth:clear   # 清除旧认证
npm run login        # 重新登录
```

### 问题：想查看当前认证状态
**解决**：
```bash
npm run auth:show
```

---

## 🌐 并行执行问题

### 问题：某些标签执行失败
**原因**：
- 网络不稳定
- 并发数太多
- 服务器限流

**解决**：
1. 减少并发标签数（编辑 `parallel-run.ts` 中的 `numTabs`）
2. 检查网络连接
3. 增加延迟时间

### 问题：所有标签都失败
**解决**：
1. 先测试单个标签：修改 `numTabs: 1`
2. 检查认证是否有效：`npm run auth:show`
3. 检查目标网址是否可访问

---

## 💻 开发环境问题

### 问题：TypeScript 编译错误
**解决**：
```bash
npm install  # 重新安装依赖
```

### 问题：浏览器未安装
**解决**：
```bash
npm run install:browsers
```

---

## 📞 仍然无法解决？

1. 查看详细错误日志
2. 检查 `midscene_run/log/` 目录下的日志文件
3. 确保所有依赖已正确安装：`npm install`
4. 尝试更新依赖：`npm update`

---

## 🎯 快速诊断命令

```bash
# 1. 检查认证状态
npm run auth:show

# 2. 清除并重新登录
npm run auth:clear && npm run login

# 3. 测试单个标签执行
# 修改 parallel-run.ts: numTabs: 1
npm start
```

