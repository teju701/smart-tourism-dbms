CREATE OR REPLACE FUNCTION fn_get_hotels_by_budget(p_city_id INT, p_max_price NUMERIC)
RETURNS TABLE (
  hotel_id INT,
  hotel_name TEXT,
  price_per_night NUMERIC,
  rating NUMERIC
)
LANGUAGE sql AS $$
  SELECT hotel_id, hotel_name, price_per_night, rating
  FROM hotels
  WHERE city_id = p_city_id
    AND (p_max_price IS NULL OR price_per_night <= p_max_price)
  ORDER BY rating DESC NULLS LAST, price_per_night ASC
$$;

CREATE OR REPLACE FUNCTION get_hotels_by_city(p_city_id INT)
RETURNS TABLE(
	hotel_id INT,
	city_name TEXT,
	hotel_name VARCHAR(100),
	price_per_night numeric(10,2),
	rating numeric(10,2)
)

LANGUAGE sql AS $$
SELECT h.hotel_id, c.city_name, h.hotel_name, h.price_per_night, h.rating FROM hotels h 
INNER JOIN cities c ON c.city_id = h.city_id
WHERE h.city_id = p_city_id
ORDER BY price_per_night ASC;
$$;

CREATE OR REPLACE FUNCTION get_top_hotels_by_city(p_city_id INT)
RETURNS TABLE (
  hotel_name TEXT,
  rating NUMERIC,
  price_per_night NUMERIC
) 
LANGUAGE sql AS $$
  SELECT h.hotel_name, h.rating, h.price_per_night
  FROM hotels h
  WHERE h.city_id = p_city_id
  ORDER BY h.rating DESC, h.price_per_night DESC
  LIMIT 5;
$$;





CREATE OR REPLACE FUNCTION get_food_by_city(p_city_id INT)
RETURNS TABLE(
	food_id INT,
	city_name TEXT,
	restaurant VARCHAR(150),
	avg_cost numeric(10,2),
	rating numeric(2,1)
)

LANGUAGE sql AS $$
SELECT f.food_id, c.city_name, f.restaurant, f.avg_cost, f.rating FROM foodplaces f 
INNER JOIN cities c ON c.city_id = f.city_id
WHERE f.city_id = p_city_id
ORDER BY avg_cost ASC;
$$;

CREATE OR REPLACE FUNCTION get_attractions_by_city(p_city_id INT)
RETURNS TABLE (
  attraction_id INT,
  attraction_name TEXT,
  category TEXT,
  entry_fee NUMERIC,
  rating NUMERIC
)

LANGUAGE sql AS $$
  SELECT attraction_id, attraction_name, category, entry_fee, rating
  FROM attractions
  WHERE city_id = p_city_id
  ORDER BY entry_fee ASC NULLS FIRST, attraction_name
$$;


CREATE OR REPLACE FUNCTION get_top_attractions(p_city_id INT, p_limit INT DEFAULT 10)
RETURNS TABLE (
  attraction_id INT,
  attraction_name TEXT,
  category TEXT,
  entry_fee NUMERIC,
  rating NUMERIC
)

LANGUAGE sql AS $$
  SELECT attraction_id, attraction_name, category, entry_fee, rating
  FROM attractions
  WHERE city_id = p_city_id
  ORDER BY rating DESC
  LIMIT p_limit;
$$;


-- CREATE OR REPLACE FUNCTION fn_recommendation_summary(p_city_id INT, p_budget NUMERIC)
-- RETURNS JSONB
-- LANGUAGE plpgsql AS $$
-- DECLARE
--   hotels_json JSONB;
--   attractions_json JSONB;
-- BEGIN
--   SELECT jsonb_agg(to_jsonb(h) - 'city_id')
--   INTO hotels_json
--   FROM (
--     SELECT hotel_id, hotel_name, price_per_night, rating
--     FROM hotels
--     WHERE city_id = p_city_id
--       AND (p_budget IS NULL OR price_per_night <= p_budget)
--     ORDER BY rating DESC NULLS LAST
--     LIMIT 10
--   ) h;

--   SELECT jsonb_agg(to_jsonb(a) - 'city_id')
--   INTO attractions_json
--   FROM (
--     SELECT attraction_id, attraction_name, category, entry_fee
--     FROM attractions
--     WHERE city_id = p_city_id
--     ORDER BY entry_fee ASC NULLS FIRST
--     LIMIT 10
--   ) a;

--   RETURN jsonb_build_object(
--     'city_id', p_city_id,
--     'hotels', COALESCE(hotels_json, '[]'::jsonb),
--     'attractions', COALESCE(attractions_json, '[]'::jsonb)
--   );
-- END;
-- $$;


CREATE OR REPLACE FUNCTION compute_total_cost(p_transport_id INT, p_hotel_id INT)
RETURNS NUMERIC
LANGUAGE plpgsql AS $$
DECLARE
  t_cost NUMERIC := 0;
  h_price NUMERIC := 0;
BEGIN
  IF p_transport_id IS NOT NULL THEN
    SELECT cost INTO t_cost FROM transport WHERE transport_id = p_transport_id;
    IF t_cost IS NULL THEN t_cost := 0; END IF;

  END IF;

  IF p_hotel_id IS NOT NULL THEN
    SELECT price_per_night INTO h_price FROM hotels WHERE hotel_id = p_hotel_id;
    IF h_price IS NULL THEN h_price := 0; END IF;
  END IF;

  RETURN COALESCE(t_cost, 0) + COALESCE(h_price, 0);
END;
$$;


CREATE OR REPLACE FUNCTION get_cheapest_transport(p_city_id INT)
RETURNS TABLE (
  type TEXT,
  provider TEXT,
  cost NUMERIC
)
AS $$
BEGIN
  RETURN QUERY
  SELECT type, provider, cost
  FROM transport
  WHERE city_id = p_city_id
  ORDER BY cost ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE FUNCTION fn_create_booking(p_user_id INT, p_transport_id INT, p_hotel_id INT)
RETURNS INT
LANGUAGE plpgsql AS $$
DECLARE
  v_total NUMERIC;
  v_user_budget NUMERIC;
  v_booking_id INT;
BEGIN
  -- calculate total
  v_total := compute_total_cost(p_transport_id, p_hotel_id);

  -- check user exists and budget
  SELECT budget INTO v_user_budget FROM users WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', p_user_id;
  END IF;

  IF v_user_budget IS NOT NULL AND v_user_budget < v_total THEN
    RAISE EXCEPTION 'Insufficient budget: user budget = %, required = %', v_user_budget, v_total;
  END IF;

  -- start atomic operation
  PERFORM pg_advisory_xact_lock(p_user_id); -- optional small lock per user to avoid concurrent bookings race

  INSERT INTO bookings (user_id, transport_id, hotel_id, booking_date, total_cost)
  VALUES (p_user_id, p_transport_id, p_hotel_id, NOW(), v_total)
  RETURNING booking_id INTO v_booking_id;

  -- Optionally reduce user's budget (keep this if you want)
  UPDATE users SET budget = budget - v_total WHERE user_id = p_user_id;

  -- Insert audit
  INSERT INTO bookings_audit (booking_id, user_id, transport_id, hotel_id, total_cost, action)
  VALUES (v_booking_id, p_user_id, p_transport_id, p_hotel_id, v_total, 'INSERT');

  RETURN v_booking_id;
END;
$$;


CREATE OR REPLACE FUNCTION cancel_booking(p_booking_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id INT;
  v_total_cost NUMERIC;

BEGIN
  -- Get user_id and total cost before deleting
  SELECT user_id, total_cost INTO v_user_id, v_total_cost
  FROM bookings
  WHERE booking_id = p_booking_id;

  -- Refund user
  UPDATE users
  SET budget = budget + v_total_cost
  WHERE user_id = v_user_id;

  -- Delete the booking
  DELETE FROM bookings WHERE booking_id = p_booking_id;
END;
$$;


DROP FUNCTION IF EXISTS get_last_booking(INT);

CREATE OR REPLACE FUNCTION get_last_booking(p_user_id INT)
RETURNS TABLE (
  booking_id INT,
  user_id INT,
  hotel_id INT,
  transport_id INT,
  total_cost NUMERIC,
  hotel_name TEXT,
  transport_provider TEXT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.booking_id,
    b.user_id,
    b.hotel_id,
    b.transport_id,
    b.total_cost,
    h.hotel_name::TEXT,       -- ✅ cast varchar → text
    t.provider::TEXT          -- ✅ cast varchar → text
    
  FROM bookings b
  LEFT JOIN hotels h ON b.hotel_id = h.hotel_id
  LEFT JOIN transport t ON b.transport_id = t.transport_id
  WHERE b.user_id = p_user_id
  ORDER BY b.booking_id DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;


DROP FUNCTION IF EXISTS get_bookings_by_user(INT);

CREATE OR REPLACE FUNCTION get_bookings_by_user(p_user_id INT)
RETURNS TABLE (
  booking_id INT,
  booking_date TIMESTAMP,
  hotel_id INT,
  hotel_name TEXT,
  transport_id INT,
  transport_provider TEXT,
  total_cost NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.booking_id::INT,
    b.booking_date::TIMESTAMP,
    b.hotel_id::INT,
    COALESCE(h.hotel_name, '')::TEXT AS hotel_name,
    b.transport_id::INT,
    COALESCE(t.provider, '')::TEXT AS transport_provider,
    b.total_cost::NUMERIC
  FROM bookings b
  LEFT JOIN hotels h ON b.hotel_id = h.hotel_id
  LEFT JOIN transport t ON b.transport_id = t.transport_id
  WHERE b.user_id = p_user_id
  ORDER BY b.booking_date DESC;
END;
$$;
