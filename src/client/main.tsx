import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@audius/harmony/dist/harmony.css'
import '../../styles/tailwind.css'
import { MusicProvider } from './contexts/MusicContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MusicProvider>
      <App />
    </MusicProvider>
  </React.StrictMode>
)
