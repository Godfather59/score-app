import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Matches = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ home_team_id: '', away_team_id: '', date: '', time: '', league: '', status: '', home_score: 0, away_score: 0 });
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  
  const headers = React.useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams', { headers });
      setTeams(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [headers]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches', { headers });
      setMatches(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [headers]);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, [fetchMatches, fetchTeams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, home_team_id: parseInt(form.home_team_id), away_team_id: parseInt(form.away_team_id), home_score: parseInt(form.home_score), away_score: parseInt(form.away_score) };
      if (editing) {
        await axios.put(`http://localhost:5000/api/matches/${editing}`, data, { headers });
      } else {
        await axios.post('http://localhost:5000/api/matches', data, { headers });
      }
      fetchMatches();
      setForm({ home_team_id: '', away_team_id: '', date: '', time: '', league: '', status: '', home_score: 0, away_score: 0 });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (match) => {
    setForm(match);
    setEditing(match.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/matches/${id}`, { headers });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  return (
    <div>
      <h1 className="text-2xl mb-4">Matches</h1>
      {user?.role === 'admin' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Matches:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Matches</option>
            <option value="live">Live Matches</option>
            <option value="upcoming">Upcoming Matches</option>
            <option value="completed">Completed Matches</option>
          </select>
        </div>
      )}
      {canEdit && (
        <form onSubmit={handleSubmit} className="mb-4">
          <select value={form.home_team_id} onChange={(e) => setForm({ ...form, home_team_id: e.target.value })} required>
            <option value="">Select home team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select value={form.away_team_id} onChange={(e) => setForm({ ...form, away_team_id: e.target.value })} required>
            <option value="">Select away team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required={form.status !== 'live'} disabled={editing && form.status === 'live'} />
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required={form.status !== 'live'} disabled={editing && form.status === 'live'} />
          <select value={form.league} onChange={(e) => setForm({ ...form, league: e.target.value })} required>
            <option value="">Select League</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Serie A">Serie A</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="Ligue 1">Ligue 1</option>
            <option value="Champions League">Champions League</option>
            <option value="Europa League">Europa League</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
            <option value="">Select Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <input type="number" placeholder="Home Score" value={form.home_score} onChange={(e) => setForm({ ...form, home_score: e.target.value })} />
          <input type="number" placeholder="Away Score" value={form.away_score} onChange={(e) => setForm({ ...form, away_score: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}
      <ul>
            {filteredMatches.map(match => {
              const homeTeam = teams.find(team => team.id === match.home_team_id);
              const awayTeam = teams.find(team => team.id === match.away_team_id);
              return (
                <li key={match.id} className="mb-2">
                  {homeTeam ? homeTeam.name : match.home_team_id} vs {awayTeam ? awayTeam.name : match.away_team_id} - {match.date} {match.time} - {match.home_score}:{match.away_score}
                  {canEdit && (
                    <>
                      <button onClick={() => handleEdit(match)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(match.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
                    </>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default Matches;
