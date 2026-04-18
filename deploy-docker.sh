#!/bin/bash

# 饮食记录应用 - Docker一键部署脚本
# 适用于已安装Docker的服务器

set -e

echo "========================================="
echo "  饮食记录应用 - Docker一键部署脚本"
echo "========================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 root 用户或 sudo 执行此脚本"
  exit 1
fi

# 检查Docker是否已安装
if ! command -v docker &> /dev/null; then
  echo "Docker未安装，正在安装Docker..."
  curl -fsSL https://get.docker.com | bash -
  systemctl enable docker
  systemctl start docker
fi

# 检查Docker Compose是否已安装
if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose未安装，正在安装..."
  curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# 准备项目代码
echo ""
echo "[1/3] 准备项目代码..."
DEPLOY_DIR="/opt/diet-tracker"

if [ -d "$DEPLOY_DIR/.git" ]; then
  echo "项目目录已存在，更新代码..."
  cd "$DEPLOY_DIR"
  git pull origin main
else
  echo "克隆项目代码..."
  git clone https://github.com/bulinYou/eatWhat.git "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

# 构建并启动Docker容器
echo ""
echo "[2/3] 构建Docker镜像..."
cd "$DEPLOY_DIR"
docker-compose down || true
docker-compose build --no-cache

echo ""
echo "[3/3] 启动服务..."
docker-compose up -d

# 等待数据库启动
echo ""
echo "等待数据库初始化..."
sleep 10

# 执行数据库迁移
echo ""
echo "执行数据库迁移..."
docker-compose exec -T server sh -c "cd /app && pnpm db:push" || echo "数据库迁移完成或已存在"

echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "访问地址："
echo "  Web 前端: http://你的服务器IP"
echo "  后端 API: http://你的服务器IP/api"
echo ""
echo "服务管理命令："
echo "  查看服务状态: docker-compose ps"
echo "  查看日志: docker-compose logs -f"
echo "  重启服务: docker-compose restart"
echo "  停止服务: docker-compose down"
echo ""
echo "Docker容器："
echo "  数据库: diet-tracker-db"
echo "  后端API: diet-tracker-api"
echo "  Web前端: diet-tracker-web"
echo ""
