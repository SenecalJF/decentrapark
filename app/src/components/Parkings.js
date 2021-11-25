import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { CssBaseline, Container, Typography } from '@material-ui/core';

import weiToUsd from '../utils/weiToUsd';

const getModalStyle = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const styles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    flexGrow: 1,
  },
  item: {
    margin: theme.spacing(3, 3, 1, 1),
  },
  item2: {
    margin: theme.spacing(4, 4, 0, 0),
  },
  button: {
    backgroundColor: '#FF4747',
    color: 'white',
  },
  paper: {
    width: '15%',
    height: '5%',
    margin: theme.spacing(1),
  },
  paper2: {
    position: 'absolute',
    height: '50%',
    width: '50%',
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

const Parkings = ({ drizzle, drizzleState }) => {
  const classes = styles();
  const [parkingsList, setParkingsList] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [openModal, setOpenModal] = useState([]);
  const [rentPriceUSD, setRentPriceUSD] = useState(0);
  const [parkingPriceUSD, setParkingPriceUSD] = useState(0);

  useEffect(() => {
    (async () => {
      let parkings = await drizzle.contracts.Decentrapark.methods.getParkings().call();
      parkings = parkings.map((parking) => {
        return {
          ...parking,
          available: getAvailability(parking.rentExpiration),
        };
      });
      setOpenModal(parkings.map(() => false));
      setParkingsList(parkings);
    })();
  }, [drizzle.contracts.Decentrapark.events]);

  const getAvailability = (expiration) => {
    return expiration < Math.floor(new Date().getTime() / 1000);
  };

  const handleOpen = (index) => {
    setOpenModal((modal_list) => modal_list.map((modal, i) => index === i)); //list
  };

  const handleClose = (index) => {
    setOpenModal((modal_list) => modal_list.map(() => false));
  };

  const handleRent = async (index, rentPrice) => {
    try {
      await drizzle.contracts.Decentrapark.methods
        .RentParking(index)
        .send({ from: drizzleState.accounts[0], value: rentPrice });
      alert('Transaction success');
      setParkingsList((parkingsList) =>
        parkingsList.map((parking, i) => {
          if (i === index) {
            parking.available = false;
          }

          return parking;
        })
      );
    } catch (err) {
      alert('Error while paying the rent.' + err.message);
    }
  };

  const handleBuy = async (index, buyPrice) => {
    try {
      await drizzle.contracts.Decentrapark.methods
        .buyParking(index)
        .send({ from: drizzleState.accounts[0], value: buyPrice });
      alert('Transaction success');
      setParkingsList((parkingsList) =>
        parkingsList.map((parking, i) => {
          if (i === index) {
            parking.owner = drizzleState.accounts[0];
          }

          return parking;
        })
      );
    } catch (err) {
      alert('Error while buying the parking.' + err.message);
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
              {parkingsList.map((parking, index) => (
                <React.Fragment key={index}>
                  <Box
                    onClick={async () => {
                      handleOpen(index);

                      let renting = await weiToUsd(parking.rentPrice);
                      let buying = await weiToUsd(parking.parkingPrice);
                      setRentPriceUSD(renting);
                      setParkingPriceUSD(buying);
                    }}
                    sx={{
                      width: '15%',
                      height: 100,
                      margin: 10,
                      border: 'solid 1px black',
                      textAlign: 'center',
                      justifyContent: 'center',

                      backgroundColor: parking.available ? 'lightGreen' : 'red',

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
                      onClose={() => handleClose(index)}
                    >
                      <div style={modalStyle} className={classes.paper2}>
                        <Grid className={classes.item}>
                          <Typography variant="h4" align="center">
                            Parking # {index}
                          </Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Typography fontWeight="bold">Owner : {parking.owner}</Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Typography>
                            Rent price :{'  '}
                            {Math.round(rentPriceUSD)} $
                          </Typography>
                        </Grid>

                        <Grid className={classes.item}>
                          {parking.available ? (
                            <Button
                              variant="contained"
                              className={classes.button}
                              size="medium"
                              onClick={() => {
                                handleRent(index, parking.rentPrice);
                              }}
                            >
                              Rent
                            </Button>
                          ) : (
                            <Typography fontWeight="bold"> You cant rent the parking at the moment </Typography>
                          )}
                        </Grid>

                        <br />

                        <Grid className={classes.item}>
                          <Typography variant="h6"> You would like to buy the parking? </Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Typography>Price : {Math.round(parkingPriceUSD)} $</Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Button
                            variant="contained"
                            className={classes.button}
                            size="medium"
                            onClick={() => {
                              handleBuy(index, parking.parkingPrice);
                            }}
                          >
                            {' '}
                            Buy{' '}
                          </Button>
                        </Grid>
                      </div>
                    </Modal>
                  </div>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Parkings;
