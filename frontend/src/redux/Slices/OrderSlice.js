import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

const API = API_URL;

export const createOrder = createAsyncThunk(
  'order/create', 
  async (orderData, { rejectWithValue }) => {
    try {
      const { userId, items, totalAmount, sessionId } = orderData;

      const payload = {
        userId,
        items,
        totalAmount,
        sessionId,
      };

  const res = await axios.post(`${API}/api/order/orderdetail`, payload);
      
      // Handle rate limiting
      if (res.status === 429) {
        return rejectWithValue({ message: 'Request too frequent. Please wait.' });
      }
      
      return res.data;
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue({ message: 'Order creation request too frequent. Please wait a moment.' });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
  const res = await axios.get(`${API}/api/order/user/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get admin order statistics
export const getOrderStats = createAsyncThunk(
  'order/getOrderStats',
  async (_, { rejectWithValue }) => {
    try {
  const res = await axios.get(`${API}/api/admin/orders/stats/dashboard`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all orders for admin
export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
  const res = await axios.get(`${API}/api/admin/orders`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update order status (admin only)
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/api/admin/orders/${orderId}/status`, {
        status
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderInfo: null,
    userOrders: [],
    allOrders: [],
    orderStats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrderInfo: (state) => {
      state.orderInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.orders || [];
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Get order stats
      .addCase(getOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStats = action.payload.stats;
      })
      .addCase(getOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload.orders || [];
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the order in allOrders array
        const updatedOrder = action.payload.order;
        const orderIndex = state.allOrders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.allOrders[orderIndex] = updatedOrder;
        }
        // Also update in userOrders if it exists
        const userOrderIndex = state.userOrders.findIndex(order => order._id === updatedOrder._id);
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearError, clearOrderInfo } = orderSlice.actions;
export default orderSlice.reducer;
