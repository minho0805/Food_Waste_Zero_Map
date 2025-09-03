import { prisma } from "../../db.config.js";

/* BBox 내 식당 조회 레포지토리 */
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

/* 식당 상세 조회 레포지토리 */
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

/* 리뷰 개수 조회 레포지토리 */
export const countReviewsByRestaurant = async (restaurantId) => {
  return prisma.review.count({
    where: { restaurantId },
  });
};

/* 리뷰 목록 조회 레포지토리 */
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
