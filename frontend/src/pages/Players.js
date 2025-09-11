import React, { useState, useEffect } from 'react';
import { getPlayers } from '../services/api';
import Header from '../components/layout/Header';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: '',
    team: '',
    minAge: '',
    maxAge: ''
  });
  
  // Extract unique positions and teams for dropdowns
  const positions = [...new Set(players.map(player => player.position).filter(Boolean))].sort();
  const teams = [...new Set(players.map(player => player.team).filter(Boolean))].sort();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await getPlayers();
        setPlayers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load players. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (player.position && player.position.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Position filter
    const matchesPosition = !filters.position || player.position === filters.position;
    
    // Team filter
    const matchesTeam = !filters.team || player.team === filters.team;
    
    // Age filter
    const currentYear = new Date().getFullYear();
    const playerAge = player.birth_date 
      ? currentYear - new Date(player.birth_date).getFullYear() 
      : null;
      
    const matchesMinAge = !filters.minAge || (playerAge && playerAge >= parseInt(filters.minAge));
    const matchesMaxAge = !filters.maxAge || (playerAge && playerAge <= parseInt(filters.maxAge));
    
    return matchesSearch && matchesPosition && matchesTeam && matchesMinAge && matchesMaxAge;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Players</h1>
            <p className="mt-1 text-sm text-gray-500">Browse through all players.</p>
            
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative rounded-md shadow-sm max-w-md mb-4">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
                  placeholder="Search players by name, team, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Position Filter */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                  <select
                    id="position"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.position}
                    onChange={(e) => setFilters({...filters, position: e.target.value})}
                  >
                    <option value="">All Positions</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                
                {/* Team Filter */}
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team</label>
                  <select
                    id="team"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.team}
                    onChange={(e) => setFilters({...filters, team: e.target.value})}
                  >
                    <option value="">All Teams</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
                
                {/* Age Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">Min Age</label>
                    <input
                      type="number"
                      id="minAge"
                      min="16"
                      max="50"
                      className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">Max Age</label>
                    <input
                      type="number"
                      id="maxAge"
                      min="16"
                      max="50"
                      className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-10"
                    onClick={() => {
                      setFilters({
                        position: '',
                        team: '',
                        minAge: '',
                        maxAge: ''
                      });
                      setSearchTerm('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredPlayers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <li key={player.id} className="hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {player.photo && (
                            <img
                              className="h-12 w-12 rounded-full"
                              src={player.photo}
                              alt={player.name}
                            />
                          )}
                          <div className="ml-4">
                            <a 
                              href={`/players/${player.id}`}
                              className="text-lg leading-6 font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/players/${player.id}`;
                              }}
                            >
                              {player.name}
                            </a>
                            <p className="mt-1 text-sm text-gray-500">
                              {player.team} • {player.position}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-900">
                            {player.nationality || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {player.jerseyNumber ? `#${player.jerseyNumber}` : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center text-gray-500">
                No players found matching your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Players;
