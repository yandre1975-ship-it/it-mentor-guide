import { Link, useLocation } from 'react-router-dom';
import { Book, Workflow, BrainCircuit, Star, Search, Menu, X, Briefcase, Layers, Zap, MoreHorizontal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearch } from './GlobalSearch';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

const navItems = [
  { to: '/', icon: Book, label: 'Термины' },
  { to: '/specialties', icon: Briefcase, label: 'Специальности' },
  { to: '/features', icon: Zap, label: 'Фичи' },
  { to: '/prototypes', icon: Layers, label: 'Проекты' },
  { to: '/processes', icon: Workflow, label: 'Процессы' },
  { to: '/quizzes', icon: BrainCircuit, label: 'Квизы' },
  { to: '/favorites', icon: Star, label: 'Избранное' },
];

// Mobile bottom nav: first 4 + "More" for the rest
const mobileMainNav = navItems.slice(0, 4);
const mobileMoreNav = navItems.slice(4);

export function Layout({ children, searchQuery, onSearchChange, showSearch = false }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur no-print">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <Book className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">IT-Библиотека</span>
          </Link>

          {showSearch && (
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}

          <div className="flex-1" />
          <GlobalSearch />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors
                    ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Tablet nav — icons + dropdown */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            {navItems.slice(0, 5).map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center p-2 rounded-md transition-colors
                    ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navItems.slice(5).map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t p-2 flex flex-col gap-1" role="navigation" aria-label="Мобильная навигация">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                    ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 container py-6">
        {children}
      </main>

      {/* Mobile bottom nav — 5 items max (4 + More) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur no-print" role="navigation" aria-label="Основная навигация">
        <div className="flex justify-around py-2">
          {mobileMainNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 text-xs px-2 py-1
                  ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          {/* More button */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex flex-col items-center gap-0.5 text-xs px-2 py-1
                ${mobileMoreNav.some(i => i.to === location.pathname) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <MoreHorizontal className="h-5 w-5" />
              Ещё
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={8}>
              {mobileMoreNav.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="md:hidden h-16" /> {/* bottom nav spacer */}
    </div>
  );
}
