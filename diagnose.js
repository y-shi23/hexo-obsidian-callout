#!/usr/bin/env node

/**
 * Hexo Obsidian Callout - 快速诊断脚本
 * 
 * 用法: node diagnose.js
 * 
 * 此脚本会检查常见的配置问题并提供解决建议
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('Hexo Obsidian Callout - 诊断工具');
console.log('='.repeat(60));
console.log();

// 检查是否在 Hexo 项目中
function checkHexoProject() {
  console.log('[1/6] 检查 Hexo 项目...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('  ❌ 未找到 package.json');
    console.log('  ⚠️  请在 Hexo 项目根目录运行此脚本');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasHexo = packageJson.dependencies && packageJson.dependencies.hexo;
  
  if (hasHexo) {
    console.log(`  ✅ 找到 Hexo 项目 (版本: ${packageJson.dependencies.hexo})`);
    return true;
  } else {
    console.log('  ❌ 这不是一个 Hexo 项目');
    return false;
  }
}

// 检查插件是否安装
function checkPluginInstalled() {
  console.log('\n[2/6] 检查插件安装...');
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules', 'hexo-obsidian-callout');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('  ❌ 插件未安装');
    console.log('  💡 运行: npm install hexo-obsidian-callout --save');
    return false;
  }
  
  const pluginPackageJson = path.join(nodeModulesPath, 'package.json');
  if (fs.existsSync(pluginPackageJson)) {
    const pkg = JSON.parse(fs.readFileSync(pluginPackageJson, 'utf8'));
    console.log(`  ✅ 插件已安装 (版本: ${pkg.version})`);
    return true;
  }
  
  return false;
}

// 检查配置文件
function checkConfig() {
  console.log('\n[3/6] 检查配置文件...');
  
  const configPath = path.join(process.cwd(), '_config.yml');
  if (!fs.existsSync(configPath)) {
    console.log('  ❌ 未找到 _config.yml');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('obsidian_callout:')) {
    console.log('  ✅ 找到 obsidian_callout 配置');
    
    // 检查是否启用
    if (configContent.match(/obsidian_callout:\s*\n\s*enabled:\s*true/)) {
      console.log('  ✅ 插件已启用');
    } else if (configContent.match(/obsidian_callout:\s*\n\s*enabled:\s*false/)) {
      console.log('  ❌ 插件已禁用');
      console.log('  💡 在 _config.yml 中设置 enabled: true');
    } else {
      console.log('  ⚠️  未找到 enabled 配置,将使用默认值 (true)');
    }
    
    // 检查调试模式
    if (configContent.match(/debug:\s*true/)) {
      console.log('  📝 调试模式已启用');
    }
    
    return true;
  } else {
    console.log('  ⚠️  未找到 obsidian_callout 配置');
    console.log('  💡 在 _config.yml 中添加:');
    console.log('     obsidian_callout:');
    console.log('       enabled: true');
    console.log('       debug: true');
    return false;
  }
}

// 检查 Markdown 渲染器
function checkMarkdownRenderer() {
  console.log('\n[4/6] 检查 Markdown 渲染器...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['hexo-renderer-marked']) {
    console.log(`  ✅ 使用 hexo-renderer-marked (版本: ${deps['hexo-renderer-marked']})`);
    console.log('  💡 建议在 _config.yml 中添加:');
    console.log('     markdown:');
    console.log('       breaks: true');
  } else if (deps['hexo-renderer-markdown-it']) {
    console.log(`  ✅ 使用 hexo-renderer-markdown-it (版本: ${deps['hexo-renderer-markdown-it']})`);
    console.log('  💡 建议在 _config.yml 中添加:');
    console.log('     markdown:');
    console.log('       render:');
    console.log('         breaks: true');
  } else {
    console.log('  ⚠️  未找到 Markdown 渲染器');
    console.log('  💡 运行: npm install hexo-renderer-marked --save');
  }
}

// 检查测试文章
function checkTestPost() {
  console.log('\n[5/6] 检查测试文章...');
  
  const postsDir = path.join(process.cwd(), 'source', '_posts');
  if (!fs.existsSync(postsDir)) {
    console.log('  ⚠️  未找到 _posts 目录');
    return false;
  }
  
  const testFiles = fs.readdirSync(postsDir).filter(f => 
    f.includes('test') && f.includes('callout')
  );
  
  if (testFiles.length > 0) {
    console.log(`  ✅ 找到测试文章: ${testFiles[0]}`);
  } else {
    console.log('  ⚠️  未找到测试文章');
    console.log('  💡 创建 source/_posts/test-callout.md 进行测试');
  }
}

// 检查生成的文件
function checkGeneratedFiles() {
  console.log('\n[6/6] 检查生成的文件...');
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    console.log('  ⚠️  未找到 public 目录');
    console.log('  💡 运行: hexo generate');
    return false;
  }
  
  const cssPath = path.join(publicDir, 'css', 'hexo-obsidian-callout.css');
  if (fs.existsSync(cssPath)) {
    console.log('  ✅ CSS 文件已生成');
  } else {
    console.log('  ❌ CSS 文件未生成');
    console.log('  💡 运行: hexo clean && hexo generate');
  }
}

// 运行所有检查
console.log();
checkHexoProject();
checkPluginInstalled();
checkConfig();
checkMarkdownRenderer();
checkTestPost();
checkGeneratedFiles();

console.log('\n' + '='.repeat(60));
console.log('诊断完成!');
console.log('='.repeat(60));
console.log();
console.log('如果问题仍然存在,请:');
console.log('1. 启用调试模式: debug: true');
console.log('2. 运行: hexo clean && hexo generate --debug');
console.log('3. 查看详细故障排查: TROUBLESHOOTING.md');
console.log();
