import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Link } from 'react-router-dom';

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  appBar: {
    background: '#FF4747',
  },
}));

const NavBar = ({ drizzleState }) => {
  const classes = styles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Grid item xs={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem component={Link} to="/" onClick={handleClose}>
                Parkings
              </MenuItem>
              <MenuItem component={Link} to="/owner" onClick={handleClose}>
                Your parkings
              </MenuItem>
              <MenuItem component={Link} to="/addParking" onClick={handleClose}>
                Add a parking
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h5" className={classes.title} align="center">
              Decentrapark
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
