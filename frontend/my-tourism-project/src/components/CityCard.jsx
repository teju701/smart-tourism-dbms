import React from 'react';

export default function CityCard({ city, onSelect }) {
  return (
    <div
      onClick={() => onSelect(city)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
    >
      {/* ✅ City image (replaces the gradient placeholder) */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.image_url || "https://images.unsplash.com/photo-1503264116251-35a269479413"}
          alt={city.city_name}
          className="h-48 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>

        {/* City name overlay */}
        <div className="absolute bottom-4 left-4 text-white font-bold text-2xl drop-shadow-lg">
          {city.city_name}
        </div>
      </div>

      {/* ✅ Info section below image */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-1 flex items-center">
          <span className="mr-1">📍</span> {city.country || "Unknown Country"}
        </p>

        {city.description && (
          <p className="text-gray-500 text-sm line-clamp-2">{city.description}</p>
        )}

        <button className="mt-4 text-purple-600 font-semibold flex items-center space-x-1 group-hover:space-x-2 transition-all">
          <span>Explore</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}