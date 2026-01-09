'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ppt',
    file: null
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, file })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('type', formData.type)
    formDataToSend.append('file', formData.file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        alert('上传成功！')
        router.push(`/resources/${result.id}`)
      } else {
        throw new Error('上传失败')
      }
    } catch (error) {
      alert('上传失败：' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">上传资源</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-2">资源类型</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="ppt">PPT演示文稿</option>
            <option value="video">视频文件</option>
            <option value="ai">AI互动网页</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            选择文件
            {formData.type === 'ppt' && ' (支持 .ppt, .pptx, .pdf)'}
            {formData.type === 'video' && ' (支持 .mp4, .mov, .avi)'}
            {formData.type === 'ai' && ' (支持 .html, .zip)'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            accept={
              formData.type === 'ppt' ? '.ppt,.pptx,.pdf' :
              formData.type === 'video' ? '.mp4,.mov,.avi' :
              '.html,.zip'
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? '上传中...' : '上传'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">上传说明：</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• PPT文件：建议转换为PDF格式以获得最佳兼容性</li>
          <li>• 视频文件：最大支持500MB，建议使用MP4格式</li>
          <li>• AI网页：可上传单个HTML文件或包含所有资源的ZIP包</li>
          <li>• 文件大小限制：所有文件最大1GB</li>
        </ul>
      </div>
    </div>
  )
}