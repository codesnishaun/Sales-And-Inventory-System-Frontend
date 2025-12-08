import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmationDialog from '../components/ConfirmationDialog';
import './Sales.css';

const Sales = () => {
  const { menuItems, supplies, addSale, addProduct, deleteProduct } = useApp();
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isEditCartOpen, setIsEditCartOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    price: '',
    category: '',
    supplyRequirements: [],
  });

  // Check if menu items can be made (have enough supplies)
  const canMakeMenuItem = (menuItem) => {
    if (!menuItem.supplyRequirements || menuItem.supplyRequirements.length === 0) return true;
    return menuItem.supplyRequirements.every(req => {
      const supply = supplies.find(s => s.id === req.supplyId);
      return supply && supply.stock >= req.quantityPerOrder;
    });
  };

  const availableProducts = menuItems.filter(canMakeMenuItem);

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = menuItems.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    // Check if we have enough supplies for the quantity
    if (!canMakeMenuItem(product)) {
      setConfirmConfig({
        title: 'Insufficient Supplies',
        message: 'Not enough supplies to make this menu item. Please check inventory.',
        onConfirm: () => setIsConfirmOpen(false),
      });
      setIsConfirmOpen(true);
      return;
    }

    // Check if we have enough supplies for the requested quantity
    const canMakeQuantity = product.supplyRequirements.every(req => {
      const supply = supplies.find(s => s.id === req.supplyId);
      if (!supply) return false;
      return supply.stock >= req.quantityPerOrder * quantity;
    });

    if (!canMakeQuantity) {
      setConfirmConfig({
        title: 'Insufficient Supplies',
        message: 'Not enough supplies to make the requested quantity. Please reduce the quantity.',
        onConfirm: () => setIsConfirmOpen(false),
      });
      setIsConfirmOpen(true);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      // Re-check supplies for new total quantity
      const canMakeNewQuantity = product.supplyRequirements.every(req => {
        const supply = supplies.find(s => s.id === req.supplyId);
        if (!supply) return false;
        return supply.stock >= req.quantityPerOrder * newQuantity;
      });
      if (!canMakeNewQuantity) {
        setConfirmConfig({
          title: 'Insufficient Supplies',
          message: 'Not enough supplies for the total quantity. Please reduce the quantity.',
          onConfirm: () => setIsConfirmOpen(false),
        });
        setIsConfirmOpen(true);
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
    const item = cart.find(i => i.productId === productId);
    setConfirmConfig({
      title: 'Remove Item',
      message: `Remove "${item?.productName}" from cart?`,
      onConfirm: () => {
        setCart(cart.filter(item => item.productId !== productId));
        setIsConfirmOpen(false);
      },
      type: 'danger',
      confirmText: 'Remove',
    });
    setIsConfirmOpen(true);
  };

  const handleRemoveFromCartDirect = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCartDirect(productId);
      return;
    }

    const item = cart.find(i => i.productId === productId);
    const product = menuItems.find(p => p.id === productId);
    
    // Check if we have enough supplies for the new quantity
    if (product.supplyRequirements && product.supplyRequirements.length > 0) {
      const canMakeNewQuantity = product.supplyRequirements.every(req => {
        const supply = supplies.find(s => s.id === req.supplyId);
        if (!supply) return false;
        return supply.stock >= req.quantityPerOrder * newQuantity;
      });
      if (!canMakeNewQuantity) {
        setConfirmConfig({
          title: 'Insufficient Supplies',
          message: 'Not enough supplies for this quantity. Please reduce the quantity.',
          onConfirm: () => setIsConfirmOpen(false),
        });
        setIsConfirmOpen(true);
        return;
      }
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setConfirmConfig({
        title: 'Empty Cart',
        message: 'Your cart is empty. Please add items before checkout.',
        onConfirm: () => setIsConfirmOpen(false),
      });
      setIsConfirmOpen(true);
      return;
    }

    if (!customerName.trim()) {
      setConfirmConfig({
        title: 'Customer Name Required',
        message: 'Please enter customer name before checkout.',
        onConfirm: () => setIsConfirmOpen(false),
      });
      setIsConfirmOpen(true);
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

    setConfirmConfig({
      title: 'Confirm Order',
      message: `Complete order for ${customerName.trim()}? Total: ₱${total.toFixed(2)}`,
      onConfirm: () => {
        addSale({
          customerName: customerName.trim(),
          items: cart,
          total: total,
        });
        setConfirmConfig({
          title: 'Success',
          message: 'Order completed successfully!',
          onConfirm: () => {
            setIsConfirmOpen(false);
            setCart([]);
            setCustomerName('');
            setSelectedProduct('');
            setQuantity(1);
          },
        });
      },
      confirmText: 'Complete Order',
      type: 'success',
    });
    setIsConfirmOpen(true);
  };

  const handleOpenAddMenu = () => {
    setNewMenuForm({
      name: '',
      price: '',
      category: '',
      supplyRequirements: [],
    });
    setIsAddMenuOpen(true);
  };

  const handleCloseAddMenu = () => {
    setIsAddMenuOpen(false);
    setNewMenuForm({
      name: '',
      price: '',
      category: '',
      supplyRequirements: [],
    });
  };

  const handleAddSupplyRequirement = () => {
    setNewMenuForm({
      ...newMenuForm,
      supplyRequirements: [...newMenuForm.supplyRequirements, { supplyId: '', quantityPerOrder: '' }],
    });
  };

  const handleUpdateSupplyRequirement = (index, field, value) => {
    const updated = [...newMenuForm.supplyRequirements];
    updated[index] = { ...updated[index], [field]: value };
    setNewMenuForm({ ...newMenuForm, supplyRequirements: updated });
  };

  const handleRemoveSupplyRequirement = (index) => {
    setNewMenuForm({
      ...newMenuForm,
      supplyRequirements: newMenuForm.supplyRequirements.filter((_, i) => i !== index),
    });
  };

  const handleSubmitNewMenu = (e) => {
    e.preventDefault();
    const menuItem = {
      name: newMenuForm.name,
      price: parseFloat(newMenuForm.price),
      category: newMenuForm.category,
      supplyRequirements: newMenuForm.supplyRequirements
        .filter(req => req.supplyId && req.quantityPerOrder)
        .map(req => ({
          supplyId: parseInt(req.supplyId),
          quantityPerOrder: parseFloat(req.quantityPerOrder),
        })),
    };
    addProduct(menuItem);
    handleCloseAddMenu();
    setConfirmConfig({
      title: 'Success',
      message: 'Menu item added successfully!',
      onConfirm: () => setIsConfirmOpen(false),
      type: 'success',
    });
    setIsConfirmOpen(true);
  };

  const handleDeleteMenuItem = (menuItemId) => {
    const menuItem = menuItems.find(m => m.id === menuItemId);
    // Check if item is in cart
    const inCart = cart.some(item => item.productId === menuItemId);
    
    if (inCart) {
      setConfirmConfig({
        title: 'Cannot Delete',
        message: `"${menuItem?.name}" is currently in the cart. Please remove it from the cart first.`,
        onConfirm: () => setIsConfirmOpen(false),
      });
      setIsConfirmOpen(true);
      return;
    }

    setConfirmConfig({
      title: 'Delete Menu Item',
      message: `Are you sure you want to delete "${menuItem?.name}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteProduct(menuItemId);
        setIsConfirmOpen(false);
        // Close manage menu if it's open and no items left
        if (menuItems.length === 1) {
          setIsManageMenuOpen(false);
        }
      },
      type: 'danger',
      confirmText: 'Delete',
    });
    setIsConfirmOpen(true);
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="sales">
      <div className="sales-header">
        <div>
          <h1>Create an Order</h1>
          <p>Sales</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setIsManageMenuOpen(true)}>
            📋 Manage Menu
          </button>
          <button className="btn-primary" onClick={handleOpenAddMenu}>
            + Add New Menu
          </button>
        </div>
      </div>

      <div className="sales-container">
        <div className="sales-left">
          <div className="sales-section">
            <h2>Add Menu Items</h2>
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
                <label>Select Menu Item *</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a menu item...</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₱{product.price.toFixed(2)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Order Queue ({cart.length})</h2>
              {cart.length > 0 && (
                <button className="btn-edit-cart" onClick={() => setIsEditCartOpen(true)}>
                  ✏️ Edit Cart
                </button>
              )}
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>No orders</p>
                <span>Add anything to start an order.</span>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => {
                  const product = menuItems.find(p => p.id === item.productId);
                  // Check if we can add more of this item
                  const canAddMore = product && product.supplyRequirements
                    ? product.supplyRequirements.every(req => {
                        const supply = supplies.find(s => s.id === req.supplyId);
                        return supply && supply.stock >= req.quantityPerOrder * (item.quantity + 1);
                      })
                    : true;
                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.productName}</h4>
                        <p>₱{item.price.toFixed(2)} each</p>
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
                            disabled={!canAddMore}
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">
                          ₱{item.subtotal.toFixed(2)}
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
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="checkout-row total">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={cart.length === 0 || !customerName.trim()}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>

      {/* Manage Menu Modal */}
      {isManageMenuOpen && (
        <div className="modal-overlay" onClick={() => setIsManageMenuOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Menu Items</h2>
              <button className="modal-close" onClick={() => setIsManageMenuOpen(false)}>
                ×
              </button>
            </div>
            <div className="manage-menu-content">
              {menuItems.length === 0 ? (
                <div className="empty-cart">
                  <p>No menu items yet. Add your first menu item!</p>
                </div>
              ) : (
                <div className="manage-menu-items">
                  {menuItems.map((menuItem) => {
                    const inCart = cart.some(item => item.productId === menuItem.id);
                    const canMake = canMakeMenuItem(menuItem);
                    return (
                      <div key={menuItem.id} className="manage-menu-item">
                        <div className="manage-menu-item-info">
                          <h4>{menuItem.name}</h4>
                          <div className="manage-menu-details">
                            <span>₱{menuItem.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>{menuItem.category}</span>
                            {menuItem.supplyRequirements && menuItem.supplyRequirements.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="supply-info">
                                  {menuItem.supplyRequirements.length} supply{menuItem.supplyRequirements.length > 1 ? 'ies' : ''}
                                </span>
                              </>
                            )}
                          </div>
                          {inCart && (
                            <span className="in-cart-badge">In Cart</span>
                          )}
                          {!canMake && !inCart && (
                            <span className="low-supply-badge">Low Supplies</span>
                          )}
                        </div>
                        <button
                          className="btn-delete-menu"
                          onClick={() => handleDeleteMenuItem(menuItem.id)}
                          disabled={inCart}
                          title={inCart ? 'Remove from cart first' : 'Delete menu item'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="manage-menu-actions">
                <button className="btn-secondary" onClick={() => setIsManageMenuOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cart Modal */}
      {isEditCartOpen && (
        <div className="modal-overlay" onClick={() => setIsEditCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Cart</h2>
              <button className="modal-close" onClick={() => setIsEditCartOpen(false)}>
                ×
              </button>
            </div>
            <div className="edit-cart-content">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="edit-cart-items">
                  {cart.map((item) => {
                    const product = menuItems.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} className="edit-cart-item">
                        <div className="edit-cart-item-info">
                          <h4>{item.productName}</h4>
                          <p>Quantity: {item.quantity} × ₱{item.price.toFixed(2)} = ₱{item.subtotal.toFixed(2)}</p>
                        </div>
                        <button
                          className="btn-remove-item"
                          onClick={() => {
                            handleRemoveFromCartDirect(item.productId);
                            if (cart.length === 1) {
                              setIsEditCartOpen(false);
                            }
                          }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="edit-cart-actions">
                <button className="btn-secondary" onClick={() => setIsEditCartOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Menu Modal */}
      {isAddMenuOpen && (
        <div className="modal-overlay" onClick={handleCloseAddMenu}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Menu Item</h2>
              <button className="modal-close" onClick={handleCloseAddMenu}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitNewMenu} className="product-form">
              <div className="form-group">
                <label>Menu Item Name *</label>
                <input
                  type="text"
                  value={newMenuForm.name}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, name: e.target.value })}
                  required
                  placeholder="Enter menu item name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₱) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newMenuForm.price}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={newMenuForm.category}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, category: e.target.value })}
                    required
                    placeholder="e.g., Coffee, Pastry"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label>Supply Requirements</label>
                  <button type="button" className="btn-add-supply" onClick={handleAddSupplyRequirement}>
                    + Add Supply
                  </button>
                </div>
                {supplies.length === 0 ? (
                  <p style={{ color: '#8a5e3b', fontSize: '0.9rem', margin: '8px 0' }}>
                    No supplies available. Add supplies in Inventory first.
                  </p>
                ) : (
                  <div className="supply-requirements-list">
                    {newMenuForm.supplyRequirements.map((req, index) => {
                      const selectedSupply = supplies.find(s => s.id === parseInt(req.supplyId));
                      return (
                        <div key={index} className="supply-requirement-item">
                          <select
                            value={req.supplyId}
                            onChange={(e) => handleUpdateSupplyRequirement(index, 'supplyId', e.target.value)}
                            className="supply-select"
                            required
                          >
                            <option value="">Select supply...</option>
                            {supplies.map(supply => (
                              <option key={supply.id} value={supply.id}>
                                {supply.name} (Available: {supply.stock} {supply.unit || 'units'})
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={req.quantityPerOrder}
                            onChange={(e) => handleUpdateSupplyRequirement(index, 'quantityPerOrder', e.target.value)}
                            placeholder="Qty per order"
                            className="supply-quantity"
                            required
                          />
                          {selectedSupply && (
                            <span className="supply-unit">{selectedSupply.unit || 'units'}</span>
                          )}
                          <button
                            type="button"
                            className="btn-remove-supply"
                            onClick={() => handleRemoveSupplyRequirement(index)}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    {newMenuForm.supplyRequirements.length === 0 && (
                      <p style={{ color: '#8a5e3b', fontSize: '0.9rem', margin: '8px 0', fontStyle: 'italic' }}>
                        Click "Add Supply" to specify which supplies are needed for this menu item.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseAddMenu}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText || 'OK'}
        cancelText={confirmConfig.cancelText || 'Cancel'}
        type={confirmConfig.type || 'default'}
      />
    </div>
  );
};

export default Sales;

