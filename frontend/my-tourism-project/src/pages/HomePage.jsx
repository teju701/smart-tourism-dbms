import React from 'react';
import { MapPin, Hotel, Compass } from 'lucide-react';
import FeatureCard from '../components/FeatureCard.jsx';

export default function HomePage({ setPage }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
        Explore Your Next Adventure
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto px-4">
        Discover amazing destinations, find perfect hotels, explore attractions, and book your dream trip with ease.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-4">
        <button
          onClick={() => setPage('login')}
          className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Login
        </button>
        <button
          onClick={() => setPage('register')}
          className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-purple-600"
        >
          Register
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 px-4">
        <FeatureCard icon={<MapPin />} title="560+ Cities" description="Explore destinations worldwide" />
        <FeatureCard icon={<Hotel />} title="Smart Hotels" description="Find perfect accommodations" />
        <FeatureCard icon={<Compass />} title="Top Attractions" description="Discover must-see places" />
      </div>
    </div>
  );
}