import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('sales');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Requirement: View details for each order/user
  const [selectedItem, setSelectedItem] = useState(null);

  // Requirement: Filter by customer, product, or date
  const [filters, setFilters] = useState({ query: '', date: '' });

  const MOCK_DATA = {
    sales: [
      { id: 5001, userId: 1, userEmail: "jane.doe@example.com", productName: "Lunar Gray Headphones", status: "COMPLETED", totalPrice: 344.00, date: "2023-10-01", quantity: 1, shippingAddress: "123 Maple St, NY" },
      { id: 5002, userId: 4, userEmail: "alex.smith@example.com", productName: "Slate Desk Organizer", status: "PENDING", totalPrice: 120.50, date: "2023-10-02", quantity: 2, shippingAddress: "456 Oak Ave, CA" },
    ],
    inventory: [
      { id: 101, name: "Lunar Gray Headphones", quantity: 45, price: 199 },
      { id: 102, name: "Slate Desk Organizer", quantity: 12, price: 45 },
    ],
    users: [
      { id: 1, email: "jane.doe@example.com", roleName: "CUSTOMER", firstName: "Jane", lastName: "Doe", creditCard: "**** **** **** 1234", shippingAddress: "123 Maple St, NY" },
      { id: 2, email: "alex.smith@example.com", roleName: "CUSTOMER", firstName: "Alex", lastName: "Smith", creditCard: "**** **** **** 5678", shippingAddress: "456 Oak Ave, CA" },
    ]
  };

  useEffect(() => {
    setLoading(true);
    setData(MOCK_DATA[activeTab]);
    setLoading(false);
  }, [activeTab]);

  // Requirement: Filter Sales Logic
  const filteredSales = useMemo(() => {
    if (activeTab !== 'sales') return data;
    return data.filter(order => 
      (order.userEmail.toLowerCase().includes(filters.query.toLowerCase()) || 
       order.productName.toLowerCase().includes(filters.query.toLowerCase())) &&
      (filters.date === '' || order.date === filters.date)
    );
  }, [data, filters, activeTab]);

  const handleUpdateStock = async (id, newQty) => {
    // Logic to add or reduce inventory via API
    await api(`/api/products/${id}/quantity?quantity=${newQty}`, { method: 'PATCH' });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Maintain Sales, Inventory & Accounts</p>
          </div>
        </header>

        <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl mb-8 w-fit">
          {['sales', 'inventory', 'users'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Requirement: Filters for Sales */}
        {activeTab === 'sales' && (
          <div className="flex gap-4 mb-6">
            <input type="text" placeholder="Filter by customer or product..." className="p-2 rounded-lg border w-64" 
              onChange={(e) => setFilters({...filters, query: e.target.value})} />
            <input type="date" className="p-2 rounded-lg border" 
              onChange={(e) => setFilters({...filters, date: e.target.value})} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'sales' && <SalesTable orders={filteredSales} onViewDetails={setSelectedItem} />}
          {activeTab === 'inventory' && <InventoryTable products={data} onUpdate={handleUpdateStock} />}
          {activeTab === 'users' && <UsersTable users={data} onManage={setSelectedItem} />}
        </div>
      </div>

      {/* Requirement: Detail Modals for Orders and Users */}
      {selectedItem && (
        <Modal onClose={() => setSelectedItem(null)}>
          {activeTab === 'sales' ? <OrderDetail order={selectedItem} /> : <UserEdit user={selectedItem} />}
        </Modal>
      )}
    </div>
  );
}

// --- Detailed Views & Sub-components ---

function SalesTable({ orders, onViewDetails }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b">
        <tr>
          <th className="p-4">Date</th>
          <th className="p-4">Order ID</th>
          <th className="p-4">Customer</th>
          <th className="p-4">Product</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} className="border-b">
            <td className="p-4 text-sm">{order.date}</td>
            <td className="p-4 font-mono">#{order.id}</td>
            <td className="p-4">{order.userEmail}</td>
            <td className="p-4">{order.productName}</td>
            <td className="p-4 text-right">
              <button onClick={() => onViewDetails(order)} className="text-indigo-600 font-medium">View Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Requirement: Order Details View (User, Product, Price, Quantity)
function OrderDetail({ order }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order Details #{order.id}</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-slate-500">Customer:</div><div>{order.userEmail}</div>
        <div className="text-slate-500">Product:</div><div>{order.productName}</div>
        <div className="text-slate-500">Quantity:</div><div>{order.quantity}</div>
        <div className="text-slate-500">Total Price:</div><div className="font-bold">${order.totalPrice}</div>
        <div className="text-slate-500">Shipping To:</div><div>{order.shippingAddress}</div>
      </div>
    </div>
  );
}

// Requirement: Maintain Customer Account (Update Credit Card, Shipping)
function UserEdit({ user }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Maintain Account: {user.email}</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Shipping Address</label>
          <input type="text" defaultValue={user.shippingAddress} className="w-full p-2 border rounded mt-1" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Credit Card Info</label>
          <input type="text" defaultValue={user.creditCard} className="w-full p-2 border rounded mt-1" />
        </div>
        <button type="button" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Update Information</button>
      </form>
    </div>
  );
}

// Simple Modal Wrapper
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
        {children}
      </div>
    </div>
  );
}

function InventoryTable({ products, onUpdate }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b">
        <tr>
          <th className="p-4">Product Name</th>
          <th className="p-4">Quantity (In Stock)</th>
          <th className="p-4">Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id} className="border-b">
            <td className="p-4 font-medium">{p.name}</td>
            <td className="p-4">
              <div className="flex items-center gap-2">
                <input type="number" defaultValue={p.quantity} 
                  className="w-20 p-1 border rounded"
                  onBlur={(e) => onUpdate(p.id, e.target.value)} />
                <span className="text-xs text-slate-400">pcs</span>
              </div>
            </td>
            <td className="p-4">${p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsersTable({ users, onManage }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b">
        <tr>
          <th className="p-4">Email</th>
          <th className="p-4">Role</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} className="border-b">
            <td className="p-4">{u.email}</td>
            <td className="p-4 text-sm text-slate-500">{u.roleName}</td>
            <td className="p-4 text-right">
              <button onClick={() => onManage(u)} className="text-indigo-600 font-medium">Edit Info</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}