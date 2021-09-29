import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import validate from "validate.js";
import _ from "underscore";
import {
  withStyles,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Slide,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import styles from "../../styles";
import schema from "./schema";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

// Actions
import { login } from "services/user/action";
import { removeError } from "services/error/action";
import ForgotPassword from "../forgetPwd";
import ResendActivation from "../resendActivation";
import MessageBox from "util/messageBox";
import { isRoleSuperUserAdmin } from "util/roleUtil";

class SignIn extends Component {
  state = {
    values: {
      email: "",
      password: "",
    },
    touched: {
      email: false,
      password: false,
    },
    errors: {
      email: null,
      password: null,
    },
    isValid: false,
    isLoading: false,
    submitError: null,
    showForgot: false,
    showResend: false,
    showPassword: false,
  };

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  showForgotPwd = () => {
    this.setState({ showForgot: !this.state.showForgot });
  };

  showResendActivation = () => {
    this.setState({ showResend: !this.state.showResend });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSignIn = async () => {
    const { values } = this.state;
    if (this.state.isValid) {
      this.setState({ isLoading: true });
      let loginStatus = { isVerified: true };
      this.props
        .login(values.email, values.password, loginStatus)
        .then((status) => {
          this.setState({ isLoading: false });
          if (!loginStatus.isVerified) {
            this.showResendActivation();
          } else if (status) {
            const { state } = this.props.location;
            if (state && state.from) {
              // If there is a destination in 'from' variable, then redirect there
              this.props.history.push(state.from);
            } else {
              if (
                this.props.profile &&
                isRoleSuperUserAdmin(this.props.profile.roles)
              ) {
                this.props.history.push("/rc/reports/0");
                // this.props.history.push("/rc/manage-premium-agency");
              } else {
                this.props.history.push("/rc/dashboard");
              }
            }
          }
        });
    }
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };

  handleCloseMsg = () => {
    this.props.removeError();
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleSignIn();
    }
  };

  render() {
    const { classes, t } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading,
    } = this.state;

    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <Slide in="true" timeout="3000" direction="down">
        <div className={classes.loginWrap}>
          <MessageBox
            open={this.showMsgBox()}
            variant="error"
            onClose={this.handleCloseMsg}
            message={this.props.error.message}
          />
          {this.state.showForgot ? (
            <ForgotPassword showForgotPwd={this.showForgotPwd} />
          ) : this.state.showResend ? (
            <ResendActivation
              showResendActivation={this.showResendActivation}
            />
          ) : (
            <form className={classes.form}>
              <Typography className={classes.title} variant="h2">
                {t("login")}
              </Typography>

              <Typography className={classes.sugestion} variant="body1">
                {t("hi")}!
                <br />
                {t("welcomeback")}. {t("logintocontinue")}.
              </Typography>

              <div className={classes.fields}>
                <TextField
                  className={classes.textField}
                  InputProps={{
                    classes: {
                      root: classes.inputOutlinedG,
                      focused: classes.inputFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.labelRoot,
                      focused: classes.labelFocusedG,
                    },
                  }}
                  label={t("emailid")}
                  name="email"
                  onChange={(event) =>
                    this.handleFieldChange("email", event.target.value)
                  }
                  type="email"
                  value={values.email}
                  variant="outlined"
                  autoComplete="off"
                />

                {showEmailError && (
                  <Typography className={classes.fieldError} variant="body2">
                    {getMsg(errors.email[0], t)}
                  </Typography>
                )}
                <TextField
                  className={classes.textField}
                  InputProps={{
                    classes: {
                      root: classes.inputOutlinedG,
                      focused: classes.inputFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {this.state.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.labelRoot,
                      focused: classes.labelFocusedG,
                    },
                  }}
                  label={t("password")}
                  name="password"
                  onChange={(event) =>
                    this.handleFieldChange("password", event.target.value)
                  }
                  type={this.state.showPassword ? "text" : "password"}
                  value={values.password}
                  variant="outlined"
                  autoComplete="off"
                  onKeyPress={this._handleKeyDown}
                />
                {showPasswordError && (
                  <Typography className={classes.fieldError} variant="body2">
                    {getMsg(errors.password[0], t)}
                  </Typography>
                )}
                <Typography className={classes.forgot}>
                  <Link
                    to="#"
                    onClick={this.showForgotPwd}
                    className={classes.forgotTxt}
                  >
                    {t("forgotpassword")} ?
                  </Link>
                </Typography>
              </div>
              <Grid container>
                <Grid item md={8} sm={8} xs={12}>
                  <Typography className={classes.signUp} variant="body1">
                    {t("areYouanEmployer")}{" "}
                    <Link
                      to="#"
                      className={classes.signUpUrl}
                      onClick={this.props.handler}
                    >
                      {t("register")}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                  {submitError && (
                    <Typography className={classes.submitError} variant="body2">
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Button
                      className={classes.signInButton}
                      color="secondary"
                      disabled={!isValid}
                      onClick={this.handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      {t("signin")}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
        </div>
      </Slide>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  login,
  removeError,
};

const mapStateToProps = (state) => ({
  error: state.error,
  profile: state.profile,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(SignIn)))
);
