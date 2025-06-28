import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchOrders, type Order } from '../services/api';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      await loadOrders();
      setLoading(false);
    };

    initialLoad();

    const intervalId = setInterval(loadOrders, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'In Transit': return <Package className="w-4 h-4" />;
      case 'At Risk': return <AlertTriangle className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Transit': return 'bg-primary-400/10 text-primary-400 border-primary-400/20';
      case 'At Risk': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(lowercasedTerm) ||
      order.id?.toLowerCase().includes(lowercasedTerm) ||
      `${order.destination_latitude}, ${order.destination_longitude}`.includes(lowercasedTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return !!(matchesSearch && matchesStatus);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400">Track and manage all orders in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-400 text-dark-900 rounded-lg font-medium hover:bg-primary-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-dark-800/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50"
          >
            <option value="all">All Status</option>
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="At Risk">At Risk</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/50 backdrop-blur-xl rounded-xl border border-primary-400/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50 border-b border-gray-600/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/20">
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="hover:bg-dark-700/30 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-400">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {`${order.destination_latitude.toFixed(4)}, ${order.destination_longitude.toFixed(4)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(order.expected_delivery_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Processing', 'In Transit', 'At Risk', 'Delivered'].map((status) => {
          const count = orders.filter(order => order.status === status).length;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800/30 p-4 rounded-lg border border-gray-600/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{status}</span>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default OrderList;