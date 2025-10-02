# Hexo Obsidian Callout - 故障排查指南

如果你的 callout 没有正确渲染,请按照以下步骤进行诊断:

## 1. 启用调试模式

在 Hexo 站点的 `_config.yml` 中添加:

```yaml
obsidian_callout:
  enabled: true
  debug: true  # 启用调试输出
```

然后运行 `hexo clean && hexo generate`，查看终端输出的日志信息。

## 2. 检查插件是否正确安装

在 Hexo 根目录运行:

```bash
npm list hexo-obsidian-callout
```

应该能看到插件的版本信息。

## 3. 测试文章示例

创建一个测试文章 `source/_posts/test-callout.md`:

```markdown
---
title: Callout 测试
date: 2025-01-01
---

## 基础测试

> [!info]
> 这是一个信息提示框

## 带标题的 Callout

> [!tip] 这是自定义标题
> 这是提示内容

## 可折叠的 Callout

> [!question]- 这是一个可折叠的问题框
> 默认是折叠状态

> [!note]+ 这是一个展开的笔记框
> 默认是展开状态

## 嵌套 Callout

> [!warning] 外层警告
> > [!todo] 内层任务
> > 这是嵌套的内容
```

## 4. 检查生成的 HTML

运行 `hexo generate` 后，检查 `public/` 目录下对应的 HTML 文件:

```bash
# Windows PowerShell
cat public/2025/01/01/test-callout/index.html
```

应该能看到类似这样的 HTML 结构:

```html
<div class="hexo-callout hexo-callout--info" data-callout="info">
  <div class="hexo-callout__header">
    <span class="hexo-callout__icon">...</span>
    <span class="hexo-callout__title">Info</span>
  </div>
  <div class="hexo-callout__content">
    <p>这是一个信息提示框</p>
  </div>
</div>
```

如果看到的仍然是 `<blockquote>`，说明插件没有正常工作。

## 5. 检查 CSS 是否加载

访问你的博客，打开浏览器开发者工具:

1. 查看 `<head>` 部分是否有:
   ```html
   <link rel="stylesheet" href="/css/hexo-obsidian-callout.css">
   ```

2. 访问 `http://localhost:4000/css/hexo-obsidian-callout.css` 应该能看到样式文件

## 6. 常见问题

### 问题 1: Callout 没有转换，仍然显示为普通引用块

**可能原因:**
- Markdown 引擎配置问题
- 其他插件冲突
- 插件加载顺序问题

**解决方案:**

检查 `_config.yml` 中的 Markdown 配置:

```yaml
# 如果使用 hexo-renderer-marked
markdown:
  gfm: true
  pedantic: false
  breaks: true  # 建议开启
  smartLists: true
  smartypants: true

# 如果使用 hexo-renderer-markdown-it
markdown:
  preset: 'default'
  render:
    html: true
    xhtmlOut: false
    breaks: true
    linkify: true
    typographer: true
```

### 问题 2: CSS 样式没有生效

**解决方案:**

尝试手动在主题中引入 CSS:

找到主题的 `layout/_partial/head.ejs` 或类似文件,添加:

```ejs
<link rel="stylesheet" href="<%= url_for('/css/hexo-obsidian-callout.css') %>">
```

然后在配置中禁用自动注入:

```yaml
obsidian_callout:
  enabled: true
  injectHead: false
```

### 问题 3: 特定类型的 Callout 不显示

**解决方案:**

确保类型名称拼写正确,支持的类型包括:
- note, abstract, info, todo, tip, success
- question, warning, failure, danger, bug
- example, quote

以及它们的别名:
- summary/tldr → abstract
- hint/important → tip
- check/done → success
- help/faq → question
- caution/attention → warning
- fail/missing → failure
- error → danger
- cite → quote

## 7. 获取更多帮助

如果以上步骤都无法解决问题,请:

1. 提供 `hexo version` 的输出
2. 提供 `npm list hexo-renderer-*` 的输出
3. 提供调试模式下的日志信息
4. 提供生成的 HTML 片段

在 GitHub 仓库创建 issue: https://github.com/你的用户名/hexo-obsidian-callout/issues
