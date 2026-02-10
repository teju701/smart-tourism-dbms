CREATE VIEW city_summary AS
SELECT
  c.city_id,
  c.city_name,
  c.country,
  COUNT(DISTINCT h.hotel_id)     AS hotels_count,
  COALESCE(ROUND(AVG(h.price_per_night)::NUMERIC, 2), 0) AS avg_hotel_price,
  COALESCE(ROUND(AVG(h.rating)::NUMERIC, 2), 0) AS avg_hotel_rating,
  COUNT(DISTINCT a.attraction_id) AS attractions_count,
  COUNT(DISTINCT f.food_id)       AS foodplaces_count
FROM cities c
LEFT JOIN hotels h       ON h.city_id = c.city_id
LEFT JOIN attractions a  ON a.city_id = c.city_id
LEFT JOIN foodplaces f   ON f.city_id = c.city_id
GROUP BY c.city_id, c.city_name, c.country;



CREATE OR REPLACE VIEW hotel_details AS
SELECT
  h.hotel_id,
  h.hotel_name,
  h.city_id,
  c.city_name,
  h.price_per_night,
  h.rating AS hotel_rating,
  COALESCE(rv.avg_rating, 0) AS avg_review_rating,
  h.price_per_night
FROM hotels h
JOIN cities c ON c.city_id = h.city_id
LEFT JOIN (
  SELECT entity_id AS hotel_id, ROUND(AVG(rating)::NUMERIC,2) AS avg_rating
  FROM reviews
  WHERE LOWER(entity_type) = 'hotel'
  GROUP BY entity_id
) rv ON rv.hotel_id = h.hotel_id;
