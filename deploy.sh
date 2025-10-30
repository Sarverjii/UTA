#!/bin/bash
set -e

# Base directory
BASE_DIR="/var/www/html/UTA"

# Domains
FRONTEND_DIR="$BASE_DIR/frontend"
ADMIN_DIR="$BASE_DIR/admin"
BACKEND_DIR="$BASE_DIR/backend"

# Backend process
BACKEND_PROCESS="utennisa-backend"

echo "Starting deployment..."

# Deploy
deploy_node_app() {
  APP_DIR=$1
  BUILD=$2
  PM2_NAME=$3

  echo "---------------------------------------"
  echo "Deploying $APP_DIR ..."
  cd "$APP_DIR"

  # Cleanup old installs
  echo "Removing old node_modules and lock files..."
  rm -rf node_modules package-lock.json yarn.lock

  # Install fresh dependencies
  echo "Installing dependencies..."
  npm install --legacy-peer-deps
  # Build if required
  if [ "$BUILD" == "y" ]; then
    echo "Running build..."
    npm run build
  fi

  # Start backend with pm2
  if [ -n "$PM2_NAME" ]; then
    echo "Restarting $PM2_NAME with PM2..."
    pm2 stop "$PM2_NAME" || true
    pm2 delete "$PM2_NAME" || true
    pm2 start npm --name "$PM2_NAME" -- run start
    pm2 save
  fi

  echo "$APP_DIR deployment done."
  echo "---------------------------------------"
}

# Deploy Apps
deploy_node_app "$FRONTEND_DIR" "y"
deploy_node_app "$ADMIN_DIR" "y"
deploy_node_app "$BACKEND_DIR" "n" "$BACKEND_PROCESS"
# Nginx
sudo systemctl restart nginx
echo "Deployment completed successfully!"

