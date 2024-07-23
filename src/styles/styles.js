// src/styles/styles.js
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  dividerText: {
    color: theme.palette.text.secondary,
  },
  // buttonStyle: {
  //   backgroundColor: theme.palette.primary.main,
  //   color: theme.palette.common.white,
  //   padding: theme.spacing(1, 2),
  //   borderRadius: theme.shape.borderRadius,
  //   '&:hover': {
  //     backgroundColor: theme.palette.primary.dark,
  //   },
  // },
}));

export default useStyles;
