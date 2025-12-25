import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    base_price: 0,
    group_id: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/me/${id}`);
      setFormData({
        name: response.data.name,
        base_price: response.data.base_price,
        group_id: response.data.group_id || ''
      });
    } catch (error) {
      console.error('Failed to fetch product', error);
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      base_price: Number(formData.base_price),
      group_id: formData.group_id ? Number(formData.group_id) : null
    };

    try {
      if (isEdit) {
        await api.patch(`/products/${id}`, payload);
      } else {
        await api.post('/products/me', payload);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Create Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Group ID (Optional)</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.group_id}
                onChange={(e) => setFormData({...formData, group_id: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
