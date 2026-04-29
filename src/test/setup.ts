import "@testing-library/jest-dom";

// matchMedia polyfill (required by some Radix UI components in jsdom)
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// ResizeObserver polyfill (Radix UI Checkbox / Select rely on it)
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverMock {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  // @ts-expect-error -- assigning a minimal mock for jsdom
  globalThis.ResizeObserver = ResizeObserverMock;
}

// IntersectionObserver polyfill (used by some scroll/visibility components)
if (typeof globalThis.IntersectionObserver === "undefined") {
  class IntersectionObserverMock {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): [] {
      return [];
    }
  }
  // @ts-expect-error -- assigning a minimal mock for jsdom
  globalThis.IntersectionObserver = IntersectionObserverMock;
}
