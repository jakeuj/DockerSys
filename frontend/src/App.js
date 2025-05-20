import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Box, Tab, Tabs, Container } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import Dashboard from './components/Dashboard';
import ContainerList from './components/ContainerList';
import api from './services/api';

// 创建深色和浅色主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
  },
});

function App() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  
  // 获取容器数据
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
  
  // 切换主题
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // 切换标签页
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ height: '60px', marginRight: '10px' }} 
              />
              Docker容器监控系统
            </Typography>
            <Box sx={{ mr: 2 }}>
              <Typography 
                component="span" 
                sx={{ cursor: 'pointer' }}
                onClick={toggleTheme}
              >
                {darkMode ? '浅色模式' : '深色模式'}
              </Typography>
            </Box>
          </Toolbar>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab icon={<DashboardIcon />} label="仪表板" />
            <Tab icon={<ViewListIcon />} label="容器列表" />
          </Tabs>
        </AppBar>
      </Box>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {activeTab === 0 ? (
          // 仪表板视图
          <Dashboard containers={containers} loading={loading} error={error} />
        ) : (
          // 容器列表视图
          <ContainerList />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App; 