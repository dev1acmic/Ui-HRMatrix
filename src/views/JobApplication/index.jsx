import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  withStyles,
  Container,
  Typography,
  Button,
  StepButton,
  Step,
  Stepper,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "../JobPost/style";
import { Details, Competency, Review } from "./components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import modalIcon from "assets/images/modal_ico_1.png";
import { getJobApplicationsById } from "services/jobApplication/action";
import { getJobPost } from "services/jobPost/action";
import { RatingConfirm } from "../Modals";
import { useTranslation } from "react-i18next";
import share from "common/share";
import { loadOrganization } from "services/organization/action";
import { Roles } from "util/enum";

const theme = createMuiTheme({
  palette: {
    primary: {
      contrastText: "white",
      main: "#3188C8",
      light: "#ebf8fe",
      dark: "#0270a2",
    },
    secondary: {
      contrastText: "white",
      main: "#57B894",
      light: "",
      dark: "#156a4a",
    },
  },
  overrides: {
    MuiStepButton: {
      root: {
        paddingLeft: 25,
        marginLeft: -24,
        marginRight: -25,
        paddingRight: 25,
        "&:hover svg": {
          color: "transparent!important",
          background:
            "linear-gradient(90.01deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB",
          borderRadius: "50%",
        },
        "&:hover span": {
          color: "black!important",
        },
      },
    },

    MuiStepIcon: {
      active: {
        background:
          "linear-gradient(90.01deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB",
        borderRadius: "50%",
        color: "transparent!important",
      },
    },
    MuiStepLabel: {
      label: {
        textTransform: "uppercase",
        fontSize: 12,
        color: "rgba(0, 0, 0, .5)!important",
      },
      active: {
        color: "rgba(0, 0, 0, 1)!important",
      },
    },
    // MuiStepConnector: {
    //   root: {}
    // },
    MuiStepConnector: {
      root: {
        overflowX: "auto",
        "& $line": {
          background: "#c1c1c1",
          border: "none",
          height: 3,
        },
      },
      active: {
        "& $line": {
          background:
            "linear-gradient(90.58deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB;",
          border: "none",
          height: 3,
        },
      },
      lineHorizontal: {
        borderTopWidth: 2,
      },
      completed: {
        "& $line": {
          background:
            "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
          border: "none",
          height: 3,
        },
        "& span": {
          background:
            "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
          border: "none",
          height: 3,
        },
      },
    },
  },
});

const JobApplication = (props) => {
  const { t } = useTranslation(["jobApplication", "common"]);
  const { classes, organization, role } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [loading, setloading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [modal, setModal] = React.useState(false);
  const steps = getSteps();
  const childRef = useRef();
  //const [values, setValues] = useState({});
  let [jobappId, setJobappId] = useState(null);
  let [jobPostId, setjobPostId] = useState(null);
  const [clearModal, setClearModal] = useState(false);
  const [enthusiasmPerc, setEnthusiasmPerc] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location &&
      props.location.state.jobappId
    ) {
      setJobappId(props.location.state.jobappId);
    }
  }, []);

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.jobpostId
    ) {
      setjobPostId(props.location.state.jobpostId);
    }
  }, []);

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  useEffect(() => {
    if (organization) {
      const isSubscribed = share.checkStripeTrialExist(organization);
      const isPremium =
        props.jobApplication && props.jobApplication.isPremiumCandidate
          ? true
          : false;

      if (isPremium && !isSubscribed) {
        setIsSubscribed(isSubscribed);
      }
    }
  }, [organization, props.jobApplication]);

  useEffect(() => {
    if (jobappId) {
      props.getJobApplicationsById(jobappId);
    }
  }, [jobappId]);

  useEffect(() => {
    if (jobPostId) {
      props.getJobPost(jobPostId);
    }
  }, [jobPostId]);

  useEffect(() => {
    if (props.jobApplication) {
      const JobApplication = props.jobApplication;
      const splitTabs =
        (JobApplication.tab.length > 0 && JobApplication.tab.split(",")) || [];
      let completed = [];
      if (splitTabs.length > 0) {
        splitTabs.map((t, i) => {
          if (t === "1") {
            const newCompleted = completed;
            newCompleted[i] = true;
            setCompleted(newCompleted);
          }
        });
      }
    }
  }, [props.jobApplication]);

  function getSteps() {
    return [
      t("common:jobDetails"),
      t("common:competencyParameters"),
      t("common:reviewDetails"),
    ];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Details ref={childRef} jobId={jobPostId} />;
      case 1:
        return <Competency ref={childRef} jobId={jobPostId} />;
      case 2:
        return (
          <Review
            ref={childRef}
            enthusiasmPerc={enthusiasmPerc}
            summary={summary}
          />
        );
      default:
        return "Unknown step";
    }
  }

  function totalSteps() {
    return steps.length;
  }

  function completedSteps() {
    return Object.keys(completed).length;
  }

  function isLastStep() {
    return activeStep === totalSteps() - 1;
  }

  function allStepsCompleted() {
    return completedSteps() === totalSteps();
  }

  function handleNext() {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    if (newActiveStep === 2 && completed[0] === false) {
      setActiveStep(0);
    } else {
      setActiveStep(newActiveStep);
    }
    window.scrollTo(0, 0);
  }

  const handleEdit = () => {
    setActiveStep(0);
  };

  const handleClear = () => {
    setClearModal(true);
  };

  const handleClearCancel = () => {
    setClearModal(false);
  };

  const handleClearOk = () => {
    if (activeStep === 0) {
      childRef.current.clearUnsavedData();
    } else if (activeStep === 1) {
      childRef.current.clearUnsavedData();
    }
    setClearModal(false);
  };

  // function handleBack() {
  //   setActiveStep(prevActiveStep => prevActiveStep - 1);
  // }

  const handleStep = (step) => () => {
    if (childRef.current && childRef.current.isBlocking) {
      if (window.confirm(t("unsavedAlert"))) {
        setActiveStep(step);
      }
    } else {
      setActiveStep(step);
    }
  };

  function handleComplete(c) {
    setloading(true);
    if (activeStep === 0) {
      childRef.current.saveJobApplication(c).then((res) => {
        if (res && res[0]) {
          const newCompleted = completed;
          newCompleted[activeStep] = res[1];
          setCompleted(newCompleted);
          const timer = setTimeout(() => {
            setloading(false);
          }, 1000);

          if (c) {
            handleNext();
          }

          setCompleted(newCompleted);
          return () => clearTimeout(timer);
        }
      });
    } else if (activeStep === 1) {
      childRef.current.saveJobCompetency(c).then((res) => {
        if (res && res[0]) {
          const newCompleted = completed;
          newCompleted[activeStep] = res[1];
          setCompleted(newCompleted);
          const timer = setTimeout(() => {
            setloading(false);
          }, 1000);
          if (c) {
            handleNext();
          }
          return () => clearTimeout(timer);
        }
      });
    } else if (activeStep === 2) {
      if (!isSubscribed) {
        openAlert();
      } else {
        setModal(true);
      }

      //setShowReview(true);
    }
    setloading(false);
  }

  const getJobApplicationFinalValues = (enthusiasmPerc, summary) => {
    setEnthusiasmPerc(enthusiasmPerc);
    setSummary(summary);
    finish();
    handleModalClose();
  };

  const finish = () => {
    childRef.current.finish().then((res) => {
      if (res) {
        props.history.push({
          pathname: "/rc/thank-you",
        });
      }
    });
  };

  // function handleReset() {
  //   setActiveStep(0);
  //   setCompleted({});
  // }

  function handleClose() {
    setShowReview(false);
  }

  const handleModalClose = () => {
    setModal(false);
  };

  const openAlert = () => {
    setAlert(true);
  };

  const handleCloseAlert = (isRedirect) => {
    setAlert(false);

    if (isRedirect) {
      props.history.push({
        pathname: "/rc/manage-settings",
      });
    }
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container className={classes.root}>
        <Grid item xs={12}>
          <Typography
            variant="h1"
            style={{ color: "#57B894", fontSize: "26px", fontWeight: "300" }}
          >
            {t("common:addprofile")}
          </Typography>
        </Grid>
        <div className={classes.contentWrap}>
          <MuiThemeProvider theme={theme}>
            <Stepper
              nonLinear
              activeStep={activeStep}
              className={classes.stepperRoot}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                let open = completed[0] && completed[1];
                if (index === 2 && !open) {
                  stepProps.disabled = true;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepButton
                      onClick={handleStep(index)}
                      completed={completed[index]}
                    >
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
          </MuiThemeProvider>
          <div>
            <div className={classes.tabContainer}>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep)}
              </Typography>
              {loading ? (
                <CircularProgress className={classes.progress} size={20} />
              ) : (
                <div className={classes.buttonBar}>
                  {activeStep !== totalSteps() - 1 ? (
                    <Button onClick={handleClear} className={classes.button}>
                      {t("common:clear")}
                    </Button>
                  ) : (
                    <Button onClick={handleEdit} className={classes.button}>
                      {t("common:edit")}
                    </Button>
                  )}
                  {!isLastStep() ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={(event) => handleComplete(false)}
                    >
                      {t("common:saveforLater")}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(activeStep === 0 ||
                    (activeStep === 1 && completed && completed[0]) ||
                    (activeStep === 2 &&
                      completed &&
                      completed[0] &&
                      completed[1])) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(event) => handleComplete(true)}
                    >
                      {activeStep === 2
                        ? t("finish")
                        : t("common:saveandcontinue")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <Dialog
        open={showReview}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
            Job post confirmation
          </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <div style={{ textAlign: "center", padding: "30px" }}>
                <img
                  alt="HR Matrix"
                  src={modalIcon}
                  Component=""
                  style={{ width: "60px" }}
                />
              </div>
              <Typography variant="h6">
                {t("candReadyfrEmployer")}
                <br />
                <br />
                {t("reviewCandAlert")}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              style={{ backgroundColor: "#bfbfbf" }}
              className={classes.button}
              onClick={handleClose}
            >
              {t("reviewCand")}
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={finish}
              className={classes.ctaButton}
            >
              {t("common:submit")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog
        open={clearModal}
        onClose={handleClearCancel}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">CLEAR DATA</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("clearDataAlert")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            {t("common:cancel")}
          </Button>
          <Button onClick={handleClearOk} color="primary" autoFocus>
            {t("common:ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={alert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("activateSubscription")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                {role && role.id === Roles.AgencyAdmin
                  ? t("subscribeAlert")
                  : t("subscriptionAlertAdmin")}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>

        {role && role.id === Roles.Recruiter && (
          <DialogActions>
            <Button onClick={() => handleCloseAlert(false)} color="primary">
              {t("common:ok")}
            </Button>
          </DialogActions>
        )}

        {role && role.id === Roles.AgencyAdmin && (
          <DialogActions>
            <Button onClick={() => handleCloseAlert(false)} color="primary">
              {t("common:doLater")}
            </Button>
            <Button onClick={() => handleCloseAlert(true)} color="primary">
              {t("common:buyNow")}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Modal
        aria-labelledby="Process Complete"
        aria-describedby="Process Complete"
        open={modal}
        //onClose={handleModalClose}
      >
        <RatingConfirm
          onCancel={handleModalClose}
          getJobApplicationFinalValues={getJobApplicationFinalValues}
        />
      </Modal>
    </DashboardLayout>
  );
};
const mapDispatchToProps = {
  getJobPost: getJobPost,
  getJobApplicationsById: getJobApplicationsById,
  loadOrganization,
};

const mapStateToProps = (state) => ({
  // jobPost: (state.jobPost && state.jobPost.data) || null,
  jobApplication: (state.jobApplication && state.jobApplication.data) || null,
  organization: state.organization,
  orgId: state.profile && state.profile.orgId,
  role: state.profile && state.profile.roles && state.profile.roles[0],
});
JobApplication.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(JobApplication))
);
