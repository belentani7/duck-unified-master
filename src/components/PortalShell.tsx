import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { AudioLines, Blocks, Boxes, FileArchive, FileAudio, FileKey2, Gauge, LogOut, ShieldCheck, ShoppingBag, TrendingUp, UserRound, UserSearch, UsersRound } from "lucide-react";
import { Link, useLocation } from "wouter";

const portalLinks = [
  { href: "/portal", label: "Meu estúdio", icon: Gauge },
  { href: "/beat-lab", label: "Beat Lab", icon: AudioLines },
  { href: "/resources", label: "Recursos", icon: FileAudio },
  { href: "/control", label: "Controle", icon: ShieldCheck },
  { href: "/growth", label: "Crescimento", icon: TrendingUp },
  { href: "/privacy-control", label: "Privacidade", icon: UserSearch },
  { href: "/crm", label: "CRM", icon: UsersRound },
  { href: "/licenses", label: "Licenças", icon: FileKey2 },
  { href: "/assets", label: "Ativos", icon: FileArchive },
  { href: "/commerce", label: "Comércio", icon: ShoppingBag },
  { href: "/external-resources", label: "Recursos", icon: Blocks },
];

export function PortalShell({ children, label }: { children: React.ReactNode; label: string }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  if (loading) return <div className="studio-page grid min-h-screen place-items-center"><div className="loader-ring" /></div>;
  if (!isAuthenticated) return <div className="studio-page grid min-h-screen place-items-center p-6"><div className="glass-panel max-w-md p-8 text-center"><div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-emerald-950"><UserRound /></div><p className="eyebrow">ESPAÇO PRIVADO</p><h1 className="mt-3 font-display text-3xl text-white">Seu estúdio está esperando.</h1><p className="mt-4 text-sm leading-6 text-emerald-100/65">Acesse para enviar briefs, revisar etapas e aprovar entregas em um único lugar.</p><Button className="glow-button mt-7 h-11 w-full" onClick={() => startLogin()}>Entrar no portal</Button><Link className="mt-5 inline-block text-sm text-emerald-300 hover:text-white" href="/">Voltar ao site</Link></div></div>;
  return <div className="studio-page min-h-screen"><aside className="portal-sidebar"><Link href="/" className="brand-mark px-4 py-4"><span className="brand-dot" /><span>DUCK</span><small>STUDIO</small></Link><div className="mt-8 space-y-1">{portalLinks.map(({ href, label: itemLabel, icon: Icon }) => <Link key={href} href={href} className={location === href ? "portal-link active" : "portal-link"}><Icon size={18} />{itemLabel}</Link>)}</div><div className="mt-auto space-y-3 border-t border-white/10 px-4 pt-5"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-300/15 text-sm font-bold text-emerald-200">{user?.name?.slice(0, 1).toUpperCase() ?? "D"}</div><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{user?.name ?? "Cliente"}</p><p className="truncate text-xs text-emerald-100/45">{user?.role === "admin" ? "Proprietário" : "Cliente"}</p></div></div><button onClick={logout} className="portal-link w-full text-emerald-100/60 hover:text-white"><LogOut size={18} />Sair</button></div></aside><main className="portal-main"><div className="mb-7 flex items-center justify-between gap-4"><div><p className="eyebrow">PORTAL DUCK</p><h1 className="mt-1 font-display text-3xl tracking-tight text-white">{label}</h1></div><Link className="portal-home-link" href="/"><Boxes size={17} />Site público</Link></div>{children}</main></div>;
}
