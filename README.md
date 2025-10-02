# hexo-obsid## 🚀 安装

在 Hexo 项目根目录执行:

```bash
npm install hexo-obsidian-callout --save
```

安装后重启 Hexo 服务器## 🧪 测试与开发

克隆本仓库后,可使用以下命令进行开发:

```bash
npm install
npm test
```

测试覆盖了基本转换、折叠行为与嵌套场景。

## 🔍 故障排查

如果 callout 没有正确渲染,请:

1. **启用调试模式**:
   ```yaml
   obsidian_callout:
     enabled: true
     debug: true
   ```

2. **清除缓存并重新生成**:
   ```bash
   hexo clean
   hexo generate
   ```

3. **检查 Markdown 渲染器配置** (在 `_config.yml` 中):
   ```yaml
   markdown:
     breaks: true  # 建议开启
   ```

4. 查看详细的故障排查指南: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📄 许可证
hexo clean
hexo server
```

> **注意**: 安装后必须运行 `hexo clean` 清除缓存,否则插件可能不会生效。

## ⚙️ 配置

# hexo-obsidian-callout

为 Hexo 博客带来与 Obsidian 原生体验一致的 Callout 呈现效果。该插件会解析文章中的 `[!type]` 块引用语法,生成带有现代化视觉风格、可折叠交互与语义化 HTML 的提示框,并自动注入所需的样式表。

> **🔥 重要提示**: 安装后必须运行 `hexo clean` 清除缓存,否则插件可能不会生效!

## ✨ 特性

## ✨ 特性

- **完整的 Callout 语法支持**：标题、折叠 (`+`/`-`)、嵌套、别名一应俱全。
- **即插即用**：自动发布 `css/hexo-obsidian-callout.css`，可选在 `<head>` 中注入样式链接。
- **无损 Markdown 内容**：保留 Callout 内的 Markdown、代码块、图片与内部引用。
- **现代化 UI**：深色友好的配色、柔和发光的图标、适配移动端的排版。
- **可扩展**：自定义类型别名、覆写图标或完全替换 CSS。

## 🚀 安装

在 Hexo 项目根目录执行：

```bash
npm install hexo-obsidian-callout --save
```

Hexo 会在启动时自动加载该插件；无需额外的 `require` 操作。

## ⚙️ 配置

在站点的 `_config.yml` 中新增（或覆写）以下片段：

```yaml
obsidian_callout:
  enabled: true            # 全局开关
  injectHead: true         # 是否在 </head> 之前自动注入 <link>
  cssPath: css/hexo-obsidian-callout.css
  debug: false
  alias:                   # 可选，自定义别名映射
    faq: question
    idea: tip
  iconSet:                 # 可选，覆写任意类型的图标 SVG
    tip: '<svg viewBox="0 0 16 16" ...>...</svg>'
```

> **提示**：`cssPath` 会同时决定生成的 CSS 文件路径与注入链接的 `href`。若将其修改为 `assets/callout.css`，插件会输出 `public/assets/callout.css` 并注入对应的 `<link>`。

## 🧱 使用

在 Markdown 文章或页面中编写 Obsidian 风格的块引用即可：

````markdown
> [!info] 支持 Markdown
> 可以使用 **加粗**、[链接](#) 与内嵌图片。
>
> - 列表项同样可用
> - 内部引用 `[[wiki-links]]` 也会保留
````

折叠语法：

````markdown
> [!question]- 这是一个可折叠的 Callout？
> 是的，`-` 会默认折叠，`+` 会默认展开。
````

嵌套语法：

````markdown
> [!warning] 外层警告
> > [!todo] 子任务
> > > [!tip] 深层提示
````

## 🗂 支持的类型

| Type / Alias                              | 默认标题 | 背景色   | 图标说明 |
|-------------------------------------------|----------|----------|----------|
| `note`                                    | Note     | `#202A36`| 便签     |
| `abstract`, `summary`, `tldr`             | Abstract | `#1F3232`| 文摘     |
| `info`                                    | Info     | `#1F2B39`| 信息圆形 |
| `todo`                                    | Todo     | `#1F2B39`| 勾选清单 |
| `tip`, `hint`, `important`               | Tip      | `#1F3232`| 灯泡     |
| `success`, `check`, `done`                | Success  | `#26342A`| 对勾     |
| `question`, `help`, `faq`                 | Question | `#372B1F`| 问号     |
| `warning`, `caution`, `attention`         | Warning  | `#372B1F`| 警示符号 |
| `failure`, `fail`, `missing`              | Failure  | `#372426`| 叉号     |
| `danger`, `error`                         | Danger   | `#372426`| 警示三角 |
| `bug`                                     | Bug      | `#372426`| 小虫     |
| `example`                                 | Example  | `#1F2B39`| 光芒     |
| `quote`, `cite`                           | Quote    | `#2F2F2F`| 引文符号 |

使用未列出的类型时，会自动回退到 `note` 风格。

## 🎨 自定义样式

- **覆写 CSS**：在主题或自定义样式文件中添加新的规则即可。
- **图标替换**：在配置的 `iconSet` 中填入任意 SVG 片段（支持 Lucide、Heroicons、Font Awesome SVG 等）。
- **禁用自动注入**：将 `injectHead` 设为 `false`，然后在模板内手动引入：
  
  ```ejs
  <link rel="stylesheet" href="<%= url_for('css/hexo-obsidian-callout.css') %>">
  ```

## 🧪 测试与开发

克隆本仓库后，可使用以下命令进行开发：

```bash
npm install
npm test
```

测试覆盖了基本转换、折叠行为与嵌套场景。

## 📄 许可证

MIT License © 2025
