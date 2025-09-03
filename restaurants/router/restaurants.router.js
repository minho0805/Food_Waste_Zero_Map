import { Router } from "express";
import {
  listByBBox,
  listNearby,
  detail,
  reviews,
} from "../controller/restaurants.controller.js";

const r = Router();

/*
  #swagger.tags = ['Restaurants']
  #swagger.security = [{ bearerAuth: [] }]
*/

/* 지도 영역 내 식당 조회 라우터 */
r.get(
  "/",
  /*
    #swagger.summary = '지도 영역 내 식당 조회'
    #swagger.description = '현재 지도 뷰포트(Box)에 포함되는 식당 목록을 반환합니다.'
    #swagger.parameters['minLng'] = {
      in: 'query',
      description: '경도 최소값',
      required: true,
      type: 'number',
      example: 126.95
    }
    #swagger.parameters['minLat'] = {
      in: 'query',
      description: '위도 최소값',
      required: true,
      type: 'number',
      example: 37.54
    }
    #swagger.parameters['maxLng'] = {
      in: 'query',
      description: '경도 최대값',
      required: true,
      type: 'number',
      example: 127.05
    }
    #swagger.parameters['maxLat'] = {
      in: 'query',
      description: '위도 최대값',
      required: true,
      type: 'number',
      example: 37.62
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: '최대 조회 개수 (기본 200)',
      required: false,
      type: 'integer',
      example: 100
    }
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: {
        items: [
          {
            id: 55,
            name: "그린테이블",
            category: "Korean",
            mapx: 127.00231,
            mapy: 37.61234,
            avgScore: 4.8,
            isSponsored: false
          },
          {
            id: 89,
            name: "봉화묵집",
            category: "Korean",
            mapx: 127.01071,
            mapy: 37.60271,
            avgScore: 4.7,
            isSponsored: true
          }
        ],
        count: 2
      }
    }
  */
  listByBBox,
);

/* 반경 내 식당 조회 */
r.get(
  "/nearby",
  /*
    #swagger.summary = '반경 내 식당 조회'
    #swagger.description = '사용자의 현재 위치(lng, lat)와 반경(m) 기준으로 식당 목록을 반환합니다.'
    #swagger.parameters['lng'] = {
      in: 'query',
      description: '중심 경도',
      required: true,
      type: 'number',
      example: 127.0
    }
    #swagger.parameters['lat'] = {
      in: 'query',
      description: '중심 위도',
      required: true,
      type: 'number',
      example: 37.6
    }
    #swagger.parameters['radius'] = {
      in: 'query',
      description: '검색 반경 (m 단위, 기본 1500)',
      required: false,
      type: 'integer',
      example: 1000
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: '최대 조회 개수 (기본 200)',
      required: false,
      type: 'integer',
      example: 50
    }
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: {
        items: [
          {
            id: 55,
            name: "그린테이블",
            category: "Korean",
            mapx: 127.00231,
            mapy: 37.61234,
            avgScore: 4.8,
            distance: 350,
            isSponsored: false
          }
        ],
        count: 1
      }
    }
  */
  listNearby,
);

/* 식당 상세 */
r.get(
  "/:restaurantId",
  /*
    #swagger.summary = '식당 상세 조회'
    #swagger.description = '특정 식당의 상세 정보를 조회합니다.'
    #swagger.parameters['restaurantId'] = {
      in: 'path',
      description: '식당 ID',
      required: true,
      type: 'integer',
      example: 55
    }
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: {
        id: 55,
        name: "그린테이블",
        category: "Korean",
        address: "서울특별시 성북구 보국문로29길 15",
        telephone: "02-123-4567",
        avgScore: 4.8,
        reviewsCount: 12,
        isSponsored: false,
        mapx: 127.00231,
        mapy: 37.61234
      }
    }
  */
  detail,
);

/* 특정 식당 리뷰 */
r.get(
  "/:restaurantId/reviews",
  /*
    #swagger.summary = '특정 식당 리뷰 조회'
    #swagger.description = '특정 식당의 리뷰 목록을 페이지네이션하여 반환합니다.'
    #swagger.parameters['restaurantId'] = {
      in: 'path',
      description: '식당 ID',
      required: true,
      type: 'integer',
      example: 55
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: '페이지 번호 (기본 1)',
      required: false,
      type: 'integer',
      example: 1
    }
    #swagger.parameters['size'] = {
      in: 'query',
      description: '페이지 크기 (기본 10)',
      required: false,
      type: 'integer',
      example: 10
    }
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: {
        items: [
          {
            id: 101,
            content: "잔반 거의 없었어요!",
            score: 4.8,
            createdAt: "2025-09-01T12:00:00Z",
            user: {
              id: 1,
              nickname: "tester1",
              profile: "/img/profile1.png"
            }
          }
        ],
        count: 1,
        page: 1,
        size: 10
      }
    }
  */
  reviews,
);

export default r;
