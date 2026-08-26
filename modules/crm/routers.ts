import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { groundedValidationProfile, taskInputSchema, validateTaskInput } from "@shared/pvcU";
import { addProjectComment, approveDelivery, canAccessDelivery, canAccessProject, createClient, createDelivery, createProject, createContractDraft, createSale, createStudioNotification, createStudioTask, getClientPortalData, listActiveReferrals, listAllDeliveries, listClientHistory, listClients, listDeliveries, listInstrumentals, listLicenseOffers, listProjectActivities, listProjects, listSales, listStudioNotifications, listStudioTasks, updateSaleStatus, updateStudioTask } from "./db";

const deny = (message: string) => { throw new TRPCError({ code: "FORBIDDEN", message }); };
const staffProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "collaborator") deny("Acesso restrito à equipe do estúdio");
  return next();
});
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") deny("Ação exclusiva do administrador Duck");
  return next();
});
const isBelentaniOwner = (user: { openId: string; name: string | null; role: string }) =>
  user.role === "admin" &&
  user.name === "Lucas Silva" &&
  Boolean(process.env.OWNER_OPEN_ID) &&
  user.openId === process.env.OWNER_OPEN_ID;
const belentaniOwnerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!isBelentaniOwner(ctx.user)) deny("Artefato reservado ao produtor Duck");
  return next();
});
const viewerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const portal = await getClientPortalData(ctx.user.id);
  if (!portal.client || ctx.user.role !== "viewer") deny("Acesso restrito a cliente-visualizador vinculado");
  return next();
});

async function requireProject(ctx: { user: { id: number; role: string } }, projectId: number) {
  if (!(await canAccessProject(ctx.user.id, ctx.user.role, projectId))) deny("Projeto fora do escopo deste usuário");
}
async function requireDelivery(ctx: { user: { id: number; role: string } }, deliveryId: number) {
  if (!(await canAccessDelivery(ctx.user.id, ctx.user.role, deliveryId))) deny("Entrega fora do escopo deste usuário");
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  studio: router({
    clients: staffProcedure.query(({ ctx }) => listClients(ctx.user.id)),
    clientHistory: staffProcedure.query(({ ctx }) => listClientHistory(ctx.user.id)),
    createClient: adminProcedure.input(z.object({ name: z.string().min(1), email: z.string().email().optional(), genre: z.string().optional(), userId: z.number().int().positive().optional() })).mutation(({ ctx, input }) => createClient({ ownerId: ctx.user.id, role: "viewer", ...input })),
    projects: staffProcedure.query(({ ctx }) => listProjects(ctx.user.id)),
    createProject: adminProcedure.input(z.object({ name: z.string().min(1), clientId: z.number().int().positive().optional(), phase: z.string().default("Pré-produção"), participation: z.string().default("Duck 100%") })).mutation(({ ctx, input }) => createProject({ ownerId: ctx.user.id, ...input })),
    deliveries: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => { await requireProject(ctx, input.projectId); return listDeliveries(input.projectId); }),
    allDeliveries: staffProcedure.query(({ ctx }) => listAllDeliveries(ctx.user.id)),
    createDelivery: staffProcedure.input(z.object({ projectId: z.number().int().positive(), version: z.string(), fileName: z.string(), fileUrl: z.string().optional() })).mutation(async ({ ctx, input }) => { await requireProject(ctx, input.projectId); return createDelivery({ ...input, status: "review" }, ctx.user.id); }),
    approveDelivery: staffProcedure.input(z.object({ deliveryId: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await requireDelivery(ctx, input.deliveryId); const result = await approveDelivery(input.deliveryId, ctx.user.id); await createStudioNotification({ userId: ctx.user.id, kind: "delivery", message: `Entrega #${input.deliveryId} aprovada` }); return result; }),
    comment: protectedProcedure.input(z.object({ deliveryId: z.number().int().positive(), body: z.string().min(1), timestampMs: z.number().int().nonnegative().optional() })).mutation(async ({ ctx, input }) => { await requireDelivery(ctx, input.deliveryId); const result = await addProjectComment({ authorId: ctx.user.id, ...input }); await createStudioNotification({ userId: ctx.user.id, kind: "comment", message: "Novo comentário salvo na entrega" }); return result; }),
    portal: viewerProcedure.query(({ ctx }) => getClientPortalData(ctx.user.id)),
    activities: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => { if (input?.projectId) await requireProject(ctx, input.projectId); else if (ctx.user.role !== "admin" && ctx.user.role !== "collaborator") deny("Informe um projeto dentro do seu escopo"); return listProjectActivities(input?.projectId); }),
    instrumentals: staffProcedure.query(({ ctx }) => listInstrumentals(ctx.user.id)),
    catalog: staffProcedure.query(async ({ ctx }) => ({ instrumentals: await listInstrumentals(ctx.user.id), licenseOffers: await listLicenseOffers(), referrals: await listActiveReferrals() })),
    createSale: adminProcedure.input(z.object({ clientId: z.number().int().positive(), licenseOfferId: z.number().int().positive(), referralCode: z.string().optional() })).mutation(({ input }) => createSale(input)),
    createContractDraft: adminProcedure.input(z.object({ saleId: z.number().int().positive() })).mutation(({ input }) => createContractDraft(input.saleId)),
    sales: staffProcedure.query(() => listSales()),
    updateSaleStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "paid", "refunded"]) })).mutation(async ({ ctx, input }) => { const result = await updateSaleStatus(input.id, input.status, ctx.user.id); await createStudioNotification({ userId: ctx.user.id, kind: "finance", message: `Pagamento #${input.id} alterado para ${input.status}` }); return result; }),
    notifications: protectedProcedure.query(({ ctx }) => listStudioNotifications(ctx.user.id)),
    validationProfile: protectedProcedure.query(() => groundedValidationProfile),
    belentaniExperience: belentaniOwnerProcedure.query(() => ({
      title: "Belentani Experience",
      signature: "Desenvolvido discretamente por Belentani para Duck",
      fragmentLabel: "CHAVE 01/05 · SINAL DE CONFIANÇA",
      message: "Algumas criações não precisam fazer ruído para mudar o ambiente.",
      isFunctional: false,
    })),
    tasks: staffProcedure.query(({ ctx }) => listStudioTasks(ctx.user.id)),
    createTask: staffProcedure.input(taskInputSchema).mutation(({ ctx, input }) => {
      const validation = validateTaskInput(input);
      if (validation.status !== "PASSED" || !validation.data) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `${validation.issues[0]?.code ?? "PVC-100"}: ${validation.issues[0]?.message ?? "Entrada inválida"}` });
      }
      return createStudioTask({ ...validation.data, ownerId: ctx.user.id });
    }),
    updateTaskStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "in_progress", "completed", "canceled"]) })).mutation(({ ctx, input }) => updateStudioTask(input.id, ctx.user.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
