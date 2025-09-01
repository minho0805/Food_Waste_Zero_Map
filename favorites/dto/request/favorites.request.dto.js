// 위치: src/favorites/dto/request/favorites.request.dto.js

/* 핼퍼 함수
   숫자 변환과 범위 체크
   양의 정수면 그대로, 나머지 값은 기본값(def)으로 반환
*/
const toPosInt = (v, def = 0) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : def;
};
