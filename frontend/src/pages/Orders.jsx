import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orders/orderActions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const orders = useSelector((state) => state.orders.orders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        await dispatch(fetchOrders());
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user, dispatch, navigate]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Order History</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-600">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Order History</h3>
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:border-indigo-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order #{order.id}</p>
              <p className="text-sm text-slate-500 font-medium">
                {order.timeCreated ? new Date(order.timeCreated).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
              order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
              order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-700' :
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Destination</p>
              <p className="text-sm font-semibold text-slate-700">
                {order.address?.street || "N/A"}, {order.address?.province || "N/A"}, {order.address?.country || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Paid</p>
              <p className="text-xl font-black text-slate-900">
                ${order.total?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
