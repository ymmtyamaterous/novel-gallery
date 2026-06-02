import { describe, expect, test } from "bun:test";
import z from "zod";

// laureates.list の入力スキーマを再定義してテスト
const laureateListInput = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  year: z.number().int().optional(),
  nationality: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

const laureateGetInput = z.object({
  id: z.string(),
});

// prizes.list の入力スキーマ
const prizesListInput = z.object({
  category: z.string().optional(),
  year: z.number().int().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// favorites.add 入力スキーマ
const favoriteAddInput = z.object({
  targetType: z.enum(["laureate", "prize"]),
  targetId: z.string(),
});

describe("laureates API input validation", () => {
  test("list: defaults are applied correctly", () => {
    const result = laureateListInput.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.query).toBeUndefined();
  });

  test("list: valid input is accepted", () => {
    const result = laureateListInput.parse({
      query: "Einstein",
      category: "physics",
      year: 1921,
      page: 2,
      pageSize: 10,
    });
    expect(result.query).toBe("Einstein");
    expect(result.category).toBe("physics");
    expect(result.year).toBe(1921);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
  });

  test("list: page must be at least 1", () => {
    expect(() => laureateListInput.parse({ page: 0 })).toThrow();
  });

  test("list: pageSize must not exceed 100", () => {
    expect(() => laureateListInput.parse({ pageSize: 101 })).toThrow();
  });

  test("get: requires id", () => {
    expect(() => laureateGetInput.parse({})).toThrow();
  });

  test("get: valid id is accepted", () => {
    const result = laureateGetInput.parse({ id: "1" });
    expect(result.id).toBe("1");
  });
});

describe("prizes API input validation", () => {
  test("list: defaults are applied correctly", () => {
    const result = prizesListInput.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  test("list: valid filters are accepted", () => {
    const result = prizesListInput.parse({ category: "physics", year: 1901 });
    expect(result.category).toBe("physics");
    expect(result.year).toBe(1901);
  });

  test("list: year must be integer", () => {
    expect(() => prizesListInput.parse({ year: 1901.5 })).toThrow();
  });
});

describe("favorites API input validation", () => {
  test("add: laureate type is accepted", () => {
    const result = favoriteAddInput.parse({ targetType: "laureate", targetId: "1" });
    expect(result.targetType).toBe("laureate");
    expect(result.targetId).toBe("1");
  });

  test("add: prize type is accepted", () => {
    const result = favoriteAddInput.parse({ targetType: "prize", targetId: "10" });
    expect(result.targetType).toBe("prize");
  });

  test("add: invalid targetType is rejected", () => {
    expect(() =>
      favoriteAddInput.parse({ targetType: "unknown", targetId: "1" }),
    ).toThrow();
  });

  test("add: missing targetId is rejected", () => {
    expect(() =>
      favoriteAddInput.parse({ targetType: "laureate" }),
    ).toThrow();
  });
});
