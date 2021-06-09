import { mockInsights } from 'insights-common-typescript-dev';
import React from 'react';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

declare const window: any;
window.React = React;
mockInsights();
mockResizeObserver();
