import { render, screen } from '@testing-library/react';
import * as React from 'react';

import IntegrationsEntry from './IntegrationsEntry';

let mockChromeLanguage: string | undefined;

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  const mockUseChrome = jest.fn(() => ({
    language: mockChromeLanguage,
    auth: { getToken: jest.fn() },
  }));
  return { __esModule: true, default: mockUseChrome, useChrome: mockUseChrome };
});

jest.mock('./shared/i18n', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');
  const actual = jest.requireActual('./shared/i18n');
  return {
    ...actual,
    IntlMessagesProvider: ({ locale, children }: { locale: string; children: React.ReactNode }) =>
      ReactModule.createElement(
        'div',
        { 'data-testid': 'intl-messages-provider', 'data-locale': locale },
        children
      ),
  };
});

jest.mock('./app/IntegrationsApp', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');
  return {
    __esModule: true,
    default: () => ReactModule.createElement('div', null, 'integrations app'),
  };
});

jest.mock('./store/Store', () => ({
  getNotificationsRegistry: () => ({ getStore: () => ({}) }),
}));

jest.mock('./utils/insights-common-typescript', () => ({
  createFetchingClient: jest.fn(() => ({})),
}));

jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-fetching-library', () => ({
  ClientContextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('IntegrationsEntry locale', () => {
  afterEach(() => {
    mockChromeLanguage = undefined;
  });

  it('passes the Chrome language to IntlMessagesProvider', () => {
    mockChromeLanguage = 'fr';

    render(<IntegrationsEntry />);

    expect(screen.getByTestId('intl-messages-provider')).toHaveAttribute('data-locale', 'fr');
  });

  it('falls back to English when Chrome has no language', () => {
    mockChromeLanguage = undefined;

    render(<IntegrationsEntry />);

    expect(screen.getByTestId('intl-messages-provider')).toHaveAttribute('data-locale', 'en');
  });
});
