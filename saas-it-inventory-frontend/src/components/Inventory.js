import React, { useState, useEffect } from 'react';
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, category: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await getInventory();
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await createInventoryItem(newItem);
      setNewItem({ name: '', quantity: 0, category: '' });
      await fetchInventory();
    } catch (err) {
      setError('Failed to add item. Please try again.');
    }
  };

  const handleUpdateItem = async (id, updatedItem) => {
    try {
      await updateInventoryItem(id, updatedItem);
      await fetchInventory();
    } catch (err) {
      setError('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      await fetchInventory();
    } catch (err) {
      setError('Failed to delete item. Please try again.');
    }
  };

  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Inventory</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: item.quantity + 1 })}>+</button>
                <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: Math.max(0, item.quantity - 1) })}>-</button>
                <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
