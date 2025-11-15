import api from './api';

const salesService = {
  checkout: async (saleData) => {
    const response = await api.post('/sales/checkout', saleData);
    return response.data;
  },

  createSale: async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  getAllSales: async (params = {}) => {
    const response = await api.get('/sales', { params });
    return response.data;
  },

  getSale: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  getMySales: async () => {
    const response = await api.get('/sales/my/history');
    return response.data;
  },

  getSalesStats: async () => {
    const response = await api.get('/sales/stats/summary');
    return response.data;
  },
};

export default salesService;