import React from 'react';
import Grid from '@material-ui/core/Grid';
import { CssBaseline, Container, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  item: {
    margin: theme.spacing(3),
  },
  pastLease: {
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const AddParking = ({ drizzle, drizzleState }) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      rentPrice: 0,
      parkingPrice: 0,
      rentDuration: 0,
    },
    onSubmit: async ({ rentPrice, parkingPrice, rentDuration }) => {
      try {
        await drizzle.contracts.Decentrapark.methods.addParkingSpot(
          drizzleState.accounts[0],
          rentPrice,
          parkingPrice,
          rentDuration
        );
      } catch (error) {
        alert('Please enter input correctly');
      }
    },
  });

  return (
    <>
      <CssBaseline />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid className={classes.item} item xs={12}>
                  <Typography variant="h3" align="center" color="black" font-weight="bold" color="black">
                    Add your parking spot
                  </Typography>
                </Grid>
                <Grid container align="center" justify="center" wrap="nowrap" direction="column">
                  <form onSubmit={formik.handleSubmit}>
                    <Grid className={classes.item} item xs={6}>
                      <TextField
                        fullWidth
                        name="rentPrice"
                        id="rentPrice"
                        label="Enter renting price"
                        type="number"
                        min="0.01"
                        value={formik.values.rentPrice}
                        onChange={formik.handleChange}
                        error={formik.touched.rentPrice && Boolean(formik.errors.rentPrice)}
                        helperText={formik.touched.rentPrice && formik.errors.rentPrice}
                      />
                    </Grid>
                    <Grid className={classes.item} item xs={6}>
                      <TextField
                        fullWidth
                        name="rentDuration"
                        id="rentDuration"
                        label="Enter renting duration in days"
                        type="number"
                        min="0.01"
                        value={formik.values.rentDuration}
                        onChange={formik.handleChange}
                        error={formik.touched.rentDuration && Boolean(formik.errors.rentDuration)}
                        helperText={formik.touched.rentDuration && formik.errors.rentDuration}
                      />{' '}
                    </Grid>
                    <Grid className={classes.item} item xs={6}>
                      <TextField
                        fullWidth
                        name="parkingPrice"
                        id="parkingPrice"
                        label="Enter the parking price"
                        type="number"
                        min="0.01"
                        value={formik.values.parkingPrice}
                        onChange={formik.handleChange}
                        error={formik.touched.parkingPrice && Boolean(formik.errors.parkingPrice)}
                        helperText={formik.touched.parkingPrice && formik.errors.parkingPrice}
                      />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                      <Button color="secondary" variant="contained" fullWidth type="submit">
                        Add
                      </Button>
                    </Grid>
                  </form>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default AddParking;
