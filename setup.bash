#!/bin/bash

set -e

echo "🚀 Starting setup..."

# --------------------------
# 1. Install Docker & Compose
# --------------------------
if ! command -v docker &> /dev/null; then
  echo "🔧 Installing Docker..."
  curl -fsSL https://get.docker.com | sudo bash
  sudo usermod -aG docker $USER
else
  echo "✅ Docker is already installed."
fi

if ! command -v docker compose &> /dev/null; then
  echo "🔧 Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
else
  echo "✅ Docker Compose is already installed."
fi

# --------------------------
# 2. Install Node.js & PM2
# --------------------------
if ! command -v node &> /dev/null; then
  echo "🔧 Installing Node.js using nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  source "$NVM_DIR/nvm.sh"
  nvm install 20
else
  echo "✅ Node.js is already installed."
fi

if ! command -v pm2 &> /dev/null; then
  echo "🔧 Installing PM2..."
  npm install -g pm2
else
  echo "✅ PM2 is already installed."
fi

# Install npm packages
npm install

# --------------------------
# 3. Run Docker Compose
# --------------------------
echo "🐳 Running Docker Compose build..."
sudo docker compose up --build -d

# --------------------------
# 4. Run Bonjour Script with PM2
# --------------------------
echo "📡 Starting Bonjour script with PM2..."
pm2 start utils/bonjour-host.js --name bonjour-service

# --------------------------
# 5. Add PM2 Startup Hook
# --------------------------
echo "🛠️ Setting up PM2 to run on system reboot..."
pm2 startup systemd -u $USER --hp $HOME | bash
pm2 save

echo "✅ Setup complete!"
