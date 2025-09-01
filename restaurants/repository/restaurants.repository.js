// 위치: src/restaurants/repository/restaurants.repository.js
import { prisma } from "../../db/prisma.js";

// env: HAS_POSTGIS=1 로 분기
const HAS_POSTGIS = process.env.HAS_POSTGIS === "1";

/* ───────────────────────────────
 * 목록/검색
 * dto: { page, take, q, category, sponsoredOnly }
 * 반환: { items, total }
 * ─────────────────────────────── */
export async function findRestaurantsRepo({
  page,
  take,
  q,
  category,
  sponsoredOnly,
}) {
  const where = {
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(category ? { category } : {}),
    ...(sponsoredOnly ? { isSponsored: true } : {}),
  };

  // ⚠️ 모델명이 프로젝트마다 다를 수 있음: restaurants vs restaurant
  const [items, total] = await Promise.all([
    prisma.restaurants.findMany({
      where,
      orderBy: [{ isSponsored: "desc" }, { id: "asc" }],
      skip: (page - 1) * take,
      take,
      select: {
        id: true,
        name: true,
        category: true,
        address: true,
        telephone: true,
        mapx: true,
        mapy: true,
        isSponsored: true,
      },
    }),
    prisma.restaurants.count({ where }),
  ]);

  return { items, total };
}

/* ───────────────────────────────
 * 상세
 * ─────────────────────────────── */
export async function findRestaurantByIdRepo(id) {
  return prisma.restaurants.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      address: true,
      telephone: true,
      mapx: true,
      mapy: true,
      isSponsored: true,
    },
  });
}

/* ───────────────────────────────
 * 특정 식당 리뷰 목록 (간단 버전)
 * params: { restaurantId, page, take }
 * ─────────────────────────────── */
export async function listReviewsOfRestaurantRepo({
  restaurantId,
  page,
  take,
}) {
  // ⚠️ 모델명 확인: reviews vs review
  const [items, total] = await Promise.all([
    prisma.reviews.findMany({
      where: { restaurantId },
      orderBy: { id: "desc" },
      skip: (page - 1) * take,
      take,
      select: {
        id: true,
        userId: true,
        score: true,
        leftoverRatio: true,
        content: true,
        imageUrl: true,
        createdAt: true,
      },
    }),
    prisma.reviews.count({ where: { restaurantId } }),
  ]);
  return { items, total };
}

/* ───────────────────────────────
 * 근처 탐색
 * dto: { lat, lng, radius, take }
 * DB: mapx(경도*1e7), mapy(위도*1e7)
 * 반환: { items, total }
 * ─────────────────────────────── */
export async function findNearbyRestaurantsRepo({ lat, lng, radius, take }) {
  if (HAS_POSTGIS) {
    // 1) 총개수
    const [{ count }] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM restaurants r
      WHERE r.mapx IS NOT NULL AND r.mapy IS NOT NULL
        AND ST_DWithin(
          ST_MakePoint(r.mapx/1e7, r.mapy/1e7)::geography,
          ST_MakePoint(${lng}, ${lat})::geography,
          ${radius}
        )
    `;

    // 2) 아이템 (정렬: 스폰서 우선, 거리 오름차순)
    const rows = await prisma.$queryRaw`
      WITH base AS (
        SELECT
          r.id,
          r.name,
          r.category,
          r.address,
          r.telephone,
          r.mapx,
          r.mapy,
          r.is_sponsored,
          ST_DistanceSphere(
            ST_MakePoint(r.mapx/1e7, r.mapy/1e7),
            ST_MakePoint(${lng}, ${lat})
          ) AS distance
        FROM restaurants r
        WHERE r.mapx IS NOT NULL AND r.mapy IS NOT NULL
          AND ST_DWithin(
            ST_MakePoint(r.mapx/1e7, r.mapy/1e7)::geography,
            ST_MakePoint(${lng}, ${lat})::geography,
            ${radius}
          )
      )
      SELECT *
      FROM base
      ORDER BY is_sponsored DESC, distance ASC
      LIMIT ${take};
    `;

    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      address: r.address,
      telephone: r.telephone,
      mapx: r.mapx,
      mapy: r.mapy,
      isSponsored: r.is_sponsored,
      distance: Number(r.distance), // m
      _stats: undefined,
    }));
    return { items, total: count };
  }

  // ── Non-PostGIS: Bounding Box + JS Haversine
  const latDelta = radius / 111320; // 위도 1도 ≈ 111,320m
  const lonDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));

  const minLat = lat - latDelta;
  const maxLat = lat + latDelta;
  const minLng = lng - lonDelta;
  const maxLng = lng + lonDelta;

  // 후보군(박스 필터) — 좌표 NULL 제외
  const candidates = await prisma.$queryRaw`
    SELECT
      r.id,
      r.name,
      r.category,
      r.address,
      r.telephone,
      r.mapx,
      r.mapy,
      r.is_sponsored
    FROM restaurants r
    WHERE r.mapx IS NOT NULL AND r.mapy IS NOT NULL
      AND (r.mapy/1e7) BETWEEN ${minLat} AND ${maxLat}
      AND (r.mapx/1e7) BETWEEN ${minLng} AND ${maxLng};
  `;

  // Haversine 거리(m)
  const toMeters = (aLat, aLng, bLat, bLng) => {
    const R = 6371000;
    const dLat = ((bLat - aLat) * Math.PI) / 180;
    const dLng = ((bLng - aLng) * Math.PI) / 180;
    const sLat1 = (aLat * Math.PI) / 180;
    const sLat2 = (bLat * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(sLat1) * Math.cos(sLat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  // 반경 필터 + 정렬 + 슬라이스
  const filtered = candidates
    .map((r) => {
      const rLat = Number(r.mapy) / 1e7;
      const rLng = Number(r.mapx) / 1e7;
      const distance = toMeters(lat, lng, rLat, rLng);
      return { ...r, distance };
    })
    .filter((r) => r.distance <= radius);

  const total = filtered.length;

  const page = filtered
    .sort((a, b) =>
      a.is_sponsored === b.is_sponsored
        ? a.distance - b.distance
        : (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0),
    )
    .slice(0, take);

  const items = page.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    address: r.address,
    telephone: r.telephone,
    mapx: r.mapx,
    mapy: r.mapy,
    isSponsored: r.is_sponsored,
    distance: r.distance, // m
    _stats: undefined,
  }));

  return { items, total };
}
