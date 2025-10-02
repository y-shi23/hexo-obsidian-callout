'use strict';

const { BASE_TYPES, TYPE_LABELS, TYPE_ALIASES, TYPE_COLORS, DEFAULT_ICONS } = require('./constants');

function mergeConfig(base, override) {
  const output = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  if (!override || typeof override !== 'object') {
    return output;
  }

  Object.keys(override).forEach(key => {
    const baseValue = output[key];
    const overrideValue = override[key];
    if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
      output[key] = baseValue.concat(overrideValue);
      return;
    }

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      output[key] = mergeConfig(baseValue, overrideValue);
      return;
    }

    output[key] = overrideValue;
  });

  return output;
}

function buildIconSet(overrides) {
  const normalized = {};
  if (overrides && typeof overrides === 'object') {
    Object.keys(overrides).forEach(typeKey => {
      const normalizedKey = String(typeKey).toLowerCase();
      if (!BASE_TYPES.includes(normalizedKey)) return;
      const iconValue = overrides[typeKey];
      if (typeof iconValue === 'string' && iconValue.trim()) {
        normalized[normalizedKey] = iconValue.trim();
      }
    });
  }
  return Object.assign({}, DEFAULT_ICONS, normalized);
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

module.exports = {
  mergeConfig,
  buildIconSet,
  BASE_TYPES,
  TYPE_LABELS,
  TYPE_ALIASES,
  TYPE_COLORS,
  DEFAULT_ICONS
};
