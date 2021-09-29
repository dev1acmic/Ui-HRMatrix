import React, { Component } from "react";

import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  CssBaseline,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
} from "@material-ui/core";
import styles from "../../../Auth/styles";
import validate from "validate.js";
//import _ from "underscore";
import schema from "./schema";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { resetPassword, resetPasswordWithToken } from "services/user/action";
import { removeError } from "services/error/action";
import Header from "../header";
//import MessageBox from "util/messageBox";

class ResetPassword extends Component {
  constructor(props) {
    super();
    this.state = {
      uid: props.uid || 0,
      token: props.token || null,
      values: {
        confirm: "",
        password: "",
      },
      touched: {
        confirm: false,
        password: false,
      },
      errors: {
        confirm: null,
        password: null,
      },
      isValid: false,
      isLoading: false,
    };
  }

  validateForm = () => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
    return newState.isValid;
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleResetPassword();
    }
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };
  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };
  handleCloseMsg = () => {
    this.props.removeError();
  };
  handleResetPassword = async () => {
    if (this.validateForm()) {
      const { values } = this.state;
      const { uid, token } = this.state;

      this.setState({ isLoading: true });
      let res;
      if (token) {
        res = await this.props.resetPasswordWithToken(token, values.password);
      } else if (uid > 0) {
        res = await this.props.resetPassword(values.password, uid);
      }
      if (res) {
        this.setState({
          isLoading: false,
          showSuccess: true,
          showMailBox: true,
        });
        //setTimeout(() => this.props.history.push("/sign-in"), 2000);
      } else {
        this.setState({ isLoading: false });
      }
    }
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };

  redirectAction = () => {
    this.props.history.push("/sign-in");
  };

  render() {
    const { classes, t, i18n } = this.props;
    const { errors } = this.state;
    const { touched } = this.state;
    const { showMailBox } = this.state;

    const showPasswordError =
      touched.password && errors.password ? errors.password[0] : false;

    const showConfirmError =
      touched.confirm && errors.confirm ? errors.confirm[0] : false;

    return (
      <CssBaseline>
        <div className={classes.root}>
          <Container className={classes.container} fixed maxWidth="xl">
            <Grid className={classes.grid} container>
              <Header />
              <Grid className={classes.quoteWrapper} item md={7}>
                <div
                  className={classes.quote}
                  style={{
                    backgroundImage: `url(${require(`assets/images/img-signin_${i18n.language}.png`)})`,
                  }}
                >
                  <div className={classes.quoteInner}>
                    <div className={classes.person} />
                  </div>
                </div>
              </Grid>
              <Grid className={classes.content} item md={5} xs={12}>
                <div className={classes.content}>
                  <div className={classes.contentBody}>
                    <div className={classes.loginWrap}>
                      {!showMailBox && (
                        <div>
                          <form className={classes.form}>
                            <Typography className={classes.title} variant="h2">
                              {t("resetpassword")}
                            </Typography>
                            <Typography
                              className={classes.sugestion}
                              variant="body1"
                              style={{ visibility: "hidden" }}
                            >
                              {t("errMsg.enterPassword")}
                            </Typography>
                            <div className={classes.fields}>
                              <TextField
                                error={getMsg(errors.password, t)}
                                className={classes.textField}
                                InputProps={{
                                  classes: {
                                    root: classes.inputOutlined,
                                    focused: classes.inputFocused,
                                    notchedOutline: classes.notchedOutline,
                                  },
                                }}
                                InputLabelProps={{
                                  classes: {
                                    root: classes.labelRoot,
                                    focused: classes.labelFocused,
                                  },
                                }}
                                label={t("password")}
                                name="password"
                                onChange={(event) =>
                                  this.handleFieldChange(
                                    "password",
                                    event.target.value
                                  )
                                }
                                type={"password"}
                                variant="outlined"
                                autoComplete="off"
                              />
                              {showPasswordError && (
                                <Typography
                                  className={classes.fieldError}
                                  variant="body2"
                                  style={{ float: "left" }}
                                >
                                  {getMsg(errors.password[0], t)}
                                </Typography>
                              )}
                              <TextField
                                error={getMsg(errors.confirm, t)}
                                className={classes.textField}
                                InputProps={{
                                  classes: {
                                    root: classes.inputOutlined,
                                    focused: classes.inputFocused,
                                    notchedOutline: classes.notchedOutline,
                                  },
                                }}
                                InputLabelProps={{
                                  classes: {
                                    root: classes.labelRoot,
                                    focused: classes.labelFocused,
                                  },
                                }}
                                label={t("confirmpassword")}
                                onChange={(event) =>
                                  this.handleFieldChange(
                                    "confirm",
                                    event.target.value
                                  )
                                }
                                onKeyPress={this._handleKeyDown}
                                type="password"
                                variant="outlined"
                                autoComplete="off"
                              />
                              {showConfirmError && (
                                <Typography
                                  className={classes.fieldError}
                                  variant="body2"
                                  style={{ float: "left" }}
                                >
                                  {getMsg(errors.confirm[0], t)}
                                </Typography>
                              )}
                            </div>
                            <Grid container>
                              <Grid item lg={5} md={3} sm={4} xs={12} />
                              <Grid item lg={7} md={9} sm={8} xs={12}>
                                {this.state.isLoading ? (
                                  <CircularProgress
                                    className={classes.progress}
                                  />
                                ) : (
                                  <Button
                                    className={classes.signInButton}
                                    color="primary"
                                    onClick={this.handleResetPassword}
                                    variant="contained"
                                  >
                                    {t("resetpassword")}
                                  </Button>
                                )}
                              </Grid>
                            </Grid>
                          </form>
                        </div>
                      )}
                      {showMailBox && (
                        <div
                          style={{
                            tflex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "stretch",
                            position: "relative",
                          }}
                        >
                          <Typography className={classes.title} variant="h2">
                            {t("resetpassword")}
                          </Typography>
                          <Typography
                            className={classes.sugestion}
                            variant="body1"
                            style={{ textAlign: "center", marginBottom: 10 }}
                          >
                            {t("pswdResetSuccesssMsg")}
                          </Typography>

                          <Button
                            //component={Link}
                            className={classes.gradeBtn}
                            style={{
                              width: "100%",
                              marginTop: "20px",
                              padding: "13px 0",
                            }}
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={this.redirectAction}
                          >
                            {t("verifycontinuetologin")}
                          </Button>
                          <Grid container>
                            <Grid item lg={5} md={3} sm={4} xs={12}></Grid>
                            <Grid item lg={7} md={9} sm={8} xs={12}></Grid>
                          </Grid>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <MessageBox
                  open={this.showMsgBox()}
                  variant="error"
                  onClose={this.handleCloseMsg}
                  message={this.props.error.message}
                />
                <MessageBox
                  open={this.state.showSuccess}
                  variant="success"
                  onClose={this.handleMsgClose}
                  message="You have successfully reset the password."
                /> */}
              </Grid>
            </Grid>
          </Container>
        </div>
      </CssBaseline>
    );
  }
}

const mapDispatchToProps = {
  resetPassword,
  resetPasswordWithToken,
  removeError,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ResetPassword)))
);
