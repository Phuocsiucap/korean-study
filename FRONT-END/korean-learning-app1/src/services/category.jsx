import { apiCall } from "./rootAPI"

export const getCategories = async ()=> apiCall('get', "/categories");

export const getCategoryById = async (id) => apiCall('get', `/categories/${id}`);

export const createCategory = async (categoryData) => apiCall('post', '/categories', categoryData);

export const updateCategory = async (id, categoryData) => apiCall('put', `/categories/${id}`, categoryData);    

export const deleteCategory = async (id) => apiCall('delete', `/categories/${id}`);