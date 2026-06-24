import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, deleteCartItem, updateCartItem } from '../../redux/Slices/CartSlice';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Chatbot from '../../components/common/Chatbot';
import { API_URL } from '../../utils/apiConfig';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rlrb6QU12STd9GvoZvjGzJZLQM0lCNYUdtq3vOBChu4TZFYkZWMVP0xuN9wqKSTVvFhf70mWjovRnB1VVsBIncY00AU4OIGwT';
const stripePromise = loadStripe(STRIPE_PK);
const API = API_URL;

const Cart = () => {
  const dispatch = useDispatch();
  const [stripeLoading, setStripeLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const { cartList, isLoading, error } = useSelector((state) => state.cartProducts || {});
  const safeCartList = Array.isArray(cartList) ? cartList : [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchproductCart(userId)).unwrap().catch(err => {
        console.error("Cart fetch error:", err);
      });
    }
  }, [dispatch, userId]);

  const handleCheckout = async () => {
    if (safeCartList.length === 0 || !userId) {
      return toast.error("Cart is empty or user not found.");
    }

    if (isProcessing || stripeLoading) {
      return toast.info("Checkout already in progress...");
    }

    setStripeLoading(true);
    setIsProcessing(true);

    try {
      // Validate cart items before proceeding
      const validItems = safeCartList.filter(item => 
        item.productId && 
        item.productId._id && 
        item.quantity > 0 && 
        item.productId.price > 0
      );

      if (validItems.length === 0) {
        toast.error("No valid items in cart.");
        return;
      }

      const response = await axios.post(`${API}/api/checkout/create-checkout-session`, {
        userId,
        cartItems: validItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          name: item.productId.title,
          image: item.productId.image
        }))
      });

      if (!response.data.id) {
        throw new Error("Failed to create checkout session");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err.response?.data?.error || err.message || "Checkout failed.");
    } finally {
      setStripeLoading(false);
      setIsProcessing(false);
    }
  };

  const handleDelete = async (productId) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      await dispatch(deleteCartItem({ userId, productId })).unwrap();
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Delete item error:", err);
      toast.error("Failed to remove item.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1 || isProcessing) return;
    
    try {
      setIsProcessing(true);
      await dispatch(updateCartItem({ userId, productId, quantity })).unwrap();
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error("Failed to update quantity.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = safeCartList.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading your cart...</div>;
  }

  if (error && !error.includes('Cart not found')) {
    return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;
  }

  if (!userId) {
    return <div className="p-6 text-center text-yellow-700">Please log in to view your cart.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">Your Cart</h2>

      {safeCartList.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
            {safeCartList.map(item => {
              const product = item.productId;
              return (
                <div key={product._id} className="p-6 border-b last:border-b-0 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-6 w-full md:w-auto">
                    <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">${product.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isProcessing}
                      className={`px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-bold text-lg transition hover:bg-gray-200 ${item.quantity <= 1 || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="px-4 py-1 rounded bg-gray-200 text-gray-800 font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                      disabled={isProcessing}
                      className={`px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-bold text-lg transition hover:bg-gray-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Increase quantity"
                    >+</button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={isProcessing}
                      className={`ml-4 px-4 py-1 rounded-full bg-red-100 text-red-600 font-semibold transition hover:bg-red-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl shadow flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-semibold text-gray-700">Total:</span>
              <span className="ml-4 text-2xl font-bold text-blue-700">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={stripeLoading || isProcessing}
              className={`w-full md:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg font-bold text-lg shadow transition hover:bg-blue-700 ${
                stripeLoading || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {stripeLoading || isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
      <Chatbot />
    </div>
  );
};

export default Cart;
