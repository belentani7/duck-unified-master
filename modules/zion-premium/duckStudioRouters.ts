import { TRPCError } from "@trpc/server";
import { duckAuditLogs, duckComments, duckProjects, duckStems } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { requireOwnedProject, writeStudioAudit } from "./duckStudio/access";
import { getPluginCatalog } from "./duckStudio/catalog";
import { createColabReply } from "./duckStudio/colab";
import { attachPrivateStemLinks, sanitizeStemName } from "./duckStudio/stemStorage";
import { requireStudioDb } from "./duckStudio/studioDb";
import {
  MAX_STEM_BYTES,
  colabInputSchema,
  commentInputSchema,
  isAllowedStemMime,
  projectIdInputSchema,
  projectInputSchema,
  stemStatusInputSchema,
  stemUploadInputSchema,
} from "./duckStudio/validation";

function requireCreatedRecord<T>(record: T | undefined, entityName: string): T {
  if (!record) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Não foi possível confirmar o ${entityName} criado.` });
  }
  return record;
}

function requireInsertId(result: unknown, entityName: string) {
  const header = Array.isArray(result) ? result[0] : result;
  const insertId = Number((header as { insertId?: number } | undefined)?.insertId);
  if (!Number.isInteger(insertId) || insertId < 1) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Não foi possível identificar o ${entityName} criado.` });
  }
  return insertId;
}

export const duckStudioRouter = router({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const database = requireStudioDb(await getDb());
    return database
      .select()
      .from(duckProjects)
      .where(eq(duckProjects.ownerOpenId, ctx.user.openId))
      .orderBy(desc(duckProjects.createdAt));
  }),

  createProject: protectedProcedure.input(projectInputSchema).mutation(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    const projectInsert = await database.insert(duckProjects).values({
      ownerOpenId: ctx.user.openId,
      name: input.name,
      artist: input.artist,
      bpm: input.bpm,
      key: input.key,
      genre: input.genre,
      status: "Novo Projeto",
      progress: 0,
    });
    const projectId = requireInsertId(projectInsert, "projeto");
    const [createdProject] = await database
      .select()
      .from(duckProjects)
      .where(eq(duckProjects.id, projectId))
      .limit(1);
    const project = requireCreatedRecord(createdProject, "projeto");
    await writeStudioAudit(
      database,
      ctx.user.openId,
      "PROJECT_CREATED",
      `Projeto ${project.id} criado por ${ctx.user.name || ctx.user.email || "utilizador autenticado"}.`,
    );
    return { success: true, project };
  }),

  getClients: protectedProcedure.query(async ({ ctx }) => {
    const database = requireStudioDb(await getDb());
    const projects = await database
      .select()
      .from(duckProjects)
      .where(eq(duckProjects.ownerOpenId, ctx.user.openId))
      .orderBy(desc(duckProjects.createdAt));
    return projects.map(project => ({
      id: project.id,
      projectId: project.id,
      name: project.artist,
      project: project.name,
      deadline: null,
      status: project.status,
      progress: project.progress,
      link: `/portal/projeto/${project.id}`,
      notes: "Dados derivados do projeto persistente. Os comentários e estados de stems aparecem ao selecionar o projeto.",
    }));
  }),

  getStems: protectedProcedure.input(projectIdInputSchema).query(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    await requireOwnedProject(database, input.projectId, ctx.user.openId);
    const stems = await database
      .select()
      .from(duckStems)
      .where(eq(duckStems.projectId, input.projectId))
      .orderBy(desc(duckStems.createdAt));
    return Promise.all(stems.map(attachPrivateStemLinks));
  }),

  uploadStem: protectedProcedure.input(stemUploadInputSchema).mutation(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    if (!isAllowedStemMime(input.mimeType)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Envie um arquivo de áudio WAV, MP3, FLAC, OGG, AAC ou M4A." });
    }

    const project = await requireOwnedProject(database, input.projectId, ctx.user.openId);
    const rawBase64 = input.base64Data.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(rawBase64, "base64");
    if (!buffer.length || buffer.length > MAX_STEM_BYTES) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "O stem deve ter entre 1 byte e 125 MB." });
    }

    const safeName = sanitizeStemName(input.stemName);
    const objectKey = `stems/project_${input.projectId}/${Date.now()}_${safeName}`;
    const stored = await storagePut(objectKey, buffer, input.mimeType);
    const stemInsert = await database.insert(duckStems).values({
      projectId: input.projectId,
      stemName: input.stemName,
      fileKey: stored.key,
      fileUrl: stored.url,
      fileSize: buffer.length,
      status: "enviado",
    });
    const stemId = requireInsertId(stemInsert, "stem");
    const [createdStem] = await database.select().from(duckStems).where(eq(duckStems.id, stemId)).limit(1);
    const stem = requireCreatedRecord(createdStem, "stem");
    await writeStudioAudit(
      database,
      ctx.user.openId,
      "STEM_UPLOADED",
      `Stem ${stem.id} anexado ao projeto ${project.id} por ${ctx.user.name || ctx.user.email || "utilizador autenticado"}.`,
    );
    return { success: true, stem: await attachPrivateStemLinks(stem) };
  }),

  updateStemStatus: protectedProcedure.input(stemStatusInputSchema).mutation(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    const [existingStem] = await database.select().from(duckStems).where(eq(duckStems.id, input.stemId)).limit(1);
    if (!existingStem) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Stem não encontrado." });
    }
    await requireOwnedProject(database, existingStem.projectId, ctx.user.openId);
    await database
      .update(duckStems)
      .set({
        status: input.status,
        reviewNote: input.reviewNote || null,
        reviewedAt: new Date(),
        reviewedBy: ctx.user.name || ctx.user.email || "utilizador autenticado",
      })
      .where(eq(duckStems.id, input.stemId));
    const [updatedStem] = await database.select().from(duckStems).where(eq(duckStems.id, input.stemId)).limit(1);
    const stem = requireCreatedRecord(updatedStem, "stem atualizado");
    await writeStudioAudit(database, ctx.user.openId, "STEM_STATUS_UPDATED", `Stem ${input.stemId} atualizado para ${input.status}.`);
    return { success: true, stem: await attachPrivateStemLinks(stem) };
  }),

  getComments: protectedProcedure.input(projectIdInputSchema).query(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    await requireOwnedProject(database, input.projectId, ctx.user.openId);
    return database
      .select()
      .from(duckComments)
      .where(eq(duckComments.projectId, input.projectId))
      .orderBy(desc(duckComments.createdAt));
  }),

  addComment: protectedProcedure.input(commentInputSchema).mutation(async ({ input, ctx }) => {
    const database = requireStudioDb(await getDb());
    await requireOwnedProject(database, input.projectId, ctx.user.openId);
    const commentInsert = await database.insert(duckComments).values(input);
    const commentId = requireInsertId(commentInsert, "comentário");
    const [createdComment] = await database.select().from(duckComments).where(eq(duckComments.id, commentId)).limit(1);
    const comment = requireCreatedRecord(createdComment, "comentário");
    await writeStudioAudit(
      database,
      ctx.user.openId,
      "COMMENT_ADDED",
      `Comentário ${comment.id} criado no projeto ${input.projectId} em ${input.timestampSeconds}s.`,
    );
    return { success: true, comment };
  }),

  getAuditLogs: protectedProcedure.query(async ({ ctx }) => {
    const database = requireStudioDb(await getDb());
    return database
      .select()
      .from(duckAuditLogs)
      .where(eq(duckAuditLogs.ownerOpenId, ctx.user.openId))
      .orderBy(desc(duckAuditLogs.createdAt))
      .limit(100);
  }),

  getPlugins: publicProcedure.query(getPluginCatalog),
  aiChat: publicProcedure.input(colabInputSchema).mutation(({ input }) => createColabReply(input)),
});
