import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Kids = () => {
  const dispatch = useDispatch();
  const { productList = [], isLoading, error } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const kidsProducts = productList?.filter(
    (product) => product?.category?.toLowerCase() === 'kids'
  );

  const handleAddToCart = (productId) => {
    if (!userId) {
      toast.error('Please login to add products to cart');
      return;
    }

    dispatch(addToCart({ userId, productId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Product added to cart!'))
      .catch(() => toast.error('Failed to add to cart'));
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 min-h-screen py-14 px-6 md:px-10">
      <h2 className="text-5xl font-extrabold text-center text-pink-600 mb-10 drop-shadow-lg">
        <span role="img" aria-label="kids">🧸</span> Kids Collection <span role="img" aria-label="kids">🎈</span>
      </h2>

      {isLoading ? (
        <div className="text-center text-xl text-blue-400 py-20 animate-bounce">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : kidsProducts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {kidsProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition p-6 flex flex-col border-4 border-dashed border-pink-200 relative"
            >
              <div className="absolute top-3 right-3 text-2xl">
                <span role="img" aria-label="star">⭐</span>
              </div>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-56 object-cover rounded-2xl mb-4 bg-yellow-100 border-2 border-blue-200"
              />
              <h3 className="text-xl font-bold text-pink-700 mb-1">{product.title}</h3>
              <p className="text-sm text-blue-500 mb-1">{product.description}</p>
              <p className="text-sm text-yellow-600">Brand: <span className="text-blue-700 font-medium">{product.brand}</span></p>
              <p className="text-sm text-green-600">Stock: <span className="font-semibold">{product.totalStock}</span></p>

              <div className="mt-2">
                <span className="text-blue-600 font-extrabold text-lg">$ {product.salePrice ?? product.price}</span>
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="ml-2 line-through text-sm text-red-400">$ {product.price}</span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition duration-300 mt-4 flex items-center justify-center gap-2"
              >
                <span role="img" aria-label="cart">🛒</span> Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-2xl font-bold text-pink-400 animate-pulse">
            <span role="img" aria-label="sad">😢</span> No kids products found.
          </p>
        </div>
      )}
    </div>
  );
};

export default Kids;
