import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/apiConfig";

const API = API_URL;

const initialState = {
  cartList: [],
  isLoading: false,
  error: null
}

export const addToCart = createAsyncThunk(
  'products/addtocart',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
  const res = await axios.post(`${API}/api/cart/add`, {
        userId,
        productId,
        quantity
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchproductCart = createAsyncThunk(
  'products/fetchproductCart',
  async (userId, { rejectWithValue }) => {
    try {
  const res = await axios.get(`${API}/api/cart/get/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'products/deleteCartItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
  const res = await axios.delete(`${API}/api/cart/delete/${userId}/${productId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'products/updatecart',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
  const res = await axios.put(`${API}/api/cart/update/${userId}/${productId}`, {
        quantity
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCartFromDB = createAsyncThunk(
  'products/clearCartFromDB',
  async (userId, { rejectWithValue }) => {
    try {
  const res = await axios.delete(`${API}/api/cart/clear/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
 reducers: {
  clearCartError: (state) => {
    state.error = null;
  },
  clearCartState: (state) => {
    state.cartList = [];
    state.isLoading = false;
    state.error = null;
  },
  clearCart: (state) => {
     console.log("Redux reducer: clearCart triggered");
    state.cartList = [];  
  }
}
,
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartList = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Fetch cart
      .addCase(fetchproductCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchproductCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartList = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(fetchproductCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartList = [];
        state.error = action.payload?.message || action.error.message;
      })
      
      // Delete cart item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartList = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartList = action.payload.data?.items || [];
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(clearCartFromDB.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(clearCartFromDB.fulfilled, (state) => {
  state.isLoading = false;
  state.cartList = [];
  state.error = null;
})
.addCase(clearCartFromDB.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload?.message || action.error.message;
})
  }
})

export const { clearCartError,clearCart} = cartSlice.actions;
export default cartSlice.reducer;