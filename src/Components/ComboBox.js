import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox(props) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={props.selector}
      sx={{ width: props.width }}
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
}
