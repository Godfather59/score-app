import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetails } from '../../services/api';

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const data = await getMatchDetails(id);
        setMatch(data);
      } catch (err) {
        setError('Failed to load match details');
        console.error('Error fetching match details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!match) {
    return <div className="text-center p-4">Match not found</div>;
  }

  // Extract match data with fallbacks
  const homeTeam = match.home_team_name || 'Home Team';
  const awayTeam = match.away_team_name || 'Away Team';
  const homeScore = match.home_score;
  const awayScore = match.away_score;
  const status = match.status || 'UPCOMING';
  const date = match.date;
  const time = match.time;
  const competition = match.league || 'Match';
  
  // For now, using an empty array for events since the API might not return them
  const events = [];

  // Initialize empty arrays for different event types
  const goals = [];
  const cards = [];
  const substitutions = [];
  
  // If we get events from the API in the future, we can uncomment this
  /*
  const goals = events.filter(event => event.type === 'GOAL');
  const cards = events.filter(event => event.type === 'YELLOW_CARD' || event.type === 'RED_CARD');
  const substitutions = events.filter(event => event.type === 'SUBSTITUTION');
  */

  const formatTime = (minute) => {
    return `${minute}'`;
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'GOAL':
        return '⚽';
      case 'YELLOW_CARD':
        return '🟨';
      case 'RED_CARD':
        return '🟥';
      case 'SUBSTITUTION':
        return '🔄';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
      >
        ← Back to matches
      </button>

      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center text-gray-500 text-sm mb-4">{competition}</div>
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="font-bold text-lg">{homeTeam}</div>
          </div>
          
          <div className="mx-4 text-center">
            <div className="text-3xl font-bold">
              {homeScore !== undefined && awayScore !== undefined 
                ? `${homeScore} - ${awayScore}`
                : 'VS'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(`${date}T${time}`).toLocaleString()}
            </div>
            <div className="mt-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100">
                {status || 'SCHEDULED'}
              </span>
            </div>
          </div>
          
          <div className="text-center flex-1">
            <div className="font-bold text-lg">{awayTeam}</div>
          </div>
        </div>
      </div>

      {/* Match Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Match Events</h3>
        
        {/* Goals */}
        {goals.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Goals</h4>
            <div className="space-y-2">
              {goals.map((event, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <span className="w-12 text-sm text-gray-500">{formatTime(event.minute)}</span>
                  <span className="w-6 text-center">{getEventIcon(event.type)}</span>
                  <span className="ml-2">
                    {event.player_name} ({event.team_name})
                    {event.assist_player_name && ` (Assist: ${event.assist_player_name})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards */}
        {cards.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Cards</h4>
            <div className="space-y-2">
              {cards.map((event, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <span className="w-12 text-sm text-gray-500">{formatTime(event.minute)}</span>
                  <span className="w-6 text-center">{getEventIcon(event.type)}</span>
                  <span className="ml-2">
                    {event.player_name} ({event.team_name}) - {event.type === 'YELLOW_CARD' ? 'Yellow Card' : 'Red Card'}
                    {event.reason && ` (${event.reason})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Substitutions */}
        {substitutions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Substitutions</h4>
            <div className="space-y-2">
              {substitutions.map((event, index) => (
                <div key={index} className="p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="w-12 text-sm text-gray-500">{formatTime(event.minute)}</span>
                    <span className="w-6 text-center">{getEventIcon('SUBSTITUTION')}</span>
                    <span className="font-medium">{event.team_name}</span>
                  </div>
                  <div className="ml-18 mt-1 text-sm">
                    <span className="text-green-600">⬆ {event.player_in_name}</span>
                    <span className="mx-2">for</span>
                    <span className="text-red-600">⬇ {event.player_out_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center text-gray-500 py-4">No match events available</div>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
