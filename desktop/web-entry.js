import React from 'react';
import { createRoot } from 'react-dom/client';

import App from '../App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Web root element was not found');
}

createRoot(rootElement).render(React.createElement(App));

requestAnimationFrame(() => {
  window.dispatchEvent(new Event('resize'));
});
