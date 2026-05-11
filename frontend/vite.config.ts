import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, allowedHosts: ['fountain-improper-backed.ngrok-free.dev'] },
  preview: { port: 3000, allowedHosts: ['fountain-improper-backed.ngrok-free.dev'] },
});
