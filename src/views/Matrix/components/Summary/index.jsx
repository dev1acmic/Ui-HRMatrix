import React, { useEffect } from "react";
import {
  Button,
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
  LinearProgress,
  FormLabel,
  CircularProgress,
  TablePagination,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Grid,
} from "@material-ui/core";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import classNames from "classnames";
import { JobType, JobApplicationSelectStatus } from "util/enum";
import {
  AccountCircleOutlined,
  DescriptionOutlined,
  ChatOutlined,
  CancelOutlined,
  ArrowDropDownCircleOutlined,
  PlayArrowRounded,
  CheckBoxOutlined,
  CheckBoxOutlineBlank,
} from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from "../style";
import { paginate, formatCurrency } from "util/helper";

import moment from "moment";

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
  const { t } = useTranslation("matrix");
  const { classes, skillWeightage, screeningWeightage } = props;

  const [state, setState] = React.useState({
    pageNo: 1,
  });

  const [applicationMatrix, setApplicationMatrix] = React.useState(null);
  const [applicationMatrixPage, setApplicationMatrixPage] = React.useState(
    null
  );
  const [maxValues, setMaxValues] = React.useState(null);

  //unlock premium alert
  const [isPremiumSubscribed, setIsPremiumSubscribed] = React.useState(null);

  useEffect(() => {
    setIsPremiumSubscribed(props.pendingpayment);
  }, [props.pendingpayment]);

  const pageSize = 5;

  let reqExp = 0;
  let reqAvailDate = null;
  let reqPayRate = 0;
  let payRateType;

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

  const handlePaginateNext = (event, page) => {
    const pageNo = page + 1;
    setState({ ...state, pageNo });
    setApplicationMatrixPage(paginate(applicationMatrix, pageSize, pageNo));
  };

  const candidateRecap = (jobpostId, jobappId) => {
    props.history.push({
      pathname: "/rc/recap/" + jobpostId,
      state: { jobApplId: jobappId },
    });
  };

  const isRowSelected = (selectStatus) => {
    return (
      selectStatus === JobApplicationSelectStatus.ShortListed ||
      selectStatus === JobApplicationSelectStatus.Rejected ||
      selectStatus === JobApplicationSelectStatus.Hired
    );
  };

  const getActionColumns = (index, applicant, hideDetails) => {
    const selectIcon = isRowSelected(applicant.selectStatus) ? (
      <CheckBoxOutlined style={{ color: "#75d49b" }} />
    ) : (
      <CheckBoxOutlineBlank style={{ color: "#75d49b" }} />
    );

    if (
      applicant.selectStatus === JobApplicationSelectStatus.Hired ||
      applicant.selectStatus === JobApplicationSelectStatus.Rejected
    ) {
      return (
        <>
          <TableCell
            className={classes.tableBody}
            width="40"
            title={t("details.shortlist")}
          >
            <IconButton disabled className={classes.gridButton}>
              {selectIcon}
            </IconButton>
          </TableCell>

          <TableCell className={classes.tableBody} width="40">
            <IconButton
              className={classes.gridButton}
              title={t("details.messageRecruiter")}
            >
              <ChatOutlined style={{ color: "#896743" }} />
            </IconButton>
          </TableCell>

          <TableCell
            className={classes.tableBody}
            width="40"
            title={t("details.removeCandidate")}
          >
            <IconButton disabled className={classes.gridButton}>
              <CancelOutlined style={{ color: "#FF725F" }} />
            </IconButton>
          </TableCell>
        </>
      );
    }

    return (
      <>
        <TableCell className={classes.tableBody} width="40">
          <IconButton
            title={t("details.shortlist")}
            className={classes.gridButton}
            onClick={() => {
              !hideDetails && props.handleSelect(applicant.id);
            }}
          >
            {selectIcon}
          </IconButton>
        </TableCell>

        <TableCell className={classes.tableBody} width="40">
          <IconButton
            title={t("details.messageRecruiter")}
            className={classes.gridButton}
            onClick={() => {
              !hideDetails && props.handleOpenModalforSendMsgRec(applicant.id);
            }}
          >
            <ChatOutlined style={{ color: "#896743" }} />
          </IconButton>
        </TableCell>

        <TableCell className={classes.tableBody} width="40">
          <IconButton
            title={t("details.removeCandidate")}
            className={classes.gridButton}
            onClick={() => {
              props.handleConfirmRemove(applicant.id);
            }}
          >
            <CancelOutlined style={{ color: "#FF725F" }} />
          </IconButton>
        </TableCell>
      </>
    );
  };

  const loadHtmlTableHeadRow = () => {
    reqExp = props.jobPost.exp;
    reqAvailDate = moment(props.jobPost.startDate);
    reqPayRate = parseFloat(props.jobPost.payRate);
    payRateType =
      props.jobPost.type === JobType.getValueByName("fullTime")
        ? t("postInterview.annum")
        : t("postInterview.hr");

    return (
      <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
        <TableRow>
          <TableCell rowSpan="2" width="45" className={classes.tableHeadTL12}>
            {t("details.rank")}
          </TableCell>
          <TableCell rowSpan="2" align="left" className={classes.tableHead}>
            {t("details.candidate")}
          </TableCell>
          <TableCell rowSpan="2" align="left" className={classes.tableHead}>
            {t("summary.agency")}
          </TableCell>
          <TableCell
            className={classes.tableHead}
            style={{ backgroundColor: "#E6F6FC" }}
            colSpan="3"
          >
            {t("details.score")}
            <IconButton
              style={{
                float: "right",
                padding: 0,
                transform: "rotate(90deg)",
              }}
              onClick={() => {
                props.handleScroll();
              }}
            >
              <PlayArrowRounded className={classes.skillMoreBtn} />
            </IconButton>
          </TableCell>
          <TableCell width="80" className={classes.tableHead}>
            {t("postInterview.experience")}
          </TableCell>
          <TableCell width="110" className={classes.tableHead}>
            {t("postInterview.availability")}
          </TableCell>
          <TableCell width="100" className={classes.tableHead}>
            {t("postInterview.compensation")}
          </TableCell>
          <TableCell className={classes.tableHead} colSpan="2" rowSpan="2">
            {t("summary.docs")}
          </TableCell>
          <TableCell className={classes.tableHeadTR12} colSpan="3" rowSpan="2">
            {t("details.actions")}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell width="90" className={classes.tableBodyScore}>
            {t("details.skills")}
            <Typography variant="caption" className={classes.colSubHead}>
              {skillWeightage}%
            </Typography>
          </TableCell>
          <TableCell
            width="90"
            className={classNames(
              classes.tableBodyScore,
              classes.tableBodyScoreMiddle
            )}
          >
            {t("summary.screening")}
            <Typography variant="caption" className={classes.colSubHead}>
              {screeningWeightage}%
            </Typography>
          </TableCell>
          <TableCell width="90" className={classes.tableBodyScore}>
            {t("details.overall")}
          </TableCell>
          <TableCell className={classes.tableHead}>{reqExp}</TableCell>
          <TableCell className={classes.tableHead}>
            {moment(reqAvailDate).format("ll")}
          </TableCell>
          <TableCell className={classes.tableHead}>
            {t("common:currencySymbol")}{formatCurrency(reqPayRate)}/
            {payRateType}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan="14" className={classes.borderRow}></TableCell>
        </TableRow>
      </TableHead>
    );
  };

  let htmlTableBodyRow = [];
  const loadHtmlTableBodyRow = () => {
    for (let index = 0; index < applicationMatrixPage.length; index++) {
      let candidate = props.jobApplications.filter(
        (c) => c.id === applicationMatrixPage[index].id
      );

      let hideDetails =
        candidate && candidate[0] && candidate[0].isPremiumCandidate
          ? isPremiumSubscribed
            ? true
            : false
          : false;
      const applicant = applicationMatrixPage[index];
      let { id, exp, availDate, payRate, selectStatus, resumeId } = applicant;
      availDate = moment(availDate);
      payRate = parseFloat(payRate);

      const expArrow =
        exp > reqExp
          ? classes.arrowGreen
          : exp === reqExp
          ? classes.arrowGreen
          : classes.arrowRed;

      const availDateArrow = moment(availDate).isSameOrBefore(
        reqAvailDate,
        t("summary.day")
      )
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

      // change bar color depending diff value

      const percSkillbarLinear = getLinearBar(
        applicant.totalSkillPerc,
        maxValues.maxSkillPerc
      );

      const ansScorebarLinear = getLinearBar(
        applicant.totalAnsScorePrc,
        maxValues.maxAnsScorePrc
      );

      const overallScorebarLinear = getLinearBar(
        applicant.overAllScore,
        maxValues.maxOverAllScore
      );

      const tblRowClassName = isRowSelected(selectStatus)
        ? classNames(classes.tableRow, classes.highlighted)
        : classes.tableRow;

      htmlTableBodyRow.push(
        <>
          <TableRow className={tblRowClassName}>
            <TableCell className={classes.tableBody}>
              <span className={classes.boxNmbr}>{applicant.rank}</span>
            </TableCell>
            <TableCell align="left" className={classes.tableBody}>
              {hideDetails ? "-----" : applicant.fname + " " + applicant.lname}
            </TableCell>
            <TableCell align="left" className={classes.tableBody}>
              {hideDetails ? "-----" : applicant.orgName}
            </TableCell>

            {/* Score */}
            <TableCell className={classes.tableBodyScore}>
              {applicant.totalSkillPerc.toFixed(1)}%{percSkillbarLinear}
            </TableCell>
            <TableCell
              className={classNames(
                classes.tableBodyScore,
                classes.tableBodyScoreMiddle
              )}
            >
              {applicant.totalAnsScorePrc.toFixed(1)}%{ansScorebarLinear}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {applicant.overAllScore.toFixed(1)}%{overallScorebarLinear}
            </TableCell>

            <TableCell className={classes.tableBody}>
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
                {t("common:currencySymbol")}{formatCurrency(payRate)}
                <ArrowDropDownCircleOutlined className={payRateArrow} />
              </Box>
            </TableCell>
            <TableCell className={classes.tableBody} width="40">
              <IconButton
                small
                className={classes.gridButton}
                title={t("details.candidateRecap")}
              >
                <AccountCircleOutlined
                  style={{ color: "#4FBEF1" }}
                  onClick={() => {
                    !hideDetails && candidateRecap(applicant.jobpostId, id);
                  }}
                />
              </IconButton>
            </TableCell>
            <TableCell className={classes.tableBody} width="40">
              <IconButton
                title={t("details.resume")}
                className={classes.gridButton}
                onClick={() => {
                  !hideDetails && props.handleShowResume(resumeId);
                }}
              >
                <DescriptionOutlined style={{ color: "#4FBEF1" }} />
              </IconButton>
            </TableCell>
            {getActionColumns(index, applicant, hideDetails)}
          </TableRow>
          <TableRow>
            <TableCell colSpan="14" className={classes.borderRow}></TableCell>
          </TableRow>
        </>
      );
    }
    return <TableBody>{htmlTableBodyRow}</TableBody>;
  };

  const getLinearBar = (value, maxValue) => {
    const skillPrcDiffFromMax = maxValue - value;
    value = value > 100 ? 100 : value;
    // change linear bar color depending diff value
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

  if (props.jobPost && applicationMatrix) {
    return (
      <Container className={classes.root}>
        <div className={classes.root}>
          <MuiThemeProvider theme={theme}>
            <FormLabel className={classes.formHeader}>
              {t("summary.summary")}
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
              "aria-label": t("postInterview.previousPage"),
            }}
            className={classes.paginationWrap}
            component="div"
            nextIconButtonProps={{
              "aria-label": t("postInterview.nextPage"),
            }}
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
              {t("summary.summary")}
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
  orgId: state.profile && state.profile.orgId,
  organization: state.organization || null,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Summary))
);
