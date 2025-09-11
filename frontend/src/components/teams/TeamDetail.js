import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById } from '../../services/api';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeamById(id);
        setTeam(data);
      } catch (err) {
        setError('Failed to fetch team details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!team) return <div className="text-center py-8">Team not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
      >
        ← Back
      </button>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {team.logo_url && (
            <img 
              src={team.logo_url} 
              alt={`${team.name} logo`} 
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{team.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">League</h3>
              <p>{team.league || 'N/A'}</p>
            </div>
            {team.founded && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Founded</h3>
                <p>{team.founded}</p>
              </div>
            )}
            {team.stadium && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Stadium</h3>
                <p>{team.stadium}</p>
              </div>
            )}
            {team.manager && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Manager</h3>
                <p>{team.manager}</p>
              </div>
            )}
          </div>

          {team.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{team.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
