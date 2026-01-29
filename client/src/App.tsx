port { Toaster } from "@/components/ui/sonner";
import NokiaSnakeReact from "./pages/nokia_snake_react";
import BudgetCatcherReact from "./pages/budget_catcher_react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Clicker from "./pages/Clicker";
import Mandala from "./pages/Mandala";
import Counter from "./pages/Counter";
import Craft from "./pages/Craft";
import Size from "@/pages/SizeCompare";
import MonumentTour from "@/pages/MonumentTour";
import ReactionTime from "@/pages/ReactionTime";
import UselessClicker from "@/pages/UselessClicker";
import PerfectShapeDrawer from "@/pages/PerfectShapeDrawer";
import MemoryDoodle from "@/pages/MemoryDoodle";
import Lagori from "@/pages/Lagori";
import DiwaliCelebration from "@/pages/DiwaliCelebration";
import HoliColors from "@/pages/HoliColors";
import CulturalQuiz from "@/pages/CulturalQuiz";
import SimonMemoryGame from "@/pages/simon_memory_game";
import TeddyPlatformerGame from "@/pages/teddy_platformer_game";

function Router() {
  return (
        <WouterRouter base="/houde_kharch">
    <Switch>
      <Route path="/spend-money" component={Home} />
      <Route path="/clicker" component={Clicker} />
      <Route path="/mandala" component={Mandala} />
      <Route path="/counter" component={Counter} />
            <Route path="/budget-catcher" component={BudgetCatcherReact} />
            <Route path="/nokia-snake" component={NokiaSnakeReact} />
      <Route path="/craft" component={Craft} />
      <Route path="/size-compare" component={Size} />
      <Route path="/monument-tour" component={MonumentTour} />
      <Route path="/reaction-time" component={ReactionTime} />
      <Route path="/useless-clicker" component={UselessClicker} />
      <Route path="/perfect-shape" component={PerfectShapeDrawer} />
      <Route path="/memory-doodle" component={MemoryDoodle} />
      <Route path="/lagori" component={Lagori} />
      <Route path="/diwali" component={DiwaliCelebration} />
      <Route path="/holi" component={HoliColors} />
      <Route path="/cultural-quiz" component={CulturalQuiz} />
              <Route path="/simon-memory" component={SimonMemoryGame} />
        <Route path="/teddy-platformer" component={TeddyPlatformerGame} />
      <Route path="/" component={Home} />      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
                </WouterRouter>
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
        defaultTheme="light"
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
