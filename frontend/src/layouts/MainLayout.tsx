import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Command, 
  Package, 
  Plus, 
  Brain, 
  Target, 
  Zap,
  Menu,
  X
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Command Center', href: '/', icon: Command },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Create Shipment', href: '/create-shipment', icon: Plus },

  { name: 'Simulation', href: '/simulation', icon: Brain },
  { name: 'Predictive', href: '/predictive', icon: Target },
  { name: 'Fulfillment', href: '/fulfillment', icon: Zap },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-dark-800 text-primary-400 border border-primary-400/20"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280,
        }}
        className="fixed lg:relative w-70 h-full bg-dark-800/50 backdrop-blur-xl border-r border-primary-400/20 z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-400/20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-dark-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Synapse</h1>
                <p className="text-xs text-gray-400">Retail Nervous System</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-400/20 text-primary-400 border border-primary-400/30' 
                        : 'text-gray-300 hover:bg-dark-700 hover:text-primary-400'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110
                      ${isActive ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'}
                    `} />
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-primary-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          {/* Status indicator */}
          <div className="p-4 border-t border-primary-400/20">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;