import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { categoriesRouter } from "./categories";
import { favoritesRouter } from "./favorites";
import { laureatesRouter } from "./laureates";
import { prizesRouter } from "./prizes";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return { status: "ok" };
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  laureates: laureatesRouter,
  prizes: prizesRouter,
  categories: categoriesRouter,
  favorites: favoritesRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
