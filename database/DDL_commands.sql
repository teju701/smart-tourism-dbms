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

--creation of temporary table staging_cities
CREATE TABLE public.staging_cities (
    id text,
    city character varying(100),
    country character varying(100),
    region character varying(100),
    short_description text,
    latitude numeric,
    longitude numeric,
    avg_temp_monthly text,
    ideal_durations text,
    budget_level character varying(50),
    culture numeric,
    adventure numeric,
    nature numeric,
    beaches numeric,
    nightlife numeric,
    cuisine numeric,
    wellness numeric,
    urban numeric,
    seclusion numeric,
    real_city_id integer
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


--creation of bookings_audit table
CREATE TABLE IF NOT EXISTS bookings_audit(
	audit_id SERIAL PRIMARY KEY,
	booking_id INT,
	user_id INT,
	transport_id INT,
	hotel_id INT,
	total_cost NUMERIC(10,2),
	action_time TIMESTAMP DEFAULT now(),
	action TEXT

);

ALTER TABLE attractions
ADD COLUMN rating NUMERIC(2,1)
CHECK (rating >= 0 AND rating <= 5);

UPDATE attractions
SET rating = ROUND((RANDOM() * 4 + 1)::numeric, 1);


