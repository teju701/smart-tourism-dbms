
import React from 'react';

export default function HotelCard({ hotel, selected, onSelect }) {
  // Get hotel initials
  const getHotelInitials = (hotelName) => {
    const words = hotelName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return hotelName.substring(0, 2).toUpperCase();
  };

  // Generate gradient based on hotel name
  const getGradientColors = (hotelName) => {
    const gradients = [
      'from-blue-400 to-purple-400',
      'from-cyan-400 to-blue-400',
      'from-indigo-400 to-purple-400',
      'from-violet-400 to-purple-400',
      'from-purple-400 to-pink-400',
      'from-blue-500 to-indigo-500'
    ];
    const index = hotelName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden ${
        selected ? 'ring-4 ring-purple-600' : ''
      }`}
    >
      {/* Hotel image placeholder */}
      <div className={`h-40 bg-gradient-to-br ${getGradientColors(hotel.hotel_name)} flex items-center justify-center relative`}>
        <div className="text-white text-5xl font-bold opacity-30">
          {getHotelInitials(hotel.hotel_name)}
        </div>
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full">
          <span className="text-yellow-500 font-semibold">★ {hotel.rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{hotel.hotel_name}</h3>
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-2xl font-bold text-purple-600">${hotel.price_per_night}</span>
            <span className="text-gray-500 text-sm ml-1">/night</span>
          </div>
        </div>
        {hotel.address && (
          <p className="text-gray-600 text-sm flex items-start">
            <span className="mr-1">📍</span>
            <span className="line-clamp-2">{hotel.address}</span>
          </p>
        )}
      </div>
    </div>
  );
}