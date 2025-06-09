import { InsightsType } from '../InsightsType';

interface Window {
  insights: InsightsType;
}

declare const window: Window;

export const mockInsights = (mock?: InsightsType) => {
  window.insights = mock || {
    chrome: {
      init: jest.fn(),
      identifyApp: jest.fn(() => Promise.resolve()),
      on: jest.fn(),
      getApp: jest.fn(() => 'my-app'),
      getBundle: jest.fn(() => 'my-bundle'),
      isPenTest: jest.fn(() => false),
      isProd: false,
      isBeta: jest.fn(() => true),
      getEnvironment: jest.fn(() => 'ci'),
      auth: {
        getUser: jest.fn(() =>
          Promise.resolve({
            identity: {
              account_number: '123456',
              internal: {
                org_id: '78900',
                account_id: 1800,
              },
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
            entitlements: {
              ansible: {
                is_entitled: true,
              },
              cost_management: {
                is_entitled: true,
              },
              insights: {
                is_entitled: true,
              },
              migrations: {
                is_entitled: false,
              },
              openshift: {
                is_entitled: true,
              },
              settings: {
                is_entitled: true,
              },
              smart_management: {
                is_entitled: true,
              },
              subscriptions: {
                is_entitled: true,
              },
            },
          })
        ),
      },
    },
  };
};
