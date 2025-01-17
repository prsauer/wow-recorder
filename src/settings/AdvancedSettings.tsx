import * as React from 'react';
import { openDirectorySelectorDialog } from './settingUtils';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { configSchema } from '../main/configSchema'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FakeChangeEvent, ISettingsPanelProps } from 'main/types';

const ipc = window.electron.ipcRenderer;
const obsAvailableEncoders: string[] = ipc.sendSync('settingsWindow', ['getObsAvailableRecEncoders']);

export default function GeneralSettings(props: ISettingsPanelProps) {
  const { config } = props;

  /**
   * Event handler when user selects an option in dialog window.
   */
   React.useEffect(() => {
    ipc.on('settingsWindow', (args: any) => {
      if (args[0] === "pathSelected") {
        props.onChange(new FakeChangeEvent(args[1], args[2]));
      }
    });
  }, []);

  const style = {
    width: '405px',
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#bb4220'
    },
    '&.Mui-focused': {
      borderColor: '#bb4220',
      color: '#bb4220'
    },
    "& .MuiInputLabel-root": {
      color: 'white'
    },
    '& .MuiFormHelperText-root:not(.Mui-error)': {
      display: 'none'
    },
  }

  return (
    <Stack
      component="form"
      sx={{
        '& > :not(style)': { m: 0, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Box component="span" sx={{ display: 'flex', alignItems: 'center'}}>
        <TextField
          name="bufferStoragePath"
          value={config.bufferStoragePath}
          id="buffer-path" 
          label="Buffer Path" 
          variant="outlined" 
          onClick={() => openDirectorySelectorDialog('bufferStoragePath')} 
          InputLabelProps={{ shrink: true }}
          sx={{...style, my: 1}}
          inputProps={{ style: { color: "white" } }}
        />
        <Tooltip title={configSchema["bufferStoragePath"].description} >
          <IconButton>
            <InfoIcon style={{ color: 'white' }}/>
          </IconButton>
        </Tooltip>
      </Box>

      <Box component="span" sx={{ display: 'flex', alignItems: 'center'}}>
        <TextField 
          name="minEncounterDuration"
          value={config.minEncounterDuration}
          onChange={props.onChange}
          id="max-storage" 
          label="Min Encounter Duration (sec)" 
          variant="outlined" 
          type="number" 
          error= { config.minEncounterDuration < 1 }
          helperText={(config.minEncounterDuration < 1) ? "Must be positive" : ' '}
          InputLabelProps={{ shrink: true }}
          sx={{...style, my: 1}}
          inputProps={{ style: { color: "white" } }}
        />
        <Tooltip title={configSchema["minEncounterDuration"].description}>
          <IconButton>
            <InfoIcon style={{ color: 'white' }}/>
          </IconButton>
        </Tooltip>
      </Box>

      <Box component="span" sx={{ display: 'flex', alignItems: 'center'}}>
        <FormControl sx={{my: 1}}>
          <InputLabel id="obs-rec-encoder-label" sx = {style}>Video recording encoder</InputLabel>
          <Select
            name="obsRecEncoder"
            labelId="obs-rec-encoder-label"
            id="obs-rec-encoder"
            value={config.obsRecEncoder}
            label="Video recording encoder"
            onChange={props.onChange}
            sx={style}
          >
            { obsAvailableEncoders.map((recEncoder: any) =>
              <MenuItem key={ 'rec-encoder-' + recEncoder.id } value={ recEncoder.id }>
                { recEncoder.name }
              </MenuItem>
            )}
          </Select>

        </FormControl>
        <Tooltip title={configSchema["obsRecEncoder"].description} >
          <IconButton>
            <InfoIcon style={{ color: 'white' }}/>
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
}