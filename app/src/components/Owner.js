import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
            <Typography>{drizzleState.accounts[0]}</Typography>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Owner;
