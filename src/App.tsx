import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import TermDetail from "./pages/TermDetail.tsx";
import Processes from "./pages/Processes.tsx";
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
          <Route path="/processes" element={<Processes />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/prototypes" element={<Prototypes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
