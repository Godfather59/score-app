import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Players = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', team_id: '', position: '', goals: 0 });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams', { headers });
      setTeams(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/players', { headers });
      setPlayers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, team_id: parseInt(form.team_id), goals: parseInt(form.goals) };
      if (editing) {
        await axios.put(`http://localhost:5000/api/players/${editing}`, data, { headers });
      } else {
        await axios.post('http://localhost:5000/api/players', data, { headers });
      }
      fetchPlayers();
      setForm({ name: '', team_id: '', position: '', goals: 0 });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (player) => {
    setForm(player);
    setEditing(player.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/players/${id}`, { headers });
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div>
      <h1 className="text-2xl mb-4">Players</h1>
      {canEdit && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })} required>
            <option value="">Select team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required>
            <option value="">Select position</option>
            <option value="RB">RB</option>
            <option value="DC">DC</option>
            <option value="LB">LB</option>
            <option value="CM">CM</option>
            <option value="CDM">CDM</option>
            <option value="CAM">CAM</option>
            <option value="RM">RM</option>
            <option value="LM">LM</option>
            <option value="RW">RW</option>
            <option value="LW">LW</option>
            <option value="ST">ST</option>
          </select>
          <input type="number" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}
      <ul>
        {players.map(player => (
          <li key={player.id} className="mb-2">
            {player.name} - {player.position} - Goals: {player.goals}
            {canEdit && (
              <>
                <button onClick={() => handleEdit(player)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(player.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
