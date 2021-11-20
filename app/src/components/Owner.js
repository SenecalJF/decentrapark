import React from 'react';
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

const Owner = ({ drizzle, drizzleState }) => {
  const classes = styles();

  return (
    <>
      <CssBaseline />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Typography>Owner component</Typography>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Owner;
