const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5001;

// 检查Docker socket是否存在且可访问
const socketPath = '/var/run/docker.sock';
let docker;

try {
  // 尝试访问Docker socket
  fs.accessSync(socketPath, fs.constants.R_OK | fs.constants.W_OK);
  docker = new Docker({ socketPath });
  console.log('成功连接到Docker守护进程');
} catch (err) {
  console.error(`Docker socket访问失败: ${err.message}`);
  console.error('请确保当前用户已添加到docker组，或使用sudo运行');
  console.error('解决方法: sudo usermod -aG docker $USER 然后重新登录');
  // 创建一个空的Docker实例，这样应用程序不会在启动时崩溃
  docker = new Docker();
}

app.use(cors());
app.use(express.json());

// 获取所有容器信息
app.get('/api/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (error) {
    console.error('获取容器列表失败:', error);
    res.status(500).json({ error: '获取容器列表失败' });
  }
});

// 获取单个容器详细信息，包括资源使用情况
app.get('/api/containers/:id/stats', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    const stats = await container.stats({ stream: false });
    res.json(stats);
  } catch (error) {
    console.error('获取容器状态失败:', error);
    res.status(500).json({ error: '获取容器状态失败' });
  }
});

// 获取所有容器的详细状态信息
app.get('/api/containers/stats', async (req, res) => {
  try {
    const containers = await docker.listContainers();
    const statsPromises = containers.map(async (containerInfo) => {
      const container = docker.getContainer(containerInfo.Id);
      const stats = await container.stats({ stream: false });
      const inspect = await container.inspect();
      
      return {
        id: containerInfo.Id,
        name: containerInfo.Names[0].replace(/^\//, ''),
        image: containerInfo.Image,
        status: containerInfo.State,
        cpu: calculateCPUPercentage(stats),
        memory: {
          usage: stats.memory_stats.usage,
          limit: stats.memory_stats.limit,
          percentage: (stats.memory_stats.usage / stats.memory_stats.limit * 100).toFixed(2)
        },
        network: stats.networks,
        disk: inspect.GraphDriver,
        created: containerInfo.Created,
        gpu: stats.nvidia_gpu_stats || null // 如果有Nvidia GPU统计信息
      };
    });
    
    const containersStats = await Promise.all(statsPromises);
    res.json(containersStats);
  } catch (error) {
    console.error('获取容器统计信息失败:', error);
    res.status(500).json({ error: '获取容器统计信息失败' });
  }
});

// 计算CPU使用百分比
function calculateCPUPercentage(stats) {
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const cpuCount = stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage.length;
  
  if (systemDelta > 0 && cpuDelta > 0) {
    return ((cpuDelta / systemDelta) * cpuCount * 100).toFixed(2);
  }
  
  return 0;
}

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 