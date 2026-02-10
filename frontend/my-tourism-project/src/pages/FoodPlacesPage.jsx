import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import api from '../services/api.js';
import EntityReviewCard from '../components/EntityReviewCard.jsx';

export default function FoodplacesPage({ city, user }) {
  const [foodplaces, setFoodplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('all'); // 'all', 'rating', 'price'

  useEffect(() => {
    loadFoodplaces();
  }, [city, sortBy]);

  const loadFoodplaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getFoodplaces(city.city_id);
      let sortedData = [...data];
      if (sortBy === 'rating') {
        sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'price') {
        sortedData.sort((a, b) => (a.avg_cost || 0) - (b.avg_cost || 0));
      }
      setFoodplaces(sortedData);
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
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-bold">Restaurants in {city.city_name}</h1>
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
            onClick={() => setSortBy('rating')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'rating'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'price'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Budget Friendly
          </button>
        </div>
      </div>

      {foodplaces.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No restaurants found for this city.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {foodplaces.map((place) => (
            <div
              key={place.food_id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <Utensils className="w-12 h-12 text-purple-600" />
                <span className="text-yellow-500 font-semibold text-lg">
                  ★ {place.rating}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                {place.restaurant || place.name}
              </h3>

              <div className="pt-3 border-t border-gray-200 mb-2">
                <span className="text-purple-600 font-bold text-lg">
                  ${place.avg_cost || place.average_cost}
                </span>
                <span className="text-gray-500 text-sm ml-1">avg per person</span>
              </div>

              {/* Review section */}
              <EntityReviewCard
                user={user}
                entity={{ id: place.food_id }}
                entityType="foodplace"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}