/**
 * 幼儿教育资源包 - 文件上传处理模块
 * 支持两种上传模式：
 * 1. URL 模式：直接保存网络链接（推荐）
 * 2. Base64 模式：将文件转换为 Base64 编码存储在本地
 */

class UploadHandler {
  constructor(options = {}) {
    // 配置选项
    this.options = {
      storageKey: options.storageKey || 'eduResources',
      maxFileSize: options.maxFileSize || 10 * 1024 * 1024, // 默认 10MB
      allowedTypes: options.allowedTypes || {
        video: ['.mp4', '.webm', '.ogg'],
        ppt: ['.ppt', '.pptx'],
        ai: ['.html', '.json', '.txt', '.pdf', '.doc', '.docx']
      },
      ...options
    };

    // 状态
    this.resources = [];
    this.uploadMode = 'url'; // 'url' | 'base64'
    this.selectedType = 'all';

    // 类型配置
    this.typeConfig = {
      video: {
        label: '视频微课',
        emoji: '🎬',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        btnColor: 'bg-purple-500 hover:bg-purple-600'
      },
      ppt: {
        label: 'PPT课件',
        emoji: '📊',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        btnColor: 'bg-blue-500 hover:bg-blue-600'
      },
      ai: {
        label: 'AI互动',
        emoji: '🤖',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        borderColor: 'border-green-200',
        btnColor: 'bg-green-500 hover:bg-green-600'
      }
    };

    // 初始化
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.loadResources();
  }

  /**
   * 加载资源列表
   */
  loadResources() {
    try {
      const saved = localStorage.getItem(this.options.storageKey);
      if (saved) {
        this.resources = JSON.parse(saved);
      }
    } catch (error) {
      console.error('加载资源失败:', error);
      this.resources = [];
    }
  }

  /**
   * 保存资源列表
   */
  saveResources() {
    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(this.resources));
    } catch (error) {
      console.error('保存资源失败:', error);
      throw new Error('存储空间不足，请清理旧资源');
    }
  }

  /**
   * 文件转 Base64
   * @param {File} file - 文件对象
   * @returns {Promise<string>} Base64 编码
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(new Error('文件转换失败'));
    });
  }

  /**
   * 验证文件类型
   * @param {File} file - 文件对象
   * @param {string} type - 资源类型 (video | ppt | ai)
   * @returns {boolean}
   */
  validateFileType(file, type) {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const allowedExts = this.options.allowedTypes[type] || [];
    return allowedExts.includes(ext);
  }

  /**
   * 验证文件大小
   * @param {File} file - 文件对象
   * @returns {boolean}
   */
  validateFileSize(file) {
    return file.size <= this.options.maxFileSize;
  }

  /**
   * 验证 URL 格式
   * @param {string} url - URL 字符串
   * @returns {boolean}
   */
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 添加资源（URL 模式）
   * @param {Object} data - 资源数据
   * @param {string} data.type - 资源类型
   * @param {string} data.title - 标题
   * @param {string} data.url - URL 链接
   * @param {string} data.description - 描述
   * @returns {Object} 新增的资源对象
   */
  addResourceByUrl({ type, title, url, description = '' }) {
    // 验证 URL
    if (!this.validateUrl(url)) {
      throw new Error('链接格式不正确');
    }

    // 创建资源对象
    const resource = {
      id: Date.now().toString(),
      type,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      fileName: url.split('/').pop() || 'unknown',
      size: 0,
      uploadDate: new Date().toISOString(),
      storageMode: 'url'
    };

    // 添加到列表
    this.resources.unshift(resource);
    this.saveResources();

    return resource;
  }

  /**
   * 添加资源（Base64 模式）
   * @param {Object} data - 资源数据
   * @param {File} data.file - 文件对象
   * @param {string} data.type - 资源类型
   * @param {string} data.title - 标题
   * @param {string} data.description - 描述
   * @returns {Promise<Object>} 新增的资源对象
   */
  async addResourceByBase64({ file, type, title, description = '' }) {
    // 验证文件类型
    if (!this.validateFileType(file, type)) {
      throw new Error(`不支持的文件类型，请选择${this.typeConfig[type].label}支持的格式`);
    }

    // 验证文件大小
    if (!this.validateFileSize(file)) {
      throw new Error(`文件过大（${this.formatFileSize(file.size)}），建议使用 URL 模式或小于 ${this.formatFileSize(this.options.maxFileSize)} 的文件`);
    }

    // 转换为 Base64
    const url = await this.fileToBase64(file);

    // 创建资源对象
    const resource = {
      id: Date.now().toString(),
      type,
      title: title.trim(),
      description: description.trim(),
      url,
      fileName: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      storageMode: 'base64'
    };

    // 添加到列表
    this.resources.unshift(resource);
    this.saveResources();

    return resource;
  }

  /**
   * 删除资源
   * @param {string} id - 资源 ID
   */
  deleteResource(id) {
    this.resources = this.resources.filter(r => r.id !== id);
    this.saveResources();
  }

  /**
   * 获取资源列表
   * @param {string} filterType - 过滤类型 (all | video | ppt | ai)
   * @returns {Array}
   */
  getResources(filterType = 'all') {
    if (filterType === 'all') {
      return this.resources;
    }
    return this.resources.filter(r => r.type === filterType);
  }

  /**
   * 获取单个资源
   * @param {string} id - 资源 ID
   * @returns {Object|null}
   */
  getResourceById(id) {
    return this.resources.find(r => r.id === id) || null;
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 设置上传模式
   * @param {string} mode - 上传模式 (url | base64)
   */
  setUploadMode(mode) {
    if (['url', 'base64'].includes(mode)) {
      this.uploadMode = mode;
    }
  }

  /**
   * 设置筛选类型
   * @param {string} type - 筛选类型 (all | video | ppt | ai)
   */
  setSelectedType(type) {
    this.selectedType = type;
  }

  /**
   * 获取存储使用情况
   * @returns {Object} { used, total, percentage }
   */
  getStorageInfo() {
    try {
      const used = localStorage.getItem(this.options.storageKey)?.length || 0;
      // 浏览器 localStorage 通常限制在 5MB 左右
      const total = 5 * 1024 * 1024;
      const percentage = ((used / total) * 100).toFixed(2);
      return { used, total, percentage };
    } catch (error) {
      return { used: 0, total: 5 * 1024 * 1024, percentage: 0 };
    }
  }

  /**
   * 清空所有资源
   */
  clearAll() {
    this.resources = [];
    localStorage.removeItem(this.options.storageKey);
  }

  /**
   * 导出资源列表（JSON 格式）
   * @returns {string}
   */
  exportResources() {
    return JSON.stringify(this.resources, null, 2);
  }

  /**
   * 导入资源列表（JSON 格式）
   * @param {string} jsonData - JSON 字符串
   */
  importResources(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) {
        throw new Error('数据格式错误');
      }
      this.resources = [...imported, ...this.resources];
      this.saveResources();
    } catch (error) {
      console.error('导入失败:', error);
      throw new Error('导入失败：数据格式不正确');
    }
  }
}

// 导出到全局对象（如果需要）
if (typeof window !== 'undefined') {
  window.UploadHandler = UploadHandler;
}

// ES6 模块导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UploadHandler;
}
