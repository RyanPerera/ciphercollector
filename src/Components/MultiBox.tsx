import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultiBox(props) {

    const handleOnChange = (event, value) => {
        const newData = value.map(option => option.label).join(', ');
        switch (props.label) {
            case "Colour":
                props.setColour(newData);
                break;
            case "Set":
                props.setSet(newData);
                break;
            case "Rarity":
                props.setRarity(newData);
                break;

            default:
                break;

        }
    };

    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={props.selector}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.label}
                </li>
            )
            }
            style={{ width: props.width }}
            renderInput={(params) => (
                <TextField {...params} label={props.label} />
            )}
            onChange={handleOnChange}
        />
    );
}
