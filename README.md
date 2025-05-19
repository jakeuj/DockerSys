# Docker容器监控系统

这是一个用于监控Docker容器状态的Web应用程序，可以实时显示容器的CPU、内存、磁盘和GPU使用情况。

## 功能特点

- 实时监控Docker容器的运行状态
- 可视化显示CPU和内存使用率
- 显示容器的基本信息（镜像、状态等）
- 显示磁盘和网络使用情况
- 支持GPU使用情况监控（如果容器使用NVIDIA GPU）
- 支持深色/浅色主题切换
- 自动刷新数据（10秒间隔）

## 技术栈

- 前端: React, Material-UI, Recharts
- 后端: Node.js, Express
- Docker API: Dockerode

## 安装与使用

### 前提条件

- 安装 Node.js (v14+)
- 安装 Docker 并运行 Docker 守护进程
- 确保当前用户有权限访问 Docker socket

### 安装步骤

1. 克隆仓库：

```
git clone <repository-url>
cd docker-monitor
```

2. 安装后端依赖：

```
cd backend
npm install
```

3. 安装前端依赖：

```
cd ../frontend
npm install
```

### 运行应用

1. 启动后端服务：

```
cd backend
npm start
```

2. 在另一个终端中启动前端应用：

```
cd frontend
npm start
```

3. 打开浏览器访问 http://localhost:3000

## Docker权限问题解决

如果遇到 `获取容器统计信息失败: Error: connect EACCES /var/run/docker.sock` 错误，这是因为您的用户没有权限访问Docker socket。解决方法：

### 方法1：使用提供的权限设置脚本

我们提供了一个脚本来自动设置权限：

```
cd backend
sudo ./setup_permissions.sh
```

运行脚本后，**您需要注销并重新登录**以使更改生效，或者运行 `newgrp docker` 命令。

### 方法2：手动设置权限

如果您希望手动设置权限，可以执行以下步骤：

1. 将当前用户添加到docker组：
```
sudo usermod -aG docker $USER
```

2. 注销并重新登录以使更改生效，或运行：
```
newgrp docker
```

3. 重启Docker服务：
```
sudo systemctl restart docker
```

### 方法3：临时解决方案

如果只是临时测试，可以使用sudo运行应用：

```
sudo npm start
```

**注意**：使用sudo运行Node.js应用不推荐用于生产环境。

## 注意事项

- 后端服务需要有权限访问 Docker socket（通常位于 `/var/run/docker.sock`）
- 如在 Linux 系统上，可能需要将当前用户添加到 docker 组以获取权限
- GPU 监控功能需要 NVIDIA 容器运行时支持 