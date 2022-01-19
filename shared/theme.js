import { extendTheme } from "@chakra-ui/react"

const themeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: true,
}
const theme = extendTheme({ themeConfig });

export default theme;