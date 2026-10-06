import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import {
  DollarSign,
  Package,
  Layers,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/admin/stats');
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard metrics');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="text-rose-600 font-bold mb-2">Error Loading Dashboard</p>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Admin Executive Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 tracking-wider">
              ADMIN RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metrics, product management, and order fulfillment controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all"
          >
            <Package className="w-3.5 h-3.5" /> Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Revenue
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ${stats.totalRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Gross Sales
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Orders
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.totalOrders}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Across all customer accounts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Catalog Items
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.totalProducts}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Active SKU listings
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Low Stock Alert
            </span>
            <span className="text-2xl font-extrabold text-amber-600">
              {stats.lowStockCount}
            </span>
            <span className="text-[10px] text-amber-600 font-semibold block mt-1">
              Items stock &le; 5
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2-Column Section: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-800">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800 block">
                          {ord.user?.name || 'Customer'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.user?.email || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        ${ord.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={ord.status} />
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/admin/orders"
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No recent orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Low Stock Warnings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Inventory Alerts
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              Restock
            </Link>
          </div>

          {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.category} • ${p.price}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-extrabold text-[11px] bg-amber-200 text-amber-900 flex-shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              All inventory levels are comfortably stocked above 5 units.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
