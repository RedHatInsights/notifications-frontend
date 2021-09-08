import { mockInsights } from 'insights-common-typescript-dev';
import React from 'react';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

declare const window: any;
declare const insights: any;
window.React = React;
mockInsights();
insights.chrome.on = jest.fn(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
});

mockResizeObserver();
