import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teams = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', league: '', founded: '', logo: null });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('league', form.league);
      formData.append('founded', form.founded);
      if (form.logo instanceof File) {
        formData.append('logo', form.logo);
      }
      if (editing) {
        await axios.put(`http://localhost:5000/api/teams/${editing}`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('http://localhost:5000/api/teams', formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
      }
      fetchTeams();
      setForm({ name: '', league: '', founded: '', logo: null });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (team) => {
    setForm({ ...team, logo: null }); // Reset logo to null when editing, user can upload new one
    setEditing(team.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`, { headers });
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div>
      <h1 className="text-2xl mb-4">Teams</h1>
      {canEdit && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
          <input type="number" placeholder="Founded" value={form.founded} onChange={(e) => setForm({ ...form, founded: e.target.value })} />
          {/* Removed logo upload input as per user request */}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}
      <ul>
        {teams.map(team => (
          <li key={team.id} className="mb-2 flex items-center">
            {team.name} - {team.league} - Founded: {team.founded}
            {canEdit && (
              <>
                <button onClick={() => handleEdit(team)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(team.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
