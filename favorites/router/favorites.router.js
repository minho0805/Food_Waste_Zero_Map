// 위치: src/favorites/router/favorites.router.js
import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  myFavorites,
} from "../controller/favorites.controller.js";

const r = Router();

/* 즐겨찾기 목록 조회 라우터
 * 매서드: GET
 * 엔드포인트: /api/favorites
 */
/*
  #swagger.tags = ['Favorites']
  #swagger.summary = '내 즐겨찾기 목록 조회'
  #swagger.description = '현재 로그인한 사용자의 즐겨찾기 식당 목록을 반환합니다.'
  #swagger.security = [{ bearerAuth: [] }]
  #swagger.responses[200] = {
    description: '성공적으로 즐겨찾기 목록을 반환',
    schema: {
      count: 1,
      items: [
        {
          id: 10,
          restaurant: {
            id: 55,
            name: "그린테이블",
            category: "Korean",
            address: "서울특별시 성북구...",
            telephone: "02-123-4567"
          },
          createdAt: "2025-09-01T12:00:00Z"
        }
      ]
    }
  }
*/
r.get("/", myFavorites);

/* 즐겨찾기 추가 라우터
 * 매서드: POST
 * 엔드포인트: /api/favorites/:restaurantId
 */
/*
  #swagger.tags = ['Favorites']
  #swagger.summary = '즐겨찾기 추가'
  #swagger.description = '특정 식당을 즐겨찾기에 추가합니다. 이미 추가되어 있으면 기존 데이터를 반환합니다.'
  #swagger.security = [{ bearerAuth: [] }]
  #swagger.parameters['restaurantId'] = {
    in: 'path',
    description: '즐겨찾기에 추가할 식당 ID',
    required: true,
    type: 'integer',
    example: 55
  }
  #swagger.responses[201] = {
    description: '즐겨찾기 추가 성공',
    schema: {
      id: 10,
      restaurant: {
        id: 55,
        name: "그린테이블",
        category: "Korean",
        address: "서울특별시 성북구...",
        telephone: "02-123-4567"
      },
      createdAt: "2025-09-01T12:00:00Z"
    }
  }
*/
r.put("/:restaurantId", addFavorite);

/* 즐겨찾기 취소(삭제) 라우터
 * 매서드: DELETE
 * 엔드포인트: /api/favorites/:restaurantId
 */
/*
  #swagger.tags = ['Favorites']
  #swagger.summary = '즐겨찾기 삭제'
  #swagger.description = '특정 식당을 즐겨찾기 목록에서 제거합니다.'
  #swagger.security = [{ bearerAuth: [] }]
  #swagger.parameters['restaurantId'] = {
    in: 'path',
    description: '즐겨찾기에서 제거할 식당 ID',
    required: true,
    type: 'integer',
    example: 55
  }
  #swagger.responses[200] = {
    description: '즐겨찾기 삭제 성공',
    schema: { ok: true }
  }
*/
r.delete("/:restaurantId", removeFavorite);

export default r;
