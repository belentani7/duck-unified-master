type CatalogSeed = { name: string; type: string; cat: string; lic: string; url?: string };

const categories = ["Synths", "Mix & Master", "Beatmaking", "Effects", "Dynamics", "Meters", "Restoration"];
const licenses = ["Commercial", "FL Studio Native", "Freemium / Open Source", "Subscription"];

const catalogSeeds: CatalogSeed[] = [
  { name: "butterDAWg (FL Studio 20 Clone)", type: "Open Source DAW Companion", cat: "DAW Tools", lic: "Open Source (GPL)", url: "https://github.com/jaybee18/butterdawg" },
  { name: "flskinner (Theme Applier)", type: "UI Theme Skinner", cat: "Customization", lic: "Open Source (MIT)", url: "https://github.com/erikbwu/flskinner" },
  { name: "FL Studio Automatic Plugin Organizer", type: "Manufacturer Sorter", cat: "Workflow", lic: "Open Source (MIT)", url: "https://github.com/Koros1691/FL-Studio-Automatic-Plugin-Organizer" },
  { name: "FL-PluginDB-Organiser", type: "Database Manager", cat: "Workflow", lic: "Open Source (MIT)", url: "https://github.com/demberto/FL-PluginDB-Organiser" },
  { name: "FL-Custom-Intonation", type: "Microtonal Patcher Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/Windows81/FL-Custom-Intonation" },
  { name: "FL-Studio-Presets", type: "Patcher Sound Design", cat: "Presets", lic: "Open Source", url: "https://github.com/MysteryPancake/FL-Studio-Presets" },
  { name: "crossfadelimiter", type: "Patcher Utility Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/kisoqual/crossfadelimiter" },
  { name: "proxima", type: "Patcher Effect Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/kisoqual/proxima" },
  { name: "Serum (Xfer Records)", type: "Wavetable Synth", cat: "Synths", lic: "Commercial" },
  { name: "FabFilter Pro-Q 3", type: "Dynamic Equalizer", cat: "Mix & Master", lic: "Commercial" },
  { name: "Gross Beat (Image-Line)", type: "Time / Pitch Effector", cat: "Beatmaking", lic: "FL Studio Native" },
  { name: "Vital (Matt Tytel)", type: "Spectral Wavetable", cat: "Synths", lic: "Freemium / Open Source" },
  { name: "Valhalla VintageVerb", type: "Algorithmic Reverb", cat: "Effects", lic: "Commercial" },
];

export function getPluginCatalog() {
  const fullList = [...catalogSeeds];
  for (let index = catalogSeeds.length; index < 400; index += 1) {
    const category = categories[index % categories.length];
    fullList.push({
      name: `Catálogo FL Studio ${String(index + 1).padStart(3, "0")}`,
      type: `Ferramenta de ${category}`,
      cat: category,
      lic: licenses[index % licenses.length],
    });
  }

  return fullList.map((plugin, index) => ({
    id: index + 1,
    name: plugin.name,
    type: plugin.type,
    license: plugin.lic,
    flCompat: "Compatibilidade a confirmar",
    category: plugin.cat,
    verifiedSource: Boolean(plugin.url),
    url: plugin.url || null,
  }));
}
