// ✅ imageAPI.js
// Works with backend proxy (http://localhost:5000/api/images/*)
// Adds randomization + caching + variety for hotels, attractions, and restaurants

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";
const DEFAULT_HOTEL_IMG =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200";
const DEFAULT_ATTRACTION_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";
const DEFAULT_RESTAURANT_IMG =
  "https://images.unsplash.com/photo-1555992336-cbfdbcad2533?q=80&w=1200";

const STATIC_CITY_IMAGES = {
  Mumbai: "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200",
  "New York": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
  Bengaluru: "https://images.unsplash.com/photo-1617957743052-2a4a93cbbc72?q=80&w=1200",
  Delhi: "https://images.unsplash.com/photo-1602928323706-6b0dcb9890e7?q=80&w=1200",
  Tokyo: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200",
};

// ✅ Helper: fetch with cache
async function fetchWithCache(cacheKey, fetchFn, fallback) {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const cacheAge = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
      if (cacheAge < 7) return parsed.url;
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const url = (await fetchFn()) || fallback;
  localStorage.setItem(cacheKey, JSON.stringify({ url, timestamp: Date.now() }));
  return url;
}

// ✅ City Images (Unsplash + Pexels proxy)
export async function getCityImage(cityName) {
  const cacheKey = `city_image_${cityName}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const age = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
      if (age < 7) return parsed.url;
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const randomPage = Math.floor(Math.random() * 5) + 1;
  const query = `${cityName} city skyline`;

  try {
    const [unsplash, pexels] = await Promise.allSettled([
      fetch(`http://localhost:5000/api/images/unsplash?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`),
      fetch(`http://localhost:5000/api/images/pexels?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`)
    ]);

    const unsplashData = unsplash.value && unsplash.value.ok ? await unsplash.value.json() : {};
    const pexelsData = pexels.value && pexels.value.ok ? await pexels.value.json() : {};

    const idx1 = Math.floor(Math.random() * (unsplashData.results?.length || 1));
    const idx2 = Math.floor(Math.random() * (pexelsData.photos?.length || 1));

    const imageUrl =
      unsplashData.results?.[idx1]?.urls?.regular ||
      pexelsData.photos?.[idx2]?.src?.medium ||
      STATIC_CITY_IMAGES[cityName] ||
      DEFAULT_IMAGE;

    localStorage.setItem(cacheKey, JSON.stringify({ url: imageUrl, timestamp: Date.now() }));
    return imageUrl;
  } catch {
    return STATIC_CITY_IMAGES[cityName] || DEFAULT_IMAGE;
  }
}

// ✅ Hotel Images
export async function getHotelImage(hotelName, cityName) {
  const cacheKey = `hotel_image_${hotelName}`;
  const variations = ["luxury", "modern", "interior", "night view", "resort"];
  const randomTag = variations[Math.floor(Math.random() * variations.length)];
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const query = `${hotelName} ${cityName} ${randomTag} hotel`;

  const fetchFn = async () => {
    try {
      const [unsplash, pexels] = await Promise.allSettled([
        fetch(`http://localhost:5000/api/images/unsplash?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`),
        fetch(`http://localhost:5000/api/images/pexels?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`)
      ]);

      const unsplashData = unsplash.value && unsplash.value.ok ? await unsplash.value.json() : {};
      const pexelsData = pexels.value && pexels.value.ok ? await pexels.value.json() : {};
      const idx1 = Math.floor(Math.random() * (unsplashData.results?.length || 1));
      const idx2 = Math.floor(Math.random() * (pexelsData.photos?.length || 1));

      return (
        unsplashData.results?.[idx1]?.urls?.regular ||
        pexelsData.photos?.[idx2]?.src?.medium ||
        null
      );
    } catch {
      return null;
    }
  };

  return fetchWithCache(cacheKey, fetchFn, DEFAULT_HOTEL_IMG);
}

// ✅ Attraction Images
export async function getAttractionImage(attractionName, cityName) {
  const cacheKey = `attraction_image_${attractionName}`;
  const variations = ["beautiful", "scenic", "landmark", "famous", "tourist"];
  const randomTag = variations[Math.floor(Math.random() * variations.length)];
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const query = `${attractionName} ${cityName} ${randomTag}`;

  const fetchFn = async () => {
    try {
      const [unsplash, pexels] = await Promise.allSettled([
        fetch(`http://localhost:5000/api/images/unsplash?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`),
        fetch(`http://localhost:5000/api/images/pexels?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`)
      ]);

      const unsplashData = unsplash.value && unsplash.value.ok ? await unsplash.value.json() : {};
      const pexelsData = pexels.value && pexels.value.ok ? await pexels.value.json() : {};
      const idx1 = Math.floor(Math.random() * (unsplashData.results?.length || 1));
      const idx2 = Math.floor(Math.random() * (pexelsData.photos?.length || 1));

      return (
        unsplashData.results?.[idx1]?.urls?.regular ||
        pexelsData.photos?.[idx2]?.src?.medium ||
        null
      );
    } catch {
      return null;
    }
  };

  return fetchWithCache(cacheKey, fetchFn, DEFAULT_ATTRACTION_IMG);
}

// ✅ Restaurant Images
export async function getRestaurantImage(restaurantName, cityName) {
  const cacheKey = `restaurant_image_${restaurantName}`;
  const variations = ["dining", "food", "cuisine", "interior", "street food"];
  const randomTag = variations[Math.floor(Math.random() * variations.length)];
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const query = `${restaurantName} ${cityName} ${randomTag} restaurant`;

  const fetchFn = async () => {
    try {
      const [unsplash, pexels] = await Promise.allSettled([
        fetch(`http://localhost:5000/api/images/unsplash?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`),
        fetch(`http://localhost:5000/api/images/pexels?q=${encodeURIComponent(query)}&page=${randomPage}&per_page=5`)
      ]);

      const unsplashData = unsplash.value && unsplash.value.ok ? await unsplash.value.json() : {};
      const pexelsData = pexels.value && pexels.value.ok ? await pexels.value.json() : {};
      const idx1 = Math.floor(Math.random() * (unsplashData.results?.length || 1));
      const idx2 = Math.floor(Math.random() * (pexelsData.photos?.length || 1));

      return (
        unsplashData.results?.[idx1]?.urls?.regular ||
        pexelsData.photos?.[idx2]?.src?.medium ||
        null
      );
    } catch {
      return null;
    }
  };

  return fetchWithCache(cacheKey, fetchFn, DEFAULT_RESTAURANT_IMG);
}