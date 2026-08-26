import { Activity, Check, CircleDollarSign, MessageCircle, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function ActivityHistoryPanel() {
  const query = trpc.studio.activities.useQuery(undefined, { retry: false });
  const notificationsQuery = trpc.studio.notifications.useQuery(undefined, { retry: false, refetchInterval: 5000 });
  const notifications = notificationsQuery.data || [];
  const activityRows = query.data || [];
  const rows = [...notifications.map((item) => ({ action: "Atualização persistente", detail: item.message, tone: "cyan", createdAt: item.createdAt })), ...activityRows.map((item) => ({ action: item.action, detail: `Projeto #${item.projectId}`, tone: "lime", createdAt: item.createdAt }))];
  return <section className="panel history-panel"><div className="panel-heading"><div><span className="panel-kicker">AUDIT TRAIL · PERSISTENTE</span><h2>Histórico do estúdio</h2></div><Activity size={17} className="panel-muted" /></div><div className="activity-list">{rows.length ? rows.map((item, index) => <div className="activity-item" key={`${item.action}-${index}`}><div className={`activity-icon ${item.tone}`}>{item.tone === "lime" ? <Check size={15} /> : item.tone === "violet" ? <MessageCircle size={15} /> : item.tone === "amber" ? <CircleDollarSign size={15} /> : <ShieldCheck size={15} />}</div><div><b>{item.action}</b><span>{item.detail}</span></div><time>{item.createdAt ? new Date(item.createdAt).toLocaleString("pt-BR") : "agora"}</time></div>) : <div className="empty-state">Nenhuma atividade persistida para este usuário.</div>}</div></section>;
}
