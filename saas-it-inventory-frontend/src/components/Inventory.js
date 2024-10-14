import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import './Inventory.css';
import SearchBar from './SearchBar';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    category: '',
    serialNumber: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    cost: 0,
    price: 0
  });
  const [editingItem, setEditingItem] = useState(null);
  const [originalEditingItem, setOriginalEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryInputRef = useRef(null);

  const fetchInventory = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/inventory', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: search
        }
      });
      setInventory(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/inventory/categories');
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [fetchInventory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryInputRef.current && !categoryInputRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setNewItem({ ...newItem, category: value });
    setShowCategoryDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setNewItem({ ...newItem, category });
    setShowCategoryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting item:', newItem);
      await api.post('/api/inventory', newItem);
      setNewItem({
        name: '',
        description: '',
        quantity: 0,
        category: '',
        serialNumber: '',
        warrantyStartDate: '',
        warrantyEndDate: '',
        cost: 0,
        price: 0
      });
      fetchInventory();
      fetchCategories();
    } catch (error) {
      console.error('Error adding inventory item:', error);
      setError(`Failed to add inventory item: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setOriginalEditingItem(JSON.parse(JSON.stringify(item)));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating item:', editingItem);
      const response = await api.put(`/api/inventory/${editingItem._id}`, editingItem);
      console.log('Update response:', response.data);
      setEditingItem(null);
      setOriginalEditingItem(null);
      fetchInventory();
      fetchCategories();
    } catch (error) {
      console.error('Error updating inventory item:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to update inventory item. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        console.log(`Attempting to delete item with ID: ${id}`);
        const response = await api.delete(`/api/inventory/${id}`);
        console.log('Delete response:', response);
        if (response.status === 200) {
          console.log('Item deleted successfully');
          fetchInventory();
          fetchCategories();
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        console.error('Error response:', error.response?.data);
        setError(`Failed to delete inventory item. ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = useCallback((searchTerm) => {
    setCurrentPage(1);
    fetchInventory(searchTerm);
  }, [fetchInventory]);

  const isEditFormChanged = () => {
    return JSON.stringify(editingItem) !== JSON.stringify(originalEditingItem);
  };

  if (loading) {
    return <div className="inventory-loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory">
      <h1 className="inventory-title">Inventory Management</h1>
      {error && <div className="inventory-error">{error}</div>}
      <SearchBar onSearch={handleSearch} />
      <form onSubmit={handleSubmit} className="inventory-form">
        <label>
          Name:
          <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={newItem.description} onChange={handleInputChange} />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required />
        </label>
        <label ref={categoryInputRef}>
          Category:
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleCategoryChange}
            onFocus={() => setShowCategoryDropdown(true)}
            required
          />
          {showCategoryDropdown && (
            <ul className="category-dropdown">
              {categories
                .filter(cat => cat.toLowerCase().includes(newItem.category.toLowerCase()))
                .map((cat, index) => (
                  <li key={index} onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </li>
                ))}
              {!categories.includes(newItem.category) && newItem.category && (
                <li onClick={() => handleCategorySelect(newItem.category)}>
                  Add "{newItem.category}"
                </li>
              )}
            </ul>
          )}
        </label>
        <label>
          Serial Number:
          <input type="text" name="serialNumber" value={newItem.serialNumber} onChange={handleInputChange} />
        </label>
        <label>
          Warranty Start Date:
          <input type="date" name="warrantyStartDate" value={newItem.warrantyStartDate} onChange={handleInputChange} />
        </label>
        <label>
          Warranty End Date:
          <input type="date" name="warrantyEndDate" value={newItem.warrantyEndDate} onChange={handleInputChange} />
        </label>
        <label>
          Cost:
          <input type="number" name="cost" value={newItem.cost} onChange={handleInputChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={newItem.price} onChange={handleInputChange} />
        </label>
        <button type="submit" className="submit-button">Add Item</button>
      </form>
      <div className="inventory-list">
        <h2>Current Inventory</h2>
        {inventory.length > 0 ? (
          <>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Serial Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.category}</td>
                    <td>{item.serialNumber}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p>No inventory items found.</p>
        )}
      </div>
      {editingItem && (
        <div className="edit-popup">
          <h2>Edit Item</h2>
          <form onSubmit={handleEditSubmit}>
            {Object.keys(editingItem).map((key) => {
              if (key !== '_id' && key !== '__v' && key !== 'createdBy' && key !== 'updatedBy') {
                if (key === 'warrantyStartDate' || key === 'warrantyEndDate') {
                  return (
                    <label key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                      <input
                        type="date"
                        name={key}
                        value={editingItem[key] ? editingItem[key].split('T')[0] : ''}
                        onChange={handleEditInputChange}
                      />
                    </label>
                  );
                } else {
                  return (
                    <label key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                      <input
                        type={key === 'quantity' || key === 'cost' || key === 'price' ? 'number' : 'text'}
                        name={key}
                        value={editingItem[key]}
                        onChange={handleEditInputChange}
                      />
                    </label>
                  );
                }
              }
              return null;
            })}
            <div className="edit-popup-buttons">
              {isEditFormChanged() && <button type="submit">Apply Changes</button>}
              <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inventory;
