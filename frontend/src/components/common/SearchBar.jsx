import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Filter,
  Star,
  DollarSign,
  Package,
  ChevronDown,
  Grid3X3,
  List
} from 'lucide-react';
import { getproduct } from '../../redux/Slices/GetProductSlice';

const SearchBar = ({ isFullPage = false, onClose = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList: products, isLoading: loading } = useSelector((state) => state.getProductSlice);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'men', label: 'Men\'s Fashion' },
    { value: 'women', label: 'Women\'s Fashion' },
    { value: 'kids', label: 'Kids & Baby' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'footwear', label: 'Footwear' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const trendingSearches = [
    'Summer collection',
    'Casual shirts',
    'Running shoes',
    'Denim jeans',
    'Formal wear',
    'Handbags'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Load products if not already loaded
    if (products.length === 0) {
      dispatch(getproduct(''));
    }

    // Handle click outside to close search results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, products.length]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = products.filter(product => {
        const matchesQuery = product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || 
                               product.category?.toLowerCase().includes(selectedCategory);
        
        const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                           (!priceRange.max || product.price <= parseFloat(priceRange.max));
        
        return matchesQuery && matchesCategory && matchesPrice;
      });

      const sorted = sortResults(filtered);
      setSearchResults(sorted);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, products, selectedCategory, sortBy, priceRange]);

  const sortResults = (results) => {
    switch (sortBy) {
      case 'price-low':
        return [...results].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-high':
        return [...results].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'newest':
        return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'rating':
        return [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return [...results].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      default:
        return results;
    }
  };

  const saveRecentSearch = (query) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      saveRecentSearch(query);
      if (isFullPage) {
        // If already on search page, just update results
        setSearchQuery(query);
      } else {
        // Navigate to search results page
        navigate(`/search?q=${encodeURIComponent(query)}&category=${selectedCategory}&sort=${sortBy}`);
        onClose && onClose();
      }
    }
  };

  const handleProductClick = (product) => {
    // For now, just navigate to the main page with the product category
    // You can enhance this to navigate to a specific product page
    navigate(`/home/mainpage`);
    setShowResults(false);
    onClose && onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < searchResults.slice(0, 5).length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleProductClick(searchResults[focusedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className={isFullPage ? 'w-full' : 'relative'}>
      {/* Main Search Bar */}
      <div className={`relative ${isFullPage ? 'mb-6' : ''}`}>
        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && focusedIndex === -1 && handleSearch()}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              placeholder="Search for products, brands, or categories..."
              className={`w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm ${
                isFullPage ? 'text-lg' : 'text-sm'
              }`}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Advanced Filters Toggle */}
          {isFullPage && (
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {isFullPage && isAdvancedOpen && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {!isFullPage && !searchQuery && !showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Recent Searches
              </h4>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending Searches
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {trendingSearches.map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(trend)}
                  className="text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {!isFullPage && showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {loading ? 'Searching...' : `Search Results (${searchResults.length})`}
              </h4>
              <button
                onClick={() => handleSearch()}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching products...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords or browse categories</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.slice(0, 5).map((product, index) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      focusedIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h5>
                      <p className="text-xs text-gray-500 capitalize">
                        {product.category}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 mr-1 text-yellow-400" />
                      {product.rating || '4.5'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Page Search Results */}
      {isFullPage && (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h2>
              <span className="text-gray-500">
                ({searchResults.length} results)
              </span>
            </div>
          </div>

          {/* Results Grid/List */}
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className={viewMode === 'list' 
                      ? 'w-24 h-24 object-cover rounded-lg mr-4'
                      : 'w-full h-48 object-cover rounded-lg mb-3'
                    }
                  />
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {product.rating || '4.5'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
