import React from 'react';
import Header from '../components/layout/Header';
import MatchesList from '../components/matches/MatchesList';

const Matches = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Matches</h1>
            <p className="mt-1 text-sm text-gray-500">Browse through all matches.</p>
          </div>
          <MatchesList />
        </div>
      </main>
    </div>
  );
};

export default Matches;
