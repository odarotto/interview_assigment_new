// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Container } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState("");

  const fetchAll = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/assets")
      .then((data) => {
        console.log(data);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
    setPage(1);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (event) => {
    setValues(event.target.value);
    // if (event.target.value.length > 0)
    handleSearch(event.target.value);
  };

  const handleSearch = (searchParam) => {
    console.log(searchParam, searchParam.length);
    setLoading(true);
    if (searchParam.length === 0) {
      fetchAll();
      return;
    }
    axios
      .get(`http://localhost:8080/search?q=${searchParam}`)
      //   .then((res) => res)
      .then((data) => {
        console.log(data);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
    setPage(1);
    setLoading(false);
  };

  const handleDelete = (record) => {
    // console.log(record.id)
    axios.delete(
      `http://localhost:8080/delete?kind=${record.kind}&id=${record.id}`
    );
  };

  const handlePagination = (event, page) => {
    // console.log(event)
    setPage(page);
  };

  // Pagination
  const [page, setPage] = useState(1);
  const offset = 0 + (page - 1) * 10;
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Returns
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  return (
    <Container>
      <FormControl sx={{ m: 1 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-search">
          Search assets or liability
        </InputLabel>
        <FilledInput
          id="outlined-adornment-password"
          fullWidth
          // type={values.showPassword ? 'text' : 'password'}
          type="text"
          value={values}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Click to search"
                onClick={() => handleSearch(values)}
                // onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Search"
        />
      </FormControl>
      <Link href="/add_record">
        <Button sx={{ m: 2 }} variant="contained" endIcon={<AddIcon />}>
          Add
        </Button>
      </Link>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Results
        </Typography>
        <Demo>
          <List dense={true}>
            {data.slice(offset, offset + 10).map((record) => (
              <ListItem
                key={record.id}
                secondaryAction={
                  <>
                    <Link href={`/update_record/${record.kind}/${record.id}`}>
                      <Button
                        sx={{ m: 2 }}
                        variant="contained"
                        endIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    </Link>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(record)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Link href={`/view_asset/${record.coin}`}>
                    <Button>
                      <Avatar
                        sx={{
                          backgroundColor:
                            record.kind === "asset" ? "green" : "red",
                        }}
                      >
                        {record.coin[0]}
                      </Avatar>
                    </Button>
                  </Link>
                </ListItemAvatar>
                <ListItemText
                  primary={`${record.coin} . ${record.price} - ${record.balance_time} - ${record.kind}`}
                />
              </ListItem>
            ))}
          </List>
        </Demo>
      </Grid>
      <Pagination
        count={Math.trunc(data.length / 10)}
        onChange={handlePagination}
      />
    </Container>
  );
}
