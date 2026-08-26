import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Beats = lazy(() => import("./pages/Beats"));
const Assets = lazy(() => import("./pages/Assets"));
const BeatLab = lazy(() => import("./pages/BeatLab"));
const Control = lazy(() => import("./pages/Control"));
const CRM = lazy(() => import("./pages/CRM"));
const Commerce = lazy(() => import("./pages/Commerce"));
const ExternalResources = lazy(() => import("./pages/ExternalResources"));
const Growth = lazy(() => import("./pages/Growth"));
const Licenses = lazy(() => import("./pages/Licenses"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Portal = lazy(() => import("./pages/Portal"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacyControl = lazy(() => import("./pages/PrivacyControl"));
const Resources = lazy(() => import("./pages/Resources"));
const SpanishPublic = lazy(() => import("./pages/PublicLocale").then((module) => ({ default: module.SpanishPublic })));
const EnglishPublic = lazy(() => import("./pages/PublicLocale").then((module) => ({ default: module.EnglishPublic })));
const SpanishBeats = lazy(() => import("./pages/PublicLocaleExtras").then((module) => ({ default: module.SpanishBeats })));
const EnglishBeats = lazy(() => import("./pages/PublicLocaleExtras").then((module) => ({ default: module.EnglishBeats })));
const SpanishPrivacy = lazy(() => import("./pages/PublicLocaleExtras").then((module) => ({ default: module.SpanishPrivacy })));
const EnglishPrivacy = lazy(() => import("./pages/PublicLocaleExtras").then((module) => ({ default: module.EnglishPrivacy })));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/beats"} component={Beats} />
      <Route path={"/assets"} component={Assets} />
      <Route path={"/portal"} component={Portal} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/privacy-control"} component={PrivacyControl} />
      <Route path={"/beat-lab"} component={BeatLab} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/control"} component={Control} />
      <Route path={"/crm"} component={CRM} />
      <Route path={"/commerce"} component={Commerce} />
      <Route path={"/external-resources"} component={ExternalResources} />
      <Route path={"/growth"} component={Growth} />
      <Route path={"/licenses"} component={Licenses} />
      <Route path={"/es"} component={SpanishPublic} />
      <Route path={"/en"} component={EnglishPublic} />
      <Route path={"/es/beats"} component={SpanishBeats} />
      <Route path={"/en/beats"} component={EnglishBeats} />
      <Route path={"/es/privacy"} component={SpanishPrivacy} />
      <Route path={"/en/privacy"} component={EnglishPrivacy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
          <Suspense fallback={<div className="studio-page grid min-h-screen place-items-center"><div className="loader-ring" /></div>}><Router /></Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
