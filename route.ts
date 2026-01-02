import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

/**
 * 文件上传 API 路由
 *
 * 支持的云存储服务：
 * - Cloudflare R2（推荐，免费）
 * - 阿里云 OSS
 * - 腾讯云 COS
 * - MinIO（自建）
 *
 * 配置说明：
 * 1. 本地开发：在项目根目录创建 .env.local 文件
 * 2. 生产环境：在 Vercel 项目设置中添加环境变量
 *
 * 详细配置指南：
 * - Cloudflare R2：查看 Cloudflare-R2配置指南.md
 * - 其他服务：查看 .env.example 文件
 */

// 初始化对象存储
// 注意：所有配置从环境变量中读取，不要硬编码密钥！
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL || '',
  accessKey: process.env.COZE_ACCESS_KEY_ID || '',
  secretKey: process.env.COZE_ACCESS_KEY_SECRET || '',
  bucketName: process.env.COZE_BUCKET_NAME || '',
  region: 'cn-beijing',
});

/**
 * POST /api/upload - 上传文件
 *
 * 请求参数（FormData）：
 * - file: File（必填）- 要上传的文件
 * - type: 'video' | 'ppt' | 'ai'（必填）- 资源类型
 * - title: string（必填）- 资源标题
 * - description: string（可选）- 资源描述
 *
 * 文件限制：
 * - 视频：.mp4, .webm, .ogg（最大100MB）
 * - PPT：.ppt, .pptx（最大100MB）
 * - AI配置：.html, .json, .txt（最大100MB）
 *
 * 返回：
 * - success: boolean - 是否成功
 * - data: {
 *     id: string - 资源ID
 *     title: string - 标题
 *     description: string - 描述
 *     type: string - 类型
 *     fileKey: string - 存储键
 *     downloadUrl: string - 下载链接（10年有效期）
 *     fileName: string - 原始文件名
 *     size: number - 文件大小（字节）
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' | 'ppt' | 'ai'
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // 验证必填字段
    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    // 只支持三大模块类型
    if (!type || !['video', 'ppt', 'ai'].includes(type)) {
      return NextResponse.json(
        { error: '资源类型无效，只能是 video、ppt 或 ai' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: '请输入资源标题' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedPPTTypes = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const allowedAITypes = ['text/html', 'application/json', 'text/plain'];

    if (type === 'ppt' && !allowedPPTTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'PPT 文件格式不正确，请上传 .ppt 或 .pptx 文件' },
        { status: 400 }
      );
    }

    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '视频文件格式不正确，请上传 .mp4、.webm 或 .ogg 文件' },
        { status: 400 }
      );
    }

    if (type === 'ai' && !allowedAITypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'AI 配置文件格式不正确，请上传 .html、.json 或 .txt 文件' },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 100MB）
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 100MB' },
        { status: 400 }
      );
    }

    // 生成文件名：类型_随机ID.扩展名
    const fileExt = file.name.split('.').pop();
    const uniqueId = crypto.randomUUID().split('-')[0];
    const fileName = `${type}_${uniqueId}.${fileExt}`;

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 上传到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: fileBuffer,
      fileName: `resources/${fileName}`,
      contentType: file.type,
    });

    // 生成访问 URL（永久有效，10年）
    // 315360000 秒 = 10 年 × 365 天 × 24 小时 × 60 分钟 × 60 秒
    const downloadUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 315360000, // 10年，实现永久使用
    });

    // 返回上传成功信息
    return NextResponse.json({
      success: true,
      data: {
        id: `uploaded-${Date.now()}`,
        title,
        description: description || '',
        type,
        fileKey,
        downloadUrl,
        fileName: file.name,
        size: file.size
      }
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败，请重试' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload - 检查服务状态
 *
 * 用于健康检查和配置验证
 *
 * 返回：
 * - status: 'ok' - 服务正常
 * - message: string - 状态消息
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: '文件上传服务正常'
  });
}
