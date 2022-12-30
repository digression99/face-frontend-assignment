import {
    Divider,
    List,
    ListItem,
    Text,
    Flex,
} from '@chakra-ui/react'
import { Color } from '../../style'
import { PrimarySpinner } from '../PrimarySpinner'
import { shortenAddress } from '../../lib/wallet'
import { CompleteIcon } from '../icons/CompleteIcon'

type Props = {
    toAddress: string
    amount: string
    gasFee: string
    totalAmount: string

    isSent: boolean
    isProcessing: boolean
    isComplete: boolean
}

export function TransactionInfo({
    toAddress,
    amount,
    gasFee,
    totalAmount,
    isSent,
    isProcessing,
    isComplete
}: Props) {
    return (
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
                    <Text fontWeight='500' fontSize='14px' color={Color.darkgray_sub}>
                        {shortenAddress(toAddress)}
                    </Text>
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
    )
}
