// 위치: src/restaurants/dto/response/restaurants.response.js

/**
 * 식당 목록/상세 응답 DTO
 */
export function toRestaurantItemDto(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category ?? null,
    address: r.address ?? null,
    telephone: r.telephone ?? null,
    mapx: r.mapx ?? null,
    mapy: r.mapy ?? null,
    isSponsored: !!r.isSponsored,
    distance: r.distance ?? undefined, // 근처 검색일 경우(m 단위)
    stats: r._stats
      ? {
          reviewCount: r._stats.reviewCount ?? 0,
          avgLeftoverRatio: r._stats.avgLeftoverRatio ?? null,
          avgScore: r._stats.avgScore ?? null,
        }
      : undefined,
  };
}

/**
 * 상세조회용 DTO
 * (현재는 동일하지만, 추후 메뉴/영업시간 등 확장 가능)
 */
export function toRestaurantDetailDto(r) {
  return toRestaurantItemDto(r);
}
