import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Sales.css';

const Sales = () => {
  const { products, addSale } = useApp();
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');

  const availableProducts = products.filter(p => p.stock > 0);

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (quantity > product.stock) {
      alert(`Only ${product.stock} units available in stock!`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        alert(`Only ${product.stock} units available in stock!`);
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * product.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        subtotal: product.price * quantity,
      }]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const item = cart.find(i => i.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (newQuantity > product.stock) {
      alert(`Only ${product.stock} units available in stock!`);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter customer name!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

    addSale({
      customerName: customerName.trim(),
      items: cart,
      total: total,
    });

    alert('Sale completed successfully!');
    setCart([]);
    setCustomerName('');
    setSelectedProduct('');
    setQuantity(1);
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="sales">
      <div className="sales-header">
        <h1>Create Sale</h1>
        <p>Process new sales transactions</p>
      </div>

      <div className="sales-container">
        <div className="sales-left">
          <div className="sales-section">
            <h2>Add Products</h2>
            <div className="add-product-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="form-group">
                <label>Select Product *</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a product...</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price.toFixed(2)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>

          <div className="sales-section">
            <h2>Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <span>Add products to start a sale</span>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.productName}</h4>
                        <p>${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">
                          ${item.subtotal.toFixed(2)}
                        </div>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="sales-right">
          <div className="checkout-card">
            <h2>Order Summary</h2>
            <div className="checkout-details">
              <div className="checkout-row">
                <span>Items:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="checkout-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="checkout-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={cart.length === 0 || !customerName.trim()}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;

