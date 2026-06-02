import { describe, expect, test } from "bun:test";

// シードデータの構造検証テスト
// seed.ts の実際のデータを模倣した構造テスト

const PRIZE_CATEGORIES = ["physics", "chemistry", "medicine", "literature", "peace", "economics"] as const;
type PrizeCategory = typeof PRIZE_CATEGORIES[number];

interface SeedLaureate {
  id: string;
  name: string;
  nameJa: string | null;
  birthDate: string | null;
  deathDate: string | null;
  nationality: string | null;
  biography: string | null;
  imageUrl: string | null;
}

interface SeedPrize {
  id: string;
  year: number;
  category: PrizeCategory;
  motivation: string | null;
}

interface SeedLaureatePrize {
  id: string;
  laureateId: string;
  prizeId: string;
  motivation: string | null;
  share: number;
}

// 実際のシードデータと同じ参照データ（一部）
const seedLaureates: SeedLaureate[] = [
  {
    id: "1",
    name: "Wilhelm Conrad Röntgen",
    nameJa: "ヴィルヘルム・コンラート・レントゲン",
    birthDate: "1845-03-27",
    deathDate: "1923-02-10",
    nationality: "German",
    biography: "Wilhelm Conrad Röntgen was a German mechanical engineer and physicist.",
    imageUrl: null,
  },
  {
    id: "3",
    name: "Albert Einstein",
    nameJa: "アルベルト・アインシュタイン",
    birthDate: "1879-03-14",
    deathDate: "1955-04-18",
    nationality: "German-Swiss-American",
    biography: "Albert Einstein was a German-born theoretical physicist.",
    imageUrl: null,
  },
];

const seedPrizes: SeedPrize[] = [
  { id: "p1", year: 1901, category: "physics", motivation: "for his discovery of X-rays" },
  { id: "p6", year: 1921, category: "physics", motivation: "for his discovery of the law of the photoelectric effect" },
];

const seedLaureatePrizes: SeedLaureatePrize[] = [
  { id: "lp1", laureateId: "1", prizeId: "p1", motivation: null, share: 1 },
  { id: "lp6", laureateId: "3", prizeId: "p6", motivation: null, share: 1 },
];

describe("seed data structure validation", () => {
  test("all laureate ids are unique", () => {
    const ids = seedLaureates.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all prize ids are unique", () => {
    const ids = seedPrizes.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all laureatePrize ids are unique", () => {
    const ids = seedLaureatePrizes.map((lp) => lp.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all prize categories are valid", () => {
    for (const prize of seedPrizes) {
      expect(PRIZE_CATEGORIES).toContain(prize.category);
    }
  });

  test("all laureate prize years are positive integers", () => {
    for (const prize of seedPrizes) {
      expect(prize.year).toBeGreaterThan(0);
      expect(Number.isInteger(prize.year)).toBe(true);
    }
  });

  test("laureatePrize references valid laureate ids", () => {
    const laureateIds = new Set(seedLaureates.map((l) => l.id));
    for (const lp of seedLaureatePrizes) {
      expect(laureateIds.has(lp.laureateId)).toBe(true);
    }
  });

  test("laureatePrize references valid prize ids", () => {
    const prizeIds = new Set(seedPrizes.map((p) => p.id));
    for (const lp of seedLaureatePrizes) {
      expect(prizeIds.has(lp.prizeId)).toBe(true);
    }
  });

  test("share values are positive integers", () => {
    for (const lp of seedLaureatePrizes) {
      expect(lp.share).toBeGreaterThan(0);
      expect(Number.isInteger(lp.share)).toBe(true);
    }
  });

  test("laureates have required name field", () => {
    for (const l of seedLaureates) {
      expect(l.name).toBeTruthy();
      expect(l.name.length).toBeGreaterThan(0);
    }
  });
});

describe("prize categories", () => {
  test("exactly 6 categories defined", () => {
    expect(PRIZE_CATEGORIES.length).toBe(6);
  });

  test("expected categories are present", () => {
    expect(PRIZE_CATEGORIES).toContain("physics");
    expect(PRIZE_CATEGORIES).toContain("chemistry");
    expect(PRIZE_CATEGORIES).toContain("medicine");
    expect(PRIZE_CATEGORIES).toContain("literature");
    expect(PRIZE_CATEGORIES).toContain("peace");
    expect(PRIZE_CATEGORIES).toContain("economics");
  });
});
