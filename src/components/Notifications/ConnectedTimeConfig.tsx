import React from 'react';
import { Provider } from 'react-redux';

import { AppEntryProps } from '../../AppEntry';
import { getNotificationsRegistry } from '../../store/Store';
import { TimeConfigComponent } from './TimeConfig';

export const ConnectedTimeConfig: React.FunctionComponent<AppEntryProps> = (props) => {

    const store = React.useMemo(() => {
        const registry = props.logger ? getNotificationsRegistry(props.logger) : getNotificationsRegistry();
        return registry.getStore();
    }, [ props.logger ]);

    return (
        <Provider store={ store }>
            <TimeConfigComponent />
        </Provider>
    );

};
