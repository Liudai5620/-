import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            资源分享平台
          </Link>
          
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600">
              首页
            </Link>
            <Link href="/upload" className="hover:text-blue-600">
              上传
            </Link>
            <Link href="/resources" className="hover:text-blue-600">
              所有资源
            </Link>
            <div className="flex gap-2">
              <Link 
                href="/resources?type=ppt"
                className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
              >
                PPT
              </Link>
              <Link 
                href="/resources?type=video"
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                视频
              </Link>
              <Link 
                href="/resources?type=ai"
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                AI
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}