import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  LinearProgress,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import { 
  Memory as MemoryIcon, 
  CloudQueue as CloudIcon,
  Storage as StorageIcon,
  Whatshot as CPUIcon,
  SettingsEthernet as NetworkIcon
} from '@mui/icons-material';

// 格式化内存大小
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getStatusColor = (status) => {
  switch(status) {
    case 'running':
      return 'success';
    case 'paused':
      return 'warning';
    case 'exited':
      return 'error';
    default:
      return 'default';
  }
};

const ContainerCard = ({ container }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" noWrap sx={{ maxWidth: "70%" }}>
            {container.name}
          </Typography>
          <Chip 
            label={container.status} 
            color={getStatusColor(container.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
          <CloudIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          {container.image}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Grid container spacing={2}>
          {/* CPU使用率 */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <CPUIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">CPU使用率</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(parseFloat(container.cpu), 100)} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {container.cpu}%
              </Typography>
            </Box>
          </Grid>
          
          {/* 内存使用率 */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <MemoryIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">内存使用率</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(container.memory.percentage)} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {container.memory.percentage}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatBytes(container.memory.usage)} / {formatBytes(container.memory.limit)}
            </Typography>
          </Grid>
          
          {/* 磁盘信息 */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <StorageIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                磁盘驱动: {container.disk?.Name || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          {/* 网络信息 */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <NetworkIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                网络: {container.network ? Object.keys(container.network).join(', ') : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          {/* GPU信息，如果有的话 */}
          {container.gpu && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Whatshot fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  GPU: {Object.keys(container.gpu).length > 0 ? '使用中' : '未使用'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContainerCard; 