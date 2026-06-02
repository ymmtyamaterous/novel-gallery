import { db } from "@better-t-app/db";
import { favorites, laureates, prizes } from "@better-t-app/db/schema/app";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { protectedProcedure } from "../index";

const favoriteAddInput = z.object({
  targetType: z.enum(["laureate", "prize"]),
  targetId: z.string(),
});

const favoriteRemoveInput = z.object({
  id: z.string(),
});

export const favoritesRouter = {
  list: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const items = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      orderBy: (f, { desc }) => [desc(f.createdAt)],
    });

    // 各お気に入りに対象データを付与
    const enriched = await Promise.all(
      items.map(async (fav) => {
        let laureate = null;
        let prize = null;

        if (fav.targetType === "laureate") {
          const l = await db.query.laureates.findFirst({
            where: eq(laureates.id, fav.targetId),
            with: {
              laureatePrizes: { with: { prize: true } },
            },
          });
          if (l) {
            laureate = {
              id: l.id,
              name: l.name,
              nameJa: l.nameJa,
              nationality: l.nationality,
              imageUrl: l.imageUrl,
              prizes: l.laureatePrizes.map((lp) => ({
                id: lp.prize.id,
                year: lp.prize.year,
                category: lp.prize.category,
              })),
            };
          }
        } else if (fav.targetType === "prize") {
          const p = await db.query.prizes.findFirst({
            where: eq(prizes.id, fav.targetId),
            with: {
              laureatePrizes: { with: { laureate: true } },
            },
          });
          if (p) {
            prize = {
              id: p.id,
              year: p.year,
              category: p.category,
              motivation: p.motivation,
              laureates: p.laureatePrizes.map((lp) => ({
                id: lp.laureate.id,
                name: lp.laureate.name,
              })),
            };
          }
        }

        return {
          id: fav.id,
          targetType: fav.targetType as "laureate" | "prize",
          targetId: fav.targetId,
          createdAt: fav.createdAt?.toISOString() ?? "",
          laureate,
          prize,
        };
      }),
    );

    return { items: enriched };
  }),

  add: protectedProcedure.input(favoriteAddInput).handler(async ({ input, context }) => {
    const userId = context.session.user.id;
    const { targetType, targetId } = input;

    // 対象の存在確認
    if (targetType === "laureate") {
      const l = await db.query.laureates.findFirst({ where: eq(laureates.id, targetId) });
      if (!l) throw new ORPCError("NOT_FOUND", { message: "Laureate not found" });
    } else {
      const p = await db.query.prizes.findFirst({ where: eq(prizes.id, targetId) });
      if (!p) throw new ORPCError("NOT_FOUND", { message: "Prize not found" });
    }

    const id = crypto.randomUUID();
    await db.insert(favorites).values({ id, userId, targetType, targetId });

    const created = await db.query.favorites.findFirst({ where: eq(favorites.id, id) });
    return {
      id: created!.id,
      targetType: created!.targetType as "laureate" | "prize",
      targetId: created!.targetId,
      createdAt: created!.createdAt?.toISOString() ?? "",
    };
  }),

  remove: protectedProcedure.input(favoriteRemoveInput).handler(async ({ input, context }) => {
    const userId = context.session.user.id;

    const fav = await db.query.favorites.findFirst({
      where: and(eq(favorites.id, input.id), eq(favorites.userId, userId)),
    });
    if (!fav) throw new ORPCError("NOT_FOUND", { message: "Favorite not found" });

    await db.delete(favorites).where(eq(favorites.id, input.id));
    return { success: true };
  }),
};
