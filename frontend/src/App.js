import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Pages
import Home from './pages/Home';
import TestLogin from './pages/TestLogin';
import Register from './pages/Register';
import AdminPanel from './components/AdminPanel';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import Players from './pages/Players';
import TeamDetail from './components/teams/TeamDetail';
import PlayerDetail from './components/players/PlayerDetail';
import MatchDetail from './components/matches/MatchDetail';
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
            {/* Authentication Routes */}
            <Route path="/login" element={!token ? <TestLogin /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={token ? <Home /> : <Navigate to="/login" />}
            />
            <Route path="/matches">
              <Route index element={token ? <Matches /> : <Navigate to="/login" />} />
              <Route path=":id" element={token ? <MatchDetail /> : <Navigate to="/login" />} />
            </Route>
            <Route path="/teams">
              <Route index element={token ? <Teams /> : <Navigate to="/login" />} />
              <Route path=":id" element={token ? <TeamDetail /> : <Navigate to="/login" />} />
            </Route>
            <Route path="/players">
              <Route index element={token ? <Players /> : <Navigate to="/login" />} />
              <Route path=":id" element={token ? <PlayerDetail /> : <Navigate to="/login" />} />
            </Route>
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
