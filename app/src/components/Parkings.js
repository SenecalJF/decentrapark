import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { CssBaseline, Container, Typography } from '@material-ui/core';
import car from '../img/car.png';

const getModalStyle = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const styles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  item: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
    height: 600,
    width: 600,
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

  useEffect(() => {
    (async () => {
      let parkings = await drizzle.contracts.Decentrapark.methods.getParkings().call();
      parkings = parkings.map((parking, index) => {
        return {
          ...parking,
          color: getColor(parking.rentExpiration),
        };
      });
      setOpenModal(parkings.map(() => false));
      setParkingsList(parkings);
    })();
  }, [drizzle.contracts.Decentrapark.events]);

  const getColor = (expiration) => {
    return expiration < Math.floor(new Date().getTime() / 1000) ? 'lightGreen' : 'red';
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
            parking.color = 'red';
          }

          return parking;
        })
      );
    } catch (err) {
      alert('Error while paying the rent.' + err.message);
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
                    onClick={() => {
                      handleOpen(index);
                    }}
                    sx={{
                      width: '15%',
                      height: 100,
                      margin: 10,
                      border: 'solid 1px black',
                      textAlign: 'center',
                      justifyContent: 'center',

                      backgroundColor: parking.color,

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
                          <Typography>Parking #{index}</Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Typography>Owner : {parking.owner}</Typography>
                        </Grid>
                        <Grid className={classes.item}>
                          <Typography>Rent price : {parking.rentPrice}</Typography>
                        </Grid>

                        <Grid>
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
