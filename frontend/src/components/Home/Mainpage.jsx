import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getproduct, productDetails } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Mainpage = () => {
  const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const brands = ['Nike', 'Adidas', 'Bata', 'Ndure', 'Zara', 'Puma', 'LV'];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartList = [] } = useSelector((state) => state.cartProducts || {});
  const { productList = [], isLoading } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const brandParam = params.get('brand');
    const sortParam = params.get('sort');

    if (categoryParam) setSelectedCategories(categoryParam.split(','));
    if (brandParam) setSelectedBrands(brandParam.split(','));
    if (sortParam) setSortOption(sortParam);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (selectedBrands.length > 0) params.set('brand', selectedBrands.join(','));
    if (sortOption) params.set('sort', sortOption);

    const queryString = params.toString();
    navigate({ search: queryString });
    dispatch(getproduct(queryString));
  }, [selectedCategories, selectedBrands, sortOption, navigate, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getproductDetails = (id) => {
    dispatch(productDetails(id))
      .unwrap()
      .then(() => {
        navigate(`/product/${id}`);
      })
      .catch(() => {
        toast.error('Failed to fetch product details');
      });
  };

  const handleAddToCart = (productId) => {
    if (!userId) {
      toast.error('Please login to add products to cart');
      return;
    }

    dispatch(addToCart({ userId, productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(() => {
        toast.error('Failed to add to cart');
      });
  };

  return (
    <div className="flex px-8 py-8 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen gap-8">
      {/* Sidebar */}
      <aside className="w-72 bg-white p-8 rounded-3xl shadow-xl border border-blue-100 sticky top-8 self-start">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-blue-700">Category</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition">
                <input
                  type="checkbox"
                  className="accent-blue-600 mr-3 h-4 w-4"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="text-gray-700 font-medium">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-blue-700">Brand</h2>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition">
                <input
                  type="checkbox"
                  className="accent-blue-600 mr-3 h-4 w-4"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span className="text-gray-700 font-medium">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight">All Products</h2>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-base">
              Showing <span className="text-blue-600 font-semibold">{productList.length} Products</span>
            </span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-blue-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
            >
              <option value="">Default</option>
              <option value="high">Price: High to Low</option>
              <option value="low">Price: Low to High</option>
              <option value="atz">Title: A to Z</option>
              <option value="zta">Title: Z to A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <p className="text-2xl font-semibold text-blue-500 animate-pulse">Loading products...</p>
            </div>
          ) : productList.length > 0 ? (
            productList.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-5 flex flex-col border border-blue-100"
              >
                <div className="relative group">
                  <img
                    onClick={() => getproductDetails(product._id)}
                    src={product.image}
                    alt={product.title}
                    className="h-48 w-full object-cover rounded-xl bg-gray-200 mb-4 cursor-pointer group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => getproductDetails(product._id)}
                    className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    View
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    Brand: {product.brand}
                  </span>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Category: {product.category}
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    Stock: <span className="font-bold">{product.totalStock}</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-blue-700 font-extrabold text-xl">${product.price}</span>
                  {product.salePrice && product.salePrice !== product.price && (
                    <span className="ml-2 line-through text-sm text-red-500">${product.salePrice}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 mt-5"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-96 w-full col-span-full">
              <p className="text-2xl font-bold text-gray-400">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mainpage;
