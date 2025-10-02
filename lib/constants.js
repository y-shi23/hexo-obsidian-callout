'use strict';

const BASE_TYPES = [
  'note',
  'abstract',
  'info',
  'todo',
  'tip',
  'success',
  'question',
  'warning',
  'failure',
  'danger',
  'bug',
  'example',
  'quote'
];

const TYPE_LABELS = {
  note: 'Note',
  abstract: 'Abstract',
  info: 'Info',
  todo: 'Todo',
  tip: 'Tip',
  success: 'Success',
  question: 'Question',
  warning: 'Warning',
  failure: 'Failure',
  danger: 'Danger',
  bug: 'Bug',
  example: 'Example',
  quote: 'Quote'
};

const TYPE_ALIASES = {
  summary: 'abstract',
  tldr: 'abstract',
  info: 'info',
  hint: 'tip',
  important: 'tip',
  check: 'success',
  done: 'success',
  help: 'question',
  faq: 'question',
  caution: 'warning',
  attention: 'warning',
  fail: 'failure',
  missing: 'failure',
  error: 'danger',
  cite: 'quote'
};

const TYPE_COLORS = {
  note: '#202A36',
  abstract: '#1F3232',
  info: '#1F2B39',
  todo: '#1F2B39',
  tip: '#1F3232',
  success: '#26342A',
  question: '#372B1F',
  warning: '#372B1F',
  failure: '#372426',
  danger: '#372426',
  bug: '#372426',
  example: '#1F2B39',
  quote: '#2F2F2F'
};

function svgWrap(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const DEFAULT_ICONS = {
  note: svgWrap('<path d="M3 3h9l5 5v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M12 3v5h5"/>'),
  abstract: svgWrap('<path d="M4 4h16"/><path d="M4 10h16"/><path d="M4 16h16"/><path d="M4 22h16"/>'),
  info: svgWrap('<circle cx="12" cy="12" r="9"/><path d="M12 10v5"/><path d="M12 17h.01"/>'),
  todo: svgWrap('<path d="M4 6h9"/><path d="M4 12h6"/><path d="M4 18h8"/><path d="M15 12l2 2 4-4"/>'),
  tip: svgWrap('<path d="M12 2a7 7 0 0 0-5 11.74V17a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3.28A7 7 0 0 0 12 2z"/><path d="M9 21h6"/><path d="M10 17v4"/><path d="M14 17v4"/>'),
  success: svgWrap('<path d="M20 6 9 17l-5-5"/>'),
  question: svgWrap('<path d="M9 9a3 3 0 1 1 3 3v1"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/>'),
  warning: svgWrap('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  failure: svgWrap('<path d="m15 9-6 6"/><path d="m9 9 6 6"/><path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"/>'),
  danger: svgWrap('<path d="M12 2 3 21h18L12 2z"/><path d="M12 8v5"/><path d="M12 17h.01"/>'),
  bug: svgWrap('<path d="M8 9h8a3 3 0 0 1 3 3v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a3 3 0 0 1 3-3z"/><path d="M12 3v3"/><path d="M5 13h3"/><path d="M16 13h3"/><path d="M5.5 7.5L7.5 9.5"/><path d="M18.5 7.5L16.5 9.5"/><path d="M5 17h3"/><path d="M19 17h-3"/>'),
  example: svgWrap('<path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93L7.76 7.76"/><path d="M16.24 16.24L19.07 19.07"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07L7.76 16.24"/><path d="M16.24 7.76L19.07 4.93"/>'),
  quote: svgWrap('<path d="M17 6H7a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h3v-4H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3Zm4 0h-3a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h3v-4h-3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3Z"/>')
};
module.exports = {
  BASE_TYPES,
  TYPE_LABELS,
  TYPE_ALIASES,
  TYPE_COLORS,
  DEFAULT_ICONS
};
