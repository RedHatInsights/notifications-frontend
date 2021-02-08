import React from 'react';
import ReactDOM from 'react-dom';
import { logger } from 'redux-logger';

import { AppEntry } from './AppEntry';

const root = document.getElementById('root');
if (!root) {
    throw new Error('`#root` element is not defined');
}

ReactDOM.render(<AppEntry logger={ logger } />, root, () => root.setAttribute('data-ouia-safe', 'true'));
