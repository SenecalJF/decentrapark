import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';

import { CssBaseline, Container, Typography, Paper } from '@material-ui/core';

import weiToUsd from '../utils/weiToUsd';

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
  modal: {
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

const Owner = ({ drizzle, drizzleState }) => {
  const classes = styles();
  const [parkingsList, setParkingsList] = useState([]);
  const [openModal, setOpenModal] = useState([]);
  const [modalStyle] = useState(getModalStyle);

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
  }, [drizzle.contracts.Decentrapark.events]);

  const getAvailability = (expiration) => {
    return expiration < Math.floor(new Date().getTime() / 1000);
  };

  const handleOpen = (index) => {
    setOpenModal((modal_list) => modal_list.map((modal, i) => index === i)); //list
  };
  console.log(parkingsList);

  const handleClose = () => {
    setOpenModal((modal_list) => modal_list.map(() => false));
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
              {parkingsList.map(({ available, owner, usdRent, usdPriceParking, rentDuration }, index) =>
                owner === drizzleState.accounts[0] ? (
                  <React.Fragment key={index}>
                    <Box
                      onClick={async () => {
                        handleOpen(index); //open modal when clicked
                      }}
                      sx={{
                        width: '35%',
                        height: 300,
                        margin: 10,
                        border: 'solid 1px black',
                        textAlign: 'center',
                        justifyContent: 'center',

                        backgroundColor: available ? 'lightGreen' : 'red',

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
                        onClose={() => handleClose()}
                      >
                        <div style={modalStyle} className={classes.modal}>
                          <Grid>
                            <Typography> {index} </Typography>
                            <Typography> {usdRent} </Typography>
                            <Typography> {usdPriceParking} </Typography>
                            <Typography> {rentDuration / 86400} days </Typography>
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
