import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods
export const getMatches = () => api.get('/matches');
export const getMatchById = (id) => api.get(`/matches/${id}`);
// Get detailed match information including events
export const getMatchDetails = (id) => api.get(`/matches/${id}`);
export const getTeams = () => api.get('/teams');
export const getTeamById = (id) => api.get(`/teams/${id}`);
export const getPlayers = () => api.get('/players');
export const getPlayerById = (id) => api.get(`/players/${id}`);
export const getStandings = () => api.get('/standings');

// Search functions
export const searchTeams = (query) => 
  api.get(`/teams/search?q=${encodeURIComponent(query)}`).then(res => res.data);

export const searchPlayers = (query) => 
  api.get(`/players/search?q=${encodeURIComponent(query)}`).then(res => res.data);

export default api;
