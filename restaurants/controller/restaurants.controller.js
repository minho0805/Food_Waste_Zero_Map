import { StatusCodes } from "http-status-codes";
import {
  getRestaurantsByBBox,
  getRestaurantsNearby,
  getRestaurantDetail,
  getRestaurantReviews,
} from "../service/restaurants.service.js";

/* 지도 Box 내 식당 조회 컨트롤러 */
export const listByBBox = async (req, res, next) => {
  try {
    const result = await getRestaurantsByBBox(req.query);
    return res.success(result, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};

/* 식당 상세 조회 컨트롤러 */
export const detail = async (req, res, next) => {
  try {
    const id = Number(req.params.restaurantId);
    if (!Number.isInteger(id) || id <= 0)
      throw new Error("Invalid restaurantId");
    const result = await getRestaurantDetail(id);
    return res.success(result, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};

/* 특정 식당 리뷰 조회 컨트롤러 */
export const reviews = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    if (!Number.isInteger(restaurantId) || restaurantId <= 0)
      throw new Error("Invalid restaurantId");
    const result = await getRestaurantReviews(restaurantId, req.query);
    return res.success(result, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};
