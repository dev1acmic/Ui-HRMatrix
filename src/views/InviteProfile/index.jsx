import React, { useEffect } from "react";
import {
  Container,
  withStyles,
  Grid,
  Table,
  TableCell,
  TableRow,
  Divider,
  Typography,
  Button,
  Modal,
} from "@material-ui/core";
import {
  AccountCircleOutlined,
  AssignmentIndOutlined,
  FlagOutlined,
  PlaceOutlined,
  CalendarTodayOutlined,
  PersonAddOutlined,
} from "@material-ui/icons";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dashboard as DashboardLayout } from "layouts";
import moment from "moment";
import { useTranslation } from "react-i18next";

import styles from "../JobPost/components/styles";
import { Invite } from "./components";
import { getJobPost } from "services/jobPost/action";
import { getFullAddress } from "util/helper";
import { AddAgency } from "../Modals";
import { loadRecruiters } from "services/employer/action";

const InviteRecruiter = (props) => {
  const { classes } = props;
  const { t } = useTranslation(["common", "jobPost"]);
  const [values, setValues] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [denied, setDenied] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    if (props.match.params && props.match.params.jobPostId) {
      props.getJobPost(props.match.params.jobPostId);
    }
  }, []);

  useEffect(() => {
    if (props.jobPost) {
      setValues(props.jobPost);
      setLoading(false);
    }
  }, [props.jobPost]);

  useEffect(() => {
    if (props.error) {
      if (props.error && props.error.message === "Access Denied") {
        setDenied(true);
      }
    }
  }, [props.error]);

  const handleOpen = () => {
    setShowModal(true);
    // props.history.push({
    //   pathname: "/rc/manage-agency",
    // });
  };

  const RefreshRecruiters = () => {
    if (props.orgId) {
      props.loadRecruiters(props.orgId);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <DashboardLayout title={t("dashboard")}>
      {!denied && (
        <Container className={classes.root}>
          <Grid container item spacing={2} className={classes.formContainer}>
            <Grid item xs={12} sm={10} md={10}>
              <Typography
                variant="h1"
                className={classes.pageTitle}
                style={{ padding: "0px 10px" }}
              >
                {t("selectAgency")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={2} style={{ textAlign: "right" }}>
              <Button
                autoCapitalize="false"
                variant="contained"
                size="small"
                onClick={handleOpen}
                color="secondary"
              >
                <PersonAddOutlined style={{ marginRight: 5 }} />
                {t("addAgency")}
              </Button>
            </Grid>
          </Grid>
          <Table className={classes.reviewItemWrap}>
            <TableRow>
              <TableCell className={classes.reviewCol} align="center">
                <AccountCircleOutlined
                  color="secondary"
                  className={classes.reviewIcon}
                />
                <div>
                  <Typography
                    variant="body1"
                    className={classes.RecreviewLabel}
                  >
                    {t("jobPost:createdby")}
                  </Typography>
                  <Typography variant="h2" className={classes.RecreviewTitle}>
                    {values.user && values.user.fname + " " + values.user.lname}
                  </Typography>
                </div>
                <Divider className={classes.dividerVer} />
              </TableCell>
              <TableCell className={classes.reviewCol} align="center">
                <FlagOutlined
                  color="secondary"
                  className={classes.reviewIcon}
                />
                <div>
                  <Typography
                    variant="body1"
                    className={classes.RecreviewLabel}
                  >
                    {t("jobID")}
                  </Typography>
                  <Typography variant="h2" className={classes.RecreviewTitle}>
                    {values.uniqueId}
                  </Typography>
                </div>
                <Divider className={classes.dividerVer} />
              </TableCell>
              <TableCell className={classes.reviewCol} align="center">
                <AssignmentIndOutlined
                  color="secondary"
                  className={classes.reviewIcon}
                />
                <div>
                  <Typography
                    variant="body1"
                    className={classes.RecreviewLabel}
                  >
                    {t("jobTitle")}
                  </Typography>
                  <Typography variant="h2" className={classes.RecreviewTitle}>
                    {values.title}
                  </Typography>
                </div>
                <Divider className={classes.dividerVer} />
              </TableCell>
              <TableCell className={classes.reviewCol} align="center">
                <PlaceOutlined
                  color="secondary"
                  className={classes.reviewIcon}
                />
                <div>
                  <Typography
                    variant="body1"
                    className={classes.RecreviewLabel}
                  >
                    {t("location")}
                  </Typography>
                  <Typography variant="h2" className={classes.RecreviewTitle}>
                    {values.addresses && values.addresses[0]
                      ? getFullAddress(values.addresses[0])
                      : "Not selected"}
                  </Typography>
                </div>
                <Divider className={classes.dividerVer} />
              </TableCell>

              <TableCell className={classes.reviewCol} align="center">
                <CalendarTodayOutlined
                  color="secondary"
                  className={classes.reviewIcon}
                />
                <div>
                  <Typography
                    variant="body1"
                    className={classes.RecreviewLabel}
                  >
                    {t("posted")}
                  </Typography>
                  <Typography variant="h2" className={classes.RecreviewTitle}>
                    {moment(values.createdAt).format("Do MMM YYYY")}
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          </Table>
          <Invite />
          <Modal
            style={
              {
                // position: "absolute",
                // top: "20%",
                // left: "0"
                //overflowY: "scroll",
                // height: "100%"
                //display: "block"
              }
            }
            open={showModal}
            onClose={() => handleClose()}
          >
            <AddAgency
              onCancel={() => handleClose()}
              refreshList={() => RefreshRecruiters()}
            />
          </Modal>
        </Container>
      )}
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobPost: getJobPost,
  loadRecruiters,
};

const mapStateToProps = (state) => ({
  jobPost: (state.jobPost && state.jobPost.data) || null,
  error: state.error,
  orgId: state.profile && state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(InviteRecruiter))
);
