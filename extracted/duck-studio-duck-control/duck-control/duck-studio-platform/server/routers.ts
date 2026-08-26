import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAutomationAudit,
  createFeedback,
  createLead,
  createOwnerAsset,
  createCatalogProduct,
  createLicenseTemplate,
  assignCatalogAsset,
  createCrmLeadNote,
  createOperationTask,
  createProjectBrief,
  createPrivacyRequest,
  approveProjectMilestone,
  getAutomationControl,
  getClientProjects,
  getClientLicenses,
  getClientProjectWorkspace,
  getOwnerOverview,
  getOwnerAssets,
  getOwnerCatalog,
  getCrmLeads,
  getOwnerOperations,
  getPrivacyRequests,
  getProjectBriefs,
  getPublicCatalogProducts,
  getLicensedAssetUrl,
  getRevenueScenarioSettings,
  processLeadPrivacyRequest,
  buildRevenueScenarios,
  updateRevenueScenarioSettings,
  updateCrmLeadStatus,
  updateAutomationControl,
} from "./db";
import { assessAutomation } from "./studioDomain";
import { listExternalResourceAdapters } from "./externalResources";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  leads: router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(160),
      email: z.string().email().max(320),
      service: z.string().min(2).max(80),
      message: z.string().trim().max(3000).optional(),
      marketingConsent: z.boolean(),
      privacyRegion: z.string().min(2).max(40),
    })).mutation(({ input }) => createLead(input)),
  }),
  privacy: router({
    request: publicProcedure.input(z.object({
      email: z.string().email().max(320),
      requestType: z.enum(["access", "deletion", "consent_withdrawal"]),
      privacyRegion: z.string().min(2).max(40),
    })).mutation(({ input }) => createPrivacyRequest(input)),
  }),
  catalog: router({
    list: publicProcedure.query(() => getPublicCatalogProducts()),
  }),
  portal: router({
    briefs: protectedProcedure.query(({ ctx }) => getProjectBriefs(ctx.user.id)),
    projects: protectedProcedure.query(({ ctx }) => getClientProjects(ctx.user.id)),
    licenses: protectedProcedure.query(({ ctx }) => getClientLicenses(ctx.user.id)),
    licensedAssetUrl: protectedProcedure.input(z.object({ licenseId: z.number().int().positive(), assetId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => getLicensedAssetUrl(ctx.user.id, input.licenseId, input.assetId)),
    submitBrief: protectedProcedure.input(z.object({
      title: z.string().trim().min(3).max(160),
      objective: z.string().trim().min(10).max(3000),
      references: z.string().trim().max(3000).optional(),
      mood: z.string().trim().max(80).optional(),
      bpm: z.number().int().min(40).max(240).optional(),
      genre: z.string().trim().max(80).optional(),
    })).mutation(({ ctx, input }) => createProjectBrief(ctx.user.id, input)),
    projectWorkspace: protectedProcedure.input(z.object({ projectId: z.number().int().positive() }))
      .query(({ ctx, input }) => getClientProjectWorkspace(ctx.user.id, input.projectId)),
    feedback: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), message: z.string().trim().min(2).max(2000) }))
      .mutation(({ ctx, input }) => createFeedback(ctx.user.id, input.projectId, input.message)),
    approveMilestone: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), milestoneId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => approveProjectMilestone(ctx.user.id, input.projectId, input.milestoneId)),
  }),
  automations: router({
    preview: adminProcedure.input(z.object({
      hasConsent: z.boolean(),
      hasRecipient: z.boolean(),
      action: z.enum(["email_follow_up", "project_update", "delivery_notice"]),
      jurisdiction: z.string().optional(),
    })).query(async ({ input }) => {
      const control = await getAutomationControl();
      return assessAutomation({ ...input, globalPaused: control.globalPaused, manualApproval: control.manualApproval });
    }),
  }),
  owner: router({
    overview: adminProcedure.query(() => getOwnerOverview()),
    externalResources: adminProcedure.query(() => listExternalResourceAdapters()),
    assets: adminProcedure.query(() => getOwnerAssets()),
    catalog: adminProcedure.query(() => getOwnerCatalog()),
    crmLeads: adminProcedure.query(() => getCrmLeads()),
    operations: adminProcedure.query(() => getOwnerOperations()),
    privacyRequests: adminProcedure.query(() => getPrivacyRequests()),
    revenueScenario: adminProcedure.query(async () => buildRevenueScenarios(await getRevenueScenarioSettings())),
    control: adminProcedure.query(() => getAutomationControl()),
    createTask: adminProcedure.input(z.object({
      taskType: z.string().trim().min(3).max(120),
      priority: z.enum(["low", "normal", "high", "critical"]),
      source: z.string().trim().min(3).max(120),
      requiresApproval: z.boolean(),
    })).mutation(({ ctx, input }) => createOperationTask(ctx.user.id, input)),
    updateLeadStatus: adminProcedure.input(z.object({ leadId: z.number().int().positive(), status: z.enum(["new", "qualified", "active", "closed"]) }))
      .mutation(({ ctx, input }) => updateCrmLeadStatus(ctx.user.id, input.leadId, input.status)),
    addLeadNote: adminProcedure.input(z.object({ leadId: z.number().int().positive(), note: z.string().trim().min(2).max(2000) }))
      .mutation(({ ctx, input }) => createCrmLeadNote(ctx.user.id, input.leadId, input.note)),
    uploadAsset: adminProcedure.input(z.object({
      label: z.string().trim().min(2).max(180),
      category: z.enum(["audio", "image", "video", "preset", "document", "project_file", "other"]),
      filename: z.string().trim().min(1).max(240),
      mimeType: z.string().trim().min(3).max(120),
      base64: z.string().min(4).max(11_000_000),
      accessLevel: z.enum(["private", "client", "licensed", "public"]),
    })).mutation(({ ctx, input }) => createOwnerAsset(ctx.user.id, input)),
    createLicenseTemplate: adminProcedure.input(z.object({ name: z.string().trim().min(2).max(160), version: z.string().trim().min(1).max(40), termsText: z.string().trim().min(20).max(20_000) }))
      .mutation(({ ctx, input }) => createLicenseTemplate(ctx.user.id, input)),
    createCatalogProduct: adminProcedure.input(z.object({
      name: z.string().trim().min(2).max(180),
      description: z.string().trim().max(5000).optional(),
      category: z.enum(["beat", "license", "production", "service", "preset", "digital_file", "package"]),
      priceCents: z.number().int().min(0).max(100_000_000).optional(),
      licenseTemplateId: z.number().int().positive().optional(),
    })).mutation(({ ctx, input }) => createCatalogProduct(ctx.user.id, input)),
    assignCatalogAsset: adminProcedure.input(z.object({ productId: z.number().int().positive(), assetId: z.number().int().positive(), role: z.enum(["preview", "cover", "licensed_file", "documentation"]) }))
      .mutation(({ ctx, input }) => assignCatalogAsset(ctx.user.id, input)),
    updateRevenueScenario: adminProcedure.input(z.object({
      qualifiedVisits: z.number().int().min(0).max(10_000_000),
      conversionBasisPoints: z.number().int().min(0).max(10_000),
      averageTicketCents: z.number().int().min(0).max(100_000_000),
      variableCostBasisPoints: z.number().int().min(0).max(10_000),
    })).mutation(async ({ ctx, input }) => {
      const result = await updateRevenueScenarioSettings(ctx.user.id, input);
      await createAutomationAudit({ action: "revenue_scenario_updated", status: "ready", risk: "low", detail: "Premissas de cenário de receita atualizadas pelo proprietário.", ownerId: ctx.user.id });
      return result;
    }),
    processPrivacyRequest: adminProcedure.input(z.object({ requestId: z.number().int().positive(), identityVerified: z.boolean() }))
      .mutation(({ ctx, input }) => processLeadPrivacyRequest(ctx.user.id, input)),
    updateControl: adminProcedure.input(z.object({ globalPaused: z.boolean(), manualApproval: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const result = await updateAutomationControl(ctx.user.id, input.globalPaused, input.manualApproval);
        await createAutomationAudit({
          action: "owner_control_updated",
          status: input.globalPaused ? "paused" : "ready",
          risk: "low",
          detail: `Pausa global: ${input.globalPaused ? "ativa" : "inativa"}. Aprovação manual: ${input.manualApproval ? "ativa" : "inativa"}.`,
          ownerId: ctx.user.id,
        });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
