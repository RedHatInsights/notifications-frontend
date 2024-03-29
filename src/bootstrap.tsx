import React from 'react';
import { createRoot } from 'react-dom/client';

import AppEntry from './AppEntry';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AppEntry />);
