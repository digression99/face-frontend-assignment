import { Spinner, SpinnerProps } from '@chakra-ui/react'
import { Color } from '../style'

type Props = SpinnerProps

export function PrimarySpinner(props: Props) {
    return (
        <Spinner
            width='14px'
            height='14px'
            mr='6px'
            color={Color.secondary}
            {...props}
        />
    )
}
