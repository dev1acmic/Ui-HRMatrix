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
  Slide,
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
import mail from "assets/images/cmail.png";
validate.validators.checked = validators.checked;

class SignUp extends Component {
  state = {
    values: {
      fname: "",
      lname: "",
      username: "",
      phone: "",
      company: "",
      designation: "",
      password: "",
      confirm: "",
      policy: false,
    },
    touched: {
      fname: false,
      lname: false,
      username: false,
      phone: false,
      company: false,
      designation: false,
      password: false,
      confirm: false,
      policy: null,
    },
    errors: {
      fname: null,
      lname: null,
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
    showSuccessBox: false,
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

    const re = /^[+?0-9\b]+$/;
    if (field === "phoneNumber" && value && !re.test(value)) {
      value = newState.values[field] || "";
    }

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  handleSignUp = async () => {
    const { values } = this.state;

    this.setState({ isLoading: true });

    this.props.register(values).then((res) => {
      this.setState({ isLoading: false });
      if (res === "Organization already exists.") {
        this.setState({ showOrgExistBox: true });
      } else if (res) {
        this.setState({ showSuccessBox: true });
        //this.props.handler();
      } else {
      }
    });
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };

  handleCloseMsg = () => {
    this.props.removeError();
  };

  handlePaste = (e) => {
    e.preventDefault();
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
      showSuccessBox,
      showOrgExistBox,
    } = this.state;

    const showfnameError =
      touched.fname && errors.fname ? errors.fname[0] : false;
    const showlnameError =
      touched.lname && errors.lname ? errors.lname[0] : false;
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
      <Slide in="true" timeout="3000" direction="up">
        <div className={classes.loginWrap} style={{ marginTop: "50px" }}>
          <MessageBox
            open={this.showMsgBox()}
            variant="error"
            onClose={this.handleCloseMsg}
            message={this.props.error.message}
          />
          {!showSuccessBox && !showOrgExistBox && (
            <form className={classes.form}>
              <Typography className={classes.title} variant="h2">
                {t("employerreg")}
              </Typography>
              <Typography className={classes.sugestion} variant="body1">
                {t("hi")}!
                <br />
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
                  name="fname"
                  onChange={(event) =>
                    this.handleFieldChange("fname", event.target.value)
                  }
                  value={values.fname}
                  variant="outlined"
                  autoComplete="off"
                />
                {showfnameError && (
                  <Typography className={classes.fieldError} variant="body2">
                    {getMsg(errors.fname[0], t)}
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
                    this.handleFieldChange("lname", event.target.value)
                  }
                  value={values.lname}
                  variant="outlined"
                  autoComplete="off"
                />
                {showlnameError && (
                  <Typography className={classes.fieldError} variant="body2">
                    {getMsg(errors.lname[0], t)}
                  </Typography>
                )}
                <TextField
                  className={classes.textField}
                  //inputProps={{ maxLength: 12 }}
                  InputProps={{
                    classes: {
                      root: classes.inputOutlined,
                      focused: classes.inputFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                    maxLength: 12,
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
                {/* <TextField
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
                )} */}

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
                    {getMsg(errors.username[0], t)}
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
                  onPaste={this.handlePaste}
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
                  onPaste={this.handlePaste}
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
                    {t("alreadyanuser?")}?{" "}
                    <Link
                      className={classes.loginUrl}
                      onClick={this.props.handler}
                    >
                      {t("login")}
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
                      onClick={this.handleSignUp}
                      size="large"
                      variant="contained"
                    >
                      {t("register")}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
          {showSuccessBox && (
            <form className={classes.form}>
              <Typography className={classes.title} variant="h2">
                {t("common:verifyyouremail")}
              </Typography>

              <div style={{ textAlign: "center" }}>
                <img
                  alt="HR Matrix"
                  src={mail}
                  Component=""
                  style={{ width: "60px" }}
                />
              </div>

              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: "10px" }}
              >
                {t("common:hiringtargetsentaccountactivationmessage")}
                {"\n"}
                <b>{values.username}</b>
              </Typography>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("common:verifyyouremailmsg")}
              </Typography>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("common:checkspamfolder")}
                {/* If you have not yet received an email from Hiring Target, please
                check in your spam folder, or add
                <b> acmicclouduser1@gmail.com</b> to your email program's list
                of allowable addresses. */}
              </Typography>
              <hr></hr>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("common:checkspamifnotemailreceived")}
              </Typography>
              <Grid container>
                <Grid item lg={5} md={3} sm={4} xs={12}></Grid>
                <Grid item lg={7} md={9} sm={8} xs={12}></Grid>
              </Grid>
            </form>
          )}
          {showOrgExistBox && (
            <form className={classes.form}>
              <Typography className={classes.title} variant="h2">
                {t("verifyCompanyame")}
              </Typography>

              <div style={{ textAlign: "center" }}>
                <img
                  alt="HR Matrix"
                  src={mail}
                  Component=""
                  style={{ width: "60px" }}
                />
              </div>

              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: "10px" }}
              >
                {t("companyExists")}
              </Typography>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("contactAdmin")}
              </Typography>
              <hr></hr>
              <Grid container>
                <Grid item lg={5} md={3} sm={4} xs={12}></Grid>
                <Grid item lg={7} md={9} sm={8} xs={12}></Grid>
              </Grid>
            </form>
          )}
        </div>
      </Slide>
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
