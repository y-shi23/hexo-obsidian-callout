# Hexo Obsidian Callout - 完整使用指南

## 📚 目录

1. [快速开始](#快速开始)
2. [安装步骤](#安装步骤)
3. [配置说明](#配置说明)
4. [使用示例](#使用示例)
5. [常见问题](#常见问题)
6. [故障排查](#故障排查)

---

## 快速开始

### 1. 安装插件

在你的 Hexo 博客根目录执行:

```bash
npm install hexo-obsidian-callout --save
```

### 2. 配置插件

在 `_config.yml` 中添加:

```yaml
obsidian_callout:
  enabled: true
  debug: true  # 首次使用建议开启,用于排查问题
```

### 3. 清除缓存并生成

```bash
hexo clean
hexo generate
hexo server
```

### 4. 创建测试文章

创建 `source/_posts/test-callout.md`:

```markdown
---
title: Callout 测试
---

> [!info]
> 这是一个信息提示框
```

访问 `http://localhost:4000` 查看效果。

---

## 安装步骤

### 前提条件

- Hexo 版本 >= 5.0.0
- Node.js 版本 >= 12.0.0

### 安装命令

```bash
# 1. 进入 Hexo 项目根目录
cd your-hexo-blog

# 2. 安装插件
npm install hexo-obsidian-callout --save

# 3. 验证安装
npm list hexo-obsidian-callout
```

### 验证安装

运行诊断脚本:

```bash
node node_modules/hexo-obsidian-callout/diagnose.js
```

---

## 配置说明

### 基础配置

```yaml
obsidian_callout:
  enabled: true            # 启用/禁用插件
  injectHead: true         # 自动注入 CSS 到 <head>
  cssPath: css/hexo-obsidian-callout.css  # CSS 文件路径
  debug: false             # 调试模式
```

### 自定义别名

```yaml
obsidian_callout:
  enabled: true
  alias:
    idea: tip              # [!idea] 映射到 tip 样式
    discuss: question      # [!discuss] 映射到 question 样式
    critical: danger       # [!critical] 映射到 danger 样式
```

### 自定义图标

```yaml
obsidian_callout:
  enabled: true
  iconSet:
    tip: '<svg>...</svg>'  # 自定义 tip 图标
    note: '<svg>...</svg>' # 自定义 note 图标
```

### Markdown 渲染器配置

#### hexo-renderer-marked (默认)

```yaml
markdown:
  gfm: true
  pedantic: false
  breaks: true              # 重要!
  smartLists: true
  smartypants: true
```

#### hexo-renderer-markdown-it

```yaml
markdown:
  preset: 'default'
  render:
    html: true
    breaks: true            # 重要!
    linkify: true
    typographer: true
```

---

## 使用示例

### 基础 Callout

```markdown
> [!info]
> 这是一个信息提示框
```

### 自定义标题

```markdown
> [!tip] 这是自定义标题
> 这是提示内容
```

### 可折叠 Callout

```markdown
> [!question]- 这是一个默认折叠的问题
> 点击标题可以展开

> [!note]+ 这是一个默认展开的笔记
> 点击标题可以折叠
```

### 带 Markdown 的 Callout

```markdown
> [!warning] 支持 Markdown
> 这里可以使用 **加粗**、*斜体*、[链接](https://example.com)
>
> - 列表项 1
> - 列表项 2
>
> ```javascript
> console.log('代码块也支持');
> ```
```

### 嵌套 Callout

```markdown
> [!warning] 外层警告
> 这是外层内容
> 
> > [!todo] 内层任务
> > 这是内层内容
> > 
> > > [!tip] 深层提示
> > > 可以多层嵌套
```

### 支持的类型

| 类型 | 别名 | 用途 |
|------|------|------|
| note | - | 笔记 |
| abstract | summary, tldr | 摘要 |
| info | - | 信息 |
| todo | - | 待办 |
| tip | hint, important | 提示 |
| success | check, done | 成功 |
| question | help, faq | 问题 |
| warning | caution, attention | 警告 |
| failure | fail, missing | 失败 |
| danger | error | 危险 |
| bug | - | Bug |
| example | - | 示例 |
| quote | cite | 引用 |

---

## 常见问题

### Q1: Callout 没有渲染,仍然显示为普通引用块?

**A:** 请按以下步骤排查:

1. 确认插件已安装: `npm list hexo-obsidian-callout`
2. 确认配置正确: 检查 `_config.yml` 中 `enabled: true`
3. 清除缓存: `hexo clean`
4. 启用调试: 在配置中添加 `debug: true`
5. 重新生成: `hexo generate --debug`

### Q2: CSS 样式没有生效?

**A:** 检查以下几点:

1. 确认 CSS 文件已生成: 访问 `/css/hexo-obsidian-callout.css`
2. 检查是否自动注入: 查看页面源代码中是否有 `<link>` 标签
3. 如果没有自动注入,尝试手动引入:
   ```yaml
   obsidian_callout:
     injectHead: false
   ```
   然后在主题中手动添加:
   ```ejs
   <link rel="stylesheet" href="<%= url_for('/css/hexo-obsidian-callout.css') %>">
   ```

### Q3: 某些 Callout 类型不显示?

**A:** 
- 检查类型名称拼写
- 使用小写字母
- 参考支持的类型列表
- 如果使用别名,确保拼写正确

### Q4: 与其他插件冲突?

**A:**
- 尝试调整插件加载顺序
- 禁用其他可能修改 blockquote 的插件
- 在 GitHub 提交 issue 说明冲突情况

### Q5: 部署后样式丢失?

**A:**
- 确保 `public/css/hexo-obsidian-callout.css` 文件已上传
- 检查 CDN 缓存设置
- 确认相对路径正确

---

## 故障排查

### 启用调试模式

```yaml
obsidian_callout:
  enabled: true
  debug: true
```

然后运行:

```bash
hexo clean
hexo generate --debug
```

查看日志输出,寻找类似以下的信息:

```
INFO  [hexo-obsidian-callout] Processing: test-callout
INFO  [hexo-obsidian-callout] Found blockquotes: 3
INFO  [hexo-obsidian-callout] Content transformed successfully
```

### 运行诊断脚本

```bash
node node_modules/hexo-obsidian-callout/diagnose.js
```

### 检查生成的 HTML

查看 `public/` 目录下的 HTML 文件,搜索:

- `<div class="hexo-callout"` - 应该找到转换后的 callout
- `<blockquote>` - 不应该包含 `[!type]` 标记

### 查看详细文档

- [故障排查指南](./TROUBLESHOOTING.md)
- [配置说明](./CONFIGURATION.md)
- [GitHub Issues](https://github.com/y-shi23/hexo-obsidian-callout/issues)

---

## 获取帮助

如果以上方法都无法解决问题:

1. 收集以下信息:
   - Hexo 版本: `hexo version`
   - Node.js 版本: `node --version`
   - 插件版本: `npm list hexo-obsidian-callout`
   - Markdown 渲染器: `npm list hexo-renderer-*`
   - 调试日志输出

2. 在 GitHub 提交 issue:
   https://github.com/y-shi23/hexo-obsidian-callout/issues

3. 提供:
   - 问题描述
   - 配置文件内容
   - 测试文章内容
   - 生成的 HTML 片段
   - 调试日志

---

## 贡献

欢迎提交 Pull Request 或 Issue!

## 许可证

MIT License
