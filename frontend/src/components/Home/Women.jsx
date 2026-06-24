import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Women = () => {
  const dispatch = useDispatch();
  const { productList = [], isLoading, error } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const womenProducts = productList?.filter(
    (product) => product?.category?.toLowerCase() === 'women'
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
    <div className="bg-gray-100 min-h-screen py-14 px-6 md:px-10">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Women's Collection</h2>

      {isLoading ? (
        <div className="text-center text-xl text-gray-600 py-20">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : womenProducts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {womenProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-60 object-cover rounded-xl mb-4 bg-gray-200"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.description}</p>
              <p className="text-sm text-gray-500">Brand: <span className="text-gray-700 font-medium">{product.brand}</span></p>
              <p className="text-sm text-gray-500">Stock: <span className="text-green-600 font-semibold">{product.totalStock}</span></p>

              <div className="mt-2">
                <span className="text-blue-600 font-bold text-lg">$ {product.salePrice ?? product.price}</span>
                {product.salePrice && product.salePrice !== product.price && (
                  <span className="ml-2 line-through text-sm text-red-500">$ {product.price}</span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-xl font-bold text-gray-500">No women's products found.</p>
        </div>
      )}
    </div>
  );
};

export default Women;
