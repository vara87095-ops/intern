import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link
        to={`/product/${product._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Low Stock / Out of Stock Banner */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold bg-rose-600 text-white rounded-full shadow-sm">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold bg-amber-500 text-white rounded-full shadow-sm animate-pulse">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-emerald-700">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span className="text-slate-400">({product.numReviews})</span>
            </div>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="block font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 text-sm sm:text-base leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl font-semibold flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95'
            }`}
            title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
          >
            {added ? (
              <Check className="w-4 h-4 animate-in zoom-in" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
