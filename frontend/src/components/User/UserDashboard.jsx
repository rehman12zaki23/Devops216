// Enhanced UserDashboard.jsx with order status tracking

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../redux/Slices/OrderSlice';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { userOrders, loading, error } = useSelector((state) => state.orderProduct);

  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock, description: 'Your order is being processed' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle, description: 'Your order has been confirmed' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck, description: 'Your order is on the way' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle, description: 'Your order has been delivered' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle, description: 'Your order has been cancelled' },
  ];

  useEffect(() => {
    if (userId) {
      dispatch(getUserOrders(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredOrders = userOrders.filter(order => {
    return statusFilter === '' || order.status === statusFilter;
  });

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const getOrdersByStatus = (status) => {
    return userOrders.filter(order => order.status === status).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen m bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track your orders and purchase history</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    userOrders.reduce((total, order) => total + (order.totalAmount || 0), 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Items Purchased</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userOrders.reduce((total, order) => 
                    total + (order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0), 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average Order */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userOrders.length > 0 
                    ? formatCurrency(
                        userOrders.reduce((total, order) => total + (order.totalAmount || 0), 0) / userOrders.length
                      )
                    : formatCurrency(0)
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {orderStatuses.map((status) => (
            <div key={status.value} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${status.color.replace('text-', 'text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                  <status.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{status.label}</p>
                  <p className="text-xl font-bold text-gray-900">{getOrdersByStatus(status.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
            >
              <option value="">All Orders</option>
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {userOrders.length} orders
            </span>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {statusFilter 
                  ? `No orders with status "${orderStatuses.find(s => s.value === statusFilter)?.label}".` 
                  : 'You haven\'t placed any orders yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusInfo.label}
                        </div>
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">{order.items?.length || 0} item(s)</span>
                        <span className="mx-2">•</span>
                        <span>{order.items?.reduce((total, item) => total + item.quantity, 0)} units</span>
                      </div>
                      <div className="font-bold text-gray-900 text-lg">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600 mb-2">{statusInfo.description}</p>
                      <div className="flex space-x-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                            {item.image && (
                              <img src={item.image} alt={item.title} className="w-6 h-6 object-cover rounded" />
                            )}
                            <span className="text-xs text-gray-600">{item.title}</span>
                            <span className="text-xs text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="flex items-center px-3 py-1 text-xs text-gray-500">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    {React.createElement(getStatusInfo(selectedOrder.status).icon, { className: "h-5 w-5" })}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusInfo(selectedOrder.status).color}`}>
                      {getStatusInfo(selectedOrder.status).label}
                    </span>
                  </div>
                  <p className="text-gray-600">{getStatusInfo(selectedOrder.status).description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                      <p><span className="font-medium">Total Amount:</span> {formatCurrency(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Items Ordered</h4>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.title}</h5>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
