import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { label: "Beats", href: "/beats" },
  { label: "Serviços", href: "/#services" },
  { label: "Beat Lab", href: "/beat-lab" },
  { label: "Recursos", href: "/resources" },
];

export function StudioNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  return <header className="studio-header"><div className="container flex h-20 items-center justify-between gap-4">
    <Link href="/" className="brand-mark" aria-label="Duck, início"><span className="brand-dot" /><span>DUCK</span><small>STUDIO</small></Link>
    <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">{links.map((link) => <a className={location === link.href ? "nav-link active" : "nav-link"} href={link.href} key={link.href}>{link.label}</a>)}</nav>
    <div className="hidden items-center gap-3 sm:flex"><div className="flex items-center gap-1 text-[.65rem] font-bold"><Link href="/" className="rounded-full bg-emerald-300 px-2 py-1 text-emerald-950">PT</Link><Link href="/es" className="rounded-full px-2 py-1 text-emerald-100/60 hover:text-white">ES</Link><Link href="/en" className="rounded-full px-2 py-1 text-emerald-100/60 hover:text-white">EN</Link></div>{isAuthenticated ? <Link href="/portal" className="nav-link">Portal</Link> : <Button variant="ghost" className="text-emerald-50 hover:bg-white/10 hover:text-white" onClick={() => startLogin()}>Acesso do cliente</Button>}<a href="/#contact" className="glow-button">Vamos criar</a></div>
    <button onClick={() => setOpen(!open)} className="glass-icon-button sm:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={20} /> : <Menu size={20} />}</button>
  </div>{open && <div className="container pb-5 sm:hidden"><nav className="glass-panel flex flex-col gap-1 p-3" aria-label="Menu móvel">{links.map((link) => <a onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-emerald-50 hover:bg-white/10" href={link.href} key={link.href}>{link.label}</a>)}<a onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-emerald-50 hover:bg-white/10" href={isAuthenticated ? "/portal" : "#"}>{isAuthenticated ? "Portal" : "Acesso do cliente"}</a></nav></div>}</header>;
}

export function StudioFooter() {
  return <footer className="border-t border-white/10 bg-[#03130f] py-10"><div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><div className="brand-mark mb-3"><span className="brand-dot" /><span>DUCK</span><small>STUDIO</small></div><p className="max-w-sm text-sm leading-6 text-emerald-100/55">Produção, beats e direção sonora. Cada entrega começa com intenção e termina pronta para tocar.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-emerald-100/65"><a href="/beats" className="hover:text-white">Beats</a><a href="/resources" className="hover:text-white">Recursos para Windows</a><a href="/#contact" className="hover:text-white">Contato</a><a href="/portal" className="hover:text-white">Portal</a><a href="/privacy" className="hover:text-white">Privacidade</a></div></div></footer>;
}
