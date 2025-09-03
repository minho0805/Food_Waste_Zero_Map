// 위치: src/favorites/service/favorites.service.js
import {
  createFavorite,
  deleteFavorite,
  listFavorites,
} from "../repository/favorites.repository.js";
import {
  FavoriteResponse,
  FavoriteListResponse,
} from "../dto/response/favorites.response.dto.js";

/* 즐겨찾기 추가 서비스 */
export const addFavoriteSvc = async (user, restaurantId) => {
  const fav = await createFavorite({ userId: user.id, restaurantId });
  return new FavoriteResponse(fav);
};

/* 즐겨찾기 삭제 서비스*/
export const removeFavoriteSvc = async (user, restaurantId) => {
  await deleteFavorite({ userId: user.id, restaurantId });
  return { ok: true };
};

/* 즐겨찾기 목록 조회 서비스*/
export const myFavoritesSvc = async (user) => {
  const rows = await listFavorites({ userId: user.id });
  return new FavoriteListResponse(rows);
};
