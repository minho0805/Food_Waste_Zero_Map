import { StatusCodes } from "http-status-codes";
import * as svc from "../service/restaurants.service.js";


/* 식당 조회
 * 매서드: GET
 * 엔드포인트: /api/restaurants
 */
export async function listRestaurants(req, res, next) {
  try {
    const dto = parseListQuery(req.query);
    const restaurants = await svc.list(dto);
    return res.success(restaurants, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
}

/* 식당 상세조회
 * 매서드: GET
 * 엔드포인트: /api/restaurants/:restaurant_id
 */
export async function getRestaurantDetail(req, res, next) {
  try {
    const { restaurantId } = parserestaurantIDParam(req.params);
    const restaurants = await svc.detail(restaurantId);
    return res.success(restaurants, StatusCodes.OK);
  } catch (e) {
    next(e);
  }
}

/* 특정 식당 리뷰 조회
 * 매서드: GET
 * 엔드포인트: /api/restaurants/:restaurant_id/reviews
 */
 export async function listRestaurantReviews(req, res, next) {
   try {
     const { restaurantId } = parserestaurantIDParam(req.params);
     const res.success(restaurants, StatusCodes.OK);
   }
 }
