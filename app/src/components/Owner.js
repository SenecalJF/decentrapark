import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { CssBaseline, Container, Typography, Paper } from '@material-ui/core';

import weiToUsd from '../utils/weiToUsd';
import usdToWei from '../utils/usdToWei';

import { useFormik } from 'formik';

const getModalStyle = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
  item: {
    margin: theme.spacing(3, 3, 1, 1),
  },

  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    overflow: 'auto',
    overflowWrap: 'break-word',
  },
  setting: {
    margin: theme.spacing(2),

    alignContent: 'center',
  },
  box: {
    border: 4,
    borderColor: '#FF4747',
  },
  modal: {
    position: 'absolute',
    height: '50%',
    width: '40%',
    overflow: 'auto',
    overflowWrap: 'break-word',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Owner = ({ drizzle, drizzleState }) => {
  const classes = styles();
  const [parkingsList, setParkingsList] = useState([]);
  const [openModal, setOpenModal] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [rentCost, setRentCost] = useState(false);
  const [parkingCost, setParkingCost] = useState(false);
  const [rentTime, setRentTime] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);

  useEffect(() => {
    (async () => {
      let parkings = await drizzle.contracts.Decentrapark.methods.getParkings().call();
      parkings = await Promise.all(
        parkings.map(async (parking) => {
          const usdRent = await weiToUsd(parking.rentPrice);
          const usdPriceParking = await weiToUsd(parking.parkingPrice);
          return {
            ...parking,
            available: getAvailability(parking.rentExpiration),
            usdRent,
            usdPriceParking,
          };
        })
      );
      setParkingsList(parkings);
      setOpenModal(parkings.map(() => false));
    })();
  }, [drizzle.contracts.Decentrapark.methods]);

  const getAvailability = (expiration) => {
    return expiration < Math.floor(new Date().getTime() / 1000);
  };

  const handleOpen = (index) => {
    setOpenModal((modal_list) => modal_list.map((modal, i) => index === i)); //list
  };

  const handleClose = () => {
    setOpenModal((modal_list) => modal_list.map(() => false));
  };

  const formikRentCost = useFormik({
    initialValues: {
      rentPrice: 0,
    },
    onSubmit: async ({ rentPrice }) => {
      try {
        let rentPriceWei = await usdToWei(rentPrice);

        await drizzle.contracts.Decentrapark.methods
          .setRentPrice(rentPriceWei.toString(), currentIndex)
          .send({ from: drizzleState.accounts[0] });
        handleButton();
      } catch (error) {
        console.error(error.message);
        alert('Please enter input correctly - Failed to change parking rent price');
      }
    },
  });

  const formikParkingPrice = useFormik({
    initialValues: {
      parkingPrice: 0,
    },
    onSubmit: async ({ parkingPrice }) => {
      try {
        let parkingPriceWei = await usdToWei(parkingPrice);

        await drizzle.contracts.Decentrapark.methods
          .setParkingPrice(parkingPriceWei.toString(), currentIndex)
          .send({ from: drizzleState.accounts[0] });
        handleButton();
      } catch (error) {
        console.error(error.message);
        alert('Please enter input correctly - Failed to change the parking price');
      }
    },
  });

  const formikRentTime = useFormik({
    initialValues: {
      rentDuration: 0,
    },
    onSubmit: async ({ rentDuration }) => {
      try {
        await drizzle.contracts.Decentrapark.methods
          .setRentDuration(rentDuration, currentIndex)
          .send({ from: drizzleState.accounts[0] });
        handleButton();
      } catch (error) {
        console.error(error.message);
        alert('Please enter input correctly - Failed to change the parking rent time');
      }
    },
  });

  const changeRentCost = () => {
    return (
      <div className={classes.item}>
        <Box sx={{ marginTop: 3, height: '100%', border: '4px ridge' }}>
          <Grid className={classes.setting}>
            <Grid className={classes.item}>
              <Typography>Change the rent cost</Typography>
            </Grid>
            <form onSubmit={formikRentCost.handleSubmit}>
              <Grid align="right">
                <TextField
                  fullWidth
                  name="rentPrice"
                  id="rentPrice"
                  label="Enter renting price"
                  type="number"
                  min="0.01"
                  value={formikRentCost.values.rentPrice}
                  onChange={formikRentCost.handleChange}
                  error={formikRentCost.touched.rentPrice && Boolean(formikRentCost.errors.rentPrice)}
                  helperText={formikRentCost.touched.rentPrice && formikRentCost.errors.rentPrice}
                />
                <Grid className={classes.item}>
                  <Button color="secondary" variant="contained" type="submit">
                    {' '}
                    DONE{' '}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </div>
    );
  };

  const changeResellValue = () => {
    return (
      <div className={classes.item}>
        <Box sx={{ marginTop: 3, height: '100%', border: '4px ridge' }}>
          <Grid className={classes.setting}>
            <Grid className={classes.item}>
              <Typography>Change the resell value</Typography>
            </Grid>
            <form onSubmit={formikParkingPrice.handleSubmit}>
              <Grid align="right">
                <TextField
                  fullWidth
                  name="parkingPrice"
                  id="parkingPrice"
                  label="Enter parking price"
                  type="number"
                  min="0.01"
                  value={formikParkingPrice.values.parkingPrice}
                  onChange={formikParkingPrice.handleChange}
                  error={formikParkingPrice.touched.parkingPrice && Boolean(formikParkingPrice.errors.parkingPrice)}
                  helperText={formikParkingPrice.touched.parkingPrice && formikParkingPrice.errors.parkingPrice}
                />
                <Grid className={classes.item}>
                  <Button color="secondary" variant="contained" type="submit">
                    {' '}
                    DONE{' '}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </div>
    );
  };

  const changeRentTime = () => {
    return (
      <div className={classes.item}>
        <Box sx={{ marginTop: 2, width: '100%', height: '100%', border: '4px ridge' }}>
          <Grid className={classes.setting}>
            <Grid className={classes.item}>
              <Typography>Change the rent time</Typography>
            </Grid>
            <form onSubmit={formikRentTime.handleSubmit}>
              <Grid align="right">
                <TextField
                  fullWidth
                  name="rentDuration"
                  id="rentDuration"
                  label="Enter the rent duration"
                  type="number"
                  min="0.01"
                  value={formikRentTime.values.rentDuration}
                  onChange={formikRentTime.handleChange}
                  error={formikRentTime.touched.rentDuration && Boolean(formikRentTime.errors.rentDuration)}
                  helperText={formikRentTime.touched.rentDuration && formikRentTime.errors.rentDuration}
                />
                <Grid className={classes.item}>
                  <Button color="secondary" variant="contained" type="submit">
                    {' '}
                    DONE{' '}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </div>
    );
  };

  const handleButton = async () => {
    window.alert('Successfully change the settings');
    // window.location.reload();
    setRentCost(false);
    setParkingCost(false);
    setRentTime(false);
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3} className={classes.item} justifyContent="center">
            <Paper className={classes.paper} align="center">
              {' '}
              Your address : {drizzleState.accounts[0]}{' '}
            </Paper>

            <Grid container item xs={12}>
              {parkingsList.map(({ available, owner, usdRent, usdPriceParking, rentDuration, renter }, index) =>
                owner === drizzleState.accounts[0] ? (
                  <React.Fragment key={index}>
                    <Box
                      onClick={async () => {
                        handleOpen(index); //open modal when clicked
                        setCurrentIndex(index);
                      }}
                      sx={{
                        width: '35%',
                        height: 300,
                        margin: 10,
                        border: 'solid 1px black',
                        textAlign: 'center',
                        justifyContent: 'center',

                        backgroundColor: available ? '#00FF00' : '#FF3F3F',

                        '&:hover': {
                          backgroundColor: 'parking.color',
                          opacity: [0.9, 0.8, 0.7],
                        },
                      }}
                    >
                      <Typography> {index} </Typography>
                    </Box>
                    <div>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openModal[index]}
                        onClose={() => {
                          handleClose();
                          setCurrentIndex(-1);
                          setRentCost(false);
                          setParkingCost(false);
                          setRentTime(false);
                        }}
                      >
                        <div style={modalStyle} className={classes.modal}>
                          <Grid className={classes.item}>
                            <Grid align="center" className={classes.item}>
                              <Typography> Parking index : {index} </Typography>
                            </Grid>
                            <Grid container spacing={1}>
                              <Grid item xs={5}>
                                <Grid className={classes.item}>
                                  <Typography> Rent cost : {Math.round(usdRent)} $ </Typography>
                                  <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => {
                                      setRentCost(!rentCost);
                                      setParkingCost(false);
                                      setRentTime(false);
                                    }}
                                  >
                                    Change
                                  </Button>
                                </Grid>
                                <Grid className={classes.item}>
                                  <Typography> Resell value : {Math.round(usdPriceParking)} $</Typography>
                                  <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => {
                                      setParkingCost(!parkingCost);
                                      setRentCost(false);
                                      setRentTime(false);
                                    }}
                                  >
                                    Change
                                  </Button>
                                </Grid>
                                <Grid className={classes.item}>
                                  <Typography> Rent duration {Math.round(rentDuration / 86400)} days </Typography>
                                  <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => {
                                      setRentTime(!rentTime);
                                      setParkingCost(false);
                                      setRentCost(false);
                                    }}
                                  >
                                    Change
                                  </Button>
                                </Grid>
                              </Grid>

                              <Grid item xs={7} align="center">
                                {rentCost ? changeRentCost() : <></>}
                                {parkingCost ? changeResellValue() : <></>}
                                {rentTime ? changeRentTime() : <></>}
                              </Grid>
                            </Grid>
                            {!available ? (
                              <Grid className={classes.item}>
                                <Typography>Current renter : </Typography>
                                <Typography variant="body6">{renter}</Typography>
                              </Grid>
                            ) : (
                              <></>
                            )}
                          </Grid>
                        </div>
                      </Modal>
                    </div>
                  </React.Fragment>
                ) : (
                  <></>
                )
              )}{' '}
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Owner;
