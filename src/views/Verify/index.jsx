import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
// Material components
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import { withTranslation, Trans } from "react-i18next";

import { verifyUser } from "services/user/action";
import ResetPassword from "./components/ResetPassword";

import hrLogo from "assets/images/logo-hMatrix.png";
import verify from "assets/images/verify.png";
//import { Link } from "react-router-dom";
const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 4,
  },
  content: {
    marginTop: "150px",
    textAlign: "center",
  },
  image: {
    display: "inline-block",
    marginTop: "50px",
    maxWidth: "100%",
    width: "554px",
  },
});

class Verify extends Component {
  constructor() {
    super();
    this.state = {
      uid: 0,
      showResetPassword: false,
      isReset: false,
      expired: false,
    };
  }

  componentDidMount = async () => {
    const token = this.props.match.params.token;
    const reset = this.props.match.params.reset;
    if (token) {
      const res = await this.props.verifyUser(token);
      if (reset) {
        this.setState({
          hideLoading: true,
          uid: res.uid,
          isReset: true,
        });
      }
      if (!res && reset) {
        this.setState({
          hideLoading: true,
          uid: res.uid,
          isReset: true,
          expired: true,
        });
      } else {
        this.setState({
          hideLoading: true,
        });
        if (!res) {
          this.setState({
            expired: true,
          });
        }
        //this.props.history.push("/sign-in");
      }
    }
  };

  redirectAction = () => {
    if (this.state.isReset) {
      this.setState({
        showResetPassword: true,
      });
    } else {
      this.props.history.push("/sign-in");
    }
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.root} style={{ overflow: "auto" }}>
        {!this.state.hideLoading ? (
          <Grid container justify="center" spacing={4}>
            <Grid item lg={6} xs={12}>
              <div className={classes.content}>
                <div>
                  <Typography variant="h2">
                    {t("verifyemailpleasewait")}
                  </Typography>
                  <CircularProgress className={classes.progress} />
                </div>
              </div>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={3}
            xs={12}
            style={{ width: "80%", margin: "6% auto 0" }}
            className={classes.reviewItemWrap}
          >
            <Grid item spacing={2} xs={12} md={3} lg={3}></Grid>
            <Grid item spacing={2} xs={12} md={6} lg={6}>
              <img
                alt="HR Matrix"
                src={hrLogo}
                Component=""
                style={{
                  textAlign: "center",
                  width: "200px",
                  margin: "0 auto",
                  display: "block",
                }}
              />
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "55px",
                  textAlign: "center",
                  boxShadow: "0 0 12px -4px #89b7ce",
                  marginTop: "20px",
                }}
              >
                <img
                  alt="HR Matrix"
                  src={verify}
                  Component=""
                  style={{
                    width: "100px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                {!this.state.expired ? (
                  <Typography
                    variant="p"
                    style={{
                      fontFamily: "Montserrat",
                      lineHeight: "27px",
                      fontSize: "18px",
                    }}
                  >
                    {t("succMsg.useractivationsuccess")}
                  </Typography>
                ) : (
                  <Typography
                    variant="p"
                    style={{
                      fontFamily: "Montserrat",
                      lineHeight: "27px",
                      fontSize: "18px",
                    }}
                  >
                    {t("activationlinkexpired")}
                  </Typography>
                )}
                <br></br>
                {!this.state.expired &&  <Grid item xs={12} md={12} style={{ padding: "0" }}>
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
                    {this.state.isReset
                      ? t("verifyresetpassword")
                      : t("verifycontinuetologin")}
                  </Button>
                </Grid> }
              </div>
            </Grid>
            <Grid item spacing={2} xs={12} md={3} lg={3}></Grid>
          </Grid>
        )}
        {this.state.showResetPassword && <ResetPassword uid={this.state.uid} />}
      </div>
    );
  }
}

Verify.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  verifyUser,
};

const mapStateToProps = (state) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(Verify)))
);
