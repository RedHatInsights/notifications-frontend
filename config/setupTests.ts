import 'jest';
import { enableMapSet } from 'immer';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

// Polyfill for crypto.randomUUID in jsdom environment
if (typeof window !== 'undefined' && !window.crypto.randomUUID) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  window.crypto.randomUUID = crypto.randomUUID.bind(crypto);
}

const mockChrome = {
  init: jest.fn(),
  identifyApp: jest.fn(() => Promise.resolve()),
  getApp: jest.fn(() => 'my-app'),
  getBundle: jest.fn(() => 'my-bundle'),
  getEnvironment: jest.fn(() => 'ci'),
  on: jest.fn(),
  auth: {
    getUser: jest.fn(() =>
      Promise.resolve({
        identity: {
          account_number: '123456',
          internal: { org_id: '78900', account_id: 1800 },
          type: 'User',
          user: {
            email: 'some-user@some-email.com',
            first_name: 'First name',
            is_active: true,
            is_internal: true,
            is_org_admin: false,
            last_name: 'Last',
            locale: 'en_US',
            username: 'flast',
          },
        },
      })
    ),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
  },
  isProd: false,
  isBeta: jest.fn(() => true),
  isPenTest: jest.fn(() => false),
  updateDocumentTitle: jest.fn(),
  appNavClick: jest.fn(),
  addWsEventListener: jest.fn(() => jest.fn()),
};

// Global useChrome mock for all tests
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => mockChrome,
}));

jest.setTimeout(10000);

mockResizeObserver();
enableMapSet();
