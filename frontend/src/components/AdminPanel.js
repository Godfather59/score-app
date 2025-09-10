import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Matches from './Matches';
import Players from './Players';
import Teams from './Teams';
import Referees from './Referees';
import Users from './Users';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'matches', label: 'Matches' },
    { id: 'players', label: 'Players' },
    { id: 'teams', label: 'Teams' },
    { id: 'referees', label: 'Referees' },
    { id: 'users', label: 'Users' },
  ];

  const visibleTabs = tabs.filter(tab => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'editor') return ['matches', 'players', 'teams'].includes(tab.id);
    return false; // user can only view
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'matches':
        return <Matches user={user} />;
      case 'players':
        return <Players user={user} />;
      case 'teams':
        return <Teams user={user} />;
      case 'referees':
        return <Referees user={user} />;
      case 'users':
        return <Users user={user} />;
      default:
        return <Matches user={user} />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-4">Admin Panel</h2>
        <ul>
          {visibleTabs.map(tab => (
            <li key={tab.id} className="mb-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-2 rounded ${activeTab === tab.id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="mt-4 w-full bg-red-500 p-2 rounded">Logout</button>
      </div>
      <div className="flex-1 p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
