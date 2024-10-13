import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loading from './Loading';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchQuery]);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (searchQuery) {
        response = await api.get(`/api/inventory/search/${searchQuery}`);
      } else {
        response = await api.get(`/api/inventory/page/${currentPage}`);
        setTotalPages(response.data.totalPages);
      }
      setInventoryItems(response.data.docs || response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory items. Please try again.');
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/inventory', newItem);
      setNewItem({ name: '', description: '', quantity: 0 });
      fetchInventory();
      toast.success('Inventory item added successfully');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/inventory/${id}`);
        fetchInventory();
        toast.success('Inventory item deleted successfully');
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        toast.error('Failed to delete inventory item');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inventory-container">
      <h2>Inventory</h2>
      <form onSubmit={handleSubmit} className="inventory-form">
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Item Name"
          required
        />
        <input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <ul className="inventory-list">
        {inventoryItems.map((item) => (
          <li key={item._id} className="inventory-item">
            <span>{item.name} - {item.description} (Quantity: {item.quantity})</span>
            <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      {!searchQuery && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
