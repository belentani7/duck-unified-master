import { TRPCError } from "@trpc/server";
import { duckAuditLogs, duckProjects } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { StudioDb } from "./studioDb";

export async function writeStudioAudit(database: StudioDb, ownerOpenId: string, action: string, details: string) {
  await database.insert(duckAuditLogs).values({ ownerOpenId, action, details });
}

export async function requireOwnedProject(database: StudioDb, projectId: number, ownerOpenId: string) {
  const [project] = await database.select().from(duckProjects).where(eq(duckProjects.id, projectId)).limit(1);
  if (!project || project.ownerOpenId !== ownerOpenId) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Projeto não encontrado para este utilizador." });
  }
  return project;
}
