// 위치: src/favorites/repository/favorites.repository.js
import { prisma } from "../../db.config.js";

/* 즐겨찾기 생성 레포지토리
 *
 */
export const createFavorite = async ({ userId, restaurantId }) => {
  try {
    return await prisma.favorite.create({
      data: { userId, restaurantId },
      include: { restaurant: true },
    });
  } catch (e) {
    // 중복이면 기존 레코드 반환
    if (e.code === "P2002") {
      return prisma.favorite.findFirst({
        where: { userId, restaurantId },
        include: { restaurant: true },
      });
    }
    throw e;
  }
};

/* 즐겨찾기 취소(삭제) 레포지토리
 *
 */
export const deleteFavorite = async ({ userId, restaurantId }) => {
  await prisma.favorite.deleteMany({
    where: { userId, restaurantId },
  });
};

/* 즐겨찾기 목록 조회 레포지토리
 *
 */
export const listFavorites = async ({ userId }) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: { restaurant: true },
    orderBy: { createdAt: "desc" },
  });
};
