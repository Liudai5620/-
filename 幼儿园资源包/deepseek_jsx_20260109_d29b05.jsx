import Link from 'next/link'
import { getResources } from '@/lib/database'

export default async function Home() {
  const resources = await getResources({ limit: 6 })

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          分享你的知识资源
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          上传PPT演示文稿、教学视频和AI互动网页
        </p>
        <Link
          href="/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          开始上传
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">最新资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  resource.type === 'ppt' ? 'bg-purple-100 text-purple-800' :
                  resource.type === 'video' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {resource.type === 'ppt' ? 'PPT' : 
                   resource.type === 'video' ? '视频' : 'AI网页'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              <Link
                href={`/resources/${resource.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                查看详情 →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="font-bold text-lg mb-2">PPT演示</h3>
          <p>上传和分享演示文稿，支持多种格式</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="font-bold text-lg mb-2">视频资源</h3>
          <p>分享教学视频和演示录像</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="font-bold text-lg mb-2">AI互动</h3>
          <p>上传交互式AI网页应用</p>
        </div>
      </section>
    </div>
  )
}