// 위치: src/restaurants/service/restaurants.service.js

import {
  findRestaurantsRepo,
  findRestaurantByIdRepo,
  listReviewsOfRestaurantRepo,
  findNearbyRestaurantsRepo,
} from "../repository/restaurants.repository.js";

import {
  toRestaurantItemDto,
  toRestaurantDetailDto,
} from "../dto/response/restaurants.response.js";

/**
 * 식당 목록/검색 서비스
 * dto: { page, take, q, category, sponsoredOnly }
 * 반환: { items:[...], pagination:{ page,take,total,totalPages } }
 */
export async function listRestaurantsSvc(dto) {
  const { items, total } = await findRestaurantsRepo(dto);
  const take = Math.max(1, dto.take || 10);
  return {
    items: items.map(toRestaurantItemDto),
    pagination: {
      page: dto.page || 1,
      take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * 식당 상세 서비스
 * id: number
 * not found → 404 throw
 */
export async function getRestaurantDetailSvc(id) {
  const row = await findRestaurantByIdRepo(id);
  if (!row) {
    const err = new Error("RESTAURANT_NOT_FOUND");
    err.status = 404;
    throw err;
  }
  return toRestaurantDetailDto(row);
}

/**
 * 특정 식당 리뷰 목록 서비스
 * params: { restaurantId, page, take }
 */
export async function listRestaurantReviewsSvc({ restaurantId, page, take }) {
  const { items, total } = await listReviewsOfRestaurantRepo({
    restaurantId,
    page,
    take,
  });
  const _take = Math.max(1, take || 10);
  return {
    items, // 필요하면 review.response DTO 매핑 추가
    pagination: {
      page: page || 1,
      take: _take,
      total,
      totalPages: Math.ceil(total / _take),
    },
  };
}

/**
 * 내 위치 기준 반경 내 식당 조회 서비스
 * dto: { lat, lng, radius(기본 500), take(기본 10) }
 * repository에서 distance(m), total(전체 개수)까지 계산
 */
export async function listNearbyRestaurantsSvc(dto) {
  const { items, total } = await findNearbyRestaurantsRepo(dto);
  const take = Math.max(1, dto.take || 10);
  return {
    items: items.map((r) => ({
      ...toRestaurantItemDto(r),
      distance: r.distance ?? undefined, // m
    })),
    pagination: {
      page: 1,
      take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}
