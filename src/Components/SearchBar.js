import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { characterNames } from './selectOptions';

export default function SearchBar({ setSearch }) {

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="search-bar"
        freeSolo
        options={characterNames.map((option) => option.name)}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue)
        }}
        renderInput={(params) =>
          <TextField {...params} label="Character Name"
            onInput={(e) => {
              setSearch(e.target.value)
            }}
          />}
      />
    </Stack>
  );
}