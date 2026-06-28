import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reactflow/dist/style.css';
import './index.css';
import './examples/exampleFlows.css';
import './reactFlowTheme.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
