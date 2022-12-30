import { PropsWithChildren } from 'react'
import { Center, Flex } from '@chakra-ui/react'

type Props = PropsWithChildren

export function PageLayout({ children }: Props) {
    return (
        <Center h='100vh'>
            <Flex
                w='360px'
                background='white'
                borderRadius='12px'
                direction='column'
                p={32}
            >
                {children}
            </Flex>
        </Center>
    )
}
