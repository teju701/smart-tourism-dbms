

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

   adminLogin: async (email, password, adminKey) => {
    const response = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, adminKey })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Admin login failed');
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

  addBudget: async (userId, amount) => {
  const response = await fetch(`${API_BASE}/users/add-budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add budget');
  }
  return await response.json();
},
  
  getCities: async (search = '') => {
    const url = search 
      ? `${API_BASE}/cities?search=${encodeURIComponent(search)}`
      : `${API_BASE}/cities`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return await response.json();
  },
  
  getHotels: async (cityId) => {
    const response = await fetch(`${API_BASE}/hotels/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    return await response.json();
  },
  
  getAttractions: async (cityId) => {
    const response = await fetch(`${API_BASE}/attractions/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch attractions');
    return await response.json();
  },
  
  getFoodplaces: async (cityId) => {
    const response = await fetch(`${API_BASE}/foodplaces/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch foodplaces');
    return await response.json();
  },
  
  getTransport: async (cityId) => {
    const response = await fetch(`${API_BASE}/transport/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch transport');
    return await response.json();
  },

  getTopHotels: async (cityId) => {
    const response = await fetch(`${API_BASE}/hotels/top/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch top hotels');
    return await response.json();
  },

  getTopAttractions: async (cityId) => {
    const response = await fetch(`${API_BASE}/attractions/top/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch top attractions');
    return await response.json();
  },

  getCheapestTransport: async (cityId) => {
    const response = await fetch(`${API_BASE}/transport/cheapest/${cityId}`);
    if (!response.ok) throw new Error('Failed to fetch cheapest transport');
    return await response.json();
  },
  
  createBooking: async (userId, transportId, hotelId,bookingDate) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        transport_id: transportId,
        hotel_id: hotelId,
        booking_date: bookingDate 
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Booking failed');
    }
    return await response.json();
  },

  cancelBooking: async (bookingId) => {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to cancel booking');
  return await res.json();
},


getLastBooking: async (userId) => {
  const res = await fetch(`${API_BASE}/bookings/last/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch last booking');
  return await res.json();
},


getUserBookings: async (userId) => {
  const res = await fetch(`${API_BASE}/bookings/user/${userId}`);
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: res.statusText }));
    throw new Error(err.error || 'Failed to fetch bookings');
  }
  return await res.json(); // returns array
},

// --- Reviews ---
  addReviewsBatch: async (reviewData) => {
    const response = await fetch(`${API_BASE}/reviews/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });

    // read response text safely
    const text = await response.text();
    let body = {};
    try { body = text ? JSON.parse(text) : {}; } catch (e) { body = { error: text }; }

    if (!response.ok) {
      // throw an Error whose message contains server-provided error (if any)
      throw new Error(body.error || 'Failed to add review');
    }
    return body;
  },

  getReviews: async (entityType, entityId) => {
    const response = await fetch(`${API_BASE}/reviews/${entityType}/${entityId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  },

  getUserReviews: async (userId) => {
    const response = await fetch(`${API_BASE}/reviews/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user reviews');
    return await response.json();
  },

  updateReview: async (reviewId, rating, comments) => {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comments }),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return await response.json();
  },

  deleteReview: async (reviewId) => {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return await response.json();
  },

  // Admin APIs
  admin: {
    adminAddCity: async (payload) => {
      const res = await fetch(`${API_BASE}/admin/add-city`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add city" }));
        throw new Error(errorData.error || "Failed to add city");
      }
      return await res.json();
    },

    adminAddHotel: async (payload) => {
      const res = await fetch(`${API_BASE}/admin/add-hotel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add hotel" }));
        throw new Error(errorData.error || "Failed to add hotel");
      }
      return await res.json();
    },

    adminAddFood: async (payload) => {
      const res = await fetch(`${API_BASE}/admin/add-food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add food" }));
        throw new Error(errorData.error || "Failed to add food");
      }
      return await res.json();
    },

    adminAddAttraction: async (payload) => {
      const res = await fetch(`${API_BASE}/admin/add-attraction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add attraction" }));
        throw new Error(errorData.error || "Failed to add attraction");
      }
      return await res.json();
    },

    adminAddTransport: async (payload) => {
      const res = await fetch(`${API_BASE}/admin/add-transport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add transport" }));
        throw new Error(errorData.error || "Failed to add transport");
      }
      return await res.json();
    },

    // DELETE APIs
    deleteCity: async (id, adminKey) => {
      const res = await fetch(`${API_BASE}/admin/delete-city/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete city" }));
        throw new Error(errorData.error || "Failed to delete city");
      }
      return await res.json();
    },

    deleteHotel: async (id, adminKey) => {
      const res = await fetch(`${API_BASE}/admin/delete-hotel/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete hotel" }));
        throw new Error(errorData.error || "Failed to delete hotel");
      }
      return await res.json();
    },

    deleteFood: async (id, adminKey) => {
      const res = await fetch(`${API_BASE}/admin/delete-food/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete food" }));
        throw new Error(errorData.error || "Failed to delete food");
      }
      return await res.json();
    },

    deleteAttraction: async (id, adminKey) => {
      const res = await fetch(`${API_BASE}/admin/delete-attraction/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete attraction" }));
        throw new Error(errorData.error || "Failed to delete attraction");
      }
      return await res.json();
    },

    deleteTransport: async (id, adminKey) => {
      const res = await fetch(`${API_BASE}/admin/delete-transport/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete transport" }));
        throw new Error(errorData.error || "Failed to delete transport");
      }
      return await res.json();
    },
  },

  // List functions for delete dropdown
  getHotelsList: async () => {
    const response = await fetch(`${API_BASE}/admin/hotels-list`);
    if (!response.ok) throw new Error('Failed to fetch hotels list');
    return await response.json();
  },

  getAttractionsList: async () => {
    const response = await fetch(`${API_BASE}/admin/attractions-list`);
    if (!response.ok) throw new Error('Failed to fetch attractions list');
    return await response.json();
  },

  getFoodList: async () => {
    const response = await fetch(`${API_BASE}/admin/food-list`);
    if (!response.ok) throw new Error('Failed to fetch food list');
    return await response.json();
  },

  getTransportList: async () => {
    const response = await fetch(`${API_BASE}/admin/transport-list`);
    if (!response.ok) throw new Error('Failed to fetch transport list');
    return await response.json();
  },
  getCitiesList: async () => {
  const res = await fetch(`${API_BASE}/admin/cities-list`);
  if (!res.ok) throw new Error("Failed to fetch cities list");
  return await res.json();
},


};



export default api;