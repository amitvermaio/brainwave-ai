import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js';
import { registerSW } from 'virtual:pwa-register';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

registerSW()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Toaster position='top-right' />
  </Provider>,
)
