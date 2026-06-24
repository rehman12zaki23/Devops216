import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../utils/apiConfig'

const API = API_URL;

const initialState={
  isLoading:false,
  productList : [],
  error: null
}

export const addnewproduct=createAsyncThunk('/products/addnewproduct',async formData=>{
  const result=await axios.post(`${API}/api/product/add`,formData,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  return result.data

})
export const fetchAllProduct=createAsyncThunk('/products/fetchallproduct',async ()=>{
  const result=await axios.get(`${API}/api/product/fetch`
  )
  return result.data

})
export const editproduct=createAsyncThunk('/products/editproduct',async ({id,formData})=>{
  const result=await axios.put(`${API}/api/product/edit/${id}`,formData,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  return result.data

})
export const deleteproduct=createAsyncThunk('/products/deleteproduct',async (id)=>{
  const result=await axios.delete(`${API}/api/product/delete/${id}`)
  return {id}

})

const AdminProductSlice=createSlice({
  name:'adminProduct',
  initialState,
  reducers:{
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers:(builder)=>{
    builder
      // Add Product
      .addCase(addnewproduct.pending,(state)=>{
        state.isLoading=true;
        state.error=null;
      })
      .addCase(addnewproduct.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.error=null;
      })
      .addCase(addnewproduct.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.error.message;
      })
      
      // Fetch Products
      .addCase(fetchAllProduct.pending,(state)=>{
        state.isLoading=true;
        state.error=null;
      })
      .addCase(fetchAllProduct.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.productList=action.payload.data;
        state.error=null;
      })
      .addCase(fetchAllProduct.rejected,(state,action)=>{
        state.isLoading=false;
        state.productList=[];
        state.error=action.error.message;
      })
      
      // Edit Product
      .addCase(editproduct.pending,(state)=>{
        state.isLoading=true;
        state.error=null;
      })
      .addCase(editproduct.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.error=null;
        // Update the product in the list
        const updatedProduct = action.payload.data;
        const index = state.productList.findIndex(product => product._id === updatedProduct._id);
        if (index !== -1) {
          state.productList[index] = updatedProduct;
        }
      })
      .addCase(editproduct.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.error.message;
      })
      
      // Delete Product
      .addCase(deleteproduct.pending,(state)=>{
        state.isLoading=true;
        state.error=null;
      })
      .addCase(deleteproduct.fulfilled, (state, action) => {
        state.isLoading=false;
        const deletedId = action.payload.id;
        state.productList = state.productList.filter(product => product._id !== deletedId);
        state.error=null;
      })
      .addCase(deleteproduct.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.error.message;
      })
  }
})
export const { clearError } = AdminProductSlice.actions;
export default AdminProductSlice.reducer