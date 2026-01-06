# 幼儿教育资源包 - GitHub Pages 部署指南

## 📋 目录
- [简介](#简介)
- [项目特点](#项目特点)
- [部署到 GitHub Pages](#部署到-github-pages)
- [管理资源](#管理资源)
- [部署更新](#部署更新)
- [常见问题](#常见问题)

---

## 简介

这是一个专为3-6岁儿童设计的私有教育资源展示网站，采用纯静态HTML技术，无需后端服务器，可以免费部署到GitHub Pages。

**主要功能：**
- 🎬 视频微课展示
- 📊 PPT课件展示
- 🤖 AI互动页面展示
- 🔒 仅展示您指定的资源，无上传功能
- 🌓 深色模式支持
- 📱 响应式设计，支持所有设备

**核心特点：**
- ✅ 完全免费托管
- ✅ 通过配置文件管理资源
- ✅ 支持任何可访问的URL链接
- ✅ 无上传功能，保证资源安全可控

---

## 项目特点

### 🔒 私有资源展示
- 无上传功能，他人无法添加资源
- 仅展示您在 `resources.js` 中配置的资源
- 安全、可控的资源展示平台

### 简单的资源管理
- 编辑 `resources.js` 文件即可添加/删除资源
- 支持3种资源类型：视频、PPT、AI互动
- 支持网盘链接、直链、网页URL等多种形式

---

## 部署到 GitHub Pages

### 方法一：使用 GitHub Desktop（推荐新手）

#### 步骤 1：准备文件
1. 在电脑上创建一个新文件夹，例如 `education-resources`
2. 将以下文件复制到该文件夹：
   - `index.html`
   - `resources.js`
   - `README.md`（可选）

#### 步骤 2：创建 GitHub 仓库
1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `education-resources`（或你喜欢的名称）
   - 勾选 "Public"（公开仓库才能使用免费GitHub Pages）
   - 勾选 "Add a README file"
4. 点击 "Create repository"

#### 步骤 3：使用 GitHub Desktop 上传
1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop，点击 "File" → "Add Local Repository"
3. 选择你创建的 `education-resources` 文件夹
4. 在左侧栏会看到你的更改
5. 在 "Summary" 输入："初始部署教育资源网站"
6. 点击 "Commit to main"
7. 点击 "Publish repository"
8. 选择你的 GitHub 账户和仓库
9. 点击 "Publish repository"

#### 步骤 4：启用 GitHub Pages
1. 在 GitHub 网站上打开你的仓库
2. 点击顶部的 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Build and deployment" 下：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 `main` (或 `master`)，目录选择 `/ (root)`
5. 点击 "Save"

5-10分钟后，你的网站将在以下地址可用：
```
https://你的用户名.github.io/education-resources/
```

---

### 方法二：使用命令行（推荐有Git经验的用户）

#### 步骤 1：准备文件
```bash
mkdir education-resources
cd education-resources

# 将你的文件复制到此目录
# index.html
# resources.js
# README.md（可选）
```

#### 步骤 2：初始化 Git 仓库
```bash
git init
git add .
git commit -m "初始部署教育资源网站"
```

#### 步骤 3：连接到 GitHub
```bash
# 在 GitHub 创建新仓库后，运行以下命令
git remote add origin https://github.com/你的用户名/education-resources.git
git branch -M main
git push -u origin main
```

#### 步骤 4：启用 GitHub Pages
与方法一的步骤 4 相同

---

### 方法三：使用 Netlify Drop（最简单）

如果你不想使用 GitHub，可以使用 Netlify Drop：

1. 将以下文件放在一个文件夹中：
   - `index.html`
   - `resources.js`

2. 访问 [Netlify Drop](https://app.netlify.com/drop)

3. 将文件夹拖拽到页面上的拖拽区域

4. 等待几秒钟，你的网站就会自动部署！

5. Netlify 会给你一个随机网址，可以免费自定义域名

---

## 管理资源

### 添加资源

#### 步骤 1：编辑配置文件
打开 `resources.js` 文件，在 `resources` 数组中添加新资源：

```javascript
const resources = [
    // 现有资源...

    // 添加新资源
    {
        id: 10,                    // 唯一ID
        name: '新资源名称',         // 资源名称
        type: 'video',            // 类型：video/ppt/ai
        url: '资源链接',           // 网盘链接或直链
        description: '资源描述',   // 可选
        date: '2025-01-20'        // 可选
    }
];
```

#### 资源类型说明
- `video`：视频微课（.mp4, .webm, .ogg）
- `ppt`：PPT课件（.ppt, .pptx）
- `ai`：AI互动（.html, .json, .txt）

#### 步骤 2：保存文件
保存 `resources.js` 文件

#### 步骤 3：部署更新
参考 [部署更新](#部署更新) 章节重新部署

### 删除资源

直接从 `resources` 数组中删除对应的资源对象即可：

```javascript
const resources = [
    {
        id: 1,
        name: '要删除的资源',
        type: 'video',
        url: 'xxx',
        // ...
    },
    // 删除上面的整个对象
];
```

### 修改资源

直接修改对应资源的字段值：

```javascript
const resources = [
    {
        id: 1,
        name: '修改后的名称',  // 修改名称
        type: 'video',
        url: '新的链接',      // 修改链接
        description: '新的描述',
        date: '2025-01-21'    // 修改日期
    }
];
```

### 批量添加资源

一次性添加多个资源：

```javascript
const resources = [
    // 资源1
    {
        id: 1,
        name: '资源1',
        type: 'video',
        url: 'https://...',
        date: '2025-01-20'
    },

    // 资源2
    {
        id: 2,
        name: '资源2',
        type: 'ppt',
        url: 'https://...',
        date: '2025-01-21'
    },

    // 资源3
    {
        id: 3,
        name: '资源3',
        type: 'ai',
        url: 'https://...',
        date: '2025-01-22'
    }
];
```

---

## 部署更新

### 方法 1：使用 GitHub Desktop

1. 打开 GitHub Desktop
2. 确保当前仓库是 `education-resources`
3. 你会看到修改的文件
4. 在 "Summary" 输入更新说明，如："添加新视频资源"
5. 点击 "Commit to main"
6. 点击 "Push origin" 上传到GitHub
7. 等待 5-10 分钟，GitHub Pages 自动更新

### 方法 2：使用命令行

```bash
# 进入项目目录
cd education-resources

# 提交更改
git add .
git commit -m "更新资源列表"

# 推送到GitHub
git push
```

### 方法 3：直接在 GitHub 网页编辑

1. 在 GitHub 网站上打开你的仓库
2. 找到 `resources.js` 文件
3. 点击文件右侧的铅笔图标 ✏️
4. 在线编辑文件内容
5. 在页面底部输入提交信息
6. 点击 "Commit changes"

### 更新时间
- GitHub Pages 自动部署：5-10 分钟
- Netlify Drop：几乎实时（几秒钟）

---

## 使用指南

### 查看资源

1. 在网站上点击对应资源的 "👀 查看" 按钮
2. 资源会在新标签页打开

### 筛选资源

点击顶部的筛选按钮：
- 全部：显示所有资源
- 视频：仅显示视频微课
- PPT：仅显示PPT课件
- AI：仅显示AI互动

### 切换主题

点击 "🌙 切换主题" 按钮切换明暗主题。

---

## 常见问题

### Q1: GitHub Pages 是免费的吗？
A: 是的！公开仓库的 GitHub Pages 完全免费，支持自定义域名。

### Q2: 我能添加多少资源？
A: 理论上无限制，取决于您的网盘和存储服务容量。

### Q3: 他人可以上传资源吗？
A: 不可以。这是私有资源展示版，只有您可以通过编辑配置文件添加资源。

### Q4: 支持哪些链接格式？
A: 支持任何可通过URL访问的链接：
- 网盘分享链接（百度网盘、腾讯微云、阿里云盘等）
- 文件直链（对象存储、CDN）
- 在线页面（AI互动页、H5页面等）

### Q5: 如何自定义域名？
A:
1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容填写你的域名，如 `www.example.com`
3. 在域名DNS设置中添加 CNAME 记录指向 `你的用户名.github.io`

### Q6: 能在手机上使用吗？
A: 完全可以！网站采用响应式设计，完美适配手机、平板和电脑。

### Q7: 资源链接会失效吗？
A: 取决于链接类型：
- 网盘分享链接：有时效性，需注意续期
- 直链：长期有效，取决于您的云存储服务
- 建议定期检查链接有效性

### Q8: 如何备份我的资源配置？
A: 复制 `resources.js` 文件保存到本地或云端即可。

### Q9: 支持HTTPS吗？
A: GitHub Pages 默认提供 HTTPS，完全免费。

### Q10: 能否多人共享同一个网站？
A: 可以共享网站地址，所有人都能看到您展示的资源。但不能上传新资源。

---

## 进阶技巧

### 自定义主题颜色

在 `index.html` 中修改以下颜色值：

```css
/* 主色调 */
#667eea  /* 主题紫色 */
#764ba2  /* 辅助紫色 */

/* 模块颜色 */
#ff6b6b  /* 视频红色 */
#4ecdc4  /* PPT青色 */
#ffe66d  /* AI黄色 */
```

### 批量导入资源

如果您有 JSON 格式的资源列表，可以快速转换：

1. 将您的资源转换为标准格式
2. 复制到 `resources.js` 的 `resources` 数组中
3. 部署更新

### 添加分类标签

可以在资源对象中添加自定义字段：

```javascript
{
    id: 1,
    name: '认识数字',
    type: 'video',
    url: 'https://...',
    category: '数学',        // 自定义分类
    level: '3-4岁',          // 适合年龄
    tags: ['数字', '认知']   // 标签
}
```

---

## 部署检查清单

在部署前，请确认：
- [ ] 已创建 `index.html` 文件
- [ ] 已创建 `resources.js` 文件
- [ ] 已在 `resources.js` 中添加您的资源
- [ ] 文件编码为 UTF-8
- [ ] 已创建 GitHub 仓库（公开）
- [ ] 已在 Settings → Pages 启用 GitHub Pages
- [ ] 等待 5-10 分钟让部署完成
- [ ] 测试网站是否可以访问
- [ ] 测试资源链接是否可用

---

## 故障排除

### 问题 1：GitHub Pages 显示 404

**解决方案：**
1. 确认文件名为 `index.html`（小写）
2. 确认文件在仓库根目录（不是子目录）
3. 等待 5-10 分钟让 GitHub 处理部署
4. 检查 Settings → Pages 配置是否正确

### 问题 2：资源无法打开

**解决方案：**
1. 检查链接是否正确
2. 检查网盘链接是否过期
3. 尝试在浏览器直接打开链接
4. 检查链接是否需要提取码或密码

### 问题 3：资源不显示

**解决方案：**
1. 检查 `resources.js` 文件格式是否正确
2. 确认 JavaScript 语法无误（使用 JSON 验证工具）
3. 打开浏览器开发者工具查看控制台错误
4. 刷新页面或清除缓存

### 问题 4：更新后网站没变化

**解决方案：**
1. 检查是否成功推送到 GitHub
2. 等待 5-10 分钟让 GitHub Pages 更新
3. 强制刷新浏览器（Ctrl+F5）
4. 清除浏览器缓存

### 问题 5：链接点击无反应

**解决方案：**
1. 检查是否被浏览器弹窗拦截
2. 确认链接格式正确（http:// 或 https://）
3. 尝试右键选择"在新标签页打开"

---

## 最佳实践

### 1. 资源组织
- 按主题或学科分类添加资源
- 为每个资源添加清晰的描述
- 使用有意义的资源名称

### 2. 链接管理
- 使用稳定的云存储服务
- 定期检查网盘链接时效性
- 保存重要资源的备份

### 3. 版本控制
- 每次更新资源时添加有意义的提交信息
- 定期创建备份分支
- 保留历史版本

### 4. 测试部署
- 部署后检查所有资源链接
- 在不同浏览器中测试兼容性
- 在手机端测试响应式布局

---

## 结语

恭喜你！现在你已经拥有了一个完全免费的幼儿教育资源展示网站。

**关键要点：**
1. 所有资源在 `resources.js` 中配置
2. 修改后重新部署即可更新
3. 支持任何可访问的URL链接
4. 定期检查链接有效性

祝你的教育事业蒸蒸上上！🎉

---

*最后更新：2025年*
