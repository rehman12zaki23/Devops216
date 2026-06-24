import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../components/common/SearchBar';
import Chatbot from '../../components/common/Chatbot';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { ArrowLeft } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList: products, isLoading: loading } = useSelector((state) => state.getProductSlice);

  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0) {
      dispatch(getproduct(''));
    }
  }, [dispatch, products.length]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBack}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search Products
          </h1>
        </div>

        {/* Search Component */}
        <SearchBar isFullPage={true} />
      </div>
      <Chatbot />
    </div>
  );
};

export default SearchResults;
