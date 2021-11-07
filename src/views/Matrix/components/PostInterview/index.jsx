import React, {useEffect} from "react";
import {
  Container,
  Menu,
  MenuItem,
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
  CircularProgress,
  LinearProgress,
  FormLabel,
  TablePagination,
  Modal,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import classNames from "classnames";
import {
  PersonAddOutlined,
  DescriptionOutlined,
  ChatOutlined,
  CancelOutlined,
  ArrowDropDownCircleOutlined,
  MoreHorizRounded,
  FastForwardRounded,
  FastRewindRounded,
  AccountCircleOutlined,
  CheckCircleOutlineOutlined,
} from "@material-ui/icons";

import PerfectScrollbar from "react-perfect-scrollbar";

import styles from "../style";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {paginate, formatCurrency} from "util/helper";
import {useTranslation} from "react-i18next";

import {
  JobType,
  JobApplicationSelectStatus,
  InterviewAssessmentStatus,
  JobStatus,
} from "util/enum";
import moment from "moment";
import {AssignInterviewer} from "../../../Modals";
import {loadUsers} from "services/admin/action";

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

const PostInterview = (props) => {
  const {classes, profile, interviewers, skillWeightage, interviewWeightage} =
    props;
  const {t} = useTranslation("matrix", "common");
  const [state, setState] = React.useState({
    selected: "absoulte",
    anchorEl: null,
    expandSkill: true,
    expandQn: true,
    pageNo: 1,
  });
  const [applicationMatrix, setApplicationMatrix] = React.useState(null);
  const [applicationMatrixPage, setApplicationMatrixPage] =
    React.useState(null);
  const [jobPost, setJobPost] = React.useState(null);
  const [maxValues, setMaxValues] = React.useState(null);

  const {anchorEl, expandSkill, expandQn} = state;
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
      setState({...state, pageNo});
      setApplicationMatrixPage(page);
    }
  }, [props.applicationMatrix, props.maxValues]);

  const handleClick = (i) => (event) => {
    setState({...state, index: i, anchorEl: event.currentTarget});
  };

  const handleClose = () => {
    setState({...state, anchorEl: null});
  };

  const handleToggleSkill = () => {
    setState({...state, expandSkill: !expandSkill});
  };

  const handleToggleQn = () => {
    setState({...state, expandQn: !expandQn});
  };

  const handlePaginateNext = (event, page) => {
    const pageNo = page + 1;
    setState({...state, pageNo});
    setApplicationMatrixPage(paginate(applicationMatrix, pageSize, pageNo));
  };

  const handleOpenPanel = (level, applicantId, applicantName) => {
    const interviewDetails = jobPost.jobinterviewers.find(
      (c) => c.level === level
    );
    setValues({
      ...values,
      applicantId: applicantId,
      applicantName: applicantName,
      interviewDetails: interviewDetails,
      totalLevels: jobPost.jobinterviewers.length,
    });
    setInterviewerModal(true);
  };

  const handleClosePanel = () => {
    setInterviewerModal(false);
    //props.clearUser();
  };

  const candidateRecap = (jobpostId, jobappId) => {
    props.history.push({
      pathname: "/rc/recap/" + jobpostId,
      state: {jobApplId: jobappId, isSkillMatrix: true},
    });
  };

  const interviewAssessment = (jobappId, level) => {
    const candidates = applicationMatrix.map((c) => c.id);
    props.history.push({
      pathname: "/rc/assessment/" + jobappId + "/" + level,
      state: {candidates},
      //state: { jobApplId: jobappId, level: level }
    });
  };

  const getHighLightRowStyle = (selectStatus, assignedInterviewer = null) => {
    if (selectStatus === JobApplicationSelectStatus.Hired) {
      return classNames(classes.tableRow, classes.highlightedGreen); //highlight the row in green if the candidate is hired
    }
    if (selectStatus === JobApplicationSelectStatus.Rejected) {
      return classNames(classes.tableRow, classes.highlightedRed); //highlight the row in red if the candidate is rejected
    }
    if (selectStatus === JobApplicationSelectStatus.ShortListed) {
      return classNames(classes.tableRow, classes.highlighted); //highlight the row in yellow if the candidate is shortlisted
    }

    if (assignedInterviewer) {
      return classNames(classes.tableRow, classes.highlighted); //highlight the row in yellow if the candidate is assigned to an interviewer
    }

    return classes.tableRow;
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

  const getHtmlMenuItems = (applicant) => {
    // Render menu for each applicant based on status.

    // if (!applicant.atleast1AsesmntLevelComplete) {
    //   // At least one assessment levels is NOT complete dont show status actions buttons
    //   return (
    //     <StyledMenuItem onClick={handleClose} disableRipple={true}>
    //        <IconButton
    //       title={t("postInterview.hire")}
    //       className={classes.gridButton}
    //       onClick={() => {
    //         props.handleSelect(applicant.id, JobApplicationSelectStatus.Hired);
    //       }}
    //     >
    //       <CheckCircleOutlineOutlined style={{ color: "#75d49b" }} />
    //     </IconButton>
    //     <IconButton
    //       title={t("postInterview.reject")}
    //       className={classes.gridButton}
    //       onClick={() => {
    //         props.handleSelect(
    //           applicant.id,
    //           JobApplicationSelectStatus.Rejected
    //         );
    //       }}
    //     >
    //       <CancelOutlined style={{ color: "#FF725F" }} />
    //     </IconButton>
    //       <IconButton
    //         title={t("details.candidateRecap")}
    //         small
    //         className={classes.gridButton}
    //         onClick={() => {
    //           candidateRecap(applicant.jobpostId, applicant.id);
    //         }}
    //       >
    //         <AccountCircleOutlined style={{ color: "#75d49b" }} />
    //       </IconButton>
    //       <IconButton
    //         title={t("details.resume")}
    //         className={classes.gridButton}
    //         onClick={() => {
    //           props.handleShowResume(applicant.resumeId);
    //         }}
    //       >
    //         <DescriptionOutlined style={{ color: "#75d49b" }} />
    //       </IconButton>
    //       <IconButton
    //         className={classes.gridButton}
    //         title={t("details.messageRecruiter")}
    //         onClick={() => {
    //           props.handleOpenModalforSendMsgRec(applicant.id);
    //         }}
    //       >
    //         <ChatOutlined style={{ color: "#75d49b" }} />
    //       </IconButton>
    //     </StyledMenuItem>
    //   );
    // }

    if (applicant.selectStatus === JobApplicationSelectStatus.Hired) {
      return (
        <StyledMenuItem onClick={handleClose} disableRipple={true}>
          <IconButton
            title={t("details.candidateRecap")}
            small
            className={classes.gridButton}
            onClick={() => {
              candidateRecap(applicant.jobpostId, applicant.id);
            }}
          >
            <AccountCircleOutlined style={{color: "#75d49b"}} />
          </IconButton>
          <IconButton
            title={t("details.resume")}
            className={classes.gridButton}
            onClick={() => {
              props.handleShowResume(applicant.resumeId);
            }}
          >
            <DescriptionOutlined style={{color: "#75d49b"}} />
          </IconButton>
          <IconButton
            className={classes.gridButton}
            title={t("details.messageRecruiter")}
            onClick={() => {
              props.handleOpenModalforSendMsgRec(applicant.id);
            }}
          >
            <ChatOutlined style={{color: "#75d49b"}} />
          </IconButton>
        </StyledMenuItem>
      );
    }

    if (applicant.selectStatus === JobApplicationSelectStatus.Rejected) {
      return (
        <StyledMenuItem onClick={handleClose} disableRipple={true}>
          <IconButton
            title={t("details.candidateRecap")}
            small
            className={classes.gridButton}
            onClick={() => {
              candidateRecap(applicant.jobpostId, applicant.id);
            }}
          >
            <AccountCircleOutlined style={{color: "#75d49b"}} />
          </IconButton>
          <IconButton
            title={t("details.resume")}
            className={classes.gridButton}
            onClick={() => {
              props.handleShowResume(applicant.resumeId);
            }}
          >
            <DescriptionOutlined style={{color: "#75d49b"}} />
          </IconButton>

          <IconButton
            className={classes.gridButton}
            title={t("details.messageRecruiter")}
            onClick={() => {
              props.handleOpenModalforSendMsgRec(applicant.id);
            }}
          >
            <ChatOutlined style={{color: "#75d49b"}} />
          </IconButton>
        </StyledMenuItem>
      );
    }

    return (
      <StyledMenuItem onClick={handleClose} disableRipple={true}>
        <IconButton
          title={t("postInterview.hire")}
          className={classes.gridButton}
          /**AUTHOR: Alphonsa
           * on hire/reject check whether the job is closed
           */
          onClick={() => {
            onCandidateSelect(applicant.id, JobApplicationSelectStatus.Hired);
            //props.handleSelect(applicant.id, JobApplicationSelectStatus.Hired);
          }}
        >
          <CheckCircleOutlineOutlined style={{color: "#75d49b"}} />
        </IconButton>
        <IconButton
          title={t("postInterview.reject")}
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
          <CancelOutlined style={{color: "#FF725F"}} />
        </IconButton>
        <IconButton
          title={t("details.candidateRecap")}
          small
          className={classes.gridButton}
          onClick={() => {
            candidateRecap(applicant.jobpostId, applicant.id);
          }}
        >
          <AccountCircleOutlined style={{color: "#75d49b"}} />
        </IconButton>
        <IconButton
          title={t("details.resume")}
          className={classes.gridButton}
          onClick={() => {
            props.handleShowResume(applicant.resumeId);
          }}
        >
          <DescriptionOutlined style={{color: "#75d49b"}} />
        </IconButton>

        <IconButton
          title={t("details.messageRecruiter")}
          className={classes.gridButton}
          onClick={() => {
            props.handleOpenModalforSendMsgRec(applicant.id);
          }}
        >
          <ChatOutlined style={{color: "#75d49b"}} />
        </IconButton>
      </StyledMenuItem>
    );
  };

  let applicantRows = [];
  let applicantSkills = [];
  let applicantQs = [];

  const loadApplicantSkills = (applicant) => {
    applicantSkills = [];

    // Calculate stats for each skill of applicant
    for (let index = 0; index < applicant.skills.length; index++) {
      if (expandSkill && index === skillShowCount) {
        break;
      }

      const skill = applicant.skills[index];

      const diff = skill.exp - skill.reqExp; //skill.competencyPoints - skill.reqCompetencyPoints;
      const arrow = diff >= 0 ? classes.arrowGreen : classes.arrowRed;
      const color = diff >= 0 ? "#75d49b" : "#FF725F";
      const checkBox =
        diff >= 0 ? (
          <CheckCircleOutlineOutlined style={{color: color}} />
        ) : (
          <CancelOutlined style={{color: color}} />
        );

      //change the skill table cell depending in selection
      const htmlTCell =
        state.selected === "checked" ? (
          <TableCell className={classes.tableBodyBorder}>
            <Box className={classes.arrowWrap}>{checkBox}</Box>
          </TableCell>
        ) : state.selected === "variance" ? (
          <TableCell className={classes.tableBodyBorder}>
            <Box className={classes.arrowWrap}>
              {Math.abs(diff)}
              <ArrowDropDownCircleOutlined className={arrow} />
            </Box>
          </TableCell>
        ) : state.selected === "all" ? (
          <TableCell className={classes.tableBodyBorderL}>
            <Box className={classes.arrowWrap}>
              {skill.exp}
              <br />
              <span className={classes.varianceVal} style={{color: color}}>
                {Math.abs(diff)}
              </span>
              <ArrowDropDownCircleOutlined className={arrow} />
            </Box>
          </TableCell>
        ) : (
          <TableCell className={classes.tableBodyBorder}>
            <Box className={classes.arrowWrap}>
              {skill.exp}
              <ArrowDropDownCircleOutlined className={arrow} />
            </Box>
          </TableCell>
        );

      applicantSkills.push(htmlTCell);
    }

    const linearProgress = getLinearBar(
      applicant.totalSkillPerc,
      maxValues.maxSkillPerc
    );

    // skill total Score
    applicantSkills.push(
      <TableCell className={classes.tableBodyBorder}>
        {applicant.totalSkillPerc}%{linearProgress}
      </TableCell>
    );
  };

  const loadApplicantQs = (applicant) => {
    applicantQs = [];
    //let totalAnsScorePrc = 0;
    let prevLevelCompleted = false;
    let prevLevelHired = true;
    if (applicant.assesmentLevels && applicant.assesmentLevels.length > 0) {
      applicant.assesmentLevels.sort((a, b) => a.level - b.level);
    }
    for (let index = 0; index < applicant.assesmentLevels.length; index++) {
      if (expandQn && index === qnShowCount) {
        break;
      }

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
          <TableCell className={classes.tableBodyBorder}>
            <Box
              className={classes.circleProgWrap}
              onClick={() => {
                interviewAssessment(applicant.id, q.level);
              }}
              style={{color: "#2233ff", cursor: "pointer"}}
            >
              <span className={classes.circleProgVal}>{ansScorePrc}%</span>
              <CircularProgress
                className={classes.cirProgGreen}
                variant="static"
                value={ansScorePrc}
                color="red"
                thickness={5}
              />
            </Box>
          </TableCell>
        );
        prevLevelHired = q.assesmentStatus === InterviewAssessmentStatus.Hired;
      } else {
        applicantQs.push(
          <TableCell className={classes.tableBodyBorderL}>
            {/* Link to assign interviewer */}
            {prevLevelHired && (
              <Box className={classes.circleProgWrap}>
                <IconButton
                  disabled={prevLevelCompleted || isDisableAssignAgency}
                  className={classNames(
                    classes.gridButton,
                    classes.circleProgVal,
                    classes.circleProgValButton
                  )}
                  onClick={() => {
                    handleOpenPanel(
                      q.level,
                      applicant.id,
                      applicant.fname + " " + applicant.lname
                    );
                  }}
                >
                  <PersonAddOutlined
                    style={{
                      color: prevLevelCompleted ? "#75d49b" : "#75d49b",
                    }} //Before it was "#CCC"--
                  />
                </IconButton>
                <CircularProgress
                  className={classes.cirProgYellow}
                  variant="static"
                  value={100}
                  color="red"
                  thickness={5}
                />
              </Box>
            )}
          </TableCell>
        );
        //prevLevelCompleted = true;
      }
    }

    // change bar color depending diff value
    const linearProgress = getLinearBar(
      applicant.totalAssesmentScorePrc,
      maxValues.maxAssessmentScorePrc
    );

    // Qs total Score
    applicantQs.push(
      <TableCell className={classes.tableBodyBorder}>
        {applicant.totalAssesmentScorePrc.toFixed(1)}%{linearProgress}
      </TableCell>
    );
  };

  const loadApplicantRows = () => {
    applicationMatrixPage.map((applicant, index) => {
      //for (let index = 0; index < applicationMatrixPage.length; index++) {
      //const applicant = applicationMatrixPage[index];
      let {selectStatus, exp, availDate, payRate} = applicant;

      availDate = moment(availDate);
      payRate = parseFloat(payRate);

      const expArrow =
        exp > reqExp
          ? classes.arrowGreen
          : exp === reqExp
          ? classes.arrowGreen
          : classes.arrowRed;

      const availDateArrow =
        reqAvailDate >= availDate
          ? classes.arrowGreen
          : // : availDate === reqAvailDate
            // ? classes.arrowGreen
            classes.arrowRed;

      const payRateArrow =
        payRate > reqPayRate
          ? classes.arrowRed
          : payRate === reqPayRate
          ? classes.arrowGreen
          : classes.arrowGreen;

      loadApplicantSkills(applicant);
      loadApplicantQs(applicant);

      const linearOverAllScoreProgress = getLinearBar(
        applicant.overAllScore,
        maxValues.maxOverAllScore
      );

      const tblRowClassName = getHighLightRowStyle(
        selectStatus,
        applicant.assignedInterviewer
      );

      applicantRows.push(
        <>
          <TableRow className={tblRowClassName}>
            <TableCell className={classes.tableBody}>
              <span className={classes.boxNmbr}>{applicant.rank}</span>
            </TableCell>
            <TableCell
              className={classes.tableBody}
              align="left"
              style={{
                width: 125,
                maxWidth: 125,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={applicant.fname + " " + applicant.lname}
            >
              {applicant.fname} {applicant.lname}
            </TableCell>

            {applicantQs}

            {applicantSkills}

            <TableCell className={classes.tableBody}>
              {applicant.overAllScore}%{linearOverAllScoreProgress}
            </TableCell>

            <TableCell
              className={classNames(classes.tableBody, classes.tableBorderLeft)}
            >
              <Box className={classes.arrowWrap}>
                {exp}
                <ArrowDropDownCircleOutlined className={expArrow} />
              </Box>
            </TableCell>
            <TableCell className={classes.tableBody}>
              <Box className={classes.arrowWrap}>
                {moment(availDate).format("ll")}
                <ArrowDropDownCircleOutlined className={availDateArrow} />
              </Box>
            </TableCell>
            <TableCell className={classes.tableBody}>
              <Box className={classes.arrowWrap}>
                {t("common:currencySymbol")}
                {formatCurrency(payRate)}
                <ArrowDropDownCircleOutlined className={payRateArrow} />
              </Box>
            </TableCell>

            <TableCell className={classes.tableBody}>
              <IconButton
                className={classes.gridButton}
                aria-label={t("postInterview.showMore")}
                aria-haspopup="true"
                onClick={handleClick(index)}
              >
                <MoreHorizRounded />
              </IconButton>
              <Menu
                id="more"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl) && state.index === index}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {getHtmlMenuItems(applicant)}
              </Menu>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="20" className={classes.borderRow}></TableCell>
          </TableRow>
        </>
      );
    });
    //}
  };

  const loadHtmlTableBodyRow = () => {
    loadApplicantRows();
    return (
      <TableBody>
        {applicantRows}
        <Dialog
          open={values.showJobClosedModal}
          onClose={() => {
            setValues({...values, showJobClosedModal: false});
          }}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("common:jobClosedAlert")}
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

  const hideClosedJobAlert = () => {
    setValues({...values, showJobClosedModal: false});
  };

  const getLinearBar = (value, maxValue) => {
    const skillPrcDiffFromMax = maxValue - value;
    // change linear bar color depending diff value
    value = value > 100 ? 100 : value;
    return skillPrcDiffFromMax <= 10 ? (
      <LinearProgress
        variant="determinate"
        value={value}
        {...props}
        classes={{
          root: classes.barRoot,
          colorPrimary: classes.trackColorPrimary,
          barColorPrimary: classes.barColorGreen,
        }}
      />
    ) : skillPrcDiffFromMax <= 20 ? (
      <LinearProgress
        variant="determinate"
        value={value}
        {...props}
        classes={{
          root: classes.barRoot,
          colorPrimary: classes.trackColorPrimary,
          barColorPrimary: classes.barColorYellow,
        }}
      />
    ) : (
      <LinearProgress
        variant="determinate"
        value={value}
        {...props}
        classes={{
          root: classes.barRoot,
          colorPrimary: classes.trackColorPrimary,
          barColorPrimary: classes.barColorRed,
        }}
      />
    );
  };

  let skillHead = [];
  let skillExpHead = [];
  let questionHead = [];
  let questionPriorityHead = [];

  const loadHtmlSkillHead = () => {
    for (let index = 0; index < jobPost.jobskills.length; index++) {
      if (expandSkill && index === skillShowCount) {
        break;
      }

      const jobSkill = jobPost.jobskills[index];
      //const competencyPoint = competencySet[jobSkill.competency].points;
      const reqExp = jobSkill.exp;

      skillHead.push(
        <TableCell className={classes.tableHeadBorderL}>
          <span className={classes.textRotate}>{jobSkill.skill.name}</span>
        </TableCell>
      );

      skillExpHead.push(
        <TableCell className={classes.tableHeadBorderL}>
          {/* {competencyPoint} */}
          {reqExp}
        </TableCell>
      );
    }
  };

  const loadHtmlQuestionHead = () => {
    //calculate total priority points on questions to show on header
    // const totalQPriorityPoint = jobPost.jobscreeningqtns.reduce((total, q) => {
    //   const point = prioritySet[q.priority].points;
    //   return total + point;
    // }, 0);
    if (jobPost.jobinterviewers && jobPost.jobinterviewers.length > 0) {
      jobPost.jobinterviewers.sort((a, b) => a.level - b.level);
    }
    for (let index = 0; index < jobPost.jobinterviewers.length; index++) {
      if (expandQn && index === qnShowCount) {
        break;
      }

      const {level} = jobPost.jobinterviewers[index];
      questionHead.push(
        <TableCell className={classes.tableHeadBorder}>{level}</TableCell>
      );

      //   const qPriorityPerc =
      //     (prioritySet[priority].points / totalQPriorityPoint) * 100;
      questionPriorityHead.push(
        <TableCell className={classes.tableHeadBorder}>
          {/* {Math.round(qPriorityPerc * 10) / 10}% */}
          {"100%"}
        </TableCell>
      );
    }
  };

  const loadHtmlTableHeadRow = () => {
    reqExp = props.jobPost.exp;
    reqAvailDate = moment(props.jobPost.startDate);
    reqPayRate = parseFloat(props.jobPost.payRate);
    payRateType =
      props.jobPost.type === JobType.getValueByName("fullTime")
        ? t("postInterview.annum")
        : t("postInterview.hr");

    loadHtmlSkillHead();
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
    if (jobPost.jobinterviewers.length > qnShowCount) {
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
      <TableHead className={classes.tableRow} style={{borderRadius: 4}}>
        <TableRow>
          <TableCell className={classes.tableHeadTL1} colSpan="2">
            {" "}
          </TableCell>

          <TableCell
            className={classNames(
              classes.tableHeadScreen,
              classes.tableBorderLeft
            )}
            colSpan={questionHead.length + 1}
          >
            {t("postInterview.interviewAssessment")}
            {expandQnIcon}
            <Typography variant="caption" className={classes.colSubHead}>
              {interviewWeightage}%
            </Typography>
          </TableCell>

          <TableCell
            colSpan={skillHead.length + 1}
            className={classes.tableHeadSkills}
            ref={props.scoreRef}
          >
            {t("details.skills")}
            {expandSkillIcon}
            <Typography variant="caption" className={classes.colSubHead}>
              {skillWeightage}%
            </Typography>
          </TableCell>

          <TableCell className={classes.tableHead}>&nbsp;</TableCell>
          <TableCell className={classes.tableBorderLeft}>&nbsp;</TableCell>
          <TableCell className={classes.tableHeadTR1}>&nbsp;</TableCell>
          <TableCell className={classes.tableHeadTR1}>&nbsp;</TableCell>
          <TableCell
            className={classNames(
              classes.tableBorderLeft,
              classes.tableHeadTR1
            )}
          >
            &nbsp;
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={classes.tableHeadTL2} rowSpan="2">
            {t("details.rank")}
          </TableCell>
          <TableCell className={classes.tableHead} rowSpan="2" align="left">
            {t("details.candidate")}
          </TableCell>

          {questionHead}
          <TableCell className={classes.tableHeadBorder}>
            {" "}
            {t("details.score")}
          </TableCell>

          {skillHead}
          <TableCell className={classes.tableHeadBorder}>
            {" "}
            {t("details.score")}
          </TableCell>

          <TableCell className={classes.tableHead}>
            {t("details.overall")}
          </TableCell>
          <TableCell className={classes.tableBorderLeft}>
            {t("postInterview.experience")}
          </TableCell>
          <TableCell className={classes.tableHeadTR2}>
            {" "}
            {t("postInterview.availability")}
          </TableCell>
          <TableCell className={classes.tableHeadTR2}>
            {t("postInterview.compensation")}
          </TableCell>
          <TableCell className={classes.tableBorderLeft}>
            {t("details.actions")}
          </TableCell>
        </TableRow>
        <TableRow>
          {questionPriorityHead}
          <TableCell className={classes.tableHeadBorder}>
            {t("details.perc")}
          </TableCell>

          {skillExpHead}
          <TableCell className={classes.tableHeadBorder}>
            {t("details.perc")}
            {/* {maxValues.skillReqPointSum} */}
          </TableCell>

          <TableCell className={classes.tableHead}>
            {t("details.perc")}
          </TableCell>
          <TableCell
            className={classNames(
              classes.tableBorderLeft,
              classes.tableBorderTop
            )}
          >
            {reqExp}
          </TableCell>
          <TableCell
            className={classNames(classes.tableHeadTR2, classes.tableBorderTop)}
          >
            {moment(reqAvailDate).format("ll")}
          </TableCell>
          <TableCell
            className={classNames(classes.tableHeadTR2, classes.tableBorderTop)}
          >
            {t("common:currencySymbol")}
            {formatCurrency(reqPayRate)}/{payRateType}
          </TableCell>
          <TableCell
            className={classNames(
              classes.tableBorderLeft,
              classes.tableHeadTR2
            )}
          >
            {" "}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const StyledMenuItem = withStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: 30,
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&:active": {
        backgroundColor: "transparent",
        outline: "none",
      },
      "& button": {
        marginRight: 5,
      },
    },
  })(MenuItem);

  if (jobPost && applicationMatrix) {
    return (
      <Container className={classes.root}>
        <div className={classes.root}>
          <MuiThemeProvider theme={theme}>
            <FormLabel className={classes.formHeader}></FormLabel>
            <PerfectScrollbar className={classes.scroller}>
              <Table widh="100%">
                {loadHtmlTableHeadRow()}
                {loadHtmlTableBodyRow()}
              </Table>
            </PerfectScrollbar>
          </MuiThemeProvider>
          <TablePagination
            backIconButtonProps={{
              "aria-label": t("postInterview.previousPage"),
            }}
            component="div"
            nextIconButtonProps={{
              "aria-label": t("postInterview.nextPage"),
            }}
            className={classes.paginationWrap}
            onChangePage={handlePaginateNext}
            count={applicationMatrix.length}
            page={state.pageNo - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[]}
          />
        </div>
        <Modal
          aria-labelledby={t("postInterview.assignInterviewer")}
          aria-describedby={t("postInterview.assignInterviewer")}
          open={interviewerModal}
          onClose={handleClosePanel}
        >
          <AssignInterviewer
            jobpostId={jobPost.id}
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
    );
  } else {
    return (
      <Container className={classes.root}>
        <div className={classes.root}>
          <MuiThemeProvider theme={theme}>
            <FormLabel className={classes.formHeader}>
              {t("details.detail")}
            </FormLabel>
            <Table className={classes.reviewItemWrap}>
              <TableRow>
                <TableCell className={classes.reviewCol} align="center">
                  <CircularProgress className={classes.progress} />
                </TableCell>
              </TableRow>
            </Table>
          </MuiThemeProvider>
        </div>
      </Container>
    );
  }
};

const mapDispatchToProps = {loadUsers};
const mapStateToProps = (state) => ({
  profile: state.profile,
  interviewers: state.admin && state.admin.users,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(PostInterview))
);
