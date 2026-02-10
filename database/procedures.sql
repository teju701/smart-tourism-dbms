-- create procedure add_new_hotel
CREATE OR REPLACE PROCEDURE add_new_hotel(
  p_city_id    INT,
  p_hotel_name TEXT,
  p_price      NUMERIC,
  p_rating     NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- basic validations
  IF p_hotel_name IS NULL OR trim(p_hotel_name) = '' THEN
    RAISE EXCEPTION 'hotel_name cannot be null or empty';
  END IF;

  IF p_price IS NOT NULL AND p_price < 0 THEN
    RAISE EXCEPTION 'price_per_night must be >= 0';
  END IF;

  IF p_rating IS NOT NULL AND (p_rating < 0 OR p_rating > 5) THEN
    RAISE EXCEPTION 'rating must be between 0 and 5';
  END IF;

  -- ensure city exists
  IF NOT EXISTS (SELECT 1 FROM cities WHERE city_id = p_city_id) THEN
    RAISE EXCEPTION 'City id % does not exist', p_city_id;
  END IF;

  -- insert
  INSERT INTO hotels (city_id, hotel_name, price_per_night, rating)
  VALUES (p_city_id, p_hotel_name, p_price, p_rating);

  -- optional notice for quick manual testing
  RAISE NOTICE 'Hotel "%" inserted for city_id %', p_hotel_name, p_city_id;
END;
$$;



-- create procedure add_new_foodplace
CREATE OR REPLACE PROCEDURE add_new_foodplace(
  p_city_id    INT,
  restaurant_name TEXT,
  food_cost     NUMERIC,
  p_rating     NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- basic validations
  IF restaurant_name IS NULL OR trim(restaurant_name) = '' THEN
    RAISE EXCEPTION 'hrestaurant_name cannot be null or empty';
  END IF;

  IF food_cost IS NOT NULL AND food_cost < 0 THEN
    RAISE EXCEPTION 'food_cost must be >= 0';
  END IF;

  IF p_rating IS NOT NULL AND (p_rating < 0 OR p_rating > 5) THEN
    RAISE EXCEPTION 'rating must be between 0 and 5';
  END IF;

  -- ensure city exists
  IF NOT EXISTS (SELECT 1 FROM cities WHERE city_id = p_city_id) THEN
    RAISE EXCEPTION 'City id % does not exist', p_city_id;
  END IF;

  -- insert
  INSERT INTO foodplaces (city_id, restaurant, avg_cost, rating)
  VALUES (p_city_id, restaurant_name, food_cost, p_rating);

  -- optional notice for quick manual testing
  RAISE NOTICE 'FoodPlace "%" inserted for city_id %', restaurant_name, p_city_id;
END;
$$;



-- (b) Batch insert procedure: accepts a user_id and a JSONB array of reviews
CREATE OR REPLACE PROCEDURE add_reviews_batch(p_user_id INT, p_reviews JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
  r JSONB;
  v_entity_type TEXT;
  v_entity_id INT;
  v_rating NUMERIC(2,1);
  v_comments TEXT;
BEGIN
  -- start transaction block is implicit for CALL (but we still rely on exceptions to abort)
  FOR r IN SELECT * FROM jsonb_array_elements(p_reviews)
  LOOP
    v_entity_type := (r ->> 'entity_type')::text;
    v_entity_id   := (r ->> 'entity_id')::int;
    v_rating      := (r ->> 'rating')::numeric;
    v_comments    := (r ->> 'comments');

    -- basic validation: entity_type allowed
    IF v_entity_type NOT IN ('hotel', 'foodplace', 'attraction', 'transport') THEN
      RAISE EXCEPTION 'Invalid entity_type: %', v_entity_type;
    END IF;

    -- require entity_id and rating (rating may be 0 or null if you allowed; here we require rating not null)
    IF v_entity_id IS NULL THEN
      RAISE EXCEPTION 'entity_id is required for each review';
    END IF;

    IF v_rating IS NULL THEN
      RAISE EXCEPTION 'rating is required for each review';
    END IF;

    -- insert
    INSERT INTO reviews (user_id, entity_type, entity_id, rating, comments)
    VALUES (p_user_id, v_entity_type, v_entity_id, v_rating, NULLIF(v_comments, ''));
  END LOOP;
END;
$$;