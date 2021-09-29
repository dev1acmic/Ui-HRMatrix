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
import { resendActivation } from "services/user/action";
import { removeError } from "services/error/action";
import mail from "assets/images/cmail.png";
class ResendActivation extends Component {
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
  handleSubmit = async () => {
    if (this.validateForm()) {
      const { values } = this.state;

      this.setState({ isLoading: true });
      // const token = this.props.match.params.token;
      this.props.resendActivation(values.email).then((status) => {
        this.setState({ isLoading: false });
        if (status) {
          this.setState({ showMailBox: true });
        }
      });
    }
  };
  render() {
    const { classes, t } = this.props;
    const { values, errors, isLoading, showMailBox } = this.state;
    return (
      <Zoom in="true" timeout="10">
        <div style={{ position: "relative" }}>
          {!showMailBox && (
            <div>
              <form className={classes.form}>
                <Typography className={classes.title} variant="h2">
                  {t("resendActivation")}
                </Typography>
                <Typography className={classes.sugestion} variant="body1">
                  {t("enterProvidedEmail")}
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
                        onClick={this.props.showResendActivation}
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
                        {t("resendActivation")}
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
              }}
            >
              <Typography className={classes.title} variant="h2">
                {t("resendActivation")}
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
                {t("common:checkSpamforActivationMail")}
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
  resendActivation,
  removeError,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ResendActivation)))
);
