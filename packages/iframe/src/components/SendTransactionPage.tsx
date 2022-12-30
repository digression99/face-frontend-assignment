import {
    Divider,
    List,
    ListItem,
    Center,
    Link,
    Box,
    Text,
    IconButton,
    Flex,
    Tooltip,
} from '@chakra-ui/react'
import { PageLayout } from './PageLayout'
import { useAtom } from 'jotai'
import { amountAtom } from '../state/wallet'
import {
    useBalance,
    useGasFee,
    useIsInsufficient,
    useWallet,
    useSendTransaction,
    useTotalAmount,
} from '../hooks/wallet'
import { OpenseaIcon } from './icons/OpenseaIcon'
import { FaceWalletIcon } from './icons/FaceWalletIcon'
import { CompleteIcon } from './icons/CompleteIcon'

import { CloseIcon } from './icons/CloseIcon'
import { Color } from '../style'
import { shortenAddress } from '../lib/wallet'
import { PrimaryButton } from './PrimaryButton'
import { ExternalLinkIcon } from './icons/ExternalLinkIcon'
import { PrimarySpinner } from './PrimarySpinner'

const MUMBAI_SCAN_TX_URL = 'https://mumbai.polygonscan.com/tx/'

const testDestAddress = '0xc26880a0af2ea0c7e8130e6ec47af756465452e8'

type Props = {
    onClosePage: (payload: any) => void
}

export function SendTransactionPage({ onClosePage }: Props) {
    const [amount] = useAtom(amountAtom)
    const { wallet, isWalletExists } = useWallet()

    const { send, txHash, isRequesting, isSending, isSent, isProcessing, isComplete } = useSendTransaction(wallet, testDestAddress, amount)

    const { balance, isLoading: isBalanceLoading } = useBalance(wallet)
    const { isInsufficient, isLoading: isInsufficientLoading } = useIsInsufficient(wallet, amount)
    const { gasFee, isLoading: isGasFeeLoading } = useGasFee()
    const totalAmount = useTotalAmount(amount, gasFee)

    const onClose = () => {
        onClosePage({ txHash })
    }

    const explorerUrl = `${MUMBAI_SCAN_TX_URL}${txHash}`
    const isPageLoading = isInsufficientLoading || isBalanceLoading || isGasFeeLoading

    if (!isWalletExists) {
        return (
            <PageLayout>
                <Flex alignItems='flex-start' justifyContent='space-between'>
                    <OpenseaIcon />
                    <IconButton
                        aria-label='close'
                        icon={<CloseIcon />}
                        onClick={onClose}
                    />
                </Flex>
                No wallet exists. Please create a wallet.
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <Flex alignItems='flex-start' justifyContent='space-between'>
                <OpenseaIcon />
                <IconButton
                    aria-label='close'
                    icon={<CloseIcon />}
                    onClick={onClose}
                    disabled={isPageLoading}
                />
            </Flex>

            {isRequesting && (
                <Box
                    mt='16px'
                    color={Color.bluegray_dark}
                    fontSize='24px'
                    fontWeight='700'
                >
                    Send
                    <br />
                    <Text color={isInsufficient ? Color.red_dark : Color.bluegray_dark}>
                        {amount}{' '}
                        <Text as='span' color={Color.darkgray_light}>
                            ETH
                        </Text>
                    </Text>
                </Box>
            )}

            {isProcessing && (
                <Box>
                    <Text
                        fontWeight='700'
                        fontSize='24px'
                        lineHeight='36px'
                        color={Color.bluegray_dark}>
                        Processing...
                    </Text>
                    <Text
                        fontWeight='400'
                        fontSize='14px'
                        lineHeight='22px'
                        color={Color.bluegray_main}>
                        It should be confirmed on the blockchain shortly.
                    </Text>
                </Box>
            )}

            {isComplete && (
                <Box>
                    <Text
                        fontWeight='700'
                        fontSize='24px'
                        lineHeight='36px'
                        color={Color.bluegray_dark}>
                        Complete!
                    </Text>
                    <Text
                        fontWeight='400'
                        fontSize='14px'
                        lineHeight='22px'
                        color={Color.bluegray_main}>
                        It's been confirmed on the blockchain.
                    </Text>
                </Box>
            )}

            <Flex
                borderRadius='4px'
                border={`1px solid ${Color.mediumgray_sub}`}
                p='16px'
                justifyContent='space-between'
                mt='24px'>
                <Text
                    fontWeight='400'
                    fontSize='14px'
                    lineHeight='22px'
                    color={Color.darkgray_sub}>
                    Available
                </Text>
                <Text
                    fontWeight='500'
                    fontSize='14px'
                    lineHeight='22px'
                    color={Color.darkgray_sub}>
                    {balance} ETH
                </Text>
            </Flex>

            <List
                spacing={16}
                mt='16px'
                backgroundColor={Color.lightgray_main}
                borderRadius='4px'
                p='16px'>
                {isSent && (
                    <ListItem>
                        <Flex justifyContent='space-between'>
                            <Text fontWeight='400' fontSize='14px' color={Color.darkgray_sub}>
                                Status
                            </Text>
                            <Flex
                                fontWeight='500'
                                fontSize='14px'
                                color={Color.darkgray_sub}
                                alignItems='center'>
                                {isProcessing && (
                                    <>
                                        <PrimarySpinner />
                                        Processing
                                    </>

                                )}

                                {isComplete && (
                                    <>
                                        <CompleteIcon mr={'6px'} />
                                        Complete
                                    </>
                                )}
                            </Flex>
                        </Flex>
                    </ListItem>
                )}

                {isSent && (<Divider borderBottomColor={Color.mediumgray_sub} />)}

                <ListItem>
                    <Flex justifyContent='space-between'>
                        <Text fontWeight='400' fontSize='14px' color={Color.darkgray_sub}>
                            To
                        </Text>
                        <Tooltip
                            fontSize='12px'
                            fontWeight='500'
                            lineHeight='22px'
                            label={testDestAddress}
                            color={Color.darkgray_sub}
                            backgroundColor={Color.mediumgray_sub}
                            borderRadius='4px'
                            py={2}
                            px={4}
                        >
                            <Text fontWeight='500' fontSize='14px' color={Color.darkgray_sub}>
                                {shortenAddress(testDestAddress)}
                            </Text>
                        </Tooltip>
                    </Flex>
                </ListItem>

                <ListItem>
                    <Flex justifyContent='space-between'>
                        <Text fontWeight='400' fontSize='14px' color={Color.darkgray_sub}>
                            Amount
                        </Text>
                        <Text fontWeight='500' fontSize='14px' color={Color.darkgray_sub}>
                            {amount} ETH
                        </Text>
                    </Flex>
                </ListItem>

                <ListItem>
                    <Flex justifyContent='space-between'>
                        <Text fontWeight='400' fontSize='14px' color={Color.darkgray_sub}>
                            Fee
                        </Text>
                        <Text fontWeight='500' fontSize='14px' color={Color.darkgray_sub}>
                            {gasFee} ETH
                        </Text>
                    </Flex>
                </ListItem>

                {isSent && (
                    <ListItem>
                        <Flex justifyContent='space-between'>
                            <Text fontWeight='400' fontSize='14px' color={Color.darkgray_sub}>
                                Total
                            </Text>
                            <Text
                                as='span'
                                fontWeight='500'
                                fontSize='14px'
                                color={Color.darkgray_sub}>
                                <Text as='span' fontWeight='700'>
                                    {totalAmount}{' '}
                                </Text>
                                ETH
                            </Text>
                        </Flex>
                    </ListItem>
                )}
            </List>

            {isInsufficient && (
                <Center
                    fontWeight='400'
                    fontSize='14px'
                    color={Color.red_dark}
                    mt='16px'>
                    Insufficient funds {amount} ETH
                </Center>
            )}


            {!isSent && (
                <PrimaryButton
                    isLoading={isSending}
                    disabled={isInsufficient || isSending || isPageLoading}
                    loadingText={'Confirm'}
                    onClick={send}>
                    Confirm
                </PrimaryButton>
            )}

            {isSent && (
                <Box mt='30px' textAlign='center'>
                    <Link
                        href={explorerUrl}
                        isExternal
                        fontWeight='700'
                        fontSize='12px'
                        lineHeight='20px'
                        color={Color.bluegray_sub}
                    >

                        View on Block Explorer
                        <ExternalLinkIcon ml='6px' />
                    </Link>
                </Box>
            )}

            <Center mt='32px'>
                <Text color={Color.gray100} fontSize='12px' fontWeight='500' mr='8px'>
                    Secured by
                </Text>
                <FaceWalletIcon />
            </Center>
        </PageLayout>
    )
}
