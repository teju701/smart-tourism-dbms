// ============================================
// IMPORTS
// ============================================
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Hotel, Utensils, Compass, Bus, User, LogOut, Menu, X } from 'lucide-react';

// ============================================
// API SERVICE - CONNECTED TO BACKEND
// ============================================
const API_BASE = 'http://localhost:5000/api';

const api = {
  // Auth APIs
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return await response.json();
  },
  
  register: async (name, email, password, budget) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, budget })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return await response.json();
  },
  
  // Cities API
  getCities: async (search = '') => {
    const url = search 
      ? `${API_BASE}/cities?search=${encodeURIComponent(search)}`
      : `${API_BASE}/cities`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return await response.json();
  },
  
  // Hotels API
  getHotels: async (cityId) => {
    const response = await fetch(`${API_BASE}/hotels/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    return await response.json();
  },
  
  // Attractions API
  getAttractions: async (cityId) => {
    const response = await fetch(`${API_BASE}/attractions/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch attractions');
    return await response.json();
  },
  
  // Foodplaces API
  getFoodplaces: async (cityId) => {
    const response = await fetch(`${API_BASE}/foodplaces/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch foodplaces');
    return await response.json();
  },
  
  // Transport API
  getTransport: async (cityId) => {
    const response = await fetch(`${API_BASE}/transport/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch transport');
    return await response.json();
  },
  
  // Bookings API
  createBooking: async (userId, transportId, hotelId) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        transport_id: transportId,
        hotel_id: hotelId
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Booking failed');
    }
    return await response.json();
  }
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function TravelApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedCity, setSelectedCity] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    setUser(null);
    setPage('home');
    setSelectedCity(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar 
        user={user} 
        page={page} 
        setPage={setPage} 
        logout={logout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setSelectedCity={setSelectedCity}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!user && page === 'home' && <HomePage setPage={setPage} />}
        {!user && page === 'login' && <LoginPage setUser={setUser} setPage={setPage} />}
        {!user && page === 'register' && <RegisterPage setUser={setUser} setPage={setPage} />}
        
        {user && page === 'cities' && (
          <CitiesPage setPage={setPage} setSelectedCity={setSelectedCity} />
        )}
        {user && page === 'hotels' && selectedCity && (
          <HotelsPage city={selectedCity} user={user} setUser={setUser} />
        )}
        {user && page === 'attractions' && selectedCity && (
          <AttractionsPage city={selectedCity} />
        )}
        {user && page === 'foodplaces' && selectedCity && (
          <FoodplacesPage city={selectedCity} />
        )}
      </main>
    </div>
  );
}

// ============================================
// NAVBAR COMPONENT
// ============================================
function Navbar({ user, page, setPage, logout, mobileMenuOpen, setMobileMenuOpen, setSelectedCity }) {
  const handleLogoClick = () => {
    if (user) {
      setSelectedCity(null);
      setPage('cities');
    } else {
      setPage('home');
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Compass className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TravelExplorer
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink active={page === 'cities'} onClick={() => { setSelectedCity(null); setPage('cities'); }}>
                  Cities
                </NavLink>
                <div className="flex items-center space-x-3 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500">₹{user.budget}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-3">
              <div className="px-4 py-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">Budget: ₹{user.budget}</div>
              </div>
              <NavLink active={page === 'cities'} onClick={() => { setSelectedCity(null); setPage('cities'); setMobileMenuOpen(false); }}>
                Cities
              </NavLink>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-medium transition-colors ${
        active ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
      }`}
    >
      {children}
    </button>
  );
}

// ============================================
// HOME PAGE COMPONENT
// ============================================
function HomePage({ setPage }) {
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

// ============================================
// LOGIN PAGE COMPONENT
// ============================================
function LoginPage({ setUser, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      setPage('cities');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => setPage('register')} className="text-purple-600 font-semibold hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================
// REGISTER PAGE COMPONENT
// ============================================
function RegisterPage({ setUser, setPage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !budget) {
      setError('Please fill all fields');
      return;
    }
    
    if (parseFloat(budget) <= 0) {
      setError('Budget must be greater than 0');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await api.register(name, email, password, parseFloat(budget));
      setUser(userData);
      setPage('cities');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="5000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => setPage('login')} className="text-purple-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================
// CITIES PAGE COMPONENT
// ============================================
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
      setCities(data);
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

function CityCard({ city, onSelect }) {
  return (
    <div
      onClick={() => onSelect(city)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 group-hover:from-purple-500 group-hover:to-pink-500 transition-all"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{city.city_name}</h3>
        <p className="text-gray-600 text-sm mb-1">{city.country}</p>
        {city.description && <p className="text-gray-500 text-sm">{city.description}</p>}
        <button className="mt-4 text-purple-600 font-semibold flex items-center space-x-1 group-hover:space-x-2 transition-all">
          <span>Explore</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// HOTELS PAGE COMPONENT (WITH BOOKING)
// ============================================
function HotelsPage({ city, user, setUser }) {
  const [hotels, setHotels] = useState([]);
  const [transport, setTransport] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [city]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [hotelsData, transportData] = await Promise.all([
        api.getHotels(city.city_id),
        api.getTransport(city.city_id)
      ]);
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
      const result = await api.createBooking(user.user_id, selectedTransport.transport_id, selectedHotel.hotel_id);
      alert(`✅ Booking successful!\n\nBooking ID: ${result.booking_id}\nTotal Cost: ₹${result.total_cost}\n\nYour updated budget: ₹${user.budget - result.total_cost}`);
      
      // Update user budget in state
      setUser({
        ...user,
        budget: user.budget - result.total_cost
      });
      
      setSelectedHotel(null);
      setSelectedTransport(null);
    } catch (err) {
      alert('❌ Booking failed: ' + err.message);
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
    <div className="pb-32">
      <h1 className="text-4xl font-bold mb-2 text-center">{city.city_name}</h1>
      <p className="text-gray-600 text-center mb-8">{city.country}</p>

      <div className="mb-12 px-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Bus className="mr-2" /> Select Transport
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {transport.map((t) => (
            <div
              key={t.transport_id}
              onClick={() => setSelectedTransport(t)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedTransport?.transport_id === t.transport_id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="font-semibold">{t.mode}</div>
              <div className="text-sm mt-1">₹{t.cost}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12 px-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Hotel className="mr-2" /> Select Hotel
        </h2>
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

      {(selectedHotel || selectedTransport) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-purple-200 p-4 md:p-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="font-semibold">Selected:</div>
              <div className="text-sm text-gray-600">
                {selectedTransport && `${selectedTransport.mode} (₹${selectedTransport.cost})`}
                {selectedTransport && selectedHotel && ' + '}
                {selectedHotel && `${selectedHotel.hotel_name} (₹${selectedHotel.price_per_night})`}
              </div>
              {selectedTransport && selectedHotel && (
                <div className="text-lg font-bold text-purple-600 mt-1">
                  Total: ₹{selectedTransport.cost + selectedHotel.price_per_night}
                </div>
              )}
            </div>
            <button
              onClick={handleBooking}
              disabled={!selectedHotel || !selectedTransport}
              className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HotelCard({ hotel, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden ${
        selected ? 'ring-4 ring-purple-600' : ''
      }`}
    >
      <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-400"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{hotel.hotel_name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-purple-600">₹{hotel.price_per_night}</span>
          <span className="text-yellow-500 font-semibold">★ {hotel.rating}</span>
        </div>
        {hotel.address && <p className="text-gray-600 text-sm">{hotel.address}</p>}
      </div>
    </div>
  );
}

// ============================================
// ATTRACTIONS PAGE COMPONENT
// ============================================
function AttractionsPage({ city }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttractions();
  }, [city]);

  const loadAttractions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAttractions(city.city_id);
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
      <h1 className="text-4xl font-bold mb-8">Attractions in {city.city_name}</h1>
      {attractions.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No attractions found for this city.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <div key={attraction.attraction_id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Compass className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
              <p className="text-gray-600 mb-2">{attraction.type}</p>
              <div className="text-yellow-500 font-semibold">★ {attraction.rating}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// FOODPLACES PAGE COMPONENT
// ============================================
function FoodplacesPage({ city }) {
  const [foodplaces, setFoodplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFoodplaces();
  }, [city]);

  const loadFoodplaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getFoodplaces(city.city_id);
      setFoodplaces(data);
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
      <h1 className="text-4xl font-bold mb-8">Restaurants in {city.city_name}</h1>
      {foodplaces.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No restaurants found for this city.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {foodplaces.map((place) => (
            <div key={place.foodplace_id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Utensils className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{place.restaurant_name}</h3>
              <p className="text-gray-600 mb-2">{place.cuisine_type}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-semibold">₹{place.avg_cost} avg</span>
                <span className="text-yellow-500 font-semibold">★ {place.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}