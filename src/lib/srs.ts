export interface SrsCard {
  termId: string;
  interval: number; // days
  repetitions: number;
  easeFactor: number;
  nextReview: string; // ISO date
  lastReviewed?: string;
}

const DEFAULT_EASE = 2.5;

export function createCard(termId: string): SrsCard {
  const now = new Date();
  return {
    termId,
    interval: 0,
    repetitions: 0,
    easeFactor: DEFAULT_EASE,
    nextReview: now.toISOString(),
  };
}

export function reviewCard(card: SrsCard, quality: number): SrsCard {
  // quality: 0=again, 3=hard, 4=good, 5=easy
  let { interval, repetitions, easeFactor } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReview.toISOString(),
    lastReviewed: new Date().toISOString(),
  };
}

export function isDue(card: SrsCard): boolean {
  return new Date(card.nextReview) <= new Date();
}
