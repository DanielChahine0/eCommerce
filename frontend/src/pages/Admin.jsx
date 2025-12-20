import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../redux/orders/orderActions';
import { createProduct, fetchProducts } from '../redux/products/productActions';
import { fetchUsers, updateUser } from '../redux/users/userActions';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function Admin() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({ query: '', date: '' });
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    image: '',
    brandId: '',
    categoryId: '',
  });

  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);

  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchOrders({ jwt: authToken }));
    }
    if (!products || products.length === 0) {
      dispatch(fetchProducts({ jwt: authToken }));
    }
    if (!users || users.length === 0) {
      dispatch(fetchUsers({ jwt: authToken }));
    }
  }, [dispatch, orders, products, users, authToken]);

  useEffect(() => {
    let isMounted = true;
    const loadRoles = async () => {
      setRolesLoading(true);
      try {
        const data = await api('/api/roles');
        if (isMounted) {
          setRoles(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setRoles([]);
        }
      } finally {
        if (isMounted) {
          setRolesLoading(false);
        }
      }
    };

    loadRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  const filteredOrders = useMemo(() => {
    if (activeTab !== 'sales') return orders || [];
    const query = filters.query.trim().toLowerCase();
    return (orders || []).filter((order) => {
      const orderDate = order.timeCreated ? order.timeCreated.slice(0, 10) : '';
      const matchesQuery =
        query === '' ||
        String(order.id).includes(query) ||
        (order.username || '').toLowerCase().includes(query);
      const matchesDate = filters.date === '' || orderDate === filters.date;
      return matchesQuery && matchesDate;
    });
  }, [orders, filters, activeTab]);

  const handleUpdateStock = async (id, newQty) => {
    const qty = Number(newQty);
    if (!Number.isFinite(qty) || qty < 0) {
      return;
    }
    await api(`/api/products/${id}/quantity?quantity=${qty}`, { method: 'PATCH' });
    dispatch(fetchProducts({ jwt: authToken }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const payload = {
      name: productForm.name.trim(),
      quantity: Number(productForm.quantity),
      price: Number(productForm.price),
      description: productForm.description.trim(),
      image: productForm.image.trim(),
      brandId: Number(productForm.brandId),
      categoryId: Number(productForm.categoryId),
    };

    if (
      !payload.name ||
      !Number.isFinite(payload.quantity) ||
      !Number.isFinite(payload.price) ||
      !Number.isFinite(payload.brandId) ||
      !Number.isFinite(payload.categoryId)
    ) {
      return;
    }

    if (!payload.description) {
      delete payload.description;
    }
    if (!payload.image) {
      delete payload.image;
    }

    await dispatch(createProduct(payload));
    dispatch(fetchProducts({ jwt: authToken }));
    setProductForm({
      name: '',
      quantity: '',
      price: '',
      description: '',
      image: '',
      brandId: '',
      categoryId: '',
    });
    setIsAddOpen(false);
  };

  const handleUpdateOrderStatus = (id, status) => {
    dispatch(updateOrderStatus(id, status));
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

        <div className='flex flex-row justify-between'>

              <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl mb-4 w-fit">
                 {['sales', 'inventory', 'users'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {tab}
            </button>
          ))}         
        </div>
            {/* If the active tab is inventory, show the Add Item button*/}
           {activeTab === 'inventory' && 
           
           <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <form onSubmit={handleAddProduct}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Item</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Item</DialogTitle>
                        <DialogDescription>
                          To add a new product to inventory, fill out the form below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="name-1">Name</Label>
                          <Input
                            id="name-1"
                            name="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="quantity-1">Quantity</Label>
                          <Input
                            id="quantity-1"
                            name="quantity"
                            type="number"
                            min="0"
                            value={productForm.quantity}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="price-1">Price</Label>
                          <Input
                            id="price-1"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="description-1">Description</Label>
                          <Input
                            id="description-1"
                            name="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="image-1">Image URL</Label>
                          <Input
                            id="image-1"
                            name="image"
                            value={productForm.image}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="brandId-1">Brand ID</Label>
                          <Input
                            id="brandId-1"
                            name="brandId"
                            type="number"
                            min="1"
                            value={productForm.brandId}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, brandId: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="categoryId-1">Category ID</Label>
                          <Input
                            id="categoryId-1"
                            name="categoryId"
                            type="number"
                            min="1"
                            value={productForm.categoryId}
                            onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
            }
           
        </div>

        {/* Requirement: Filters for Sales */}
        {activeTab === 'sales' && (
          <div className="flex gap-4 mb-6">
            <input type="text" placeholder="Filter by customer or order ID..." className="p-2 rounded-lg border w-64" 
              onChange={(e) => setFilters({...filters, query: e.target.value})} />
            <input type="date" className="p-2 rounded-lg border" 
              onChange={(e) => setFilters({...filters, date: e.target.value})} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'sales' && (
            <SalesTable
              orders={filteredOrders}
              onViewDetails={setSelectedItem}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}
          {activeTab === 'inventory' && <InventoryTable products={products} onUpdate={handleUpdateStock} />}
          {activeTab === 'users' && <UsersTable users={users} onManage={setSelectedItem} />}
        </div>
      </div>

      {/* Requirement: Detail Modals for Orders and Users */}
      {selectedItem && (
        <Modal onClose={() => setSelectedItem(null)}>
          {activeTab === 'sales' ? (
            <OrderDetail order={selectedItem} />
          ) : (
            <UserEdit
              user={selectedItem}
              roles={roles}
              rolesLoading={rolesLoading}
              onSave={async (payload) => {
                await dispatch(updateUser(selectedItem.id, payload));
                setSelectedItem(null);
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

// --- Detailed Views & Sub-components ---

function SalesTable({ orders, onViewDetails, onUpdateStatus }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b">
        <tr>
          <th className="p-4">Date</th>
          <th className="p-4">Order ID</th>
          <th className="p-4">Customer</th>
          <th className="p-4">Status</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="5" className="p-6 text-center text-slate-500">
              No orders found.
            </td>
          </tr>
        ) : (
          orders.map(order => (
            <tr key={order.id} className="border-b">
              <td className="p-4 text-sm">{formatDate(order.timeCreated)}</td>
              <td className="p-4 font-mono">#{order.id}</td>
              <td className="p-4">{order.username || 'Guest'}</td>
              <td className="p-4">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-4 text-right">
                <button onClick={() => onViewDetails(order)} className="text-indigo-600 font-medium">View Details</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// Requirement: Order Details View (User, Status, Total)
function OrderDetail({ order }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order Details #{order.id}</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-slate-500">Customer:</div><div>{order.username || 'Guest'}</div>
        <div className="text-slate-500">Status:</div><div>{order.status}</div>
        <div className="text-slate-500">Total Price:</div><div className="font-bold">${order.total}</div>
        <div className="text-slate-500">Shipping To:</div><div>{formatAddress(order.address)}</div>
        <div className="text-slate-500">Placed On:</div><div>{formatDate(order.timeCreated)}</div>
      </div>
    </div>
  );
}

// Requirement: Maintain Customer Account (Update address, role, contact)
function UserEdit({ user, roles, rolesLoading, onSave }) {
  const [formState, setFormState] = useState(() => buildUserFormState(user));

  useEffect(() => {
    setFormState(buildUserFormState(user));
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      username: formState.username.trim(),
      email: formState.email.trim(),
      roleId: Number(formState.roleId),
      phoneNumber: formState.phoneNumber.trim() || null,
      address: {
        id: formState.addressId || null,
        street: formState.street.trim(),
        province: formState.province.trim(),
        country: formState.country.trim(),
        zip: formState.zip.trim(),
      },
    };

    if (!payload.phoneNumber) {
      delete payload.phoneNumber;
    }

    onSave(payload);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Maintain Account: {user.email}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Username</label>
          <input
            type="text"
            value={formState.username}
            onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Email</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Role</label>
          <select
            value={formState.roleId}
            onChange={(e) => setFormState((prev) => ({ ...prev, roleId: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
            disabled={rolesLoading}
            required
          >
            <option value="" disabled>
              {rolesLoading ? 'Loading roles...' : 'Select a role'}
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Phone</label>
          <input
            type="text"
            value={formState.phoneNumber}
            onChange={(e) => setFormState((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Street</label>
          <input
            type="text"
            value={formState.street}
            onChange={(e) => setFormState((prev) => ({ ...prev, street: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Province</label>
            <input
              type="text"
              value={formState.province}
              onChange={(e) => setFormState((prev) => ({ ...prev, province: e.target.value }))}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Country</label>
            <input
              type="text"
              value={formState.country}
              onChange={(e) => setFormState((prev) => ({ ...prev, country: e.target.value }))}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Postal Code</label>
          <input
            type="text"
            value={formState.zip}
            onChange={(e) => setFormState((prev) => ({ ...prev, zip: e.target.value }))}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Update Information</button>
      </form>
    </div>
  );
}

// Simple Modal Wrapper
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">x</button>
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
                  min="0"
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
        {users.length === 0 ? (
          <tr>
            <td colSpan="3" className="p-6 text-center text-slate-500">
              No users found.
            </td>
          </tr>
        ) : (
          users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-4">{u.email}</td>
              <td className="p-4 text-sm text-slate-500">{u.role?.name || 'Unknown'}</td>
              <td className="p-4 text-right">
                <button onClick={() => onManage(u)} className="text-indigo-600 font-medium">Edit Info</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function formatDate(value) {
  if (!value) return 'N/A';
  return value.slice(0, 10);
}

function formatAddress(address) {
  if (!address) return 'N/A';
  const parts = [address.street, address.province, address.country, address.zip].filter(Boolean);
  return parts.join(', ') || 'N/A';
}

function buildUserFormState(user) {
  return {
    username: user.username || '',
    email: user.email || '',
    roleId: user.role?.id || '',
    phoneNumber: user.phoneNumber || '',
    addressId: user.address?.id || null,
    street: user.address?.street || '',
    province: user.address?.province || '',
    country: user.address?.country || '',
    zip: user.address?.zip || '',
  };
}
