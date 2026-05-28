import type { Category } from '@/data/types';

export interface CategoryColor {
  label: string;
  hex: string;
  hexDark: string;
  twBg: string;
  twText: string;
  twBorder: string;
  twBgDark: string;
  twTextDark: string;
  icon: string; // icon name reference
}

export const categoryColors: Record<Exclude<Category, 'specialties'>, CategoryColor> = {
  basics: {
    label: 'Основы',
    hex: '#6366F1',
    hexDark: '#818CF8',
    twBg: 'bg-[#6366F1]',
    twText: 'text-[#6366F1]',
    twBorder: 'border-[#6366F1]',
    twBgDark: 'dark:bg-[#818CF8]',
    twTextDark: 'dark:text-[#818CF8]',
    icon: 'brain',
  },
  web: {
    label: 'Фронтенд',
    hex: '#F59E0B',
    hexDark: '#FBBF24',
    twBg: 'bg-[#F59E0B]',
    twText: 'text-[#F59E0B]',
    twBorder: 'border-[#F59E0B]',
    twBgDark: 'dark:bg-[#FBBF24]',
    twTextDark: 'dark:text-[#FBBF24]',
    icon: 'monitor',
  },
  development: {
    label: 'Бэкенд',
    hex: '#10B981',
    hexDark: '#34D399',
    twBg: 'bg-[#10B981]',
    twText: 'text-[#10B981]',
    twBorder: 'border-[#10B981]',
    twBgDark: 'dark:bg-[#34D399]',
    twTextDark: 'dark:text-[#34D399]',
    icon: 'server',
  },
  databases: {
    label: 'Базы данных',
    hex: '#10B981',
    hexDark: '#34D399',
    twBg: 'bg-[#10B981]',
    twText: 'text-[#10B981]',
    twBorder: 'border-[#10B981]',
    twBgDark: 'dark:bg-[#34D399]',
    twTextDark: 'dark:text-[#34D399]',
    icon: 'server',
  },
  architecture: {
    label: 'Архитектура',
    hex: '#EC4899',
    hexDark: '#F472B6',
    twBg: 'bg-[#EC4899]',
    twText: 'text-[#EC4899]',
    twBorder: 'border-[#EC4899]',
    twBgDark: 'dark:bg-[#F472B6]',
    twTextDark: 'dark:text-[#F472B6]',
    icon: 'building',
  },
  ai: {
    label: 'Искусственный интеллект',
    hex: '#8B5CF6',
    hexDark: '#A78BFA',
    twBg: 'bg-[#8B5CF6]',
    twText: 'text-[#8B5CF6]',
    twBorder: 'border-[#8B5CF6]',
    twBgDark: 'dark:bg-[#A78BFA]',
    twTextDark: 'dark:text-[#A78BFA]',
    icon: 'shield',
  },
};

export const categoryBgLight: Record<Exclude<Category, 'specialties'>, string> = {
  basics: '#EEF2FF',
  web: '#FFFBEB',
  development: '#ECFDF5',
  databases: '#ECFDF5',
  architecture: '#FDF2F8',
  ai: '#F5F3FF',
};

export const categoryBgDark: Record<Exclude<Category, 'specialties'>, string> = {
  basics: 'rgba(99,102,241,0.15)',
  web: 'rgba(245,158,11,0.15)',
  development: 'rgba(16,185,129,0.15)',
  databases: 'rgba(16,185,129,0.15)',
  architecture: 'rgba(236,72,153,0.15)',
  ai: 'rgba(139,92,246,0.15)',
};

export function getCategoryStyle(category: Category) {
  if (category === 'specialties') {
    return {
      bg: 'bg-slate-500',
      text: 'text-slate-500',
      border: 'border-slate-500',
      bgLight: '#F1F5F9',
      hex: '#64748B',
    };
  }
  const c = categoryColors[category];
  return {
    bg: c.twBg,
    text: c.twText,
    border: c.twBorder,
    bgLight: categoryBgLight[category],
    hex: c.hex,
  };
}

export function getCategoryBorderColor(category: Category): string {
  if (category === 'specialties') return 'border-l-slate-500';
  return categoryColors[category]?.twBorder.replace('border-', 'border-l-') ?? 'border-l-primary';
}
