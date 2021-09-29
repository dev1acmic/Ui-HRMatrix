import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import validate from "validate.js";
import _ from "underscore";
import {
  withStyles,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Zoom,
} from "@material-ui/core";
import styles from "../../styles";
import schema from "./schema";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

//Actions
import { forgotPassword } from "services/user/action";
import ResendActivation from "../resendActivation";
import { removeError } from "services/error/action";
import mail from "assets/images/cmail.png";
class ForgotPassword extends Component {
  state = {
    values: {
      email: "",
    },
    errors: {
      email: null,
    },
    isValid: false,
    isLoading: false,
    showMailBox: false,
    showResend: false,
  };
  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
    return newState.isValid;
  }, 300);
  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  showResendActivation = () => {
    this.setState({ showResend: !this.state.showResend });
  };

  handleSubmit = async () => {
    if (this.validateForm()) {
      const { values } = this.state;

      this.setState({ isLoading: true });
      let loginStatus = { isVerified: true };
      this.props.forgotPassword(values.email, loginStatus).then((status) => {
        this.setState({ isLoading: false });
        if (status) {
          this.setState({ showMailBox: true });
        }
        if (!loginStatus.isVerified) {
          this.showResendActivation();
        }
      });
    }
  };
  render() {
    const { classes, t } = this.props;
    const { values, errors, isLoading, showMailBox, showResend } = this.state;
    return (
      <Zoom in="true" timeout="10">
        <div style={{ position: "relative" }}>
          {showResend ? (
            <ResendActivation
              showResendActivation={this.showResendActivation}
            />
          ) : (
            !showMailBox && (
              <div>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    {t("forgotpassword")}
                  </Typography>
                  <Typography className={classes.sugestion} variant="body1">
                    {t("createdHTemail")}
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      error={getMsg(errors.email, t)}
                      value={values.email}
                      className={classes.textField}
                      onChange={(event) =>
                        this.handleFieldChange("email", event.target.value)
                      }
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
                      type="email"
                      variant="outlined"
                      autoComplete="off"
                    />
                  </div>
                  <Grid container>
                    <Grid item lg={5} md={3} sm={4} xs={12}>
                      <Typography className={classes.forgot}>
                        <Link
                          to="#"
                          onClick={this.props.showForgotPwd}
                          className={classes.forgotTxt}
                          variant="contained"
                        >
                          {t("backtologin")}
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item lg={7} md={9} sm={8} xs={12}>
                      {isLoading ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        <Button
                          className={classes.signInButton}
                          color="primary"
                          size="large"
                          onClick={this.handleSubmit}
                          variant="contained"
                        >
                          {t("requestpswd")}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </div>
            )
          )}
          {showMailBox && (
            <div
              style={{
                tflex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <Typography className={classes.title} variant="h2">
                {t("common:resetyourpassword")}
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
                {t("common:securityconfirmationemail")}
                {"\n"}
                <b>{values.email}</b>
              </Typography>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("common:checkmailbox")}
              </Typography>
              <hr></hr>
              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  marginTop: 10,
                  fontWeight: "bold",
                }}
              >
                {t("common:havingproblems")}
              </Typography>

              <Typography
                className={classes.sugestion}
                variant="body1"
                style={{ textAlign: "center", marginBottom: 10 }}
              >
                {t("common:didnotreceivepasswordrecoveryemail")}
              </Typography>
              <Grid container>
                <Grid item lg={5} md={3} sm={4} xs={12}></Grid>
                <Grid item lg={7} md={9} sm={8} xs={12}></Grid>
              </Grid>
            </div>
          )}
        </div>
      </Zoom>
    );
  }
}

const mapDispatchToProps = {
  forgotPassword,
  removeError,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ForgotPassword)))
);
