'use strict';

const assert = require('assert');
const cheerio = require('cheerio');
const transformCallouts = require('../lib/transform');

describe('transformCallouts', () => {
  it('converts a basic callout with default title', () => {
    const input = '<blockquote><p>[!info]</p><p>Body content</p></blockquote>';
    const output = transformCallouts(input);
    const $ = cheerio.load(output);
    const $callout = $('.hexo-callout');

    assert.strictEqual($callout.length, 1);
    assert($callout.hasClass('hexo-callout--info'));
    assert.strictEqual($callout.attr('data-callout'), 'info');
    assert.strictEqual($callout.find('.hexo-callout__title').text().trim(), 'Info');
    assert.ok($callout.find('.hexo-callout__content').html().includes('Body content'));
  });

  it('preserves custom titles with inline HTML', () => {
    const input = '<blockquote><p>[!tip] Callouts can have <em>custom</em> titles</p><p>More text</p></blockquote>';
    const output = transformCallouts(input);
    const $ = cheerio.load(output);
    const $callout = $('.hexo-callout');

    assert.strictEqual($callout.attr('data-callout'), 'tip');
    assert.strictEqual($callout.find('.hexo-callout__title').html(), 'Callouts can have <em>custom</em> titles');
    assert.ok(/More text/.test($callout.find('.hexo-callout__content').text()));
  });

  it('creates collapsible details for foldable callouts', () => {
    const input = '<blockquote><p>[!faq]- Are callouts foldable?</p><p>Yes they are.</p></blockquote>';
    const output = transformCallouts(input);
    const $ = cheerio.load(output);
    const $callout = $('details.hexo-callout');

    assert.strictEqual($callout.length, 1);
    assert($callout.hasClass('hexo-callout--question'));
    assert.strictEqual($callout.attr('data-callout-fold'), 'closed');
    assert.strictEqual($callout.attr('open'), undefined);
    assert.strictEqual($callout.find('.hexo-callout__title').text().trim(), 'Are callouts foldable?');
  });

  it('supports nested callouts without losing inner content', () => {
    const input = [
      '<blockquote>',
      '<p>[!question] Outer question</p>',
      '<blockquote>',
      '<p>[!todo] Inner task</p>',
      '<p>Nested content</p>',
      '</blockquote>',
      '</blockquote>'
    ].join('');

    const output = transformCallouts(input);
    const $ = cheerio.load(output);
    const outer = $('.hexo-callout--question');
    const inner = outer.find('.hexo-callout--todo');

    assert.strictEqual(outer.length, 1);
    assert.strictEqual(inner.length, 1);
    assert.ok(inner.find('.hexo-callout__content').text().includes('Nested content'));
  });
});
