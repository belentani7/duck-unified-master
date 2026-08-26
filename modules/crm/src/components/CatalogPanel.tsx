import { useMemo, useState } from "react";
import { Check, FileText, Music2, Percent, ShoppingBag, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function CatalogPanel() {
  const catalogQuery = trpc.studio.catalog.useQuery(undefined, { retry: false });
  const [copied, setCopied] = useState(false);
  const referral = catalogQuery.data?.referrals?.[0];
  const offersByInstrumental = useMemo(() => new Map((catalogQuery.data?.licenseOffers || []).map((offer) => [offer.instrumentalId, offer])), [catalogQuery.data?.licenseOffers]);
  const exportQuote = () => {
    if (!catalogQuery.data) return;
    const payload = { studio: "Duck · Ritmo & Frequência", referralCode: referral?.code || null, discountPercent: referral?.discountPercent || 0, generatedAt: new Date().toISOString(), items: catalogQuery.data.instrumentals, licenseOffers: catalogQuery.data.licenseOffers, referrals: catalogQuery.data.referrals };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "duck-orcamento-contrato.json"; anchor.click(); URL.revokeObjectURL(url); setCopied(true);
  };
  const instrumentals = catalogQuery.data?.instrumentals || [];
  return <section className="management-workspace"><div className="workspace-heading"><div><span className="panel-kicker">CATÁLOGO · INSTRUMENTAIS</span><h2>Licenças que protegem o som</h2><p>Dados persistidos do estúdio, ofertas reais e referidos ativos.</p></div><button className="secondary-button" onClick={exportQuote} disabled={!catalogQuery.data}><FileText size={15} /> {copied ? "Arquivo exportado" : "Gerar orçamento"}</button></div><div className="catalog-grid">{instrumentals.map((beat) => { const offer = offersByInstrumental.get(beat.id); return <article className="catalog-card" key={beat.id}><div className="catalog-cover"><Music2 size={24} /><span>{beat.bpm || "—"} BPM · {beat.musicalKey || "—"}</span></div><div className="catalog-body"><span className="panel-kicker">{beat.genre || "Instrumental"}</span><h3>{beat.name}</h3><div className="license-list">{offer ? <div key={offer.id}><Tag size={13} />{offer.kind} · R$ {(offer.priceCents / 100).toFixed(2).replace(".", ",")}</div> : <div><Tag size={13} />Oferta ainda não cadastrada</div>}</div><div className="split-line"><Percent size={13} /> Split persistido <b>{offer?.split || "Aguardando configuração"}</b></div><button className="text-button" disabled={!offer}><ShoppingBag size={14} /> Selecionar licença</button></div></article>; })}</div>{!catalogQuery.isLoading && instrumentals.length === 0 && <div className="empty-state">Nenhum instrumental persistido no catálogo deste estúdio.</div>}<div className="referral-banner"><div><span className="panel-kicker">PROGRAMA DE REFERIDOS</span><b>Promova o ecossistema Duck e libere desconto automático.</b><small>{referral ? `Código ativo: ${referral.code} · Desconto persistido: ${referral.discountPercent}%` : "Nenhum código ativo cadastrado"}</small></div><div className="referral-control"><Check size={16} /></div></div><div className="contract-note"><FileText size={15} /><span><b>Contratos exportáveis</b><small>A proposta inclui ofertas e referidos persistidos para revisão antes da assinatura.</small></span></div></section>;
}
