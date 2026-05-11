import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: {
    global: (props: any) => ({
      body: {
        bg:    props.colorMode === "dark" ? "#0a0e17" : "gray.50",
        color: props.colorMode === "dark" ? "white"   : "gray.900",
      },
    }),
  },
  fonts: {
    heading: `'Inter', -apple-system, sans-serif`,
    body:    `'Inter', -apple-system, sans-serif`,
  },
  components: {
    Text: {
      baseStyle: (props: any) => ({
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
      }),
    },
    Button: {
      baseStyle: { fontWeight: "600", borderRadius: "lg" },
    },
    Input: {
      variants: {
        outline: (props: any) => ({
          field: {
            borderColor: props.colorMode === "dark" ? "#334155" : "gray.300",
            _focus: { borderColor: "#3b82f6", boxShadow: "0 0 0 1px #3b82f6" },
          },
        }),
      },
    },
  },
});

export default theme;
