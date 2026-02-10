// // ============================================
// // CitiesPage.jsx
// // ============================================

// import React, { useState, useEffect } from 'react';
// import { Search } from 'lucide-react';
// import api from '../services/api.js';       // ✅ Import your API service
// import CityCard from '../components/CityCard.jsx'; // ✅ Import external component

// function CitiesPage({ setPage, setSelectedCity }) {
//   const [cities, setCities] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadCities();
//   }, []);

//   const loadCities = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await api.getCities(search);
//       setCities(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     loadCities();
//   };

//   const selectCity = (city) => {
//     setSelectedCity(city);
//     setPage('hotels');
//   };

//   return (
//     <div>
//       <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//         Explore Cities
//       </h1>

//       <div className="max-w-2xl mx-auto mb-12 px-4">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             placeholder="Search for cities..."
//             className="w-full pl-12 pr-24 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
//           />
//           <button
//             onClick={handleSearch}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="max-w-2xl mx-auto mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//         </div>
//       ) : cities.length === 0 ? (
//         <div className="text-center py-12 text-gray-600">
//           No cities found. Try a different search.
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
//           {cities.map((city) => (
//             <CityCard key={city.city_id} city={city} onSelect={selectCity} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CitiesPage;


// ============================================
// CitiesPage.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api.js';       // ✅ Import your API service
import CityCard from '../components/CityCard.jsx'; // ✅ Import external component
import { getCityImage } from "../services/imageAPI.js";

function CitiesPage({ setPage, setSelectedCity }) {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getCities(search);

// ✅ Fetch images for each city in parallel
      const citiesWithImages = await Promise.all(
        data.map(async (city) => ({
          ...city,
          image_url: await getCityImage(city.city_name),
      }))
);

setCities(citiesWithImages);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadCities();
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    setPage('hotels');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Explore Cities
      </h1>

      <div className="max-w-2xl mx-auto mb-12 px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for cities..."
            className="w-full pl-12 pr-24 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No cities found. Try a different search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {cities.map((city) => (
            <CityCard key={city.city_id} city={city} onSelect={selectCity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CitiesPage;