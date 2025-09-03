import { prisma } from "../../db.config.js";

/* BBox 내 식당 조회 */
export const findByBBox = async ({
  minLng,
  minLat,
  maxLng,
  maxLat,
  limit = 200,
}) => {
  return prisma.restaurant.findMany({
    where: {
      mapx: { gte: minLng, lte: maxLng },
      mapy: { gte: minLat, lte: maxLat },
    },
    select: {
      id: true,
      name: true,
      category: true,
      address: true,
      telephone: true,
      mapx: true,
      mapy: true,
      isSponsored: true, // Prisma 모델이 camelCase면 이 필드 사용
      avgScore: true,
    },
    take: Math.min(Number(limit) || 200, 500),
    orderBy: [{ isSponsored: "desc" }, { avgScore: "desc" }, { id: "asc" }],
  });
};

/* 반경 내 식당 조회 (PostgreSQL 기준, Haversine) */
export const findNearby = async ({ lng, lat, radius = 1500, limit = 200 }) => {
  // Prisma의 $queryRaw`...` 태그는 파라미터 바인딩되어 SQL 인젝션 안전
  return prisma.$queryRaw`
    SELECT
      id,
      name,
      category,
      address,
      telephone,
      mapx,
      mapy,
      is_sponsored AS "isSponsored",
      avg_score   AS "avgScore",
      (6371000 * acos(
        cos(radians(${lat})) * cos(radians(mapy)) *
        cos(radians(mapx) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(mapy))
      )) AS distance
    FROM restaurants
    HAVING (6371000 * acos(
      cos(radians(${lat})) * cos(radians(mapy)) *
      cos(radians(mapx) - radians(${lng})) +
      sin(radians(${lat})) * sin(radians(mapy))
    )) <= ${radius}
    ORDER BY "isSponsored" DESC, "avgScore" DESC
    LIMIT ${Math.min(Number(limit) || 200, 500)}
  `;
};

/* 식당 상세 */
export const findRestaurantById = async (id) => {
  return prisma.restaurant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      address: true,
      telephone: true,
      mapx: true,
      mapy: true,
      isSponsored: true,
      avgScore: true,
    },
  });
};

/* 리뷰 개수 */
export const countReviewsByRestaurant = async (restaurantId) => {
  return prisma.review.count({
    where: { restaurantId },
  });
};

/* 리뷰 목록 */
export const findReviewsByRestaurant = async ({
  restaurantId,
  page = 1,
  size = 10,
}) => {
  return prisma.review.findMany({
    where: { restaurantId },
    skip: (page - 1) * size,
    take: size,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, nickname: true, profile: true } },
    },
  });
};
