/** 식당 목록/상세 공용 DTO */
export function toRestaurantItemDto(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category ?? null,
    address: r.address ?? null,
    telephone: r.telephone ?? null,
    mapx: r.mapx ?? null,
    mapy: r.mapy ?? null,
    isSponsored: !!(r.isSponsored ?? r.is_sponsored),
    distance: r.distance ?? undefined, // nearby에서만 존재(m)
    stats:
      r.reviewCount !== undefined ||
      r.avgLeftoverRatio !== undefined ||
      r.avgScore !== undefined
        ? {
            reviewCount: r.reviewCount ?? 0,
            avgLeftoverRatio: r.avgLeftoverRatio ?? null,
            avgScore: r.avgScore ?? null,
          }
        : undefined,
    avgScore: r.avgScore ?? r.avg_score ?? null,
  };
}

/** 상세 조회 DTO (현재는 동일) */
export const toRestaurantDetailDto = toRestaurantItemDto;

/** 리뷰 DTO(간단) */
export function toReviewItemDto(rv) {
  return {
    id: rv.id,
    content: rv.content,
    score: rv.score,
    createdAt: rv.createdAt,
    user: rv.user
      ? {
          id: rv.user.id,
          nickname: rv.user.nickname,
          profile: rv.user.profile,
        }
      : null,
  };
}
