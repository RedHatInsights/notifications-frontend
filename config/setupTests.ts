import 'jest';
import { enableMapSet } from 'immer';
import { mockInsights } from 'insights-common-typescript-dev';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

import { mockResizeObserver } from './testutils/ResizeObserverMock';

mockInsights();
jest.setTimeout(10000);

mockResizeObserver();
enableMapSet();
