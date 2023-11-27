import { enableMapSet } from 'immer';
import { mockInsights } from 'insights-common-typescript-dev';
import React from 'react';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const insights: any;
window.React = React;
mockInsights();
insights.chrome.on = jest.fn(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
});

jest.setTimeout(10000);

mockResizeObserver();
enableMapSet();
