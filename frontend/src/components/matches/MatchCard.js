import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const MatchCard = ({ match }) => {
  const { 
    id, 
    home_team_name: homeTeam, 
    away_team_name: awayTeam, 
    home_score: homeScore, 
    away_score: awayScore, 
    status, 
    date, 
    time, 
    league: competition,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId
  } = match;
  
  const getStatusBadge = () => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'ft' || statusLower === 'completed') {
      return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">FT</span>;
    } else if (statusLower === 'ht' || statusLower === 'halftime') {
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">HT</span>;
    } else if (statusLower === 'live' || statusLower === 'in progress') {
      return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">LIVE</span>;
    } else if (statusLower === 'upcoming' || statusLower === 'scheduled') {
      return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">UPCOMING</span>;
    } else {
      // Convert first letter to uppercase for display
      const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{displayStatus}</span>;
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/matches/${id}`);
  };

  return (
    <div 
      className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">{competition || 'Match'}</div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
              <Link 
                to={`/teams/${homeTeamId}`}
                className="text-sm font-medium hover:text-indigo-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {homeTeam || 'Home Team'}
              </Link>
            </div>
          </div>
          <div className="w-16 text-center font-bold">
            {homeScore !== undefined && awayScore !== undefined 
              ? `${homeScore} - ${awayScore}` 
              : 'VS'}
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end">
              <Link 
                to={`/teams/${awayTeamId}`}
                className="text-sm font-medium hover:text-indigo-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {awayTeam || 'Away Team'}
              </Link>
              <div className="w-6 h-6 bg-gray-200 rounded-full ml-2"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {formatDate(date)} {time ? `• ${time}` : ''}
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </div>
    </div>
  );
};

MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.number.isRequired,
    home_team_name: PropTypes.string,
    home_team_id: PropTypes.number,
    away_team_name: PropTypes.string,
    away_team_id: PropTypes.number,
    home_score: PropTypes.number,
    away_score: PropTypes.number,
    status: PropTypes.string,
    time: PropTypes.string.isRequired,
    competition: PropTypes.string.isRequired,
  }).isRequired,
};

export default MatchCard;
