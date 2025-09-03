// 위치: src/favorites/dto/response/favorites.response.dto.js
export class FavoriteResponse {
  constructor(favorite) {
    this.id = favorite.id;
    this.restaurant = {
      id: favorite.restaurant.id,
      name: favorite.restaurant.name,
      category: favorite.restaurant.category,
      address: favorite.restaurant.address,
      telephone: favorite.restaurant.telephone,
    };
    this.createdAt = favorite.createdAt;
  }
}

export class FavoriteListResponse {
  constructor(favorites) {
    this.items = favorites.map((f) => new FavoriteResponse(f));
    this.count = favorites.length;
  }
}
