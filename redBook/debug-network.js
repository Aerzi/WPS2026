// 网络请求调试助手 - 单独脚本用于测试
console.log('🔍 网络请求调试助手启动');

// 拦截所有fetch请求并记录
(function() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('🌐 Fetch请求:', args[0]);
        
        // 检查是否包含搜索相关的URL
        if (typeof args[0] === 'string') {
            if (args[0].includes('search') || 
                args[0].includes('notes') || 
                args[0].includes('api')) {
                console.log('🎯 可能的目标请求:', args[0]);
            }
        }
        
        return originalFetch.apply(this, args);
    };
})();

// 拦截所有XHR请求并记录
(function() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        console.log('🌐 XHR请求:', method, url);
        
        // 检查是否包含搜索相关的URL
        if (typeof url === 'string') {
            if (url.includes('search') || 
                url.includes('notes') || 
                url.includes('api')) {
                console.log('🎯 可能的目标请求:', method, url);
            }
        }
        
        return originalOpen.apply(this, [method, url, ...args]);
    };
})();

console.log('✅ 调试拦截器已设置，现在搜索任何内容查看网络请求');
