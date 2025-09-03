/* 공통: 식당 ID 유효성 검사 */
class RestaurantIdRequest {
  constructor(restaurantId) {
    this.restaurantId = Number(restaurantId);
    if (!Number.isInteger(this.restaurantId) || this.restaurantId <= 0) {
      throw new Error("Invalid restaurantId");
    }
  }
}

/* 즐겨찾기 추가 */
export class AddFavoriteRequest extends RestaurantIdRequest {
  constructor({ restaurantId }) {
    super(Number(restaurantId));
  }
}

/* 즐겨찾기 삭제 */
export class RemoveFavoriteRequest extends RestaurantIdRequest {
  constructor({ restaurantId }) {
    super(Number(restaurantId));
  }
}
