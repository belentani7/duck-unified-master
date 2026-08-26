import { TRPCError } from "@trpc/server";
import { getDb } from "../db";

export type StudioDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

export function requireStudioDb(database: Awaited<ReturnType<typeof getDb>>): StudioDb {
  if (!database) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "A base de dados do estúdio está temporariamente indisponível.",
    });
  }
  return database;
}
