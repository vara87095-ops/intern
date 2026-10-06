import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import {
  Package,
  Search,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'All'
          ? '/admin/orders'
          : `/admin/orders?status=${statusFilter}`;
      const { data } = await apiClient.get(url);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin orders', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await apiClient.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? data : ord))
      );
      setFeedback({ type: 'success', message: `Order #${orderId.slice(-6)} updated to ${newStatus}` });
      setTimeout(() => setFeedback(null), 3000);
      setUpdatingId(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update order status',
      });
      setTimeout(() => setFeedback(null), 4000);
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const custName = o.user?.name?.toLowerCase() || '';
    const custEmail = o.user?.email?.toLowerCase() || '';
    const ordId = o._id.toLowerCase();
    const term = searchTerm.toLowerCase();
    return custName.includes(term) || custEmail.includes(term) || ordId.includes(term);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer orders and advance fulfillment status in real-time
          </p>
        </div>

        {feedback && (
          <div
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No orders match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Current Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>#{ord._id.slice(-6).toUpperCase()}</span>
                        <Link
                          to={`/order-success/${ord._id}`}
                          className="text-slate-400 hover:text-emerald-600"
                          title="View Invoice"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">
                        {ord.user?.name || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {ord.user?.email || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-semibold">
                        {ord.orderItems?.length || 0} items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${ord.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block text-[11px]">
                        {ord.paymentMethod}
                      </span>
                      {ord.isPaid ? (
                        <span className="text-emerald-600 font-bold text-[10px]">PAID</span>
                      ) : (
                        <span className="text-amber-600 font-bold text-[10px]">PENDING (COD)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        disabled={updatingId === ord._id}
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="text-xs font-semibold border border-slate-200 bg-white rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
