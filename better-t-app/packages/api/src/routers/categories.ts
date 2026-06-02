import { db } from "@better-t-app/db";
import { PRIZE_CATEGORIES, prizes } from "@better-t-app/db/schema/app";
import { sql } from "drizzle-orm";

import { publicProcedure } from "../index";

const CATEGORY_META: Record<string, { label: string; labelJa: string }> = {
  physics: { label: "Physics", labelJa: "物理学" },
  chemistry: { label: "Chemistry", labelJa: "化学" },
  medicine: { label: "Medicine", labelJa: "医学・生理学" },
  literature: { label: "Literature", labelJa: "文学" },
  peace: { label: "Peace", labelJa: "平和" },
  economics: { label: "Economics", labelJa: "経済学" },
};

export const categoriesRouter = {
  list: publicProcedure.handler(async () => {
    // 各カテゴリの賞の数を集計
    const counts = await db
      .select({
        category: prizes.category,
        count: sql<number>`count(*)`,
      })
      .from(prizes)
      .groupBy(prizes.category);

    const countMap = Object.fromEntries(counts.map((c) => [c.category, c.count]));

    const items = PRIZE_CATEGORIES.map((slug) => ({
      slug,
      label: CATEGORY_META[slug]?.label ?? slug,
      labelJa: CATEGORY_META[slug]?.labelJa ?? slug,
      count: countMap[slug] ?? 0,
    }));

    return { items };
  }),
};
