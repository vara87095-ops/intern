import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, ArrowRight, Package, ShoppingBag, MapPin, CreditCard } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load order receipt');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error}</p>
        <Link
          to="/"
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Success Hero */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Your order has been recorded and is currently being processed.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-700">
          Order ID: <strong>{order._id}</strong>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Status & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
              Order Lifecycle Status
            </span>
            <StatusBadge status={order.status} size="lg" />
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
              Date Placed
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600">{order.shippingAddress.address}</p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <p className="text-slate-500 mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment Details</span>
            </div>
            <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
            <div className="mt-2">
              {order.isPaid ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Paid
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  Pending Payment (COD)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Purchased Products
          </h3>
          <div className="divide-y divide-slate-100 border rounded-2xl border-slate-100 overflow-hidden">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-slate-800">${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-slate-800">
              {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Sales Tax (8%)</span>
            <span className="font-semibold text-slate-800">${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Amount Paid</span>
            <span className="text-base text-emerald-700">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Package className="w-4 h-4" /> View My Order History
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
