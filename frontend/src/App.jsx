import { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout, onAuth, initAnalytics } from "./firebase";
import { api } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);

  // Check server health
  const checkServerHealth = async () => {
    try {
      const health = await api.health();
      setServerHealth(health);
    } catch (err) {
      console.error("Server health check failed:", err);
      setServerHealth({ status: "error", message: err.message });
    }
  };

  // Fetch user data from backend
  const fetchUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setServerData(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getMe();
      setServerData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAnalytics();
    checkServerHealth();
    
    const off = onAuth((firebaseUser) => {
      setUser(firebaseUser);
      fetchUserData(firebaseUser);
    });
    return () => off();
  }, []);

  const handleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      setServerData(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Football Game Auth Integration</h1>
      
      {/* Server Status */}
      <div style={{ 
        background: serverHealth?.status === 'ok' ? '#e8f5e8' : '#fee', 
        padding: 10, 
        marginBottom: 20, 
        borderRadius: 4,
        border: `1px solid ${serverHealth?.status === 'ok' ? '#8bc34a' : '#fcc'}`
      }}>
        <strong>Backend Status:</strong> {
          serverHealth?.status === 'ok' 
            ? '🟢 Connected' 
            : serverHealth?.status === 'error' 
              ? '🔴 Error: ' + serverHealth.message 
              : '🟡 Checking...'
        }
        {serverHealth?.timestamp && (
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            Last check: {new Date(serverHealth.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          background: '#fee', 
          padding: 10, 
          marginBottom: 20, 
          borderRadius: 4,
          border: '1px solid #fcc'
        }}>
          Error: {error}
        </div>
      )}

      {user ? (
        <div>
          <h2>✅ Authenticated</h2>
          <div style={{ background: '#f0f0f0', padding: 15, borderRadius: 4, marginBottom: 20 }}>
            <h3>Firebase User Info:</h3>
            <p><strong>UID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Display Name:</strong> {user.displayName}</p>
            {user.photoURL && (
              <div>
                <strong>Photo:</strong>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    marginLeft: 10,
                    verticalAlign: 'middle'
                  }} 
                />
              </div>
            )}
          </div>

          {loading && (
            <div style={{ color: 'blue', marginBottom: 10 }}>
              🔄 Loading server data...
            </div>
          )}

          {serverData && (
            <div style={{ background: '#e8f5e8', padding: 15, borderRadius: 4, marginBottom: 20 }}>
              <h3>Backend Integration:</h3>
              <p><strong>Server confirmed UID:</strong> {serverData.uid}</p>
              <p><strong>Database User Created:</strong> {serverData.dbUser ? '✅ Yes' : '❌ No'}</p>
              {serverData.dbUser && (
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  <p>Created: {new Date(serverData.dbUser.createdAt).toLocaleString()}</p>
                  <p>Last Login: {new Date(serverData.dbUser.lastLoginAt).toLocaleString()}</p>
                </div>
              )}
              <p>✅ Full-stack authentication working!</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Sign out
            </button>
            
            <button 
              onClick={() => fetchUserData(user)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>🔐 Please sign in</h2>
          <p>Sign in to access the football game features</p>
          <button 
            onClick={handleLogin}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
