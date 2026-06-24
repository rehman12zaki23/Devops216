import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Men = () => {
  const dispatch = useDispatch();
  const { productList = [], isLoading, error } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const menProducts = productList?.filter(
    (product) => product?.category?.toLowerCase() === 'men'
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
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen py-14 px-6 md:px-10">
      <h2 className="text-5xl font-extrabold text-center text-white mb-12 tracking-wide drop-shadow-lg">
        Men's Collection
      </h2>

      {isLoading ? (
        <div className="text-center text-xl text-gray-300 py-20">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-20">{error}</div>
      ) : menProducts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {menProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gradient-to-t from-gray-800 to-gray-700 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border-2 border-blue-700"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover rounded-xl mb-5 bg-gray-900 border-2 border-blue-800"
              />
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{product.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{product.description}</p>
              <p className="text-sm text-gray-400 mb-1">
                Brand: <span className="text-blue-300 font-semibold">{product.brand}</span>
              </p>
              <p className="text-sm text-gray-400 mb-2">
                Stock: <span className="text-green-400 font-bold">{product.totalStock}</span>
              </p>

              <div className="mt-2 flex items-center">
                <span className="text-blue-400 font-extrabold text-xl">$ {product.salePrice ?? product.price}</span>
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="ml-3 line-through text-base text-red-400">$ {product.price}</span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 mt-6 uppercase tracking-wider"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-2xl font-bold text-gray-300">No men's products found.</p>
        </div>
      )}
    </div>
  );
};

export default Men;
