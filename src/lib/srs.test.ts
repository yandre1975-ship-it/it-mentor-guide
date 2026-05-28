import { describe, it, expect } from "vitest";
import { createCard, reviewCard, isDue } from "./srs";

describe("SRS algorithm", () => {
  it("creates card with default ease 2.5", () => {
    const card = createCard("test");
    expect(card.easeFactor).toBe(2.5);
    expect(card.interval).toBe(0);
    expect(card.repetitions).toBe(0);
    expect(card.termId).toBe("test");
  });

  it("resets interval and repetitions on wrong answer (quality 0)", () => {
    const card = { ...createCard("test"), interval: 10, repetitions: 5 };
    const updated = reviewCard(card, 0);
    expect(updated.repetitions).toBe(0);
    expect(updated.interval).toBe(1);
  });

  it("sets interval to 1 on first correct answer", () => {
    const card = createCard("test");
    const updated = reviewCard(card, 4);
    expect(updated.repetitions).toBe(1);
    expect(updated.interval).toBe(1);
  });

  it("sets interval to 3 on second correct answer", () => {
    const card = { ...createCard("test"), repetitions: 1, interval: 1 };
    const updated = reviewCard(card, 4);
    expect(updated.repetitions).toBe(2);
    expect(updated.interval).toBe(3);
  });

  it("multiplies interval by easeFactor on third+ correct answer", () => {
    const card = {
      ...createCard("test"),
      repetitions: 2,
      interval: 3,
      easeFactor: 2.5,
    };
    const updated = reviewCard(card, 4);
    expect(updated.repetitions).toBe(3);
    expect(updated.interval).toBe(Math.round(3 * 2.5));
  });

  it("does not drop easeFactor below 1.3", () => {
    let card = createCard("test");
    for (let i = 0; i < 20; i++) {
      card = reviewCard(card, 0);
    }
    expect(card.easeFactor).toBe(1.3);
  });

  it("increases easeFactor on easy answer", () => {
    const card = createCard("test");
    const updated = reviewCard(card, 5);
    expect(updated.easeFactor).toBeGreaterThan(2.5);
  });

  it("decreases easeFactor on hard answer", () => {
    const card = createCard("test");
    const updated = reviewCard(card, 3);
    expect(updated.easeFactor).toBeLessThan(2.5);
  });

  it("schedules next review in the future", () => {
    const card = createCard("test");
    const updated = reviewCard(card, 4);
    expect(new Date(updated.nextReview) > new Date()).toBe(true);
  });

  it("marks card as due when nextReview is in the past", () => {
    const card = {
      ...createCard("test"),
      nextReview: new Date(Date.now() - 86400000).toISOString(),
    };
    expect(isDue(card)).toBe(true);
  });

  it("does not mark card as due when nextReview is in the future", () => {
    const card = {
      ...createCard("test"),
      nextReview: new Date(Date.now() + 86400000).toISOString(),
    };
    expect(isDue(card)).toBe(false);
  });

  it("sets lastReviewed on review", () => {
    const before = new Date().toISOString();
    const card = createCard("test");
    const updated = reviewCard(card, 4);
    expect(updated.lastReviewed).toBeDefined();
    expect(updated.lastReviewed! >= before).toBe(true);
  });
});
