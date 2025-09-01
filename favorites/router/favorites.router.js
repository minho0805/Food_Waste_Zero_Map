// 위치: src/restaurants/router/favorites.router.js
import { Router } from "express";
import * as ctrl from "../controller/favorites.controller.js";

const r = Router({ mergeParams: true });

/* 즐겨찾기 목록 조회
 * 매서드: GET
 * 엔드포인트: /api/favorites
 */
r.get("/", ctrl.listFavorites);

/* 즐겨찾기 추가
 * 매서드: POST
 * 엔드포인트: /api/favorites/:restaurant_id
 */
r.post("/:restaurantId", ctrl.addFavorites);

/* 즐겨찾기 삭제
 * 매서드: DELETE
 * 엔드포인트: api/favorites/:restaurants_id
 */
r.delete("/:restaurantId/reviews", ctrl.deleteFavortes);

/* 404 Not Found 핸들러
 * 위의 라우터 마운트 외의 요청은 여기를 통해 "404 Not Found" 출력
 */
r.use((req, res) => {
  res
    .status(404)
    .json({ ok: false, error: "NOT_FOUND", path: req.originalUrl });
});

export default r;
