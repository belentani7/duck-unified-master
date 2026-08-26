export type PluginPackStatus = "recommended" | "official-download" | "license-required" | "not-installed";

export type PluginPackItem = {
  productId: string;
  name: string;
  formats: string[];
  category: string;
  officialUrl: string;
  status: PluginPackStatus;
  required: boolean;
  note: string;
};

/** Manifesto de recomendação. Não contiene binários proprietários ni afirma instalación local. */
export const duckMasteringEssentials: { name: string; version: string; items: PluginPackItem[] } = {
  name: "Duck Mastering Essentials",
  version: "0.1-manifest",
  items: [
    { productId: "duck-native-eq", name: "Duck EQ / Dynamics", formats: ["Web Audio", "Standalone local"], category: "EQ", officialUrl: "local://duck-audio-lab", status: "recommended", required: false, note: "Ferramentas internas do DuckOS; disponíveis no Audio Lab, não são VST instalável." },
    { productId: "official-metering", name: "Medidor de loudness compatível", formats: ["VST3", "CLAP"], category: "Metering", officialUrl: "https://www.pluginboutique.com/", status: "official-download", required: false, note: "O download deve ser feito pelo fabricante ou distribuidor oficial." },
    { productId: "official-mastering-suite", name: "Suite de mastering licenciada", formats: ["VST3", "AAX", "Standalone"], category: "Mastering", officialUrl: "https://www.izotope.com/", status: "license-required", required: false, note: "Requer licença própria e instalador oficial; não é redistribuída pelo DuckOS." },
  ],
};
