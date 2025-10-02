const cheerio = require('cheerio');
const transformCallouts = require('./lib/transform');

// 测试不同的 HTML 结构
const testCases = [
  {
    name: '基础 callout',
    html: '<blockquote><p>[!info]</p><p>测试内容</p></blockquote>'
  },
  {
    name: '带换行的 callout',
    html: '<blockquote>\n<p>[!info]</p>\n<p>测试内容</p>\n</blockquote>'
  },
  {
    name: '纯文本 marker',
    html: '<blockquote>[!info]\n测试内容</blockquote>'
  },
  {
    name: '完整页面中的 callout',
    html: '<div class="post"><blockquote><p>[!tip] 提示</p><p>这是提示内容</p></blockquote></div>'
  }
];

console.log('='.repeat(60));
console.log('Callout 转换测试');
console.log('='.repeat(60));

testCases.forEach(test => {
  console.log(`\n[测试] ${test.name}`);
  console.log('输入:', test.html);
  
  const result = transformCallouts(test.html, { debug: true });
  console.log('输出:', result);
  
  const hasCallout = result.includes('hexo-callout');
  console.log('状态:', hasCallout ? '✅ 成功转换' : '❌ 未转换');
  
  if (!hasCallout) {
    // 检查是否找到 blockquote
    const $ = cheerio.load(test.html, { decodeEntities: false }, false);
    const blockquotes = $('blockquote');
    console.log('找到的 blockquote 数量:', blockquotes.length);
    
    if (blockquotes.length > 0) {
      console.log('第一个 blockquote 内容:', blockquotes.first().html());
    }
  }
});

console.log('\n' + '='.repeat(60));
