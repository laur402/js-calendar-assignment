import React from 'react';
import ReactDOM from 'react-dom/client';
import { Body } from './React/Body';
export function App() {
  return <Body />;
}

window.onload = () => {
  const root = document.getElementById('root');
  if (root === null) return;
  ReactDOM.createRoot(root).render(<App />);
};
