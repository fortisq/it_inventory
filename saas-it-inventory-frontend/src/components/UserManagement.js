import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './UserManagement.css';

Modal.setAppElement('#root');

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    firstName: '', 
    lastName: '', 
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmUpdateModalOpen, setIsConfirmUpdateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'tenantadmin')) {
      fetchUsers();
    } else {
      setIsLoading(false);
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const filtered = users.filter(user => {
      if (!user) return false;
      const searchTermLower = searchTerm.toLowerCase();
      const includesSearchTerm = (field) => (field || '').toLowerCase().includes(searchTermLower);
      
      try {
        return (
          includesSearchTerm(user.username) ||
          includesSearchTerm(user.email) ||
          includesSearchTerm(user.firstName) ||
          includesSearchTerm(user.lastName)
        );
      } catch (error) {
        console.error('Error filtering user:', error, user);
        return false;
      }
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/users');
      console.log('Fetched users:', response.data);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setUserToEdit({ ...userToEdit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = '/api/users';
      const response = await api.post(endpoint, newUser);
      console.log('User created:', response.data);
      setSuccess(`User created successfully. ${newUser.role === 'tenantadmin' ? 'A new tenant has been created for this user.' : 'The user has been assigned to the appropriate tenant.'}`);
      setNewUser({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        firstName: '', 
        lastName: '', 
        role: 'user'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (userToDelete) => {
    setUserToDelete(userToDelete);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (userToEdit) => {
    setUserToEdit(userToEdit);
    setChangePassword(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setUserToEdit(null);
    setChangePassword(false);
    setIsEditModalOpen(false);
  };

  const openConfirmUpdateModal = (e) => {
    e.preventDefault();
    setIsConfirmUpdateModalOpen(true);
  };

  const closeConfirmUpdateModal = () => {
    setIsConfirmUpdateModalOpen(false);
  };

  const handleDeleteUser = async () => {
    console.log('handleDeleteUser called, userToDelete:', userToDelete);
    if (!userToDelete) {
      console.error('No user selected for deletion');
      setError('No user selected for deletion');
      closeDeleteModal();
      return;
    }

    if (!userToDelete._id) {
      console.error('User ID is missing', JSON.stringify(userToDelete));
      setError('User ID is missing. Cannot delete user.');
      closeDeleteModal();
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to delete user:', JSON.stringify(userToDelete));
      const response = await api.delete(`/api/users/${userToDelete._id}`);
      console.log('Delete user response:', response);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
      closeDeleteModal();
    }
  };

  const handleEditUser = async () => {
    if (userToEdit) {
      setIsLoading(true);
      try {
        const dataToUpdate = { ...userToEdit };
        if (!changePassword) {
          delete dataToUpdate.password;
          delete dataToUpdate.confirmPassword;
        } else if (dataToUpdate.password !== dataToUpdate.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await api.put(`/api/users/${userToEdit._id}`, dataToUpdate);
        setSuccess('User updated successfully');
        fetchUsers();
        closeEditModal();
        closeConfirmUpdateModal();
      } catch (error) {
        console.error('Error updating user:', error);
        setError(error.response?.data?.message || error.message || 'Failed to update user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'tenantadmin')) {
    return <div className="access-denied">Access Denied. You must be an admin or tenant admin to view this page.</div>;
  }

  if (isLoading) {
    return <div className="loading" aria-live="polite">Loading user data...</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <div className="error" role="alert">{error}</div>}
      {success && <div className="success" role="status">{success}</div>}
      <div className="user-management-content">
        <form onSubmit={handleSubmit} className="user-form">
          <h3>Add New User</h3>
          <p className="note">Note: Tenant assignment is automatic based on the user's role and the creator's permissions.</p>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            required
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            required
          >
            <option value="user">Regular User</option>
            <option value="tenantadmin">Tenant Admin (Creates New Tenant)</option>
            {(user.role === 'admin' || user.role === 'superadmin') && <option value="admin">Admin</option>}
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : null}
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
        <div className="user-list">
          <h3>Current Users</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search users"
          />
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('username')} aria-sort={sortField === 'username' ? sortDirection : 'none'}>
                  Username {sortField === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('email')} aria-sort={sortField === 'email' ? sortDirection : 'none'}>
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('role')} aria-sort={sortField === 'role' ? sortDirection : 'none'}>
                  Role {sortField === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(userItem => (
                <tr key={userItem._id}>
                  <td>{userItem.username || 'N/A'}</td>
                  <td>{userItem.email || 'N/A'}</td>
                  <td>{userItem.role || 'N/A'}</td>
                  <td>
                    <button onClick={() => openEditModal(userItem)} className="edit-button">
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(userItem)} 
                      disabled={userItem._id === user._id || (user.role !== 'superadmin' && userItem.role === 'admin')}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: Math.ceil(sortedUsers.length / usersPerPage) }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
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
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit User"
        className="edit-modal"
        overlayClassName="edit-modal-overlay"
      >
        <h2 id="edit-modal-title">Edit User</h2>
        <form onSubmit={openConfirmUpdateModal}>
          <input
            type="text"
            name="username"
            value={userToEdit?.username || ''}
            onChange={handleEditInputChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={userToEdit?.email || ''}
            onChange={handleEditInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="firstName"
            value={userToEdit?.firstName || ''}
            onChange={handleEditInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={userToEdit?.lastName || ''}
            onChange={handleEditInputChange}
            placeholder="Last Name"
            required
          />
          <select
            name="role"
            value={userToEdit?.role || ''}
            onChange={handleEditInputChange}
            required
          >
            <option value="user">Regular User</option>
            <option value="tenantadmin">Tenant Admin</option>
            {(user.role === 'admin' || user.role === 'superadmin') && <option value="admin">Admin</option>}
          </select>
          <div className="change-password-section">
            <label>
              <input
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
              />
              Change Password
            </label>
          </div>
          {changePassword && (
            <>
              <input
                type="password"
                name="password"
                value={userToEdit?.password || ''}
                onChange={handleEditInputChange}
                placeholder="New Password"
                required={changePassword}
              />
              <input
                type="password"
                name="confirmPassword"
                value={userToEdit?.confirmPassword || ''}
                onChange={handleEditInputChange}
                placeholder="Confirm New Password"
                required={changePassword}
              />
            </>
          )}
          <div className="modal-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : null}
              Save Changes
            </button>
            <button type="button" onClick={closeEditModal}>Cancel</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isConfirmUpdateModalOpen}
        onRequestClose={closeConfirmUpdateModal}
        contentLabel="Confirm Update User"
        className="confirm-update-modal"
        overlayClassName="confirm-update-modal-overlay"
      >
        <h2 id="confirm-update-modal-title">Confirm Update</h2>
        <p id="confirm-update-modal-description">Are you sure you want to update this user's information?</p>
        <div className="modal-actions">
          <button 
            onClick={handleEditUser}
            aria-describedby="confirm-update-modal-description"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : null}
            Yes, Update
          </button>
          <button onClick={closeConfirmUpdateModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
