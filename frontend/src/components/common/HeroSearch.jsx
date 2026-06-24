import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Star, ShoppingBag } from 'lucide-react';

const HeroSearch = () => {
  const navigate = useNavigate();

  const trendingCategories = [
    { name: 'Summer Collection', image: '/api/placeholder/200/200', category: 'summer' },
    { name: 'Men\'s Fashion', image: '/api/placeholder/200/200', category: 'men' },
    { name: 'Women\'s Wear', image: '/api/placeholder/200/200', category: 'women' },
    { name: 'Kids Fashion', image: '/api/placeholder/200/200', category: 'kids' }
  ];

  const quickSearches = ['Casual Shirts', 'Running Shoes', 'Denim Jeans', 'Handbags', 'Formal Wear'];

  const handleQuickSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/home/${category}`);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Hero Content */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            Discover Your Perfect Style
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore thousands of premium products from top brands. Find exactly what you're looking for with our smart search.
          </p>

          {/* Main Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="group inline-flex items-center space-x-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 rounded-2xl px-8 py-4 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Search className="h-6 w-6 group-hover:text-blue-500" />
            <span className="text-lg font-medium">Start Your Search...</span>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Try Now
            </div>
          </button>
        </div>

        {/* Quick Search Tags */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-sm font-semibold text-gray-600">Popular Searches:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {quickSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(term)}
                className="bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-gray-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Trending Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.category)}
                className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-purple-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  <ShoppingBag className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Explore Collection</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1000+</div>
            <div className="text-sm text-gray-600">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
            <div className="text-sm text-gray-600">Top Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">4.9★</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
