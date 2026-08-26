export const AUDIO_QUEUE_MAX_ATTEMPTS = 45;

export function isAudioQueueTimedOut(attempts: number, maxAttempts = AUDIO_QUEUE_MAX_ATTEMPTS) {
  return attempts >= maxAttempts;
}

export function resolveAudioQueueState(status: string | undefined, attempts: number, maxAttempts = AUDIO_QUEUE_MAX_ATTEMPTS) {
  if (status === "completed") return "concluído" as const;
  if (status === "error" || isAudioQueueTimedOut(attempts, maxAttempts)) return "erro" as const;
  return "processando" as const;
}
