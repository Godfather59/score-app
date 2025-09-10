import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTeams, searchPlayers } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ teams: [], players: [] });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 2) {
        Promise.all([
          searchTeams(query),
          searchPlayers(query)
        ]).then(([teamsData, playersData]) => {
          setResults({
            teams: teamsData || [],
            players: playersData || []
          });
          setIsOpen(true);
        });
      } else {
        setResults({ teams: [], players: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = (type, id) => {
    navigate(`/${type}/${id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative ml-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search teams and players..."
          className="w-64 px-4 py-2 pl-10 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {isOpen && (results.teams.length > 0 || results.players.length > 0) && (
        <div className="absolute z-10 w-64 mt-2 bg-white rounded-md shadow-lg">
          <div className="py-1">
            {results.teams.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Teams
              </div>
            )}
            {results.teams.map((team) => (
              <div
                key={`team-${team.id}`}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => handleResultClick('teams', team.id)}
              >
                {team.name}
              </div>
            ))}
            
            {results.players.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-100">
                Players
              </div>
            )}
            {results.players.map((player) => (
              <div
                key={`player-${player.id}`}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => handleResultClick('players', player.id)}
              >
                {player.name}
                {player.team_name && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({player.team_name})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
