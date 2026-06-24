import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, clearCartFromDB, clearCart } from '../../redux/Slices/CartSlice';
import { createOrder } from '../../redux/Slices/OrderSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import uniqueToast from '../../utils/toastUtils';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const userId = useSelector((state) => state.auth.userId);

  const hasFinalized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const finalizeOrder = async () => {
      // Check if this session has already been processed globally
      const processedKey = `order_processed_${sessionId}`;
      const hasBeenProcessed = localStorage.getItem(processedKey);
      
      // Prevent multiple executions with multiple checks
      if (!userId || !sessionId || hasFinalized.current || hasBeenProcessed) {
        if (hasBeenProcessed) {
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/home', { replace: true }), 1000);
          return;
        }
        
        if (!hasFinalized.current) {
          if (!userId) {
            uniqueToast.error("User not found. Please login again.");
            navigate('/login');
          } else if (!sessionId) {
            uniqueToast.error("Invalid session. Please try checkout again.");
            navigate('/cart');
          }
        }
        return;
      }
      
      hasFinalized.current = true;
      
      // Mark this session as being processed to prevent any duplicates
      localStorage.setItem(processedKey, 'true');

      try {
        setLoading(true);
        setError(null);

        // Fetch current cart
        const cartResponse = await dispatch(fetchproductCart(userId)).unwrap();
        const cartItems = cartResponse?.data?.items || [];

        if (cartItems.length === 0) {
          uniqueToast.error("Cart is empty. Cannot place order.");
          navigate('/');
          return;
        }

        // Prepare order items
        const items = cartItems.map(item => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          price: item.productId.price,
          salePrice: item.productId.salePrice || null,
          quantity: item.quantity
        }));

        const totalAmount = items.reduce(
          (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
          0
        );

        // Create order with session ID to prevent duplicates
        const orderResponse = await dispatch(createOrder({ 
          userId, 
          items, 
          totalAmount, 
          sessionId 
        })).unwrap();

        // Only clear cart and show success if order was successfully created
        if (orderResponse.success) {
          await dispatch(clearCartFromDB(userId)).unwrap();
          dispatch(clearCart());
          
          setSuccess(true);
          uniqueToast.success("Order placed successfully!");
          
          // Mark as successfully processed
          localStorage.setItem(`order_success_${sessionId}`, 'true');
          
          // Redirect after a delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          throw new Error("Order creation failed");
        }
        
      } catch (err) {
        console.error("Finalize order failed:", err);
        
        // Handle specific error cases
        if (err.message?.includes('Order already exists') || err.message?.includes('already processed')) {
          setSuccess(true);
          uniqueToast.success("Your order has already been processed!");
          localStorage.setItem(`order_success_${sessionId}`, 'true');
          setTimeout(() => navigate('/', { replace: true }), 1500);
        } else {
          const errorMessage = err.message || "Something went wrong during order processing.";
          setError(errorMessage);
          uniqueToast.error("Order processing failed. Please contact support.");
          // Remove the processing flag on error so user can retry
          localStorage.removeItem(processedKey);
        }
      } finally {
        setLoading(false);
      }
    };

    finalizeOrder();
  }, [dispatch, userId, sessionId, navigate]);

  // Cleanup processed sessions from localStorage (optional - prevents storage bloat)
  useEffect(() => {
    return () => {
      // Clean up old processed sessions (older than 1 hour)
      const cleanupOldSessions = () => {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('order_processed_') || key.startsWith('order_success_')) {
            const timestamp = localStorage.getItem(`${key}_timestamp`);
            if (timestamp && parseInt(timestamp) < oneHourAgo) {
              localStorage.removeItem(key);
              localStorage.removeItem(`${key}_timestamp`);
            }
          }
        });
      };
      cleanupOldSessions();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          {loading ? "Processing..." : error ? "Oops!" : "Thank You!"}
        </h2>
        
        {loading && (
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Your payment was successful. We're creating your order...
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-4">
            <div className="text-red-600 mb-2">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Cart
            </button>
          </div>
        )}
        
        {!loading && !error && success && (
          <div>
            <div className="text-green-600 mb-2 text-4xl">✅</div>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully! Redirecting you to home page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
