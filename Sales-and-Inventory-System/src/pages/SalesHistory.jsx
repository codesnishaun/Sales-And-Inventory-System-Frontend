import { useApp } from '../context/AppContext';
import './SalesHistory.css';

const SalesHistory = () => {
  const { sales, deleteSale } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      deleteSale(id);
    }
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
        <h1>Sales History</h1>
        <p>View all completed sales transactions</p>
      </div>

      <div className="sales-history-container">
        {sales.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <h2>No Sales Yet</h2>
            <p>Your sales history will appear here once you complete your first sale.</p>
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
                    <span className="total-amount">${sale.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="sale-items">
                  <h4>Items:</h4>
                  <div className="items-list">
                    {sale.items.map((item, index) => (
                      <div key={index} className="sale-item">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-details">
                          {item.quantity} × ${item.price.toFixed(2)} = ${item.subtotal.toFixed(2)}
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
    </div>
  );
};

export default SalesHistory;

