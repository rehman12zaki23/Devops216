import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderStats } from '../../redux/Slices/OrderSlice';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Clock,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Activity,
  Target,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orderStats, loading, error } = useSelector((state) => state.orderProduct);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getOrderStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        style: { background: '#EF4444', color: '#fff' }
      });
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOrderStats());
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGrowthPercentage = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading && !orderStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!orderStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Unable to load dashboard statistics</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-xl shadow-md">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Enhanced Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-blue-200" />
              </div>
              <h3 className="text-white text-opacity-80 text-sm font-medium">Total Orders</h3>
              <p className="text-3xl font-bold">{orderStats.total?.orders || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+12% from last month</span>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <DollarSign className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-emerald-200" />
              </div>
              <h3 className="text-white text-opacity-80 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold">{formatCurrency(orderStats.total?.revenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+8.2% from last month</span>
              </div>
            </div>
          </div>

          {/* Today's Orders Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
                <Activity className="h-5 w-5 text-purple-200" />
              </div>
              <h3 className="text-white text-opacity-80 text-sm font-medium">Today's Orders</h3>
              <p className="text-3xl font-bold">{orderStats.today?.orders || 0}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm">Live tracking</span>
              </div>
            </div>
          </div>

          {/* Today's Revenue Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <Star className="h-5 w-5 text-orange-200" />
              </div>
              <h3 className="text-white text-opacity-80 text-sm font-medium">Today's Revenue</h3>
              <p className="text-3xl font-bold">{formatCurrency(orderStats.today?.revenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Real-time data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.thisWeek?.orders || 0}</p>
                <p className="text-sm text-gray-600">orders completed</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+15.3% vs last week</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.thisMonth?.orders || 0}</p>
                <p className="text-sm text-gray-600">monthly orders</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+23.1% vs last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.total?.orders > 0 
                    ? formatCurrency(orderStats.total.revenue / orderStats.total.orders)
                    : formatCurrency(0)
                  }
                </p>
                <p className="text-sm text-gray-600">per order</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+5.7% improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Last 7 Days Performance - Takes 2 columns */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sales Performance</h3>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {orderStats.last7Days?.map((day, index) => {
                const maxRevenue = Math.max(...(orderStats.last7Days?.map(d => d.revenue) || [0]));
                const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(2024, day._id.month - 1, day._id.day).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {day.count} orders
                        </span>
                        <span className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                          {formatCurrency(day.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }) || (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No performance data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders - Takes 1 column */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {orderStats.recentOrders?.map((order) => (
                <div key={order._id} className="group hover:bg-gray-50 rounded-xl p-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.userId?.userName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <p className="text-xs text-green-600 font-medium">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
