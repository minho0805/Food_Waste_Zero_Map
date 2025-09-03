// 위치: src/favorites/controller/favorites.controller.js
import { StatusCodes } from "http-status-codes";
import {
  addFavoriteSvc,
  removeFavoriteSvc,
  myFavoritesSvc,
} from "../service/favorites.service.js";
import {
  AddFavoriteRequest,
  RemoveFavoriteRequest,
} from "../dto/request/favorites.request.dto.js";

/* 즐겨찾기 추가 컨트롤러 */
export const addFavorite = async (req, res, next) => {
  try {
    const dto = new AddFavoriteRequest({
      restaurantId: req.params.restaurantId,
    });
    const favorite = await addFavoriteSvc(req.user, dto.restaurantId);
    return res.success(favorite, StatusCodes.CREATED);
  } catch (e) {
    next(e);
  }
};

/* 즐겨찾기 취소(삭제) 컨트롤러 */
export const removeFavorite = async (req, res, next) => {
  try {
    const dto = new RemoveFavoriteRequest({
      restaurantId: req.params.restaurantId,
    });
    await removeFavoriteSvc(req.user, dto.restaurantId);
    return res.success({ ok: true }, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};

/* 즐겨찾기 목록 조회 컨트롤러 */
export const myFavorites = async (req, res, next) => {
  try {
    const favorites = await myFavoritesSvc(req.user);
    return res.success(favorites, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};
