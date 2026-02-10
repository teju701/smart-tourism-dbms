// routes/admin.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import {
  addCity,
  addHotel,
  addFood,
  addAttraction,
  addTransport,
  deleteCity,
  deleteHotel,
  deleteFood,
  deleteAttraction,
  deleteTransport,
  getHotelsList,          // ADD THESE
  getAttractionsList,     // ADD THESE
  getFoodList,            // ADD THESE
  getTransportList        // ADD THESE
} from "../controllers/adminController.js";

const router = express.Router();

// middleware
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

function verifyAdmin(req, res, next) {
  const key = req.body.adminKey || req.body.adminSecret;
  if (!key || key !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Invalid Admin Secret Key" });
  }
  next();
}

// ADD routes
router.post("/add-city", verifyAdmin, addCity);
router.post("/add-hotel", verifyAdmin, addHotel);
router.post("/add-food", verifyAdmin, addFood);
router.post("/add-attraction", verifyAdmin, addAttraction);
router.post("/add-transport", verifyAdmin, addTransport);

// DELETE routes
router.delete("/delete-city/:id", verifyAdmin, deleteCity);
router.delete("/delete-hotel/:id", verifyAdmin, deleteHotel);
router.delete("/delete-food/:id", verifyAdmin, deleteFood);
router.delete("/delete-attraction/:id", verifyAdmin, deleteAttraction);
router.delete("/delete-transport/:id", verifyAdmin, deleteTransport);

// LIST routes (for delete dropdowns)
router.get("/hotels-list", getHotelsList);
router.get("/attractions-list", getAttractionsList);
router.get("/food-list", getFoodList);
router.get("/transport-list", getTransportList);

router.get("/cities-list", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT city_id, city_name FROM cities ORDER BY city_name`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});


export default router;