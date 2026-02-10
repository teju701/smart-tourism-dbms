// import React, { useState } from 'react';
// import { Compass, User, LogOut, Menu, X, BookOpen } from 'lucide-react';
// import ReviewModal from './ReviewModal.jsx';
// import api from '../services/api.js';

// function NavLink({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`font-medium transition-colors ${
//         active ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// export default function Navbar({
//   user,
//   page,
//   setPage,
//   logout,
//   mobileMenuOpen,
//   setMobileMenuOpen,
//   setSelectedCity,
// }) {
//   const [showReviewPrompt, setShowReviewPrompt] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [lastBooked, setLastBooked] = useState(null);

//   const handleLogoClick = () => {
//     if (user) {
//       setSelectedCity(null);
//       setPage('cities');
//     } else {
//       setPage('home');
//     }
//   };

//   // ✅ When user clicks logout
//   const handleLogoutClick = async () => {
//     try {
//       const bookingData = await api.getLastBooking(user.user_id);
//       setLastBooked({
//         hotel: bookingData.hotel_id
//           ? { id: bookingData.hotel_id, name: bookingData.hotel_name }
//           : null,
//         transport: bookingData.transport_id
//           ? { id: bookingData.transport_id, name: bookingData.transport_provider }
//           : null,
//       });
//     } catch (err) {
//       console.warn('No last booking found or failed to fetch:', err.message);
//       setLastBooked({}); // ✅ ensures ReviewModal always receives an object
//     }
//     setShowReviewPrompt(true);
//   };

//   const handleSkipReview = () => {
//     setShowReviewPrompt(false);
//     logout();
//   };

//   const handleWriteReview = () => {
//     setShowReviewPrompt(false);
//     setShowReviewModal(true);
//   };

//   const handleReviewClose = () => {
//     setShowReviewModal(false);
//     logout();
//   };

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div
//             className="flex items-center space-x-2 cursor-pointer"
//             onClick={handleLogoClick}
//           >
//             <Compass className="w-8 h-8 text-purple-600" />
//             <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               TravelExplorer
//             </span>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             {user ? (
//               <>
//                 {/* ✅ Cities link */}
//                 <NavLink
//                   active={page === 'cities'}
//                   onClick={() => {
//                     setSelectedCity(null);
//                     setPage('cities');
//                   }}
//                 >
//                   Cities
//                 </NavLink>

//                 {/* ✅ My Bookings link */}
//                 <NavLink
//                   active={page === 'bookings'}
//                   onClick={() => setPage('bookings')}
//                 >
//                   <span className="flex items-center gap-1">
//                     <BookOpen className="w-4 h-4" /> My Bookings
//                   </span>
//                 </NavLink>

//                 <div className="flex items-center space-x-3 text-gray-700">
//                   <User className="w-5 h-5" />
//                   <span className="font-medium">{user.name}</span>
//                   <span className="text-sm text-gray-500">₹{user.budget}</span>
//                 </div>

//                 {/* ✅ Logout button */}
//                 <button
//                   onClick={handleLogoutClick}
//                   className="flex items-center space-x-1 text-red-600 hover:text-red-700"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : null}
//           </div>

//           {/* Mobile menu toggle */}
//           <button
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <X /> : <Menu />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && user && (
//           <div className="md:hidden py-4 border-t">
//             <div className="space-y-3">
//               <div className="px-4 py-2">
//                 <div className="font-medium">{user.name}</div>
//                 <div className="text-sm text-gray-500">Budget: ₹{user.budget}</div>
//               </div>

//               <NavLink
//                 active={page === 'cities'}
//                 onClick={() => {
//                   setSelectedCity(null);
//                   setPage('cities');
//                   setMobileMenuOpen(false);
//                 }}
//               >
//                 Cities
//               </NavLink>

//               {/* ✅ My Bookings link (mobile) */}
//               <NavLink
//                 active={page === 'bookings'}
//                 onClick={() => {
//                   setPage('bookings');
//                   setMobileMenuOpen(false);
//                 }}
//               >
//                 <span className="flex items-center gap-1">
//                   <BookOpen className="w-4 h-4" /> My Bookings
//                 </span>
//               </NavLink>

//               <button
//                 onClick={() => {
//                   handleLogoutClick();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-2 text-red-600"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ✅ Review Confirmation Popup */}
//       {showReviewPrompt && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//           <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
//             <h2 className="text-lg font-bold mb-4 text-gray-800">
//               Would you like to leave a review before logging out?
//             </h2>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleWriteReview}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Yes, Write Review
//               </button>
//               <button
//                 onClick={handleSkipReview}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//               >
//                 Skip
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Review Modal */}
//       {showReviewModal && (
//         <ReviewModal
//           show={showReviewModal}
//           onClose={() => {
//             setShowReviewModal(false);
//             logout();
//           }}
//           user={user}
//           entityIds={lastBooked}
//         />
//       )}
//     </nav>
//   );
// }


import React, { useState } from 'react';
import { Compass, User, LogOut, Menu, X, BookOpen, Plus } from 'lucide-react'; // ✅ Added Plus icon
import ReviewModal from './ReviewModal.jsx';
import api from '../services/api.js';

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

export default function Navbar({
  user,
  page,
  setPage,
  logout,
  mobileMenuOpen,
  setMobileMenuOpen,
  setSelectedCity,
}) {
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [lastBooked, setLastBooked] = useState(null);

  // ✅ NEW: state for add budget modal
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const handleLogoClick = () => {
    if (user) {
      setSelectedCity(null);
      setPage('cities');
    } else {
      setPage('home');
    }
  };

  const handleLogoutClick = async () => {
  try {
    const bookingData = await api.getLastBooking(user.user_id);

    // Check if bookingData exists and has valid IDs
    if (!bookingData || (!bookingData.hotel_id && !bookingData.transport_id)) {
      alert("You don't have any completed bookings to review. Logging out...");
      logout();
      return;
    }

    // If booking exists, set lastBooked details
    setLastBooked({
      hotel: bookingData.hotel_id
        ? { id: bookingData.hotel_id, name: bookingData.hotel_name }
        : null,
      transport: bookingData.transport_id
        ? { id: bookingData.transport_id, name: bookingData.transport_provider }
        : null,
    });

    // Show review prompt
    setShowReviewPrompt(true);
  } catch (err) {
    console.warn('No last booking found or failed to fetch:', err.message);
    alert("You don't have any bookings to review. Logging out...");
    logout();
  }
};


  const handleSkipReview = () => {
    setShowReviewPrompt(false);
    logout();
  };

  const handleWriteReview = () => {
    setShowReviewPrompt(false);
    setShowReviewModal(true);
  };

  const handleReviewClose = () => {
    setShowReviewModal(false);
    logout();
  };

  // ✅ NEW: Handle add budget logic
  const handleAddBudget = async () => {
    try {
      if (!addAmount || addAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      const res = await api.addBudget(user.user_id, parseFloat(addAmount));
      user.budget = res.newBudget; // update local budget
      setShowAddBudgetModal(false);
      setAddAmount('');
      alert(`Budget updated! New balance: ₹${res.newBudget}`);
    } catch (error) {
      alert(error.message || "Failed to add budget.");
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Compass className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TravelExplorer
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink
                  active={page === 'cities'}
                  onClick={() => {
                    setSelectedCity(null);
                    setPage('cities');
                  }}
                >
                  Cities
                </NavLink>

                <NavLink
                  active={page === 'bookings'}
                  onClick={() => setPage('bookings')}
                >
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> My Bookings
                  </span>
                </NavLink>

                {/* ✅ Budget display with + icon */}
                <div className="flex items-center space-x-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-700 font-semibold">
                    ${user.budget}
                  </span>
                  <button
                    onClick={() => setShowAddBudgetModal(true)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Add funds"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ✅ Add Budget Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center animate-fadeIn">
            <h2 className="text-lg font-bold mb-3 text-purple-700">
              💰 Add Funds
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Enter the amount you want to add to your Wallet.
            </p>
            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowAddBudgetModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review prompt */}
      {showReviewPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Would you like to leave a review before logging out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleWriteReview}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Yes, Write Review
              </button>
              <button
                onClick={handleSkipReview}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewModal
          show={showReviewModal}
          onClose={handleReviewClose}
          user={user}
          entityIds={lastBooked}
        />
      )}
    </nav>
  );
}