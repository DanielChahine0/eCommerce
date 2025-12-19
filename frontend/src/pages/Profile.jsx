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
  
  const [profileForm, setProfileForm] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    roleId: 1,
    phoneNumber: '',
    address: {
      zip: '',
      country: '',
      street: '',
      province: ''
    }
  });

  const [billingInfo, setBillingInfo] = useState(() => {
    // Initialize billing info from local storage
    const savedBillingInfo = localStorage.getItem('billingInfo');
    return savedBillingInfo ? JSON.parse(savedBillingInfo) : [];
  });
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [editingBillingIndex, setEditingBillingIndex] = useState(null);
  const [billingForm, setBillingForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      province: '',
      zip: '',
      country: ''
    }
  });

  // Save billing info to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('billingInfo', JSON.stringify(billingInfo));
  }, [billingInfo]);

  useEffect(() => {
    // Fetch real user data and orders
    if (user?.id) {
      setLoadingOrders(true);
      
      Promise.all([
        api(`/api/users/${user.id}`),
        api(`/api/orders/user/${user.id}`)
      ]).then(([userData, userOrders]) => {
        // Ensure all fields have default values to prevent controlled/uncontrolled input warnings
        // Extract roleId from the role object since UserDTO returns role, not roleId
        const roleId = userData.role?.id || 1;
        
        setProfileForm({
          id: userData.id || '',
          username: userData.username || '',
          email: userData.email || '',
          password: '', // Don't populate password field for security
          roleId: roleId,
          phoneNumber: userData.phoneNumber || '',
          address: {
            zip: userData.address?.zip || '',
            country: userData.address?.country || '',
            street: userData.address?.street || '',
            province: userData.address?.province || ''
          }
        });
        setOrders(userOrders);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
        // Fallback to mock data on error
        setOrders(MOCK_ORDERS);
      }).finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the form data
      const updateData = { ...profileForm };
      
      // Only include password if it was actually changed (not empty and different from placeholder)
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      
      // Ensure roleId is set (it should be from the form state)
      if (!updateData.roleId) {
        updateData.roleId = 1; // Default to customer role
      }
      
      console.log('Sending update data:', updateData);
      
      const updatedUser = await api(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      // Update form with returned data, but keep password field empty for display
      // Extract roleId from the returned role object
      setProfileForm({
        id: updatedUser.id || '',
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        password: '', // Clear password field after successful update
        roleId: updatedUser.role?.id || 1,
        phoneNumber: updatedUser.phoneNumber || '',
        address: {
          zip: updatedUser.address?.zip || '',
          country: updatedUser.address?.country || '',
          street: updatedUser.address?.street || '',
          province: updatedUser.address?.province || ''
        }
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    }
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
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'billing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Billing Information
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          {activeTab === 'profile' && (
            <ProfileForm 
              formData={profileForm} 
              setFormData={setProfileForm} 
              onSubmit={handleUpdateProfile} 
            />
          )}
          {activeTab === 'orders' && (
            <OrderHistory orders={orders} loading={loadingOrders} />
          )}
          {activeTab === 'billing' && (
            <BillingInformation 
              billingInfo={billingInfo}
              setBillingInfo={setBillingInfo}
              showBillingForm={showBillingForm}
              setShowBillingForm={setShowBillingForm}
              editingBillingIndex={editingBillingIndex}
              setEditingBillingIndex={setEditingBillingIndex}
              billingForm={billingForm}
              setBillingForm={setBillingForm}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ProfileForm({ formData, setFormData, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter new password to change"
                className="w-full p-3 pr-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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




function BillingInformation({ 
  billingInfo, 
  setBillingInfo, 
  showBillingForm, 
  setShowBillingForm,
  editingBillingIndex,
  setEditingBillingIndex,
  billingForm,
  setBillingForm
}) {
  const handleAddBilling = () => {
    setEditingBillingIndex(null);
    setBillingForm({
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingAddress: {
        street: '',
        province: '',
        zip: '',
        country: ''
      }
    });
    setShowBillingForm(true);
  };

  const handleEditBilling = (index) => {
    setEditingBillingIndex(index);
    setBillingForm(billingInfo[index]);
    setShowBillingForm(true);
  };

  const handleRemoveBilling = (index) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setBillingInfo(billingInfo.filter((_, i) => i !== index));
    }
  };

  const handleSaveBilling = (e) => {
    e.preventDefault();
    if (editingBillingIndex !== null) {
      // Edit existing
      const updated = [...billingInfo];
      updated[editingBillingIndex] = billingForm;
      setBillingInfo(updated);
    } else {
      // Add new
      setBillingInfo([...billingInfo, billingForm]);
    }
    setShowBillingForm(false);
    setEditingBillingIndex(null);
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [name]: value }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-900">Billing Information</h3>
        {!showBillingForm && (
          <button 
            onClick={handleAddBilling}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Add Payment Method
          </button>
        )}
      </div>

      {showBillingForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h4 className="text-xl font-bold text-slate-900 mb-6">
            {editingBillingIndex !== null ? 'Edit' : 'Add'} Payment Method
          </h4>
          <form onSubmit={handleSaveBilling} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cardholder Name</label>
                <input 
                  type="text" 
                  value={billingForm.cardholderName}
                  onChange={(e) => setBillingForm({...billingForm, cardholderName: e.target.value})}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Card Number</label>
                <input 
                  type="text" 
                  value={billingForm.cardNumber}
                  onChange={(e) => setBillingForm({...billingForm, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  value={billingForm.expiryDate}
                  onChange={(e) => setBillingForm({...billingForm, expiryDate: e.target.value})}
                  placeholder="MM/YY"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">CVV</label>
                <input 
                  type="text" 
                  value={billingForm.cvv}
                  onChange={(e) => setBillingForm({...billingForm, cvv: e.target.value})}
                  placeholder="123"
                  maxLength="4"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
            </div>

            <h5 className="text-lg font-bold text-slate-900 pt-4 border-t border-slate-50">Billing Address</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Street Address</label>
                <input 
                  name="street"
                  type="text" 
                  value={billingForm.billingAddress.street}
                  onChange={handleBillingAddressChange}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Province</label>
                <input 
                  name="province"
                  type="text" 
                  value={billingForm.billingAddress.province}
                  onChange={handleBillingAddressChange}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Zip Code</label>
                <input 
                  name="zip"
                  type="text" 
                  value={billingForm.billingAddress.zip}
                  onChange={handleBillingAddressChange}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Country</label>
                <input 
                  name="country"
                  type="text" 
                  value={billingForm.billingAddress.country}
                  onChange={handleBillingAddressChange}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Save Payment Method
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowBillingForm(false);
                  setEditingBillingIndex(null);
                }}
                className="bg-slate-100 text-slate-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {billingInfo.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-lg">No payment methods added yet.</p>
              <p className="text-slate-400 text-sm mt-2">Click "Add Payment Method" to get started.</p>
            </div>
          ) : (
            billingInfo.map((billing, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:border-indigo-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{billing.cardholderName}</p>
                        <p className="text-sm text-slate-500">•••• •••• •••• {billing.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Expires</p>
                        <p className="text-slate-700">{billing.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Billing Address</p>
                        <p className="text-slate-700">{billing.billingAddress.street}, {billing.billingAddress.province} {billing.billingAddress.zip}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditBilling(index)}
                      className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveBilling(index)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}