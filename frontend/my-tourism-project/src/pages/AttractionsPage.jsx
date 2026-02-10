import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import api from '../services/api.js';
import EntityReviewCard from '../components/EntityReviewCard.jsx';

export default function AttractionsPage({ city, user }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('all'); // 'all', 'top'

  useEffect(() => {
    loadAttractions();
  }, [city, sortBy]);

  const loadAttractions = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (sortBy === 'top') {
        data = await api.getTopAttractions(city.city_id);
      } else {
        data = await api.getAttractions(city.city_id);
      }
      setAttractions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Attractions in {city.city_name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'top'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {attractions.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No attractions found for this city.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <div
              key={attraction.attraction_id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <Compass className="w-12 h-12 text-purple-600" />
                <span className="text-yellow-500 font-semibold text-lg">
                  ★ {attraction.rating}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                {attraction.name || attraction.attraction_name}
              </h3>

              <p className="text-gray-600 mb-2 capitalize">
                <span className="font-semibold">Category:</span>{' '}
                {attraction.category || attraction.type}
              </p>

              {(attraction.entry_fee || attraction.entry_fee === 0) && (
                <p className="text-purple-600 font-bold mb-2">
                  {attraction.entry_fee === 0
                    ? 'Free Entry'
                    : `$${attraction.entry_fee}`}
                </p>
              )}

              {/* Review section */}
              <EntityReviewCard
                user={user}
                entity={{ id: attraction.attraction_id }}
                entityType="attraction"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}