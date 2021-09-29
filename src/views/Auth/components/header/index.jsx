import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  withStyles,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";
import styles from "../../styles";
import logo from "assets/images/logo-hMatrix.png";
import {
  MenuOutlined as MoreIcon,
  AccountCircleOutlined as AboutIcon,
  AssistantOutlined as HowIcon,
  PermContactCalendarOutlined as ContactIcon,
  PersonPinOutlined as LoginIcon,
  VerifiedUserOutlined as RegisterIcon,
} from "@material-ui/icons";
import { withTranslation } from "react-i18next";

class Header extends Component {
  state = {
    anchorEl: null,
    registerEl: null,
  };

  handleRegClick = (event) => {
    this.setState({ registerEl: event.currentTarget });
  };

  handleRegClose = () => {
    this.setState({ registerEl: null });
  };

  handleEmpSignup = () => {
    this.setState({ registerEl: null }, this.props.handleEmpSignup());
  };

  handleAgencySignup = () => {
    this.setState({ registerEl: null }, this.props.handleAgencySignup());
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, t } = this.props;
    const { anchorEl } = this.state;
    const { registerEl } = this.state;

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
            <Grid
              className={classes.topBarRight}
              item
              md={8}
              sm={8}
              xs={8}
              style={{ textAlign: "right" }}
            >
              <div className={classes.sectionDesktop}>
                <Button className={classes.topLink} color="inherit">
                  {t("aboutus")}
                </Button>
                <Button className={classes.topLink} color="inherit">
                  {t("howitworks")}
                </Button>
                <Button className={classes.topLink} color="inherit">
                  {t("contactus")}
                  {this.props.children}
                </Button>
                {this.props.showLogin ? (
                  <Button
                    style={{ marginRight: 0 }}
                    className={classes.btnTopLink}
                    color="secondary"
                    onClick={this.props.handleSignin}
                    size="small"
                    variant="contained"
                  >
                    {t("login")}
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button
                      aria-controls="simple-menu1"
                      aria-haspopup="true"
                      onClick={this.handleRegClick}
                      style={{ marginRight: 0 }}
                      className={classes.btnTopLink}
                      color="primary"
                      size="small"
                      variant="contained"
                    >
                      {t("register")}
                    </Button>
                    <Menu
                      id="simple-menu1"
                      anchorEl={registerEl}
                      keepMounted
                      open={Boolean(registerEl)}
                      onClose={this.handleRegClose}
                    >
                      <MenuItem onClick={this.handleEmpSignup}>
                        {t("foremployers")}
                      </MenuItem>
                      <MenuItem onClick={this.handleAgencySignup}>
                        {t("foragency")}
                      </MenuItem>
                    </Menu>
                    {/* <Button
                      style={{ marginRight: 0 }}
                      className={classes.btnTopLink}
                      color="primary"
                      onClick={this.props.handleEmpSignup}
                      size="small"
                      variant="contained"
                    >
                      For Employers
                    </Button>
                    <Button
                      style={{ marginRight: 0 }}
                      className={classes.btnTopLink}
                      color="primary"
                      onClick={this.props.handleAgencySignup}
                      size="small"
                      variant="contained"
                    >
                      For Agency
                    </Button> */}
                  </React.Fragment>
                )}
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label={t("showMore")}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>
                    <AboutIcon className={classes.menuIcon} />
                    {t("aboutus")}
                  </MenuItem>
                  <MenuItem onClick={this.handleClose}>
                    <HowIcon className={classes.menuIcon} />
                    {t("howitworks")}
                  </MenuItem>
                  <MenuItem onClick={this.handleClose}>
                    <ContactIcon className={classes.menuIcon} />
                    {t("contactus")}
                  </MenuItem>
                  <MenuItem
                    onClick={(this.handleClose, this.props.handler)}
                    className={classes.menuReg}
                  >
                    <RegisterIcon className={classes.menuIcon} />
                    {t("foremployers")}
                  </MenuItem>
                  <MenuItem
                    onClick={(this.handleClose, this.props.handler)}
                    className={classes.menuLogin}
                  >
                    <LoginIcon className={classes.menuIcon} />
                    {t("login")}
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(withTranslation("common")(Header));
