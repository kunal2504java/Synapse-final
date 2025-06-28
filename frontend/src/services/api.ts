// --- API Service for Synapse Backend ---

const BASE_URL = 'http://localhost:8000/api/v1';

// --- TypeScript Interfaces (aligned with Pydantic Schemas) ---

export interface Warehouse {
  id: string; // UUID
  name: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryVehicle {
  id: string; // UUID
  vehicle_id: string;
  current_latitude: number;
  current_longitude: number;
  status: string;
}

export interface ShipmentEvent {
  timestamp: string; // datetime
  status: string;
  location: string;
  description: string;
}

export interface Order {
  id: string; // UUID
  customer_name: string;
  order_date: string; // datetime
  expected_delivery_date: string; // datetime
  status: string;
  total_price: number;
  destination_latitude: number;
  destination_longitude: number;
  origin_warehouse: Warehouse;
  assigned_vehicle?: DeliveryVehicle;
  shipment_history: ShipmentEvent[];
}

export interface Anomaly {
  id: string; // UUID
  anomaly_type: string;
  description: string;
  severity: string;
  timestamp: string; // datetime
  related_order?: Order;
  related_vehicle?: DeliveryVehicle;
}

export interface KPI {
  total_orders: number;
  on_time_deliveries_percent: number;
  active_anomalies: number;
  overall_carbon_footprint_kg: number;
}

export interface OrderJourney {
  order: Order;
  vehicle?: DeliveryVehicle;
}

export interface OrderCreationPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  origin_warehouse_id: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_address: string;
  delivery_address: string;
  package_weight: number;
  package_dimensions: string;
  delivery_type: string;
  package_description: string;
  scheduled_pickup?: string;
  special_instructions?: string;
}

export interface SimulationResponse {
    playbook_markdown: string;
}

// --- Helper for API calls ---

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || 'Network response was not ok');
  }

  return response.json();
}

// --- API Functions ---

export const fetchKPIs = (): Promise<KPI> => {
  return apiFetch<KPI>('/kpis');
};

export const fetchAnomalies = () => apiFetch<Anomaly[]>('/anomalies');

export const fetchWarehouses = () => apiFetch<Warehouse[]>('/warehouses');

export const createOrder = (payload: OrderCreationPayload) => apiFetch<Order>('/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

export const fetchOrders = (status?: string): Promise<Order[]> => {
  const endpoint = status ? `/orders?status=${status}` : '/orders';
  return apiFetch<Order[]>(endpoint);
};

export const fetchOrderJourney = (orderId: string): Promise<OrderJourney> => {
  return apiFetch<OrderJourney>(`/orders/${orderId}/journey`);
};

export const submitSimulation = async (prompt: string): Promise<SimulationResponse> => {
    return apiFetch<SimulationResponse>('/simulations/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });
};
