import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Book, Workflow, BrainCircuit, Star, Menu, Briefcase, Layers, RotateCcw, GraduationCap, ChevronUp, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/', icon: Sparkles, label: 'AI Помощник' },
  { to: '/terms', icon: Book, label: 'Термины' },
  { to: '/specialties', icon: Briefcase, label: 'Специальности' },
  { to: '/how-it-works', icon: Workflow, label: 'Как работает' },
  { to: '/quizzes', icon: BrainCircuit, label: 'Квизы' },
  { to: '/prototypes', icon: Layers, label: 'Схемы' },
  { to: '/review', icon: RotateCcw, label: 'Повторение' },
  { to: '/career-quiz', icon: GraduationCap, label: 'Профориентация' },
  { to: '/favorites', icon: Star, label: 'Избранное' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [progress] = useLocalStorage<Record<string, string[]>>('it-library-module-progress', {});

  const isTermPage = location.pathname.startsWith('/term/');
  const isLearnPage = location.pathname.startsWith('/learn/');
  const showNavProgress = isTermPage || isLearnPage;

  const moduleProgress = progress['internet'] || [];
  const progressPercent = Math.round((moduleProgress.length / 5) * 100);

  // Close mobile menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur no-print">
        <div className="container flex h-14 items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold shrink-0 mr-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-mono text-sm font-bold">IT</span>
            </div>
            <span className="hidden sm:inline font-heading text-lg tracking-tight">Библиотека</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-wrap">
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors whitespace-nowrap
                    ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <ThemeToggle />

          {/* Mobile menu — Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors" aria-label="Меню">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link to="/" className="flex items-center gap-2 font-bold" onClick={() => setMobileOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-mono text-sm font-bold">IT</span>
                    </div>
                    <span className="font-heading text-lg tracking-tight">Библиотека</span>
                  </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                          ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Progress bar under header */}
        {showNavProgress && (
          <div className="h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 container py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 no-print hidden md:block">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium font-heading">IT-Библиотека</span>
          </div>
          <div className="flex items-center gap-4">
            {navItems.slice(4).map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 no-print pb-[env(safe-area-inset-bottom)]">
        <div className="relative mx-4 mb-3">
          <div className="flex items-end justify-around bg-background/90 backdrop-blur border rounded-2xl shadow-elevated h-16 px-1">
            {navItems.slice(0, 4).map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center justify-center gap-0.5 h-14 w-12"
                >
                  <div className="relative">
                    <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    {active && <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-[10px] leading-none ${active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item.label}</span>
                </Link>
              );
            })}

            {/* More — Bottom Sheet */}
            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-0.5 h-14 w-12">
                  <div className="relative">
                    <ChevronUp className={`h-5 w-5 transition-colors ${navItems.slice(4).some(i => i.to === location.pathname) ? 'text-primary' : 'text-muted-foreground'}`} />
                    {navItems.slice(4).some(i => i.to === location.pathname) && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className={`text-[10px] leading-none ${navItems.slice(4).some(i => i.to === location.pathname) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Ещё</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
                <div className="p-2 space-y-1">
                  {navItems.slice(4).map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                          ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}
