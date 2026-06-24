import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

const API = API_URL;

const initialState = {
  isLoading: false,
  productList: [],
  products: [], // For search functionality
  error: null,
  productDetails: []
};

export const getproduct = createAsyncThunk(
  'products/getproducts',
  async (queryString, thunkAPI) => {
    try {
  const res = await axios.get(`${API}/api/getProducts/get?${queryString}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch products');
    }
  }
);

export const getFilteredProducts = createAsyncThunk(
  'products/getFilteredProducts',
  async (filters = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.minPrice) {
        queryParams.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        queryParams.append('maxPrice', filters.maxPrice);
      }
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
      }
      
  const res = await axios.get(`${API}/api/getProducts/get?${queryParams.toString()}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch products');
    }
  }
);

export const productDetails = createAsyncThunk(
  'products/productdetails',
  async (id) => {
    try {
  const res = await axios.get(`${API}/api/getProducts/get/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch products');
    }
  }
);

const GetProductSlice = createSlice({
  name: 'getProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getproduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getproduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data; 
        state.error = null;
      })
      .addCase(getproduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload || 'Something went wrong';
      })
      
      // Handle getFilteredProducts
      .addCase(getFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.productList = action.payload.data; // Keep both for compatibility
        state.error = null;
      })
      .addCase(getFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(productDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails =action.payload.data;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export default GetProductSlice.reducer;
