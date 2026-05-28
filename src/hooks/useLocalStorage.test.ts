import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads existing value from localStorage", () => {
    localStorage.setItem("key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("writes to localStorage on update", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    act(() => result.current[1]("updated"));
    expect(JSON.parse(localStorage.getItem("key")!)).toBe("updated");
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("key", "not-json");
    const { result } = renderHook(() => useLocalStorage("key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("handles localStorage write errors gracefully", () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("QuotaExceededError");
    };

    const { result } = renderHook(() => useLocalStorage("key", "default"));
    // Should not throw when updating
    act(() => result.current[1]("updated"));
    expect(result.current[0]).toBe("updated");

    Storage.prototype.setItem = originalSetItem;
  });

  it("handles objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("obj", { count: 0 })
    );
    act(() => result.current[1]({ count: 5 }));
    expect(result.current[0]).toEqual({ count: 5 });
    expect(JSON.parse(localStorage.getItem("obj")!)).toEqual({ count: 5 });
  });
});
