'use client';

import { useState } from 'react';

// 资源类型定义
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'ppt' | 'ai';
  url: string;
  downloadUrl?: string;
}

// 三大技术模块资源数据（初始为空，等待用户上传）
const initialResources: Resource[] = [];

// 适用场景数据
const scenarios = [
  {
    title: '幼儿园课堂',
    description: '老师使用PPT课件进行课堂教学，配合视频微课加深理解',
    icon: '🏫'
  },
  {
    title: '家庭早教',
    description: '家长陪伴孩子观看视频微课，通过AI互动巩固知识',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    title: '课后复习',
    description: '下载PPT课件和视频资源，随时进行课后复习',
    icon: '📚'
  },
  {
    title: 'AI智能辅导',
    description: '利用AI互动工具进行个性化学习辅导',
    icon: '🤖'
  }
];

export default function EarlyChildhoodResources() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resourceList, setResourceList] = useState<Resource[]>(initialResources);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'ppt' | 'ai',
    file: null as File | null
  });

  // 筛选资源
  const filteredResources = selectedType === 'all'
    ? resourceList
    : resourceList.filter(r => r.type === selectedType);

  // 获取资源类型配置
  const getTypeConfig = (type: string) => {
    const configs = {
      video: {
        label: '视频微课',
        emoji: '🎬',
        bgColor: 'bg-purple-50 dark:bg-purple-950',
        textColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200 dark:border-purple-800',
        btnColor: 'bg-purple-500 hover:bg-purple-600'
      },
      ppt: {
        label: 'PPT课件',
        emoji: '📊',
        bgColor: 'bg-blue-50 dark:bg-blue-950',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
        btnColor: 'bg-blue-500 hover:bg-blue-600'
      },
      ai: {
        label: 'AI互动',
        emoji: '🤖',
        bgColor: 'bg-green-50 dark:bg-green-950',
        textColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-800',
        btnColor: 'bg-green-500 hover:bg-green-600'
      }
    };
    return configs[type as keyof typeof configs] || configs.video;
  };

  // 处理文件上传
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.file) {
      alert('请选择要上传的文件');
      return;
    }

    if (!uploadForm.title.trim()) {
      alert('请输入资源标题');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('type', uploadForm.type);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newResource: Resource = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          type: result.data.type,
          url: result.data.downloadUrl,
          downloadUrl: result.data.downloadUrl
        };

        setResourceList([newResource, ...resourceList]);
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          type: 'video',
          file: null
        });

        alert('资源上传成功！');
      } else {
        alert(result.error || '上传失败，请重试');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请检查网络连接');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 装饰性元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🎬</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse">📊</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🤖</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
      </div>

      {/* 主容器 */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 头部：标题和主题介绍 */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center gap-4 text-5xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎬</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>📊</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🤖</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-green-400 sm:text-5xl">
            幼儿教育资源包
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-700 dark:text-gray-300">
            专为3-6岁儿童设计的教学资源库！三大技术模块：视频微课、PPT课件、AI互动，
            帮助孩子快乐学习、健康成长！🌈
          </p>
        </div>

        {/* 资源类型筛选和上传按钮 */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex flex-wrap justify-center gap-3 flex-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              📦 全部资源
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedType === 'video'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🎬 视频微课
            </button>
            <button
              onClick={() => setSelectedType('ppt')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedType === 'ppt'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              📊 PPT课件
            </button>
            <button
              onClick={() => setSelectedType('ai')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedType === 'ai'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🤖 AI互动
            </button>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 animate-pulse"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            上传资源
          </button>
        </div>

        {/* 资源卡片网格 */}
        <div className="mb-16">
          {filteredResources.length === 0 ? (
            // 空白状态提示
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 shadow-xl dark:bg-gray-800">
              <div className="mb-6 text-8xl animate-bounce">📭</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                暂无资源
              </h3>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                {selectedType === 'all'
                  ? '点击右上角的"上传资源"按钮，开始添加您的教学资源'
                  : `还没有${getTypeConfig(selectedType).label}，点击"上传资源"按钮添加吧！`}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 animate-pulse"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                立即上传资源
              </button>
            </div>
          ) : (
            // 资源卡片列表
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => {
                const config = getTypeConfig(resource.type);
                return (
                  <div
                    key={resource.id}
                    className={`overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 dark:bg-gray-800 ${config.borderColor} border-2`}
                  >
                    {/* 卡片头部：类型标签 */}
                    <div className={`${config.bgColor} px-6 py-4`}>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{config.emoji}</span>
                        <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* 卡片内容 */}
                    <div className="p-6">
                      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                        {resource.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">
                        {resource.description}
                      </p>

                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        {resource.type === 'ppt' && resource.downloadUrl && (
                          <a
                            href={resource.downloadUrl}
                            download
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white font-bold transition-all hover:scale-105 ${config.btnColor}`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            下载课件
                          </a>
                        )}
                        {resource.type === 'video' && (
                          <button
                            onClick={() => setPlayingVideo(resource.id)}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white font-bold transition-all hover:scale-105 ${config.btnColor}`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            播放微课
                          </button>
                        )}
                        {resource.type === 'ai' && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white font-bold transition-all hover:scale-105 ${config.btnColor}`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            开始互动
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 适用场景说明 */}
        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-gray-800">
          <h2 className="mb-8 text-center text-3xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-green-400">
            💡 适用场景说明
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-2xl bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700"
              >
                <div className="flex-shrink-0">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500 text-3xl shadow-lg">
                    {scenario.icon}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {scenario.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg mb-2">🎈 三大技术模块 · 智能教育平台 🎈</p>
          <p>© 2024 幼儿教育资源包 | 让每个孩子都快乐学习</p>
        </div>
      </div>

      {/* 视频播放弹窗 */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setPlayingVideo(null)}
        >
          <div className="relative w-full max-w-4xl p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute -top-12 right-4 flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              关闭
            </button>
            <div className="aspect-video w-full rounded-2xl bg-gray-900 flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <p className="text-white text-2xl mb-2">🎬</p>
                <p className="text-white text-lg mb-2">视频播放区域</p>
                <p className="text-gray-400">请配置实际的视频URL</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文件上传弹窗 */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => !uploading && setShowUploadModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !uploading && setShowUploadModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              disabled={uploading}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
              ✨ 上传教学资源
            </h2>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* 资源类型选择 */}
              <div>
                <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  资源类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label
                    className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${
                      uploadForm.type === 'video'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 transform scale-105'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={uploadForm.type === 'video'}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as any })}
                      className="hidden"
                    />
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">视频微课</div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${
                      uploadForm.type === 'ppt'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 transform scale-105'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="ppt"
                      checked={uploadForm.type === 'ppt'}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as any })}
                      className="hidden"
                    />
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">PPT课件</div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${
                      uploadForm.type === 'ai'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950 transform scale-105'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="ai"
                      checked={uploadForm.type === 'ai'}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as any })}
                      className="hidden"
                    />
                    <div className="text-4xl mb-2">🤖</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">AI互动</div>
                  </label>
                </div>
              </div>

              {/* 文件上传 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  选择文件 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    accept={
                      uploadForm.type === 'ppt' ? '.ppt,.pptx' :
                      uploadForm.type === 'video' ? '.mp4,.webm,.ogg' :
                      '.html,.json'
                    }
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    className="block w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-purple-500 file:via-blue-500 file:to-green-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white file:transition-all hover:file:scale-105 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    disabled={uploading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {
                      uploadForm.type === 'ppt' ? '支持 .ppt, .pptx 格式' :
                      uploadForm.type === 'video' ? '支持 .mp4, .webm, .ogg 格式' :
                      '支持 AI 配置文件（.html, .json）'
                    } | 最大文件大小：100MB
                  </p>
                </div>
                {uploadForm.file && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ 已选择：{uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* 资源标题 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  资源标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="例如：小星星儿歌"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  disabled={uploading}
                />
              </div>

              {/* 资源描述 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  资源描述
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="简要描述资源内容..."
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  disabled={uploading}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => !uploading && setShowUploadModal(false)}
                  className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={uploading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadForm.file || !uploadForm.title.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      上传中...
                    </span>
                  ) : (
                    '开始上传'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
