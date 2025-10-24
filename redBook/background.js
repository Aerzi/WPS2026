// 后台服务脚本
// 导入Ksheet导出器
importScripts('lib/excel-exporter.js');

chrome.runtime.onInstalled.addListener(() => {
    console.log('小红书数据采集器已安装');
});

// 存储采集的数据
let collectedPosts = [];
let ksheetExporter = null;

// 初始化Ksheet导出器
try {
    ksheetExporter = new KsheetExporter();
} catch (error) {
    console.error('初始化Ksheet导出器失败:', error);
}

// 监听来自内容脚本和弹出页面的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息:', request);
    
    switch (request.action) {
        case 'updateData':
            // 更新采集的数据
            if (request.data && Array.isArray(request.data)) {
                collectedPosts = request.data;
                console.log('数据已更新，共', collectedPosts.length, '条记录');
                
                // 保存到chrome storage
                chrome.storage.local.set({
                    'xiaohongshu_posts': collectedPosts,
                    'last_update': new Date().toISOString()
                });
            }
            sendResponse({success: true});
            break;
            
        case 'getData':
            // 返回当前数据
            sendResponse({
                data: collectedPosts,
                count: collectedPosts.length
            });
            break;
            
        case 'clearData':
            // 清空数据
            collectedPosts = [];
            chrome.storage.local.remove(['xiaohongshu_posts', 'last_update']);
            sendResponse({success: true});
            break;
            
        case 'exportData':
            // 导出数据为Ksheet文件
            if (collectedPosts.length > 0) {
                if (ksheetExporter) {
                    try {
                        ksheetExporter.exportToKsheet(collectedPosts, '小红书帖子数据')
                            .then(result => {
                                if (result.success) {
                                    console.log('✅ Ksheet导出成功');
                                } else {
                                    console.error('❌ Ksheet导出失败:', result.message);
                                }
                            })
                            .catch(error => {
                                console.error('❌ Ksheet导出异常:', error);
                                // 如果Ksheet导出失败，降级到CSV导出
                                exportToCSVFallback(collectedPosts);
                            });
                        sendResponse({success: true, message: '正在导出Ksheet文件...'});
                    } catch (error) {
                        console.error('❌ Ksheet导出器出错:', error);
                        exportToCSVFallback(collectedPosts);
                        sendResponse({success: true, message: '正在导出CSV文件...'});
                    }
                } else {
                    // 降级到CSV导出
                    exportToCSVFallback(collectedPosts);
                    sendResponse({success: true, message: '正在导出CSV文件...'});
                }
            } else {
                sendResponse({success: false, message: '没有数据可导出'});
            }
            break;
            
        case 'collectFromCurrentTab':
            // 在当前标签页收集数据
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0] && tabs[0].url.includes('xiaohongshu.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'collectData'}, (response) => {
                        sendResponse(response || {success: false, message: '无法连接到页面'});
                    });
                } else {
                    sendResponse({success: false, message: '请在小红书页面使用此功能'});
                }
            });
            return true; // 保持消息通道开放
            
        default:
            sendResponse({success: false, message: '未知操作'});
    }
});

// 降级CSV导出函数 - 兼容Service Worker
function exportToCSVFallback(data) {
    try {
        // 创建CSV格式数据
        let csvContent = '\uFEFF'; // BOM for UTF-8
        csvContent += '帖子ID,帖子标题,作者昵称,喜欢数,收藏数,评论数,分享数,帖子链接,数据类型,采集时间\n';
        
        data.forEach(post => {
            const row = [
                `"${(post.id || '').replace(/"/g, '""')}"`,
                `"${(post.display_title || '').replace(/"/g, '""')}"`,
                `"${(post.nick_name || '').replace(/"/g, '""')}"`,
                `"${(post.liked_count || '0').replace(/"/g, '""')}"`,
                `"${(post.collected_count || '0').replace(/"/g, '""')}"`,
                `"${(post.comment_count || '0').replace(/"/g, '""')}"`,
                `"${(post.shared_count || '0').replace(/"/g, '""')}"`,
                `"${(post.full_url || '').replace(/"/g, '""')}"`,
                `"${(post.raw_type || 'unknown').replace(/"/g, '""')}"`,
                `"${post.timestamp ? new Date(post.timestamp).toLocaleString('zh-CN') : ''}"`
            ].join(',');
            csvContent += row + '\n';
        });
        
        // 使用Data URL替代Object URL
        const base64Content = btoa(unescape(encodeURIComponent(csvContent)));
        const dataUrl = `data:text/csv;charset=utf-8;base64,${base64Content}`;
        
        const filename = `小红书帖子数据_${new Date().toISOString().slice(0,10)}.csv`;
        
        chrome.downloads.download({
            url: dataUrl,
            filename: filename,
            saveAs: true
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('下载失败:', chrome.runtime.lastError);
            } else {
                console.log('文件下载成功，下载ID:', downloadId);
            }
        });
        
    } catch (error) {
        console.error('CSV导出失败:', error);
    }
}

// 从storage恢复数据
chrome.storage.local.get(['xiaohongshu_posts'], (result) => {
    if (result.xiaohongshu_posts) {
        collectedPosts = result.xiaohongshu_posts;
        console.log('从storage恢复数据:', collectedPosts.length, '条记录');
    }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('xiaohongshu.com')) {
        console.log('小红书页面已加载完成');
        // 可以在这里执行一些初始化操作
    }
});
