import React, { useState, useEffect } from "react";
import { Container, withStyles, CircularProgress } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Dashboard as DashboardLayout } from "layouts";
import { Tracker, TrackerBar, NoData } from "../Dashboard/components";
import styles from "../Dashboard/style";
import { useTranslation } from "react-i18next";

import {
  isRoleAdmin,
  isRoleHM,
  isRoleRecruiter,
  isRoleTA,
  isTypeEmployer,
} from "util/roleUtil";
import { Roles, Types } from "util/enum";

/*******ACTIONS STARTS/*******/

import { getJobsbyEmployer } from "services/jobPost/action";
import { clearJobPost } from "services/jobPost/action";
import { clearJobApplication } from "services/jobApplication/action";

/*******ACTIONS ENDS/*******/

const TestSearch = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const { roles } = props.profile;

  const initialState = {
    loading: true,
    rowsPerPage: 10,
    page: 0,
    isFirstLoad: true,
  };

  const [loading, setLoading] = useState(initialState.loading);
  const [jobList, setJobList] = useState(initialState.jobList);
  const [role, setRole] = useState();
  const [type, setType] = useState(props.profile.type);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [page, setPage] = useState(initialState.page);
  const [isFirstLoad, setFirstLoad] = useState(initialState.isFirstLoad);

  const userId = props.profile.id;

  useEffect(() => {
    let role;
    if (isRoleTA(roles)) {
      role = Roles.TalentAcquisitionTeam;
    } else if (isRoleHM(roles)) {
      role = Roles.HiringManager;
    } else if (isRoleRecruiter(roles)) {
      role = Roles.Recruiter;
    } else if (isRoleAdmin(roles)) {
      role = Roles.Admin;
    }

    if (isTypeEmployer(type)) {
      setType(Types.Employer);
    }
    setRole(role);

    props.clearJobPost();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (props.jobList) {
      setLoading(false);
      setJobList(props.jobList);
    }
  }, [props.jobList]);

  const handleChangePage = (rowsPerPage, page) => {
    setRowsPerPage(rowsPerPage);
    setPage(page);
    props.getJobsbyEmployer(userId, role, rowsPerPage, page);
  };

  const handleChangeFilter = (sortKey, searchKey, searchValue) => {
    props.getJobsbyEmployer(
      userId,
      role,
      rowsPerPage,
      page,
      sortKey,
      searchKey,
      searchValue
    );
  };

  const handleClearJobApplication = () => {
    props.clearJobApplication();
  };

  const renderJobs = () => {
    if (loading) {
      return (
        <div
          className={classes.progressWrapper}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: 30,
          }}
        >
          <CircularProgress style={{ height: 30, width: 30 }} />
        </div>
      );
    }

    if (jobList.data.length === 0 && isFirstLoad) {
      return <NoData role={role} />;
    }

    return (
      <div>
        <TrackerBar role={role} isSearch={true} onChange={handleChangeFilter} />
        <Tracker
          onChange={handleChangePage}
          jobList={jobList}
          role={role}
          type={type}
          clearJobApplication={handleClearJobApplication}
          isSearch={true}
        />
      </div>
    );
  };

  return (
    <DashboardLayout title={t("dashboard")}>
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        {/* <Summary />
          <Analytics /> */}

        {renderJobs()}
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobsbyEmployer: getJobsbyEmployer,
  clearJobPost: clearJobPost,
  clearJobApplication: clearJobApplication,
};

const mapStateToProps = (state) => ({
  jobList: (state.jobPost && state.jobPost.jobList) || null,
  profile: state.profile,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TestSearch))
);
