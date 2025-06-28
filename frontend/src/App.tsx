import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import CommandCenter from './pages/CommandCenter';
import OrderList from './pages/OrderList';
import CreateShipment from './pages/CreateShipment';

import ShipmentDashboard from './pages/ShipmentDashboard';
import SimulationSandbox from './pages/SimulationSandbox';
import PredictiveNucleus from './pages/PredictiveNucleus';
import FulfillmentSynapse from './pages/FulfillmentSynapse';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white font-sans">
        <MainLayout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/create-shipment" element={<CreateShipment />} />
              
              <Route path="/orders/:orderId" element={<ShipmentDashboard />} />
              <Route path="/simulation" element={<SimulationSandbox />} />
              <Route path="/predictive" element={<PredictiveNucleus />} />
              <Route path="/fulfillment" element={<FulfillmentSynapse />} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;