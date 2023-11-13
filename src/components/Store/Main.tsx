// Wrapper for the Main component to manually inject the store
// This is just a workaround, as the component is not (apparently) loading the store properly

import { Main as M } from '@redhat-cloud-services/frontend-components/Main';
import { InternalMainProps } from '@redhat-cloud-services/frontend-components/Main/Main';
import * as React from 'react';
import { useStore } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyMain = M as any;

export const Main: React.FunctionComponent<InternalMainProps> = (props) => {
  const store = useStore();
  return <AnyMain store={store} {...props} />;
};
