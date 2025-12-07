import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmationDialog from '../components/ConfirmationDialog';
import './SalesHistory.css';

const SalesHistory = () => {
  const { sales, deleteSale } = useApp();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });

  const handleDelete = (id) => {
    const sale = sales.find(s => s.id === id);
    setConfirmConfig({
      title: 'Delete Sale Record',
      message: `Are you sure you want to delete sale #${id} for ${sale?.customerName}? This action cannot be undone.`,
      onConfirm: () => {
        deleteSale(id);
        setIsConfirmOpen(false);
      },
      type: 'danger',
      confirmText: 'Delete',
    });
    setIsConfirmOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="sales-history">
      <div className="sales-history-header">
        <h1>Sales Log</h1>
        <p>Review every sales.</p>
      </div>

      <div className="sales-history-container">
        {sales.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">🍔</div>
            <h2>No Orders Yet</h2>
            <p>Sales log is empty.</p>
          </div>
        ) : (
          <div className="sales-list">
            {sales.map((sale) => (
              <div key={sale.id} className="sale-card">
                <div className="sale-header">
                  <div className="sale-info">
                    <h3>Sale #{sale.id}</h3>
                    <p className="sale-date">{formatDate(sale.date)}</p>
                    <p className="sale-customer">
                      <strong>Customer:</strong> {sale.customerName}
                    </p>
                  </div>
                  <div className="sale-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">₱{sale.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="sale-items">
                  <h4>Items:</h4>
                  <div className="items-list">
                    {sale.items.map((item, index) => (
                      <div key={index} className="sale-item">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-details">
                          {item.quantity} × ₱{item.price.toFixed(2)} = ₱{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sale-actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(sale.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText || 'Confirm'}
        cancelText={confirmConfig.cancelText || 'Cancel'}
        type={confirmConfig.type || 'default'}
      />
    </div>
  );
};

export default SalesHistory;

