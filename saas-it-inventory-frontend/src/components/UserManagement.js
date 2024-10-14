import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './UserManagement.css';

Modal.setAppElement('#root');

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await api.post('/api/users', newUser);
      setSuccess('User created successfully');
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      setError('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await api.put(`/api/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
      setSuccess('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      setIsLoading(true);
      try {
        await api.delete(`/api/users/${userToDelete._id}`);
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (user.role !== 'admin') {
    return <div className="access-denied">Access Denied. You must be an admin to view this page.</div>;
  }

  if (isLoading) {
    return <div className="loading" aria-live="polite">Loading user data...</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <div className="error" role="alert">{error}</div>}
      {success && <div className="success" role="status">{success}</div>}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className={`user-management-content ${isMenuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit} className="user-form">
          <h3>Create New User</h3>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            required
            aria-required="true"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : null}
            Create User
          </button>
        </form>
        <div className="user-list">
          <h3>User List</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul aria-label="User list">
              {users.map((user) => (
                <li key={user._id} className="user-item">
                  {editingUser && editingUser._id === user._id ? (
                    <div className="user-edit">
                      <label htmlFor={`edit-username-${user._id}`}>Username</label>
                      <input
                        id={`edit-username-${user._id}`}
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      />
                      <label htmlFor={`edit-email-${user._id}`}>Email</label>
                      <input
                        id={`edit-email-${user._id}`}
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                      <label htmlFor={`edit-role-${user._id}`}>Role</label>
                      <select
                        id={`edit-role-${user._id}`}
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={handleUpdate} disabled={isLoading}>
                        {isLoading ? <span className="spinner"></span> : null}
                        Save
                      </button>
                      <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="user-info">
                      <span>{user.username} - {user.email} (Role: {user.role})</span>
                      <div className="user-actions">
                        <button 
                          onClick={() => handleEdit(user)} 
                          aria-label={`Edit ${user.username}`}
                          onKeyDown={(e) => handleKeyDown(e, () => handleEdit(user))}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)} 
                          aria-label={`Delete ${user.username}`}
                          onKeyDown={(e) => handleKeyDown(e, () => openDeleteModal(user))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete User Confirmation"
        className="delete-modal"
        overlayClassName="delete-modal-overlay"
      >
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p id="delete-modal-description">Are you sure you want to delete the user: {userToDelete?.username}?</p>
        <div className="modal-actions">
          <button 
            onClick={handleDeleteUser}
            aria-describedby="delete-modal-description"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : null}
            Yes, Delete
          </button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
