// src/components/ui/CustomFormControlLabel.js
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

const CustomFormControlLabel = styled(FormControlLabel)(({ theme, checked }) => ({
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
  '& .MuiFormControlLabel-label': {
    fontWeight: checked ? 500 : 'normal',
  },
  // border: checked ? `1px solid ${theme.palette.primary.main}` : 'none',
  // borderRadius: checked ? theme.shape.borderRadius : 0,
  // padding: checked ? theme.spacing(0.1, 1, 0.1, 0.1) : 0,
  padding: theme.spacing(0, 1),
  color: checked ? theme.palette.primary.main : 'inherit',
}));

export default CustomFormControlLabel;