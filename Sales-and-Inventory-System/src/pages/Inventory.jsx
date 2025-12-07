import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmationDialog from '../components/ConfirmationDialog';
import './Inventory.css';

const Inventory = () => {
  const { supplies, addSupply, updateSupply, deleteSupply } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });
  const [editingSupply, setEditingSupply] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    unit: '',
    category: '',
  });

  const handleOpenModal = (supply = null) => {
    if (supply) {
      setEditingSupply(supply);
      setFormData({
        name: supply.name,
        stock: supply.stock.toString(),
        unit: supply.unit || '',
        category: supply.category || '',
      });
    } else {
      setEditingSupply(null);
      setFormData({
        name: '',
        stock: '',
        unit: '',
        category: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupply(null);
    setFormData({
      name: '',
      stock: '',
      unit: '',
      category: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const supplyData = {
      name: formData.name,
      stock: parseFloat(formData.stock),
      unit: formData.unit,
      category: formData.category,
    };

    if (editingSupply) {
      updateSupply(editingSupply.id, supplyData);
    } else {
      addSupply(supplyData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const supply = supplies.find(s => s.id === id);
    setConfirmConfig({
      title: 'Delete Supply',
      message: `Are you sure you want to delete "${supply?.name}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteSupply(id);
        setIsConfirmOpen(false);
      },
      type: 'danger',
      confirmText: 'Delete',
    });
    setIsConfirmOpen(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (stock < 10) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  return (
    <div className="inventory">
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Keep supplies ready for service.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Add Supply
        </button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Supply Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No supplies yet.
                </td>
              </tr>
            ) : (
              supplies.map((supply) => {
                const stockStatus = getStockStatus(supply.stock);
                return (
                  <tr key={supply.id}>
                    <td className="product-name">{supply.name}</td>
                    <td>{supply.category || '-'}</td>
                    <td>{supply.stock}</td>
                    <td>{supply.unit || 'units'}</td>
                    <td>
                      <span className={`stock-badge ${stockStatus.class}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenModal(supply)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(supply.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSupply ? 'Edit Supply' : 'Add New Supply'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Supply Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Coffee Beans, Milk"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., kg, L, pieces"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Raw Materials, Dairy"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSupply ? 'Update' : 'Add'} Supply
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
        confirmText={confirmConfig.confirmText || 'Confirm'}
        cancelText={confirmConfig.cancelText || 'Cancel'}
        type={confirmConfig.type || 'default'}
      />
    </div>
  );
};

export default Inventory;

