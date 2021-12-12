import React, { Component, useEffect } from "react";
import {
  Container,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  FormLabel,
  Avatar,
  Typography,
  Modal,
  CircularProgress,
  LinearProgress,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"; 
import _ from 'lodash'
import classNames from "classnames";
import {
  CancelOutlined,
  CheckCircleOutline,
  AddOutlined,
  PersonAddOutlined,
  CheckCircle,
  FastForwardRounded,
  FastRewindRounded,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { getFile } from "services/jobApplication/action";
import { paginate, formatCurrency } from "util/helper";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from "../style";
import { ProfilePic } from "util/ProfilePic";
import avatarimg1 from "../../../../assets/images/avatar.jpg";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loadUsers } from "services/admin/action";
import moment from "moment";
import {updateJobPost} from 'services/jobPost/action'
import {
  JobType,
  JobApplicationSelectStatus,
  InterviewAssessmentStatus,
  JobStatus,
} from "util/enum";
import { AssignInterviewer,AddMoreLevel } from "../../../Modals";
const grey = "#ccc";
const green = "#60CE8C";
const orange = "#F9C51D";
const red = "#FF725F";

const theme = createMuiTheme({
  overrides: {
    MuiTable: {
      root: {
        width: "100%",
        borderCollapse: "initial",
      },
    },
    MuiTableCell: {
      root: {
        textAlign: "center",
        fontWeight: 600,
        borderBottom: "none",
      },
      head: {
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: "0.75rem",
        backgroundColor: "white",
        "&:last-child": {
          paddingRight: "12px!important",
        },
        "&:first-child": {
          paddingLeft: "12px!important",
        },
        padding: "6px 6px 6px 6px!important",
        borderBottom: "none",
        borderTop: "none",
        fontWeight: 600,
      },
      body: {
        backgroundColor: "white",
        "&:last-child": {
          borderRadius: "0 4px 4px 0",
          paddingRight: "12px!important",
        },
        "&:first-child": {
          borderRadius: "4px 0 0 4px",
          paddingLeft: "12px!important",
        },
        padding: "6px 6px 6px 6px!important",
      },
    },
  },
});

const Summary = (props) => {
  const {
    classes,
    profile,
    interviewers,
    skillWeightage,
    interviewWeightage,
    jobApplications,
  } = props;
  const { t } = useTranslation("common");
  const [state, setState] = React.useState({
    selected: "absoulte",
    anchorEl: null,
    expandSkill: true,
    expandQn: true,
    pageNo: 1,
  });
  const [applicationMatrix, setApplicationMatrix] = React.useState(null);
  const [applicationMatrixPage, setApplicationMatrixPage] = React.useState(
    null
  );
  const [jobPost, setJobPost] = React.useState(null);
  const [maxValues, setMaxValues] = React.useState(null);

  const [openLevel, setOpenLevel] = React.useState(false)
  const { anchorEl, expandSkill, expandQn } = state;
  const [interviewerModal, setInterviewerModal] = React.useState(false);
  const [values, setValues] = React.useState({
    orgId: profile.orgId,
    showJobClosedModal: false,
  });
  const skillShowCount = 10;
  const qnShowCount = 5;
  const pageSize = 5;

  let reqExp = 0;
  let reqAvailDate = null;
  let reqPayRate = 0;
  let payRateType;

  let applicantRows = [];
  let applicantSkills = [];
  let applicantQs = [];

  let questionHead = [];
  let questionPriorityHead = [];

  useEffect(() => {
    props.loadUsers(profile.orgId, -1);
  }, []);

  useEffect(() => {
    setJobPost(props.jobPost);
  }, [props.jobPost]);

  useEffect(() => {
    if (interviewers && interviewers.length > 0) {
      setValues({
        ...values,
        interviewers: interviewers,
      });
    }
  }, [interviewers]);

  const handleToggleSkill = () => {
    setState({...state, expandSkill: !expandSkill});
  };

  const handleToggleQn = () => {
    setState({...state, expandQn: !expandQn});
  };

  useEffect(() => {
    //console.log(props.applicationMatrix);
    //console.log(props.maxValues);
    if (props.applicationMatrix) {
      setMaxValues(props.maxValues);
      setApplicationMatrix(props.applicationMatrix);

      // Get the page of items. If current page is empty try previous page, since this can happen when last item in apage is removed
      let pageNo = state.pageNo;
      let page = paginate(props.applicationMatrix, pageSize, pageNo);
      if (page.length === 0 && pageNo !== 1) {
        pageNo = pageNo - 1;
        page = paginate(props.applicationMatrix, pageSize, pageNo);
      }
      setState({ ...state, pageNo });
      setApplicationMatrixPage(page);
    }
  }, [props.applicationMatrix, props.maxValues]);

  const handleClosePanel = () => {
    setInterviewerModal(false);
    //props.clearUser();
  };

  const handlePaginateNext = (event, page) => {
    const pageNo = page + 1;
    setState({ ...state, pageNo });
    setApplicationMatrixPage(paginate(applicationMatrix, pageSize, pageNo));
  };

  const handleOpenPanel = (level, applicantId, applicantName) => {
    const interviewDetails = jobPost.jobinterviewqtns.find(
      (c) => c.level === level
    );
    setValues({
      ...values,
      applicantId: applicantId,
      applicantName: applicantName,
      interviewDetails: interviewDetails,
      totalLevels: jobPost.jobinterviewqtns.length,
    });
    setInterviewerModal(true);
  };

  const candidateRecap = (jobpostId, jobappId) => {
    props.history.push({
      pathname: "/rc/recap/" + jobpostId,
      state: { jobApplId: jobappId },
    });
  };

  const loadHtmlTableBodyRow = () => {
    loadApplicantRows();
    return (
      <TableBody>
        {applicantRows}
        <Dialog
          open={values.showJobClosedModal}
          onClose={() => {
            setValues({ ...values, showJobClosedModal: false });
          }}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("jobClosedAlert")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                hideClosedJobAlert();
              }}
              color="primary"
              autoFocus
            >
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>
      </TableBody>
    );
  };

  const interviewAssessment = (jobappId, level) => {
    const candidates = applicationMatrix.map((c) => c.id);
    props.history.push({
      pathname: "/rc/assessment/" + jobappId + "/" + level,
      state: { candidates },
      //state: { jobApplId: jobappId, level: level }
    });
  };

  /**AUTHOR: Alphonsa
   * on hire/reject check whether the job is closed
   */
  const onCandidateSelect = (applicantId, selectStatus) => {
    if (
      props.jobPost &&
      props.jobPost.status === JobStatus.getValueByName("enum:jobStatus.closed")
    ) {
      setValues({
        ...values,
        showJobClosedModal: true,
      }); /**if job is closed, show an alert */
    } else {
      props.handleSelect(
        applicantId,
        selectStatus
      ); /**if job is open continue with the selection process */
    }
  };

  const hideClosedJobAlert = () => {
    setValues({ ...values, showJobClosedModal: false });
  };

  const loadApplicantQs = (applicant) => {
    if (applicant) {
      applicantQs = [];
      //let totalAnsScorePrc = 0;
      let prevLevelCompleted = false;
      let { selectStatus } = applicant;
      let prevLevelHired = true;

      let interviewdBy, interviewdAt, applicantStatus, panelname;

      if (applicant.assesmentLevels) {
        if (applicant.assesmentLevels.length > 0) {
          applicant.assesmentLevels.sort((a, b) => a.level - b.level);

          for (
            let index = 0;
            index < applicant.assesmentLevels.length;
            index++
          ) {
            if (expandQn && index === qnShowCount) {
              break;
            }
            // interviewer details has been used to display it in the interview assessment score
            interviewdBy = applicant.assesmentLevels[index].interviewdBy;
            interviewdAt = applicant.assesmentLevels[index].interviewdAt;
            applicantStatus = applicant.assesmentLevels[index].applicantStatus;
            panelname = applicant.assesmentLevels[index].panelname;

            let isDisableAssignAgency =
              applicant.selectStatus === JobApplicationSelectStatus.Rejected ||
              applicant.selectStatus === JobApplicationSelectStatus.Hired ||
              applicant.assesmentLevels.filter(
                (c) => c.applicantStatus === InterviewAssessmentStatus.Rejected
              ).length > 0;

            const q = applicant.assesmentLevels[index]; 
            const ansScorePrc = q.assesmentScore
              ? Math.round(q.assesmentScore * 10) / 10
              : null;

            if (ansScorePrc) {
              applicantQs.push(
                <>
                  <TableCell className={classes.tableBodyScore}>
                    <div
                      style={{ backgroundColor: getColor(selectStatus) }}
                      className={classes.connectingLine}
                    ></div>
                    <Typography className={classes.dateLabel}>
                      {interviewdAt && moment(interviewdAt).format("ll")}
                    </Typography>
                    <Box
                      className={classes.circleProgWrap}
                      onClick={() => {
                        interviewAssessment(applicant.id, q.level);
                      }}
                    >
                      <Typography className={classes.circleProgVal}>
                        {ansScorePrc.toFixed(1)}%
                      </Typography>
                      <CircularProgress
                        className={classes.cirProgGreen}
                        variant="static"
                        value={ansScorePrc}
                        color="red"
                        thickness={4}
                        size={50}
                      />
                    </Box>
                    <Box
                      className={classNames(
                        classes.ageName,
                        classes.ageNameSmall
                      )}
                    >
                      <Typography
                        variant="h5"
                        title={
                          interviewdBy &&
                          interviewdBy.fname + " " + interviewdBy.lname
                        }
                      >
                        {interviewdBy &&
                          interviewdBy.fname + " " + interviewdBy.lname}
                      </Typography>
                      {/* <Typography variant="h6">{panelname}</Typography> */}
                    </Box>
                  </TableCell>
                </>
              );
              prevLevelHired =
                q.assesmentStatus === InterviewAssessmentStatus.Hired;
            } else {   
              applicantQs.push(
                <>
                  <TableCell className={classNames(classes.tableBodyScore)}>
                    <div
                      style={{ backgroundColor: getColor(selectStatus) }}
                      className={classes.connectingLine}
                    ></div>
                    <Typography className={classes.dateLabel}>
                      {isDisableAssignAgency ? "NA" : "Date: TBD"}
                    </Typography>
                    <Box className={classes.circleProgWrap}>
                      <CircularProgress
                        className={classes.cirProgGreen}
                        variant="static"
                        value={100}
                        color="red"
                        thickness={4}
                        size={50}
                      />
                      <Typography className={classes.circleProgVal}>
                        <IconButton
                          className={classes.gridButton}
                          disabled={prevLevelCompleted || isDisableAssignAgency}
                          onClick={() => {
                            handleOpenPanel(
                              q.level,
                              applicant.id,
                              applicant.fname + " " + applicant.lname
                            );
                          }}
                        >
                          <PersonAddOutlined style={{ color: "#75D49B" }} />
                        </IconButton>
                      </Typography>
                    </Box>
                    <Box
                      className={classNames(
                        classes.ageName,
                        classes.ageNameSmall
                      )}
                    > 
                      <Typography variant="h6">
                        {isDisableAssignAgency
                          ? t("na")
                          : applicant.assignedInterviewer &&  applicant.assignedInterviewer.filter(c=>c.level===q.level).length>0
                          ? t("assigned")
                          : t("notAssigned")}
                      </Typography>
                    </Box>
                  </TableCell>
                </>
              );
              //prevLevelCompleted = true;
            }
          }
        }
      }
    }
  };

  const handleAddLevel=() => { 
    setOpenLevel(true) 
  } 

  const handleModalClose = () => {
    setOpenLevel(false) 
  }

  const handleSubmitLevel = async(data) => {
    jobPost && jobPost.jobinterviewqtns.push(data);
   const res = await props.updateJobPost(jobPost,null, true)
   const copyJob = {...jobPost};
   copyJob.jobinterviewqtns.push(res[0])
   _.uniqBy(copyJob.jobinterviewqtns, function (e) {
     return e.level;
   }); 
   setJobPost(copyJob)
   props.loadSkillMatrix() 
   setOpenLevel(false) 
   }
 

  const getColor = (status) => {
    if (status === JobApplicationSelectStatus.Hired) {
      return green;
    }
    if (
      status === JobApplicationSelectStatus.Removed ||
      status === JobApplicationSelectStatus.Rejected
    ) {
      return red;
    }

    if (status === JobApplicationSelectStatus.ShortListed) {
      return orange;
    }
  };

  const loadApplicantRows = () => {
    applicationMatrixPage &&
      applicationMatrixPage.length > 0 &&
      applicationMatrixPage.map((applicant, index) => {
        //for (let index = 0; index < applicationMatrixPage.length; index++) {
        //const applicant = applicationMatrixPage[index];
        let {
          selectStatus,
          exp,
          availDate,
          jobAppliedDate,
          payRate,
          assesmentLevels,
        } = applicant;

        let userAddedBy =
          jobApplications &&
          jobApplications.filter((c) => c.id === applicant.id).length > 0 &&
          jobApplications.filter((c) => c.id === applicant.id)[0].user;
        let totalAnsScorePrc =
          props.applicationSkillMatrix &&
          props.applicationSkillMatrix.length > 0 &&
          props.applicationSkillMatrix[index].totalAnsScorePrc;
        let overAllScore =
          props.applicationSkillMatrix &&
          props.applicationSkillMatrix.length > 0 &&
          props.applicationSkillMatrix[index].overAllScore;

        jobAppliedDate = moment(jobAppliedDate);
        payRate = parseFloat(payRate);

        // loadApplicantSkills(applicant);
        loadApplicantQs(applicant);

        // const linearOverAllScoreProgress = getLinearBar(
        //   applicant.overAllScore,
        //   maxValues.maxOverAllScore
        // );

        // const tblRowClassName = getHighLightRowStyle(
        //   selectStatus,
        //   applicant.assignedInterviewer
        // );

        applicantRows.push(
          <>
            {" "}
            <TableRow>
              <TableCell colSpan="9" className={classes.borderRow}></TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableBody}>
                <span className={classes.boxNmbr}>{applicant.rank}</span>
              </TableCell>
              <TableCell
                className={classes.tableBody}
                title={applicant.fname + " " + applicant.lname}
              >
                <div
                  style={{ backgroundColor: getColor(selectStatus) }}
                  className={classNames(
                    classes.connectingLine,
                    classes.connectingLineStart
                  )}
                ></div>

                <ProfilePic
                  id={applicant.avatarId}
                  className={classes.avatarImg}
                  style={{
                    borderColor: getColor(selectStatus),
                    margin: "0 auto",
                  }}
                  getFile={props.getFile}
                  onClick={() => {
                    candidateRecap(applicant.jobpostId, applicant.id);
                  }}
                />
                {/* <Avatar
                  onClick={() => {
                    candidateRecap(applicant.jobpostId, applicant.id);
                  }}
                  alt="Name"
                  src={avatarimg1}
                  className={classes.avatarImg}
                  style={{
                    borderColor: getColor(applicantStatus),
                    margin: "0 auto",
                  }}
                /> */}
                <Box
                  className={classNames(classes.ageName, classes.ageNameSmall)}
                >
                  <Typography variant="h5">
                    {applicant.fname} {applicant.lname}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell className={classes.tableBody}>
                <div
                  style={{ backgroundColor: getColor(selectStatus) }}
                  className={classes.connectingLine}
                ></div>
                <Typography className={classes.dateLabel}>
                  {moment(jobAppliedDate).format("ll")}
                </Typography>
                <Box className={classes.circleProgWrap}>
                  <Typography className={classes.circleProgVal}>
                    {" "}
                    {applicant.totalSkillPerc.toFixed(1)}%
                  </Typography>
                  <CircularProgress
                    className={classes.cirProgGreen}
                    variant="static"
                    value={applicant.totalSkillPerc.toFixed(1)}
                    color="red"
                    thickness={4}
                    size={50}
                  />
                </Box>
                <Box
                  className={classNames(
                    classes.ageName,
                    classes.ageNameFullwidth
                  )}
                >
                  <Typography variant="h5">
                    {userAddedBy && userAddedBy.fname + " " + userAddedBy.lname}
                  </Typography>
                  <Typography variant="h6">
                    {userAddedBy &&
                      userAddedBy.organization &&
                      userAddedBy.organization.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell className={classes.tableBody}>
                <div
                  style={{ backgroundColor: getColor(selectStatus) }}
                  className={classes.connectingLine}
                ></div>
                <Typography className={classes.dateLabel}>
                  {moment(jobAppliedDate).format("ll")}
                </Typography>
                <Box className={classes.circleProgWrap}>
                  <Typography className={classes.circleProgVal}>
                    {totalAnsScorePrc.toFixed(1)}%
                  </Typography>
                  <CircularProgress
                    className={classes.cirProgGreen}
                    variant="static"
                    value={totalAnsScorePrc.toFixed(1)}
                    color="red"
                    thickness={4}
                    size={50}
                  />
                </Box>
              </TableCell>
              {applicantQs}
              <TableCell className={classes.tableBody}>
                <div
                  style={{ backgroundColor: getColor(selectStatus) }}
                  className={classNames(
                    classes.connectingLine,
                    classes.connectingLineEnd
                  )}
                >
                  <div
                    style={{ backgroundColor: getColor(selectStatus) }}
                    className={classes.connectingLineEndDot}
                  ></div>
                </div>
              </TableCell>

              <TableCell className={classes.tableBody}>
                <Box className={classNames(classes.circleProgWrap)}>
                  <Typography className={classNames(classes.circleProgVal)}>
                    {applicant.totalAssesmentScorePrc.toFixed(1)}%
                  </Typography>
                  <CircularProgress
                    className={classes.cirProgGreen}
                    variant="static"
                    value={applicant.totalAssesmentScorePrc}
                    color="red"
                    thickness={4}
                    size={50}
                  />
                </Box>
              </TableCell>

              <TableCell className={classes.tableBody}>
                <Box className={classNames(classes.circleProgWrap)}>
                  <Typography className={classNames(classes.circleProgVal)}>
                    {applicant.overAllScore}%
                  </Typography>
                  <CircularProgress
                    className={classes.cirProgGreen}
                    variant="static"
                    value={applicant.overAllScore}
                    color="red"
                    thickness={4}
                    size={50}
                  />
                </Box>
              </TableCell>

              <TableCell className={classes.tableBody}>
                {selectStatus === JobApplicationSelectStatus.Hired && (
                  <Typography
                    className={classes.hireStatus}
                    style={{ color: green }}
                  >
                    <CheckCircle style={{ color: green }} /> {t("hiredUpper")}
                  </Typography>
                )}
                {selectStatus === JobApplicationSelectStatus.Rejected && (
                  <Typography
                    className={classes.hireStatus}
                    style={{ color: red }}
                  >
                    <CheckCircle style={{ color: red }} /> {t("rejectedUpper")}
                  </Typography>
                )}

                {selectStatus === JobApplicationSelectStatus.Removed && (
                  <Typography
                    className={classes.hireStatus}
                    style={{ color: red }}
                  >
                    <CheckCircle style={{ color: red }} /> {t("removedUpper")}
                  </Typography>
                )}
                {selectStatus === JobApplicationSelectStatus.ShortListed && (
                  <>
                    {" "}
                    <IconButton
                      className={classes.gridButton}
                      onClick={() => {
                        onCandidateSelect(
                          applicant.id,
                          JobApplicationSelectStatus.Hired
                        );
                        // props.handleSelect(
                        //   applicant.id,
                        //   JobApplicationSelectStatus.Hired
                        // );
                      }}
                    >
                      <CheckCircleOutline style={{ color: "#75D49B" }} />
                    </IconButton>
                    <IconButton
                      className={classes.gridButton}
                      onClick={() => {
                        onCandidateSelect(
                          applicant.id,
                          JobApplicationSelectStatus.Rejected
                        );
                        // props.handleSelect(
                        //   applicant.id,
                        //   JobApplicationSelectStatus.Rejected
                        // );
                      }}
                    >
                      <CancelOutlined style={{ color: "#FF725F" }} />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          </>
        );
      });
  };

  const loadHtmlQuestionHead = () => {
    //calculate total priority points on questions to show on header
    // const totalQPriorityPoint = jobPost.jobscreeningqtns.reduce((total, q) => {
    //   const point = prioritySet[q.priority].points;
    //   return total + point;
    // }, 0);
    if (jobPost) {
      let jobinterviewqtns = _.uniqBy(jobPost.jobinterviewqtns, function (e) {
        return e.level;
      });  
      if (jobinterviewqtns && jobinterviewqtns.length > 0) {
        jobinterviewqtns.sort((a, b) => a.level - b.level);
      }
      for (let index = 0; index < jobinterviewqtns.length; index++) {
        if (expandQn && index === qnShowCount) {
          break;
        }

        const { level } = jobinterviewqtns[index];
        questionHead.push(
          <TableCell className={classes.tableHeadBorder}>{level}</TableCell>
        );

        //   const qPriorityPerc =
        //     (prioritySet[priority].points / totalQPriorityPoint) * 100;
      }
    }
  };

  const loadHtmlTableHeadRow = () => {
    loadHtmlQuestionHead();

    
    let expandSkillIcon = null;
    // Show expand icon only if count exceeds config
    if (jobPost.jobskills.length > skillShowCount) {
      expandSkillIcon = expandSkill ? (
        <IconButton style={{float: "right", padding: 0}}>
          <FastForwardRounded
            className={classes.skillMoreBtn}
            onClick={handleToggleSkill}
          />
        </IconButton>
      ) : (
        <IconButton style={{float: "right", padding: 0}}>
          <FastRewindRounded
            className={classes.skillMoreBtn}
            onClick={handleToggleSkill}
          />
        </IconButton>
      );
    }

    let expandQnIcon = null;
    // Show expand icon only if count exceeds config
    let jobQnLength = _.uniqBy(jobPost.jobinterviewqtns, function (e) {
      return e.level;
    }); 
    if (jobQnLength.length > qnShowCount) {
      expandQnIcon = expandQn ? (
        <IconButton style={{float: "right", padding: 0}}>
          <FastForwardRounded
            className={classes.screenMoreBtn}
            onClick={handleToggleQn}
          />
        </IconButton>
      ) : (
        <IconButton style={{float: "right", padding: 0}}>
          <FastRewindRounded
            className={classes.screenMoreBtn}
            onClick={handleToggleQn}
          />
        </IconButton>
      );
    }


    return (
      <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
        <TableRow>
          <TableCell rowSpan="2" width="45" className={classes.tableHeadTL12}>
            {t("rank")}
          </TableCell>
          <TableCell rowSpan="2" className={classes.tableHead} width="150">
            {t("candidate")}
          </TableCell>
          <TableCell rowSpan="2" width="150" className={classes.tableHead}>
            {t("skillScore")}
          </TableCell>
          <TableCell rowSpan="2" width="150" className={classes.tableHead}>
            {t("preScreening")}
          </TableCell>
          <TableCell
            className={classes.tableHead}
            style={{ backgroundColor: "#E6F6FC" }}
            colSpan={questionHead.length}
          >
            {t("intrwAssessment")}
            <IconButton onClick={()=>{handleAddLevel()}}> <AddOutlined /></IconButton>
            {expandQnIcon}
          </TableCell>
          <TableCell className={classes.tableHead} rowSpan="2">
            &nbsp;
          </TableCell>
          <TableCell className={classes.tableHead} rowSpan="2" width="135">
            {t("totalIntrwScore")}
          </TableCell>
          <TableCell className={classes.tableHead} rowSpan="2" width="100">
            {t("finalscore")}
          </TableCell>
          <TableCell className={classes.tableHeadTR12} rowSpan="2" width="100">
            {t("actionStatus")}
          </TableCell>
        </TableRow>

        <TableRow> {questionHead}</TableRow>
      </TableHead>
    );
  };

  return (
    jobPost &&
    applicationMatrix && (
      <Container className={classes.root} style={{ marginTop: -15 }}>
        <div className={classes.root}>
          <MuiThemeProvider theme={theme}>
            <FormLabel className={classes.formHeader}>
              {t("candidatejourney")}
            </FormLabel>
            <PerfectScrollbar className={classes.scroller}>
              <Table size="small">
                {loadHtmlTableHeadRow()}
                {loadHtmlTableBodyRow()}
              </Table>
            </PerfectScrollbar>
          </MuiThemeProvider>
          <TablePagination
            backIconButtonProps={{
              "aria-label": t("previousPage"),
            }}
            component="div"
            nextIconButtonProps={{
              "aria-label": t("nextPage"),
            }}
            className={classes.paginationWrap}
            onChangePage={handlePaginateNext}
            count={applicationMatrix && applicationMatrix.length}
            page={state.pageNo - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[]}
          />
        </div>
        <Modal 
            aria-labelledby={t("common:addScreeningQ")}
            aria-describedby={t("common:addScreeningQ")}
            open={openLevel}
            onClose={handleModalClose}
          >
            <AddMoreLevel 
              onSubmit={handleSubmitLevel}
              onCancel={handleModalClose} 
              jobinterviewqtns={_.uniqBy(jobPost.jobinterviewqtns, function (e) {
                return e.level;
              })}
            />
          </Modal>

        <Modal
          aria-labelledby={t("assignInterviewer")}
          aria-describedby={t("assignInterviewer")}
          open={interviewerModal}
          onClose={handleClosePanel}
        >
          <AssignInterviewer
            jobPost={jobPost}
            jobApplications={jobApplications}
            jobpostId={jobPost && jobPost.id}
            interviewers={values.interviewers}
            applicantId={values.applicantId}
            applicantName={values.applicantName}
            interviewDetails={values.interviewDetails}
            organizationId={values.orgId}
            onCancel={handleClosePanel}
            totalLevels={values.totalLevels}
          />
        </Modal>
      </Container>
    )
  );
};

const mapDispatchToProps = { loadUsers, getFile,updateJobPost };
const mapStateToProps = (state) => ({
  profile: state.profile,
  interviewers: state.admin && state.admin.users,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Summary))
);
