import React from 'react';
import ReactDOM from 'react-dom';

import { AppEntry } from './AppEntry';

const root = document.getElementById('root');
if (!root) {
    throw new Error('`#root` element is not defined');
}

ReactDOM.render(<AppEntry />, root, () => root.setAttribute('data-ouia-safe', 'true'));
