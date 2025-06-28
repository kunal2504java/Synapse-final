import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Truck, Package, MapPin, Clock, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const fulfillmentData = [
  { name: 'Same Day', value: 35, color: '#00F5D4' },
  { name: 'Next Day', value: 45, color: '#9D4EDD' },
  { name: '2-3 Days', value: 15, color: '#F72585' },
  { name: '4+ Days', value: 5, color: '#FFB000' },
];

const performanceData = [
  { time: '00:00', efficiency: 85, throughput: 120 },
  { time: '04:00', efficiency: 78, throughput: 95 },
  { time: '08:00', efficiency: 92, throughput: 180 },
  { time: '12:00', efficiency: 88, throughput: 165 },
  { time: '16:00', efficiency: 95, throughput: 200 },
  { time: '20:00', efficiency: 82, throughput: 140 },
];

const FulfillmentSynapse: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fulfillment Synapse</h1>
        <p className="text-gray-400">Autonomous fulfillment optimization and orchestration</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-8 h-8 text-primary-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Processing Speed</h3>
              <p className="text-2xl font-bold text-primary-400">2.3s</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Average order processing time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-secondary-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Truck className="w-8 h-8 text-secondary-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Fleet Utilization</h3>
              <p className="text-2xl font-bold text-secondary-400">87%</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Current capacity usage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-accent-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-8 h-8 text-accent-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Orders/Hour</h3>
              <p className="text-2xl font-bold text-accent-400">1,247</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Peak throughput achieved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-green-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Efficiency</h3>
              <p className="text-2xl font-bold text-green-400">94.2%</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Overall system efficiency</p>
        </motion.div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fulfillment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Delivery Time Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fulfillmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {fulfillmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">24h Performance Metrics</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stackId="1"
                  stroke="#00F5D4"
                  fill="#00F5D4"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stackId="2"
                  stroke="#9D4EDD"
                  fill="#9D4EDD"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Active Operations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
      >
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="w-6 h-6 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Active Fulfillment Centers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Newark DC', status: 'Optimal', load: 78, efficiency: 94 },
            { name: 'Brooklyn Hub', status: 'High Load', load: 92, efficiency: 87 },
            { name: 'Queens Depot', status: 'Optimal', load: 65, efficiency: 96 },
          ].map((center, index) => (
            <motion.div
              key={center.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-dark-700/50 rounded-lg border border-gray-600/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{center.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  center.status === 'Optimal' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {center.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Load</span>
                  <span className="text-white">{center.load}%</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      center.load > 90 ? 'bg-red-500' :
                      center.load > 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${center.load}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-primary-400">{center.efficiency}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Optimization Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Zap className="w-6 h-6 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">AI Optimization Suggestions</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              title: 'Route Optimization Detected',
              description: 'Consolidate 3 delivery routes in Manhattan area to save 45 minutes and $120 in fuel costs.',
              impact: 'High',
              timeframe: '2 hours',
            },
            {
              title: 'Inventory Redistribution',
              description: 'Move 200 units from Newark to Brooklyn to balance load and reduce processing time by 15%.',
              impact: 'Medium',
              timeframe: '4 hours',
            },
            {
              title: 'Peak Hour Staffing',
              description: 'Schedule 2 additional workers for 2-4 PM shift based on historical demand patterns.',
              impact: 'Medium',
              timeframe: '24 hours',
            },
          ].map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-dark-700/50 rounded-lg border border-gray-600/20 hover:border-primary-400/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium">{suggestion.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    suggestion.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {suggestion.impact} Impact
                  </span>
                  <span className="text-xs text-gray-400">{suggestion.timeframe}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300">{suggestion.description}</p>
              <div className="flex justify-end mt-3">
                <button className="px-3 py-1 bg-primary-400 text-dark-900 rounded text-xs font-medium hover:bg-primary-500 transition-colors">
                  Implement
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FulfillmentSynapse;