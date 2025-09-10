import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Pages
import Home from './pages/Home';
import TestLogin from './pages/TestLogin';
import AdminPanel from './components/AdminPanel';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import Players from './pages/Players';
import AuthStatus from './components/AuthStatus';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const token = localStorage.getItem('token');
  // user is not currently used, but might be needed later
  // const user = JSON.parse(localStorage.getItem('user'));

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthStatus />
        <div className="App">
          <Routes>
            <Route path="/login" element={!token ? <TestLogin /> : <Navigate to="/" />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={token ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/test-login"
              element={<TestLogin />}
            />
            <Route
              path="/matches/*"
              element={token ? <Matches /> : <Navigate to="/login" />}
            />
            <Route
              path="/teams"
              element={token ? <Teams /> : <Navigate to="/login" />}
            />
            <Route
              path="/players"
              element={token ? <Players /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                token && JSON.parse(localStorage.getItem('user'))?.role === 'admin' 
                  ? <AdminPanel /> 
                  : <Navigate to="/" />
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
