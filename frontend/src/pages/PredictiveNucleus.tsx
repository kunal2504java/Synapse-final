import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Target, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const demandData = [
  { month: 'Jan', demand: 4000, forecast: 4200 },
  { month: 'Feb', demand: 3000, forecast: 2800 },
  { month: 'Mar', demand: 2000, forecast: 2100 },
  { month: 'Apr', demand: 2780, forecast: 2900 },
  { month: 'May', demand: 1890, forecast: 1800 },
  { month: 'Jun', demand: 2390, forecast: 2400 },
];

const riskData = [
  { category: 'Supply Chain', risk: 75, impact: 'High' },
  { category: 'Weather', risk: 45, impact: 'Medium' },
  { category: 'Demand Surge', risk: 60, impact: 'High' },
  { category: 'Logistics', risk: 30, impact: 'Low' },
];

const PredictiveNucleus: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Predictive Nucleus</h1>
        <p className="text-gray-400">AI-powered demand forecasting and risk assessment</p>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-primary-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">ML Model Status</h3>
              <p className="text-sm text-gray-400">95.2% Accuracy</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Training Data</span>
              <span className="text-green-400">2.4M records</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white">2 hours ago</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-secondary-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-secondary-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Forecast Confidence</h3>
              <p className="text-sm text-gray-400">Next 30 Days</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">87%</div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div className="bg-secondary-400 h-2 rounded-full" style={{ width: '87%' }}></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-accent-400/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-accent-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Risk Alerts</h3>
              <p className="text-sm text-gray-400">Active Monitoring</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-accent-400 mb-2">3</div>
          <p className="text-sm text-gray-400">Medium to High Risk Events</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demand Forecast */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Demand Forecast vs Actual</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#00F5D4"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#00F5D4' }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#9D4EDD"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#9D4EDD' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Risk Assessment Matrix</h3>
          </div>
          <div className="space-y-4">
            {riskData.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{item.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                    item.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.risk > 60 ? 'bg-red-500' :
                      item.risk > 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${item.risk}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">{item.risk}% risk probability</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-green-400">Inventory Optimization</span>
            </div>
            <p className="text-sm text-gray-300">Increase safety stock by 15% for Category A items based on demand volatility patterns.</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg border border-yellow-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-400">Route Planning</span>
            </div>
            <p className="text-sm text-gray-300">Weather patterns suggest 20% longer delivery times for Northeast routes next week.</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-blue-400">Capacity Planning</span>
            </div>
            <p className="text-sm text-gray-300">Peak demand expected in Q2. Consider scaling warehouse capacity by 25%.</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium text-purple-400">Supplier Diversification</span>
            </div>
            <p className="text-sm text-gray-300">High dependency on single supplier detected. Recommend adding 2 backup suppliers.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PredictiveNucleus;