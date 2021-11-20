import React from 'react';
import Grid from '@material-ui/core/Grid';
import { CssBaseline, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useFormik } from 'formik';

const AddParking = ({ drizzle, drizzleState }) => {
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

  return <div></div>;
};

export default AddParking;
