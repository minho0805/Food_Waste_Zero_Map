// 위치: src/restaurants/router/restaurants.router.js
import { Router } from "express";
import * as ctrl from "../controller/restaurants.controller.js";

const r = Router({ mergeParams: true });

/* 숫자 path 가드
 * URL 경로 파라미터가 숫자인지 검사하는 가드
 */
function onlyDigits404(req, res, next) {
  const id = req.params.restaurantId;
  if (id !== undefined && !/^\d+$/.test(String(id))) {
    return res.status(404).json({ ok: false, error: "NOT_FOUND" });
  }
  next();
}

/* 클라이언트 기준 500m 내 식당 찾기
 * 메서드: GET
 * 엔드포인트: /api/restaurants/nearby
 */
r.get("/nearby", ctrl.listNearbyRestaurants);

/* 식당 목록 검색
 * 메서드: GET
 * 엔드포인트: /api/restaurants
 */
r.get("/", ctrl.listRestaurants);

/* 식당 상세 조회
 * 메서드: GET
 * 엔드포인트: /api/restaurants/:restaurantId
 */
r.get("/:restaurantId", onlyDigits404, ctrl.getRestaurantDetail);

/* 특정 식당 리뷰 조회
 * 메서드: GET
 * 엔드포인트: /api/restaurants/:restaurantId/reviews
 */
r.get("/:restaurantId/reviews", onlyDigits404, ctrl.listRestaurantReviews);

/* 404 Not Found 핸들러
 * 위의 라우터 마운트 외의 요청은 여기를 통해 "404 Not Found" 출력
 */
r.use((req, res) => {
  res
    .status(404)
    .json({ ok: false, error: "NOT_FOUND", path: req.originalUrl });
});

export default r;
