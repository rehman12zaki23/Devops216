import authReducer from "../Slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import AdminProductSlice from "../Slices/AdminProductSlice"
import getProductSlice from "../Slices/GetProductSlice"
import cartSlice from "../Slices/CartSlice"
import orderSlice from "../Slices/OrderSlice"


const store=configureStore({
  reducer:{
    auth:authReducer,
    adminProducts:AdminProductSlice,
    getProductSlice:getProductSlice,
    cartProducts:cartSlice,
    orderProduct:orderSlice
  }
})

export default store;