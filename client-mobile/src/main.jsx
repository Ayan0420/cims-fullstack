import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@picocss/pico/css/pico.red.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(

    <App />,
)

