import React from 'react';
import { createRoot } from 'react-dom/client';

import Migration from './Migration';

// Entry of the vite build and of the dev server (`npm start`).
// In ioBroker the components are not started from here: the admin loads `customComponents.js` (see
// `exposes` in vite.config.ts) and passes its own socket. Without the admin there is no socket, so this page
// only shows the layout of the migration page.
createRoot(document.getElementById('root')!).render(<Migration />);
