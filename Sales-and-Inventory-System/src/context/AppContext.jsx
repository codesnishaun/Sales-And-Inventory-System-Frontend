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

  const [products, setProducts] = useState(() => 
    loadFromStorage('products', [
      { id: 1, name: 'Laptop', price: 999.99, stock: 15, category: 'Electronics', sku: 'LAP-001' },
      { id: 2, name: 'Mouse', price: 29.99, stock: 50, category: 'Electronics', sku: 'MOU-001' },
      { id: 3, name: 'Keyboard', price: 79.99, stock: 30, category: 'Electronics', sku: 'KEY-001' },
      { id: 4, name: 'Monitor', price: 299.99, stock: 20, category: 'Electronics', sku: 'MON-001' },
    ])
  );

  const [sales, setSales] = useState(() => 
    loadFromStorage('sales', [])
  );

  // Save to localStorage whenever products or sales change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  // Product functions
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Sales functions
  const addSale = (sale) => {
    const newSale = {
      ...sale,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    
    // Update product stock
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct(product.id, {
          ...product,
          stock: product.stock - item.quantity,
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
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.date);
      const today = new Date();
      return saleDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalProducts,
      lowStockProducts,
      totalValue,
      totalSales,
      totalRevenue,
      todaySales,
    };
  };

  const value = {
    products,
    sales,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    deleteSale,
    getStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

