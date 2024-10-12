import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHelpDocuments, submitHelpRequest, getUpdates } from '../services/api';
import './HelpSupportPortal.css';

const HelpSupportPortal = () => {
  const [helpDocuments, setHelpDocuments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [helpRequest, setHelpRequest] = useState({ subject: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHelpDocuments();
    fetchUpdates();
  }, []);

  const fetchHelpDocuments = async () => {
    try {
      const documents = await getHelpDocuments();
      setHelpDocuments(documents);
    } catch (err) {
      setError('Failed to fetch help documents. Please try again later.');
      console.error('Error fetching help documents:', err);
    }
  };

  const fetchUpdates = async () => {
    try {
      const latestUpdates = await getUpdates();
      setUpdates(latestUpdates);
    } catch (err) {
      setError('Failed to fetch updates. Please try again later.');
      console.error('Error fetching updates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHelpRequest({ ...helpRequest, [name]: value });
  };

  const handleSubmitHelpRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitHelpRequest(helpRequest);
      setSuccess('Help request submitted successfully. We will get back to you soon.');
      setHelpRequest({ subject: '', description: '' });
    } catch (err) {
      setError('Failed to submit help request. Please try again.');
      console.error('Error submitting help request:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="help-support-portal">
      <h2>Help and Support Portal</h2>
      {error && <div className="error" role="alert">{error}</div>}
      {success && <div className="success" role="status">{success}</div>}
      
      <section className="help-documents">
        <h3>Help Documents</h3>
        {helpDocuments.length > 0 ? (
          <ul>
            {helpDocuments.map((doc) => (
              <li key={doc.id}>
                <Link to={`/help/document/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No help documents available.</p>
        )}
      </section>

      <section className="updates">
        <h3>Latest Updates</h3>
        {updates.length > 0 ? (
          <ul>
            {updates.map((update) => (
              <li key={update.id}>
                <strong>{update.date}</strong>: {update.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No updates available.</p>
        )}
      </section>

      <section className="help-request-form">
        <h3>Submit a Help Request</h3>
        <form onSubmit={handleSubmitHelpRequest}>
          <div>
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={helpRequest.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={helpRequest.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Help Request'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default HelpSupportPortal;
