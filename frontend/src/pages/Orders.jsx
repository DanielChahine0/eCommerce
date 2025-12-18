import { useEffect, useState } from "react";

const MOCK_ORDERS = [
  {
    id: 9001,
    status: 'PENDING',
    total: 245.99,
    timeCreated: new Date().toISOString(),
    address: { street: "123 Main St", province: "NY" }
  },
  {
    id: 8542,
    status: 'SHIPPED',
    total: 54.00,
    timeCreated: "2023-11-15T10:30:00Z",
    address: { street: "123 Main St", province: "NY" }
  }
];




export default function Orders() {

    const [orders, setOrders] = useState([]);
    useEffect(() => {
        setOrders(MOCK_ORDERS);
    }, []);

    
     return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Order History</h3>
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:border-indigo-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order #{order.id}</p>
              <p className="text-sm text-slate-500 font-medium">{new Date(order.timeCreated).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
              order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Destination</p>
              <p className="text-sm font-semibold text-slate-700">{order.address?.street}, {order.address?.province}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Paid</p>
              <p className="text-xl font-black text-slate-900">${order.total?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

