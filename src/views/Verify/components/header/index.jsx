import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { withStyles, Grid, AppBar, Toolbar, Link } from "@material-ui/core";
import styles from "../../../Auth/styles";
import logo from "assets/images/logo-hMatrix.png";

class Header extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    //const { anchorEl } = this.state;
    //const [anchorEl, setAnchorEl] = React.useState(null);

    // state = {
    //   anchorEl: null
    // };

    // function handleClick(event) {
    //   //setAnchorEl(event.currentTarget);
    //   this.setState({ anchorEl: event.currentTarget });
    // }

    // function handleClose() {
    //   //setAnchorEl(null);
    //   this.setState({ anchorEl: null });
    // }

    return (
      <AppBar
        color="default"
        position="relative"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar style={{ justify: "space-between" }}>
          <Grid container>
            <Grid item md={4} sm={4} xs={4}>
              <Link component={RouterLink} to="/">
                <img
                  alt="HR Matrix"
                  className={classes.loginLogo}
                  src={logo}
                  Component=""
                />
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
