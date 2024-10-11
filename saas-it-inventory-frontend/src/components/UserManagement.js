import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'user' });
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await createUser(newUser);
    setNewUser({ email: '', password: '', firstName: '', lastName: '', role: 'user' });
    fetchUsers();
  };

  const handleUpdateUser = async (id, updatedData) => {
    await updateUser(id, updatedData);
    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const startEditing = (user) => {
    setEditingUser({ ...user, password: '' });
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
    user.lastName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <form onSubmit={handleCreateUser} className="user-form">
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>
      <div className="user-filter">
        <input
          type="text"
          placeholder="Filter users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user._id} className="user-item">
            {editingUser && editingUser._id === user._id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(user._id, editingUser);
              }} className="user-edit-form">
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password (leave blank to keep current)"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                />
                <input
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  required
                />
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEditing}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="user-info">
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </div>
                <div className="user-actions">
                  <button onClick={() => startEditing(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
