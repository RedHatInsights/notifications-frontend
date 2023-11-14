// Copied from resize-observer-polyfill
interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}
interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}
interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

const observers: Array<ResizeObserverMock> = [];

class ResizeObserverMock implements ResizeObserver {
  readonly callback: ResizeObserverCallback;
  targets: Array<Element>;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    this.targets = [];
    observers.push(this);
  }

  mockEvent = (contentRect?: Partial<DOMRectReadOnly>, target?: Element) => {
    if (!target) {
      if (this.targets.length > 0) {
        target = this.targets[this.targets.length - 1];
      } else {
        throw new Error('Nothing observed to mock an event');
      }
    } else {
      if (this.targets.indexOf(target) === -1) {
        throw new Error('Target not yet observed');
      }
    }

    this.callback(
      [
        {
          target,
          contentRect: {
            width: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => 'Mocked contentRect',
            ...contentRect,
          },
        },
      ],
      this
    );
  };

  observe = jest.fn((target: Element) => {
    this.targets.push(target);
  });

  unobserve = jest.fn((target: Element) => {
    this.targets.splice(this.targets.indexOf(target, 1));
  });

  disconnect = jest.fn(() => {
    observers.splice(observers.indexOf(this), 1);
  });
}

interface ResizeObserverMockWindow extends Window {
  ResizeObserver: typeof ResizeObserverMock;
}

declare const window: ResizeObserverMockWindow;

export const mockResizeObserver = () => {
  window.ResizeObserver = ResizeObserverMock;
};

export const getObservers = () =>
  observers as ReadonlyArray<ResizeObserverMock>;
export const getLastObserver = (): ResizeObserverMock => {
  if (observers.length > 0) {
    return observers[observers.length - 1];
  }

  throw new Error('No observer has registered yet');
};
