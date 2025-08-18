import { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout, onAuth, initAnalytics } from "./firebase";

export default function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    initAnalytics();                  // safe to call; no-op if unsupported
    const off = onAuth(u => setUid(u ? u.uid : null));
    return () => off();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Firebase Auth sanity check</h1>
      {uid ? (
        <>
          <p>Signed in as: {uid}</p>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <button onClick={loginWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}
