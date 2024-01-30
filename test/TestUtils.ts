import { act as actReact } from '@testing-library/react';

export const waitForAsyncEvents = async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await actReact(async () => {});
};
