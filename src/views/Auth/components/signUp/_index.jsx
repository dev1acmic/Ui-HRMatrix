import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import validate from "validate.js";
import _ from "underscore";
import { withStyles } from "@material-ui/core";
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import validators from "common/validators";
import styles from "../../styles";
import schema from "./schema";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

// Actions
import { register } from "services/user/action";
import { removeError } from "services/error/action";
import MessageBox from "util/messageBox";

validate.validators.checked = validators.checked;

class SignUp extends Component {
  state = {
    values: {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      company: "",
      designation: "",
      password: "",
      confirm: "",
      policy: false,
    },
    touched: {
      firstName: false,
      lastName: false,
      username: false,
      phone: false,
      company: false,
      designation: false,
      password: false,
      confirm: false,
      policy: null,
    },
    errors: {
      firstName: null,
      lastName: null,
      username: null,
      phone: null,
      company: null,
      designation: null,
      password: null,
      confirm: null,
      policy: null,
    },
    isValid: false,
    isLoading: false,
    submitError: null,
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

  handleSignUp = async () => {
    const { values } = this.state;

    this.setState({ isLoading: true });

    this.props.register(values).then((status) => {
      this.setState({ isLoading: false });
      if (status) {
        this.props.handler();
      }
    });
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
    // const { t } = this.props;
    // getMsg(this.props.error.message, t);
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

    const showFirstNameError =
      touched.firstName && errors.firstName ? errors.firstName[0] : false;
    const showLastNameError =
      touched.lastName && errors.lastName ? errors.lastName[0] : false;
    const showUsernameError =
      touched.username && errors.username ? errors.username[0] : false;
    const showPasswordError =
      touched.password && errors.password ? errors.password[0] : false;
    const showPolicyError =
      touched.policy && errors.policy ? errors.policy[0] : false;
    const showPhoneNumberError =
      touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber[0] : false;
    const showCompanyNameError =
      touched.companyName && errors.companyName ? errors.companyName[0] : false;
    const showDesignationError =
      touched.designation && errors.designation ? errors.designation[0] : false;
    const showConfirmError =
      touched.confirm && errors.confirm ? errors.confirm[0] : false;

    return (
      <div className={classes.loginWrap} style={{ marginTop: "50px" }}>
        <MessageBox
          open={this.showMsgBox()}
          variant="error"
          onClose={this.handleCloseMsg}
          message={this.props.error.message}
        />
        <form className={classes.form}>
          <Typography className={classes.title} variant="h2">
            {t("employerreg")}
          </Typography>
          <Typography className={classes.subtitle} variant="body1">
            {t("fillform")}
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
              label={t("firstname")}
              name="firstName"
              onChange={(event) =>
                this.handleFieldChange("firstName", event.target.value)
              }
              value={values.firstName}
              variant="outlined"
              autoComplete="off"
            />
            {showFirstNameError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.firstName[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("lastname")}
              onChange={(event) =>
                this.handleFieldChange("lastName", event.target.value)
              }
              value={values.lastName}
              variant="outlined"
              autoComplete="off"
            />
            {showLastNameError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.lastName[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("phonenumber")}
              name="phoneNumber"
              onChange={(event) =>
                this.handleFieldChange("phoneNumber", event.target.value)
              }
              value={values.phoneNumber}
              variant="outlined"
              autoComplete="off"
            />
            {showPhoneNumberError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.phoneNumber[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("companyname")}
              name="companyName"
              onChange={(event) =>
                this.handleFieldChange("companyName", event.target.value)
              }
              value={values.companyName}
              variant="outlined"
              autoComplete="off"
            />
            {showCompanyNameError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.companyName[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("designation")}
              name="designation"
              onChange={(event) =>
                this.handleFieldChange("designation", event.target.value)
              }
              value={values.designation}
              variant="outlined"
              autoComplete="off"
            />
            {showDesignationError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.designation[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("emailaddress")}
              name="username"
              onChange={(event) =>
                this.handleFieldChange("username", event.target.value)
              }
              value={values.username}
              variant="outlined"
              autoComplete="off"
            />
            {showUsernameError && (
              <Typography className={classes.fieldError} variant="body2">
                {errors.username[0]}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("password")}
              onChange={(event) =>
                this.handleFieldChange("password", event.target.value)
              }
              type="password"
              value={values.password}
              variant="outlined"
              autoComplete="off"
            />
            {showPasswordError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.password[0], t)}
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
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              label={t("confirmpassword")}
              onChange={(event) =>
                this.handleFieldChange("confirm", event.target.value)
              }
              type="password"
              value={values.confirm}
              variant="outlined"
              autoComplete="off"
            />
            {showConfirmError && (
              <Typography className={classes.fieldError} variant="body2">
                {getMsg(errors.confirm[0], t)}
              </Typography>
            )}
            <div className={classes.policy}>
              <Checkbox
                checked={values.policy}
                className={classes.policyCheckbox}
                color="primary"
                name="policy"
                onChange={() =>
                  this.handleFieldChange("policy", !values.policy)
                }
              />
              <Typography className={classes.policyText} variant="body1">
                {t("haveread")} &nbsp;
                <Link className={classes.policyUrl} to="#">
                  {t("termsandconditions")}
                </Link>
                .
              </Typography>
            </div>
            {showPolicyError && (
              <Typography className={classes.fieldError} variant="body2">
                {errors.policy[0]}
              </Typography>
            )}
          </div>
          <Grid container>
            <Grid item md={8} sm={8} xs={12}>
              <Typography className={classes.signUp} variant="body1">
                Have an account?{" "}
                <Link
                  className={classes.signUpUrl}
                  onClick={this.props.handler}
                >
                  {t("signin")}
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
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!isValid}
                  onClick={this.handleSignUp}
                  size="large"
                  variant="contained"
                >
                  Sign up now
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

SignUp.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  register,
  removeError,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(SignUp)))
);
