import { db } from "@better-t-app/db";
import { prizes } from "@better-t-app/db/schema/app";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { publicProcedure } from "../index";

const prizesListInput = z.object({
  category: z.string().optional(),
  year: z.number().int().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

const prizeGetInput = z.object({
  id: z.string(),
});

export const prizesRouter = {
  list: publicProcedure.input(prizesListInput).handler(async ({ input }) => {
    const { category, year, page, pageSize } = input;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (category) {
      conditions.push(eq(prizes.category, category));
    }
    if (year) {
      conditions.push(eq(prizes.year, year));
    }

    const allPrizes = await db.query.prizes.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        laureatePrizes: {
          with: { laureate: true },
        },
      },
      orderBy: (p, { desc }) => [desc(p.year)],
    });

    const total = allPrizes.length;
    const items = allPrizes.slice(offset, offset + pageSize).map((p) => ({
      id: p.id,
      year: p.year,
      category: p.category,
      motivation: p.motivation,
      laureates: p.laureatePrizes.map((lp) => ({
        id: lp.laureate.id,
        name: lp.laureate.name,
        nameJa: lp.laureate.nameJa,
        nationality: lp.laureate.nationality,
        imageUrl: lp.laureate.imageUrl,
        motivation: lp.motivation,
        share: lp.share,
      })),
    }));

    return { items, total, page, pageSize };
  }),

  get: publicProcedure.input(prizeGetInput).handler(async ({ input }) => {
    const prize = await db.query.prizes.findFirst({
      where: eq(prizes.id, input.id),
      with: {
        laureatePrizes: {
          with: { laureate: true },
        },
      },
    });

    if (!prize) {
      throw new ORPCError("NOT_FOUND", { message: "Prize not found" });
    }

    return {
      id: prize.id,
      year: prize.year,
      category: prize.category,
      motivation: prize.motivation,
      laureates: prize.laureatePrizes.map((lp) => ({
        id: lp.laureate.id,
        name: lp.laureate.name,
        nameJa: lp.laureate.nameJa,
        nationality: lp.laureate.nationality,
        imageUrl: lp.laureate.imageUrl,
        birthDate: lp.laureate.birthDate,
        deathDate: lp.laureate.deathDate,
        motivation: lp.motivation,
        share: lp.share,
      })),
    };
  }),
};
