import * as ethers from 'ethers'
import { Network } from '@ethersproject/networks'
import { TransactionRequest } from '@ethersproject/abstract-provider'

const MAX_GAS_LIMIT = 21000

const mumbaiTestnet = 'https://rpc-mumbai.maticvigil.com/'

const mumbaiNetwork: Network = {
    name: 'mumbai',
    chainId: 80001,
    _defaultProvider: () => new ethers.providers.JsonRpcProvider(mumbaiTestnet)
}

export const getBalance = async (wallet: ethers.Wallet) => {
    const provider = ethers.getDefaultProvider(mumbaiNetwork)
    const balance = await provider.getBalance(wallet.address)
    return balance
}

export const calculateGasFee = async (): Promise<ethers.BigNumber | undefined> => {
    const provider = new ethers.providers.JsonRpcProvider(mumbaiTestnet)
    const gasLimit = ethers.utils.hexlify(21000)

    let gasPrice: ethers.BigNumberish | null = null

    try {
        const feeData = await provider.getFeeData()
        gasPrice = feeData.maxFeePerGas
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        console.log('Unexpected error :', e)
    }

    return gasPrice?.mul(gasLimit)
}

export const stringToBn = (value: string) => ethers.utils.parseUnits(value)

export const isInsufficientFunds = async (wallet: ethers.Wallet, transactionValue: string) => {
    const provider = new ethers.providers.JsonRpcProvider(mumbaiTestnet)
    const walletSigner = wallet.connect(provider)

    const gasLimit = ethers.utils.hexlify(21000)
    const value = ethers.utils.parseUnits(transactionValue)
    let gasPrice: ethers.BigNumberish | null = null
    const balance = await getBalance(wallet)

    try {
        const feeData = await walletSigner.getFeeData()
        gasPrice = feeData.maxFeePerGas
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        console.log('Unexpected error :', e)
    }

    if (!gasPrice) return true

    const gasFee = gasPrice.mul(gasLimit)
    const calculatedTotalAmount = value.add(gasFee)

    return balance.lt(calculatedTotalAmount)
}

export const createTxObject = async (wallet: ethers.Wallet, toAddress: string, transactionValue: string) => {
    const provider = new ethers.providers.JsonRpcProvider(mumbaiTestnet)
    const walletSigner = wallet.connect(provider)

    const fromAddress = wallet.address
    const gasLimit = ethers.utils.hexlify(MAX_GAS_LIMIT)
    const value = ethers.utils.parseUnits(transactionValue)

    let calculatedNonce: ethers.BigNumberish | null = null
    let gasPrice: ethers.BigNumberish | null = null

    try {
        const feeData = await walletSigner.getFeeData()
        gasPrice = feeData.maxFeePerGas
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        console.log('Unexpected error :', e)
    }

    try {
        calculatedNonce = await walletSigner.getTransactionCount()
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        console.log('Unexpected error :', e)
    }

    const transactionObject: TransactionRequest = {
        from: fromAddress,
        to: toAddress,
        value,
        nonce: calculatedNonce ? calculatedNonce : 0,
        gasLimit,
        gasPrice: gasPrice ? gasPrice : ethers.BigNumber.from(0)
    }

    return transactionObject
}

export const sendTransactionWithTxObject = async (wallet: ethers.Wallet, txObject: TransactionRequest) => {
    const provider = new ethers.providers.JsonRpcProvider(mumbaiTestnet)
    const walletSigner = wallet.connect(provider)
    return walletSigner.sendTransaction(txObject)
}

export const createRandomWallet = () => {
    const randomWallet = ethers.Wallet.createRandom()
    // mnemonic - randomWallet.mnemonic.phrase
    return randomWallet
}

export const formatBnToString = (bn: ethers.BigNumber) =>
    ethers.utils.formatEther(bn)
