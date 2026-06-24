import React, { useEffect, useState } from 'react';
import hero_1 from '../../assets/hero-1.jpg';
import hero_2 from '../../assets/hero-2.jpg';
import hero_3 from '../../assets/hero-3.jpg';
import { User, User2, Baby, ShoppingBag, Footprints } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/Slices/CartSlice';
import HeroSearch from '../common/HeroSearch';
import toast from 'react-hot-toast';

const sliderImages = [hero_1, hero_2, hero_3];

const categories = [
  { name: 'Men', icon: <User size={40} /> },
  { name: 'Women', icon: <User2 size={40} /> },
  { name: 'Kids', icon: <Baby size={40} /> },
  { name: 'Accessories', icon: <ShoppingBag size={40} /> },
  { name: 'Footwear', icon: <Footprints size={40} /> },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.getProductSlice?.productList);
  const isLoading = useSelector((state) => state.getProductSlice?.isLoading);
  const user = useSelector((state) => state.auth?.user);
  const products = productList || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (productId) => {
    if (!user?.id) {
      toast.error('Please login to add products to cart');
      return;
    }

    dispatch(addToCart({ userId: user.id, productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(() => {
        toast.error('Failed to add to cart');
      });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Search Section */}
      <HeroSearch />

      {/* Hero Slider */}
      <div className="relative h-[600px] md:h-[900px] overflow-hidden">
        <img
          src={sliderImages[currentSlide]}
          alt="Hero Slide"
          className="absolute inset-0 w-full h-full object-cover transition duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight">
            Greatest Sale of the Year is Now
          </h1>
          <p className="mb-8 text-lg md:text-2xl font-medium drop-shadow-lg">Don’t miss out on our limited-time offers!</p>
          <Link to='/home/mainpage'>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 text-lg">
              Go to Collection
            </button>
          </Link>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fadeInUp">
            <h2 className="text-3xl md:text-6xl font-extrabold mb-4 text-gradient tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg md:text-xl mb-16 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every style and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 animate-fadeInUp">
            {categories.map((cat, idx) => (
              <Link key={idx} to={`/home/${cat.name.toLowerCase()}`}>
                <div className="category-card rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer group animate-float" 
                     style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="mb-6 bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 shadow-lg group-hover:shadow-glow">
                    <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                      {cat.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-700 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {cat.name}
                  </h3>
                  <div className="w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-12 tracking-tight">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {isLoading ? (
            <p className="text-center col-span-full text-lg font-semibold text-blue-600 animate-pulse">Loading products...</p>
          ) : products.length > 0 ? (
            products.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col border border-gray-100 group"
              >
                <div className="relative">
                  <img
                    onClick={() => handleProductClick(product._id)}
                    src={product.image}
                    alt={product.title}
                    className="h-48 w-full object-cover rounded-xl bg-gray-200 mb-4 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.salePrice && product.salePrice !== product.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Sale
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">Brand: {product.brand}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">Category: {product.category}</span>
                  <span className="text-xs bg-green-100 px-2 py-1 rounded text-green-700 font-semibold">Stock: {product.totalStock}</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-blue-600 font-bold text-2xl">${product.price}</span>
                  {product.salePrice && product.salePrice !== product.price && (
                    <span className="line-through text-lg text-red-500">${product.salePrice}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 mt-6"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-96 w-full col-span-full">
              <p className="text-2xl font-bold text-gray-400">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

