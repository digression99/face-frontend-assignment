import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'

const theme = {
    styles: {
        global: {
            'html, body, #root': {
                minHeight: '100vh',
            },
            '#root': {
                background: 'rgba(0, 0, 0, 0.3)',
            }
        }
    }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
)
