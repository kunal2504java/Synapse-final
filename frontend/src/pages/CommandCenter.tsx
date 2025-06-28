import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  Leaf,
  Package
} from 'lucide-react';
import { LineChart, Line as RechartsLine, XAxis, YAxis } from 'recharts';
import { fetchKPIs, fetchAnomalies, type KPI, type Anomaly } from '../services/api';

// Type definitions for 3D visualization
interface NodeData {
  position: [number, number, number];
  color: string;
  label: string;
}

interface ConnectionData {
  start: [number, number, number];
  end: [number, number, number];
}

// 3D Network Visualization Component
const NetworkVisualization: React.FC = () => {
  const nodes: NodeData[] = [
    { position: [0, 0, 0], color: '#00F5D4', label: 'Mumbai Hub' },
    { position: [3, 1, -2], color: '#9D4EDD', label: 'Delhi Center' },
    { position: [-2, -1, 2], color: '#F72585', label: 'Bangalore Tech' },
    { position: [1, -2, 1], color: '#00F5D4', label: 'Chennai Port' },
    { position: [-1, 2, -1], color: '#FFB000', label: 'Kolkata East' },
  ];

  const connections: ConnectionData[] = [
    { start: [0, 0, 0], end: [3, 1, -2] }, // Mumbai to Delhi
    { start: [0, 0, 0], end: [-2, -1, 2] }, // Mumbai to Bangalore
    { start: [0, 0, 0], end: [1, -2, 1] }, // Mumbai to Chennai
    { start: [3, 1, -2], end: [-1, 2, -1] }, // Delhi to Kolkata
    { start: [-2, -1, 2], end: [1, -2, 1] }, // Bangalore to Chennai
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {nodes.map((node, index) => (
        <Sphere key={index} position={node.position} args={[0.2, 32, 32]}>
          <meshStandardMaterial 
            color={node.color} 
            emissive={node.color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
      
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#00F5D4"
          lineWidth={2}
          transparent
          opacity={0.8}
        />
      ))}
      
      {/* Animated particles along connections */}
      {connections.map((connection, index) => (
        <mesh key={`particle-${index}`} position={connection.start}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#00F5D4" />
        </mesh>
      ))}
    </>
  );
};

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  format?: 'number' | 'percentage' | 'currency';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, format = 'number' }) => {
  const formatValue = (val: string | number) => {
    if (format === 'percentage') return `${val}%`;
    if (format === 'currency') return `₹${val}`;
    return val;
  };

  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20 hover:border-primary-400/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-primary-400" />
        <div className={`flex items-center space-x-1 text-sm ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{formatValue(value)}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

// Anomaly Feed Component
interface AnomalyFeedProps {
  anomalies: Anomaly[];
}

const AnomalyFeed: React.FC<AnomalyFeedProps> = ({ anomalies }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20 h-full"
    >
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Active Anomalies</h3>
      </div>
      
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {anomalies.map((anomaly, index) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-dark-700/50 border border-gray-600/20"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                {anomaly.severity}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(anomaly.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-white mb-2">{anomaly.description}</p>
            
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CommandCenter: React.FC = () => {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiData, anomalyData] = await Promise.all([
          fetchKPIs(),
          fetchAnomalies()
        ]);
        setKpis(kpiData);
        setAnomalies(anomalyData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

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
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-gray-400">Real-time supply chain monitoring and control</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Data Stream</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis && (
          <>
            <KPICard
              title="Total Orders"
              value={kpis.total_orders.toLocaleString()}
              change={2.1}
              icon={Package}
            />
            <KPICard
              title="On-Time Delivery"
              value={kpis.on_time_deliveries_percent.toFixed(1)}
              change={1.5}
              icon={Clock}
              format="percentage"
            />
            <KPICard
              title="Active Anomalies"
              value={kpis.active_anomalies}
              change={-0.8}
              icon={AlertTriangle}
            />
            <KPICard
              title="Carbon Footprint (kg)"
              value={kpis.overall_carbon_footprint_kg.toLocaleString()}
              change={-2.3}
              icon={Leaf}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
        {/* Anomaly Feed */}
        <div className="lg:col-span-1">
          <AnomalyFeed anomalies={anomalies} />
        </div>

        {/* 3D Digital Twin */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-400/20 h-full"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-secondary-500 rounded"></div>
              <h3 className="text-lg font-semibold text-white">Digital Twin Network - India</h3>
            </div>
            
            <div className="h-[calc(100%-60px)] bg-dark-900/50 rounded-lg overflow-hidden">
              <Canvas 
                camera={{ position: [5, 5, 5], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
                gl={{ antialias: true, alpha: true }}
              >
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  maxDistance={15}
                  minDistance={3}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                />
                <NetworkVisualization />
              </Canvas>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommandCenter;