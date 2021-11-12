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
import { Tracker, TrackerBar, NoData } from "views/Dashboard/components";
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
  getJobsByAttention,
} from "services/jobPost/action";
import { clearJobApplication } from "services/jobApplication/action";

/*******ACTIONS ENDS/*******/

const JobsneedAttention = (props) => {
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
  const [needAttentionJobsList, setNeedAttentionJobsList] = useState(
    initialState.needAttentionJobsList
  );
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
      props.getJobsByAttention(id, role, true);
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
      props.getJobsByAttention(orgId, userrole, true);
    }

    props.clearJobPost();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (
      props.needAttentionJobsList &&
      props.needAttentionJobsList.length === 0
    ) {
      setLoading(false);
    }
    if (
      props.needAttentionJobsList &&
      props.needAttentionJobsList.data &&
      props.needAttentionJobsList.data.length
    ) {
      setLoading(false);
      setNeedAttentionJobsList(props.needAttentionJobsList);
    }
  }, [props.needAttentionJobsList]);

  useEffect(() => {
    if (props.jobSummary) {
      setSummaryLoading(false);
      setSummary(props.jobSummary);
    }
  }, [props.jobSummary]);

  const handleChangePage = (rowsPerPage, page) => {
    setRowsPerPage(rowsPerPage);
    setPage(page);
    props.getJobsByAttention(userId, role, true);
  };

  const handleChangeFilter = (sortKey, searchKey, searchValue) => {
    if (searchValue && searchValue !== "") {
      setisSearchVal(true);
    }
    props.getJobsByAttention(userId, role, true);
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

    if (!needAttentionJobsList) {
      return (
        <div>
          <TrackerBar role={role} type={type} onChange={handleChangeFilter} />
          <Typography style={{ margin: 30 }}>No Data Found</Typography>
        </div>
      );
    }

    return (
      <div>
        <TrackerBar role={role} type={type} onChange={handleChangeFilter} />
        <Tracker
          onChange={handleChangePage}
          jobList={needAttentionJobsList}
          role={role}
          type={type}
          userId={userId}
          isOpenJob={false}
          clearJobApplication={handleClearJobApplication}
          showPagination={false}
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
  getJobsByAttention: getJobsByAttention,
};

const mapStateToProps = (state) => ({
  needAttentionJobsList:
    (state.jobPost && state.jobPost.needattentionjobList) || null,
  profile: state.profile,
  jobSummary: state.jobPost && state.jobPost.summary,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(JobsneedAttention))
);
