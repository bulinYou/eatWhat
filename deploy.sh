#!/bin/bash

# 饮食记录应用 - 一键部署脚本
# 适用于 Alibaba Cloud Linux 3.2

set -e

echo "========================================="
echo "  饮食记录应用 - 一键部署脚本"
echo "========================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 root 用户或 sudo 执行此脚本"
  exit 1
fi

# 1. 安装基础依赖
echo ""
echo "[1/7] 安装基础依赖..."
yum update -y
yum install -y git curl wget gcc-c++ make postgresql-server postgresql-contrib nginx

# 2. 安装 Node.js 20.x
echo ""
echo "[2/7] 安装 Node.js 20.x..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 3. 安装 pnpm
echo ""
echo "[3/7] 安装 pnpm..."
npm install -g pnpm

# 4. 初始化并启动 PostgreSQL
echo ""
echo "[4/7] 初始化 PostgreSQL..."
postgresql-setup --initdb --unit postgresql
systemctl enable postgresql
systemctl start postgresql

# 配置 PostgreSQL
echo "配置 PostgreSQL..."
su - postgres -c "psql -c \"ALTER USER postgres PASSWORD 'diet_tracker_db_password';\""
su - postgres -c "psql -c \"CREATE DATABASE diet_tracker;\""

# 5. 克隆或更新项目代码
echo ""
echo "[5/7] 准备项目代码..."
DEPLOY_DIR="/opt/diet-tracker"

if [ -d "$DEPLOY_DIR" ]; then
  echo "项目目录已存在，更新代码..."
  cd "$DEPLOY_DIR"
  git pull
else
  echo "克隆项目代码..."
  git clone <你的Git仓库地址> "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

# 6. 安装依赖并构建
echo ""
echo "[6/7] 安装依赖并构建项目..."
cd "$DEPLOY_DIR"
pnpm install
pnpm build

# 配置后端环境变量
echo "配置后端环境变量..."
cat > apps/server/.env << EOF
DATABASE_URL=postgresql://postgres:diet_tracker_db_password@localhost:5432/diet_tracker
PORT=3000
NODE_ENV=production
EOF

# 执行数据库迁移
cd apps/server
pnpm db:migrate

# 7. 配置 Nginx
echo ""
echo "[7/7] 配置 Nginx..."
cat > /etc/nginx/conf.d/diet-tracker.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    # Web 前端
    location / {
        root /opt/diet-tracker/apps/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 启动 Nginx
systemctl enable nginx
systemctl restart nginx

# 安装 PM2 并启动后端服务
echo ""
echo "安装 PM2 进程管理器..."
npm install -g pm2

cd "$DEPLOY_DIR/apps/server"
pm2 start dist/index.js --name "diet-tracker-api"
pm2 save
pm2 startup

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
echo "  查看后端日志: pm2 logs diet-tracker-api"
echo "  重启后端服务: pm2 restart diet-tracker-api"
echo "  查看服务状态: pm2 status"
echo ""
echo "数据库信息："
echo "  数据库名: diet_tracker"
echo "  用户名: postgres"
echo "  密码: diet_tracker_db_password"
echo ""
echo "请记得修改 .env 文件中的数据库密码和 Nginx 配置中的域名！"
