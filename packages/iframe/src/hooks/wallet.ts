import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import * as ethers from 'ethers'
import {
    createTxObject,
    sendTransactionWithTxObject,
    calculateGasFee,
    formatBnToString,
    isInsufficientFunds,
    getBalance,
    stringToBn,
} from '../lib/ethers'
import { walletMnemonicAtom, txHashAtom, transactionStatusAtom } from '../state/wallet'

export function useGasFee() {
    const [gasFee, setGasFee] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (gasFee) return

        (async () => {
            setIsLoading(true)
            const estimatedGasFee = await calculateGasFee()
            if (estimatedGasFee) {
                setGasFee(formatBnToString(estimatedGasFee))
            }
            setIsLoading(false)
        })()
    }, [gasFee])

    return { gasFee, isLoading }
}

export function useBalance(wallet: ethers.Wallet | undefined) {
    const [balance, setBalance] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!wallet || balance) return

        (async () => {
            setIsLoading(true)
            const balance = await getBalance(wallet)
            setBalance(formatBnToString(balance))
            setIsLoading(false)
        })()
    }, [balance, wallet])

    return { balance, isLoading }
}

export function useIsInsufficient(wallet: ethers.Wallet | undefined, amount: string) {
    const [isInsufficient, setIsInsufficient] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!wallet) return
        (async () => {
            setIsLoading(true)
            setIsInsufficient(await isInsufficientFunds(wallet, amount))
            setIsLoading(false)
        })()
    }, [amount, wallet])

    return { isInsufficient, isLoading }
}

export function useSendTransaction(wallet: ethers.Wallet | undefined, toAddress: string, amount: string) {
    const [transactionStatus, setTransactionStatus] = useAtom(transactionStatusAtom)
    const [txHash, setTxHash] = useAtom(txHashAtom)

    useEffect(() => {
        return () => {
            if (transactionStatus === 'COMPLETE') {
                setTransactionStatus('PENDING')
            }
        }
    }, [transactionStatus, setTransactionStatus])

    const send = useCallback(async () => {
        if (!wallet) return
        setTransactionStatus('SENDING')

        try {
            const txObject = await createTxObject(wallet, toAddress, amount)
            const tx = await sendTransactionWithTxObject(wallet, txObject)

            setTxHash(tx.hash)
            setTransactionStatus('PROCESSING')
            await tx.wait()
            setTransactionStatus('COMPLETE')
        } catch (e) {
            setTransactionStatus('ERROR')
        }
    }, [amount, setTransactionStatus, wallet, setTxHash, toAddress])

    const isPending = transactionStatus === 'PENDING'
    const isSending = transactionStatus === 'SENDING'
    const isProcessing = transactionStatus === 'PROCESSING'
    const isComplete = transactionStatus === 'COMPLETE'
    const isRequesting = isPending || isSending
    const isSent = isProcessing || isComplete

    return {
        send,
        txHash,
        isSending,
        isSent,
        isProcessing,
        isComplete,
        isRequesting,
    }
}

export function useWallet() {
    const [wallet, setWallet] = useState<ethers.Wallet | undefined>(undefined)
    const [walletMnemonic] = useAtom(walletMnemonicAtom)

    useEffect(() => {
        if (wallet) return
        if (walletMnemonic) {
            setWallet(ethers.Wallet.fromMnemonic(walletMnemonic))
        }
    }, [wallet, walletMnemonic, setWallet])

    const isWalletExists = !!walletMnemonic

    return { wallet, isWalletExists }
}

export function useTotalAmount(amount: string, gasFee: string) {
    const [totalAmount, setTotalAmount] = useState('')

    useEffect(() => {
        if (!gasFee || !amount) return
        const bnValue = stringToBn(amount)
        const gasFeeBn = stringToBn(gasFee)
        const totalAmount = bnValue.add(gasFeeBn)
        setTotalAmount(formatBnToString(totalAmount))
    }, [gasFee, amount])

    return totalAmount
}

