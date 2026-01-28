import { Toaster } from "@/components/ui/sonner";
import NokiaSnakeReact from "./pages/nokia_snake_react";
import BudgetCatcherReact from "./pages/budget_catcher_react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GameHub from "./pages/GameHub";
import Home from "./pages/Home";
import Clicker from "./pages/Clicker";
import Mandala from "./pages/Mandala";
import Counter from "./pages/Counter";
import Quiz from "./pages/Quiz";
import Craft from "./pages/Craft";
import Dilemma from "./pages/Dilemma";
import Size from "@/pages/SizeCompare";
import MonumentTour from "@/pages/MonumentTour";
import EscalatingQuiz from "@/pages/EscalatingQuiz";
import RockPaperScissors from "@/pages/RockPaperScissors";
import ColorMatcher from "@/pages/ColorMatcher";
import ReactionTime from "@/pages/ReactionTime";
import UselessClicker from "@/pages/UselessClicker";
import PerfectShapeDrawer from "@/pages/PerfectShapeDrawer";
import MemoryDoodle from "@/pages/MemoryDoodle";
import InfiniteMixer from "@/pages/InfiniteMixer";
import Lagori from "@/pages/Lagori";
import DiwaliCelebration from "@/pages/DiwaliCelebration";
import HoliColors from "@/pages/HoliColors";
import GudiPadwa from "@/pages/GudiPadwa";
import JanmashtamiDahiHandi from "@/pages/JanmashtamiDahiHandi";
import MakarSankranti from "@/pages/MakarSankranti";
import CulturalQuiz from "@/pages/CulturalQuiz";
import NagPanchami from "@/pages/NagPanchami";
import NaraliPournima from "@/pages/NaraliPournima";

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
      <Route path="/quiz" component={Quiz} />
      <Route path="/craft" component={Craft} />
      <Route path="/dilemma" component={Dilemma} />
      <Route path="/size-compare" component={Size} />
      <Route path="/monument-tour" component={MonumentTour} />
      <Route path="/escalating-quiz" component={EscalatingQuiz} />
      <Route path="/rock-paper-scissors" component={RockPaperScissors} />
      <Route path="/color-matcher" component={ColorMatcher} />
      <Route path="/reaction-time" component={ReactionTime} />
      <Route path="/useless-clicker" component={UselessClicker} />
      <Route path="/perfect-shape" component={PerfectShapeDrawer} />
      <Route path="/memory-doodle" component={MemoryDoodle} />
      <Route path="/infinite-mixer" component={InfiniteMixer} />
      <Route path="/lagori" component={Lagori} />
      <Route path="/diwali" component={DiwaliCelebration} />
      <Route path="/holi" component={HoliColors} />
      <Route path="/gudi-padwa" component={GudiPadwa} />
      <Route path="/janmashtami" component={JanmashtamiDahiHandi} />
      <Route path="/makar-sankranti" component={MakarSankranti} />
      <Route path="/cultural-quiz" component={CulturalQuiz} />
      <Route path="/nag-panchami" component={NagPanchami} />
      <Route path="/narali-pournima" component={NaraliPournima} />
      <Route path="/" component={GameHub} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
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
