#!/bin/bash

# 确保脚本以sudo权限运行
if [ "$EUID" -ne 0 ]; then
  echo "请使用sudo运行此脚本"
  exit 1
fi

# 获取当前用户（非root用户）
if [ -n "$SUDO_USER" ]; then
  CURRENT_USER=$SUDO_USER
else
  echo "无法确定当前用户，请确保使用sudo运行此脚本"
  exit 1
fi

echo "设置Docker权限，为用户 $CURRENT_USER 添加到docker组..."

# 检查docker组是否存在，如果不存在则创建
if ! getent group docker > /dev/null; then
  echo "创建docker组..."
  groupadd docker
fi

# 将当前用户添加到docker组
usermod -aG docker $CURRENT_USER
echo "用户 $CURRENT_USER 已添加到docker组"

# 重启Docker服务以应用更改
if systemctl is-active docker > /dev/null; then
  echo "重启Docker服务..."
  systemctl restart docker
fi

echo "权限设置完成！请注销并重新登录以应用更改。"
echo "或者，您可以运行: newgrp docker"
echo "然后重新启动应用: npm start" 