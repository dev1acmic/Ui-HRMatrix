import React, { Component } from "react";

import { withStyles } from "@material-ui/core";
import {
  Grid,
  CssBaseline,
  Container,
  Typography,
  Button,
} from "@material-ui/core";
import styles from "./styles";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import Header from "./components/header";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import AgencySignup from "./components/signUp/Agency";
import { verifyUser, sendApproval } from "services/user/action";
import { removeError } from "services/error/action";
import { withTranslation } from "react-i18next";

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      showLogin: true,
      showAgencySignup: false,
      showEmpSignup: false,
      showSendApproval: false,
      showAlert: false,
      oid: 0,
      uid: 0,
    };
  }

  componentDidMount = async () => {
    const token = this.props.match.params.token;
    const agency = this.props.match.params.agency;
    if (token) {
      // const user = await this.props.getUserByToken(token);
      // const action = await this.props.userAction(user);
      const res = await this.props.verifyUser(token);
      if (res.sendtoApproval) {
        this.setState({
          showSendApproval: true,
          oid: res.oid,
          uid: res.uid,
          showLogin: false,
        });
      }

      if (agency && !res.sendtoApproval) {
        this.handleAgencySignup(res);
      }
    }
  };
  handleSubmit = async () => {
    const res = await this.props.sendApproval(this.state.oid, this.state.uid);
    if (res) {
      this.setState({ showSendApproval: false, showAlert: true });
    }
  };
  handleSignin = () => {
    removeError();
    this.setState({
      showLogin: true,
      showAgencySignup: false,
      showEmpSignup: false,
    });
  };
  handleEmpSignup = () => {
    removeError();
    this.setState({
      showLogin: false,
      showAgencySignup: false,
      showEmpSignup: true,
    });
  };
  handleAgencySignup = (user = null) => {
    removeError();
    this.setState({
      showLogin: false,
      showEmpSignup: false,
      showAgencySignup: true,
      user: user,
    });
  };
  render() {
    const { classes, t, i18n } = this.props;
    return (
      <CssBaseline>
        <div className={classes.root}>
          <Container className={classes.container} fixed maxWidth="xl">
            <Grid className={classes.grid} container>
              <Header
                handleSignin={this.handleSignin}
                handleEmpSignup={this.handleEmpSignup}
                handleAgencySignup={this.handleAgencySignup}
                showLogin={!this.state.showLogin}
              />

              <Grid className={classes.quoteWrapper} item md={7}>
                <div
                  className={classes.quote}
                  style={{
                    backgroundImage: `url(${require(`assets/images/img-signin_${i18n.language}.png`).default})`,
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
                    {this.state.showLogin ? (
                      <SignIn handler={this.handleEmpSignup} />
                    ) : this.state.showEmpSignup ? (
                      <SignUp handler={this.handleSignin} />
                    ) : this.state.showSendApproval ? (
                      <div>
                        <form className={classes.form}>
                          <Typography className={classes.title} variant="h2">
                            {t("Send Approval")}
                          </Typography>
                          <Typography
                            className={classes.sugestion}
                            variant="body1"
                          >
                            {t("approvalAlert")}
                          </Typography>

                          <Grid container>
                            <Grid
                              item
                              lg={7}
                              md={9}
                              sm={8}
                              xs={12}
                              style={{ marginLeft: "65px" }}
                            >
                              <Button
                                className={classes.signInButton}
                                color="primary"
                                size="large"
                                onClick={() => {
                                  this.handleSubmit();
                                }}
                                variant="contained"
                              >
                                Send Approval
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    ) : this.state.showAlert ? (
                      <div>{t("thankyou")}</div>
                    ) : (
                      <AgencySignup
                        handler={this.handleSignin}
                        user={this.state.user}
                      />
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </CssBaseline>
    );
  }
}

const mapDispatchToProps = {
  verifyUser,
  sendApproval,
};

const mapStateToProps = (state) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(Auth)))
);
