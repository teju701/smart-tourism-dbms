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