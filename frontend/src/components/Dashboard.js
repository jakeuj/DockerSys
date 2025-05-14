import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = ({ containers }) => {
  const theme = useTheme();
  
  // 如果没有容器数据
  if (!containers || containers.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">没有可用的容器数据来显示资源使用情况</Typography>
      </Paper>
    );
  }
  
  // 运行中容器的数量
  const runningContainers = containers.filter(c => c.status === 'running').length;
  const exitedContainers = containers.filter(c => c.status === 'exited').length;
  const pausedContainers = containers.filter(c => c.status === 'paused').length;
  
  // 容器状态数据（用于饼图）
  const statusData = [
    { name: '运行中', value: runningContainers, color: theme.palette.success.main },
    { name: '已停止', value: exitedContainers, color: theme.palette.error.main },
    { name: '已暂停', value: pausedContainers, color: theme.palette.warning.main }
  ].filter(item => item.value > 0);
  
  // CPU使用率数据（用于柱状图）
  const cpuData = containers
    .filter(c => c.status === 'running')
    .sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu))
    .slice(0, 5)  // 取CPU使用率最高的5个容器
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      cpu: parseFloat(c.cpu)
    }));
    
  // 内存使用率数据（用于柱状图）
  const memoryData = containers
    .filter(c => c.status === 'running')
    .sort((a, b) => parseFloat(b.memory.percentage) - parseFloat(a.memory.percentage))
    .slice(0, 5)  // 取内存使用率最高的5个容器
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      memory: parseFloat(c.memory.percentage)
    }));
  
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>系统概览</Typography>
      
      <Grid container spacing={3}>
        {/* 容器状态统计卡片 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>容器状态分布</Typography>
              <Box height={240} display="flex" justifyContent="center" alignItems="center">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2">没有容器数据</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* CPU使用率排名 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>CPU使用率 Top 5</Typography>
              <Box height={240}>
                {cpuData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cpuData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, 'CPU使用率']} />
                      <Bar dataKey="cpu" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2">没有运行中的容器</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 内存使用率排名 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>内存使用率 Top 5</Typography>
              <Box height={240}>
                {memoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={memoryData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, '内存使用率']} />
                      <Bar dataKey="memory" fill={theme.palette.secondary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2">没有运行中的容器</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 