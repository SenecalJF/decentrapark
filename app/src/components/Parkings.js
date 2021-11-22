import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { CssBaseline, Container, Typography } from '@material-ui/core';

const getModalStyle = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  // p: 4,
};

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
    // background: theme.palette.text.secondary,
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
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  let park = [];
  useEffect(() => {
    (async () => {
      setParkingsList(await drizzle.contracts.Decentrapark.methods.getParkings().call());
    })();

    // setParkingsList(
    //   parkingsList.map((parking, index) => {
    //     return { ...parking, color: showColor(index) };
    //   })
    // );
  }, []);

  const showColor = async (_index) => {
    let not_occupied = await drizzle.contracts.Decentrapark.methods.getAvailability(_index).call();
    if (not_occupied) {
      return 'primary';
    } else {
      return 'secondary';
    }
  };

  const openParking = (_index) => {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.paper2}>
            <Typography>Hello</Typography>
          </div>
        </Modal>
      </div>
    );
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
                <div>
                  <Paper
                    // classes={{ background: showColor(index) }}
                    variant="outlined"
                    className={classes.paper}
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    {/* {showColor(index)} */}
                    <Grid className={classes.item} item xs={12} align="center">
                      {/* <Typography> {parkingStruct.owner} </Typography> */}
                      {/* <Typography> {parkingStruct.rentPrice} </Typography> */}
                      {/* <Typography> {parkingStruct.rentDuration / 86400} </Typography> */}
                      {/* <Typography> {parkingStruct.color} </Typography> */}

                      <Typography> {index} </Typography>
                    </Grid>
                  </Paper>
                  {openParking(index)}
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Parkings;
