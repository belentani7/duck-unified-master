/**
 * Diseño: Laboratorio de señal nocturna. Marca compacta, técnica y con Verde Duck Signal.
 */
type StudioLogoProps = {
  compact?: boolean;
};

export default function StudioLogo({ compact = false }: StudioLogoProps) {
  return (
    <div className="studio-logo" aria-label="Duck Studio Suite">
      <img
        className="studio-logo__mark"
        src="/manus-storage/duck-studio-logo_8a973c67.png"
        alt="Símbolo Duck Studio"
      />
      {!compact && (
        <div className="studio-logo__wordmark">
          <strong>DUCK</strong>
          <span>STUDIO SUITE</span>
        </div>
      )}
    </div>
  );
}
