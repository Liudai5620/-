/**
 * 幼儿教育资源包 - 资源数据配置文件
 *
 * 使用说明：
 * 1. 在 resources 数组中添加你的资源
 * 2. 每个资源需要包含：id, name, type, url, description, date
 * 3. 修改后刷新页面即可看到变化
 * 4. 部署到GitHub Pages后，修改此文件并重新部署即可更新资源
 */

// ============================================================================
// 资源配置数组 - 在这里添加你的资源
// ============================================================================
const resources = [
    // 示例视频资源
    {
        id: 1,
        name: '认识数字1-10',
        type: 'video',
        url: 'https://www.example.com/video/numbers.mp4',
        description: '通过有趣的动画帮助幼儿认识1-10的数字，包含数字认知、数量对应等内容',
        date: '2025-01-15'
    },

    // 示例PPT课件
    {
        id: 2,
        name: '颜色认知教学',
        type: 'ppt',
        url: 'https://www.example.com/ppt/colors.pptx',
        description: '识别红、黄、蓝、绿等基本颜色，培养幼儿的色彩感知能力',
        date: '2025-01-16'
    },

    // 示例AI互动页面
    {
        id: 3,
        name: '智能问答互动',
        type: 'ai',
        url: 'https://www.example.com/ai/chat.html',
        description: 'AI智能问答系统，支持自然语言交互，帮助幼儿自主学习和探索',
        date: '2025-01-17'
    },

    // 添加更多资源...
    // {
    //     id: 4,
    //     name: '你的资源名称',
    //     type: 'video', // 或 'ppt', 'ai'
    //     url: '你的资源链接',
    //     description: '资源描述',
    //     date: '2025-01-18'
    // },
];

// ============================================================================
// 工具函数 - 不需要修改
// ============================================================================

/**
 * 获取所有资源
 */
function getResources() {
    return resources;
}

/**
 * 根据ID查找资源
 */
function getResourceById(id) {
    return resources.find(r => r.id === id);
}

/**
 * 根据类型筛选资源
 */
function getResourcesByType(type) {
    return resources.filter(r => r.type === type);
}

/**
 * 搜索资源
 */
function searchResources(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return resources.filter(r =>
        r.name.toLowerCase().includes(lowerKeyword) ||
        (r.description && r.description.toLowerCase().includes(lowerKeyword))
    );
}
