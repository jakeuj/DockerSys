import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContainerCard from './ContainerCard';
import api from '../services/api';

const ContainerList = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const fetchContainersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllContainersStats();
      setContainers(data);
    } catch (err) {
      console.error('获取容器数据失败:', err);
      setError('无法加载容器数据。请确保Docker守护进程正在运行并且后端服务已启动。');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载和定时刷新
  useEffect(() => {
    fetchContainersData();
    
    // 每10秒刷新一次
    const interval = setInterval(() => {
      fetchContainersData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 过滤容器
  const filteredContainers = statusFilter === 'all' 
    ? containers 
    : containers.filter(container => container.status === statusFilter);
  
  // 处理过滤器变更
  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };
  
  // 手动刷新
  const handleRefresh = () => {
    fetchContainersData();
  };
  
  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Docker容器监控面板
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          刷新
        </Button>
      </Box>
      
      {/* 过滤器 */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">状态过滤</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="状态过滤"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">所有容器</MenuItem>
            <MenuItem value="running">运行中</MenuItem>
            <MenuItem value="exited">已停止</MenuItem>
            <MenuItem value="paused">已暂停</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* 加载状态 */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {/* 错误信息 */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {/* 无容器信息 */}
      {!loading && !error && filteredContainers.length === 0 && (
        <Alert severity="info">
          {statusFilter === 'all' 
            ? '没有找到任何Docker容器。请确保Docker正在运行，并且已创建了一些容器。' 
            : `没有处于"${statusFilter}"状态的容器。`}
        </Alert>
      )}
      
      {/* 容器列表 */}
      {!loading && !error && filteredContainers.length > 0 && (
        <Grid container spacing={3}>
          {filteredContainers.map((container) => (
            <Grid item xs={12} md={6} key={container.id}>
              <ContainerCard container={container} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ContainerList; 