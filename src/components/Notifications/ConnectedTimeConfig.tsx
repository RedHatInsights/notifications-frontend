import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { TimeConfigComponent } from './TimeConfig';

export const ConnectedTimeConfig = ({ store }: {store: Store}) => {

    return (
        <Provider store={ store }>
            <TimeConfigComponent />
        </Provider>
    );

};

export default ConnectedTimeConfig;
