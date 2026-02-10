import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FaCity,
  FaHotel,
  FaUtensils,
  FaBus,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaTools,
  FaTrash,
} from "react-icons/fa";

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
    />
  </div>
);

const FormWrapper = ({ title, children, onSubmit, submitLabel = "Submit" }) => (
  <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl mx-auto transform transition-all">
    <h2 className="text-3xl font-extrabold mb-6 text-purple-700 flex items-center gap-3">
      <FaTools /> <span>{title}</span>
    </h2>
    <div className="space-y-3">{children}</div>
    {onSubmit && (
      <button
        onClick={onSubmit}
        className="w-full mt-5 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md"
      >
        {submitLabel}
      </button>
    )}
  </div>
);

export default function AdminDashboard({ user, setPage, logout }) {
  const adminKey = user?.adminKey || "";

  const [activeTab, setActiveTab] = useState("city");
  const [message, setMessage] = useState("");

  // master lists
  const [cities, setCities] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [attractionsList, setAttractionsList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [transportList, setTransportList] = useState([]);

  // forms
  const [forms, setForms] = useState({
    city: { city_name: "", country: "", description: "" },
    hotel: { city_id: "", hotel_name: "", price_per_night: "", rating: "" },
    attraction: { city_id: "", attraction_name: "", category: "", entry_fee: "", rating: "" },
    food: { city_id: "", food_name: "", cuisine: "", avg_cost: "", rating: "" },
    transport: { city_id: "", type: "", provider: "", cost: "" },
  });

  // delete selections
  const [toDelete, setToDelete] = useState({
    city: "",
    hotel: "",
    attraction: "",
    food: "",
    transport: "",
  });

  // helper to update forms
  const updateForm = (formName, field, value) =>
    setForms((p) => ({ ...p, [formName]: { ...p[formName], [field]: value } }));

  // helper to clear a form
  const clearForm = (formName) =>
    setForms((p) => ({
      ...p,
      [formName]:
        formName === "city"
          ? { city_name: "", country: "", description: "" }
          : formName === "hotel"
          ? { city_id: "", hotel_name: "", price_per_night: "", rating: "" }
          : formName === "attraction"
          ? { city_id: "", attraction_name: "", category: "", entry_fee: "", rating: "" }
          : formName === "food"
          ? { city_id: "", food_name: "", cuisine: "", avg_cost: "", rating: "" }
          : { city_id: "", type: "", provider: "", cost: "" },
    }));

  // fetch master lists
  async function loadAllLists() {
    try {
      const [citiesResp, hotelsResp, attractionsResp, foodResp, transportResp] = await Promise.all([
        api.getCities(),
        api.getHotelsList().catch(() => []),
        api.getAttractionsList().catch(() => []),
        api.getFoodList().catch(() => []),
        api.getTransportList().catch(() => []),
      ]);
      setCities(Array.isArray(citiesResp) ? citiesResp : []);
      setHotelsList(Array.isArray(hotelsResp) ? hotelsResp : []);
      setAttractionsList(Array.isArray(attractionsResp) ? attractionsResp : []);
      setFoodList(Array.isArray(foodResp) ? foodResp : []);
      setTransportList(Array.isArray(transportResp) ? transportResp : []);
    } catch (err) {
      console.error("Failed to load lists:", err);
      setMessage("❌ Failed to load lists: " + (err.message || err));
    }
  }

  useEffect(() => {
    loadAllLists();
  }, []);

  // when delete tab opens refresh lists
  useEffect(() => {
    if (activeTab === "delete") loadAllLists();
  }, [activeTab]);

  const withKey = (payload) => ({ ...payload, adminKey });

  // ADD handlers
  const submitCity = async () => {
    try {
      await api.admin.adminAddCity(withKey(forms.city));
      setMessage("🌆 City added!");
      await loadAllLists();
      clearForm("city");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || err));
    }
  };

  const submitHotel = async () => {
    try {
      await api.admin.adminAddHotel(withKey(forms.hotel));
      setMessage("🏨 Hotel added!");
      await loadAllLists();
      clearForm("hotel");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || err));
    }
  };

  const submitAttraction = async () => {
    try {
      await api.admin.adminAddAttraction(withKey(forms.attraction));
      setMessage("🎡 Attraction added!");
      await loadAllLists();
      clearForm("attraction");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || err));
    }
  };

  const submitFood = async () => {
    try {
      await api.admin.adminAddFood(withKey(forms.food));
      setMessage("🍽️ Food place added!");
      await loadAllLists();
      clearForm("food");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || err));
    }
  };

  const submitTransport = async () => {
    try {
      await api.admin.adminAddTransport(withKey(forms.transport));
      setMessage("🚌 Transport added!");
      await loadAllLists();
      clearForm("transport");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || err));
    }
  };

  // DELETE handler
  const handleDelete = async (type) => {
    try {
      const id = toDelete[type];
      if (!id) {
        setMessage("❌ Please select an item to delete.");
        return;
      }

      // confirmation (simple)
      if (!window.confirm("Are you sure you want to delete the selected item?")) return;

      if (type === "city") await api.admin.deleteCity(id, adminKey);
      if (type === "hotel") await api.admin.deleteHotel(id, adminKey);
      if (type === "attraction") await api.admin.deleteAttraction(id, adminKey);
      if (type === "food") await api.admin.deleteFood(id, adminKey);
      if (type === "transport") await api.admin.deleteTransport(id, adminKey);

      setMessage("🗑️ Deleted successfully!");
      // refresh lists
      await loadAllLists();
      // reset selection
      setToDelete((p) => ({ ...p, [type]: "" }));
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Delete failed: " + (err.message || err));
    }
  };

  // UI helpers: map lists to option elements
  const renderCityOptions = () =>
    cities.map((c) => (
      <option key={c.city_id} value={c.city_id}>
        {c.city_name} (ID: {c.city_id})
      </option>
    ));

  const renderHotelOptions = () =>
    hotelsList.map((h) => (
      <option key={h.hotel_id} value={h.hotel_id}>
        {h.hotel_name} (ID: {h.hotel_id}) — City: {h.city_id}
      </option>
    ));

  const renderAttractionOptions = () =>
    attractionsList.map((a) => (
      <option key={a.attraction_id} value={a.attraction_id}>
        {a.attraction_name} (ID: {a.attraction_id}) — City: {a.city_id}
      </option>
    ));

  const renderFoodOptions = () =>
    foodList.map((f) => (
      <option key={f.food_id} value={f.food_id}>
        {f.food_name || f.restaurant} (ID: {f.food_id}) — City: {f.city_id}
      </option>
    ));

  const renderTransportOptions = () =>
    transportList.map((t) => (
      <option key={t.transport_id} value={t.transport_id}>
        {t.type} - {t.provider} (ID: {t.transport_id}) — City: {t.city_id}
      </option>
    ));

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-white to-blue-100">
      {/* SIDEBAR */}
      <div className="w-72 bg-white shadow-2xl p-6 border-r border-gray-200">
        <h1 className="text-2xl font-extrabold text-purple-700 mb-8">Tourism Admin Panel</h1>

        <div className="space-y-3">
          {[
            { id: "city", label: "Add City", icon: <FaCity /> },
            { id: "hotel", label: "Add Hotel", icon: <FaHotel /> },
            { id: "attraction", label: "Add Attraction", icon: <FaMapMarkedAlt /> },
            { id: "food", label: "Add Restaurant", icon: <FaUtensils /> },
            { id: "transport", label: "Add Transport", icon: <FaBus /> },
            { id: "delete", label: "Delete Data", icon: <FaTrash /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-all shadow-sm ${
                activeTab === tab.id ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          <button
            onClick={() => {
              logout();
              setPage("home");
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg font-bold bg-red-500 text-white hover:bg-red-600 mt-10 shadow-md"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-md ${
              message.startsWith("❌") ? "bg-red-100 text-red-800 border border-red-400" : "bg-green-100 text-green-800 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Add City */}
        {activeTab === "city" && (
          <FormWrapper title="Add City" onSubmit={submitCity} submitLabel="Add City">
            <Input label="City Name" value={forms.city.city_name} onChange={(v) => updateForm("city", "city_name", v)} />
            <Input label="Country" value={forms.city.country} onChange={(v) => updateForm("city", "country", v)} />
            <Input label="Description" value={forms.city.description} onChange={(v) => updateForm("city", "description", v)} />
          </FormWrapper>
        )}

        {/* Add Hotel */}
        {activeTab === "hotel" && (
          <FormWrapper title="Add Hotel" onSubmit={submitHotel} submitLabel="Add Hotel">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select City</label>
              <select value={forms.hotel.city_id} onChange={(e) => updateForm("hotel", "city_id", e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg">
                <option value="">Choose city...</option>
                {renderCityOptions()}
              </select>
            </div>
            <Input label="Hotel Name" value={forms.hotel.hotel_name} onChange={(v) => updateForm("hotel", "hotel_name", v)} />
            <Input type="number" label="Price Per Night" value={forms.hotel.price_per_night} onChange={(v) => updateForm("hotel", "price_per_night", v)} />
            <Input type="number" label="Rating (0-5)" value={forms.hotel.rating} onChange={(v) => updateForm("hotel", "rating", v)} />
          </FormWrapper>
        )}

        {/* Add Attraction */}
        {activeTab === "attraction" && (
          <FormWrapper title="Add Attraction" onSubmit={submitAttraction} submitLabel="Add Attraction">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select City</label>
              <select value={forms.attraction.city_id} onChange={(e) => updateForm("attraction", "city_id", e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg">
                <option value="">Choose city...</option>
                {renderCityOptions()}
              </select>
            </div>
            <Input label="Attraction Name" value={forms.attraction.attraction_name} onChange={(v) => updateForm("attraction", "attraction_name", v)} />
            <Input label="Category" value={forms.attraction.category} onChange={(v) => updateForm("attraction", "category", v)} />
            <Input type="number" label="Entry Fee" value={forms.attraction.entry_fee} onChange={(v) => updateForm("attraction", "entry_fee", v)} />
            <Input type="number" label="Rating (0-5)" value={forms.attraction.rating} onChange={(v) => updateForm("attraction", "rating", v)} />
          </FormWrapper>
        )}

        {/* Add Food */}
        {activeTab === "food" && (
          <FormWrapper title="Add Restaurant" onSubmit={submitFood} submitLabel="Add Restaurant">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select City</label>
              <select value={forms.food.city_id} onChange={(e) => updateForm("food", "city_id", e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg">
                <option value="">Choose city...</option>
                {renderCityOptions()}
              </select>
            </div>
            <Input label="Restaurant Name" value={forms.food.food_name} onChange={(v) => updateForm("food", "food_name", v)} />
            <Input label="Cuisine" value={forms.food.cuisine} onChange={(v) => updateForm("food", "cuisine", v)} />
            <Input type="number" label="Avg Cost" value={forms.food.avg_cost} onChange={(v) => updateForm("food", "avg_cost", v)} />
            <Input type="number" label="Rating (0-5)" value={forms.food.rating} onChange={(v) => updateForm("food", "rating", v)} />
          </FormWrapper>
        )}

        {/* Add Transport */}
        {activeTab === "transport" && (
          <FormWrapper title="Add Transport" onSubmit={submitTransport} submitLabel="Add Transport">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select City</label>
              <select value={forms.transport.city_id} onChange={(e) => updateForm("transport", "city_id", e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg">
                <option value="">Choose city...</option>
                {renderCityOptions()}
              </select>
            </div>
            <Input label="Type (Bus, Train, Flight, Cab)" value={forms.transport.type} onChange={(v) => updateForm("transport", "type", v)} />
            <Input label="Provider" value={forms.transport.provider} onChange={(v) => updateForm("transport", "provider", v)} />
            <Input type="number" label="Cost" value={forms.transport.cost} onChange={(v) => updateForm("transport", "cost", v)} />
          </FormWrapper>
        )}

        {/* DELETE PANEL */}
        {activeTab === "delete" && (
          <FormWrapper title="Delete Records">
            {/* City */}
            <h3 className="text-xl mt-2 mb-2 font-semibold">Delete City</h3>
            <select className="w-full border p-3 rounded-lg" value={toDelete.city} onChange={(e) => setToDelete((p) => ({ ...p, city: e.target.value }))}>
              <option value="">Select City</option>
              {renderCityOptions()}
            </select>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleDelete("city")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTrash /> Delete City</button>
            </div>

            {/* Hotel */}
            <h3 className="text-xl mt-6 mb-2 font-semibold">Delete Hotel</h3>
            <select className="w-full border p-3 rounded-lg" value={toDelete.hotel} onChange={(e) => setToDelete((p) => ({ ...p, hotel: e.target.value }))}>
              <option value="">Select Hotel</option>
              {renderHotelOptions()}
            </select>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleDelete("hotel")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTrash /> Delete Hotel</button>
            </div>

            {/* Attraction */}
            <h3 className="text-xl mt-6 mb-2 font-semibold">Delete Attraction</h3>
            <select className="w-full border p-3 rounded-lg" value={toDelete.attraction} onChange={(e) => setToDelete((p) => ({ ...p, attraction: e.target.value }))}>
              <option value="">Select Attraction</option>
              {renderAttractionOptions()}
            </select>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleDelete("attraction")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTrash /> Delete Attraction</button>
            </div>

            {/* Food */}
            <h3 className="text-xl mt-6 mb-2 font-semibold">Delete Restaurant</h3>
            <select className="w-full border p-3 rounded-lg" value={toDelete.food} onChange={(e) => setToDelete((p) => ({ ...p, food: e.target.value }))}>
              <option value="">Select Food</option>
              {renderFoodOptions()}
            </select>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleDelete("food")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTrash /> Delete Food</button>
            </div>

            {/* Transport */}
            <h3 className="text-xl mt-6 mb-2 font-semibold">Delete Transport</h3>
            <select className="w-full border p-3 rounded-lg" value={toDelete.transport} onChange={(e) => setToDelete((p) => ({ ...p, transport: e.target.value }))}>
              <option value="">Select Transport</option>
              {renderTransportOptions()}
            </select>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleDelete("transport")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTrash /> Delete Transport</button>
            </div>
          </FormWrapper>
        )}
      </div>
    </div>
  );
}