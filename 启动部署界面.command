#!/bin/bash

echo "🚀 启动部署管理界面..."
echo ""

# 切换到脚本所在目录
cd "$(dirname "$0")"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    echo "🔗 下载地址: https://nodejs.org/zh-cn/download/"
    echo ""
    read -p "按任意键退出..."
    exit 1
fi

# 检查 express 是否安装
if ! node -e "require('express')" &> /dev/null; then
    echo "📦 安装依赖..."
    npm install express --silent
fi

# 启动服务器
echo "🌐 正在启动服务器..."
echo "📱 访问地址: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

node deploy-ui/server.cjs