import React, { useEffect, useRef } from "react";
import {
  Container,
  Box,
  withStyles,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import {
  WorkOutlineOutlined,
  CompareArrowsOutlined,
  HowToRegOutlined,
  StarBorderOutlined,
  GamesOutlined,
  AddOutlined,
  CardMembershipOutlined,
} from "@material-ui/icons";
import styles from "./style";
import { useTranslation } from "react-i18next";

import { connect } from "react-redux";
import {
  getJobApplicationsById,
  getJobApplicationsByJobPost,
  getFile,
  getApplicantAssessmentLevelsAndScore,
} from "services/jobApplication/action";
import { JobApplicationSelectStatus } from "util/enum";

import {
  Timeline,
  Paginate,
  TopBar,
  Swot,
  BarChart,
  PieChart,
  BubbleChart,
  RadialBarChart,
  RadarChart,
  PrintHeader,
} from "./components/";
import { getApplicatSkillMatrix, paginate } from "util/helper";
import Popout from "react-popout";

import nodata from "assets/images/nodata-graph.png";

const Recap = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const pageSize = 1;
  const [loading, setLoading] = React.useState(true);
  const [state, setState] = React.useState();
  const [applicant, setApplicant] = React.useState(null);
  const [applicationMatrix, setApplicationMatrix] = React.useState(null);
  const [resumePopOut, setResumePopOut] = React.useState(null);
  const [assessment, setAssessment] = React.useState(null);

  const componentRef = useRef();

  useEffect(() => {
    let jobApplId;
    const jobPostId = props.match.params ? props.match.params.jobPostId : null;

    if (props.location.state && props.location.state.jobApplId) {
      jobApplId = props.location.state.jobApplId;
    } else if (props.match.params && props.match.params.jobApplId) {
      jobApplId = props.match.params.jobApplId;
    }
    setState({ ...state, jobApplId: parseInt(jobApplId) });
    if (jobPostId > 0) {
      props
        .getJobApplicationsByJobPost(
          jobPostId,
          [JobApplicationSelectStatus.Removed],
          -1
        )
        .then((res) => {
          if (jobApplId > 0) {
            props.getJobApplicationsById(jobApplId);
            props.getApplicantAssessmentLevelsAndScore(jobApplId);
          }
        });
    }
  }, []);

  useEffect(() => {
    let appln = props.jobApplication;
    if (appln && applicationMatrix) {
      let index = applicationMatrix.findIndex((c) => c.id === appln.id);
      if (index !== -1) {
        appln = { ...applicationMatrix[index], ...appln };
        setState({ ...state, pageNo: index + 1 });
        setApplicant(appln);
        setLoading(false);
      }
    }
  }, [props.jobApplication]);

  useEffect(() => {
    if (props.jobApplications) {
      getApplicatSkillMatrix(props.jobApplications).then((result) => {
        setApplicationMatrix(result.applicantSkillMatrix);
      });
    }
  }, [props.jobApplications]);

  useEffect(() => {
    let assessment = props.assessmentLevelScore;
    if (assessment) {
      setAssessment(assessment);
    }
  }, [props.assessmentLevelScore]);

  const handlePaginate = (next) => {
    let pageNo = state.pageNo + next;
    const applicant = paginate(applicationMatrix, pageSize, pageNo)[0];
    props.getJobApplicationsById(applicant.id);
    props.getApplicantAssessmentLevelsAndScore(applicant.id);
  };

  const handleShowResume = async () => {
    setResumePopOut(null);
    const id = applicant.resumeId;
    if (!id) {
      return;
    }
    let res = await props.getFile(id);
    //console.log(resumeUpload);
    if (res.status) {
      const { url, originalName } = res.result;
      setResumePopOut({ url: url, title: originalName, isOpen: true });
    }
  };

  const handleCloseFile = () => {
    setResumePopOut(null);
  };

  const popOutHtml = () => {
    if (resumePopOut && resumePopOut.isOpen) {
      return (
        <Popout
          url={resumePopOut.url}
          title={resumePopOut.title}
          options={{ height: "300", width: "600" }}
          onClosing={handleCloseFile}
        >
          <div>{t("wait")}</div>
        </Popout>
      );
    }
    return;
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      {loading && (
        <div
          className={classes.progressWrapper}
          style={{
            width: "100%",
            height: 500,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CircularProgress style={{ height: 30, width: 30 }} />
        </div>
      )}
      {applicant && (
        <Container className={classes.root}>
          <Paginate
            handlePaginate={handlePaginate}
            totalPage={applicationMatrix.length}
            currentPage={state.pageNo}
            componentRef={componentRef}
            handleShowResume={handleShowResume}
          />
          <div>
            <TopBar
              applicant={applicant}
              applicationMatrix={applicationMatrix}
              getFile={props.getFile}
            />
            <Grid container spacing="0" className={classes.gridWrap}>
              <Grid
                className={classes.colLeft}
                item
                spacing="0"
                sm={12}
                md={3}
                xs={12}
              >
                <Typography variant="h2" className={classes.heading}>
                  <WorkOutlineOutlined /> {t("common:careertimeline")}
                </Typography>
                <Timeline applicant={applicant} />
              </Grid>

              <Grid className={classes.colRight} item sm={12} md={9} xs={12}>
                <Grid container item>
                  <Grid item sm={12}>
                    <Box className={classes.comparisonWrap}>
                      <Typography variant="h2" className={classes.heading}>
                        <CompareArrowsOutlined />{" "}
                        {t("common:skillsrequirementvsactualexperience")}
                      </Typography>
                      {/* <img src={chart1} style={{ width: "90%" }} /> */}

                      <BarChart
                        applicantSkills={applicant.skills}
                        exp={applicant.exp}
                      />
                    </Box>
                  </Grid>
                  {/* <Grid item sm={12}>
                    <Box
                      className={classes.comparisonWrap}
                      style={{ paddingBottom: 50 }}
                    >
                      <Typography variant="h2" className={classes.heading}>
                        <CompareArrowsOutlined /> {t("common:prominentskills")}
                      </Typography>
                      <BubbleChart applicantSkills={applicant.skills} />
                    </Box>
                  </Grid> */}
                  <Grid container item>
                    <Grid
                      item
                      sm={6}
                      style={{
                        borderRight: " 1px solid #e4e4e4",
                        borderRadius: 0,
                      }}
                    >
                      <Box className={classes.chartWrap}>
                        <Typography variant="h2" className={classes.heading}>
                          <CardMembershipOutlined /> Prominent Skills
                        </Typography>
                        <BubbleChart applicantSkills={applicant.skills} />
                        <br />
                        <Typography
                          variant="h2"
                          className={classes.heading}
                          style={{ marginTop: 20 }}
                        >
                          <HowToRegOutlined />
                          {t("common:interviewresults")}
                        </Typography>

                        <RadialBarChart
                          assessment={assessment}
                          screening={applicant.overAllScore}
                        />
                      </Box>
                    </Grid>
                    <Grid item sm={6} style={{ borderRadius: 0 }}>
                      <Box className={classes.chartWrap}>
                        <Typography variant="h2" className={classes.heading}>
                          <StarBorderOutlined /> Skills Proficiency
                        </Typography>
                        <PieChart applicantSkills={applicant.skills} />
                        <br />
                        &nbsp;
                        <Typography
                          variant="h2"
                          className={classes.heading}
                          style={{ marginTop: 20 }}
                        >
                          <GamesOutlined /> {t("common:softskills")}
                        </Typography>
                        {assessment && assessment.length > 0 ? (
                          <RadarChart assessment={assessment} />
                        ) : (
                          <div style={{ position: "relative" }}>
                            <img
                              alt="No data"
                              src={nodata}
                              style={{ width: "90%", marginTop: "-8%" }}
                            />

                            <Typography
                              style={{
                                position: "absolute",
                                //top: 0,
                                right: 0,
                                bottom: 30,
                                left: 0,
                              }}
                            >
                              {t("noDatatoDisplay")}
                            </Typography>
                          </div>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Typography
                variant="h2"
                className={classes.heading}
                style={{ marginBottom: -50, marginLeft: 20 }}
              >
                <AddOutlined /> {t("swotanalysis")}
              </Typography>
              <Swot applicant={applicant} />
            </Grid>
          </div>
          {/*Print PDF */}
          <div
            style={{
              visibility: "hidden",
              position: "absolute",
              top: "-999em",
            }}
          >
            <div ref={componentRef}>
              <Grid
                container
                spacing="0"
                className={classes.gridWrap}
                style={{
                  border: "none",
                  boxShadow: "none",
                  marginTop: 0,
                }}
              >
                <Grid
                  className={classes.colRight}
                  item
                  xs={12}
                  style={{
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <PrintHeader
                    applicant={applicant}
                    applicationMatrix={applicationMatrix}
                    getFile={props.getFile}
                  />
                </Grid>
                <Grid
                  className={classes.colRight}
                  item
                  xs={6}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    borderRight: "1px solid #ccc",
                    borderRadius: 0,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{
                        paddingLeft: 40,
                        paddingTop: 20,
                        marginBottom: -20,
                      }}
                    >
                      {t("common:prominentskills")}
                    </Typography>
                    <BubbleChart
                      applicantSkills={applicant.skills}
                      isPrint={true}
                    />
                  </Box>
                </Grid>
                <Grid
                  className={classes.colRight}
                  item
                  xs={6}
                  style={{
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{
                        paddingLeft: 40,
                        paddingTop: 20,
                        marginBottom: 0,
                      }}
                    >
                      <StarBorderOutlined /> Skills Proficiency
                    </Typography>
                    <PieChart
                      applicantSkills={applicant.skills}
                      isPrint={true}
                    />
                  </Box>
                </Grid>
                <Grid
                  className={classes.colRight}
                  item
                  xs={6}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    borderTop: "1px solid #ccc",
                    borderRadius: 0,
                  }}
                >
                  <Box
                    className={classes.chartWrap}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      borderRight: "1px solid #ccc",
                    }}
                  >
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{ paddingLeft: 20, marginBottom: 0 }}
                    >
                      <HowToRegOutlined />
                      {t("common:interviewresults")}
                    </Typography>

                    <RadialBarChart
                      isPrint={true}
                      assessment={assessment}
                      screening={applicant.overAllScore}
                    />
                  </Box>
                </Grid>
                <Grid
                  className={classes.colRight}
                  item
                  xs={6}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    borderTop: "1px solid #ccc",
                    borderRadius: 0,
                  }}
                >
                  <Box
                    className={classes.chartWrap}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{
                        paddingLeft: 20,
                        marginBottom: 0,
                      }}
                    >
                      <GamesOutlined /> {t("common:softskills")}
                    </Typography>
                    {assessment && assessment.length > 0 ? (
                      <RadarChart assessment={assessment} isPrint={true} />
                    ) : (
                      <div
                        style={{
                          position: "relative",
                          height: 250,
                        }}
                      >
                        <img
                          alt="No data"
                          src={nodata}
                          style={{ width: "280px", marginTop: "-30px" }}
                        />

                        <Typography
                          style={{
                            position: "absolute",
                            //top: 0,
                            right: 0,
                            bottom: 10,
                            left: 0,
                          }}
                        >
                          {t("noDatatoDisplay")}
                        </Typography>
                      </div>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <div
                style={{
                  pageBreakAfter: "always",
                  marginTop: -150,
                  visibility: "hidden",
                }}
              >
                {t("test")}
              </div>

              <Grid
                container
                spacing="0"
                className={classes.gridWrap}
                style={{
                  border: "none",
                  boxShadow: "none",
                  margin: 0,
                  height: "100%",
                }}
              >
                <Grid
                  className={classes.colRight}
                  item
                  xs={4}
                  style={{
                    backgroundColor: "#EBF2FB",
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "0",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    item
                    spacing="0"
                    xs={12}
                    style={{ padding: "25px 10px 25px 30px" }}
                  >
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{ marginBottom: 50 }}
                    >
                      <WorkOutlineOutlined /> {t("common:careertimeline")}
                    </Typography>
                    <Timeline applicant={applicant} isPrint={true} />
                  </Grid>
                </Grid>
                <Grid
                  className={classes.colRight}
                  item
                  xs={8}
                  style={{ border: "none", boxShadow: "none" }}
                >
                  <Grid item spacing="0" xs={12}>
                    <Typography
                      variant="h2"
                      className={classes.heading}
                      style={{
                        marginLeft: 20,
                        paddingTop: 25,
                      }}
                    >
                      <AddOutlined />
                      {t("swotanalysis")}
                    </Typography>
                    <Swot applicant={applicant} isPrint={true} />
                  </Grid>
                </Grid>
                <Typography
                  style={{
                    width: "100%",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    bottom: "-1100px",
                  }}
                >
                  {t("providedBy")}
                </Typography>
              </Grid>
            </div>
          </div>

          {popOutHtml()}
        </Container>
      )}
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobApplicationsById,
  getJobApplicationsByJobPost,
  getFile,
  getApplicantAssessmentLevelsAndScore,
};

const mapStateToProps = (state) => ({
  jobApplication: (state.jobApplication && state.jobApplication.data) || null,
  jobApplications: (state.jobApplication && state.jobApplication.query) || null,
  assessmentLevelScore:
    (state.jobApplication &&
      state.jobApplication.assessmentLevelScore &&
      state.jobApplication.assessmentLevelScore.data) ||
    null,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Recap));
