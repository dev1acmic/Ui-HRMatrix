import React, { useState, useEffect } from "react";
import {
  Container,
  withStyles,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dashboard as DashboardLayout } from "layouts";
import { Tracker, TrackerBar } from "views/Dashboard/components";
import styles from "layouts/Dashboard/styles";
import {
  isRoleAdmin,
  isRoleHM,
  isRoleInterviewer,
  isRoleRecruiter,
  isRoleTA,
  isTypeEmployer,
  isRoleAgencyAdmin,
  isTypeRecruiter,
} from "util/roleUtil";
import { Roles, Types } from "util/enum";

/*******ACTIONS STARTS/*******/

import {
  getJobsbyEmployer,
  clearJobPost,
  getJobsSummary,
} from "services/jobPost/action";
import { clearJobApplication } from "services/jobApplication/action";

/*******ACTIONS ENDS/*******/

const OpenJobs = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const { roles, orgId } = props.profile;

  const initialState = {
    loading: true,
    summaryloading: true,
    rowsPerPage: 10,
    page: 0,
    isSearchVal: false,
    summary: null,
  };

  const [loading, setLoading] = useState(initialState.loading);
  const [summaryloading, setSummaryLoading] = useState(
    initialState.summaryloading
  );
  const [openJobsList, setOpenJobsList] = useState(initialState.openJobsList);
  const [role, setRole] = useState();
  const [type, setType] = useState(props.profile.type);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [page, setPage] = useState(initialState.page);
  const [isFirstLoad, setFirstLoad] = useState(initialState.isFirstLoad);
  const [isSearchVal, setisSearchVal] = useState(initialState.isSearchVal);
  const [summary, setSummary] = useState(initialState.summary);

  const userId = props.profile.id;

  const getJobsbyEmployer = (id, role) => {
    try {
      props.getJobsbyEmployer(id, role, rowsPerPage, page, "", "", "", true);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    let userrole = null;
    if (isRoleTA(roles)) {
      userrole = Roles.TalentAcquisitionTeam;
    } else if (isRoleHM(roles)) {
      userrole = Roles.HiringManager;
    } else if (isRoleInterviewer(roles)) {
      userrole = Roles.InterviewPanel;
    } else if (isRoleRecruiter(roles)) {
      userrole = Roles.Recruiter;
    } else if (isRoleAdmin(roles)) {
      userrole = Roles.Admin;
    } else if (isRoleAgencyAdmin(roles)) {
      userrole = Roles.AgencyAdmin;
    }

    if (isTypeEmployer(type)) {
      setType(Types.Employer);
    } else if (isTypeRecruiter(type)) {
      setType(Types.Recruiter);
    }
    getJobsbyEmployer(userId, userrole, rowsPerPage, page, "", "", "", true);
    setRole(userrole);
    if (orgId) {
      props.getJobsSummary(orgId, userrole);
    }

    props.clearJobPost();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (props.openJobsList) {
      setLoading(false);
      setOpenJobsList(props.openJobsList);
    }
  }, [props.openJobsList]);

  useEffect(() => {
    if (props.jobSummary) {
      setSummaryLoading(false);
      setSummary(props.jobSummary);
    }
  }, [props.jobSummary]);

  const handleChangePage = (rowsPerPage, page) => {
    setRowsPerPage(rowsPerPage);
    setPage(page);
    props.getJobsbyEmployer(userId, role, rowsPerPage, page, "", "", "", true);
  };

  const handleChangeFilter = (sortKey, searchKey, searchValue) => {
    if (searchValue && searchValue !== "") {
      setisSearchVal(true);
    }
    props.getJobsbyEmployer(
      userId,
      role,
      rowsPerPage,
      page,
      sortKey,
      searchKey,
      searchValue,
      true
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

    if (
      openJobsList &&
      openJobsList.data &&
      openJobsList.data.length === 0 &&
      !isSearchVal
    ) {
      return (
        <div>
          <TrackerBar role={role} type={type} onChange={handleChangeFilter} />
          <Typography style={{ margin: 30 }}>
            {t("common:nodatafound")}
          </Typography>
        </div>
      );
    }

    return (
      <div>
        <TrackerBar role={role} type={type} onChange={handleChangeFilter} />
        <Tracker
          onChange={handleChangePage}
          jobList={openJobsList}
          role={role}
          type={type}
          userId={userId}
          isOpenJob={true}
          clearJobApplication={handleClearJobApplication}
        />
      </div>
    );
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        {renderJobs()}
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobsbyEmployer: getJobsbyEmployer,
  clearJobPost: clearJobPost,
  clearJobApplication: clearJobApplication,
  getJobsSummary: getJobsSummary,
};

const mapStateToProps = (state) => ({
  openJobsList: (state.jobPost && state.jobPost.openjobList) || null,
  profile: state.profile,
  jobSummary: state.jobPost && state.jobPost.summary,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OpenJobs))
);
