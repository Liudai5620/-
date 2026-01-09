import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// 初始化数据库
let db = null

async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'data', 'resources.db'),
      driver: sqlite3.Database
    })
    
    // 创建表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        fileName TEXT NOT NULL,
        originalName TEXT NOT NULL,
        fileSize INTEGER,
        mimeType TEXT,
        uploadTime TEXT
      )
    `)
  }
  return db
}

export async function saveResource(resource) {
  const db = await getDb()
  await db.run(
    `INSERT INTO resources 
     (id, title, description, type, fileName, originalName, fileSize, mimeType, uploadTime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      resource.id,
      resource.title,
      resource.description,
      resource.type,
      resource.fileName,
      resource.originalName,
      resource.fileSize,
      resource.mimeType,
      resource.uploadTime
    ]
  )
}

export async function getResources({ limit = 20, offset = 0 } = {}) {
  const db = await getDb()
  return await db.all(
    `SELECT * FROM resources 
     ORDER BY uploadTime DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  )
}

export async function getResourceById(id) {
  const db = await getDb()
  return await db.get('SELECT * FROM resources WHERE id = ?', [id])
}

export async function getResourcesByType(type) {
  const db = await getDb()
  return await db.all(
    'SELECT * FROM resources WHERE type = ? ORDER BY uploadTime DESC',
    [type]
  )
}