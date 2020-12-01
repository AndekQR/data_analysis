import {createMuiTheme} from '@material-ui/core/styles';


const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        secondary: {
            main: '#219ebc'
        },
        primary: {
            main: '#ffb703'
        },
    }
});

export default theme
