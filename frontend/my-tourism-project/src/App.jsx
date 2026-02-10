

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitiesPage from './pages/CitiesPage';
import HotelsPage from './pages/Hotelspage';
import AttractionsPage from './pages/AttractionsPage';
import FoodplacesPage from './pages/FoodPlacesPage';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';   // ADMIN PAGE

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

  const isAdminView = user && user.is_admin && page === "adminDashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* ONLY SHOW NAVBAR FOR NORMAL USERS */}
      {!isAdminView && (
        <Navbar 
          user={user}
          page={page}
          setPage={setPage}
          logout={logout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setSelectedCity={setSelectedCity}
        />
      )}

      <main className="container mx-auto px-4 py-8">

        {/* ========== NOT LOGGED IN ========== */}
        {!user && page === 'home' && <HomePage setPage={setPage} />}
        {!user && page === 'login' && <LoginPage setUser={setUser} setPage={setPage} />}
        {!user && page === 'register' && <RegisterPage setUser={setUser} setPage={setPage} />}

        {/* ========== ADMIN DASHBOARD (NO NAVBAR) ========== */}
        {user && user.is_admin && page === 'adminDashboard' && (
          <AdminDashboard user={user} setPage={setPage} logout={logout} />
        )}

        {/* ========== NORMAL USER SCREENS ========== */}
        {user && !user.is_admin && page === 'cities' && (
          <CitiesPage setPage={setPage} setSelectedCity={setSelectedCity} />
        )}

        {user && !user.is_admin && page === 'hotels' && selectedCity && (
          <HotelsPage city={selectedCity} user={user} setUser={setUser} />
        )}

        {user && !user.is_admin && page === 'attractions' && selectedCity && (
          <AttractionsPage city={selectedCity} />
        )}

        {user && !user.is_admin && page === 'foodplaces' && selectedCity && (
          <FoodplacesPage city={selectedCity} />
        )}

        {user && !user.is_admin && page === 'bookings' && (
          <MyBookings user={user} setUser={setUser} />
        )}

      </main>
    </div>
  );
}