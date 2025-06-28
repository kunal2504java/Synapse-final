import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Save,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { createOrder, fetchWarehouses, Warehouse, OrderCreationPayload } from '../services/api';

const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState<OrderCreationPayload>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_address: '',
    delivery_address: '',
    package_weight: 0,
    package_dimensions: '',
    delivery_type: '',
    package_description: '',
    scheduled_pickup: '',
    special_instructions: '',
    total_price: 0,
    origin_warehouse_id: '',
    destination_latitude: 0,
    destination_longitude: 0,
  });

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, origin_warehouse_id: data[0].id }));
        }
      } catch (error) {
        console.error('Failed to load warehouses:', error);
      }
    };
    loadWarehouses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['total_price', 'destination_latitude', 'destination_longitude', 'package_weight'].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin_warehouse_id) {
      alert('Please select an origin warehouse.');
      return;
    }
    setIsSubmitting(true);

    try {
      await createOrder(formData);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Failed to create shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Shipment Created Successfully!</h2>
          <p className="text-gray-400 mb-4">Your shipment has been added to the system and is being processed.</p>
          <p className="text-sm text-gray-500">Redirecting to orders page...</p>
        </div>
      </motion.div>
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 rounded-lg bg-dark-800/50 text-gray-400 hover:text-primary-400 border border-gray-600/20 hover:border-primary-400/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Shipment</h1>
            <p className="text-gray-400">Add a new shipment to the system</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer & Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/50 p-6 rounded-xl border border-primary-400/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Price ($)</label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Origin & Destination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-800/50 p-6 rounded-xl border border-primary-400/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origin Warehouse</label>
                <select
                  name="origin_warehouse_id"
                  value={formData.origin_warehouse_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="destination_latitude"
                  value={formData.destination_latitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="destination_longitude"
                  value={formData.destination_longitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Customer Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="customer@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </motion.div>

        {/* Shipping Addresses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Shipping Addresses</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pickup Address *
              </label>
              <textarea
                name="pickup_address"
                value={formData.pickup_address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="Enter pickup address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Address *
              </label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </motion.div>

        {/* Package Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Package className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Package Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="package_weight"
                value={formData.package_weight}
                onChange={handleInputChange}
                required
                step="0.1"
                min="0"
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dimensions (L×W×H cm) *
              </label>
              <input
                type="text"
                name="package_dimensions"
                value={formData.package_dimensions}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="30×20×15"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Type *
              </label>
              <select
                name="delivery_type"
                value={formData.delivery_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
              >
                <option value="standard">Standard (3-5 days)</option>
                <option value="express">Express (1-2 days)</option>
                <option value="overnight">Overnight</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Package Description *
            </label>
            <textarea
              name="package_description"
              value={formData.package_description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
              placeholder="Describe the package contents"
            />
          </div>
        </motion.div>

        {/* Scheduling & Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Scheduling & Instructions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scheduled Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduled_pickup"
                value={formData.scheduled_pickup}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20"
                placeholder="Any special handling instructions..."
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-dark-700 text-gray-300 rounded-lg font-medium hover:bg-dark-600 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-8 py-3 bg-primary-400 text-dark-900 rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-900/20 border-t-dark-900 rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Shipment</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CreateShipment;