import React, { useEffect, useState } from 'react';

const AuthStatus = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    token: null,
    user: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setAuthStatus({
      isAuthenticated: !!token,
      token: token,
      user: user ? JSON.parse(user) : null
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="font-bold text-sm mb-2">Authentication Status</h3>
      <div className="text-xs space-y-1">
        <p><span className="font-medium">Status:</span> {authStatus.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
        {authStatus.user && (
          <p><span className="font-medium">User:</span> {authStatus.user.username} ({authStatus.user.role})</p>
        )}
        {authStatus.token && (
          <p className="truncate max-w-xs" title={authStatus.token}>
            <span className="font-medium">Token:</span> {authStatus.token.substring(0, 10)}...
          </p>
        )}
        {authStatus.isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <a 
            href="/login" 
            className="mt-2 inline-block text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
};

export default AuthStatus;
