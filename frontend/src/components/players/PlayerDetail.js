import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayerById } from '../../services/api';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await getPlayerById(id);
        setPlayer(data);
      } catch (err) {
        setError('Failed to fetch player details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!player) return <div className="text-center py-8">Player not found</div>;

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
          {player.photo_url && (
            <img 
              src={player.photo_url} 
              alt={player.name} 
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
          {player.team_name && (
            <p className="text-xl text-gray-600 mb-6">{player.team_name}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {player.position && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Position</h3>
                <p>{player.position}</p>
              </div>
            )}
            {player.nationality && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Nationality</h3>
                <p>{player.nationality}</p>
              </div>
            )}
            {player.age && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Age</h3>
                <p>{player.age}</p>
              </div>
            )}
            {player.jersey_number && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Jersey Number</h3>
                <p>#{player.jersey_number}</p>
              </div>
            )}
            {player.goals !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Goals</h3>
                <p>{player.goals}</p>
              </div>
            )}
            {player.assists !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Assists</h3>
                <p>{player.assists}</p>
              </div>
            )}
          </div>

          {player.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{player.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
