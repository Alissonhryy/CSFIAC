import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cursos" component={Courses} />
        <Route path="/instrutores" component={Instructors} />
        <Route path="/relatorios" component={Report} />
        <Route path="/configuracoes" component={() => <div className="p-8 text-center text-muted-foreground">Configurações em desenvolvimento</div>} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
