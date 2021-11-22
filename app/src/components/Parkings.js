import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CssBaseline, Container, Typography } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    margin: theme.spacing(2),
  },
  item: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  paper: {
    // display: 'flex',
    width: '15%',
    height: '5%',
    margin: theme.spacing(1),
  },
}));

const Parkings = ({ drizzle, drizzleState }) => {
  const classes = styles();
  const [parkingsList, setParkinksList] = useState([]);

  useEffect(() => {
    (async () => {
      setParkinksList(await drizzle.contracts.Decentrapark.methods.getParkings().call());
    })();
  }, []);

  const showColor = async (_index) => {
    let not_occupied = await drizzle.contracts.Decentrapark.methods.getAvailability(_index).call();
    if (not_occupied) {
      return '#00FF00';
    } else {
      return '#FF0000';
    }
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <div className={classes.root}>
          <Grid className={classes.item}>
            <Typography align="center" variant="h4">
              {' '}
              Parkings{' '}
            </Typography>
            <Grid container item xs={12}>
              {parkingsList.map((parkingStruct, index) => (
                <Paper
                  // color={showColor(index)}
                  className={classes.paper}
                  onClick={() => {
                    alert(parkingStruct.owner);
                  }}
                >
                  <Grid className={classes.item} item xs={12} align="center">
                    {/* <Typography> {parkingStruct.owner} </Typography> */}
                    {/* <Typography> {parkingStruct.rentPrice} </Typography> */}
                    {/* <Typography> {parkingStruct.rentDuration / 86400} </Typography> */}
                    {/* <Typography> {parkingStruct.parkingPrice} </Typography> */}

                    <Typography> {index} </Typography>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Parkings;
