import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Referees = ({ user }) => {
  const [referees, setReferees] = useState([]);
  const [form, setForm] = useState({ name: '', country: '', matches: 0 });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReferees();
  }, []);

  const fetchReferees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/referees', { headers });
      setReferees(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/referees/${editing}`, form, { headers });
      } else {
        await axios.post('http://localhost:5000/api/referees', form, { headers });
      }
      fetchReferees();
      setForm({ name: '', country: '', matches: 0 });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (referee) => {
    setForm(referee);
    setEditing(referee.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/referees/${id}`, { headers });
      fetchReferees();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin';

  return (
    <div>
      <h1 className="text-2xl mb-4">Referees</h1>
      {canEdit && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <input type="number" placeholder="Matches" value={form.matches} onChange={(e) => setForm({ ...form, matches: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}
      <ul>
        {referees.map(referee => (
          <li key={referee.id} className="mb-2">
            {referee.name} - {referee.country} - Matches: {referee.matches}
            {canEdit && (
              <>
                <button onClick={() => handleEdit(referee)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(referee.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Referees;
