// src/restaurants/dto/request/restaurants.request.js

/**
 * 식당 목록 조회 요청 DTO
 * - page: 페이지 번호 (기본 1)
 * - take: 한 페이지당 개수 (기본 10)
 * - q: 검색어
 * - category: 카테고리 필터
 * - sponsoredOnly: 스폰서 식당만 여부
 */
export function parseListRestaurantsDto(query) {
  const toInt = (v, d) => {
    const n = parseInt(String(v ?? "").trim(), 10);
    return Number.isFinite(n) ? n : d;
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const page = clamp(toInt(query.page, 1), 1, 10_000);
  const take = clamp(toInt(query.take ?? query.size, 10), 1, 50);
  const q = String(query.q ?? "").trim();
  const category = String(query.category ?? "").trim() || undefined;
  const sponsoredOnly = ["1", "true", "yes"].includes(
    String(query.sponsoredOnly).toLowerCase(),
  );

  return { page, take, q, category, sponsoredOnly };
}

/**
 * 특정 식당 상세조회용 Param 파서
 */
export function parseRestaurantIdParam(params) {
  const raw = params.restaurantId ?? params.restaurant_id ?? params.id;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    const e = new Error("NOT_FOUND");
    e.status = 404;
    throw e;
  }
  return { restaurantId: id };
}

/**
 * 내 위치 기반 근처 식당 조회 DTO
 * - lat, lng: 위도/경도 (필수)
 * - radius: 반경(m) (기본 500m)
 * - take: 최대 가져올 개수 (기본 10)
 */
export function parseNearbyRestaurantsDto(query) {
  const lat = Number(query.lat);
  const lng = Number(query.lng);
  const radius = query.radius !== undefined ? Number(query.radius) : 500;
  const take = query.take !== undefined ? Number(query.take) : 10;

  if (!Number.isFinite(lat) || Math.abs(lat) > 90) {
    const e = new Error("INVALID_LAT");
    e.status = 400;
    throw e;
  }
  if (!Number.isFinite(lng) || Math.abs(lng) > 180) {
    const e = new Error("INVALID_LNG");
    e.status = 400;
    throw e;
  }
  if (!Number.isFinite(radius) || radius <= 0 || radius > 5000) {
    const e = new Error("INVALID_RADIUS");
    e.status = 400;
    throw e;
  }
  if (!Number.isInteger(take) || take <= 0 || take > 50) {
    const e = new Error("INVALID_TAKE");
    e.status = 400;
    throw e;
  }

  return { lat, lng, radius, take };
}
