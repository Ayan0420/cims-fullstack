// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'CIMS',
        short_name: 'CIMS',
        description: 'Comtech Information Management System',
        theme_color: '#0d6efd',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: 'jci.local',
    https: {
      key: './certs/jci.local-key.pem',
      cert: './certs/jci.local.pem'
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'jci.local',
      'comtech-srv.local',
      '00e410a6f482.ngrok-free.app'
    ]
  }
});
