import React, { Component, useEffect } from "react";
import { connect } from "react-redux";

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import {
  createJobPost,
  clearJobPost,
  isConfigDetailsExists,
  checkOrgHasTA,
} from "services/jobPost/action";
import { isRoleTA, isRoleAdmin } from "util/roleUtil";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "./style";
import { Details, Competency, Review } from "./components";
import Loader from "assets/images/loader.png";
import modalIcon from "assets/images/modal_ico_1.png";
import { loadAddresses } from "services/employer/action";
import SmallLogo from "assets/images/logo-small.png";
import share from "common/share";
import { withTranslation } from "react-i18next";
import { JobType } from "util/enum";

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
          //color: "transparent!important",
          // background:
          //   "linear-gradient(90.01deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB",
          // borderRadius: "50%"
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
      completed: {
        backgroundColor: "white",
        borderRadius: "50%",
        color: "#57B894!important",
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
    MuiStepConnector: {
      root: {
        overflowX: "auto",
        "& $line": {
          background: "#c1c1c1",
          border: "none",
          height: 3,
        },
      },
      lineHorizontal: {
        borderTopWidth: 2,
      },
      // active: {
      //   "& $line": {
      //     background:
      //       "linear-gradient(90.58deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB;",
      //     border: "none",
      //     height: 3
      //   }
      // },
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

class PostJ extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      jobId:
        props.history.location &&
        props.history.location.state &&
        props.history.location.state.id
          ? props.history.location.state.id
          : props.match.params.jobPostId
          ? props.match.params.jobPostId
          : 0,
      activeStep:
        (props.location &&
          props.location.state &&
          props.location.state.review) ||
        (props.location &&
          props.location.state &&
          props.location.state.empReview)
          ? 2
          : 0,
      completed: [],
      showError: false,
      disableBtn: false,
      clearModal: false,
      pendingConfigAlert: false,
      isReview:
        props.location && props.location.state && props.location.state.review
          ? true
          : false,
      isEmpReview:
        props.location && props.location.state && props.location.state.empReview
          ? true
          : false,
      isAdmin: false,
      alert: false,
    };
  }

  componentDidMount = async () => {
    this.props.clearJobPost();
    if (this.props.profile.type && this.props.profile.type === 1) {
      const orgId = this.props.profile.orgId;
      this.props.loadAddresses(orgId);
      this.props.isConfigDetailsExists(orgId).then((res) => {
        if (!res) {
          this.setState({ pendingConfigAlert: true });
        } else {
          if (this.props.addresses && this.props.addresses.length === 0) {
            this.setState({ pendingConfigAlert: true });
          } else {
            this.setState({ pendingConfigAlert: false });
          }
        }
      });
    } else {
      this.setState({ pendingConfigAlert: false });
    }
    if (this.props.profile && isRoleTA(this.props.profile.roles)) {
      this.setState({ isRoleTA: true });
    } else {
      //check if organization has role TA
      const res = await this.props.checkOrgHasTA();
      if (res) {
        this.setState({ hasRoleTA: true, taUserIds: res });
      }
    }

    if (this.props.profile && isRoleAdmin(this.props.profile.roles)) {
      this.setState({ isAdmin: true });
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {  
  let jobId = 
  nextProps.history.location &&
  nextProps.history.location.state &&
  nextProps.history.location.state.id
          ? nextProps.history.location.state.id 
          : 0;
    let activeStep = 
        (nextProps.location &&
          nextProps.location.state &&
          nextProps.location.state.empReview)
          ? 2
          : 0;

    
    if (nextProps.jobPost && !prevState.flag) {
      const splitTabs =
        (nextProps.jobPost.tab.length > 0 &&
          nextProps.jobPost.tab.split(",")) ||
        [];
      let completed = [];
      if (splitTabs.length > 0) {
        splitTabs.map((t, i) => {
          if (t === "1") {
            return (completed[i] = t);
          }
        });
      }

      return { completed: completed, flag: true};
    }
    if(jobId && activeStep)
    {
      return { jobId:jobId ,activeStep:activeStep };
    }
  }

  totalSteps = () => {
    return this.getSteps().length;
  };

  completedSteps = () => {
    return Object.keys(this.state.completed).length;
  };

  isLastStep = () => {
    return this.state.activeStep === this.totalSteps() - 1;
  };

  allStepsCompleted = () => {
    return this.completedSteps() === this.totalSteps();
  };

  getSteps = () => {
    return [
      this.props.t("common:jobDetails"),
      this.props.t("common:competencyParameters"),
      this.props.t("common:reviewDetails"),
    ];
  };

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Details
            onRef={(ref) => (this.childDetails = ref)}
            showError={this.state.showError}
            configAlert={this.state.pendingConfigAlert}
            configClose={this.handleCloseWarning}
            jobId={this.state.jobId}
            hideBtn={this.props.jobPost && this.props.jobPost.status > 2}
          />
        );
      case 1:
        return (
          <Competency
            onRef={(ref) => (this.childCompetency = ref)}
            showError={this.state.showError}
            hideBtn={this.props.jobPost && this.props.jobPost.status > 2}
          />
        );
      case 2:
        return <Review jobId={this.state.jobId} />;
      default:
        return "Unknown step";
    }
  };
  save = () => {
    this.setState({ loading: true });
    if (this.state.activeStep === 0) {
      this.childDetails.saveJobPost().then((res) => {
        if (res) {
          this.checkTabsAndMarkAsComplete(false);
        } else {
          this.setState({ loading: false });
        }
      });
    } else if (this.state.activeStep === 1) {
      this.childCompetency.saveCompetancy().then((res) => {
        if (res) {
          this.checkTabsAndMarkAsComplete(false);
        } else {
          this.setState({ loading: false });
        }
      });
    } else if (this.state.activeStep === 2) {
      this.checkTabsAndMarkAsComplete(false);
      this.setState({ loading: false });
    }
  };

  handleCloseAlert = (isRedirect) => {
    this.setState({ alert: false });

    if (isRedirect) {
      this.props.history.push({
        pathname: "/rc/manage-firm",
        state: { activeTab: 2 },
      });
    }
  };

  handleClose = () => {
    this.setState({ showError: false });
  };
  handleCloseWarning = () => {
    this.setState({ pendingConfigAlert: false });
  };
  handleNext = () => {
    const newActiveStep =
      this.isLastStep() && !this.allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          this.getSteps().findIndex((step, i) => !(i in this.state.completed))
        : this.isLastStep()
        ? this.state.activeStep
        : this.state.activeStep + 1;
    this.setState({ activeStep: newActiveStep, loading: false });
    window.scrollTo(0, 0);

    //setActiveStep(newActiveStep);
  };

  handleBack = () => {
    this.setState({ prevActiveStep: this.state.prevActiveStep - 1 });
    //setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  handleClear = () => {
    this.setState({ clearModal: true });
  };
  handleClearCancel = () => {
    this.setState({ clearModal: false });
  };

  handleClearOk = () => {
    if (this.state.activeStep === 0) {
      this.childDetails.clearUnsavedData();
    } else if (this.state.activeStep === 1) {
      this.childCompetency.clearUnsavedData();
    }
    this.setState({ clearModal: false });
  };

  handleEdit = () => {
    this.setState({ isReview: false, activeStep: 0 });
  };

  handleStep = (step) => async () => {
    let res;
    if (this.state.activeStep === 0) {
      res = this.childDetails.checkUnsavedData();
    } else if (this.state.activeStep === 1) {
      res = this.childCompetency.checkUnsavedData();
    }
    if (res) {
      if (
        window.confirm(
          "You have unsaved changes on this page. Do you want to leave this page ?"
        )
      ) {
        this.setState({ activeStep: step });
      }
    } else {
      this.setState({ activeStep: step });
    }
  };

  checkTabsAndMarkAsComplete = (isContinue = true) => {
    if (
      this.state.activeStep === 2 &&
      this.props.errors &&
      Object.entries(this.props.errors).length > 0 &&
      ((this.props.errors.competencyError &&
        Object.entries(this.props.errors.competencyError).length > 0) ||
        (this.props.errors.detailsError &&
          Object.entries(this.props.errors.detailsError).length > 0))
    ) {
      //has error
      this.setState({ showError: true, loading: false });
    } else if (
      this.state.activeStep === 1 &&
      this.props.errors &&
      isContinue &&
      Object.entries(this.props.errors).length > 0 &&
      this.props.errors.detailsError &&
      Object.entries(this.props.errors.detailsError).length > 0
    ) {
      //has error
      this.setState({ showError: true, activeStep: 0, loading: false });
    } else {
      let tab = this.props.jobPost && this.props.jobPost.tab;
      if (tab) {
        if (this.state.activeStep === 2) {
          tab = "1,1,1";
          const status = this.state.hasRoleTA ? 2 : 3; //2:completed,3:approved
          let jobPrice = 0;
          if (this.props.jobPost.type === JobType.getValueByName("fullTime")) {
            jobPrice = process.env.REACT_APP_STRIPE_JOB_PRICE;
          } else if (
            this.props.jobPost.type === JobType.getValueByName("partTime")
          ) {
            jobPrice = process.env.REACT_APP_STRIPE_JOB_PARTTIME_PRICE;
          } else if (
            this.props.jobPost.type === JobType.getValueByName("contract")
          ) {
            jobPrice = process.env.REACT_APP_STRIPE_JOB_CONTRACT_PRICE;
          } else if (
            this.props.jobPost.type === JobType.getValueByName("internship")
          ) {
            jobPrice = process.env.REACT_APP_STRIPE_JOB_INTERNSHIP_PRICE;
          } else {
            jobPrice = process.env.REACT_APP_STRIPE_JOB_SEASONAL_PRICE;
          }
          this.props
            .createJobPost(
              {
                id: this.props.jobPost.id,
                tab,
                status,
                taUserIds: this.state.taUserIds,
                statusChangedBy: this.props.profile.id,
                stausUpdatedDate: new Date(),
                isFinalSubmit: true,
                priceId: jobPrice,
                // priceId: process.env.REACT_APP_STRIPE_JOB_PRICE,
              },
              null
            )
            .then((res) => {
              if (res) {
                this.props.history.push(
                  "/rc/thankyou/" + this.props.jobPost.id
                );
              }
            });
        } else if (this.state.activeStep === 2 && tab === "1,1,1") {
          this.props.history.push("/rc/thankyou/" + this.props.jobPost.id);
        }
        const splitTabs = tab.split(",");
        if (splitTabs[this.state.activeStep] === "1") {
          const newCompleted = this.state.completed;
          newCompleted[this.state.activeStep] = true;
          this.setState({ completed: newCompleted, loading: false });
        } else {
          const newCompleted = this.state.completed;
          if (newCompleted[this.state.activeStep]) {
            delete newCompleted[this.state.activeStep];
          }
          this.setState({ completed: newCompleted, loading: false });
        }
      }
      if (isContinue) {
        this.handleNext();
      }
    }
  };

  handleCommentChange = (value) => {
    const newState = { ...this.state };
    newState.comments = value;
    this.setState(newState);
  };

  approveOrRejectJob = (status) => {
    if (this.state.activeStep === 2) {
      const tab = "1,1,1";
      let jobPrice = 0;
      if (this.props.jobPost.type === JobType.getValueByName("fullTime")) {
        jobPrice = process.env.REACT_APP_STRIPE_JOB_PRICE;
      } else if (
        this.props.jobPost.type === JobType.getValueByName("partTime")
      ) {
        jobPrice = process.env.REACT_APP_STRIPE_JOB_PARTTIME_PRICE;
      } else if (
        this.props.jobPost.type === JobType.getValueByName("contract")
      ) {
        jobPrice = process.env.REACT_APP_STRIPE_JOB_CONTRACT_PRICE;
      } else if (
        this.props.jobPost.type === JobType.getValueByName("internship")
      ) {
        jobPrice = process.env.REACT_APP_STRIPE_JOB_INTERNSHIP_PRICE;
      } else {
        jobPrice = process.env.REACT_APP_STRIPE_JOB_SEASONAL_PRICE;
      }
      this.props
        .createJobPost(
          {
            id: this.props.jobPost.id,
            tab,
            status,
            comments: this.state.comments,
            statusChangedBy: this.props.profile.id,
            stausUpdatedDate: new Date(),
            priceId: jobPrice,
            // priceId: process.env.REACT_APP_STRIPE_JOB_PRICE,
          },
          null
        )
        .then((res) => {
          if (res) {
            if (status === 3) {
              this.props.history.push(
                "/rc/thankyou/" + this.props.jobPost.id + "/" + status
              );
            } else {
              this.props.history.push("/rc/dashboard");
            }
          }
        });
    }
    const newCompleted = this.state.completed;
    if (newCompleted[this.state.activeStep]) {
      delete newCompleted[this.state.activeStep];
    }
    this.setState({ completed: newCompleted, loading: false });
  };

  handleComplete = async () => {
    this.setState({ loading: true });
    if (this.state.activeStep === 0) {
      this.childDetails.saveAndContinueJobPost().then((res) => {
        if (res) {
          this.checkTabsAndMarkAsComplete();
        } else {
          this.setState({ loading: false });
        }
      });
    } else if (this.state.activeStep === 1) {
      this.childCompetency.saveAndContinueCompetancy().then((res) => {
        if (res) {
          this.checkTabsAndMarkAsComplete();
        } else {
          this.setState({ loading: false });
        }
      });
    } else if (this.state.activeStep === 2) {
      this.setState({ showReviewPopup: true, loading: false });

      //this.checkTabsAndMarkAsComplete();
    }
  };

  handleConfirmReview = () => {
    this.setState({ showReviewPopup: false });
    this.checkTabsAndMarkAsComplete();
  };

  handleCancelReview = () => {
    this.setState({ showReviewPopup: false });
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
    this.setState({ completed: [] });
    //setActiveStep(0);
    //setCompleted({});
  };

  handleReject = () => {
    this.setState({ showRejectPopup: true });
  };

  handleConfirmReject = () => {
    this.setState({ showRejectPopup: false });
    this.approveOrRejectJob(4);
  };

  handleCancelReject = () => {
    this.setState({ showRejectPopup: false });
  };

  handleApprove = () => {
    this.setState({ showApprovePopup: true });
  };

  handleConfirmApprove = () => {
    this.setState({ showApprovePopup: false });
    this.approveOrRejectJob(3);
  };

  openAlert = () => {
    this.setState({ alert: true });
  };

  handleCancelApprove = () => {
    this.setState({ showApprovePopup: false });
  };

  loader = () => {
    const loadStyle = {
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "75px",
      height: "75px",
    };

    return (
      <span style={loadStyle}>
        <img src={Loader} width="75" alt="loading" />
        <img src={SmallLogo} width="75" alt="loading" />
      </span>
    );
  };

  render() {
    const { classes, jobPost, organization, t } = this.props;
    const hideBtn = jobPost && jobPost.status > 2;
    const isSubscribed = share.checkStripeTrialExist(organization);

    // if (this.state.viewLoading) {
    //   return (
    //     // <div
    //     //   className={classes.progressWrapper}
    //     //   style={{
    //     //     width: "100%",
    //     //     alignItems: "center",
    //     //     justifyContent: "center",
    //     //     display: "flex",
    //     //     marginBottom: 30
    //     //   }}
    //     // >
    //     //   <CircularProgress style={{ height: 30, width: 30 }} />
    //     // </div>
    //     this.loader()
    //   );
    // }
    return (
      <DashboardLayout title={t("common:dashboard")}>
        <Container className={classes.root} style={{ position: "relative" }}>
          <div className={classes.contentWrap}>
            {!this.state.isReview ? (
              this.state.isEmpReview ? (
                <Grid
                  container
                  item
                  spacing={3}
                  className={classes.formContainer}
                >
                  <Grid item xs={12}>
                    <Typography variant="h1" className={classes.pageTitle}>
                      {t("common:jobDetails")}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <MuiThemeProvider theme={theme}>
                  <Stepper
                    nonLinear
                    activeStep={this.state.activeStep}
                    className={classes.stepperRoot}
                  >
                    {this.getSteps().map((label, index) => {
                      const stepProps = {};
                      if (index === 2 && this.completedSteps() < 2) {
                        stepProps.disabled = true;
                      }
                      return (
                        <Step key={label} {...stepProps}>
                          <StepButton
                            onClick={this.handleStep(index)}
                            completed={this.state.completed[index]}
                          >
                            {label}
                          </StepButton>
                        </Step>
                      );
                    })}
                  </Stepper>
                </MuiThemeProvider>
              )
            ) : null}
            <div>
              {/* {this.allStepsCompleted() ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : ( */}
              <div className={classes.tabContainer}>
                <Typography className={classes.instructions}>
                  {this.getStepContent(this.state.activeStep)}
                </Typography>
                {!hideBtn && !this.state.loading ? (
                  <div className={classes.buttonBar}>
                    {this.state.activeStep !== this.totalSteps() - 1 ? (
                      <Button
                        onClick={this.handleClear}
                        className={classes.button}
                      >
                        {t("common:clear")}
                      </Button>
                    ) : (
                      <Button
                        onClick={this.handleEdit}
                        className={classes.button}
                      >
                        {t("common:edit")}
                      </Button>
                    )}
                    {this.state.activeStep !== this.totalSteps() - 1 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.save}
                        className={classes.button}
                      >
                        {t("common:saveforLater")}
                      </Button>
                    )}
                    {this.state.isRoleTA &&
                    this.state.activeStep === this.totalSteps() - 1 ? (
                      <span>
                        <Button
                          variant="contained"
                          style={{ marginRight: 10 }}
                          onClick={this.handleReject}
                        >
                          {t("common:reject")}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={
                            this.state.activeStep === this.totalSteps() - 1 &&
                            !isSubscribed
                              ? this.openAlert
                              : this.handleApprove
                          }
                        >
                          {t("common:approve")}
                        </Button>
                      </span>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={
                          this.state.activeStep === this.totalSteps() - 1 &&
                          !isSubscribed
                            ? this.openAlert
                            : this.handleComplete
                        }
                      >
                        {this.state.activeStep === this.totalSteps() - 1
                          ? t("common:submit")
                          : t("saveContinue")}
                      </Button>
                    )}
                  </div>
                ) : (
                  this.state.loading && (
                    <CircularProgress className={classes.progress} size={20} />
                  )
                )}
              </div>
            </div>
          </div>
        </Container>

        {/* <MessageBox
          open={this.state.showError}
          variant="error"
          onClose={this.handleClose}
          message="Incomplete job posting. Please fill all the required fields!"
        /> */}

        <Dialog
          open={this.state.alert}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Activate Subscription"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid item xs={12} style={{ textAlign: "left" }}>
                <Typography variant="h8">
                  {!this.state.isAdmin
                    ? t("common:subscriptionAlertAdmin")
                    : t("common:subscriptionAlert")}
                </Typography>
              </Grid>
            </DialogContentText>
          </DialogContent>

          {!this.state.isAdmin && (
            <DialogActions>
              <Button
                onClick={() => this.handleCloseAlert(false)}
                color="primary"
              >
                {t("common:ok")}
              </Button>
            </DialogActions>
          )}

          {this.state.isAdmin && (
            <DialogActions>
              <Button
                onClick={() => this.handleCloseAlert(false)}
                color="primary"
              >
                {t("common:doLater")}
              </Button>
              <Button
                onClick={() => this.handleCloseAlert(true)}
                color="primary"
              >
                {t("common:buyNow")}
              </Button>
            </DialogActions>
          )}
        </Dialog>

        <Dialog
          open={this.state.showError}
          onClose={this.handleClose}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("common:errMsg.incompleteInfo")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("common:errMsg.fillReqInfo")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.showReviewPopup}
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
                {this.state.hasRoleTA ? (
                  <Typography variant="h6">
                    {t("submitJob")}
                    <br />
                    <br />
                    {t("reviewJobAlert")}
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    {t("readytoSubmit")}
                    <br />
                    <br />
                    {t("reviewJobAlert")}
                  </Typography>
                )}
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                style={{ backgroundColor: "#bfbfbf" }}
                className={classes.button}
                onClick={this.handleCancelReview}
              >
                {t("reviewJob")}
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleConfirmReview}
                className={classes.ctaButton}
              >
                {t("common:submit")}
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.showApprovePopup}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
            {t("common:approve")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", padding: 0 }}>
                  <img
                    alt="HR Matrix"
                    src={modalIcon}
                    Component=""
                    style={{ width: "60px" }}
                  />
                </div>
                <Typography variant="h6">
                  {t("approveAlert")}
                  <br></br>
                  {t("common:continueAlert")}
                </Typography>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                style={{ backgroundColor: "#bfbfbf" }}
                className={classes.button}
                onClick={this.handleCancelApprove}
              >
                {t("common:no")}
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleConfirmApprove}
                className={classes.ctaButton}
              >
                {t("common:yes")}
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.showRejectPopup}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
            {t("common:reject")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", padding: 0 }}>
                  <img
                    alt="HR Matrix"
                    src={modalIcon}
                    Component=""
                    style={{ width: "60px" }}
                  />
                </div>
                <Typography variant="h6">
                  {t("rejectAlert")}
                  <br></br>
                  {t("common:continueAlert")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxLength: 200 }}
                  placeholder="Comments"
                  multiline={true}
                  rows={3}
                  onChange={(event) =>
                    this.handleCommentChange(event.target.value)
                  }
                />
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                onClick={this.handleCancelReject}
                style={{ backgroundColor: "#bfbfbf" }}
                className={classes.button}
              >
                {t("common:no")}
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleConfirmReject}
                className={classes.ctaButton}
                autoFocus
              >
                {t("common:yes")}
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.clearModal}
          onClose={this.handleClearCancel}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t("clearData")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("clearDataAlert")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClearCancel} color="primary">
              {t("common:cancel")}
            </Button>
            <Button onClick={this.handleClearOk} color="primary" autoFocus>
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardLayout>
    );
  }
}

const mapDispatchToProps = {
  createJobPost: createJobPost,
  clearJobPost: clearJobPost,
  isConfigDetailsExists: isConfigDetailsExists,
  checkOrgHasTA: checkOrgHasTA,
  loadAddresses: loadAddresses,
};

const mapStateToProps = (state) => ({
  jobPost: state.jobPost && state.jobPost.data,
  errors: state.jobPost && state.jobPost.errors,
  profile: state.profile,
  addresses: state.employer && state.employer.locations,
  organization: state.organization,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withTranslation(["jobPost", "common"])(PostJ)));
