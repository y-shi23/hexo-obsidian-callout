# 示例配置文件

将以下配置添加到你的 Hexo 站点的 `_config.yml` 文件中:

## 基础配置 (推荐)

```yaml
# Hexo Obsidian Callout 插件配置
obsidian_callout:
  enabled: true            # 启用插件
  injectHead: true         # 自动在 <head> 中注入 CSS
  cssPath: css/hexo-obsidian-callout.css  # CSS 文件路径
  debug: false             # 生产环境关闭调试
```

## 调试配置

```yaml
obsidian_callout:
  enabled: true
  debug: true              # 启用调试输出,查看日志信息
  injectHead: true
```

## 自定义别名

```yaml
obsidian_callout:
  enabled: true
  alias:
    idea: tip              # [!idea] 使用 tip 样式
    discuss: question      # [!discuss] 使用 question 样式
    critical: danger       # [!critical] 使用 danger 样式
```

## 自定义图标

```yaml
obsidian_callout:
  enabled: true
  iconSet:
    # 使用自定义 SVG 图标替换默认图标
    tip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>'
```

## 完整配置示例

```yaml
obsidian_callout:
  enabled: true
  injectHead: true
  cssPath: css/hexo-obsidian-callout.css
  debug: false
  
  # 自定义类型别名
  alias:
    idea: tip
    discuss: question
    critical: danger
    
  # 自定义图标 (可选)
  iconSet: {}
```

## Markdown 渲染器配置

为了确保 callout 正常工作,建议配置 Markdown 渲染器:

### 如果使用 hexo-renderer-marked (默认)

```yaml
markdown:
  gfm: true
  pedantic: false
  breaks: true              # 重要: 建议开启换行支持
  smartLists: true
  smartypants: true
```

### 如果使用 hexo-renderer-markdown-it

```yaml
markdown:
  preset: 'default'
  render:
    html: true
    xhtmlOut: false
    breaks: true            # 重要: 建议开启换行支持
    linkify: true
    typographer: true
```

## 主题兼容性

某些主题可能需要额外配置。如果自动注入不工作,可以手动引入:

```yaml
obsidian_callout:
  enabled: true
  injectHead: false         # 禁用自动注入
```

然后在主题的 `head.ejs` 或 `header.ejs` 中添加:

```ejs
<link rel="stylesheet" href="<%= url_for('/css/hexo-obsidian-callout.css') %>">
```

## 性能优化

如果你的博客文章很多,可以考虑:

1. 仅在需要的文章中使用 callout
2. 生产环境关闭 debug 模式
3. 使用 CDN 托管 CSS 文件

## 部署注意事项

确保在部署前运行:

```bash
hexo clean
hexo generate
```

这样可以确保所有文章都重新处理,callout 正确渲染。
