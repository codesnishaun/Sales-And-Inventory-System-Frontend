import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Load data from localStorage on mount
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Supplies are raw materials/inventory items
  const [supplies, setSupplies] = useState(() => 
    loadFromStorage('supplies', [
      { id: 1, name: 'Coffee Beans', stock: 100, unit: 'kg', category: 'Raw Materials' },
      { id: 2, name: 'Milk', stock: 50, unit: 'L', category: 'Dairy' },
      { id: 3, name: 'Sugar', stock: 30, unit: 'kg', category: 'Ingredients' },
      { id: 4, name: 'Flour', stock: 40, unit: 'kg', category: 'Baking' },
    ])
  );

  // Menu items are products that customers order (made from supplies)
  const [menuItems, setMenuItems] = useState(() => 
    loadFromStorage('menuItems', [
      { id: 1, name: 'Signature Brew', price: 140, category: 'Coffee', supplyRequirements: [{ supplyId: 1, quantityPerOrder: 0.1 }, { supplyId: 2, quantityPerOrder: 0.2 }] },
      { id: 2, name: 'Iced Spanish Latte', price: 190, category: 'Coffee', supplyRequirements: [{ supplyId: 1, quantityPerOrder: 0.15 }, { supplyId: 2, quantityPerOrder: 0.25 }] },
      { id: 3, name: 'Almond Croissant', price: 165, category: 'Pastry', supplyRequirements: [{ supplyId: 4, quantityPerOrder: 0.2 }] },
      { id: 4, name: 'Matcha Cheesecake Slice', price: 210, category: 'Dessert', supplyRequirements: [{ supplyId: 4, quantityPerOrder: 0.15 }] },
    ])
  );

  // Keep products alias for backward compatibility
  const products = menuItems;

  const [sales, setSales] = useState(() => 
    loadFromStorage('sales', [])
  );

  // Save to localStorage whenever supplies, menuItems or sales change
  useEffect(() => {
    localStorage.setItem('supplies', JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  // Supply functions (inventory management)
  const addSupply = (supply) => {
    const newSupply = {
      ...supply,
      id: Date.now(),
    };
    setSupplies([...supplies, newSupply]);
    return newSupply;
  };

  const updateSupply = (id, updatedSupply) => {
    setSupplies(supplies.map(s => s.id === id ? { ...updatedSupply, id } : s));
  };

  const deleteSupply = (id) => {
    setSupplies(supplies.filter(s => s.id !== id));
  };

  // Menu item functions (products)
  const addProduct = (menuItem) => {
    const newMenuItem = {
      ...menuItem,
      id: Date.now(),
      supplyRequirements: menuItem.supplyRequirements || [],
    };
    setMenuItems([...menuItems, newMenuItem]);
    return newMenuItem;
  };

  const updateProduct = (id, updatedMenuItem) => {
    setMenuItems(menuItems.map(m => m.id === id ? { ...updatedMenuItem, id, supplyRequirements: updatedMenuItem.supplyRequirements || [] } : m));
  };

  const deleteProduct = (id) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  // Sales functions
  const addSale = (sale) => {
    const newSale = {
      ...sale,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    
    // Deduct supplies based on menu item requirements
    sale.items.forEach(item => {
      const menuItem = menuItems.find(m => m.id === item.productId);
      if (menuItem && menuItem.supplyRequirements) {
        menuItem.supplyRequirements.forEach(req => {
          const supply = supplies.find(s => s.id === req.supplyId);
          if (supply) {
            const totalDeduction = req.quantityPerOrder * item.quantity;
            updateSupply(supply.id, {
              ...supply,
              stock: Math.max(0, supply.stock - totalDeduction),
            });
          }
        });
      }
    });

    setSales([newSale, ...sales]);
    return newSale;
  };

  const deleteSale = (id) => {
    setSales(sales.filter(s => s.id !== id));
  };

  // Calculate statistics
  const getStats = () => {
    const totalProducts = menuItems.length;
    const lowStockSupplies = supplies.filter(s => s.stock < 10).length;
    const totalValue = supplies.reduce((sum, s) => sum + s.stock, 0); // Simplified for now
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.date);
      const today = new Date();
      return saleDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalProducts,
      lowStockProducts: lowStockSupplies,
      totalValue,
      totalSales,
      totalRevenue,
      todaySales,
    };
  };

  const value = {
    products, // Alias for menuItems (backward compatibility)
    menuItems,
    supplies,
    sales,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupply,
    updateSupply,
    deleteSupply,
    addSale,
    deleteSale,
    getStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

