import type { z } from "zod";
import type { colabInputSchema } from "./validation";

type ColabInput = z.infer<typeof colabInputSchema>;

export function createColabReply(input: ColabInput) {
  const message = input.message.toLowerCase();
  const isPortuguese = input.language === "pt";
  const prefix = isPortuguese ? "Quack! " : input.language === "es" ? "¡Quack! " : input.language === "fr" ? "Coin-coin ! " : "Quack! ";
  let reply = isPortuguese
    ? "Sou o CoLab local do DUCK. Posso orientar o fluxo de projeto, stems, comentários por timestamp e o catálogo legal. Ainda não sou um modelo treinado nem substituo uma escuta humana."
    : input.language === "es"
      ? "Soy el CoLab local de DUCK. Puedo orientar sobre proyectos, stems, comentarios por timestamp y el catálogo legal. No soy un modelo entrenado ni sustituyo una escucha humana."
      : input.language === "en"
        ? "I am DUCK's local CoLab. I can guide projects, stems, timestamp comments and the legal catalog. I am not a trained model and do not replace human listening."
        : input.language === "fr"
          ? "Je suis le CoLab local de DUCK. Je peux guider les projets, les stems, les commentaires horodatés et le catalogue légal. Je ne suis pas un modèle entraîné."
          : "Sono il CoLab locale di DUCK. Posso guidare progetti, stem, commenti temporizzati e catalogo legale. Non sono un modello addestrato.";

  if (message.includes("mix") || message.includes("master") || message.includes("lufs")) {
    reply = isPortuguese
      ? "Para uma primeira revisão, confira picos true peak abaixo de -1 dBTP, LUFS integrado conforme o destino e traduza qualquer decisão em uma nota por timestamp. O portal permite guardar essa nota no projeto."
      : `${prefix}Use uma referência, verifique true peak e loudness para o destino e registre a decisão no timestamp correspondente.`;
  } else if (message.includes("beat") || message.includes("trap") || message.includes("808")) {
    reply = isPortuguese
      ? "No trap, compare o subgrave com o bumbo em volume baixo e use automação antes de empilhar processamento. O CoLab pode sugerir um checklist, mas a decisão final deve vir da escuta."
      : `${prefix}Compare subgrave e bumbo em volume baixo, automatize antes de empilhar processamento e valide com referência.`;
  } else if (message.includes("stem") || message.includes("portal") || message.includes("cliente")) {
    reply = isPortuguese
      ? "O fluxo real é: crie ou selecione um projeto, envie um stem de áudio, abra a revisão, escreva um comentário com timestamp e marque o estado como aprovado ou revisão solicitada."
      : `${prefix}El flujo real es crear o seleccionar un proyecto, enviar el stem, comentarlo con timestamp y marcarlo como aprobado o con revisión solicitada.`;
  } else if (message.includes("plugin") || message.includes("vault") || message.includes("catálogo")) {
    reply = isPortuguese
      ? "O Vault contém referências de ferramentas. As fontes GitHub estão marcadas quando verificadas; plugins comerciais não são clonados, distribuídos nem apresentados como instalados."
      : `${prefix}El Vault reúne referencias legales. Las fuentes GitHub verificadas están marcadas y los plugins comerciales no se clonan ni se distribuyen.`;
  }

  return {
    reply: prefix + reply.replace(/^(Quack! |¡Quack! |Coin-coin ! )/, ""),
    duckStatus: "online" as const,
    bpm: 140,
    activePlugins: 400,
    mode: "local-rule-based" as const,
  };
}
