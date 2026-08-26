export type ExternalResourceAdapter = {
  id: "music_metadata" | "tone_js" | "audioflux" | "pdmx" | "bcb_open_data" | "open_finance_brasil" | "stable_audio_open";
  name: string;
  source: "github" | "hugging_face" | "bcb";
  purpose: string;
  activation: "package" | "isolated_service" | "public_data" | "regulated_partner" | "contract_review";
  enabled: false;
  ownerApprovalRequired: true;
  handlesPersonalFinancialData: false;
  status: "candidate" | "research_only" | "blocked" | "excluded";
  activationChecklist: string[];
};

const adapters: ExternalResourceAdapter[] = [
  {
    id: "music_metadata", name: "music-metadata", source: "github", purpose: "Ler metadados de arquivos próprios no upload.", activation: "package", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "candidate",
    activationChecklist: ["Fixar versão e revisar licença", "Validar tipos de arquivo e tamanho", "Executar testes de upload com ativo autorizado"],
  },
  {
    id: "tone_js", name: "Tone.js", source: "github", purpose: "Prévia e interação sonora com conteúdo autorizado no navegador.", activation: "package", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "candidate",
    activationChecklist: ["Fixar versão e revisar licença", "Usar somente prévias autorizadas", "Validar desempenho e controles de acessibilidade"],
  },
  {
    id: "audioflux", name: "audioFlux", source: "github", purpose: "Extrair características de áudio em processamento separado.", activation: "isolated_service", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "research_only",
    activationChecklist: ["Provisionar serviço isolado", "Definir retenção e exclusão de arquivos", "Avaliar custo, segurança e licença"],
  },
  {
    id: "pdmx", name: "PDMX", source: "hugging_face", purpose: "Pesquisa de estrutura musical simbólica de domínio público.", activation: "isolated_service", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "research_only",
    activationChecklist: ["Manter fora do catálogo", "Revisar termos do dataset", "Documentar procedência e uso de pesquisa"],
  },
  {
    id: "bcb_open_data", name: "Dados Abertos BCB", source: "bcb", purpose: "Contexto macroeconômico público agregado, se necessário.", activation: "public_data", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "candidate",
    activationChecklist: ["Selecionar série pública específica", "Exibir fonte e data de atualização", "Não derivar recomendação financeira ou perfil individual"],
  },
  {
    id: "open_finance_brasil", name: "Open Finance Brasil", source: "bcb", purpose: "Referência de consentimento e arquitetura regulada.", activation: "regulated_partner", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "blocked",
    activationChecklist: ["Ter parceiro regulado", "Implementar consentimento, autenticação e confirmação", "Realizar avaliação jurídica e de segurança"],
  },
  {
    id: "stable_audio_open", name: "Stable Audio Open 1.0", source: "hugging_face", purpose: "Geração de áudio sujeita a licença específica.", activation: "contract_review", enabled: false, ownerApprovalRequired: true, handlesPersonalFinancialData: false, status: "excluded",
    activationChecklist: ["Não integrar automaticamente", "Avaliar licença comercial", "Avaliar infraestrutura e direitos de saída"],
  },
];

export function listExternalResourceAdapters() {
  return adapters.map((adapter) => ({ ...adapter, activationChecklist: [...adapter.activationChecklist] }));
}
