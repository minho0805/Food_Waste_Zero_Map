// 위치: src/favorites/dto/request/favorites.request.dto.js
export class AddFavoriteRequest {
  constructor({ restaurantId }) {
    this.restaurantId = Number(restaurantId);
    if (!Number.isInteger(this.restaurantId) || this.restaurantId <= 0) {
      throw new Error("Invalid restaurantId");
    }
  }
}

export class RemoveFavoriteRequest {
  constructor({ restaurantId }) {
    this.restaurantId = Number(restaurantId);
    if (!Number.isInteger(this.restaurantId) || this.restaurantId <= 0) {
      throw new Error("Invalid restaurantId");
    }
  }
}
