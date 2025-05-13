import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { FaTrash } from 'react-icons/fa'; // Make sure to install react-icons: npm install react-icons

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBFVqxjHvEM5QwKfRp7AFXDzmhKlXeG2Fw",
  authDomain: "stats-project-4b331.firebaseapp.com",
  projectId: "stats-project-4b331",
  storageBucket: "stats-project-4b331.appspot.com",
  messagingSenderId: "651591422121",
  appId: "1:651591422121:web:bb2dc0e2da3499e05f59b8",
  databaseURL: "https://stats-project-4b331-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const JsonViewer = ({ data, label, level = 0, path = [] }) => {
  const [open, setOpen] = useState(false);
  const isObject = typeof data === 'object' && data !== null;

  const boxWidth = level === 0 ? 500 : level === 1 ? 350 : 250;

  const handleDelete = () => {
    const nodeRef = ref(db, path.join('/'));
    if (window.confirm(`Delete "${label}" and all of its contents?`)) {
      remove(nodeRef);
    }
  };

  return (
    <div style={{
      marginBottom: '1rem',
      width: `${boxWidth}px`,
      textAlign: 'center',
      boxSizing: 'border-box',
    }}>
      {isObject ? (
        <div
          style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            textAlign: 'left',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          <div
            onClick={() => setOpen(!open)}
            style={{
              cursor: 'pointer',
              fontWeight: 600,
              color: '#333',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{open ? '▼' : '▶'} {label ?? 'root'}</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
              }}
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
          {open && (
            <div style={{ paddingLeft: '1rem' }}>
              {Object.entries(data).map(([key, value]) => (
                <JsonViewer
                  key={key}
                  data={value}
                  label={key}
                  level={level + 1}
                  path={[...path, key]}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.4rem',
            fontSize: '0.95rem',
            color: '#555',
            width: `${boxWidth}px`,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span><strong>{label}:</strong> {String(data)}</span>
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
            }}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dbRef = ref(db);
    onValue(dbRef, (snapshot) => {
      setData(snapshot.val());
    });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("JSON copied to clipboard!");
  };

  if (!data || Object.keys(data).length !== 2) {
    return (
      <main style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'sans-serif' }}>
        <p>Waiting for exactly two root objects...</p>
      </main>
    );
  }

  const [leftKey, rightKey] = Object.keys(data);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'start',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center' }}>
          Firebase Data Viewer
        </h1>

        <button
          onClick={copyToClipboard}
          style={{
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '2rem',
          }}
        >
          Copy JSON to Clipboard
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <JsonViewer data={data[leftKey]} label={leftKey} path={[leftKey]} />
          <JsonViewer data={data[rightKey]} label={rightKey} path={[rightKey]} />
        </div>
      </div>
    </div>
  );
};

export default App;
