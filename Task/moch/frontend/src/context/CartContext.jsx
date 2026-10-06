import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('shippingAddress');
      return saved
        ? JSON.parse(saved)
        : {
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'USA',
            phone: '',
          };
    } catch {
      return { fullName: '', address: '', city: '', postalCode: '', country: 'USA', phone: '' };
    }
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'Credit Card';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        const newQty = existItem.quantity + quantity;
        const finalQty = Math.min(newQty, product.stock);
        return prevItems.map((x) =>
          x.product === product._id ? { ...x, quantity: finalQty } : x
        );
      } else {
        const initialQty = Math.min(quantity, product.stock);
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.imageUrl,
            price: product.price,
            stock: product.stock,
            quantity: initialQty,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          const validQty = Math.min(quantity, item.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const saveShippingAddress = (address) => {
    setShippingAddress(address);
  };

  const savePaymentMethodMethod = (method) => {
    setPaymentMethod(method);
  };

  // Financial calculations
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 15.0;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        cartCount,
        itemsPrice: Number(itemsPrice.toFixed(2)),
        shippingPrice: Number(shippingPrice.toFixed(2)),
        taxPrice,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        saveShippingAddress,
        savePaymentMethod: savePaymentMethodMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
