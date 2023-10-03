import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={selector}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="+ Variants" />}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const selector = [
  { label: 'Show Both Variants'},
  {label: 'Show Only +'},
  {label: 'Show Only Regular'}
];
