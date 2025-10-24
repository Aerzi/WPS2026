// 弹出页面脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('弹出页面已加载');

    // 获取DOM元素
    const postCountEl = document.getElementById('postCount');
    const lastUpdateEl = document.getElementById('lastUpdate');
    const followModeSwitch = document.getElementById('followModeSwitch');
    const manualTriggerBtn = document.getElementById('manualTriggerBtn');
    const getMoreBtn = document.getElementById('getMoreBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadingEl = document.getElementById('loading');
    const messageEl = document.getElementById('message');
    const dataPreviewEl = document.getElementById('dataPreview');
    const previewListEl = document.getElementById('previewList');

    let currentData = [];
    let followMode = false;

    // 初始化页面
    init();

    // 绑定事件
    followModeSwitch.addEventListener('change', handleFollowModeToggle);
    manualTriggerBtn.addEventListener('click', handleManualTrigger);
    getMoreBtn.addEventListener('click', handleGetMore);
    exportBtn.addEventListener('click', handleExport);
    clearBtn.addEventListener('click', handleClear);

    async function init() {
        try {
            // 读取跟随模式状态
            const storage = await chrome.storage.local.get(['followMode']);
            followMode = storage.followMode || false;
            followModeSwitch.checked = followMode;
            
            // 获取当前数据
            const response = await sendMessage({action: 'getData'});
            if (response && response.data) {
                currentData = response.data;
                updateUI();
            }
            
            // 检查当前标签页
            checkCurrentTab();
            
        } catch (error) {
            console.error('初始化失败:', error);
            showMessage('初始化失败', 'error');
        }
    }

    async function handleFollowModeToggle() {
        try {
            followMode = followModeSwitch.checked;
            
            // 保存到storage
            await chrome.storage.local.set({ followMode: followMode });
            
            // 通知content-script更新模式
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setFollowMode',
                    followMode: followMode
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log('通知content-script失败:', chrome.runtime.lastError);
                    }
                });
            }
            
            if (followMode) {
                showMessage('✅ 跟随模式已开启：只在检测到notes请求时才获取下一页', 'success');
            } else {
                showMessage('✅ 跟随模式已关闭：检测到notes请求时自动获取所有页面', 'info');
            }
            
            console.log('跟随模式已', followMode ? '开启' : '关闭');
        } catch (error) {
            console.error('切换跟随模式失败:', error);
            showMessage('切换模式失败', 'error');
        }
    }

    async function checkCurrentTab() {
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            const currentTab = tabs[0];
            
            if (currentTab && currentTab.url && currentTab.url.includes('xiaohongshu.com')) {
                showMessage('✅ 已连接到小红书页面，自动监听API或点击手动获取', 'success');
            } else {
                showMessage('⚠️ 请在小红书页面使用此插件', 'warning');
            }
        } catch (error) {
            console.error('检查标签页失败:', error);
        }
    }

    async function handleManualTrigger() {
        try {
            showLoading(true);
            manualTriggerBtn.disabled = true;
            
            const response = await sendMessage({action: 'manualTrigger'});
            
            if (response && response.success) {
                showMessage(response.message || '已触发数据获取', 'success');
                
                // 等待一下再获取数据
                setTimeout(async () => {
                    const dataResponse = await sendMessage({action: 'getData'});
                    if (dataResponse && dataResponse.data) {
                        currentData = dataResponse.data;
                        updateUI();
                        if (currentData.length > 0) {
                            showMessage(`成功获取 ${currentData.length} 条数据！`, 'success');
                        } else {
                            showMessage('未获取到数据，请确保在搜索页面并稍后重试', 'warning');
                        }
                    }
                }, 2000);
            } else {
                showMessage(response?.message || '手动触发失败', 'error');
            }
            
        } catch (error) {
            console.error('手动触发失败:', error);
            showMessage('手动触发失败：' + error.message, 'error');
        } finally {
            showLoading(false);
            manualTriggerBtn.disabled = false;
        }
    }

    async function handleGetMore() {
        try {
            showLoading(true);
            getMoreBtn.disabled = true;
            
            const response = await sendMessage({action: 'getMoreData'});
            
            if (response && response.success) {
                showMessage(response.message || '正在获取更多数据...', 'info');
                
                // 等待一下再获取数据
                setTimeout(async () => {
                    const dataResponse = await sendMessage({action: 'getData'});
                    if (dataResponse && dataResponse.data) {
                        currentData = dataResponse.data;
                        updateUI();
                        showMessage(`已更新数据，当前共 ${currentData.length} 条！`, 'success');
                    }
                }, 2000);
            } else {
                showMessage(response?.message || '获取更多数据失败', 'error');
            }
            
        } catch (error) {
            console.error('获取更多数据失败:', error);
            showMessage('获取更多数据失败：' + error.message, 'error');
        } finally {
            showLoading(false);
            getMoreBtn.disabled = false;
        }
    }

    async function handleExport() {
        try {
            showLoading(true);
            exportBtn.disabled = true;
            
            if (currentData.length === 0) {
                showMessage('没有数据可导出', 'warning');
                return;
            }

            const response = await sendMessage({action: 'exportData'});
            
            if (response && response.success) {
                showMessage('Ksheet文件已开始下载', 'success');
            } else {
                showMessage(response?.message || '导出失败', 'error');
            }
            
        } catch (error) {
            console.error('导出失败:', error);
            showMessage('导出失败：' + error.message, 'error');
        } finally {
            showLoading(false);
            exportBtn.disabled = false;
        }
    }

    async function handleClear() {
        if (!confirm('确定要清空所有采集的数据吗？此操作不可恢复。')) {
            return;
        }

        try {
            showLoading(true);
            
            const response = await sendMessage({action: 'clearData'});
            
            if (response && response.success) {
                currentData = [];
                updateUI();
                showMessage('数据已清空', 'success');
            } else {
                showMessage('清空失败', 'error');
            }
            
        } catch (error) {
            console.error('清空数据失败:', error);
            showMessage('清空失败：' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    }

    function updateUI() {
        // 更新数据计数
        postCountEl.textContent = currentData.length;
        
        // 更新最后更新时间
        if (currentData.length > 0) {
            const lastPost = currentData[currentData.length - 1];
            if (lastPost.timestamp) {
                const date = new Date(lastPost.timestamp);
                lastUpdateEl.textContent = date.toLocaleString('zh-CN');
            }
        } else {
            lastUpdateEl.textContent = '暂无';
        }
        
        // 更新导出按钮状态
        exportBtn.disabled = currentData.length === 0;
        
        // 更新获取更多按钮状态
        getMoreBtn.disabled = currentData.length === 0;
        
        // 更新数据预览
        updateDataPreview();
    }

    function updateDataPreview() {
        if (currentData.length === 0) {
            dataPreviewEl.style.display = 'none';
            return;
        }

        dataPreviewEl.style.display = 'block';
        
        // 显示前5条数据作为预览
        const previewData = currentData.slice(0, 5);
        previewListEl.innerHTML = '';
        
        previewData.forEach((post, index) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <div class="preview-title">${truncateText(post.display_title || '无标题', 40)}</div>
                <div class="preview-author">👤 作者: ${post.nick_name || '未知'}</div>
                <div class="preview-stats">
                    <span>❤️ ${post.liked_count || '0'}</span>
                    <span>⭐ ${post.collected_count || '0'}</span>
                    <span>💬 ${post.comment_count || '0'}</span>
                    <span>📤 ${post.shared_count || '0'}</span>
                </div>
                <div class="preview-id">🆔 ID: ${truncateText(post.id || '', 20)}</div>
            `;
            previewListEl.appendChild(item);
        });
        
        if (currentData.length > 5) {
            const moreItem = document.createElement('div');
            moreItem.className = 'preview-more';
            moreItem.textContent = `... 还有 ${currentData.length - 5} 条数据`;
            previewListEl.appendChild(moreItem);
        }
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    function showLoading(show) {
        loadingEl.style.display = show ? 'flex' : 'none';
    }

    function showMessage(text, type = 'info') {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        
        // 3秒后清除消息
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 3000);
    }

    function sendMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, resolve);
        });
    }

    // 定期更新数据
    setInterval(async () => {
        try {
            const response = await sendMessage({action: 'getData'});
            if (response && response.data) {
                const newDataLength = response.data.length;
                if (newDataLength !== currentData.length) {
                    currentData = response.data;
                    updateUI();
                    console.log('数据已更新，当前数量：', newDataLength);
                }
            }
        } catch (error) {
            console.error('定期更新失败:', error);
        }
    }, 2000);
});
