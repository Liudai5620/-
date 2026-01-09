import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { saveResource } from '@/lib/database'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const description = formData.get('description')
    const type = formData.get('type')

    if (!file) {
      return NextResponse.json(
        { error: '请选择文件' },
        { status: 400 }
      )
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const fileId = uuidv4()
    const fileExt = path.extname(file.name)
    const fileName = `${fileId}${fileExt}`
    const filePath = path.join(uploadDir, fileName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 保存到数据库
    const resource = {
      id: fileId,
      title,
      description,
      type,
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadTime: new Date().toISOString()
    }

    await saveResource(resource)

    return NextResponse.json({
      success: true,
      id: fileId,
      fileName
    })

  } catch (error) {
    console.error('上传错误:', error)
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    )
  }
}