import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MapPin, Thermometer, Package, Clock, Truck, AlertCircle } from 'lucide-react';
import { fetchOrderJourney, type OrderJourney } from '../services/api';

// Mock Map Component (since we can't use real Mapbox without API key)
const MapComponent: React.FC<{ journey: OrderJourney }> = ({ journey }) => {
  return (
    <div className="relative h-full bg-gradient-to-br from-dark-800 to-dark-700 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-primary-400/10 to-secondary-500/10"></div>
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Route visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-4/5 h-4/5">
          {/* Origin point */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="text-xs text-blue-400 mt-1 whitespace-nowrap">Warehouse</div>
          </div>

          {/* Route line */}
          <div className="absolute left-4 top-1/2 w-3/4 h-0.5 bg-gradient-to-r from-blue-500 via-primary-400 to-green-500 transform -translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-primary-400 to-green-500 animate-pulse"></div>
          </div>

          {/* Vehicle position */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                x: [0, 10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center"
            >
              <Truck className="w-3 h-3 text-dark-900" />
            </motion.div>
            <div className="text-xs text-primary-400 mt-1 whitespace-nowrap">Vehicle</div>
          </div>

          {/* Destination point */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-xs text-green-400 mt-1 whitespace-nowrap">Destination</div>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-8 h-8 bg-dark-800/80 text-white rounded border border-gray-600/20 flex items-center justify-center text-sm hover:bg-dark-700">
          +
        </button>
        <button className="w-8 h-8 bg-dark-800/80 text-white rounded border border-gray-600/20 flex items-center justify-center text-sm hover:bg-dark-700">
          -
        </button>
      </div>
    </div>
  );
};

const ShipmentDashboard: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [journey, setJourney] = useState<OrderJourney | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJourney = async () => {
      if (!orderId) return;
      
      try {
        const data = await fetchOrderJourney(orderId);
        setJourney(data);
      } catch (error) {
        console.error('Failed to load journey:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();

    // Refresh every 10 seconds to simulate real-time updates
    const interval = setInterval(loadJourney, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400">The requested order could not be located.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Transit': return 'bg-primary-400/10 text-primary-400 border-primary-400/20';
      case 'At Risk': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Live Shipment Tracking</h1>
        <div className="flex items-center space-x-4">
          <span className="text-primary-400 font-medium">Order #{journey.order.id}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(journey.order.status)}`}>
            {journey.order.status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20 h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Live Route Map</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Tracking</span>
              </div>
            </div>
            <div className="h-[calc(100%-60px)]">
              <MapComponent journey={journey} />
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Shipment Vitals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Shipment Vitals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">Temperature</span>
                </div>
                <span className="text-lg font-bold text-white">22°C</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Package Integrity</span>
                </div>
                <span className="text-lg font-bold text-green-400">100%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">ETA</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {new Date(journey.order.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Event Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20 flex-1"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {journey.events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-6 pb-4 border-l-2 border-primary-400/30 last:border-l-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-400 rounded-full"></div>
                  <div className="bg-dark-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-primary-400">{event.eventType}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Customer</h4>
            <p className="text-white">{journey.order.customerName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Destination</h4>
            <p className="text-white">{journey.order.destination}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Vehicle</h4>
            <p className="text-white">{journey.vehicle.vehicleType} ({journey.vehicle.id})</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShipmentDashboard;