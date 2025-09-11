import React, { useState, useEffect } from 'react';
import { getTeams } from '../services/api';
import Header from '../components/layout/Header';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    league: '',
    country: ''
  });
  
  // Extract unique leagues and countries for dropdowns
  const leagues = [...new Set(teams.map(team => team.league).filter(Boolean))].sort();
  const countries = [...new Set(teams.map(team => team.country).filter(Boolean))].sort();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await getTeams();
        setTeams(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

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

  const filteredTeams = teams.filter(team => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.league && team.league.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.country && team.country.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // League filter
    const matchesLeague = !filters.league || team.league === filters.league;
    
    // Country filter
    const matchesCountry = !filters.country || team.country === filters.country;
    
    return matchesSearch && matchesLeague && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
            <p className="mt-1 text-sm text-gray-500">Browse through all teams.</p>
            
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative rounded-md shadow-sm max-w-md mb-4">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
                  placeholder="Search teams by name, league, or country..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* League Filter */}
                <div>
                  <label htmlFor="league" className="block text-sm font-medium text-gray-700">League</label>
                  <select
                    id="league"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.league}
                    onChange={(e) => setFilters({...filters, league: e.target.value})}
                  >
                    <option value="">All Leagues</option>
                    {leagues.map((league) => (
                      <option key={league} value={league}>{league}</option>
                    ))}
                  </select>
                </div>
                
                {/* Country Filter */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    id="country"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.country}
                    onChange={(e) => setFilters({...filters, country: e.target.value})}
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-10"
                    onClick={() => {
                      setFilters({
                        league: '',
                        country: ''
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
              <div key={team.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    {team.logo && (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={team.logo}
                        alt={`${team.name} logo`}
                      />
                    )}
                    <div className="ml-4">
                      <a 
                        href={`/teams/${team.id}`}
                        className="text-lg leading-6 font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/teams/${team.id}`;
                        }}
                      >
                        {team.name}
                      </a>
                      <p className="mt-1 text-sm text-gray-500">{team.country}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Founded: {team.founded || 'N/A'}</span>
                      <span>Stadium: {team.stadium || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No teams found matching your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teams;
