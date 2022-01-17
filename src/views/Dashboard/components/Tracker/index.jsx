import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
  Avatar,
  IconButton,
  TablePagination,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

/*******UTIL STARTS/*******/

import { getFullAddress } from "util/helper";
import { ProfilePic } from "util/ProfilePic";
import { JobApplicationSelectStatus, JobStatus, Roles, Types } from "util/enum";
import { useTranslation } from "react-i18next";

/*******UTIL ENDS/*******/

import moment from "moment";

import avatarimg from "assets/images/avatar.jpg";
import {
  NavigateBeforeRounded,
  NavigateNextRounded,
  DashboardOutlined,
  PersonAdd,
  Visibility,
  Edit,
  Close,
  FormatListNumberedRtlOutlined,
  TransferWithinAStationOutlined,
} from "@material-ui/icons";
import {
  getJobApplicantsByJobPost,
  getCandidateCountByRecruiterId,
  fromPreferredPremium,
  createJobPost,
  getJobsbyEmployer,
  getJobsSummary,
} from "services/jobPost/action";
import share from "common/share";

import { checkOrgHasTA } from "services/jobPost/action";
import { getFile } from "services/jobApplication/action";
import { loadOrganization } from "services/organization/action";
import styles from "../style";
const Tracker = (props) => {
  const {
    classes,
    role,
    type,
    isSearch,
    userId,
    orgId,
    summary,
    showPagination,
  } = props;
  const { t } = useTranslation(["dashboard", "enum", "common"]);
  const initialState = {
    loading: true,
    rowsPerPage: 10,
    page: 0,
  };
  const applicantsPerRow = 3;
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [page, setPage] = useState(initialState.page);
  const [jobList, setJobList] = useState(props.jobList);
  const [applicantPage, setApplicantPage] = useState(initialState.page);
  const [state, setState] = useState([]);
  const [isStripeAdded, setIsStripeAdded] = useState(false);
  const [isTrialExist, setIsTrialExist] = useState(false);
  const [alert, setAlert] = useState(false);
  const [palert, setPalert] = useState(false);
  const [closealert, setClosealert] = useState(false);
  const [jobId, setJobId] = useState(null);

  const handleChangePage = (event, page) => {
    setPage(page);
    props.onChange(rowsPerPage, page);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = event.target.value;
    setRowsPerPage(rowsPerPage);
    props.onChange(rowsPerPage, page);
  };

  const toJobPost = (id) => {
    props.history.push({
      pathname: "/rc/job-post",
      state: { id: id },
    });
  };

  const toJobPostReview = (id) => {
    props.history.push({
      pathname: "/rc/job-post",
      state: { id: id, review: true },
    });
  };

  const toJobPostEmployerReview = (id) => {
    props.history.push({
      pathname: "/rc/job-post",
      state: { id: id, empReview: true },
    });
  };

  const inviteRecruiter = (jobPostId) => {
    props.history.push({
      pathname: "/rc/invite-recruiter/" + jobPostId,
    });
  };

  const jobApplication = (jobpostId, jobappId = null) => {
    props.clearJobApplication();
    props.history.push({
      pathname: "/rc/job-application",
      state: { jobpostId: jobpostId, jobappId: jobappId },
    });
  };

  const openAlert = () => {
    setAlert(true);
  };

  const openPremiumAlert = () => {
    setPalert(true);
  };

  const handleClose = (isRedirect) => {
    setAlert(false);
    if (isRedirect) {
      props.history.push({
        pathname: "/rc/manage-settings",
      });
    }
  };

  const handleCloseJob = () => {
    setClosealert(false);
  };

  const openCloseAlert = (id) => {
    setJobId(id);
    setClosealert(true);
  };

  const closeJob = () => {
    let data = {};
    data.id = jobId;
    data.status = 6;
    props.createJobPost(data, null).then((res) => {
      if (res) {
        props.getJobsbyEmployer(userId, role);
        props.getJobsSummary(orgId, role);
      }
    });
    setClosealert(false);
  };

  const handlepClose = () => {
    setPalert(false);
  };

  const skillMatrix = (id) => {
    props.history.push({
      pathname: "/rc/matrix/" + id,
    });
  };

  const journey = (id) => {
    props.history.push({
      pathname: "/rc/candidate-journey/" + id,
    });
  };

  const toJobPostReviewPage = (jobPostId) => {
    props.history.push({
      pathname: "/rc/job-review/" + jobPostId,
    });
  };

  const toJobApplReviewPage = (jobAppId) => {
    props.history.push({
      pathname: "/rc/job-application-review",
      state: { jobAppId: jobAppId },
    });
  };

  const candidateRecap = (jobpostId, jobappId) => {
    props.history.push({
      pathname: "/rc/recap/" + jobpostId,
      state: { jobApplId: jobappId },
    });
  };

  const interviewAssessment = (jobappId, level) => {
        props.history.push({
      pathname: "/rc/assessment",
      state: { jobApplId: jobappId,level: level },
      //state: { jobApplId: jobappId,  }
    }); 
  };

  useEffect(() => {
    async function checkTA() {
      if (role === Roles.TalentAcquisitionTeam) {
        setState({ ...state, isRoleTA: true });
      } else {
        const res = await props.checkOrgHasTA();
        if (res) {
          setState({ ...state, hasTA: true });
        } else {
          setState({ ...state, hasTA: false });
        }
      }
    }
    checkTA();
  }, []);

  useEffect(() => {
    if (props.organization && Object.keys(props.organization).length > 0) {
      let hasTrial = share.checkStripeTrialExist(props.organization, true);
      let isStripeAdded = share.checkIsStripeSubscribed(props.organization);
      setIsStripeAdded(isStripeAdded);
      setIsTrialExist(hasTrial);
    }
  }, [props.organization]);

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  const viewProfile = (type, role, job, applicant) => {
    if (type === Types.Recruiter) {
      // if (job.isPreferedPremiumAgency) {
      if (applicant.status < 1) {
        jobApplication(job.id, applicant.id);
      } else {
        toJobApplReviewPage(applicant.id);
      }
      // } else if (isTrialExist || isStripeAdded) {
      //   if (applicant.status < 1) {
      //     jobApplication(job.id, applicant.id);
      //   } else {
      //     toJobApplReviewPage(applicant.id);
      //   }
      // } else {
      //   openAlert();
      // }
    } else if (role === Roles.InterviewPanel) { 
      interviewAssessment(applicant.id, applicant.applicantinterviewers && applicant.applicantinterviewers[0].level);
    } else {
      // if (
      //   share.checkCanidatePremiumMembership(
      //     isTrialExist,
      //     job.stripeUsageViewRecordId,
      //     applicant.isPremiumCandidate
      //   )
      // ) {
      candidateRecap(job.id, applicant.id);
      // } else {
      //   openPremiumAlert();
      // }
    }
  };

  const displayCandidateName = (type, applicant, job) => {
    // if (
    //   type === Types.Recruiter ||
    //   share.checkCanidatePremiumMembership(
    //     isTrialExist,
    //     job.stripeUsageViewRecordId,
    //     applicant.isPremiumCandidate
    //   )
    // ) {
    //   return applicant.fname && applicant.fname + " " + applicant.lname;
    // } else {
    //   return "----";
    // }

    return applicant.fname && applicant.fname + " " + applicant.lname;
    //the candidates submitted by premium agency has been made visible to all as per the new requirement change. if the premium condition needs to apply please uncomment the above.
  };

  useEffect(() => {
    async function fetchApplicants() {
      const jobList = props.jobList;
      const newState = { ...jobList };
      let page = [];
      await Promise.all(
        jobList.data.map(async (item, index) => {
          const res = await getapplicants(item.id, item.status);
          const isPreferedPremiumAgency = await props.fromPreferredPremium(
            props.profileId,
            item.user.organizationId
          );
          newState.data[index].applicants = res.data;
          newState.data[index].applicantCount = res.total;
          newState.data[index].isPreferedPremiumAgency =
            isPreferedPremiumAgency;
          page[item.id] = 0;
          newState.data[index].showCandidJourney = item.shortListedCount > 0;
        })
      );
      setApplicantPage(page);
      setJobList(newState);
    }
    fetchApplicants();
  }, [props.jobList]);

  const handleChangeApplicantPage = async (
    jobpostId,
    index,
    page,
    jobStatus
  ) => {
    let pageNo = applicantPage[jobpostId] + page;
    setApplicantPage({ ...applicantPage, [jobpostId]: pageNo });
    const res = await getapplicants(jobpostId, jobStatus, pageNo);
    const newState = { ...jobList };
    newState.data[index].applicants = res.data;
    setJobList(newState);
  };

  const getapplicants = async (jobpostId, jobStatus, page = 0) => {
    const isClosed = jobStatus === 6 ? true : false;
    const res = await props.getJobApplicantsByJobPost(
      jobpostId,
      userId,
      role,
      applicantsPerRow,
      page,
      isClosed
    );
    return res;
  };

  const viewJob = (job) => {
    if (job.isPreferedPremiumAgency) {
      toJobPostReviewPage(job.id);
    } else {
      if (isTrialExist || isStripeAdded) {
        toJobPostReviewPage(job.id);
      } else {
        openAlert();
      }
    }
  };

  const getColorCode = (job, type, isPrefPremium) => {
    if (type === Types.Recruiter || role === Roles.InterviewPanel) {
      // if (!isPrefPremium) {
      //   return "rgb(251, 179, 87)";
      // } else {
      if (job.status === 6) {
        return "#0560ec";
      } else {
        return "#58C897";
      }
      // }
    } else if (type === Types.Employer) {
      if (job.status === 1) {
        return "";
      } else if (job.status === 2) {
        //Jobs that are 1 week away from start date but not reviewed by TA.
        if (moment() >= moment(job.startDate).subtract(7, "days")) {
          return "#ff725f";
        } else {
          return "#FBB357";
        }
      } else if (job.status === 3) {
        //Jobs that are 1 week away from start date and has not received any applicants
        if (
          // !job.applicants ||
          // job.applicants.length === 0 ||
          job.shortListedCount === 0
          //job.interviewedCount === 0
        ) {
          //Jobs that are 1 week away from start date and has not shortlisted any applicants

          if (moment() >= moment(job.startDate).subtract(7, "days")) {
            return "#ff725f";
          } else {
            return "#58C897";
          }
        } else {
          return "#58C897";
        }
      } else if (job.status === 6) {
        return "#0560ec";
      } else {
        return "";
      }
    }
  };

  const getCandidateColorCode = (
    status,
    selectStatus,
    isPremiumCandidate,
    type
  ) => {
    if (selectStatus === 1) {
      return "#ffa600";
    }
    if (selectStatus === 2) {
      return "#dadada";
    } else if (status === 1) {
      if (selectStatus === JobApplicationSelectStatus.Rejected) {
        return "#FF725F";
      }
      return "#01e05c";
    }
  };

  const getButton = (status, jobId) => {
    if (status === 2) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          size="small"
          style={{ marginTop: "20px", fontSize: "11px" }}
          onClick={() => {
            toJobPostReview(jobId);
          }}
        >
          {t("tracker.review")}
        </Button>
      );
    } else if (status === 3) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          size="small"
          style={{
            marginTop: "20px",
            fontSize: "11px",
            backgroundColor: "#07a7c3",
          }}
          onClick={() => {
            inviteRecruiter(jobId);
          }}
        >
          {t("tracker.sendtoAgency")}
        </Button>
      );
    }
  };

  const handleRecruiterChange = async (idx, recruiterId, jobId, jobStatus) => {
    const isClosed = jobStatus === 6 ? true : false;
    const res = await props.getJobApplicantsByJobPost(
      jobId,
      recruiterId,
      role,
      applicantsPerRow,
      0,
      true,
      isClosed
    );
    const { shortListedCount, interviewedCount } =
      await props.getCandidateCountByRecruiterId(jobId, recruiterId);
    const newState = { ...jobList };
    newState.data[idx].applicants = res.data;
    newState.data[idx].applicantCount = res.total;
    if (recruiterId > 0) {
      newState.data[idx].initialShortListedCount =
        newState.data[idx].shortListedCount;
      newState.data[idx].initialInterviewedCount =
        newState.data[idx].interviewedCount;
      newState.data[idx].shortListedCount = shortListedCount;
      newState.data[idx].interviewedCount = interviewedCount;
    } else {
      newState.data[idx].shortListedCount =
        newState.data[idx].initialShortListedCount;
      newState.data[idx].interviewedCount =
        newState.data[idx].initialInterviewedCount;
    }
    newState.data[idx].selectedRecruiter = recruiterId;
    setJobList(newState);
    const newpage = { ...applicantPage };
    newpage[jobId] = 0;
    setApplicantPage(newpage);
  };

  const dialogue = () => {
    return (
      <Dialog
        open={palert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("tracker.unlockPremium")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                {role !== Roles.Admin
                  ? t("tracker.noActiveSubscription")
                  : t("tracker.unlockAlert")}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handlepClose()} color="primary">
            {t("tracker.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const p_dialogue = () => {
    return (
      <Dialog
        open={alert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("tracker.activateSubscription")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                {role === Roles.Recruiter
                  ? t("tracker.noActiveSubscription")
                  : t("tracker.subscribeAlert")}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        {role === Roles.Recruiter && (
          <DialogActions>
            <Button onClick={() => handleClose(false)} color="primary">
              {t("tracker.ok")}
            </Button>
          </DialogActions>
        )}

        {role === Roles.AgencyAdmin && (
          <DialogActions>
            <Button onClick={() => handleClose(false)} color="primary">
              {t("tracker.doLater")}
            </Button>
            <Button onClick={() => handleClose(true)} color="primary">
              {t("tracker.buyNow")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  };

  const closeJobAlert = () => {
    return (
      <Dialog
        open={closealert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("tracker.closeJob")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">{t("tracker.closeJobAlert")}</Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseJob()} color="primary">
            {t("tracker.no")}
          </Button>
          <Button onClick={() => closeJob()} color="primary">
            {t("tracker.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const msg = isSearch
    ? t("tracker.jobNotFoundAlert")
    : t("tracker.noSearchResults");

  return (
    <Container className={classes.root} style={{ paddingTop: 0 }}>
      {jobList && jobList.data && jobList.data.length > 0 ? (
        jobList.data.map((job, index) => (
          <div style={{ position: "relative", marginTop: "60px" }}>
            {role === Roles.AgencyAdmin && (
              <div className={classes.selectWrap}>
                <Select
                  disableUnderline="true"
                  value={job.selectedRecruiter || 0}
                  MenuProps={{
                    classes: {
                      list: classes.inlineSelectDrpdwn,
                    },
                  }}
                  onChange={(event) =>
                    handleRecruiterChange(
                      index,
                      event.target.value,
                      job.id,
                      job.status
                    )
                  }
                  inputProps={{
                    name: "type",
                    id: "type",
                  }}
                  style={{
                    background: "#e9e9e9",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                  }}
                  className={classes.inlineSelect}
                >
                  <MenuItem selected value={0} style={{ position: "relative" }}>
                    {t("tracker.allRecruiters")}{" "}
                    <span style={{ position: "absolute", right: "20px" }}>
                      {job.recruiterCount || 0}
                    </span>
                  </MenuItem>
                  {job.recruiterList.map((recruiter) => (
                    <MenuItem
                      value={recruiter.id}
                      style={{ position: "relative" }}
                    >
                      {recruiter.name}
                      <span style={{ position: "absolute", right: "20px" }}>
                        {recruiter.count}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            <Grid
              key={index}
              container
              className={classes.trackBoxWrap}
              style={{
                borderColor: getColorCode(
                  job,
                  type,
                  job.isPreferedPremiumAgency
                ),
              }}
            >
              <Grid item xs="2" className={classes.trackBoxOne}>
                <Typography variant="h1" className={classes.trackBoxId}>
                  {job.uniqueId}
                </Typography>
                {type === Types.Recruiter ? (
                  <Grid item xs="2" className={classes.trackBoxOne}>
                    <Typography className={classes.companyName}>
                      {job.user.organization.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      size="small"
                      style={{ marginTop: "20px", fontSize: "11px" }}
                      onClick={() => {
                        viewJob(job);
                      }}
                    >
                      {t("tracker.view")}
                    </Button>
                  </Grid>
                ) : (
                  role !== Roles.InterviewPanel &&
                  // (state.isRoleTA || !state.hasTA) &&
                  getButton(job.status, job.id)
                )}
              </Grid>
              <Grid item xs="6" className={classes.trackBoxTwo}>
                <Grid container item className={classes.trackBoxDetailsWrap}>
                  <Grid item xs="5" className={classes.trackBoxDetailsLeft}>
                    <Typography className={classes.trackBoxDetailsDesig}>
                      {job.title || "--"}
                    </Typography>
                    <Typography className={classes.trackBoxDetailsData}>
                      {job.addresses && job.addresses[0]
                        ? getFullAddress(job.addresses[0])
                        : "--"}
                      <br />
                      {t("common:startDate")}{" "}
                      {job.startDate ? moment(job.startDate).format("L") : "--"}
                      <br />
                    </Typography>
                    <Typography>
                      {job.status === 2
                        ? t("trackerBar.pendingReview")
                        : t(`${JobStatus.getNameByValue(job.status)}`)}
                    </Typography>
                    {type !== Types.Recruiter && (
                      <Typography className={classes.trackBoxDetailsData}>
                        {t("tracker.postedBy")}{" "}
                        {job.user && job.user.fname + " " + job.user.lname}
                      </Typography>
                    )}
                    <Typography className={classes.trackBoxDetailsData}>
                      {t("tracker.postedOn")}{" "}
                      {job.createdAt ? moment(job.createdAt).format("L") : "--"}
                    </Typography>
                  </Grid>
                  <Grid item xs="7" className={classes.trackBoxDetailsRight}>
                    <Box className={classes.counterBoxWrap}>
                      {type === Types.Employer && (
                        <Box className={classes.counterBoxItem}>
                          <Typography
                            variant="subtitle1"
                            className={classes.counterBoxTitle}
                          >
                            {t("tracker.agencies")}
                          </Typography>
                          <Typography
                            variant="span"
                            className={classes.counterBoxCounter}
                          >
                            {job.agencyCount || 0}
                          </Typography>
                        </Box>
                      )}
                      {role === Roles.AgencyAdmin && !job.selectedRecruiter && (
                        <Box className={classes.counterBoxItem}>
                          <Typography
                            variant="subtitle1"
                            className={classes.counterBoxTitle}
                          >
                            {t("tracker.recruiters")}
                          </Typography>
                          <Typography
                            variant="span"
                            className={classes.counterBoxCounter}
                          >
                            {job.recruiterCount || 0}
                          </Typography>
                        </Box>
                      )}
                      <Box className={classes.counterBoxItem}>
                        <Typography
                          variant="subtitle1"
                          className={classes.counterBoxTitle}
                        >
                          {t("tracker.applicants")}
                        </Typography>
                        <Typography
                          variant="span"
                          className={classes.counterBoxCounter}
                        >
                          {job.applicantCount || 0}
                        </Typography>
                      </Box>
                      <Box className={classes.counterBoxItem}>
                        <Typography
                          variant="subtitle1"
                          className={classes.counterBoxTitle}
                        >
                          {t("summary.shortlisted")}
                        </Typography>
                        <Typography
                          variant="span"
                          className={classes.counterBoxCounter}
                          style={{ color: "rgb(255, 166, 0)" }}
                        >
                          {job.shortListedCount || 0}
                        </Typography>
                      </Box>
                      <Box className={classes.counterBoxItem}>
                        <Typography
                          variant="subtitle1"
                          className={classes.counterBoxTitle}
                        >
                          {t("summary.interviewed")}
                        </Typography>
                        <Typography
                          variant="span"
                          className={classes.counterBoxCounter}
                        >
                          {job.interviewedCount || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs="4" className={classes.trackBoxThree}>
                <Box className={classes.avatarBoxWrap}>
                  {job.applicants && job.applicants.length > 0 ? (
                    <Box className={classes.avatarBoxTop}>
                      <IconButton
                        className={classes.avatarArrowBtnLeft}
                        disabled={applicantPage[job.id] === 0}
                        onClick={() =>
                          handleChangeApplicantPage(job.id, index, -1)
                        }
                      >
                        <NavigateBeforeRounded
                          style={{
                            color:
                              applicantPage[job.id] === 0 ? "#ccc" : "#717171",
                          }}
                          className={classes.avatarArrowBtnIcon}
                        />
                      </IconButton>
                      <IconButton
                        className={classes.avatarArrowBtnRight}
                        disabled={
                          job.applicantCount <=
                          (applicantPage[job.id] + 1) * applicantsPerRow
                        }
                        onClick={() =>
                          handleChangeApplicantPage(job.id, index, 1)
                        }
                      >
                        <NavigateNextRounded
                          style={{
                            color:
                              job.applicantCount <=
                              (applicantPage[job.id] + 1) * applicantsPerRow
                                ? "#ccc"
                                : "#717171",
                          }}
                          className={classes.avatarArrowBtnIcon}
                        />
                      </IconButton>
                      {job.applicants.map((applicant, index) => (
                        <Box
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            viewProfile(type, role, job, applicant);
                            // type === Types.Recruiter
                            //   ? job.isPreferedPremiumAgency
                            //     ? applicant.status < 1
                            //       ? jobApplication(job.id, applicant.id)
                            //       : toJobApplReviewPage(applicant.id)
                            //     : isStripeAdded
                            //       ? applicant.status < 1
                            //         ? jobApplication(job.id, applicant.id)
                            //         : toJobApplReviewPage(applicant.id)
                            //       : openAlert()
                            //   : role === Roles.InterviewPanel
                            //     ? interviewAssessment(applicant.id)
                            //     : share.checkCanidatePremiumMembership(isStripeAdded,
                            //       job.stripeUsageViewRecordId, applicant.isPremiumCandidate)
                            //       ? candidateRecap(job.id, applicant.id)
                            //       : openPremiumAlert();
                          }}
                        >
                          <ProfilePic
                            id={applicant.avatarId}
                            className={classes.avatarImg}
                            style={{
                              borderColor: getCandidateColorCode(
                                applicant.status,
                                applicant.selectStatus,
                                applicant.isPremiumCandidate,
                                type
                              ),
                            }}
                            getFile={props.getFile}
                          />
                          <Typography className={classes.avatarName}>
                            {displayCandidateName(type, applicant, job)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box className={classes.avatarBoxTop}>
                      <Avatar
                        alt="Name"
                        src={avatarimg}
                        className={classes.avatarImg}
                      />
                      <Avatar
                        alt="Name"
                        src={avatarimg}
                        className={classes.avatarImg}
                      />
                      <Avatar
                        alt="Name"
                        src={avatarimg}
                        className={classes.avatarImg}
                      />
                    </Box>
                  )}

                  <Box className={classes.avatarBoxBottom}>
                    {/* {role === Roles.Recruiter && (
          <IconButton
            title="View"
            disabled={job.status !== 3}
            onClick={() => {
              toJobPostReviewPage(job.id);
            }}
          >
            <WorkOutline
              style={{ color: job.status === 3 ? "#75d49b" : null }}
            />
          </IconButton>
        )} */}
                    {(role === Roles.Admin ||
                      role === Roles.HiringManager ||
                      role === Roles.TalentAcquisitionTeam) &&
                      job.applicantCount > 0 && (
                        <IconButton
                          disabled={job.status === 6}
                          title={t("tracker.skillMatrix")}
                          // style={{
                          //   visibility: job.status === 6 ? "visible" : "hidden",
                          // }}
                          onClick={() => {
                            skillMatrix(job.id);
                          }}
                        >
                          <DashboardOutlined
                            style={{
                              visibility:
                                job.status !== 6 ? "visible" : "hidden",
                              color: job.status === 3 ? "#75d49b" : null,
                            }}
                          />
                        </IconButton>
                      )}
                    {type === Types.Employer &&
                      (role === Roles.Admin ||
                        role === Roles.HiringManager ||
                        role === Roles.TalentAcquisitionTeam) && (
                        <>
                          {job && job.showCandidJourney && (
                            <IconButton
                              disabled={job.status === 6}
                              onClick={() => {
                                journey(job.id);
                              }}
                              title={t("common:candidatejourney")}
                            >
                              <TransferWithinAStationOutlined
                                //disabled={job && job.status !== 6}
                                style={{
                                  color: "#75d49b",
                                  visibility:
                                    job.status !== 6 ? "visible" : "hidden",
                                }}
                              />
                            </IconButton>
                          )}
                          <IconButton
                            title={
                              job.status > 2
                                ? t("tracker.view")
                                : t("tracker.edit")
                            }
                            onClick={() => {
                              job.status > 2
                                ? toJobPostEmployerReview(job.id)
                                : toJobPost(job.id);
                            }}
                          >
                            {job.status > 2 ? (
                              <Visibility style={{ color: "#75d49b" }} />
                            ) : (
                              <Edit style={{ color: "#75d49b" }} />
                            )}
                          </IconButton>

                          <IconButton
                            disabled={job.status === 6}
                            title={job.status === 3 && t("tracker.close")}
                            onClick={() => {
                              openCloseAlert(job.id);
                            }}
                          >
                            {job.status === 3 && (
                              <Close style={{ color: "#75d49b" }} />
                            )}
                          </IconButton>
                        </>
                      )}
                    {/* {(role === Roles.TalentAcquisitionTeam ||
          role === Roles.Admin) && (
          <IconButton
            title="Send to recruiter"
            small
            disabled={job.status !== 3}
            variant="contained"
            onClick={() => {
              inviteRecruiter(job.id);
            }}
          >
            <ContactMail
              style={{ color: job.status === 3 ? "#75d49b" : null }}
            />
          </IconButton>
        )} */}
                    {type === Types.Recruiter && (
                      <IconButton
                        title={t("tracker.addProfile")}
                        disabled={
                          !job.isPreferedPremiumAgency
                            ? isStripeAdded || isTrialExist
                              ? true
                              : false
                            : true
                        }
                        small
                        disabled={job.status !== 3}
                        onClick={() => {
                          job.isPreferedPremiumAgency // if the job is sent to  preferred premium skip payment check
                            ? jobApplication(job.id)
                            : isStripeAdded || isTrialExist
                            ? jobApplication(job.id)
                            : openAlert();
                        }}
                      >
                        <PersonAdd
                          style={{
                            visibility: job.status !== 6 ? "visible" : "hidden",
                            color: job.status === 3 ? "#75d49b" : null,
                          }}
                        />
                      </IconButton>
                    )}
                    {/* <IconButton>
          <CancelOutlined style={{ color: "#ff725f" }} />
        </IconButton> */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>
        ))
      ) : (
        <Typography>{msg}</Typography>
      )}

      {jobList &&
        jobList.data &&
        jobList.data.length > 0 &&
        showPagination !== false && (
          <TablePagination
            backIconButtonProps={{
              "aria-label": t("common:previousPage"),
            }}
            component="div"
            className={classes.paginationWrap}
            count={jobList.total}
            nextIconButtonProps={{
              "aria-label": t("common:nextPage"),
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            rowsPerPageLabel="Rows"
          />
        )}

      {dialogue()}
      {p_dialogue()}
      {closeJobAlert()}
    </Container>
  );
};

const mapDispatchToProps = {
  getJobApplicantsByJobPost: getJobApplicantsByJobPost,
  getCandidateCountByRecruiterId: getCandidateCountByRecruiterId,
  checkOrgHasTA: checkOrgHasTA,
  getFile,
  loadOrganization,
  fromPreferredPremium,
  createJobPost,
  getJobsbyEmployer,
  getJobsSummary,
};

const mapStateToProps = (state) => ({
  applicants: (state.jobPost && state.jobPost.applicants) || null,
  organization: state.organization,
  orgId: state.profile && state.profile.orgId,
  profileId: state.profile && state.profile.id,
  summary: state.jobPost && state.jobPost.summary,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Tracker))
);
