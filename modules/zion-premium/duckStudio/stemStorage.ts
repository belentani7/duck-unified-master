import { duckStems } from "../../drizzle/schema";
import { storageGet, storageGetSignedUrl } from "../storage";

export function sanitizeStemName(stemName: string) {
  return stemName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .slice(0, 100);
}

export async function attachPrivateStemLinks(stem: typeof duckStems.$inferSelect) {
  const publicPath = await storageGet(stem.fileKey);
  let downloadUrl = publicPath.url;
  try {
    downloadUrl = await storageGetSignedUrl(stem.fileKey);
  } catch {
    // O proxy continua disponível como fallback; a chave de armazenamento nunca é enviada ao cliente.
  }

  const { fileKey: _fileKey, ...safeStem } = stem;
  return { ...safeStem, fileUrl: publicPath.url, downloadUrl };
}
