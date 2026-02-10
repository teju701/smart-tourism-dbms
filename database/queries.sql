--Table Creation:
--1) Users:
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,             
    name VARCHAR(100) NOT NULL,             
    email VARCHAR(100) UNIQUE NOT NULL,      
    password VARCHAR(100) NOT NULL,          
    budget NUMERIC(10,2) CHECK (budget >= 0) 
);

--2)Cities:
CREATE TABLE Cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT
);

--3)hotels:
CREATE TABLE Hotels (
    hotel_id SERIAL PRIMARY KEY,
    city_id INT NOT NULL,
    hotel_name VARCHAR(150) NOT NULL,
    price_per_night NUMERIC(10,2) CHECK (price_per_night > 0),
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE CASCADE
);

--4)foodplaces:
CREATE TABLE FoodPlaces (
    food_id SERIAL PRIMARY KEY,
    city_id INT NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    cuisine VARCHAR(100),
    avg_cost NUMERIC(10,2) CHECK (avg_cost >= 0),
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE CASCADE
);

--5)Attractions:
CREATE TABLE Attractions (
    attraction_id SERIAL PRIMARY KEY,
    city_id INT NOT NULL,
    attraction_name VARCHAR(150) NOT NULL,
    category VARCHAR(100), -- e.g. "historical", "adventure"
    entry_fee NUMERIC(10,2) DEFAULT 0 CHECK (entry_fee >= 0),
    FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE CASCADE
);

--6)Transport:
CREATE TABLE Transport (
    transport_id SERIAL PRIMARY KEY,
    city_id INT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Bus','Train','Flight','Cab')), -- domain constraint
    provider VARCHAR(100),
    cost NUMERIC(10,2) CHECK (cost > 0),
    FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE CASCADE
);

--7. Bookings (weak entity, requires user + transport/hotel):
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT,
    transport_id INT,
    booking_date DATE DEFAULT CURRENT_DATE,
    total_cost NUMERIC(10,2) CHECK (total_cost >= 0),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
);

--8) Reviews:
CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    entity_type VARCHAR(20) CHECK (entity_type IN ('Hotel','Attraction','Food')),
    entity_id INT NOT NULL,  -- points to one of hotel/attraction/food
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


--Creation of temporary table staging_palces
CREATE TABLE staging_places (
  place_id TEXT PRIMARY KEY,
  name TEXT,
  categories TEXT[],
  city_id TEXT,
  lat NUMERIC,
  lon NUMERIC,
  address TEXT,
  country TEXT,
  raw JSONB,
  fetched_at TIMESTAMP DEFAULT now()
);

-- Add a helper column in staging_cities to store the new ID
ALTER TABLE staging_cities ADD COLUMN IF NOT EXISTS real_city_id INT;

-- Map by matching name and country
UPDATE staging_cities s
SET real_city_id = c.city_id
FROM cities c
WHERE LOWER(TRIM(s.city)) = LOWER(TRIM(c.city_name))
  AND LOWER(TRIM(s.country)) = LOWER(TRIM(c.country));


--populating data fetched from API 

--populating hotels table
INSERT INTO hotels (hotel_name, city_id, price_per_night, rating)
SELECT
  name,
  c.real_city_id,
  ROUND((RANDOM() * 400 + 100)::NUMERIC, 2) AS price_per_night,
  COALESCE(
    NULLIF(
      REGEXP_REPLACE(raw->'properties'->'accommodation'->>'stars', '[^0-9\.]', '', 'g'),
      ''
    )::NUMERIC,
    ROUND((RANDOM() * 4 + 1)::NUMERIC, 1)
  ) AS rating
FROM staging_places p
JOIN staging_cities c ON p.city_id = c.id
WHERE p.categories @> '{accommodation.hotel}'
  AND c.real_city_id IS NOT NULL
  AND name IS NOT NULL;  --skip invalid records

--populating foodplaces table
INSERT INTO foodplaces (food_name, city_id, cuisine, avg_cost, rating)
SELECT
  COALESCE(p.name, 'Unnamed Restaurant') AS food_name,
  c.real_city_id,
  NULL AS cuisine, 
  ROUND((RANDOM() * 100 + 50)::NUMERIC, 2) AS avg_cost,  -- random 50–150 range
  ROUND((RANDOM() * 4 + 1)::NUMERIC, 1) AS rating         -- random rating 1–5
FROM staging_places p
JOIN staging_cities c ON p.city_id = c.id
WHERE p.categories @> '{catering.restaurant}'   -- only restaurants
  AND c.real_city_id IS NOT NULL
  AND p.name IS NOT NULL;

ALTER TABLE foodplaces
RENAME COLUMN food_name to restaurant;

--populating attractions table
INSERT INTO attractions (attraction_name, city_id, category, entry_fee)
SELECT
  COALESCE(p.name, 'Unnamed Attraction') AS attraction_name,
  c.real_city_id,
  'Tourist Spot' AS category,
  ROUND((RANDOM() * 20)::NUMERIC, 2) AS entry_fee  -- random entry fee between 0–20
FROM staging_places p
JOIN staging_cities c ON p.city_id = c.id
WHERE p.categories @> '{tourism}'
  AND c.real_city_id IS NOT NULL
  AND p.name IS NOT NULL;



INSERT INTO transport (city_id, type, provider, cost)
SELECT
  c.city_id,
  t.type,
  CASE
    WHEN t.type = 'Bus' THEN ('CityLink' || FLOOR(RANDOM() * 10)::TEXT)
    WHEN t.type = 'Train' THEN ('RailConnect' || FLOOR(RANDOM() * 5)::TEXT)
    WHEN t.type = 'Flight' THEN ('SkyJet Airways' || FLOOR(RANDOM() * 5)::TEXT)
    ELSE ('QuickRide' || FLOOR(RANDOM() * 20)::TEXT)
  END,
  ROUND((RANDOM() * 400 + 100)::NUMERIC, 2)
FROM cities c
CROSS JOIN (
  VALUES ('Bus'), ('Train'), ('Flight'), ('Cab')
) AS t(type);












