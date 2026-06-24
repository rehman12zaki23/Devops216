import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Footwear = () => {
  const dispatch = useDispatch();
  const { productList = [], isLoading, error } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const footwearProducts = productList?.filter(
    (product) => product?.category?.toLowerCase() === 'footwear'
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
    <div className="bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 min-h-screen py-16 px-4 md:px-12">
      <h2 className="text-5xl font-extrabold text-center text-blue-700 mb-12 drop-shadow-lg tracking-tight font-sans">
        <span className="inline-block bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          Footwear Collection
        </span>
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></span>
          <span className="ml-4 text-2xl text-gray-600">Loading products...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-96">
          <span className="text-2xl text-red-500 font-semibold">{error}</span>
        </div>
      ) : footwearProducts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {footwearProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border-2 border-blue-100 hover:border-blue-400 relative group"
            >
              <div className="relative flex justify-center items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-contain rounded-2xl mb-4 bg-gradient-to-br from-blue-100 via-white to-pink-100 group-hover:scale-105 transition-transform duration-300 border-4 border-blue-200"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                />
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 truncate font-serif tracking-wide">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2 font-light italic">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Brand:</span>
                <span className="text-gray-700 font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Stock:</span>
                <span className={`font-semibold ${product.totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.totalStock > 0 ? product.totalStock : 'Out of stock'}
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-3">
                <span className="text-blue-600 font-bold text-xl">
                  $ {product.salePrice ?? product.price}
                </span>
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="line-through text-base text-red-400">$ {product.price}</span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={product.totalStock === 0}
                className={`bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 hover:from-blue-700 hover:via-pink-600 hover:to-yellow-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 mt-6
                  ${product.totalStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-2xl font-bold text-gray-400">No footwear products found.</p>
        </div>
      )}
    </div>
  );
};

export default Footwear;
