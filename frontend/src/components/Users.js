import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', role: 'user', password: '' });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', { headers });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/users/${editing}`, form, { headers });
      } else {
        await axios.post('http://localhost:5000/api/users', form, { headers });
      }
      fetchUsers();
      setForm({ username: '', email: '', role: 'user', password: '' });
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: '' });
    setEditing(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin';

  return (
    <div>
      <h1 className="text-2xl mb-4">Users</h1>
      {canEdit && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}
      <ul>
        {users.map(u => (
          <li key={u.id} className="mb-2">
            {u.username} - {u.email} - Role: {u.role}
            {canEdit && (
              <>
                <button onClick={() => handleEdit(u)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
