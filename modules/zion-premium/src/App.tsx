import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DuckFullStudioPro from "./pages/DuckFullStudioPro";

const Home = lazy(() => import("./pages/Home"));
const DuckOriginalHTML = lazy(() => import("./pages/DuckOriginalHTML"));
const DuckMegaHTML = lazy(() => import("./pages/DuckMegaHTML"));
const DuckStudioModern = lazy(() => import("./pages/DuckStudioModern"));
const DuckFullStudioWorkspace = lazy(() => import("./pages/DuckFullStudioWorkspace"));
const DuckAuditStudio = lazy(() => import("./pages/DuckAuditStudio"));

function Router() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#050805] text-[#00ff66] flex items-center justify-center font-mono text-sm">Carregando módulo DUCK…</main>}>
      <Switch>
        <Route path={"/"} component={DuckFullStudioPro} />
        <Route path={"/workspace"} component={DuckFullStudioWorkspace} />
        <Route path={"/public"} component={DuckStudioModern} />
        <Route path={"/mega"} component={DuckMegaHTML} />
        <Route path={"/original"} component={DuckOriginalHTML} />
        <Route path={"/audit"} component={DuckAuditStudio} />
        <Route path={"/react"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
