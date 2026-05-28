import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/PageTransition";
import AiAssistant from "./pages/AiAssistant";
import Terms from "./pages/Index";
import TermDetail from "./pages/TermDetail";
import HowItWorks from "./pages/HowItWorks";
import Quizzes from "./pages/Quizzes";
import Favorites from "./pages/Favorites";
import Specialties from "./pages/Specialties";
import Prototypes from "./pages/Prototypes";
import LearnModule from "./pages/LearnModule";
import CareerQuiz from "./pages/CareerQuiz";
import Review from "./pages/Review";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<AiAssistant />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/term/:id" element={<TermDetail />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/processes" element={<HowItWorks />} />
        <Route path="/features" element={<HowItWorks />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/specialties" element={<Specialties />} />
        <Route path="/prototypes" element={<Prototypes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/learn/:moduleId" element={<LearnModule />} />
        <Route path="/career-quiz" element={<CareerQuiz />} />
        <Route path="/review" element={<Review />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
