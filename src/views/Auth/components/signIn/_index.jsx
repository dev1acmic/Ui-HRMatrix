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
import MessageBox from "util/messageBox";

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

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSignIn = async () => {
    const { values } = this.state;

    this.setState({ isLoading: true });

    this.props.login(values.email, values.password).then((status) => {
      this.setState({ isLoading: false });
      if (status) {
        this.props.history.push("/rc/dashboard");
      }
    });
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };

  handleCloseMsg = () => {
    this.props.removeError();
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
      <div className={classes.loginWrap}>
        <MessageBox
          open={this.showMsgBox()}
          variant="error"
          onClose={this.handleCloseMsg}
          message={this.props.error.message}
        />
        {this.state.showForgot ? (
          <ForgotPassword showForgotPwd={this.showForgotPwd} />
        ) : (
          <form className={classes.form}>
            <Typography className={classes.title} variant="h2">
              {t("userLogin")}
            </Typography>
            <Typography className={classes.sugestion} variant="body1">
              {t("welcomeback")}. {t("logintocontinue")}.
            </Typography>
            <div className={classes.fields}>
              <TextField
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
                    root: classes.inputOutlined,
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
                    focused: classes.labelFocused,
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
              />
              {showPasswordError && (
                <Typography className={classes.fieldError} variant="body2">
                  {errors.password[0]}
                </Typography>
              )}
              {/* <Typography className={classes.forgot}>
                <Link
                  to="#"
                  onClick={this.showForgotPwd}
                  className={classes.forgotTxt}
                >
                  Forgot Password?
                </Link>
              </Typography> */}
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
                    color="primary"
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
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(SignIn)))
);
