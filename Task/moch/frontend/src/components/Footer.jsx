import React from 'react';
import { Sparkles, Shield, Truck, RotateCcw, HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Truck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Free Express Shipping</p>
              <p className="text-xs text-slate-400">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Secure Checkout</p>
              <p className="text-xs text-slate-400">256-bit encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <RotateCcw className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">30-Day Free Returns</p>
              <p className="text-xs text-slate-400">Hassle-free exchange policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <HeartHandshake className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">24/7 Dedicated Support</p>
              <p className="text-xs text-slate-400">Expert assistance anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">ApexCart</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            A production-grade full-stack e-commerce platform demonstrating product catalogs, reactive carts, checkout pipelines, and role-based administration.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/" className="hover:text-emerald-400 transition-colors">Catalog Products</a></li>
            <li><a href="/cart" className="hover:text-emerald-400 transition-colors">Shopping Cart</a></li>
            <li><a href="/orders" className="hover:text-emerald-400 transition-colors">Order Tracking</a></li>
            <li><a href="/login" className="hover:text-emerald-400 transition-colors">Account Access</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Tech Architecture</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              React 18 + Vite + Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Node.js + Express REST API
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              MongoDB (Mongoose) + Memory Fallback
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              JWT + Bcrypt RBAC
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Internship Project</h4>
          <p className="text-xs leading-relaxed text-slate-400">
            Built as a comprehensive hands-on full-stack e-commerce project with modular architecture, strict authorization controls, and automated testing capabilities.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} ApexCart Systems. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
