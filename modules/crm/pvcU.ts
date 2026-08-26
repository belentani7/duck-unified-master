import { z } from "zod";

export const PVCU_VERSION = "1.0-grounded";

export const taskStatusSchema = z.enum(["pending", "in_progress", "completed", "canceled"]);
export const taskPrioritySchema = z.enum(["low", "normal", "high"]);

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório").max(120, "O título deve ter no máximo 120 caracteres"),
  description: z.string().trim().max(2000, "A descrição deve ter no máximo 2000 caracteres").optional(),
  projectId: z.number().int().positive().optional(),
  clientId: z.number().int().positive().optional(),
  priority: taskPrioritySchema.default("normal"),
  dueAt: z.date().optional(),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export type ValidationIssue = {
  code: string;
  path: string;
  message: string;
};

export type ValidationEnvelope<T> = {
  protocol: "PVC-U";
  version: typeof PVCU_VERSION;
  validationId: string;
  traceId: string;
  status: "PASSED" | "FAILED";
  layer: "structural" | "semantic";
  data?: T;
  issues: ValidationIssue[];
};

export function createTraceId() {
  const randomUUID = globalThis.crypto?.randomUUID;
  return randomUUID ? randomUUID.call(globalThis.crypto) : `trace-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function issue(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message };
}

/**
 * Valida o contrato de tarefa sem efeitos colaterais. O envelope é retornado
 * para telemetria/UX; o ledger persistente continua fora do escopo desta fase.
 */
export function validateTaskInput(input: unknown, traceId = createTraceId()): ValidationEnvelope<TaskInput> {
  const structural = taskInputSchema.safeParse(input);
  if (!structural.success) {
    return {
      protocol: "PVC-U",
      version: PVCU_VERSION,
      validationId: createTraceId(),
      traceId,
      status: "FAILED",
      layer: "structural",
      issues: structural.error.issues.map((item) => issue(`PVC-1${item.code}`, item.path.join(".") || "input", item.message)),
    };
  }

  const value = structural.data;
  const semanticIssues: ValidationIssue[] = [];
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value.title)) {
    semanticIssues.push(issue("PVC-2XX", "title", "O título contém caracteres de controle não permitidos"));
  }
  if (value.description && /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value.description)) {
    semanticIssues.push(issue("PVC-2XX", "description", "A descrição contém caracteres de controle não permitidos"));
  }

  if (semanticIssues.length) {
    return {
      protocol: "PVC-U",
      version: PVCU_VERSION,
      validationId: createTraceId(),
      traceId,
      status: "FAILED",
      layer: "semantic",
      issues: semanticIssues,
    };
  }

  return {
    protocol: "PVC-U",
    version: PVCU_VERSION,
    validationId: createTraceId(),
    traceId,
    status: "PASSED",
    layer: "semantic",
    data: value,
    issues: [],
  };
}

export const groundedValidationProfile = {
  protocol: "PVC-U Ω-Max · grounded subset",
  version: PVCU_VERSION,
  implemented: [
    "Validação estrutural Zod para tarefas",
    "Regras semânticas puras para conteúdo textual",
    "RBAC e ownership no servidor",
    "Headers de versão e traceId no cliente",
    "Estados de erro acessíveis no formulário",
  ],
  explicitlyNotImplemented: [
    "Next.js migration, XState and OpenTelemetry SDK",
    "HMAC client-side without a server-held secret",
    "QKD, homomorphic encryption, PINNs and automatic axiom rewriting",
    "Validation Ledger persistent; current envelopes are not stored as audit records",
  ],
} as const;
