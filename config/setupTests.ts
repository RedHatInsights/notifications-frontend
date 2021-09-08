import { getInsights } from '@redhat-cloud-services/insights-common-typescript';
import { mockInsights } from 'insights-common-typescript-dev';
import React from 'react';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

declare const window: any;
window.React = React;
mockInsights();
// eslint-disable-next-line @typescript-eslint/no-empty-function
getInsights().chrome.on = jest.fn(() => () => {});
mockResizeObserver();
