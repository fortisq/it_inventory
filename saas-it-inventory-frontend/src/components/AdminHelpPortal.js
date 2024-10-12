import React, { useState, useEffect } from 'react';
import { getHelpDocuments, getHelpRequests, updateHelpDocument, updateHelpRequest, createHelpDocument, deleteHelpDocument } from '../services/api';
import './AdminHelpPortal.css';

const AdminHelpPortal = () => {
  const [documents, setDocuments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newDocument, setNewDocument] = useState({ title: '', content: '', category: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [docsResponse, reqsResponse] = await Promise.all([
        getHelpDocuments(),
        getHelpRequests()
      ]);
      setDocuments(docsResponse.data);
      setRequests(reqsResponse.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setSelectedRequest(null);
  };

  const handleRequestSelect = (req) => {
    setSelectedRequest(req);
    setSelectedDocument(null);
  };

  const handleDocumentUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateHelpDocument(selectedDocument._id, selectedDocument);
      fetchData();
      setError('');
    } catch (err) {
      setError('Error updating document. Please try again.');
      console.error('Error updating document:', err);
    }
  };

  const handleRequestUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateHelpRequest(selectedRequest._id, selectedRequest);
      fetchData();
      setError('');
    } catch (err) {
      setError('Error updating request. Please try again.');
      console.error('Error updating request:', err);
    }
  };

  const handleNewDocumentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHelpDocument(newDocument);
      setNewDocument({ title: '', content: '', category: '' });
      fetchData();
      setError('');
    } catch (err) {
      setError('Error creating document. Please try again.');
      console.error('Error creating document:', err);
    }
  };

  const handleDocumentDelete = async (id) => {
    try {
      await deleteHelpDocument(id);
      fetchData();
      setSelectedDocument(null);
      setError('');
    } catch (err) {
      setError('Error deleting document. Please try again.');
      console.error('Error deleting document:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-help-portal">
      <h2>Admin Help Portal</h2>
      {error && <div className="error">{error}</div>}
      <div className="admin-help-content">
        <div className="help-list">
          <h3>Help Documents</h3>
          <ul>
            {documents.map(doc => (
              <li key={doc._id} onClick={() => handleDocumentSelect(doc)}>
                {doc.title}
              </li>
            ))}
          </ul>
          <h3>Help Requests</h3>
          <ul>
            {requests.map(req => (
              <li key={req._id} onClick={() => handleRequestSelect(req)}>
                {req.subject} - {req.status}
              </li>
            ))}
          </ul>
        </div>
        <div className="help-detail">
          {selectedDocument && (
            <form onSubmit={handleDocumentUpdate}>
              <h3>Edit Document</h3>
              <input
                type="text"
                value={selectedDocument.title}
                onChange={(e) => setSelectedDocument({...selectedDocument, title: e.target.value})}
              />
              <textarea
                value={selectedDocument.content}
                onChange={(e) => setSelectedDocument({...selectedDocument, content: e.target.value})}
              />
              <input
                type="text"
                value={selectedDocument.category}
                onChange={(e) => setSelectedDocument({...selectedDocument, category: e.target.value})}
              />
              <button type="submit">Update Document</button>
              <button type="button" onClick={() => handleDocumentDelete(selectedDocument._id)}>Delete Document</button>
            </form>
          )}
          {selectedRequest && (
            <form onSubmit={handleRequestUpdate}>
              <h3>Edit Request</h3>
              <input
                type="text"
                value={selectedRequest.subject}
                onChange={(e) => setSelectedRequest({...selectedRequest, subject: e.target.value})}
                readOnly
              />
              <textarea
                value={selectedRequest.description}
                onChange={(e) => setSelectedRequest({...selectedRequest, description: e.target.value})}
                readOnly
              />
              <select
                value={selectedRequest.status}
                onChange={(e) => setSelectedRequest({...selectedRequest, status: e.target.value})}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button type="submit">Update Request</button>
            </form>
          )}
          {!selectedDocument && !selectedRequest && (
            <form onSubmit={handleNewDocumentSubmit}>
              <h3>Create New Document</h3>
              <input
                type="text"
                placeholder="Title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
              />
              <textarea
                placeholder="Content"
                value={newDocument.content}
                onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
              />
              <input
                type="text"
                placeholder="Category"
                value={newDocument.category}
                onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
              />
              <button type="submit">Create Document</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelpPortal;
