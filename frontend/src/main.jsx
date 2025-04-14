import { Provider } from "@/components/ui/provider"
import { ColorModeProvider } from "@/components/ui/color-mode"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <ColorModeProvider>
          <App/>
        </ColorModeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
