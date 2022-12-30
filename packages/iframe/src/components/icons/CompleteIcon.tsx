import { Icon, IconProps } from '@chakra-ui/react'

type Props = IconProps

export function CompleteIcon(props: Props) {
    return (
        <Icon width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.99984 0.666992C4.39984 0.666992 0.666504 4.40033 0.666504 9.00033C0.666504 13.6003 4.39984 17.3337 8.99984 17.3337C13.5998 17.3337 17.3332 13.6003 17.3332 9.00033C17.3332 4.40033 13.5998 0.666992 8.99984 0.666992ZM7.33317 13.167L3.1665 9.00033L4.3415 7.82533L7.33317 10.8087L13.6582 4.48366L14.8332 5.66699L7.33317 13.167Z" fill="#05A67B" />
        </Icon>
    )
}
