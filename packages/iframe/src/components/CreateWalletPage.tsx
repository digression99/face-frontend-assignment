import { useState, useEffect } from 'react'
import * as ethers from 'ethers'
import { PageLayout } from './PageLayout'
import { createRandomWallet } from '../lib/ethers'
import { useAtom } from 'jotai'
import { walletMnemonicAtom } from '../state/wallet'
import { FaceWalletIcon } from './icons/FaceWalletIcon'
import { Color } from '../style'

import {
    Box,
    Text,
    Center
} from '@chakra-ui/react'
import { PrimaryButton } from './PrimaryButton'

type Props = {
    onClosePage: (payload: any) => void
}

export function CreateWalletPage({ onClosePage }: Props) {
    const [walletMnemonic, setWalletMnemonic] = useAtom(walletMnemonicAtom)
    const [wallet, setWallet] = useState<ethers.Wallet | undefined>(undefined)

    const onClose = () => {
        onClosePage({ address: wallet?.address })
    }

    useEffect(() => {
        if (wallet) {
            return
        }

        if (walletMnemonic) {
            setWallet(ethers.Wallet.fromMnemonic(walletMnemonic))
            return
        }

        const randomWallet = createRandomWallet()
        setWalletMnemonic(randomWallet.mnemonic.phrase)
        setWallet(randomWallet)
    }, [wallet, walletMnemonic, setWallet, setWalletMnemonic])

    return (
        <PageLayout>
            <Box
                textAlign='center'
                fontSize='18px'
                fontWeight='600'
                lineHeight='22px'
                color={Color.gray800}>
                Success!
            </Box>
            <Box
                textAlign='center'
                fontSize='16px'
                fontWeight='600'
                lineHeight='24px'
                color={Color.gray700}
                mt='25px'>
                Your wallet is now ready
            </Box>

            <Center
                borderRadius='4px'
                backgroundColor={Color.lightgray_main}
                p='16'
                mt='12px'
            >
                <Text
                    fontWeight='500'
                    fontSize='14px'
                    overflowWrap='anywhere'
                    color={Color.darkgray_sub}>
                    {wallet?.address}
                </Text>
            </Center>

            <PrimaryButton onClick={onClose}>Close</PrimaryButton>

            <Center mt='32px'>
                <Text
                    color={Color.gray100}
                    fontSize='12px'
                    fontWeight='500'
                    mr='8px'>
                    Powered by
                </Text>
                <FaceWalletIcon />
            </Center>
        </PageLayout>
    )
}
