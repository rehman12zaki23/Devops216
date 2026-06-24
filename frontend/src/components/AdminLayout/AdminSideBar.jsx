import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  X, 
  LogOut,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  Home
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/Slices/authSlice';

const AdminSideBar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <BarChart3 size={20} />,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Products', 
      path: '/admin/products', 
      icon: <Package size={20} />,
      description: 'Manage Inventory'
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: <ShoppingCart size={20} />,
      description: 'Order Management'
    },
  ];

  const quickActions = [
    {
      name: 'View Store',
      path: '/home/homepage',
      icon: <Home size={20} />,
      description: 'Go to Customer View'
    }
  ];
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth/login');
    if (onClose) onClose();
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose(); // Close mobile sidebar
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
      
      {/* Header */}
      <div className="relative p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-gray-400">Management Dashboard</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 mb-2 w-full text-left ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'hover:bg-gray-700 hover:bg-opacity-60 text-gray-300 hover:text-white hover:transform hover:translate-x-2'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
                  {item.icon}
                </div>
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 transition-opacity ${isActive(item.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </p>
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => handleNavClick(action.path)}
              className="group flex items-center justify-between p-3 rounded-lg transition-all duration-200 w-full text-left hover:bg-gray-700 hover:bg-opacity-60 text-gray-300 hover:text-white"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
                  {action.icon}
                </div>
                <div>
                  <span className="text-sm font-medium">{action.name}</span>
                  <p className="text-xs opacity-75">{action.description}</p>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Stats
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Active Orders</span>
              </div>
              <span className="text-sm font-semibold text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">New Customers</span>
              </div>
              <span className="text-sm font-semibold text-white">8</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer with logout */}
      <div className="relative p-6 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Version 2.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
