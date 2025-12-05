import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Purchase {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  budget: number;
}

interface CartContextType {
  items: CartItem[];
  budget: number;
  setBudget: (budget: number) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  finalizePurchase: () => void;
  getPurchaseHistory: () => Purchase[];
  totalSpent: number;
  remainingBudget: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [budget, setBudget] = useState(0);

  const totalSpent = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const remainingBudget = budget - totalSpent;

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setBudget(0);
  };

  const finalizePurchase = () => {
    if (!user || items.length === 0) return;

    const purchase: Purchase = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: [...items],
      total: totalSpent,
      budget
    };

    const historyKey = `smartshop_history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift(purchase);
    localStorage.setItem(historyKey, JSON.stringify(history));

    clearCart();
  };

  const getPurchaseHistory = (): Purchase[] => {
    if (!user) return [];
    const historyKey = `smartshop_history_${user.id}`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
  };

  return (
    <CartContext.Provider value={{
      items,
      budget,
      setBudget,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      finalizePurchase,
      getPurchaseHistory,
      totalSpent,
      remainingBudget
    }}>
      {children}
    </CartContext.Provider>
  );
};
