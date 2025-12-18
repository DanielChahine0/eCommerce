import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

// MOCK DATA DEFINITIONS
const MOCK_USER = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  password: "password123",
  roleId: 1,
  phoneNumber: "123-456-7890",
  creditCard: "1234-5678-9012-3456",
  address: {
    zip: "12345",
    country: "USA",
    street: "123 Main St",
    province: "NY"
  }
};

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

export default function Profile() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [profileForm, setProfileForm] = useState(MOCK_USER);

  // useEffect(() => {
  //   // Check if we have a real user, otherwise stay with Mock data
  //   if (user?.id) {
  //     setLoadingOrders(true);
      
  //   //   Promise.all([
  //   //     api(`/api/users/${user.id}`),
  //   //     api(`/api/orders/user/${user.id}`)
  //   //   ]).then(([userData, userOrders]) => {
  //   //     setProfileForm(userData);
  //   //     setOrders(userOrders);
  //   //   }).finally(() => setLoadingOrders(false));
  //     // Use Mock data for previewing UI
  //     setOrders(MOCK_ORDERS);
  //     setLoadingOrders(false);
  //   }
  // }, [user]);

  useEffect(() => {
      setOrders(MOCK_ORDERS);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log("Sending updated data:", profileForm);
    alert('Mock Update: Profile data logged to console.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 px-4">Account</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                My Orders
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          {activeTab === 'profile' ? (
            <ProfileForm 
              formData={profileForm} 
              setFormData={setProfileForm} 
              onSubmit={handleUpdateProfile} 
            />
          ) : (
            <OrderHistory orders={orders} loading={loadingOrders} />
          )}
        </main>
      </div>
    </div>
  );
}

function ProfileForm({ formData, setFormData, onSubmit }) {
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h3>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone Number</label>
            <input 
              type="text" 
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Credit Card</label>
            <input 
              type="text" 
              value={formData.creditCard}
              onChange={(e) => setFormData({...formData, creditCard: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-50">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Street Address</label>
            <input 
              name="street"
              type="text" 
              value={formData.address.street}
              onChange={handleAddressChange}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Province</label>
            <input 
              name="province"
              type="text" 
              value={formData.address.province}
              onChange={handleAddressChange}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Zip Code</label>
            <input 
              name="zip"
              type="text" 
              value={formData.address.zip}
              onChange={handleAddressChange}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
          Update Profile
        </button>
      </form>
    </div>
  );
}

function OrderHistory({ orders, loading }) {
  if (loading) return <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
  </div>;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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