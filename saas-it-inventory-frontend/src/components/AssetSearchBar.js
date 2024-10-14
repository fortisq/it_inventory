import React, { useState, useCallback } from 'react';
import './AssetSearchBar.css';

const AssetSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  const handleSearch = useCallback(() => {
    onSearch(searchTerm, searchType);
  }, [onSearch, searchTerm, searchType]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="asset-search-bar">
      <input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        className="asset-search-input"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="asset-search-type"
      >
        <option value="name">Name</option>
        <option value="type">Type</option>
        <option value="serialNumber">Serial Number</option>
        <option value="location">Location</option>
        <option value="assignedTo">Assigned To</option>
        <option value="status">Status</option>
      </select>
      <button onClick={handleSearch} className="asset-search-button">Search</button>
    </div>
  );
};

export default AssetSearchBar;
