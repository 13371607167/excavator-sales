const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('deploy-ui'));

const projectPath = path.join(__dirname, '..');

function runCommand(command, args, cwd = projectPath) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { cwd, shell: true });
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${output}`));
      }
    });
  });
}

app.get('/api/status', async (req, res) => {
  try {
    const versionOutput = await runCommand('git', ['describe', '--tags', '--abbrev=0']);
    const commitOutput = await runCommand('git', ['log', '--oneline', '-1']);
    const statusOutput = await runCommand('git', ['status', '--porcelain']);
    
    res.json({
      currentVersion: versionOutput.trim() || null,
      lastCommit: commitOutput.trim(),
      changes: statusOutput.trim().split('\n').filter(line => line.trim()).length
    });
  } catch (error) {
    res.json({
      currentVersion: null,
      lastCommit: '无法获取',
      changes: 0
    });
  }
});

app.post('/api/deploy', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  
  try {
    res.write('📝 检查代码变更...\n');
    
    const statusOutput = await runCommand('git', ['status', '--porcelain']);
    if (!statusOutput.trim()) {
      res.write('✅ 没有代码变更\n');
      res.end();
      return;
    }
    
    res.write('🔄 暂存所有变更...\n');
    await runCommand('git', ['add', '-A']);
    
    res.write('📝 提交代码...\n');
    await runCommand('git', ['commit', '-m', '自动部署更新 ' + new Date().toLocaleString()]);
    
    res.write('🌐 推送到 GitHub...\n');
    await runCommand('git', ['push', 'origin', 'main']);
    
    res.write('✅ 部署成功！\n');
    res.write('⏳ 等待 GitHub Actions 构建（约1-2分钟）\n');
    res.write('🔗 https://13371607167.github.io/excavator-sales/\n');
    res.end();
  } catch (error) {
    res.write('❌ 部署失败: ' + error.message + '\n');
    res.end();
  }
});

app.post('/api/release', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  
  const { versionType, customVersion, commitMessage, releaseNotes } = req.body;
  
  try {
    res.write('📝 检查代码变更...\n');
    
    const statusOutput = await runCommand('git', ['status', '--porcelain']);
    if (statusOutput.trim()) {
      res.write('🔄 暂存所有变更...\n');
      await runCommand('git', ['add', '-A']);
      
      res.write('📝 提交代码...\n');
      await runCommand('git', ['commit', '-m', commitMessage]);
    }
    
    res.write('🏷️ 计算版本号...\n');
    let version;
    
    if (versionType === 'custom') {
      version = customVersion;
    } else {
      const currentTag = await runCommand('git', ['describe', '--tags', '--abbrev=0']).catch(() => 'v0.0.0');
      const parts = currentTag.trim().replace('v', '').split('.').map(Number);
      
      if (versionType === 'patch') parts[2]++;
      else if (versionType === 'minor') { parts[1]++; parts[2] = 0; }
      else if (versionType === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
      
      version = 'v' + parts.join('.');
    }
    
    res.write(`📌 创建版本标签: ${version}\n`);
    await runCommand('git', ['tag', '-a', version, '-m', `版本 ${version}\n\n${releaseNotes || ''}`]);
    
    res.write('🌐 推送代码到 GitHub...\n');
    await runCommand('git', ['push', 'origin', 'main']);
    
    res.write('📤 推送版本标签...\n');
    await runCommand('git', ['push', 'origin', version]);
    
    res.write(`✅ 版本 ${version} 发布成功！\n`);
    res.write('🔗 Release: https://github.com/13371607167/excavator-sales/releases\n');
    res.write('⏳ 等待 GitHub Actions 构建...\n');
    res.end();
  } catch (error) {
    res.write('❌ 发布失败: ' + error.message + '\n');
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 部署管理界面已启动`);
  console.log(`📱 访问地址: http://localhost:${PORT}`);
});