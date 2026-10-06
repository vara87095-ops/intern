import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';
import { Package, ArrowRight, ShoppingBag, Clock, ExternalLink } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch order history');
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Order History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track past orders, fulfillment status, and receipts
          </p>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
        >
          Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Orders Found</h3>
          <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
            You haven't placed any orders yet. Once you complete a purchase, your tracking details will appear here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/order-success/${order._id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="View Receipt"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity} • ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sm:border-l sm:border-slate-100 sm:pl-6 flex flex-col justify-between text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payment</span>
                    <span className="font-semibold text-slate-800">
                      {order.paymentMethod} •{' '}
                      {order.isPaid ? (
                        <span className="text-emerald-600 font-bold">Paid</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Pending</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Shipping Destination</span>
                    <span className="text-slate-700 truncate block">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Order Total</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
