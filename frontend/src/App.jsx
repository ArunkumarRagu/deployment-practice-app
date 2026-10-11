import React, { useState, useEffect } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001').replace(/\/$/, '');

export default function App() {
  const [healthStatus, setHealthStatus] = useState('checking'); // 'checking' | 'healthy' | 'error'
  const [healthData, setHealthData] = useState(null);
  const [healthError, setHealthError] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check backend health
  const checkHealth = async () => {
    setHealthStatus('checking');
    setHealthError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setHealthStatus('healthy');
      setHealthData(data);
    } catch (err) {
      setHealthStatus('error');
      setHealthError(err.message || 'Failed to connect to backend');
    }
  };

  // Fetch items from mock DB
  const fetchItems = async () => {
    setLoadingItems(true);
    setItemsError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/items`);
      if (!res.ok) {
        throw new Error(`Failed to fetch items (${res.status})`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setItemsError(err.message || 'Could not load items');
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchItems();
  }, []);

  // Add new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create item (${res.status})`);
      }

      const created = await res.json();
      setItems((prev) => [...prev, created]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      alert(`Error creating item: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle item completed status
  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/items/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Toggle failed');
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      alert(`Failed to update item: ${err.message}`);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="badge">Deployment Practice App</div>
        <h1>Fullstack Deploy Playground</h1>
        <p className="subtitle">
          React Frontend &amp; Python FastAPI Backend with Mock Database
        </p>
      </header>

      {/* Backend Health Status Section */}
      <section className={`card status-card status-${healthStatus}`}>
        <div className="status-header">
          <div className="status-indicator">
            <span className={`status-dot dot-${healthStatus}`}></span>
            <div>
              <h3>Backend Status: {healthStatus === 'healthy' ? 'Connected' : healthStatus === 'checking' ? 'Connecting...' : 'Disconnected'}</h3>
              <p className="status-target">Target URL: <code>{API_BASE_URL}</code></p>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => { checkHealth(); fetchItems(); }}>
            ↻ Refresh Health
          </button>
        </div>

        {healthStatus === 'healthy' && healthData && (
          <div className="health-details">
            <div className="info-chip">
              <strong>Service:</strong> {healthData.service}
            </div>
            <div className="info-chip">
              <strong>Environment:</strong> {healthData.environment}
            </div>
            <div className="info-chip">
              <strong>Server Time:</strong> {new Date(healthData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        {healthStatus === 'error' && (
          <div className="error-box">
            <p><strong>Connection Error:</strong> {healthError}</p>
            <div className="troubleshoot">
              <p><strong>Troubleshooting:</strong></p>
              <ul>
                <li>If running locally: start backend with <code>uvicorn main:app --port 8001</code></li>
                <li>If deployed: verify <code>VITE_API_URL</code> environment variable points to your live backend</li>
                <li>Ensure backend CORS allows requests from this frontend domain</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Deployment Config Inspector */}
      <section className="card config-card">
        <h3>Deployment Configuration Info</h3>
        <div className="config-grid">
          <div className="config-item">
            <span className="config-label">VITE_API_URL:</span>
            <code className="config-value">{import.meta.env.VITE_API_URL || '(default fallback: http://localhost:8000)'}</code>
          </div>
          <div className="config-item">
            <span className="config-label">Active API Target:</span>
            <code className="config-value">{API_BASE_URL}</code>
          </div>
          <div className="config-item">
            <span className="config-label">Frontend Mode:</span>
            <code className="config-value">{import.meta.env.MODE}</code>
          </div>
        </div>
      </section>

      {/* Mock Database / Deployment Task Checklist */}
      <section className="card db-card">
        <div className="db-header">
          <div>
            <h2>Deployment Practice Checklist (Mock DB)</h2>
            <p className="db-subtitle">
              Stored in backend memory &bull; {completedCount} of {items.length} completed ({progressPercent}%)
            </p>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="add-form">
          <input
            type="text"
            placeholder="Task title (e.g. Set up SSL certificate)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="input-text"
          />
          <input
            type="text"
            placeholder="Optional description / notes..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="input-text"
          />
          <button type="submit" disabled={submitting || healthStatus !== 'healthy'} className="btn-primary">
            {submitting ? 'Adding...' : '+ Add Item'}
          </button>
        </form>

        {/* Items List */}
        {loadingItems ? (
          <div className="loading-state">Loading mock data from backend...</div>
        ) : itemsError ? (
          <div className="error-message">Could not load items: {itemsError}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No items yet. Add one above!</div>
        ) : (
          <div className="item-list">
            {items.map((item) => (
              <div key={item.id} className={`item-row ${item.completed ? 'completed' : ''}`}>
                <div className="item-left">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggle(item.id)}
                    className="item-checkbox"
                  />
                  <div>
                    <h4 className="item-title">{item.title}</h4>
                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="item-actions">
                  <span className={`tag ${item.completed ? 'tag-done' : 'tag-pending'}`}>
                    {item.completed ? 'Done' : 'Pending'}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Built for deployment practice &bull; Works seamlessly with Render, Railway, Vercel &amp; Netlify</p>
      </footer>
    </div>
  );
}
