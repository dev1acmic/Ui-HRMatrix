import React, {useEffect} from "react";
import {
  Container,
  Menu,
  MenuItem,
  OutlinedInput,
  Box,
  Select,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  CircularProgress,
  LinearProgress,
  FormLabel,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Grid,
  Button,
} from "@material-ui/core";
import classNames from "classnames";
import {
  AccountCircleOutlined,
  DescriptionOutlined,
  ChatOutlined,
  CancelOutlined,
  ArrowDropDownCircleOutlined,
  MoreHorizRounded,
  FastForwardRounded,
  FastRewindRounded,
  CheckCircleOutlineOutlined,
  CheckBoxOutlined,
  CheckBoxOutlineBlank,
} from "@material-ui/icons";
import _ from 'lodash'
import PerfectScrollbar from "react-perfect-scrollbar";

import styles from "../style";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {skillCompetencySet, skillPrioritySet, paginate} from "util/helper";
import {useTranslation} from "react-i18next";

import {JobApplicationSelectStatus} from "util/enum";

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

const Details = (props) => {
  const {t} = useTranslation("matrix");
  const {classes, skillWeightage, screeningWeightage} = props;

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
  const [isPremiumSubscribed, setIsPremiumSubscribed] = React.useState(null);
  const {selected, anchorEl, expandSkill, expandQn} = state;
  const skillShowCount = 10;
  const qnShowCount = 5;
  const pageSize = 5;

  useEffect(() => {
    setJobPost(props.jobPost);
  }, [props.jobPost]);

  useEffect(() => {
    setIsPremiumSubscribed(props.pendingpayment);
  }, [props.pendingpayment]);

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

  const competencySet = skillCompetencySet();
  const prioritySet = skillPrioritySet();

  const handleClick = (i, h) => (event) => {
    if (h) {
      return false;
    }
    setState({...state, index: i, anchorEl: event.currentTarget});
  };

  const handleClose = () => {
    setState({...state, anchorEl: null});
  };

  const handleChange = (value) => {
    setState({...state, selected: value});
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

  const candidateRecap = (jobpostId, jobappId) => {
    props.history.push({
      pathname: "/rc/recap/" + jobpostId,
      state: {jobApplId: jobappId},
    });
  };

  const isRowSelected = (selectStatus) => {
    return (
      selectStatus === JobApplicationSelectStatus.ShortListed ||
      selectStatus === JobApplicationSelectStatus.Rejected ||
      selectStatus === JobApplicationSelectStatus.Hired
    );
  };

  const getHtmlMenuItems = (applicant, hideDetails) => {
    const selectIcon = isRowSelected(applicant.selectStatus) ? (
      <CheckBoxOutlined style={{color: "#75d49b"}} />
    ) : (
      <CheckBoxOutlineBlank style={{color: "#75d49b"}} />
    );

    if (
      applicant.selectStatus === JobApplicationSelectStatus.Hired ||
      applicant.selectStatus === JobApplicationSelectStatus.Rejected
    ) {
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
          <TableCell title={t("details.shortlist")}>
            <IconButton disabled className={classes.gridButton}>
              {selectIcon}
            </IconButton>
          </TableCell>
          <IconButton
            className={classes.gridButton}
            title={t("details.messageRecruiter")}
          >
            <ChatOutlined style={{color: "#75d49b"}} />
          </IconButton>
          <TableCell title={t("details.removeCandidate")}>
            <IconButton disabled className={classes.gridButton}>
              <CancelOutlined style={{color: "#FF725F"}} />
            </IconButton>
          </TableCell>
        </StyledMenuItem>
      );
    }

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
          title={t("details.shortlist")}
          className={classes.gridButton}
          onClick={() => {
            props.handleSelect(applicant.id);
          }}
        >
          {selectIcon}
        </IconButton>
        <IconButton
          className={classes.gridButton}
          title={t("details.messageRecruiter")}
          onClick={() => {
            !hideDetails && props.handleOpenModalforSendMsgRec(applicant.id);
          }}
        >
          <ChatOutlined style={{color: "#75d49b"}} />
        </IconButton>
        <IconButton
          title={t("details.removeCandidate")}
          className={classes.gridButton}
          onClick={() => {
            props.handleConfirmRemove(applicant.id);
          }}
        >
          <CancelOutlined style={{color: "#FF725F"}} />
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
        {applicant.totalSkillPerc.toFixed(1)}%{linearProgress}
      </TableCell>
    );
  };

  const loadApplicantQs = (applicant) => {
    applicantQs = [];
    //let totalAnsScorePrc = 0;
    for (let index = 0; index < applicant.screeningQ.length; index++) {
      if (expandQn && index === qnShowCount) {
        break;
      }

      const q = applicant.screeningQ[index];
      const ansScorePrc = Math.round(q.ansScorePrc);

      let candidate = props.jobApplications.filter(
        (c) => c.id === applicant.id
      );

      let hideDetails =
        candidate && candidate[0] && candidate[0].isPremiumCandidate
          ? isPremiumSubscribed
            ? true
            : false
          : false;

      // totalAnsScorePrc = totalAnsScorePrc + ansScorePrc;
      applicantQs.push(
        <TableCell className={classes.tableBodyBorder}>
          <Box
            className={classes.circleProgWrap}
            onClick={props.handleOpenModalScreenQue(
              applicant.id,
              applicant.fname + " " + applicant.lname,
              q.id,
              (q.qPriorityPoint / totalQPriorityPoint) * 100,
              hideDetails
            )}
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
    }

    // change bar color depending diff value
    const linearProgress = getLinearBar(
      applicant.totalAnsScorePrc,
      maxValues.maxAnsScorePrc
    );

    // Qs total Score
    applicantQs.push(
      <TableCell className={classes.tableBodyBorder}>
        {applicant.totalAnsScorePrc.toFixed(1)}%{linearProgress}
      </TableCell>
    );
  };

  const loadApplicantRows = () => {
    applicationMatrixPage.map((applicant, index) => {
      //for (let index = 0; index < applicationMatrixPage.length; index++) {
      //const applicant = applicationMatrixPage[index];
      const {id, selectStatus, resumeId} = applicant;
      loadApplicantSkills(applicant);
      loadApplicantQs(applicant);

      const linearOverAllScoreProgress = getLinearBar(
        applicant.overAllScore,
        maxValues.maxOverAllScore
      );

      const tblRowClassName = isRowSelected(selectStatus)
        ? classNames(classes.tableRow, classes.highlighted)
        : classes.tableRow;

      let candidate = props.jobApplications.filter(
        (c) => c.id === applicant.id
      );

      let hideDetails =
        candidate && candidate[0] && candidate[0].isPremiumCandidate
          ? isPremiumSubscribed
            ? true
            : false
          : false;

      // const selectIcon = isRowSelected(selectStatus) ? (
      //   <CheckBoxOutlined style={{ color: "#75d49b" }} />
      // ) : (
      //   <CheckBoxOutlineBlank style={{ color: "#75d49b" }} />
      // );

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
              title={
                hideDetails ? "-----" : applicant.fname + " " + applicant.lname
              }
            >
              {hideDetails ? "-----" : applicant.fname + " " + applicant.lname}{" "}
            </TableCell>

            {applicantSkills}

            {applicantQs}

            <TableCell className={classes.tableBody}>
              {applicant.overAllScore.toFixed(1)}%{linearOverAllScoreProgress}
            </TableCell>

            <TableCell className={classes.tableBody}>
              <IconButton
                className={classes.gridButton}
                aria-label={t("postInterview.showMore")}
                aria-haspopup="true"
                onClick={handleClick(index, hideDetails)}
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
                {getHtmlMenuItems(applicant, hideDetails)}
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
    return <TableBody>{applicantRows}</TableBody>;
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
  let totalQPriorityPoint = 0;
  const loadHtmlQuestionHead = () => { 
    //calculate total priority points on questions to show on header
    totalQPriorityPoint = jobPost.jobscreeningqtns.reduce((total, q) => {
      const point = prioritySet[q.priority].points;
      return total + point;
    }, 0);

    for (let index = 0; index < jobPost.jobscreeningqtns.length; index++) {
      if (expandQn && index === qnShowCount) {
        break;
      }

      const {priority, question} = jobPost.jobscreeningqtns[index];

      questionHead.push(
        <TableCell className={classes.tableHeadBorder} title={question}>
          {index + 1}
        </TableCell>
      );

      const qPriorityPerc =
        (prioritySet[priority].points / totalQPriorityPoint) * 100;
      questionPriorityHead.push(
        <TableCell className={classes.tableHeadBorder}>
          {Math.round(qPriorityPerc)}%
        </TableCell>
      );
    }
  };

  const loadHtmlTableHeadRow = () => {
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
    let jobQnLength = _.uniqBy(jobPost.jobscreeningqtns, function (e) {
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
      <TableHead className={classes.tableRow} style={{borderRadius: 4}}>
        <TableRow>
          <TableCell className={classes.tableHeadTL1} colSpan="2">
            <Select
              value={selected}
              onChange={(event) => handleChange(event.target.value)}
              margin="dense"
              className={classes.selectBox}
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
              }}
              input={
                <OutlinedInput
                  labelWidth="0"
                  name="age"
                  id="outlined-age-simple"
                  style={{
                    height: "25px",
                  }}
                />
              }
            >
              <MenuItem selected value="all">
                {t("details.all")}
              </MenuItem>
              <MenuItem value="variance">{t("details.variance")}</MenuItem>
              <MenuItem selected="true" value="absoulte">
                {t("details.absolute")}
              </MenuItem>
              <MenuItem value="checked">{t("details.checked")}</MenuItem>
            </Select>
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
          <TableCell
            className={classes.tableHeadScreen}
            colSpan={questionHead.length + 1}
          >
            {t("details.screeningFeedback")}
            {expandQnIcon}
            <Typography variant="caption" className={classes.colSubHead}>
              {screeningWeightage}%
            </Typography>
          </TableCell>
          <TableCell className={classes.tableHead}>&nbsp;</TableCell>
          <TableCell className={classes.tableHeadTR1}>&nbsp;</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={classes.tableHeadTL2} rowSpan="2" width="45">
            {t("details.rank")}
          </TableCell>
          <TableCell className={classes.tableHead} rowSpan="2" align="left">
            {t("details.candidate")}
          </TableCell>
          {skillHead}
          <TableCell className={classes.tableHeadBorder}>
            {" "}
            {t("details.score")}
          </TableCell>
          {questionHead}
          <TableCell className={classes.tableHeadBorder}>
            {t("details.score")}
          </TableCell>
          <TableCell className={classes.tableHead}>
            {t("details.overall")}
          </TableCell>
          <TableCell className={classes.tableHeadTR2}>
            {t("details.actions")}
          </TableCell>
        </TableRow>
        <TableRow>
          {skillExpHead}
          <TableCell className={classes.tableHeadBorder}>
            {t("details.perc")}
            {/* {maxValues.skillReqPointSum} */}
          </TableCell>
          {questionPriorityHead}
          <TableCell className={classes.tableHeadBorder}>
            {t("details.perc")}
          </TableCell>
          <TableCell className={classes.tableHead}>
            {t("details.perc")}
          </TableCell>
          <TableCell className={classes.tableHeadTR2}> </TableCell>
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
            <FormLabel className={classes.formHeader}>
              {t("details.detail")}
            </FormLabel>
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
      </Container>
    );
  } else {
    return (
      <Container className={classes.root}>
        <div className={classes.root}>
          <MuiThemeProvider theme={theme}>
            <FormLabel className={classes.formHeader}>
              {" "}
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

const mapDispatchToProps = {};
const mapStateToProps = (state) => ({
  jobApplications: (state.jobApplication && state.jobApplication.query) || null,
  jobPost: state.jobPost && state.jobPost.data,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Details))
);
