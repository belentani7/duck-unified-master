import { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export function BelentaniExperience() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ownerCandidate = user?.role === "admin" && user.name === "Lucas Silva";
  const artifactQuery = trpc.studio.belentaniExperience.useQuery(undefined, {
    enabled: ownerCandidate,
    retry: false,
    staleTime: Infinity,
  });

  if (!artifactQuery.data) return null;

  return (
    <div className="belentani-easter-egg" data-testid="belentani-experience">
      <button
        type="button"
        className="belentani-seal"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir assinatura Belentani"
        title=""
      >
        <KeyRound size={11} strokeWidth={1.5} />
      </button>
      {open && (
        <aside className="belentani-card" role="dialog" aria-label="Belentani Experience">
          <button type="button" className="belentani-close" onClick={() => setOpen(false)} aria-label="Fechar assinatura">
            <X size={13} />
          </button>
          <span className="belentani-kicker">{artifactQuery.data.fragmentLabel}</span>
          <strong>{artifactQuery.data.title}</strong>
          <p>{artifactQuery.data.signature}</p>
          <blockquote>“{artifactQuery.data.message}”</blockquote>
          <small>Artefato personalizado · não funcional · somente para Duck</small>
        </aside>
      )}
    </div>
  );
}
