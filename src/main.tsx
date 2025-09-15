import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    const event = new CustomEvent('navigate-previous');
    window.dispatchEvent(event);
  } else if (e.key === 'ArrowRight') {
    const event = new CustomEvent('navigate-next');
    window.dispatchEvent(event);
  } else if (e.key && e.key.toLowerCase() === 'p') {
    const event = new CustomEvent('toggle-provenance');
    window.dispatchEvent(event);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);