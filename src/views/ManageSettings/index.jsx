import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  withStyles,
  Grid,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import { PersonOutlined } from "@material-ui/icons";
import styles from "../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { Subscription } from "./components";
import { loadStripe } from "@stripe/stripe-js";
import { loadOrganization } from "services/organization/action";

const ManageSettings = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

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
            <Box display="flex" width="100%">
              <Box flexGrow={1}>
                <Typography
                  variant="h3"
                  className={classes.reviewTitle}
                  style={{ padding: "20px 0px 0 22px" }}
                >
                  <PersonOutlined
                    color="secondary"
                    className={classes.titleIcon}
                  />
                  {t("paymentSubscription")}
                </Typography>
              </Box>
              <Box
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  margin: "20px 20px 10px 0",
                }}
              ></Box>
            </Box>
            <div style={{ width: "100%" }}>
              <Subscription stripePromise={stripePromise} />
            </div>
          </Grid>
        </div>
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = { loadOrganization };

const mapStateToProps = (state) => ({
  users: (state.admin && state.admin.users) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ManageSettings))
);
