import {
  findByBBox,
  findNearby,
  findRestaurantById,
  countReviewsByRestaurant,
  findReviewsByRestaurant,
} from "../repository/restaurants.repository.js";
import {
  toRestaurantItemDto,
  toRestaurantDetailDto,
  toReviewItemDto,
} from "../dto/response/restaurants.response.dto.js";

/* 숫자 안전 변환 */
function toNum(v, def = undefined) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

/* BBox 내 식당 */
export const getRestaurantsByBBox = async (query) => {
  let { minLng, minLat, maxLng, maxLat, limit } = query;

  minLng = toNum(minLng);
  minLat = toNum(minLat);
  maxLng = toNum(maxLng);
  maxLat = toNum(maxLat);
  limit = toNum(limit, 200);

  if (
    [minLng, minLat, maxLng, maxLat].some(
      (v) => typeof v !== "number" || Number.isNaN(v),
    )
  ) {
    throw new Error("Invalid bbox parameters");
  }

  // 혹시 min/max가 뒤바뀐 경우 자동 보정
  if (minLng > maxLng) [minLng, maxLng] = [maxLng, minLng];
  if (minLat > maxLat) [minLat, maxLat] = [maxLat, minLat];

  const rows = await findByBBox({ minLng, minLat, maxLng, maxLat, limit });
  return {
    items: rows.map(toRestaurantItemDto),
    count: rows.length,
  };
};

/* 반경 내 식당 (선택) */
export const getRestaurantsNearby = async (query) => {
  const lng = toNum(query.lng);
  const lat = toNum(query.lat);
  const radius = toNum(query.radius, 1500);
  const limit = toNum(query.limit, 200);

  if (![lng, lat].every((v) => typeof v === "number"))
    throw new Error("Invalid lng/lat");

  const rows = await findNearby({ lng, lat, radius, limit });
  return {
    items: rows.map(toRestaurantItemDto),
    count: rows.length,
  };
};

/* 상세 */
export const getRestaurantDetail = async (id) => {
  const restaurant = await findRestaurantById(id);
  if (!restaurant) throw new Error("Restaurant not found");

  const reviewsCount = await countReviewsByRestaurant(id);
  return toRestaurantDetailDto({ ...restaurant, reviewCount: reviewsCount });
};

/* 리뷰 목록 */
export const getRestaurantReviews = async (restaurantId, query) => {
  const page = Math.max(1, toNum(query.page, 1));
  const size = Math.min(50, Math.max(1, toNum(query.size, 10)));

  const rows = await findReviewsByRestaurant({ restaurantId, page, size });
  return {
    items: rows.map(toReviewItemDto),
    count: rows.length,
    page,
    size,
  };
};
