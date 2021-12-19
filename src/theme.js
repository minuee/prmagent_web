import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          fontFamily: "Noto Sans KR",
          backgroundColor: "#ffffff",
        },
        // "*": {
        //   boxSizing: "border-box",
        // },
      },
    },
    MuiListItem: {
      button: {
        "&$selected": {
          backgroundColor: "#7ea1b2",
          color: "#fff",
        },
        "&$selected:hover": {
          backgroundColor: "#7ea1b2",
          color: "#fff",
        },
      },
    },
    MuiButton: {
      label: {
        textTransform: "none",
      },
    },
    MuiToggleButton: {
      root: {
        textTransform: "none",
        "&$selected": {
          backgroundColor: "white",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#000",
      fontFamily: "Noto Sans KR",
    },
    secondary: {
      main: "#7ea1b2",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
