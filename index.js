'use strict';

const path = require('path');
const fs = require('fs');
const transformCallouts = require('./lib/transform');
const { mergeConfig, buildIconSet, TYPE_ALIASES, BASE_TYPES } = require('./lib/utils');

module.exports = function register(hexo) {
  const defaultConfig = {
    enabled: true,
    injectHead: true,
    cssPath: 'css/hexo-obsidian-callout.css',
    iconSet: {},
    alias: {},
    debug: false
  };

  const userConfig = hexo.config.obsidian_callout || {};
  const config = mergeConfig(defaultConfig, userConfig);

  // 始终输出插件加载信息
  hexo.log.info('[hexo-obsidian-callout] Plugin loaded, version 0.1.3');
  hexo.log.info('[hexo-obsidian-callout] Enabled:', config.enabled);
  hexo.log.info('[hexo-obsidian-callout] Debug mode:', config.debug);

  if (!config.enabled) {
    hexo.log.warn('[hexo-obsidian-callout] Plugin is disabled in config');
    return;
  }

  const cssPath = config.cssPath.replace(/^[\\/]+/, '');
  const absoluteCssSource = path.join(__dirname, 'styles', 'callout.css');

  const iconSet = buildIconSet(config.iconSet);
  const aliasMap = Object.assign({}, TYPE_ALIASES, normalizeAliases(config.alias));

  // Register filter with higher priority to ensure it runs
  hexo.extend.filter.register('after_post_render', function calloutFilter(data) {
    if (!data || !data.content) return data;
    
    if (config.debug) {
      hexo.log.info('[hexo-obsidian-callout] Processing:', data.title || data.path || 'unknown');
      const blockquoteCount = (data.content.match(/<blockquote>/gi) || []).length;
      hexo.log.info('[hexo-obsidian-callout] Found blockquotes:', blockquoteCount);
      
      // 输出前100个字符用于调试
      if (blockquoteCount > 0) {
        const firstBlockquote = data.content.match(/<blockquote>[\s\S]{0,200}/i);
        if (firstBlockquote) {
          hexo.log.info('[hexo-obsidian-callout] First blockquote preview:', firstBlockquote[0]);
        }
      }
    }
    
    const originalContent = data.content;
    data.content = transformCallouts(data.content, {
      iconSet,
      aliasMap,
      debug: config.debug
    });
    
    if (config.debug && originalContent !== data.content) {
      hexo.log.info('[hexo-obsidian-callout] Content transformed successfully');
      const calloutCount = (data.content.match(/class="hexo-callout"/gi) || []).length;
      hexo.log.info('[hexo-obsidian-callout] Created callouts:', calloutCount);
    } else if (config.debug) {
      hexo.log.warn('[hexo-obsidian-callout] No transformation occurred');
    }
    
    return data;
  }, 5); // Lower priority number = runs earlier
  
  hexo.log.info('[hexo-obsidian-callout] Registered after_post_render filter with priority 5');

  hexo.extend.generator.register('hexo-obsidian-callout-css', () => {
    const cssContent = fs.readFileSync(absoluteCssSource, 'utf8');
    return {
      path: cssPath,
      data: cssContent
    };
  });

  if (config.injectHead) {
    hexo.extend.filter.register('after_render:html', function injectHtmlHead(str) {
      if (typeof str !== 'string') return str;
      const href = buildAssetUrl(hexo.config.root || '/', cssPath);
      if (str.includes(href)) return str;
      const linkTag = `\n<link rel="stylesheet" href="${href}">`;
      if (str.includes('</head>')) {
        return str.replace('</head>', `${linkTag}\n</head>`);
      }
      return `${linkTag}\n${str}`;
    });
  }
};

function buildAssetUrl(root, assetPath) {
  const normalizedRoot = root ? (root.endsWith('/') ? root : `${root}/`) : '/';
  const sanitizedPath = assetPath.replace(/^\//, '');
  return `${normalizedRoot}${sanitizedPath}`.replace(/\\/g, '/');
}

function normalizeAliases(customAlias) {
  const normalized = {};
  if (!customAlias || typeof customAlias !== 'object') return normalized;
  Object.keys(customAlias).forEach(alias => {
    const type = String(customAlias[alias] || '').toLowerCase();
    if (!type) return;
    if (!BASE_TYPES.includes(type)) return;
    normalized[String(alias).toLowerCase()] = type;
  });
  return normalized;
}
