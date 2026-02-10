// // ============================================
// // HOTELS PAGE COMPONENT (WITH BOOKING)
// // ============================================
// // ============================================
// // IMPORTS
// // ============================================
// import React, { useState, useEffect } from 'react';
// import { Bus, Hotel } from 'lucide-react';
// import api from '../services/api.js'; // 👈 adjust this if api.js is in a different folder
// import HotelCard from '../components/HotelCard.jsx'; // 👈 importing from components folder


// function HotelsPage({ city, user, setUser }) {
//   const [hotels, setHotels] = useState([]);
//   const [transport, setTransport] = useState([]);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [selectedTransport, setSelectedTransport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadData();
//   }, [city]);

//   const loadData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const [hotelsData, transportData] = await Promise.all([
//         api.getHotels(city.city_id),
//         api.getTransport(city.city_id)
//       ]);
//       setHotels(hotelsData);
//       setTransport(transportData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBooking = async () => {
//     if (!selectedHotel || !selectedTransport) {
//       alert('Please select both hotel and transport');
//       return;
//     }

//     try {
//       const result = await api.createBooking(user.user_id, selectedTransport.transport_id, selectedHotel.hotel_id);
//       alert(`✅ Booking successful!\n\nBooking ID: ${result.booking_id}\nTotal Cost: ₹${result.total_cost}\n\nYour updated budget: ₹${user.budget - result.total_cost}`);
      
//       // Update user budget in state
//       setUser({
//         ...user,
//         budget: user.budget - result.total_cost
//       });
      
//       setSelectedHotel(null);
//       setSelectedTransport(null);
//     } catch (err) {
//       alert('❌ Booking failed: ' + err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="pb-32">
//       <h1 className="text-4xl font-bold mb-2 text-center">{city.city_name}</h1>
//       <p className="text-gray-600 text-center mb-8">{city.country}</p>

//       <div className="mb-12 px-4">
//         <h2 className="text-2xl font-bold mb-4 flex items-center">
//           <Bus className="mr-2" /> Select Transport
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {transport.map((t) => (
//             <div
//               key={t.transport_id}
//               onClick={() => setSelectedTransport(t)}
//               className={`p-4 rounded-lg cursor-pointer transition-all ${
//                 selectedTransport?.transport_id === t.transport_id
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white hover:shadow-lg'
//               }`}
//             >
//               <div className="font-semibold">{t.mode}</div>
//               <div className="text-sm mt-1">₹{t.cost}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mb-12 px-4">
//         <h2 className="text-2xl font-bold mb-4 flex items-center">
//           <Hotel className="mr-2" /> Select Hotel
//         </h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           {hotels.map((hotel) => (
//             <HotelCard
//               key={hotel.hotel_id}
//               hotel={hotel}
//               selected={selectedHotel?.hotel_id === hotel.hotel_id}
//               onSelect={() => setSelectedHotel(hotel)}
//             />
//           ))}
//         </div>
//       </div>

//       {(selectedHotel || selectedTransport) && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-purple-200 p-4 md:p-6">
//           <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-center md:text-left">
//               <div className="font-semibold">Selected:</div>
//               <div className="text-sm text-gray-600">
//                 {selectedTransport && `${selectedTransport.mode} (₹${selectedTransport.cost})`}
//                 {selectedTransport && selectedHotel && ' + '}
//                 {selectedHotel && `${selectedHotel.hotel_name} (₹${selectedHotel.price_per_night})`}
//               </div>
//               {selectedTransport && selectedHotel && (
//                 <div className="text-lg font-bold text-purple-600 mt-1">
//                   Total: ₹{selectedTransport.cost + selectedHotel.price_per_night}
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={handleBooking}
//               disabled={!selectedHotel || !selectedTransport}
//               className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Book Now
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HotelsPage;



// import React, { useState, useEffect } from 'react';
// import { Hotel, Bus, User } from 'lucide-react';
// import api from '../services/api.js';
// import HotelCard from '../components/HotelCard.jsx';
// import AttractionsPage from './AttractionsPage.jsx';
// import FoodplacesPage from './FoodplacesPage.jsx';

// export default function HotelsPage({ city, user, setUser }) {
//   const [hotels, setHotels] = useState([]);
//   const [transport, setTransport] = useState([]);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [selectedTransport, setSelectedTransport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('hotels');
//   const [sortBy, setSortBy] = useState('all'); // 'all', 'top', 'price'

//   useEffect(() => {
//     if (activeTab === 'hotels') {
//       loadData();
//     }
//   }, [city, activeTab,sortBy]);

//   const loadData = async () => {
//   setLoading(true);
//   setError('');
//   try {
//     let hotelsData;
//     let transportData;

//     if (sortBy === 'top') {
//       hotelsData = await api.getTopHotels(city.city_id);
//     } else {
//       hotelsData = await api.getHotels(city.city_id);
//       if (sortBy === 'price') {
//         hotelsData = hotelsData.sort((a, b) => a.price_per_night - b.price_per_night);
//       }
//     }

//     transportData = await api.getTransport(city.city_id);

//     setHotels(hotelsData);
//     setTransport(transportData);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleBooking = async () => {
//     if (!selectedHotel || !selectedTransport) {
//       alert('Please select both hotel and transport');
//       return;
//     }

//     try {
//       const result = await api.createBooking(user.user_id, selectedTransport.transport_id, selectedHotel.hotel_id);
//       alert(`✅ Booking successful!\n\nBooking ID: ${result.booking_id}\nTotal Cost: ₹${result.total_cost}\n\nYour updated budget: ₹${user.budget - result.total_cost}`);
      
//       setUser({
//         ...user,
//         budget: user.budget - result.total_cost
//       });
      
//       setSelectedHotel(null);
//       setSelectedTransport(null);
//     } catch (err) {
//       alert('❌ Booking failed: ' + err.message);
//     }
//   };

//   const getTransportIcon = (type) => {
//     const icons = {
//       'Flight': '✈️', 'Train': '🚂', 'Bus': '🚌', 'Cab': '🚕',
//       'flight': '✈️', 'train': '🚂', 'bus': '🚌', 'cab': '🚕'
//     };
//     return icons[type] || '🚗';
//   };

//   return (
//     <div className="pb-32">
//       <h1 className="text-4xl font-bold mb-2 text-center">{city.city_name}</h1>
//       <p className="text-gray-600 text-center mb-8">{city.country}</p>

//       {/* Navigation Tabs */}
//       <div className="flex justify-center mb-8 px-4">
//         <div className="inline-flex bg-white rounded-lg shadow-lg p-1 flex-wrap">
//           <button
//             onClick={() => setActiveTab('hotels')}
//             className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
//               activeTab === 'hotels' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-purple-600'
//             }`}
//           >
//             🏨 Hotels & Transport
//           </button>
//           <button
//             onClick={() => setActiveTab('attractions')}
//             className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
//               activeTab === 'attractions' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-purple-600'
//             }`}
//           >
//             🎭 Attractions
//           </button>
//           <button
//             onClick={() => setActiveTab('foodplaces')}
//             className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
//               activeTab === 'foodplaces' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-purple-600'
//             }`}
//           >
//             🍽️ Restaurants
//           </button>
//         </div>
//       </div>

//       {/* Hotels & Transport Tab */}
//       {activeTab === 'hotels' && (
//         <>
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//             </div>
//           ) : error ? (
//             <div className="max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//               {error}
//             </div>
//           ) : (
//             <>
//               {/* Transport Section */}
// <div className="mb-12 px-4">
//   <h2 className="text-2xl font-bold mb-4 flex items-center">
//     <Bus className="mr-2" /> Select Transport
//   </h2>
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//     {transport.map((t) => {
//       // Icon mapping for transport types
//       const getTransportIcon = (type) => {
//         const icons = {
//           'bus': '🚌',
//           'train': '🚂',
//           'flight': '✈️',
//           'cab': '🚕',
//           'Bus': '🚌',
//           'Train': '🚂',
//           'Flight': '✈️',
//           'Cab': '🚕'
//         };
//         return icons[type] || '🚗';
//       };

//       return (
//         <div
//           key={t.transport_id}
//           onClick={() => setSelectedTransport(t)}
//           className={`p-4 rounded-lg cursor-pointer transition-all ${
//             selectedTransport?.transport_id === t.transport_id
//               ? 'bg-purple-600 text-white shadow-lg scale-105'
//               : 'bg-white hover:shadow-lg hover:scale-102'
//           }`}
//         >
//           <div className="text-center">
//             <div className="text-4xl mb-2">{getTransportIcon(t.type)}</div>
//             <div className="font-bold text-lg capitalize">{t.type}</div>
//             <div className={`text-xs mt-1 ${selectedTransport?.transport_id === t.transport_id ? 'text-white' : 'text-gray-600'}`}>
//               {t.provider}
//             </div>
//             <div className={`text-sm mt-2 ${selectedTransport?.transport_id === t.transport_id ? 'text-white' : 'text-purple-600'} font-bold`}>
//               ₹{t.cost}
//             </div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// </div>


// <div className="flex justify-between items-center mb-4">
//   <h2 className="text-2xl font-bold flex items-center">
//     <Hotel className="mr-2" /> Select Hotel
//   </h2>
//   <div className="flex gap-2">
//     <button
//       onClick={() => setSortBy('all')}
//       className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
//         sortBy === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
//       }`}
//     >
//       All
//     </button>
//     <button
//       onClick={() => setSortBy('top')}
//       className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
//         sortBy === 'top' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
//       }`}
//     >
//       Top Rated
//     </button>
//     <button
//       onClick={() => setSortBy('price')}
//       className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
//         sortBy === 'price' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
//       }`}
//     >
//       Budget Friendly
//     </button>
//   </div>
// </div>
              

//               {/* Hotels Section */}
//               <div className="mb-12 px-4">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   {hotels.map((hotel) => (
//                     <HotelCard
//                       key={hotel.hotel_id}
//                       hotel={hotel}
//                       selected={selectedHotel?.hotel_id === hotel.hotel_id}
//                       onSelect={() => setSelectedHotel(hotel)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {/* Attractions Tab */}
//       {activeTab === 'attractions' && <AttractionsPage city={city} user={user}/>}

//       {/* Foodplaces Tab */}
//       {activeTab === 'foodplaces' && <FoodplacesPage city={city} user={user} />}

//       {/* Booking Bar - Update the display */}
// {activeTab === 'hotels' && (selectedHotel || selectedTransport) && (
//   <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-purple-200 p-4 md:p-6 z-50">
//     <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//       <div className="text-center md:text-left">
//         <div className="font-semibold text-gray-700">Selected:</div>
//         <div className="text-sm text-gray-600">
//           {selectedTransport && `${selectedTransport.type} - ${selectedTransport.provider} (₹${selectedTransport.cost})`}
//           {selectedTransport && selectedHotel && ' + '}
//           {selectedHotel && `${selectedHotel.hotel_name} (₹${selectedHotel.price_per_night})`}
//         </div>
//         {selectedTransport && selectedHotel && (
//           <div className="text-lg font-bold text-purple-600 mt-1">
//             Total: ₹{parseFloat(selectedTransport.cost) + parseFloat(selectedHotel.price_per_night)}
//           </div>
//         )}
//       </div>
//       <button
//         onClick={handleBooking}
//         disabled={!selectedHotel || !selectedTransport}
//         className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//       >
//         {(!selectedHotel || !selectedTransport) ? 'Select Both to Book' : 'Book Now'}
//       </button>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Hotel, Bus } from 'lucide-react';
import api from '../services/api.js';
import HotelCard from '../components/HotelCard.jsx';
import AttractionsPage from './AttractionsPage.jsx';
import FoodplacesPage from './FoodPlacesPage.jsx';

export default function HotelsPage({ city, user, setUser }) {
  const [hotels, setHotels] = useState([]);
  const [transport, setTransport] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('hotels');
  const [sortBy, setSortBy] = useState('all'); 

  useEffect(() => {
    if (activeTab === 'hotels') loadData();
  }, [city, activeTab, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      let hotelsData;

      if (sortBy === 'top') {
        hotelsData = await api.getTopHotels(city.city_id);
      } else {
        hotelsData = await api.getHotels(city.city_id);
        if (sortBy === 'price') {
          hotelsData = hotelsData.sort(
            (a, b) => a.price_per_night - b.price_per_night
          );
        }
      }

      const transportData = await api.getTransport(city.city_id);

      setHotels(hotelsData);
      setTransport(transportData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedHotel || !selectedTransport) {
      alert('Please select both hotel and transport');
      return;
    }

    try {
      const result = await api.createBooking(
        user.user_id,
        selectedTransport.transport_id,
        selectedHotel.hotel_id,
        selectedDate
      );

      alert(
        `✅ Booking successful!\n\nBooking ID: ${result.booking_id}\nTotal Cost: ₹${result.total_cost}\n\nYour updated budget: ₹${
          user.budget - result.total_cost
        }`
      );

      setUser({
        ...user,
        budget: user.budget - parseFloat(result.total_cost)
      });

      setSelectedHotel(null);
      setSelectedTransport(null);
    } catch (err) {
      alert('❌ Booking failed: ' + err.message);
    }
  };

  const getTransportIcon = (type) => {
    const icons = {
      flight: '✈️',
      Flight: '✈️',
      train: '🚂',
      Train: '🚂',
      bus: '🚌',
      Bus: '🚌',
      cab: '🚕',
      Cab: '🚕',
    };
    return icons[type] || '🚗';
  };

  return (
    <div className="pb-32">
      <h1 className="text-4xl font-bold mb-2 text-center">{city.city_name}</h1>
      <p className="text-gray-600 text-center mb-8">{city.country}</p>

      {/* Tabs */}
      <div className="flex justify-center mb-8 px-4">
        <div className="inline-flex bg-white rounded-lg shadow-lg p-1 flex-wrap">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'hotels'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            🏨 Hotels & Transport
          </button>

          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'attractions'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            🎭 Attractions
          </button>

          <button
            onClick={() => setActiveTab('foodplaces')}
            className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'foodplaces'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            🍽️ Restaurants
          </button>
        </div>
      </div>

      {/* Hotels & Transport Page */}
      {activeTab === 'hotels' && (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Transport Section */}
              <div className="mb-12 px-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Bus className="mr-2" /> Select Transport
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {transport.map((t) => (
                    <div
                      key={t.transport_id}
                      onClick={() => setSelectedTransport(t)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTransport?.transport_id === t.transport_id
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {getTransportIcon(t.type)}
                        </div>
                        <div className="font-bold text-lg capitalize">
                          {t.type}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            selectedTransport?.transport_id === t.transport_id
                              ? 'text-white'
                              : 'text-gray-600'
                          }`}
                        >
                          {t.provider}
                        </div>
                        <div
                          className={`text-sm mt-2 ${
                            selectedTransport?.transport_id === t.transport_id
                              ? 'text-white'
                              : 'text-purple-600'
                          } font-bold`}
                        >
                          ${t.cost}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels Section */}
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <Hotel className="mr-2" /> Select Hotel
                </h2>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      sortBy === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() => setSortBy('top')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      sortBy === 'top'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Top Rated
                  </button>

                  <button
                    onClick={() => setSortBy('price')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      sortBy === 'price'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Budget Friendly
                  </button>
                </div>
              </div>

              <div className="px-4 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.hotel_id}
                      hotel={hotel}
                      selected={selectedHotel?.hotel_id === hotel.hotel_id}
                      onSelect={() => setSelectedHotel(hotel)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Attractions Page */}
      {activeTab === 'attractions' && (
        <AttractionsPage city={city} user={user} />
      )}

      {/* Food Places Page */}
      {activeTab === 'foodplaces' && (
        <FoodplacesPage city={city} user={user} />
      )}

      {/* Booking bar */}
      {activeTab === 'hotels' && (selectedHotel || selectedTransport) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-purple-200 p-4 md:p-6 z-50">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="font-semibold text-gray-700">Selected:</div>

              <div className="text-sm text-gray-600">
                {selectedTransport &&
                  `${selectedTransport.type} - ${selectedTransport.provider} ($${selectedTransport.cost})`}
                {selectedTransport && selectedHotel && ' + '}
                {selectedHotel &&
                  `${selectedHotel.hotel_name} ($${selectedHotel.price_per_night})`}
              </div>

              {selectedTransport && selectedHotel && (
                <div className="text-lg font-bold text-purple-600 mt-1">
                  Total: $
                  {parseFloat(selectedTransport.cost) +
                    parseFloat(selectedHotel.price_per_night)}
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-sm text-gray-600 mr-2">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded p-2"
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedHotel || !selectedTransport}
              className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {(!selectedHotel || !selectedTransport)
                ? 'Select Both to Book'
                : 'Book Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}