import api from './api';

const productService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Update stock (Admin/Staff)
  updateStock: async (id, stock) => {
    const response = await api.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get low stock alerts
  getLowStockProducts: async () => {
    const response = await api.get('/products/alerts/low-stock');
    return response.data;
  },
};

export default productService;