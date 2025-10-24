// 小红书帖子数据采集内容脚本 - 简化版API拦截
(function() {
    'use strict';

    console.log('小红书数据采集器已加载 - 专注API拦截模式');

    // 存储采集到的数据和分页信息
    let collectedData = [];
    let currentPage = 1;  // 当前页数
    let currentKeyword = ''; // 当前搜索关键词
    let currentSearchId = ''; // 用于保持同一次搜索的search_id一致
    let followMode = false; // 跟随模式开关
    let lastApiUrl = ''; // 记录上次API的URL
    let isAutoRequesting = false; // 标记是否正在自动请求中，避免重复触发

    // 检测页面是否为小红书页面
    function isXiaohongshuPage() {
        return window.location.hostname === 'www.xiaohongshu.com';
    }

    // 拦截fetch请求
    function interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const url = args[0];
            const options = args[1] || {};
            
            // 记录所有请求用于调试
            console.log('🌐 所有fetch请求:', url);
            
            // 专门拦截小红书搜索API - 精确匹配检测到的URL
            if (typeof url === 'string' && 
                (url.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes') || 
                 url.includes('api/sns/web/v1/search/notes'))) {
                console.log('🎯 拦截到目标API请求:', url);
                
                // 尝试解析请求参数获取page
                let requestPage = 1;
                try {
                    if (options.body) {
                        const bodyData = JSON.parse(options.body);
                        requestPage = bodyData.page || 1;
                        console.log('📄 拦截到的请求页码:', requestPage);
                        
                        // 保存相关信息
                        currentPage = requestPage;
                        if (bodyData.keyword) currentKeyword = bodyData.keyword;
                        if (bodyData.search_id) currentSearchId = bodyData.search_id;
                    }
                } catch (e) {
                    console.log('⚠️ 解析请求体失败:', e);
                }
                
                return originalFetch.apply(this, args).then(response => {
                    // 克隆响应以便我们可以读取它
                    const clonedResponse = response.clone();
                    
                    clonedResponse.json().then(data => {
                        console.log('📡 API响应数据:', data);
                        if (data && data.data && data.data.items) {
                            console.log(`📊 发现 ${data.data.items.length} 个帖子 (第${requestPage}页)`);
                            processApiData(data.data.items);
                            
                            // 跟随模式的逻辑移除，避免无限循环
                            // 只在非自动请求状态下才记录
                        } else {
                            console.log('❌ API响应格式不符合预期:', data);
                        }
                    }).catch(error => {
                        console.error('❌ 解析API响应失败:', error);
                    });
                    
                    return response;
                });
            }
            
            return originalFetch.apply(this, args);
        };
        
        console.log('✅ Fetch拦截器已设置');
    }

    // 拦截XMLHttpRequest
    function interceptXHR() {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            
            // 记录所有XHR请求用于调试
            console.log('🌐 所有XHR请求:', method, url);
            
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            
            if (this._url && (
                this._url.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes') || 
                this._url.includes('api/sns/web/v1/search/notes'))) {
                console.log('🎯 XHR拦截到目标API请求:', this._url);
                
                // 尝试解析请求参数获取page
                let requestPage = 1;
                try {
                    if (body) {
                        const bodyData = JSON.parse(body);
                        requestPage = bodyData.page || 1;
                        console.log('📄 拦截到的请求页码:', requestPage);
                        
                        // 保存相关信息
                        currentPage = requestPage;
                        if (bodyData.keyword) currentKeyword = bodyData.keyword;
                        if (bodyData.search_id) currentSearchId = bodyData.search_id;
                    }
                } catch (e) {
                    console.log('⚠️ 解析请求体失败:', e);
                }
                
                this.addEventListener('load', function() {
                    if (this.status === 200) {
                        try {
                            const data = JSON.parse(this.responseText);
                            console.log('📡 XHR API响应数据:', data);
                            if (data && data.data && data.data.items) {
                                console.log(`📊 发现 ${data.data.items.length} 个帖子 (第${requestPage}页)`);
                                processApiData(data.data.items);
                                
                                // 跟随模式的逻辑移除，避免无限循环
                            }
                        } catch (error) {
                            console.error('❌ 解析XHR响应失败:', error);
                        }
                    }
                });
            }
            
            return originalXHRSend.apply(this, arguments);
        };
        
        console.log('✅ XHR拦截器已设置');
    }

    // 添加网络监听器
    function addNetworkListener() {
        // 监听所有可能的网络请求
        if (window.performance && window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name && entry.name.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes')) {
                        console.log('🕵️ Performance API检测到目标请求:', entry.name);
                        console.log('📊 请求详情:', {
                            name: entry.name,
                            startTime: entry.startTime,
                            responseEnd: entry.responseEnd,
                            transferSize: entry.transferSize
                        });
                        
                        // 尝试从网络请求中提取数据
                        tryExtractFromPerformanceEntry(entry);
                    } else if (entry.name && (
                        entry.name.includes('search/notes') || 
                        entry.name.includes('xiaohongshu.com'))) {
                        console.log('🕵️ Performance API检测到相关请求:', entry.name);
                        
                        // 如果检测到搜索接口，在非跟随模式下自动获取多页
                        // 跟随模式已在fetch/xhr拦截器中处理，这里不需要重复触发
                        if (entry.name.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes')) {
                            if (!followMode) {
                                // 只在非跟随模式下自动获取多页数据
                                setTimeout(() => {
                                    console.log('🔄 自动模式：检测到notes请求，开始获取多页数据');
                                    makeSearchRequest(entry.name, 10);
                                }, 1000);
                            } else {
                                console.log('🎯 跟随模式：检测到notes请求，由拦截器处理page+1');
                            }
                        }
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['resource'] });
                console.log('✅ Performance Observer已设置');
            } catch (error) {
                console.log('❌ Performance Observer不支持:', error);
            }
        }
    }

    // 尝试从Performance条目中提取数据
    function tryExtractFromPerformanceEntry(entry) {
        console.log('🔄 检测到目标API请求，尝试主动获取数据...');
        
        const url = entry.name;
        console.log('📍 目标URL:', url);
        
        // 解析URL获取参数
        try {
            const urlObj = new URL(url);
            console.log('🔍 URL解析结果:', urlObj.href);
            
            // 尝试重新发起相同的请求
            makeSearchRequest(url);
            
        } catch (error) {
            console.error('❌ URL解析失败:', error);
        }
    }

    // 主动发起搜索请求 - 支持自动分页（自动模式）
    async function makeSearchRequest(originalUrl, maxPages = 10) {
        // 防止重复触发
        if (isAutoRequesting) {
            console.log('⚠️ 已有自动请求在进行中，跳过本次触发');
            return;
        }
        
        isAutoRequesting = true;
        console.log('🚀 主动发起API请求，最大获取页数:', maxPages);
        console.log('🎯 当前模式:', followMode ? '跟随模式（暂不自动获取）' : '自动模式（自动获取多页）');
        
        // 保存URL供后续使用
        lastApiUrl = originalUrl;
        
        try {
            // 跟随模式：不自动获取，直接返回
            if (followMode) {
                console.log('🎯 跟随模式：不启动自动获取，等待手动操作');
                isAutoRequesting = false;
                return;
            }
            
            // 自动模式：循环获取多页
            let currentPageNum = 1;
            let hasMoreData = true;
            
            while (currentPageNum <= maxPages && hasMoreData) {
                console.log(`📄 正在获取第${currentPageNum}页数据...`);
                
                // 获取当前页数据
                hasMoreData = await tryPostRequest(originalUrl, currentPageNum);
                
                // 自动模式：继续获取下一页
                if (hasMoreData && currentPageNum < maxPages) {
                    // 随机延迟2-5秒
                    const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2000-5000ms
                    console.log(`⏳ 随机等待${(randomDelay/1000).toFixed(1)}秒后获取第${currentPageNum + 1}页...`);
                    await new Promise(resolve => setTimeout(resolve, randomDelay));
                }
                
                currentPageNum++;
            }
            
            if (!hasMoreData) {
                console.log('✅ 所有数据获取完成，没有更多数据了');
            } else {
                console.log(`✅ 已获取${maxPages}页数据，达到最大页数限制`);
            }
            
        } catch (error) {
            console.error('❌ 主动请求失败:', error);
            
            // 如果直接请求失败，尝试从页面中获取请求参数
            tryExtractRequestParams();
        } finally {
            isAutoRequesting = false;
            console.log('✅ 自动请求流程结束');
        }
    }

    // 尝试POST请求 - 支持分页
    async function tryPostRequest(url, page = 1) {
        console.log('📡 尝试POST请求:', url, '页数:', page);
        
        let keyword = '';
        
        // 只在第一页时更新关键词，后续页面使用相同关键词
        if (page === 1) {
            keyword = getSearchKeyword();
            currentKeyword = keyword;
        } else {
            // 使用之前保存的关键词确保一致性
            keyword = currentKeyword || getSearchKeyword();
        }
        
        // 构造正确的POST参数（根据图片中的真实参数）
        const postData = {
            keyword: keyword,
            page: page,  // 使用传入的页数参数
            page_size: 20,
            search_id: page === 1 ? generateSearchId() : currentSearchId, // 同一次搜索使用相同的search_id
            sort: "general",
            ext_flags: [],
            geo: "",
            image_formats: ["jpg", "webp", "avif"],
            note_type: 0
        };
        
        // 保存search_id供后续页面使用
        if (page === 1) {
            currentSearchId = postData.search_id;
        }
        
        console.log('📤 POST参数:', postData);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': navigator.userAgent,
                    'Referer': window.location.href,
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(postData),
                credentials: 'include'
            });
            
            console.log('📡 POST响应状态:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('🎉 POST成功获取数据:', data);
                
                if (data && data.data && data.data.items) {
                    console.log('📊 第', page, '页发现', data.data.items.length, '个帖子');
                    processApiData(data.data.items);
                    
                    // 更新分页信息
                    currentPage = page;
                    
                    // 检查是否还有更多数据
                    if (data.data.has_more && data.data.items.length > 0) {
                        console.log('📄 第', page, '页完成，还有更多数据可获取');
                        return true; // 表示还有更多数据
                    } else {
                        console.log('📄 第', page, '页完成，已无更多数据');
                        return false; // 表示没有更多数据
                    }
                } else {
                    console.log('❌ 第', page, '页数据格式不符合预期');
                    return false;
                }
            } else {
                console.log('❌ 第', page, '页POST请求失败，状态码:', response.status);
                const text = await response.text();
                console.log('响应内容:', text);
                return false;
            }
            
        } catch (error) {
            console.error('❌ 第', page, '页POST请求异常:', error);
            return false;
        }
    }

    // 从页面获取搜索关键词 - 改进版
    function getSearchKeyword() {
        console.log('🔍 开始获取搜索关键词...');
        
        // 方法1：从URL获取
        const urlParams = new URLSearchParams(window.location.search);
        let keyword = urlParams.get('keyword') || urlParams.get('q') || urlParams.get('search');
        
        if (keyword) {
            console.log('📝 从URL获取关键词:', keyword);
            return decodeURIComponent(keyword);
        }
        
        // 方法2：从页面路径获取（小红书搜索页面格式）
        const path = window.location.pathname;
        const searchMatch = path.match(/\/search\/(.+)/);
        if (searchMatch) {
            keyword = decodeURIComponent(searchMatch[1]);
            console.log('📝 从路径获取关键词:', keyword);
            return keyword;
        }
        
        // 方法3：从搜索框获取（多种可能的选择器）
        const searchSelectors = [
            'input[placeholder*="搜索"]',
            'input[placeholder*="search"]', 
            '.search-input',
            '.search-box input',
            'input[type="search"]',
            '[class*="search"] input',
            'input.input'
        ];
        
        for (const selector of searchSelectors) {
            const inputs = document.querySelectorAll(selector);
            for (const input of inputs) {
                if (input.value && input.value.trim()) {
                    keyword = input.value.trim();
                    console.log('📝 从搜索框获取关键词:', keyword, '(选择器:', selector, ')');
                    return keyword;
                }
            }
        }
        
        // 方法4：从页面标题或元数据获取
        const title = document.title;
        const titleMatch = title.match(/(.+)\s*[-_]\s*小红书/);
        if (titleMatch && titleMatch[1] !== '小红书') {
            keyword = titleMatch[1].trim();
            console.log('📝 从页面标题获取关键词:', keyword);
            return keyword;
        }
        
        // 方法5：从页面内容获取（搜索结果页面的关键词显示）
        const searchResultElements = document.querySelectorAll('[class*="keyword"], [class*="search-term"], .search-key');
        for (const elem of searchResultElements) {
            if (elem.textContent && elem.textContent.trim()) {
                keyword = elem.textContent.trim();
                console.log('📝 从搜索结果元素获取关键词:', keyword);
                return keyword;
            }
        }
        
        // 默认关键词
        keyword = 'PPT';  // 使用更常见的默认搜索词
        console.log('📝 使用默认关键词:', keyword);
        return keyword;
    }

    // 生成搜索ID - 参考真实格式
    function generateSearchId() {
        // 根据图片中的格式：2fgsjovhi0dES3iqvhaq (20位字符，包含数字和字母)
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        
        // 生成类似真实search_id的格式
        for (let i = 0; i < 20; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        console.log('🆔 生成搜索ID:', result);
        return result;
    }

    // 尝试从页面提取请求参数
    function tryExtractRequestParams() {
        console.log('🔍 尝试从页面提取请求参数...');
        
        // 监听下一次搜索时的参数
        const searchForms = document.querySelectorAll('form');
        searchForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                console.log('📝 检测到表单提交:', form);
                setTimeout(() => {
                    tryExtractFromPerformanceEntry({ name: 'https://edith.xiaohongshu.com/api/sns/web/v1/search/notes' });
                }, 1000);
            });
        });
        
        // 监听搜索按钮点击
        const searchButtons = document.querySelectorAll('button[type="submit"], .search-btn, [class*="search"]');
        searchButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('🖱️ 检测到搜索按钮点击');
                setTimeout(() => {
                    tryExtractFromPerformanceEntry({ name: 'https://edith.xiaohongshu.com/api/sns/web/v1/search/notes' });
                }, 1000);
            });
        });
    }

    // 更激进的网络拦截方法
    function setupAdvancedInterception() {
        console.log('🔧 设置高级网络拦截...');
        
        // 方法1：拦截所有可能的网络方法
        const originalSend = XMLHttpRequest.prototype.send;
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalFetch = window.fetch;
        
        // 超级详细的fetch拦截
        window.fetch = function(...args) {
            const [url, options] = args;
            console.log('🔍 超级详细Fetch拦截:', {
                url: url,
                method: options?.method || 'GET',
                headers: options?.headers,
                body: options?.body
            });
            
            if (typeof url === 'string' && url.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes')) {
                console.log('🎯🎯🎯 捕获到目标fetch请求!', url);
                
                // 尝试解析请求参数获取page
                let requestPage = 1;
                try {
                    if (options?.body) {
                        const bodyData = JSON.parse(options.body);
                        requestPage = bodyData.page || 1;
                        console.log('📄 拦截到的请求页码:', requestPage);
                        
                        // 保存相关信息
                        currentPage = requestPage;
                        if (bodyData.keyword) currentKeyword = bodyData.keyword;
                        if (bodyData.search_id) currentSearchId = bodyData.search_id;
                    }
                } catch (e) {
                    console.log('⚠️ 解析请求体失败:', e);
                }
                
                return originalFetch.apply(this, args).then(response => {
                    console.log('📡 fetch响应状态:', response.status);
                    const clonedResponse = response.clone();
                    
                    clonedResponse.text().then(text => {
                        console.log('📡 fetch响应内容:', text);
                        try {
                            const data = JSON.parse(text);
                            if (data && data.data && data.data.items) {
                                console.log(`🎉 成功解析fetch数据，发现 ${data.data.items.length} 个帖子 (第${requestPage}页)`);
                                processApiData(data.data.items);
                                
                                // 跟随模式的逻辑移除，避免无限循环
                            }
                        } catch (e) {
                            console.error('解析fetch响应失败:', e);
                        }
                    }).catch(console.error);
                    
                    return response;
                });
            }
            
            return originalFetch.apply(this, args);
        };
        
        // 超级详细的XHR拦截
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._method = method;
            this._url = url;
            
            console.log('🔍 超级详细XHR open:', method, url);
            
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            
            if (this._url && this._url.includes('edith.xiaohongshu.com/api/sns/web/v1/search/notes')) {
                console.log('🎯🎯🎯 捕获到目标XHR请求!', this._method, this._url);
                console.log('📤 XHR请求体:', body);
                
                // 尝试解析请求参数获取page
                let requestPage = 1;
                try {
                    if (body) {
                        const bodyData = JSON.parse(body);
                        requestPage = bodyData.page || 1;
                        console.log('📄 拦截到的请求页码:', requestPage);
                        
                        // 保存相关信息
                        currentPage = requestPage;
                        if (bodyData.keyword) currentKeyword = bodyData.keyword;
                        if (bodyData.search_id) currentSearchId = bodyData.search_id;
                    }
                } catch (e) {
                    console.log('⚠️ 解析请求体失败:', e);
                }
                
                // 监听所有可能的事件
                this.addEventListener('loadstart', () => console.log('📡 XHR loadstart'));
                this.addEventListener('progress', () => console.log('📡 XHR progress'));
                this.addEventListener('load', function() {
                    console.log('📡 XHR load - 状态:', this.status);
                    console.log('📡 XHR响应内容:', this.responseText);
                    
                    if (this.status === 200 && this.responseText) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data && data.data && data.data.items) {
                                console.log(`🎉 成功解析XHR数据，发现 ${data.data.items.length} 个帖子 (第${requestPage}页)`);
                                processApiData(data.data.items);
                                
                                // 跟随模式的逻辑移除，避免无限循环
                            }
                        } catch (e) {
                            console.error('解析XHR响应失败:', e);
                        }
                    }
                });
                this.addEventListener('loadend', () => console.log('📡 XHR loadend'));
                this.addEventListener('error', (e) => console.log('❌ XHR error:', e));
            }
            
            return originalSend.apply(this, arguments);
        };
        
        console.log('✅ 高级网络拦截已设置');
    }
    
    // 监听页面上的所有网络活动
    function monitorNetworkActivity() {
        // 拦截所有可能的请求方法
        const originalSend = XMLHttpRequest.prototype.send;
        const originalFetch = window.fetch;
        
        // 全局网络请求监控
        window.addEventListener('beforeunload', () => {
            console.log('🔄 页面即将卸载');
        });
        
        // 监听DOM变化，可能触发新的网络请求
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    console.log('🔄 DOM发生变化，可能有新的网络请求');
                }
            });
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('✅ 网络活动监控已设置');
    }
    
    // 处理从API获取的数据
    function processApiData(items) {
        console.log(`🔄 处理API数据，共 ${items.length} 个帖子`);
        
        const newPosts = [];
        
        items.forEach((item, index) => {
            try {
                // 不跳过任何帖子，全部记录
                const post = extractSimpleData(item);
                if (post) {
                    newPosts.push(post);
                    console.log(`✅ 提取帖子 ${index + 1}:`, post);
                } else {
                    console.log(`⚠️ 帖子 ${index + 1} 数据提取失败，但仍尝试记录`);
                    // 即使提取失败，也尝试记录基本信息
                    const basicPost = {
                        id: item.id || `unknown_${index}`,
                        display_title: '数据提取失败',
                        nick_name: '未知用户',
                        liked_count: '0',
                        collected_count: '0',
                        comment_count: '0',
                        shared_count: '0',
                        full_url: item.id ? `https://www.xiaohongshu.com/explore/${item.id}` : '',
                        timestamp: new Date().toISOString(),
                        raw_type: item.model_type || 'unknown'
                    };
                    newPosts.push(basicPost);
                    console.log(`📝 记录基本信息:`, basicPost);
                }
            } catch (error) {
                console.error(`❌ 处理帖子 ${index + 1} 时出错:`, error);
                // 即使出错也记录一个占位条目
                newPosts.push({
                    id: `error_${index}`,
                    display_title: `处理错误: ${error.message}`,
                    nick_name: '错误',
                    liked_count: '0',
                    collected_count: '0', 
                    comment_count: '0',
                    shared_count: '0',
                    full_url: '',
                    timestamp: new Date().toISOString(),
                    raw_type: 'error'
                });
            }
        });
        
        if (newPosts.length > 0) {
            // 合并到现有数据
            collectedData = [...collectedData, ...newPosts];
            
            // 去重（基于帖子ID）
            const seenIds = new Set();
            collectedData = collectedData.filter(post => {
                if (seenIds.has(post.id)) {
                    return false;
                }
                seenIds.add(post.id);
                return true;
            });

            console.log(`🎉 当前共采集到 ${collectedData.length} 条帖子数据`);
            
            // 发送数据到后台
            try {
                chrome.runtime.sendMessage({
                    action: 'updateData',
                    data: collectedData
                });
            } catch (error) {
                console.error('❌ 发送数据到后台失败:', error);
                // 扩展可能已失效，尝试重新连接
                if (error.message && error.message.includes('Extension context invalidated')) {
                    console.log('🔄 检测到扩展上下文失效，请刷新页面');
                }
            }
        } else {
            console.log('⚠️ 未提取到有效帖子数据');
        }
    }

    // 数据提取函数 - 支持所有类型数据
    function extractSimpleData(item) {
        try {
            let extractedData = {
                id: item.id || '',
                display_title: '无标题',
                nick_name: '未知用户',
                liked_count: '0',
                collected_count: '0',
                comment_count: '0',
                shared_count: '0',
                full_url: '',
                timestamp: new Date().toISOString(),
                raw_type: item.model_type || 'unknown'
            };

            // 如果有note_card，优先从note_card提取
            if (item.note_card) {
                const noteCard = item.note_card;
                const interactInfo = noteCard.interact_info || {};
                
                extractedData.display_title = noteCard.display_title || extractedData.display_title;
                extractedData.nick_name = noteCard.user ? 
                    (noteCard.user.nick_name || noteCard.user.nickname || extractedData.nick_name) : 
                    extractedData.nick_name;
                extractedData.liked_count = interactInfo.liked_count || extractedData.liked_count;
                extractedData.collected_count = interactInfo.collected_count || extractedData.collected_count;
                extractedData.comment_count = interactInfo.comment_count || extractedData.comment_count;
                extractedData.shared_count = interactInfo.shared_count || extractedData.shared_count;
            }
            
            // 如果有其他可能的数据源，也尝试提取
            if (!extractedData.display_title || extractedData.display_title === '无标题') {
                // 尝试从其他字段获取标题
                extractedData.display_title = item.title || item.name || item.content || `${item.model_type || 'unknown'}_${item.id || 'item'}`;
            }

            // 构建完整的帖子链接
            if (item.id) {
                const token = item.xsec_token || '';
                const baseUrl = `https://www.xiaohongshu.com/explore/${item.id}`;
                extractedData.full_url = token ? 
                    `${baseUrl}?xsec_token=${encodeURIComponent(token)}&xsec_source=pc_search&source=unknown` : 
                    baseUrl;
            }
            
            console.log(`📝 提取的完整数据 (${item.model_type}):`, extractedData);
            return extractedData;
            
        } catch (error) {
            console.error('❌ 数据提取失败:', error, item);
            return null;
        }
    }

    // 初始化函数
    function init() {
        console.log('🚀 初始化小红书数据采集器');
        
        if (!isXiaohongshuPage()) {
            console.log('❌ 非小红书页面，不启动采集器');
            return;
        }

        console.log('✅ 在小红书页面，开始设置拦截器');
        
        // 从storage读取跟随模式状态
        chrome.storage.local.get(['followMode'], (result) => {
            followMode = result.followMode || false;
            console.log('🎯 读取到跟随模式状态:', followMode ? '开启' : '关闭');
        });
        
        // 设置拦截器
        setupAdvancedInterception();  // 使用更激进的拦截方法
        
        // 添加额外的监听器
        addNetworkListener();
        monitorNetworkActivity();
        
        // 设置页面交互监听
        tryExtractRequestParams();
        
        console.log('🎯 所有高级拦截器和监听器设置完成，等待搜索请求...');
        
        // 监听来自popup的消息
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 收到popup消息:', request);
            
            if (request.action === 'getData') {
                console.log('📊 返回当前数据，共', collectedData.length, '条');
                sendResponse({data: collectedData});
            } else if (request.action === 'clearData') {
                collectedData = [];
                console.log('🗑️ 数据已清空');
                sendResponse({success: true});
            } else if (request.action === 'setFollowMode') {
                // 设置跟随模式
                followMode = request.followMode;
                console.log('🎯 跟随模式已更新为:', followMode ? '开启' : '关闭');
                sendResponse({success: true, followMode: followMode});
            } else if (request.action === 'manualTrigger') {
                // 手动触发数据采集
                console.log('🖱️ 手动触发数据采集');
                tryExtractFromPerformanceEntry({ 
                    name: 'https://edith.xiaohongshu.com/api/sns/web/v1/search/notes' 
                });
                sendResponse({success: true, message: '已尝试主动获取数据'});
            } else if (request.action === 'getMoreData') {
                // 获取更多数据（下一页）
                console.log('📄 获取更多数据，下一页:', currentPage + 1);
                const nextPage = currentPage + 1;
                tryPostRequest('https://edith.xiaohongshu.com/api/sns/web/v1/search/notes', nextPage);
                sendResponse({success: true, message: `正在获取第${nextPage}页数据`});
            } else {
                sendResponse({success: false, message: '未知操作'});
            }
        });

        // 页面加载完成提示
        console.log('✨ 小红书数据采集器已准备就绪！');
        console.log('💡 提示：在小红书搜索任何内容时，插件会自动拦截并采集数据');
        console.log('🔍 调试：请打开开发者工具查看所有网络请求日志');
        
        // 延迟设置拦截器，确保页面完全加载
        setTimeout(() => {
            console.log('🔄 延迟重新设置高级拦截器...');
            setupAdvancedInterception();
        }, 3000);
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
