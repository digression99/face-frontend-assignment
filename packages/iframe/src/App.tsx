import { useEffect, useState } from 'react'
import { amountAtom } from './state/wallet'
import { useAtom } from 'jotai'

import { CreateWalletPage } from './components/CreateWalletPage'
import { SendTransactionPage } from './components/SendTransactionPage'

function App() {
    const [messageId, setMessageId] = useState('')
    const [messageType, setMessageType] = useState('')
    const [, setAmount] = useAtom(amountAtom)

    const onClosePage = (payload: any) => {
        setMessageType('')
        window.top?.postMessage({
            id: messageId, result: payload
        }, '*')
    }

    useEffect(() => {
        const listener = (payload: any) => {
            const { data } = payload

            if (data.id) {
                setMessageId(data.id)
            }

            if (!data.messageType) return
            setMessageType(data.messageType)

            if (data.messageType === 'send-transaction') {
                const { amount } = data
                setAmount(amount)
            }
        }

        window.addEventListener('message', listener)
        return () => window.removeEventListener('message', listener)
    }, [setAmount])

    if (messageType === 'create-wallet') {
        return <CreateWalletPage onClosePage={onClosePage} />
    }

    if (messageType === 'send-transaction') {
        return <SendTransactionPage onClosePage={onClosePage} />
    }

    return null
}

export default App;
