import { notFound } from 'next/navigation'
import { getResourceById } from '@/lib/database'

export default async function ResourcePage({ params }) {
  const resource = await getResourceById(params.id)
  
  if (!resource) {
    notFound()
  }

  const getFileUrl = () => {
    return `/uploads/${resource.fileName}`
  }

  const renderContent = () => {
    switch (resource.type) {
      case 'ppt':
        return (
          <div className="mt-6">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${getFileUrl()}`
              )}`}
              className="w-full h-[600px] border"
              frameBorder="0"
            />
            <div className="mt-4 text-sm text-gray-500">
              <a
                href={getFileUrl()}
                download
                className="text-blue-600 hover:text-blue-800"
              >
                下载原始文件
              </a>
            </div>
          </div>
        )
      
      case 'video':
        return (
          <div className="mt-6">
            <video
              controls
              className="w-full rounded-lg"
              src={getFileUrl()}
            />
            <div className="mt-4 text-sm text-gray-500">
              文件大小: {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )
      
      case 'ai':
        return (
          <div className="mt-6">
            <div className="border rounded-lg p-4 bg-gray-50 mb-4">
              <p className="text-sm text-gray-600">
                AI互动页面 - 如果上传的是ZIP文件，请解压后访问index.html
              </p>
            </div>
            <a
              href={getFileUrl()}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              访问AI互动页面
            </a>
          </div>
        )
      
      default:
        return (
          <div className="mt-6">
            <a
              href={getFileUrl()}
              download
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              下载文件
            </a>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                resource.type === 'ppt' ? 'bg-purple-100 text-purple-800' :
                resource.type === 'video' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {resource.type === 'ppt' ? 'PPT演示' : 
                 resource.type === 'video' ? '视频资源' : 'AI互动'}
              </span>
              <span className="text-sm text-gray-500">
                上传于 {new Date(resource.uploadTime).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{resource.title}</h1>
            <p className="text-gray-600 mt-2">{resource.description}</p>
          </div>
        </div>

        {renderContent()}

        <div className="mt-8 pt-6 border-t">
          <h3 className="font-bold mb-3">文件信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">文件名</p>
              <p>{resource.originalName}</p>
            </div>
            <div>
              <p className="text-gray-500">文件类型</p>
              <p>{resource.mimeType}</p>
            </div>
            <div>
              <p className="text-gray-500">大小</p>
              <p>{(resource.fileSize / 1024).toFixed(2)} KB</p>
            </div>
            <div>
              <p className="text-gray-500">上传时间</p>
              <p>{new Date(resource.uploadTime).toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}