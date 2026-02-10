// controllers/adminController.js
import pool from "../db/index.js";

// Get next ID helper
async function getNextId(table, idColumn) {
  const result = await pool.query(
    `SELECT COALESCE(MAX(${idColumn}), 0) + 1 AS next_id FROM ${table}`
  );
  return result.rows[0].next_id;
}

/* ==========================================================================
    ADD CITY
   ========================================================================== */
export async function addCity(req, res) {
  const { city_name, country, description } = req.body;

  try {
    const cityId = await getNextId("cities", "city_id");

    const result = await pool.query(
      `INSERT INTO cities (city_id, city_name, country, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cityId, city_name, country, description || null]
    );

    res.json({ message: "City added successfully", city: result.rows[0] });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add city: " + err.message,
    });
  }
}

/* ==========================================================================
    ADD HOTEL
   ========================================================================== */
export async function addHotel(req, res) {
  const { city_id, hotel_name, price_per_night, rating } = req.body;

  try {
    const hotelId = await getNextId("hotels", "hotel_id");

    const result = await pool.query(
      `INSERT INTO hotels (hotel_id, city_id, hotel_name, price_per_night, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [hotelId, city_id, hotel_name, price_per_night, rating || null]
    );

    res.json({ message: "Hotel added successfully", hotel: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add hotel: " + err.message });
  }
}

/* ==========================================================================
    ADD FOOD PLACE
   ========================================================================== */
export async function addFood(req, res) {
  const { city_id, food_name, cuisine, avg_cost, rating } = req.body;

  try {
    const foodId = await getNextId("foodplaces", "food_id");

    const result = await pool.query(
      `INSERT INTO foodplaces (food_id, city_id, food_name, cuisine, avg_cost, rating)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [foodId, city_id, food_name, cuisine || null, avg_cost || 0, rating || null]
    );

    res.json({ message: "Food place added successfully", food: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add food place: " + err.message });
  }
}

/* ==========================================================================
    ADD ATTRACTION
   ========================================================================== */
export async function addAttraction(req, res) {
  const { city_id, attraction_name, category, entry_fee, rating } = req.body;

  try {
    const attractionId = await getNextId("attractions", "attraction_id");

    const result = await pool.query(
      `INSERT INTO attractions (attraction_id, city_id, attraction_name, category, entry_fee, rating)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        attractionId,
        city_id,
        attraction_name,
        category || null,
        entry_fee || 0,
        rating || null,
      ]
    );

    res.json({ message: "Attraction added successfully", attraction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add attraction: " + err.message });
  }
}

/* ==========================================================================
    ADD TRANSPORT
   ========================================================================== */
export async function addTransport(req, res) {
  const { city_id, type, provider, cost } = req.body;

  try {
    const transportId = await getNextId("transport", "transport_id");

    const result = await pool.query(
      `INSERT INTO transport (transport_id, city_id, type, provider, cost)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [transportId, city_id, type, provider || null, cost]
    );

    res.json({ message: "Transport added successfully", transport: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add transport: " + err.message });
  }
}

/* ==========================================================================
    DELETE FUNCTIONS
   ========================================================================== */
export async function deleteCity(req, res) {
  try {
    await pool.query(`DELETE FROM cities WHERE city_id = $1`, [req.params.id]);
    res.json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete city: " + err.message });
  }
}

export async function deleteHotel(req, res) {
  try {
    await pool.query(`DELETE FROM hotels WHERE hotel_id = $1`, [req.params.id]);
    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hotel: " + err.message });
  }
}

export async function deleteFood(req, res) {
  try {
    await pool.query(`DELETE FROM foodplaces WHERE food_id = $1`, [req.params.id]);
    res.json({ message: "Food place deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete food place: " + err.message });
  }
}

export async function deleteAttraction(req, res) {
  try {
    await pool.query(`DELETE FROM attractions WHERE attraction_id = $1`, [
      req.params.id,
    ]);
    res.json({ message: "Attraction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete attraction: " + err.message });
  }
}

export async function deleteTransport(req, res) {
  try {
    await pool.query(`DELETE FROM transport WHERE transport_id = $1`, [
      req.params.id,
    ]);
    res.json({ message: "Transport deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transport: " + err.message });
  }
}

/* ==========================================================================
    LIST FUNCTIONS (for delete dropdowns)
   ========================================================================== */
export async function getHotelsList(req, res) {
  try {
    const result = await pool.query(
      `SELECT hotel_id, hotel_name, city_id FROM hotels ORDER BY hotel_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching hotels list:", err);
    res.status(500).json({ error: "Failed to fetch hotels list" });
  }
}

export async function getAttractionsList(req, res) {
  try {
    const result = await pool.query(
      `SELECT attraction_id, attraction_name, city_id FROM attractions ORDER BY attraction_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching attractions list:", err);
    res.status(500).json({ error: "Failed to fetch attractions list" });
  }
}

export async function getFoodList(req, res) {
  try {
    const result = await pool.query(
      `SELECT food_id, restaurant AS food_name, city_id 
       FROM foodplaces 
       ORDER BY restaurant`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching food list:", err);
    res.status(500).json({ error: "Failed to fetch food list" });
  }
}


export async function getTransportList(req, res) {
  try {
    const result = await pool.query(
      `SELECT transport_id, type, provider, city_id FROM transport ORDER BY type, provider`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transport list:", err);
    res.status(500).json({ error: "Failed to fetch transport list" });
  }
}