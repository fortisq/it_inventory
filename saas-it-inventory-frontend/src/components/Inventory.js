import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/api/inventory');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
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
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      <form onSubmit={handleSubmit}>
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
      <ul>
        {inventoryItems.map((item) => (
          <li key={item._id}>
            {item.name} - {item.description} (Quantity: {item.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
