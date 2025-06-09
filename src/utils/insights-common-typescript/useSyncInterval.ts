import { useEffect } from 'react';

type AsyncFunction = () => Promise<unknown> | unknown;

export const useSyncInterval = (
  ms: number,
  callback: AsyncFunction,
  callImmediately = false
) => {
  useEffect(() => {
    let handler;
    let destructorCalled = false;
    const repeatLoop = async () => {
      await callback();

      if (!destructorCalled) {
        handler = setTimeout(repeatLoop, ms);
      }
    };

    if (callImmediately) {
      repeatLoop();
    } else {
      handler = setTimeout(repeatLoop, ms);
    }

    return () => {
      destructorCalled = true;
      clearTimeout(handler);
    };
  }, [ms, callback, callImmediately]);
};
