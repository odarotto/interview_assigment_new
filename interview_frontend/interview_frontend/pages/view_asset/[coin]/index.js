import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Button from "@mui/material/Button";
import DateRangeIcon from '@mui/icons-material/DateRange';
import axios from "axios";

const initialState = {
  coin: "",
  amt: "",
  equity: "",
  price: "",
  balance_time: new Date().toISOString().replace(/[TZ]/gm, " "),
  kind: "asset",
};


const Anything = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [days, setDays] = useState(15);

  useEffect(() => {
    if (days == 0) {
      axios
        .get(`http://localhost:8080/search?q=${router.query.coin}`)
        .then((response) => setState(response.data.map(record => ({...record, balance_time: new Date(record.balance_time).toLocaleString().split(',')[0]}))));
    } else {
      axios
        .get(`http://localhost:8080/search?q=${router.query.coin}&days=${days}`)
        .then((response) => {
          console.log(response.data)
          setState(response.data.map(record => ({...record, balance_time: new Date(record.balance_time).toLocaleString().split(',')[0]})))
        });
    }
  }, [router.query.coin, days]);

  // const handleClick = (days) => {
    
  // }

  return (
    <Container>
      <Typography variant="h1" component="div" gutterBottom>
        {router.query.coin}
      </Typography>
      <div>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          endIcon={<DateRangeIcon />}
          onClick={() => setDays(7)}
        >
          7d
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          endIcon={<DateRangeIcon />}
          onClick={() => setDays(15)}
        >
          15d
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          endIcon={<DateRangeIcon />}
          onClick={() => setDays(30)}
        >
          30d
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          endIcon={<DateRangeIcon />}
          onClick={() => setDays(0)}
        >
          Max
        </Button>
      </div>
      <LineChart
        width={800}
        height={300}
        data={state}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="balance_time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </Container>
  );
};
export default Anything;
