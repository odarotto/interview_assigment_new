import React, { useState } from "react";
import axios from 'axios'
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const initialState = {
  coin: '',
  amt: '',
  equity: '',
  price: '',
  balance_time: new Date().toISOString().replace(/[TZ]/gm, ' '),
  kind: 'asset'
}

const Anything = () => {
  const [state, setState] = useState(initialState)

  const handleCreate = () => {
    axios.post(`http://localhost:8080/add_${state.kind}?coin=${state.coin}&amt=${state.amt}&equity=${state.equity}&price=${state.price}&balance_time=${state.balance_time}`)
      .then(() => setState(initialState))
  }

  const handleChange = (event) => {
    console.log(event)
    const currentState = {...state}
    currentState[event.target.name] = event.target.value
    setState(currentState)
  }

  return (
    <Container sx={{ m: 3 }}>
      <TextField
        sx={{ marginBottom: 2 }}
        required
        id="coin"
        name="coin"
        label="Coin"
        variant="filled"
        onChange={handleChange}
        value={state.coin}
        fullWidth
      />
      <TextField
        sx={{ marginBottom: 2 }}
        required
        id="amt"
        name="amt"
        label="Amount"
        variant="filled"
        onChange={handleChange}
        value={state.amt}
        fullWidth
      />
      <TextField
        sx={{ marginBottom: 2 }}
        required
        id="equity"
        name="equity"
        label="Equity"
        variant="filled"
        onChange={handleChange}
        value={state.equity}
        fullWidth
      />
      <TextField
        sx={{ marginBottom: 2 }}
        required
        id="price"
        name="price"
        label="Price"
        variant="filled"
        onChange={handleChange}
        value={state.price}
        fullWidth
      />
      <TextField
        sx={{ marginBottom: 2 }}
        required
        id="balance_time"
        name="balance_time"
        label="Balance Time"
        disabled
        variant="filled"
        onChange={handleChange}
        value={state.balance_time}
        fullWidth
      />
      <FormControl
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <InputLabel id="record_kind">Kind</InputLabel>
        <Select
          labelId="record_kind"
          id="kind"
          name="kind"
          value={state.kind}
          label="Kind"
          onChange={handleChange}
        >
          <MenuItem value={'asset'}>Asset</MenuItem>
          <MenuItem value={'liability'}>Liability</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        onClick={handleCreate}
      >
        Add
      </Button>
    </Container>
  );
};
export default Anything;
