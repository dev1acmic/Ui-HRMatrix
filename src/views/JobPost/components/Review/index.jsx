import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
// Material helpers
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
// Actions
import { getJobPost } from "services/jobPost/action";
import { loadOrganization } from "services/organization/action";
// Material components
import {
  //Details as DetailsIcon,
  GradeOutlined,
  SupervisedUserCircleOutlined,
  MonetizationOnOutlined,
  DescriptionOutlined,
  AssignmentIndOutlined,
  FlagOutlined,
  Done,
  Clear,
  WorkOutlineOutlined,
  ImportantDevicesOutlined,
  PlaceOutlined,
  CalendarTodayOutlined,
  AlarmOutlined,
  EventOutlined,
  DonutSmallOutlined,
  EventNoteOutlined,
  AssignmentOutlined,
  SchoolOutlined,
  ClassOutlined,
  ForumOutlined,
} from "@material-ui/icons";
import {
  Grid,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fade,
  Box,
} from "@material-ui/core";
import {
  JobType,
  Competency,
  Priority,
  InterviewMode,
  AnswerType,
} from "util/enum";
import {
  getFullAddress,
  getFinancialYear,
  getQuarterYear,
  formatCurrency,
  getJobTypeLang,
} from "util/helper";

// Component styles
import styles from "../styles";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmpReview:
        props.location && props.location.state && props.location.state.empReview
          ? true
          : false,
      values: {
        id: "No data available",
        title: "No title added",
        type: "No data available",
        addresssId: 0,
        departmentId: 0,
        position: "",
        startDate: "",
        endDate: "",
        payRate: "",
        description: "",
        responsibility: "",
        uniqueId: "",
        prescreening: [],
      },
    };
  }

  componentDidMount() {
    const id =
      this.props.jobId > 0 ? this.props.jobId : this.props.jobPost.data.id;
    if (id > 0) {
      this.props.getJobPost(id);
    }

    const orgId = this.props.orgId > 0 ? this.props.orgId : null;
    if (orgId > 0) {
      this.props.loadOrganization(orgId);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.jobId !== prevState.values.id)
    {
      nextProps.getJobPost(nextProps.jobId);
    }
    if (nextProps.jobPost && nextProps.jobPost.data) {
      return { values: nextProps.jobPost.data };
    }
    return null;
  }

  checkAvailability = (arr, val) => {
    return arr.some(function (arrVal) {
      if (val === arrVal["jobscreeningqtnId"]) {
        return true;
      } else {
        return false;
      }
    });
  };

  renderHTML = (markup) => {
    return <div dangerouslySetInnerHTML={{ __html: markup }} />;
  };

  render() {
    const { classes, t, i18n, finStartMonth } = this.props;
    const { values } = this.state;
    return (
      <Fade in="true" timeout="10">
        <Grid
          container
          spacing={3}
          className={classes.gridBg3}
          style={{
            backgroundImage: `url(${require(`assets/images/tab-3-bg_${i18n.language}.png`)})`,
          }}
        >
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Grid
              item
              xs={12}
              sm={8}
              className={classes.paperTwoCol}
              style={{ borderRight: "1px solid #DFE3E8" }}
            >
              <AssignmentIndOutlined
                color="secondary"
                className={classes.reviewIcon}
              />
              <div>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {values.title}
                </Typography>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("common:jobTitle")}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.paperTwoCol}>
              <FlagOutlined color="secondary" className={classes.reviewIcon} />
              <div>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {values.uniqueId}
                </Typography>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("common:jobID")}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Grid
              align="center"
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
            >
              <WorkOutlineOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.type > 0
                  ? t(`${JobType.getNameByValue(values.type)}`)
                  : "NA"}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("jobtype")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <ImportantDevicesOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.department ? values.department.name : "Not selected"}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("department")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <SupervisedUserCircleOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.position || t("common:noDataAvailable")}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("ofpositions")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <PlaceOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.addresses && values.addresses[0]
                  ? getFullAddress(values.addresses[0])
                  : "Not selected"}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("location")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <MonetizationOnOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.payRate
                  ? t("common:currencySymbol") + formatCurrency(values.payRate)
                  : t("common:noDataAvailable")}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {values.type > 2
                  ? t("Compensationhour")
                  : t("compensationannum")}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Grid
              align="center"
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
            >
              <CalendarTodayOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.startDate
                  ? moment(values.startDate).format("L")
                  : "Not selected"}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("startDate")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <AlarmOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.duration
                  ? values.duration + " Days"
                  : t("common:noDataAvailable")}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("duration")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <EventOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.endDate
                  ? moment(values.endDate).format("L")
                  : "Not selected"}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("endDate")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <DonutSmallOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.startDate
                  ? getQuarterYear(new Date(values.startDate), finStartMonth)
                  : t("common:noDataAvailable")}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:quarter")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              className={classes.gridCol}
              align="center"
            >
              <EventNoteOutlined
                color="secondary"
                className={classes.reviewIcon}
                style={{ transform: "scale(.8)" }}
              />
              <Typography
                variant="h3"
                fontSize="28"
                className={classes.reviewTitle}
              >
                {values.startDate
                  ? getFinancialYear(new Date(values.startDate), finStartMonth)
                  : t("common:noDataAvailable")}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:financialyear")}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "15px 0px 0 15px" }}
            >
              <DescriptionOutlined
                color="secondary"
                className={classes.titleIcon}
              />{" "}
              {t("jobdescription")}
            </Typography>

            <Typography
              style={{ padding: 15, width: "100%" }}
              color="textSecondary"
            >
              {values.description
                ? this.renderHTML(values.description)
                : t("common:noDataAvailable")}
            </Typography>
          </Grid>
          <br />
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "15px 0px 0 15px" }}
            >
              <AssignmentOutlined
                color="secondary"
                className={classes.titleIcon}
              />{" "}
              {t("jobresponsibilities")}
            </Typography>
            <Typography
              style={{ padding: 15, width: "100%" }}
              color="textSecondary"
            >
              {values.responsibility
                ? this.renderHTML(values.responsibility)
                : t("common:noDataAvailable")}
            </Typography>
          </Grid>
          <br />
          <Grid
            container
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "20px 0px 0 22px" }}
            >
              <GradeOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("competency.competencies")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
              <Table className={classes.tableReview}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.firstCol}>
                      {t("competency.skillToolDomain")}
                    </TableCell>
                    <TableCell align="center">{t("experienceYrs")}</TableCell>
                    <TableCell align="center">
                      {t("competency.competency")}
                    </TableCell>
                    <TableCell align="center">
                      {t("competency.mandatory")}
                    </TableCell>
                    <TableCell align="center">
                      {t("competency.priority")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.jobskills && values.jobskills.length > 0 ? (
                    values.jobskills.map((item) => {
                      return (
                        <TableRow>
                          <TableCell className={classes.firstCol}>
                            {item.name}
                          </TableCell>
                          <TableCell align="center">
                            {item.exp} {t("yrs")}
                          </TableCell>
                          <TableCell align="center">
                            {item.competency
                              ? t(
                                  `${Competency.getNameByValue(
                                    parseInt(item.competency)
                                  )}`
                                )
                              : "--"}
                          </TableCell>
                          <TableCell align="center">
                            {item.mandatory ? (
                              <Done color="secondary" />
                            ) : (
                              <Clear color="error" />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {item.priority
                              ? t(
                                  `${Priority.getNameByValue(
                                    parseInt(item.priority)
                                  )}`
                                )
                              : "--"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Grid>
          <br />
          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            style={{ flexDirection: "column" }}
            className={classes.reviewItemWrap}
          >
            <br />
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "0px 0px 30px 15px" }}
            >
              <SchoolOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("competency.education")}
            </Typography>
            {values.jobeduqualifications &&
            values.jobeduqualifications.length > 0 ? (
              values.jobeduqualifications.map((item) => {
                return (
                  <div>
                    <Typography variant="body1" className={classes.eduTitle}>
                      {item.qualification}
                    </Typography>
                    <Typography variant="body1" className={classes.eduDesc}>
                      {item.additionalInfo}
                    </Typography>
                  </div>
                );
              })
            ) : (
              <Typography>{t("common:noDataAvailable")}</Typography>
            )}

            <br />
          </Grid>
          <br />
          <Grid
            container
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "20px 0px 0 22px" }}
            >
              <ClassOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("competency.certifications")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
              <Table className={classes.tableReview}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("competency.certification")}</TableCell>
                    <TableCell align="center">
                      {t("competency.mandatory")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.jobcertifications &&
                  values.jobcertifications.length > 0 ? (
                    values.jobcertifications.map((item) => {
                      return (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">
                            {item.mandatory ? (
                              <Done color="secondary" />
                            ) : (
                              <Clear color="error" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Grid>
          <br />
          <Grid
            container
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "20px 0px 0 22px" }}
            >
              <ForumOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("common:screeningquestions")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
              <Table className={classes.tableReview}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("question")}</TableCell>
                    <TableCell align="center">{t("type")}</TableCell>
                    <TableCell align="center">{t("priority")}</TableCell>
                    <TableCell align="center">{t("answers")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.jobscreeningqtns &&
                  values.jobscreeningqtns.length > 0 ? (
                    values.jobscreeningqtns.map((item) => {
                      let answers = "";
                      if (
                        item.jobscreeningchoices &&
                        item.jobscreeningchoices.length > 0
                      ) {
                        item.jobscreeningchoices.map((ans) => {
                          if (answers === "") {
                            answers = ans.choice;
                          } else {
                            answers = answers.concat(",", ans.choice);
                          }
                        });
                      }
                      return (
                        <TableRow>
                          <TableCell>{item.question}</TableCell>
                          <TableCell align="center">
                            {item.answerType > 0
                              ? t(
                                  `${AnswerType.getNameByValue(
                                    item.answerType
                                  )}`
                                )
                              : "--"}
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            {item.priority > 0
                              ? t(`${Priority.getNameByValue(item.priority)}`)
                              : "--"}
                          </TableCell>
                          <TableCell align="center">{answers}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      {" "}
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Grid>
          <br />

          <Grid
            container
            item
            spacing={3}
            xs={12}
            lg={10}
            style={{ flexDirection: "column" }}
            className={classes.reviewItemWrap}
          >
            <br />
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "0px 0px 30px 15px" }}
            >
              <SchoolOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("interviewer")}
            </Typography>

            {values.jobinterviewers && values.jobinterviewers.length > 0 ? (
              values.jobinterviewers.map((item) => {
                return (
                  <div>
                    <Typography variant="body1" className={classes.eduTitle}>
                      <Box display="flex">
                        <Box className={classes.eduTitleL}>
                          {item.level ? "Level " + item.level : "--"}
                        </Box>
                        <Box className={classes.eduTitleR} xs="6">
                          {item.mode
                            ? t(
                                `${InterviewMode.getNameByValue(
                                  parseInt(item.mode)
                                )}`
                              )
                            : "--"}{" "}
                          {item.mode}
                        </Box>
                      </Box>
                    </Typography>
                    <Typography variant="body1" className={classes.eduDesc}>
                      {item.panelId && item.interviewpanel
                        ? item.interviewpanel.name
                        : "--"}
                    </Typography>
                  </div>
                );
              })
            ) : (
              <Typography style={{ paddingLeft: 15, fontSize: 13 }}>
                {t("common:noDataAvailable")}
              </Typography>
            )}

            <br />
          </Grid>
          <br />

          <Grid
            container
            spacing={3}
            xs={12}
            lg={10}
            className={classes.reviewItemWrap}
          >
            <Typography
              variant="h3"
              className={classes.reviewTitle}
              style={{ padding: "20px 0px 0 22px" }}
            >
              <ForumOutlined color="secondary" className={classes.titleIcon} />{" "}
              {t("competency.interviewQuestions")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
              <Table className={classes.tableReview}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("question")}</TableCell>
                    <TableCell align="center"> {t("interviewer")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.jobinterviewqtns &&
                  values.jobinterviewqtns.length > 0 ? (
                    values.jobinterviewqtns.map((item) => {
                      return (
                        <TableRow>
                          <TableCell>{item.question || "--"}</TableCell>
                          <TableCell align="center">
                            {item.panelId && item.interviewpanel
                              ? item.interviewpanel.name
                              : "--"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Grid>
        </Grid>
      </Fade>
    );
  }
}

const mapDispatchToProps = {
  getJobPost: getJobPost,
  loadOrganization,
};

const mapStateToProps = (state) => ({
  jobPost: state.jobPost,
  finStartMonth:
    (state.employer &&
      state.employer.config &&
      state.employer.config.FinStartMonth) ||
    "",
  orgId: state.profile && state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation(["jobPost", "common", "enum"])(Review)))
);
