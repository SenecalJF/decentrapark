import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { CssBaseline, Container, Typography } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
}));

const Parkings = ({ drizzle, drizzleState }) => {
  const classes = styles();
  const [parkingsList, setParkinksList] = useState([]);

  const addParking = async () => {
    await drizzle.contracts.Decentrapark.methods.addParkingSpot(drizzleState.accounts[0], 15, 500, 1);
    await drizzle.contracts.Decentrapark.methods.addParkingSpot(drizzleState.accounts[0], 15, 600, 1);
    setParkinksList(await drizzle.contracts.Decentrapark.methods.getParkings());

    // console.log('hello');
    // console.log(parkingsList);
  };
  // addParking();

  //   useEffect(() => {});

  return (
    <>
      <CssBaseline />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Typography> </Typography>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Parkings;
