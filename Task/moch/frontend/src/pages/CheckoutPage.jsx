import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    shippingAddress,
    saveShippingAddress,
    paymentMethod,
    savePaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || user?.name || '',
    address: shippingAddress.address || user?.address?.street || '',
    city: shippingAddress.city || user?.address?.city || '',
    postalCode: shippingAddress.postalCode || user?.address?.postalCode || '',
    country: shippingAddress.country || user?.address?.country || 'USA',
    phone: shippingAddress.phone || user?.address?.phone || '+1 555-0100',
  });

  const [selectedPayment, setSelectedPayment] = useState(paymentMethod || 'Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      setError('Please fill in all mandatory shipping address fields');
      return;
    }
    setError(null);
    saveShippingAddress(formData);
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedPayment);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: formData,
        paymentMethod: selectedPayment,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await apiClient.post('/orders', orderPayload);
      clearCart();
      setLoading(false);
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Checkout Stepper Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-600 transition-all duration-300 z-0"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1">Shipping</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1">Payment</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1">Review</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SHIPPING ADDRESS */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
              <p className="text-xs text-slate-500">Where should we deliver your order?</p>
            </div>
          </div>

          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 555-0199"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. 123 Main Street, Suite 400"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="e.g. 94107"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g. USA"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: PAYMENT METHOD */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
              <p className="text-xs text-slate-500">Select how you'd like to pay</p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  id: 'Credit Card',
                  title: 'Credit / Debit Card (Instant Simulation)',
                  desc: 'Mock processed securely with instant payment verification.',
                  icon: CreditCard,
                },
                {
                  id: 'UPI / NetBanking',
                  title: 'UPI / Net Banking / Fast Wire',
                  desc: 'Instant digital wallet & banking simulation.',
                  icon: DollarSign,
                },
                {
                  id: 'Cash on Delivery',
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay in cash upon physical product delivery at your door.',
                  icon: Truck,
                },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPayment === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">{option.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{option.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shipping
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                Review Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: ORDER REVIEW & CONFIRMATION */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100 mb-6">
              Review and Confirm Order
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Deliver To
                </span>
                <p className="font-bold text-slate-800">{formData.fullName}</p>
                <p className="text-slate-600">{formData.address}</p>
                <p className="text-slate-600">
                  {formData.city}, {formData.postalCode}, {formData.country}
                </p>
                <p className="text-slate-600 mt-1">Phone: {formData.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Payment Preference
                </span>
                <p className="font-bold text-emerald-700">{selectedPayment}</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  {selectedPayment === 'Cash on Delivery'
                    ? 'Payment collected upon package handover.'
                    : 'Mock payment authorization processed upon placement.'}
                </p>
              </div>
            </div>

            {/* Line items list */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Order Items ({cartItems.length})
            </h3>
            <div className="divide-y divide-slate-100 border rounded-2xl border-slate-100 overflow-hidden mb-8">
              {cartItems.map((item) => (
                <div key={item.product} className="p-3.5 flex items-center justify-between text-xs">
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

            {/* Totals Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-800">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="text-base text-emerald-700">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Change Payment
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                {loading ? 'Processing Order...' : 'Confirm & Place Order'}
                {!loading && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
