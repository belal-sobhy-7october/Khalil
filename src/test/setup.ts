import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia; components using useMediaQuery need it defined.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

// jsdom logs "Not implemented" for scrolling; the hub scrolls to the top when a tab opens.
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
