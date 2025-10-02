# 🚨 快速修复：Callout 被渲染为引用块

## 问题
你在 Hexo 文章中使用 `> [!info]` 语法，但页面上显示的是普通引用块，而不是 callout 样式。

## 快速修复步骤

### 1. 立即执行（最常见的解决方案）

```bash
# 在 Hexo 博客根目录执行
hexo clean
hexo generate
hexo server
```

**为什么**: Hexo 会缓存生成的内容，`hexo clean` 会清除所有缓存。

---

### 2. 如果步骤 1 无效，启用调试模式

编辑你的 Hexo 博客的 `_config.yml`：

```yaml
obsidian_callout:
  enabled: true
  debug: true     # 添加这一行
```

然后运行：

```bash
hexo clean
hexo generate --debug
```

查看输出中是否有 `[hexo-obsidian-callout]` 开头的日志。

---

### 3. 检查插件是否正确安装

```bash
cd your-hexo-blog
npm list hexo-obsidian-callout
```

**如果显示 "empty"**，说明没有安装，运行：
```bash
npm install hexo-obsidian-callout --save
hexo clean
```

**如果显示版本号**，说明已安装，继续下一步。

---

### 4. 验证 Markdown 语法

确保你的 Markdown 格式正确：

**✅ 正确的格式：**
```markdown
> [!info]
> 这是内容
```

**❌ 错误的格式：**
```markdown
>[!info]        # ❌ > 后面需要空格
> [ !info]      # ❌ [ 和 ! 之间不能有空格
> [! info]      # ❌ ! 和 info 之间不能有空格
>[!info]这是内容  # ❌ 内容需要另起一行
```

---

### 5. 检查 Markdown 渲染器配置

在 `_config.yml` 中确认或添加：

```yaml
markdown:
  gfm: true
  breaks: true    # 重要！这一项必须开启
  smartLists: true
```

---

### 6. 完整测试文件

创建 `source/_posts/test-callout.md`：

```markdown
---
title: Callout 测试
date: 2025-01-01
---

> [!info]
> 这是一个信息框

> [!tip] 自定义标题
> 这是提示内容
```

运行：
```bash
hexo clean
hexo generate
hexo server
```

访问 `http://localhost:4000` 查看测试文章。

---

### 7. 检查生成的 HTML

打开 `public/2025/01/01/test-callout/index.html`

**查找失败（插件未工作）：**
```html
<blockquote>
  <p>[!info]</p>
  <p>这是一个信息框</p>
</blockquote>
```

**查找成功（插件已工作）：**
```html
<div class="hexo-callout hexo-callout--info">
  <div class="hexo-callout__header">
    ...
  </div>
</div>
```

---

## 常见原因和解决方案

| 问题 | 检查方法 | 解决方案 |
|------|---------|---------|
| 缓存问题 | 修改后没有运行 hexo clean | 运行 `hexo clean` |
| 插件未安装 | `npm list hexo-obsidian-callout` 显示 empty | 运行 `npm install hexo-obsidian-callout --save` |
| 插件被禁用 | `_config.yml` 中 `enabled: false` | 改为 `enabled: true` |
| Markdown 语法错误 | 检查 `> [!info]` 格式 | 确保 `>` 后有空格，`[!` 紧挨 |
| 渲染器配置 | `breaks` 未开启 | 在 _config.yml 中设置 `breaks: true` |

---

## 一键诊断脚本

将以下内容保存为 `check-callout.ps1`，在 Hexo 博客根目录运行：

```powershell
# 检查插件安装
Write-Host "=== 检查插件安装 ===" -ForegroundColor Cyan
npm list hexo-obsidian-callout

# 检查配置
Write-Host "`n=== 检查配置 ===" -ForegroundColor Cyan
if (Test-Path "_config.yml") {
    Select-String "obsidian_callout" _config.yml -Context 0,3
} else {
    Write-Host "未找到 _config.yml" -ForegroundColor Red
}

# 清理并生成
Write-Host "`n=== 清理并生成 ===" -ForegroundColor Cyan
hexo clean
hexo generate --debug 2>&1 | Select-String "hexo-obsidian-callout"

# 检查 CSS
Write-Host "`n=== 检查 CSS 文件 ===" -ForegroundColor Cyan
if (Test-Path "public/css/hexo-obsidian-callout.css") {
    Write-Host "✅ CSS 文件已生成" -ForegroundColor Green
    $cssSize = (Get-Item "public/css/hexo-obsidian-callout.css").Length
    Write-Host "   文件大小: $cssSize bytes"
} else {
    Write-Host "❌ CSS 文件未生成" -ForegroundColor Red
}

Write-Host "`n=== 完成 ===" -ForegroundColor Cyan
```

运行：
```powershell
.\check-callout.ps1
```

---

## 仍然无法解决？

如果以上所有步骤都尝试过仍然无法解决，请：

1. 在你的 Hexo 博客根目录运行：
   ```bash
   hexo version > env-info.txt
   npm list hexo-obsidian-callout >> env-info.txt
   npm list hexo-renderer-marked >> env-info.txt
   ```

2. 将 `_config.yml` 中的 `obsidian_callout` 配置复制下来

3. 提供一个无法工作的测试文章的 Markdown 内容

4. 运行 `hexo generate --debug` 并保存输出

5. 在 GitHub 提交 issue，附上以上信息

---

## 立即验证

最快的验证方法：

```bash
# 1. 确保插件已安装
npm install hexo-obsidian-callout --save

# 2. 清理缓存
hexo clean

# 3. 生成并启动
hexo generate && hexo server
```

然后访问你的文章页面，按 F12 打开开发者工具：

1. 在 Elements 标签中搜索 `hexo-callout`
2. 如果找到，说明插件工作了，可能是 CSS 问题
3. 如果没找到，说明插件没有转换内容

---

**提示**: 95% 的问题可以通过 `hexo clean` 解决！
