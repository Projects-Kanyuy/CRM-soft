import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './App'; // Change this import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root /> {/* Render the new Root component */}
  </React.StrictMode>
);