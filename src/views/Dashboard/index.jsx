import React, { useState, useEffect } from "react";
import { Container, withStyles, CircularProgress } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import { Dashboard as DashboardLayout } from "layouts";
import { Summary, Analytics, Tracker, TrackerBar, NoData } from "./components";
import styles from "./style";

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

const Test = (props) => {
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
  const [jobList, setJobList] = useState(initialState.jobList);
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
      props.getJobsbyEmployer(id, role);
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
    getJobsbyEmployer(userId, userrole);
    setRole(userrole);
    if (orgId) {
      props.getJobsSummary(orgId, userrole);
    }

    props.clearJobPost();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (props.jobList) {
      setLoading(false);
      setJobList(props.jobList);
    }
  }, [props.jobList]);

  useEffect(() => {
    if (props.jobSummary) {
      setSummaryLoading(false);
      setSummary(props.jobSummary);
    }
  }, [props.jobSummary]);

  const handleChangePage = (rowsPerPage, page) => {
    setRowsPerPage(rowsPerPage);
    setPage(page);
    props.getJobsbyEmployer(userId, role, rowsPerPage, page);
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

    if (jobList.data.length === 0 && !isSearchVal) {
      return <NoData role={role} />;
    }

    return (
      <div>
        <TrackerBar role={role} type={type} onChange={handleChangeFilter} />
        <Tracker
          onChange={handleChangePage}
          jobList={jobList}
          role={role}
          type={type}
          userId={userId}
          clearJobApplication={handleClearJobApplication}
        />
      </div>
    );
  };

  const renderSummary = () => {
    if (summaryloading) {
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

    return (
      <div>
        <Summary summary={summary} type={type} jobList={jobList} />
        {role !== Roles.AgencyAdmin && <Analytics summary={summary} />}
      </div>
    );
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        {(role === Roles.Admin ||
          role === Roles.TalentAcquisitionTeam ||
          role === Roles.HiringManager ||
          role === Roles.AgencyAdmin) &&
          renderSummary()}
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
  jobList: (state.jobPost && state.jobPost.jobList) || null,
  profile: state.profile,
  //orgId: state.profile && state.profile.orgId,
  jobSummary: state.jobPost && state.jobPost.summary,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Test))
);
