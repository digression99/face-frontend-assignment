
export const shortenAddress = (address: string) => {
    const l = address.length
    return `${address.substring(0, 6)}...${address.substring(l - 6)}`
}
