'use strict';

const cheerio = require('cheerio');
const {
  BASE_TYPES,
  TYPE_LABELS,
  TYPE_ALIASES,
  TYPE_COLORS,
  DEFAULT_ICONS
} = require('./utils');

const MARKER_PREFIX_REGEX = /^\s*\[!([^\]\s]+)\]([+-]?)/i;
const BREAK_TOKEN_REGEX = /(?:<br\s*\/?>|\r?\n)/i;

function transformCallouts(html, options = {}) {
  if (!html || typeof html !== 'string') return html;

  const settings = Object.assign(
    {
      iconSet: DEFAULT_ICONS,
      aliasMap: TYPE_ALIASES,
      debug: false
    },
    options
  );

  const $ = cheerio.load(html, { decodeEntities: false }, false);
  const blockquotes = $('blockquote').toArray().reverse();

  blockquotes.forEach(node => {
    const $block = $(node);
    const marker = extractCalloutMarker($, $block);
    if (!marker) return;

    const type = normalizeType(marker.type, settings.aliasMap);
    const titleHtml =
      marker.titleHtml && marker.titleHtml.trim().length > 0
        ? marker.titleHtml.trim()
        : TYPE_LABELS[type] || capitalize(marker.type);

    const iconSvg = settings.iconSet[type] || DEFAULT_ICONS[type];
    const bodyHtml = collectBodyHtml($, $block, marker.index, marker.leadingBodyHtml);
    const collapsible = marker.fold === '+' || marker.fold === '-';
    const isOpen = marker.fold === '+';

    const $callout = createCalloutSkeleton($, {
      type,
      iconSvg,
      titleHtml,
      bodyHtml,
      collapsible,
      isOpen
    });

    $block.replaceWith($callout);
  });

  return $.root().html();
}

function extractCalloutMarker($, $block) {
  const nodes = $block.contents().toArray();
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];

    if (node.type === 'text') {
      const raw = node.data || '';
      if (!raw.trim()) continue;
      const parsed = parsePlainTextMarker(raw);
      if (!parsed) return null;
      return Object.assign({ index }, parsed);
    }

    if (node.type === 'tag' && node.name === 'p') {
      const $node = $(node);
      const rawHtml = $node.html() || '';
      const parsed = parseHtmlMarker(rawHtml);
      if (!parsed) return null;
      return Object.assign({ index }, parsed);
    }

    if (node.type === 'tag' && isIgnorable(node)) {
      continue;
    }

    if (node.type === 'tag' || node.type === 'text') {
      return null;
    }
  }
  return null;
}

function parsePlainTextMarker(raw) {
  const match = raw.match(MARKER_PREFIX_REGEX);
  if (!match) return null;
  const remainder = raw.slice(match[0].length);
  const split = splitTitleAndBody(remainder, { treatAsPlainText: true });

  const titleHtml = escapeHtml(split.titleHtml);
  const bodyHtml = split.bodyHtml
    ? escapeHtml(split.bodyHtml).replace(/\r?\n/g, '<br>')
    : '';

  return {
    type: match[1],
    fold: match[2] || '',
    titleHtml,
    leadingBodyHtml: bodyHtml
  };
}

function parseHtmlMarker(rawHtml) {
  const match = rawHtml.match(MARKER_PREFIX_REGEX);
  if (!match) return null;
  const remainder = rawHtml.slice(match[0].length);
  const split = splitTitleAndBody(remainder);

  return {
    type: match[1],
    fold: match[2] || '',
    titleHtml: split.titleHtml,
    leadingBodyHtml: split.bodyHtml
  };
}

function splitTitleAndBody(source, { treatAsPlainText = false } = {}) {
  if (!source) {
    return { titleHtml: '', bodyHtml: '' };
  }

  let working = source;
  if (treatAsPlainText) {
    working = working.replace(/\r\n/g, '\n');
  }

  if (!working.trim()) {
    return { titleHtml: '', bodyHtml: '' };
  }

  const breakMatch = working.match(BREAK_TOKEN_REGEX);
  if (!breakMatch) {
    return {
      titleHtml: working.trim(),
      bodyHtml: ''
    };
  }

  const before = working.slice(0, breakMatch.index);
  let after = working.slice(breakMatch.index + breakMatch[0].length);

  const title = before.trim();

  if (treatAsPlainText) {
    after = after.replace(/^\s+/, '');
  } else {
    after = after.replace(/^(?:\s|<br\s*\/?>)+/gi, '');
  }

  return {
    titleHtml: title,
    bodyHtml: after
  };
}

function collectBodyHtml($, $block, markerIndex, leadingFragment = '') {
  const nodes = $block.contents().toArray();
  const fragments = [];

  if (leadingFragment && leadingFragment.length) {
    fragments.push(leadingFragment);
  }

  nodes.forEach((node, idx) => {
    if (idx === markerIndex) return;
    const fragment = $.html(node);
    if (typeof fragment === 'string' && fragment.length) {
      fragments.push(fragment);
    }
  });

  const combined = fragments.join('');
  return combined.trim();
}

function createCalloutSkeleton($, options) {
  const { type, iconSvg, titleHtml, bodyHtml, collapsible, isOpen } = options;
  const baseClass = `hexo-callout hexo-callout--${type}`;
  const tag = collapsible ? 'details' : 'div';
  const $callout = $(`<${tag}></${tag}>`);
  $callout.addClass(baseClass);
  $callout.attr('data-callout', type);
  $callout.attr('data-callout-color', TYPE_COLORS[type] || '#202A36');
  if (collapsible) {
    $callout.attr('data-callout-collapsible', 'true');
    if (isOpen) {
      $callout.attr('open', '');
      $callout.attr('data-callout-fold', 'open');
    } else {
      $callout.attr('data-callout-fold', 'closed');
    }
  }

  const $headerContainer = collapsible
    ? $('<summary class="hexo-callout__summary"></summary>')
    : $('<div class="hexo-callout__header"></div>');

  const $icon = $('<span class="hexo-callout__icon" aria-hidden="true"></span>');
  $icon.html(iconSvg);

  const $title = $('<span class="hexo-callout__title"></span>');
  $title.html(titleHtml);

  $headerContainer.append($icon);
  $headerContainer.append($title);

  if (collapsible) {
    if (typeof isOpen === 'boolean') {
      $headerContainer.attr('aria-expanded', String(isOpen));
    }
    const $chevron = $('<span class="hexo-callout__chevron" aria-hidden="true"></span>');
    $headerContainer.append($chevron);
  }

  $callout.append($headerContainer);

  if (bodyHtml && bodyHtml.length) {
    const $content = $('<div class="hexo-callout__content"></div>');
    $content.html(bodyHtml);
    $callout.append($content);
  }

  return $callout;
}

function normalizeType(rawType, aliasMap) {
  if (!rawType) return 'note';
  const lower = String(rawType).toLowerCase();
  if (BASE_TYPES.includes(lower)) return lower;
  if (aliasMap && aliasMap[lower]) return aliasMap[lower];
  if (TYPE_ALIASES[lower]) return TYPE_ALIASES[lower];
  return 'note';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isIgnorable(node) {
  if (node.type === 'comment') return true;
  if (node.type !== 'tag') return false;
  const ignorableTags = new Set(['br']);
  return ignorableTags.has(node.name);
}

function capitalize(str) {
  const input = String(str || '').toLowerCase();
  if (!input) return '';
  return input.charAt(0).toUpperCase() + input.slice(1);
}

module.exports = transformCallouts;
