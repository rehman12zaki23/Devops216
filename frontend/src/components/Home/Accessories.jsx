import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Accessories = () => {
  const dispatch = useDispatch();
  const { productList = [], isLoading, error } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const accessoriesProducts = productList?.filter(
    (product) => product?.category?.toLowerCase() === 'accessories'
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
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen py-14 px-4 md:px-10">
      <h2 className="text-5xl font-extrabold text-center text-purple-700 mb-12 tracking-tight drop-shadow-lg">
        Accessories Collection
      </h2>

      {isLoading ? (
        <div className="text-center text-xl text-gray-600 py-20">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : accessoriesProducts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {accessoriesProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-purple-100 relative group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 object-cover rounded-2xl mb-4 bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100 border border-purple-200"
                />
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-pink-600 transition">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold text-purple-600">Brand:</span> {product.brand}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-semibold text-green-600">Stock:</span> {product.totalStock}
              </p>

              <div className="mt-2 flex items-center space-x-3">
                <span className="text-pink-600 font-bold text-xl">$ {product.salePrice ?? product.price}</span>
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="line-through text-sm text-gray-400">$ {product.price}</span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 mt-6 w-full"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-2xl font-bold text-purple-400">No accessories found.</p>
        </div>
      )}
    </div>
  );
};

export default Accessories;
