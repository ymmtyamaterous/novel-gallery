import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

// ノーベル賞部門
export const PRIZE_CATEGORIES = [
  "physics",
  "chemistry",
  "medicine",
  "literature",
  "peace",
  "economics",
] as const;

export type PrizeCategory = (typeof PRIZE_CATEGORIES)[number];

// 受賞者テーブル
export const laureates = sqliteTable(
  "laureates",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    nameJa: text("name_ja"),
    birthDate: text("birth_date"),
    deathDate: text("death_date"),
    nationality: text("nationality"),
    biography: text("biography"),
    imageUrl: text("image_url"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("laureates_name_idx").on(table.name),
    index("laureates_nationality_idx").on(table.nationality),
  ],
);

// 賞テーブル
export const prizes = sqliteTable(
  "prizes",
  {
    id: text("id").primaryKey(),
    year: integer("year").notNull(),
    category: text("category").notNull(),
    motivation: text("motivation"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("prizes_year_idx").on(table.year),
    index("prizes_category_idx").on(table.category),
    uniqueIndex("prizes_year_category_idx").on(table.year, table.category),
  ],
);

// 受賞者 × 賞 中間テーブル
export const laureatePrizes = sqliteTable(
  "laureate_prizes",
  {
    id: text("id").primaryKey(),
    laureateId: text("laureate_id")
      .notNull()
      .references(() => laureates.id, { onDelete: "cascade" }),
    prizeId: text("prize_id")
      .notNull()
      .references(() => prizes.id, { onDelete: "cascade" }),
    motivation: text("motivation"),
    share: integer("share").notNull().default(1),
  },
  (table) => [
    index("lp_laureate_idx").on(table.laureateId),
    index("lp_prize_idx").on(table.prizeId),
    uniqueIndex("lp_unique_idx").on(table.laureateId, table.prizeId),
  ],
);

// お気に入りテーブル
export const favorites = sqliteTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    targetType: text("target_type").notNull(), // "laureate" | "prize"
    targetId: text("target_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("favorites_user_idx").on(table.userId),
    uniqueIndex("favorites_unique_idx").on(table.userId, table.targetType, table.targetId),
  ],
);

// リレーション定義
export const laureatesRelations = relations(laureates, ({ many }) => ({
  laureatePrizes: many(laureatePrizes),
  favorites: many(favorites),
}));

export const prizesRelations = relations(prizes, ({ many }) => ({
  laureatePrizes: many(laureatePrizes),
  favorites: many(favorites),
}));

export const laureatePrizesRelations = relations(laureatePrizes, ({ one }) => ({
  laureate: one(laureates, {
    fields: [laureatePrizes.laureateId],
    references: [laureates.id],
  }),
  prize: one(prizes, {
    fields: [laureatePrizes.prizeId],
    references: [prizes.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, {
    fields: [favorites.userId],
    references: [user.id],
  }),
}));
