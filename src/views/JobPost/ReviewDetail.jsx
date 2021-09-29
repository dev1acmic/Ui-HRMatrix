import React, { useEffect, useState } from "react";
import {
  Container,
  withStyles,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";

import { Roles } from "util/enum";
import { InfoOutlined } from "@material-ui/icons";
import { clearJobApplication } from "services/jobApplication/action";
import { fromPreferredPremium } from "services/jobPost/action";
import styles from "./components/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { RecView } from "./components";
import { loadOrganization } from "services/organization/action";
import share from "common/share";
import { withTranslation } from "react-i18next";

const ReviewDetail = (props) => {
  const { classes, t } = props;
  const [jobpostId, setJobpostId] = React.useState();
  const [isPrefPrem, setIsPrefPrem] = React.useState();
  const [isStripeAdded, setIsStripeAdded] = useState(false);
  const [palert, setPalert] = useState(false);

  useEffect(() => {
    if (props.match.params && props.match.params.jobPostId) {
      setJobpostId(props.match.params.jobPostId);
    }
  }, []);

  useEffect(() => {
    if (props.organization) {
      let isSubscribed = share.checkStripeTrialExist(props.organization);
      setIsStripeAdded(isSubscribed);
    }
  }, [props.organization]);

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  useEffect(() => {
    if (props.jobPost) {
      async function fetchDetails() {
        const isPreferedPremiumAgency = await props.fromPreferredPremium(
          props.profileId,
          props.jobPost.user.organization.id
        );
        setIsPrefPrem(isPreferedPremiumAgency);
      }
      fetchDetails();
    }
  }, [props.jobPost]);

  const openPremiumAlert = () => {
    setPalert(true);
  };

  const handleClose = () => {
    setPalert(false);
  };

  const jobApplication = () => {
    props.clearJobApplication();
    props.history.push({
      pathname: "/rc/job-application",
      state: { jobpostId: jobpostId },
    });
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container className={classes.root} style={{ position: "relative" }}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.pageTitle}>
              {t("common:jobDetails")}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              position: "sticky",
              top: 52,
              display: "flex",
              zIndex: 99,
              width: "100%",
              padding: "10px",
            }}
          >
            <div
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#e0e0e0",
                padding: "10px",
                fontFamily: "Roboto",
                backgroundColor: "#efefef",
                width: "100%",
              }}
            >
              <Typography
                variant="p"
                style={{
                  marginRight: "10px",
                  position: "relative",
                  paddingLeft: "50px",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                <InfoOutlined
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "-10px",
                    margin: 0,
                  }}
                  color="secondary"
                  className={classes.reviewIcon}
                />
                {t("reviewJobrequirementAndStartAddingCandidates")}
              </Typography>

              <Button
                autoCapitalize="false"
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => {
                  isPrefPrem
                    ? jobApplication()
                    : isStripeAdded
                    ? jobApplication()
                    : openPremiumAlert();
                }}
              >
                {t("addprofile")}
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12} style={{ marginTop: "20px" }}>
            <RecView />
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={palert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Unlock Premium"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                {props.role === Roles.Recruiter
                  ? t("common:errMsg.noActiveSubscription")
                  : t("common:errMsg.subscribeAlert")}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  clearJobApplication: clearJobApplication,
  fromPreferredPremium,
  loadOrganization,
};

const mapStateToProps = (state) => ({
  organization: state.organization,
  jobPost: (state.jobPost && state.jobPost.data) || null,
  profileId: state.profile && state.profile.id,
  orgId: state.profile && state.profile.orgId,
  roles: state.profile && state.profile.roles && state.profile.roles[0],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation(["jobPost", "common"])(ReviewDetail)))
);
