import { act as actReact } from '@testing-library/react';
import { act as actHooks } from '@testing-library/react-hooks';

export const waitForAsyncEvents = async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await actReact(async () => {});
};

export const waitForAsyncEventsHooks = async () => {
  await actHooks(async () => {});
};
