import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';


function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={token && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={token && user?.role === 'user' ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
