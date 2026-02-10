import axios from "axios";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const API_KEY = process.env.GEOAPIFY_KEY;

// Function to fetch places for a given city and category
async function fetchPlaces(city, category) {
  const { id: city_id, city: city_name, latitude, longitude } = city;
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${longitude},${latitude},15000&limit=20&apiKey=${API_KEY}`;

  const res = await axios.get(url);
  const features = res.data.features || [];

  for (const f of features) {
    const p = f.properties;
    await pool.query(
      `
      INSERT INTO staging_places (place_id, name, categories, city_id, lat, lon, address, country, raw)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (place_id) DO NOTHING;
      `,
      [
        p.place_id,
        p.name || null,
        p.categories || [],
        city_id,
        f.geometry.coordinates[1],
        f.geometry.coordinates[0],
        p.formatted || null,
        p.country || null,
        f,
      ]
    );
  }

  console.log(`Fetched ${features.length} ${category} for ${city_name}`);
}

// Main runner function
async function run() {
  // ✅ Fixed aliases here
  const cities = await pool.query(
    `SELECT id, city, latitude, longitude FROM staging_cities WHERE latitude IS NOT NULL AND longitude IS NOT NULL`
  );

  const categories = [
    "accommodation.hotel",
    "catering.restaurant",
    "tourism",
  ];

  for (const city of cities.rows) {
    for (const cat of categories) {
      try {
        await fetchPlaces(city, cat);
        await new Promise((r) => setTimeout(r, 1000)); // 1s delay
      } catch (err) {
        console.error(`Error fetching ${cat} for ${city.city}:`, err.message);
      }
    }
  }

  console.log("✅ Data fetching completed!");
  await pool.end();
}

run();
