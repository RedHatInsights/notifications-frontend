import 'jest';
import { enableMapSet } from 'immer';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

import { mockResizeObserver } from './testutils/ResizeObserverMock';
import { mockInsights } from '../src/utils/insights-common-typescript';

// Polyfill for crypto.randomUUID in jsdom environment
if (typeof window !== 'undefined' && !window.crypto.randomUUID) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  window.crypto.randomUUID = crypto.randomUUID.bind(crypto);
}

mockInsights();
jest.setTimeout(10000);

mockResizeObserver();
enableMapSet();
