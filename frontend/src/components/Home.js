import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const footballLeagues = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Champions League',
  'Europa League',
];

const Home = ({ user }) => {
  const [stats, setStats] = useState({ matches: 0 });
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('All'); // All, Favourites, Competitions
  const [matchStatusFilter, setMatchStatusFilter] = useState('live'); // live, finished, upcoming
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStats();
    fetchMatches();
    fetchTeams();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [matches, activeTab, matchStatusFilter, selectedDate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches', { headers });
      const footballMatches = response.data.filter(m => footballLeagues.includes(m.league));
      setStats({ matches: footballMatches.length });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches', { headers });
      const footballMatches = response.data.filter(m => footballLeagues.includes(m.league));
      setMatches(footballMatches);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams', { headers });
      setTeams(response.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const filterMatches = () => {
    let filtered = matches;

    // Filter by tab
    if (activeTab === 'Favourites') {
      // For now, no favourites logic, so empty list
      filtered = [];
    } else if (activeTab === 'Competitions') {
      // For now, show all football matches grouped by league
      // We'll just keep all matches here
    }

    // Filter by match status
    if (matchStatusFilter === 'live') {
      filtered = filtered.filter(m => m.status === 'live' || m.status === 'in_progress');
    } else if (matchStatusFilter === 'finished') {
      filtered = filtered.filter(m => m.status === 'completed');
    } else if (matchStatusFilter === 'upcoming') {
      filtered = filtered.filter(m => {
        const matchDate = new Date(m.date);
        return matchDate >= new Date(selectedDate) && (m.status === 'upcoming' || m.status === 'scheduled');
      });
    }

    // Filter by selected date only for specific tabs
    if (activeTab !== 'All' && activeTab !== 'Competitions') {
      filtered = filtered.filter(m => m.date === selectedDate);
    }

    // Separate live, upcoming, recent for display
    setLiveMatches(filtered.filter(m => m.status === 'live' || m.status === 'in_progress'));
    setUpcomingMatches(filtered.filter(m => m.status === 'upcoming' || m.status === 'scheduled'));
    setRecentMatches(filtered.filter(m => m.status === 'completed'));

    setFilteredMatches(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TabButton = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-4 py-2 font-semibold rounded-t-md ${
        activeTab === label ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const StatusToggle = ({ label, value }) => (
    <button
      onClick={() => setMatchStatusFilter(value)}
      className={`px-3 py-1 rounded-full text-sm font-medium mr-2 ${
        matchStatusFilter === value ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const MatchItem = ({ match }) => (
    <div className="flex justify-between items-center border-b border-gray-700 py-2 px-3 hover:bg-gray-800 cursor-pointer rounded">
      <div className="flex items-center space-x-3">
        <span>{match.home_team_name}</span>
      </div>
      <div className="text-center text-sm text-gray-300">
        {formatTime(match.time)}<br />
        <span className="text-xs">{match.date}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span>{match.away_team_name}</span>
      </div>
    </div>
  );

  const FeaturedMatch = () => {
    if (liveMatches.length === 0) return null;
    const match = liveMatches[0];
    return (
      <div className="bg-gray-900 rounded-lg p-4 shadow-lg text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span>{match.home_team_name}</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{formatTime(match.time)}</div>
            <div className="text-xs">{match.date}</div>
          </div>
          <div className="flex items-center space-x-2">
            <span>{match.away_team_name}</span>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400">Live Now</div>
      </div>
    );
  };

  const Rankings = () => {
    // Group teams by league
    const teamsByLeague = teams.reduce((acc, team) => {
      if (!acc[team.league]) acc[team.league] = [];
      acc[team.league].push(team);
      return acc;
    }, {});

    // Sort teams alphabetically by name within each league
    Object.keys(teamsByLeague).forEach(league => {
      teamsByLeague[league].sort((a, b) => a.name.localeCompare(b.name));
    });

    return (
      <div className="bg-gray-900 rounded-lg p-4 shadow-lg text-white mt-6 max-h-[400px] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Rankings by League</h3>
        {Object.keys(teamsByLeague).map(league => (
          <div key={league} className="mb-4">
            <h4 className="font-bold text-xl mb-2">{league}</h4>
            <ol className="list-decimal list-inside space-y-1">
              {teamsByLeague[league].map((team, index) => (
                <li key={team.id} className="text-gray-300">
                  {team.name}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl font-bold">Sofascore</div>
          <div className="flex space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-800">
              <span>⚽ Football</span>
              <span className="ml-1 bg-gray-700 rounded px-2 py-0.5 text-xs">330</span>
            </button>
            {/* Removed Tennis and Basketball buttons as per user request */}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <TabButton label="All" />
        <TabButton label="Favourites" />
        <TabButton label="Competitions" />
      </div>

      {/* Date selector and status toggles */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-gray-800 text-white rounded px-3 py-1"
        />
        <div>
          <StatusToggle label="Live" value="live" />
          <StatusToggle label="Finished" value="finished" />
          <StatusToggle label="Upcoming" value="upcoming" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Matches list */}
        <div className="col-span-2 bg-gray-800 rounded-lg p-4 overflow-y-auto max-h-[600px]">
          {filteredMatches.length === 0 ? (
            <div className="text-gray-400 text-center py-20">No matches found.</div>
          ) : (
            filteredMatches.map(match => <MatchItem key={match.id} match={match} />)
          )}
        </div>

        {/* Right: Featured match and rankings */}
        <div className="space-y-6">
          <FeaturedMatch />
          <Rankings />
        </div>
      </div>
    </div>
  );
};

export default Home;
