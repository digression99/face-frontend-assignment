import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import * as ethers from 'ethers'

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'ERROR' | 'SENDING'

export const walletMnemonicAtom = atomWithStorage('face-wallet/wallet_mnemonic', '')
export const walletAtom = atom<ethers.Wallet | undefined>(undefined)
export const transactionStatusAtom = atom<TransactionStatus>('PENDING')

export const amountAtom = atom<string>('0')

export const txHashAtom = atom<string>('')
