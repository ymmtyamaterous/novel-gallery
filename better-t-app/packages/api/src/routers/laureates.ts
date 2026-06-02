import { db } from "@better-t-app/db";
import { laureates } from "@better-t-app/db/schema/app";
import { ORPCError } from "@orpc/server";
import { and, eq, like, or } from "drizzle-orm";
import z from "zod";

import { publicProcedure } from "../index";

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

export const laureatesRouter = {
  list: publicProcedure.input(laureateListInput).handler(async ({ input }) => {
    const { query, category, year, nationality, page, pageSize } = input;
    const offset = (page - 1) * pageSize;

    // フィルタ条件の構築
    const conditions = [];

    if (query) {
      conditions.push(
        or(
          like(laureates.name, `%${query}%`),
          like(laureates.nationality, `%${query}%`),
          like(laureates.biography, `%${query}%`),
        ),
      );
    }

    if (nationality) {
      conditions.push(like(laureates.nationality, `%${nationality}%`));
    }

    // category / year で絞り込む場合は laureate_prizes 経由で JOIN
    let baseQuery = db.query.laureates.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        laureatePrizes: {
          with: { prize: true },
        },
      },
      limit: pageSize * 10, // フィルタ後に制限するため多めに取得
      offset: 0,
    });

    const allItems = await baseQuery;

    // category / year フィルタ（in-memory）
    let filtered = allItems;
    if (category) {
      filtered = filtered.filter((l) =>
        l.laureatePrizes.some((lp) => lp.prize.category === category),
      );
    }
    if (year) {
      filtered = filtered.filter((l) => l.laureatePrizes.some((lp) => lp.prize.year === year));
    }

    const total = filtered.length;
    const items = filtered.slice(offset, offset + pageSize).map((l) => ({
      id: l.id,
      name: l.name,
      nameJa: l.nameJa,
      nationality: l.nationality,
      birthDate: l.birthDate,
      deathDate: l.deathDate,
      imageUrl: l.imageUrl,
      prizes: l.laureatePrizes.map((lp) => ({
        id: lp.prize.id,
        year: lp.prize.year,
        category: lp.prize.category,
        motivation: lp.motivation,
        share: lp.share,
      })),
    }));

    return { items, total, page, pageSize };
  }),

  get: publicProcedure.input(laureateGetInput).handler(async ({ input }) => {
    const laureate = await db.query.laureates.findFirst({
      where: eq(laureates.id, input.id),
      with: {
        laureatePrizes: {
          with: { prize: true },
        },
      },
    });

    if (!laureate) {
      throw new ORPCError("NOT_FOUND", { message: "Laureate not found" });
    }

    return {
      id: laureate.id,
      name: laureate.name,
      nameJa: laureate.nameJa,
      nationality: laureate.nationality,
      birthDate: laureate.birthDate,
      deathDate: laureate.deathDate,
      imageUrl: laureate.imageUrl,
      biography: laureate.biography,
      prizes: laureate.laureatePrizes.map((lp) => ({
        id: lp.prize.id,
        year: lp.prize.year,
        category: lp.prize.category,
        motivation: lp.motivation ?? lp.prize.motivation,
        share: lp.share,
      })),
    };
  }),
};
