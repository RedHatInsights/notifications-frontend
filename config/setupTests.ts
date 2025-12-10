import 'jest';
import { enableMapSet } from 'immer';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

import { mockResizeObserver } from './testutils/ResizeObserverMock';
import { mockInsights } from '../src/utils/insights-common-typescript';

mockInsights();
jest.setTimeout(10000);

mockResizeObserver();
enableMapSet();
