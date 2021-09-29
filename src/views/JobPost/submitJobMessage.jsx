import React, { Component } from "react";
import {
  Container,
  withStyles,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { Dashboard as DashboardLayout } from "layouts";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isRoleTA } from "util/roleUtil";
import { checkOrgHasTA } from "services/jobPost/action";
import styles from "./submitJobStyle";
import transImg from "assets/images/trans_img_01.png";

class ReviewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount = async () => {
    if (this.props.profile.roles && isRoleTA(this.props.profile.roles)) {
      const status = this.props.match.params && this.props.match.params.status;
      this.setState({ isRoleTA: false, status: status, loading: false });
    } else {
      const res = await this.props.checkOrgHasTA();
      if (res) {
        this.setState({ hasTA: true, loading: false });
      } else {
        this.setState({ loading: false });
      }
    }
  };

  inviteRecruiter = () => {
    const jobPostId =
      this.props.match.params && this.props.match.params.jobPostId;
    if (jobPostId > 0) {
      this.props.history.push({
        pathname: "/rc/invite-recruiter/" + jobPostId,
      });
    }
  };

  render() {
    const { classes, t } = this.props;

    return (
      <DashboardLayout title={t("dashboard")}>
        <Container className={classes.root}>
          <div className={classes.root}>
            <Grid
              container
              spacing={3}
              xs={12}
              style={{ margin: "0" }}
              className={classes.reviewItemWrap}
            >
              <Grid
                item
                xs={12}
                md={4}
                lg={4}
                style={{
                  background:
                    "linear-gradient(90.01deg, #60CE8C 1.57%, #48BDAF 96.56%), #48BDAF",
                  borderRadius: "5px 0 0 5px",
                }}
              >
                <img
                  alt="HR Matrix"
                  src={transImg}
                  Component=""
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <div className={classes.valCntWrap}>
                  <Typography variant="h2" className={classes.ValTitle}>
                    {t("thankyou")}
                  </Typography>
                  {this.state.loading ? (
                    <CircularProgress></CircularProgress>
                  ) : (
                    <Grid item xs={12}>
                      <div
                        style={{
                          padding: "10px",
                          fontFamily: "Roboto",
                        }}
                      >
                        {this.state.isRoleTA ? (
                          this.state.status === "3" ? (
                            <div>
                              <Typography
                                variant="p"
                                className={classes.ValParagraph}
                              >
                                The job is now active. Do you want to send this
                                job to agencies?
                              </Typography>
                              <Grid
                                spacing={3}
                                item
                                container
                                className={classes.buttonBar}
                              >
                                <Link
                                  to="/rc/dashboard"
                                  className={classes.Button}
                                  style={{ marginRight: 10 }}
                                >
                                  <Button variant="contained" size="small">
                                    {t("jobPost:notNow")}
                                  </Button>
                                </Link>
                                <Button
                                  autoCapitalize="false"
                                  variant="contained"
                                  size="small"
                                  color="secondary"
                                  onClick={() => {
                                    this.inviteRecruiter();
                                  }}
                                >
                                  {t("common:yes")}
                                </Button>
                              </Grid>
                            </div>
                          ) : (
                            <div>
                              <Typography
                                variant="p"
                                className={classes.ValParagraph}
                              >
                                {t("jobPost:jobActiveAlert")}
                              </Typography>
                              <Grid
                                spacing={3}
                                item
                                container
                                className={classes.buttonBar}
                              >
                                <Link
                                  to="/rc/dashboard"
                                  className={classes.Button}
                                  style={{ marginRight: 10 }}
                                >
                                  <Button
                                    variant="contained"
                                    size="small"
                                    color="secondary"
                                  >
                                    {t("jobPost:okGotIt")}
                                  </Button>
                                </Link>
                              </Grid>
                            </div>
                          )
                        ) : this.state.hasTA ? (
                          <div>
                            <Typography
                              variant="p"
                              className={classes.ValParagraph}
                            >
                              {t("jobPost:jobSubmitTAReviewAlert")}
                            </Typography>
                            <Grid
                              spacing={3}
                              item
                              container
                              className={classes.buttonBar}
                            >
                              <Link
                                to="/rc/dashboard"
                                className={classes.Button}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="secondary"
                                >
                                  {t("common:ok")}
                                </Button>
                              </Link>
                            </Grid>
                          </div>
                        ) : (
                          <div>
                            <Typography
                              variant="p"
                              className={classes.ValParagraph}
                            >
                              {t("jobPost:jobSubmitAlert")}
                            </Typography>
                            <Grid
                              spacing={3}
                              item
                              container
                              className={classes.buttonBar}
                            >
                              <Link
                                to="/rc/dashboard"
                                className={classes.Button}
                                style={{ marginRight: 10 }}
                              >
                                <Button variant="contained" size="small">
                                  {t("jobPost:notNow")}
                                </Button>
                              </Link>
                              <Button
                                autoCapitalize="false"
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  this.inviteRecruiter();
                                }}
                              >
                                {t("common:yes")}
                              </Button>
                            </Grid>
                          </div>
                        )}
                      </div>
                    </Grid>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </DashboardLayout>
    );
  }
}

const mapDispatchToProps = {
  checkOrgHasTA: checkOrgHasTA,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withTranslation(["common", "jobPost"])(ReviewDetail)));
