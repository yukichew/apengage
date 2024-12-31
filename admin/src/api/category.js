import client from '.';
import { catchError } from '../utils/error';

export const getCategories = async () => {
  try {
    const { data } = await client.get('/category/categories');
    return {
      success: true,
      categories: data.categories,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const addCategory = async (values) => {
  try {
    const { data } = await client.post('/category/create', values);
    return {
      success: true,
      category: data.category,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updatecategory = async (id, values) => {
  try {
    const { data } = await client.put('/category/' + id, values);
    return {
      success: true,
      category: data.category,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getCategory = async (id) => {
  try {
    const { data } = await client.get('/category/' + id);
    return {
      success: true,
      category: data.category,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await client.delete('/category/' + id);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchCategory = async (query) => {
  try {
    const { data } = await client('/category/search?name=' + query);
    return {
      success: true,
      categories: data.categories,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateCategoryStatus = async (id, action) => {
  try {
    const { data } = await client.put('/category/status/' + id, {
      action,
    });
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};
