import { Provider } from 'react-redux';
import { TimeConfigComponent } from './TimeConfig';
import React, { useEffect, useMemo, useState } from 'react';
import { AppEntryProps } from '../../AppEntry';
import { getNotificationsRegistry } from '../../store/Store';



export const ConnectedTimeConfig: React.FunctionComponent<AppEntryProps> = (props) => {

  const store = React.useMemo(() => {
    const registry = props.logger ? getNotificationsRegistry(props.logger) : getNotificationsRegistry();
    return registry.getStore();
  }, [ props.logger ]);

  return (
    <Provider store={ store }>
      <TimeConfigComponent/>
    </Provider> 
  )
  
}