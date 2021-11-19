import React, { useState, useEffect } from "react";
import { Container, withStyles, Grid, Typography } from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";

import styles from "../JobPost/components/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { RecView } from "./components";
import { useTranslation } from "react-i18next";

import { getJobApplicationsById } from "services/jobApplication/action";

const ReviewDetail = (props) => {
  const { t } = useTranslation(["jobApplication", "common"]);
  const { classes } = props;
  let [jobAppId, setjobAppId] = useState(null);

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location &&
      props.location.state.jobAppId
    ) {
      setjobAppId(props.location.state.jobAppId);
    }
  }, [props.location.state]);

  useEffect(() => {
    if (jobAppId) {
      props.getJobApplicationsById(jobAppId);
    }
  }, [jobAppId]);

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container className={classes.root} style={{ position: "relative" }}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.pageTitle}>
              {t("common:reviewDetails")}
            </Typography>
          </Grid>

          {/* <Grid item xs={12}>
              <div
                style={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  padding: "10px",
                  fontFamily: "Roboto"
                }}
              >
                <Typography variant="p" style={{ marginRight: "10px" }}>
                  Please review the job requirement details before publishing.
                  Once published the job details will be visible to the job
                  seekers.
                </Typography>
                <Button
                  autoCapitalize="false"
                  variant="contained"
                  size="small"
                  color="secondary"
                >
                  Add New Job
                </Button>
              </div>
            </Grid> */}
        </Grid>

        <Grid style={{ marginTop: "20px" }}>
          <RecView />
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobApplicationsById: getJobApplicationsById,
};

const mapStateToProps = () => ({});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ReviewDetail))
);
