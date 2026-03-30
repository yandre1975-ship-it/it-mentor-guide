import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AiChat } from "@/components/AiChat";
import Index from "./pages/Index.tsx";
import TermDetail from "./pages/TermDetail.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Quizzes from "./pages/Quizzes.tsx";
import Favorites from "./pages/Favorites.tsx";
import Specialties from "./pages/Specialties.tsx";
import Prototypes from "./pages/Prototypes.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/term/:id" element={<TermDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/processes" element={<HowItWorks />} />
          <Route path="/features" element={<HowItWorks />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/prototypes" element={<Prototypes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AiChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
