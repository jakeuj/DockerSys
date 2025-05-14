import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = {
  // 获取所有容器列表
  getContainers: async () => {
    try {
      const response = await axios.get(`${API_URL}/containers`);
      return response.data;
    } catch (error) {
      console.error('获取容器列表失败:', error);
      throw error;
    }
  },
  
  // 获取单个容器的详细状态
  getContainerStats: async (containerId) => {
    try {
      const response = await axios.get(`${API_URL}/containers/${containerId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`获取容器 ${containerId} 状态失败:`, error);
      throw error;
    }
  },
  
  // 获取所有容器的状态信息
  getAllContainersStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/containers/stats`);
      return response.data;
    } catch (error) {
      console.error('获取所有容器状态失败:', error);
      throw error;
    }
  }
};

export default api; 