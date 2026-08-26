import { z } from "zod";

export const MAX_STEM_BYTES = 125 * 1024 * 1024;

const allowedStemMime = /^(audio\/(wav|x-wav|mpeg|mp3|flac|ogg|aac|mp4|x-m4a)|application\/octet-stream)$/i;

export const projectInputSchema = z.object({
  name: z.string().trim().min(2).max(255),
  artist: z.string().trim().min(2).max(255),
  bpm: z.number().int().min(40).max(240),
  key: z.string().trim().min(1).max(50),
  genre: z.string().trim().min(2).max(100).default("Trap"),
});

export const projectIdInputSchema = z.object({ projectId: z.number().int().positive() });

export const stemUploadInputSchema = z.object({
  projectId: z.number().int().positive(),
  stemName: z.string().trim().min(1).max(255),
  base64Data: z.string().min(1).max(180_000_000),
  mimeType: z.string().trim().min(1).max(100),
});

export const stemStatusInputSchema = z.object({
  stemId: z.number().int().positive(),
  status: z.enum(["enviado", "aprovado", "revisao_solicitada"]),
  reviewNote: z.string().trim().max(2000).optional(),
});

export const commentInputSchema = z.object({
  projectId: z.number().int().positive(),
  authorName: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1).max(2000),
  timestampSeconds: z.number().min(0).max(24 * 60 * 60),
});

export const colabInputSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  language: z.enum(["pt", "es", "en", "fr", "it"]).default("pt"),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
});

export function isAllowedStemMime(mimeType: string) {
  return allowedStemMime.test(mimeType);
}
