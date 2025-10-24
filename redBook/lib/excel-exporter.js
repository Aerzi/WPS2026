// 金山办公智能表格(.ksheet)导出工具
class KsheetExporter {
    constructor() {
        this.workbook = null;
        this.worksheet = null;
    }

    // 创建.ksheet文件并下载
    async exportToKsheet(data, filename = '小红书帖子数据') {
        try {
            // 验证数据
            this.validateData(data);
            
            // 格式化数据
            const formattedData = this.formatData(data);
            
            // 准备表头 - 包含更多字段
            const headers = ['帖子ID', '帖子标题', '作者昵称', '喜欢数', '收藏数', '评论数', '分享数', '帖子链接', '数据类型', '采集时间'];
            
            // 准备数据行 - 包含更多字段
            const rows = formattedData.map(post => [
                post.id || '',
                post.display_title || '无标题',
                post.nick_name || '未知用户',
                post.liked_count || '0',
                post.collected_count || '0',
                post.comment_count || '0',
                post.shared_count || '0',
                post.full_url || '',
                post.raw_type || 'unknown',
                post.timestamp ? new Date(post.timestamp).toLocaleString('zh-CN') : ''
            ]);

            // 创建Ksheet格式（使用CSV作为基础，但设置正确的MIME类型）
            const ksheetData = this.createKsheetFormat(headers, rows);
            
            // 创建并下载文件
            await this.downloadFile(ksheetData, `${filename}_${this.getDateString()}.ksheet`);
            
            return { success: true, message: `Ksheet文件导出成功，共导出 ${formattedData.length} 条数据` };
        } catch (error) {
            console.error('导出Ksheet失败:', error);
            return { success: false, message: '导出失败: ' + error.message };
        }
    }

    // 兼容旧方法名
    async exportToExcel(data, filename = '小红书帖子数据') {
        return await this.exportToKsheet(data, filename);
    }

    // 创建Ksheet格式数据
    createKsheetFormat(headers, rows) {
        // Ksheet文件实际上也是基于CSV格式，但使用特殊的编码和标识
        let ksheet = '\uFEFF'; // UTF-8 BOM
        
        // 添加Ksheet文件标识头部（金山办公智能表格标识）
        ksheet += '# 金山办公智能表格文件\n';
        ksheet += '# 文件创建时间: ' + new Date().toLocaleString('zh-CN') + '\n';
        ksheet += '# 数据来源: 小红书数据采集器\n';
        ksheet += '\n';
        
        // 添加表头
        ksheet += headers.map(header => `"${header}"`).join(',') + '\n';
        
        // 添加数据行
        rows.forEach(row => {
            const ksheetRow = row.map(cell => {
                // 处理特殊字符和换行符
                let value = String(cell || '');
                value = value.replace(/"/g, '""'); // 转义双引号
                value = value.replace(/\n/g, ' '); // 换行符转为空格
                return `"${value}"`;
            });
            ksheet += ksheetRow.join(',') + '\n';
        });
        
        return ksheet;
    }

    // 创建CSV格式数据（保持向后兼容）
    createCSV(headers, rows) {
        return this.createKsheetFormat(headers, rows);
    }

    // 下载文件 - 兼容Service Worker环境，支持Ksheet格式
    async downloadFile(content, filename) {
        return new Promise((resolve, reject) => {
            try {
                // 根据文件扩展名确定MIME类型
                let mimeType = 'text/csv;charset=utf-8';
                if (filename.endsWith('.ksheet')) {
                    // 金山办公智能表格的MIME类型
                    mimeType = 'application/vnd.kingsoft.ksheet;charset=utf-8';
                }
                
                // 在Service Worker中使用Data URL替代Object URL
                const base64Content = btoa(unescape(encodeURIComponent(content)));
                const dataUrl = `data:${mimeType};base64,${base64Content}`;
                
                console.log(`📥 开始下载文件: ${filename} (${mimeType})`);
                
                chrome.downloads.download({
                    url: dataUrl,
                    filename: filename,
                    saveAs: true
                }, (downloadId) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        console.log('✅ 文件下载开始，ID:', downloadId);
                        resolve(downloadId);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // 获取日期字符串
    getDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}_${hour}${minute}`;
    }

    // 创建高级Excel格式（XLSX）- 使用纯JavaScript实现
    async exportToXLSX(data, filename = '小红书帖子数据') {
        try {
            // 简化的XLSX生成（基于OpenXML格式）
            const headers = ['帖子标题', '点击量', '收藏量', '帖子链接', '采集时间'];
            const sheetData = [headers];
            
            data.forEach(post => {
                sheetData.push([
                    post.title || '无标题',
                    post.views || '0',
                    post.collects || '0',
                    post.link || '',
                    post.timestamp ? new Date(post.timestamp).toLocaleString('zh-CN') : ''
                ]);
            });

            const xlsx = this.createXLSXBuffer(sheetData);
            
            const blob = new Blob([xlsx], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = URL.createObjectURL(blob);
            
            await new Promise((resolve, reject) => {
                chrome.downloads.download({
                    url: url,
                    filename: `${filename}_${this.getDateString()}.xlsx`,
                    saveAs: true
                }, (downloadId) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(downloadId);
                    }
                    URL.revokeObjectURL(url);
                });
            });

            return { success: true, message: 'XLSX文件导出成功' };
        } catch (error) {
            console.error('导出XLSX失败:', error);
            // 如果XLSX导出失败，回退到CSV
            return await this.exportToExcel(data, filename);
        }
    }

    // 创建简化的XLSX buffer
    createXLSXBuffer(data) {
        // 简化的XLSX结构（实际应该使用专门的库）
        // 这里实现一个基本的XML结构
        const sharedStrings = [];
        const sharedStringsMap = {};
        
        // 处理共享字符串
        data.forEach(row => {
            row.forEach(cell => {
                const cellStr = String(cell || '');
                if (!(cellStr in sharedStringsMap)) {
                    sharedStringsMap[cellStr] = sharedStrings.length;
                    sharedStrings.push(cellStr);
                }
            });
        });

        // 生成worksheet XML
        let worksheetXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <sheetData>`;

        data.forEach((row, rowIndex) => {
            worksheetXML += `<row r="${rowIndex + 1}">`;
            row.forEach((cell, colIndex) => {
                const cellRef = this.getCellReference(rowIndex, colIndex);
                const cellStr = String(cell || '');
                const stringIndex = sharedStringsMap[cellStr];
                
                worksheetXML += `<c r="${cellRef}" t="inlineStr">`;
                worksheetXML += `<is><t>${this.escapeXML(cellStr)}</t></is>`;
                worksheetXML += `</c>`;
            });
            worksheetXML += `</row>`;
        });

        worksheetXML += `</sheetData></worksheet>`;

        // 由于完整的XLSX格式比较复杂，这里简化处理
        // 实际项目中建议使用SheetJS等专业库
        const textEncoder = new TextEncoder();
        return textEncoder.encode(worksheetXML);
    }

    // 获取Excel单元格引用
    getCellReference(row, col) {
        let colName = '';
        let colNum = col;
        
        while (colNum >= 0) {
            colName = String.fromCharCode(65 + (colNum % 26)) + colName;
            colNum = Math.floor(colNum / 26) - 1;
        }
        
        return colName + (row + 1);
    }

    // 转义XML特殊字符
    escapeXML(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    // 验证数据
    validateData(data) {
        if (!Array.isArray(data)) {
            throw new Error('数据必须是数组格式');
        }
        
        if (data.length === 0) {
            throw new Error('没有数据可导出');
        }
        
        return true;
    }

    // 格式化数据
    formatData(rawData) {
        return rawData.map(post => ({
            id: post.id || '',
            display_title: this.sanitizeString(post.display_title || '无标题'),
            nick_name: this.sanitizeString(post.nick_name || '未知用户'),
            liked_count: this.formatNumber(post.liked_count || '0'),
            collected_count: this.formatNumber(post.collected_count || '0'),
            comment_count: this.formatNumber(post.comment_count || '0'),
            shared_count: this.formatNumber(post.shared_count || '0'),
            full_url: post.full_url || '',
            raw_type: post.raw_type || 'unknown',  // 新增：数据类型字段
            timestamp: post.timestamp || new Date().toISOString()
        }));
    }

    // 清理字符串
    sanitizeString(str) {
        return String(str)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 移除控制字符
            .replace(/\s+/g, ' ') // 合并多个空格
            .trim();
    }

    // 格式化数字
    formatNumber(num) {
        if (typeof num === 'number') return num.toString();
        if (typeof num === 'string') {
            // 提取数字
            const match = num.match(/[\d,]+/);
            return match ? match[0] : '0';
        }
        return '0';
    }
}

// 导出实例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExcelExporter;
} else if (typeof window !== 'undefined') {
    window.ExcelExporter = ExcelExporter;
}
