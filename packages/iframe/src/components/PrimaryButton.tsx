import { Button, ButtonProps } from '@chakra-ui/react'
import { PrimarySpinner } from './PrimarySpinner'
import { Color } from '../style'

type Props = ButtonProps

export function PrimaryButton({ disabled, children, ...rest }: Props) {
    const textColor = disabled ? Color.bluegray_sub : Color.white
    const backgroundColor = disabled ? Color.gray200 : Color.primary

    return (
        <Button
            mt='24px'
            fontSize='16px'
            fontWeight='600'
            height='52px'
            borderRadius={'8px'}
            backgroundColor={backgroundColor}
            color={textColor}
            width='100%'
            spinner={<PrimarySpinner />}
            disabled={disabled}
            {...rest}>
            {children}
        </Button>
    )

}
