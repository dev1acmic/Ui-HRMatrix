import React, { useEffect, useState } from "react";
import {
  Container,
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import { Dashboard as DashboardLayout } from "layouts";
import { Summary, Details, Info, PostInterview } from "./components";
import styles from "./style";
import { useTranslation } from "react-i18next";

import { connect } from "react-redux";
import {
  getJobPost,
  createJobPost,
  getJobApplicantsByJobPost,
} from "services/jobPost/action";
import {
  getJobApplicationsByJobPost,
  saveApplication,
  getFile,
  getApplicantsAssessmentsByIds,
} from "services/jobApplication/action";
import { loadConfiguration } from "services/employer/action";
import { loadUsers } from "services/admin/action";
import {
  addsubscription,
  loadOrganization,
} from "services/organization/action";
import {
  getApplicatSkillMatrix,
  getApplicatAssesmentSkillMatrix,
} from "util/helper";
import Popout from "react-popout";
import { ActiveStatus, JobApplicationSelectStatus, Roles } from "util/enum";
import { async } from "q";
import { ScreeningQuestions } from "../Modals/";
import { AssignInterviewer } from "../Modals";
import SendMsgtoRecruiter from "views/Modals/SendMsgtoRecruiter";
import { TramRounded } from "@material-ui/icons";
import share from "common/share";
const Matrix = (props) => {
  const { classes, interviewers, role, id } = props;
  const { t } = useTranslation(["matrix", "common"]);
  let {
    FinStartMonth,
    PreIntvSkillScore,
    PreIntvPreScreeningScore,
    PostIntvSkillScore,
    PostIntvPreScreeningScore,
  } = props.orgConfig;

  const [state, setState] = React.useState({
    showDialog: false,
    //selectedApplicants: [],
    showSelectConfirmDialog: false,
    interviewerModal: false,
    applicantToSelect: null,
    tab: "preinterview",
    showModalPrescreenDialog: false,
    showUncheckModal: false,
  });
  const [jobPost, setJobPost] = React.useState(null);
  const [jobApplications, setJobApplications] = React.useState(null);

  const [applicationMatrix, setApplicationMatrix] = React.useState(null);
  const [postIntrvMatrix, setPostIntrvMatrix] = React.useState(null);

  const [maxValues, setMaxValues] = React.useState(null);
  const [maxPostInrvValues, setMaxPostInrvValues] = React.useState(null);

  const [resumePopOut, setResumePopOut] = React.useState(null);
  //Modal for prescreening
  const [show, setShow] = React.useState(false);
  const [screeningItem, setScreeningItem] = React.useState(false);
  let [screeningAns, setscreeningAns] = React.useState([]);
  const ref = React.createRef();
  //Modal for send msg to recruiter
  const [showmodalMsg, setShowmodalMsg] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);

  //unlock premium alert
  const [pendingpayment, setPendingpayment] = React.useState(false);
  const [hasPremiumCandidate, setHasPremiumCandidate] = React.useState(false);
  const [isUnlockedPremium, setIsUnlockedPremium] = React.useState(false);

  const [isStripeAdded, setIsStripeAdded] = useState(false);
  const [isTrialExist, setIsTrialExist] = useState(false);

  const [alert, setAlert] = React.useState(false);
  const [org, setOrg] = React.useState([]);
  const [spinner, setSpinner] = React.useState(false);

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  const openAlert = () => {
    setAlert(true);
  };

  const handleCloseAlert = () => {
    setAlert(false);
  };

  useEffect(() => {
    if (props.organization && Object.keys(props.organization).length > 0) {
      let hasTrial = share.checkStripeTrialExist(props.organization, true);
      let isStripeAdded = share.checkIsStripeSubscribed(props.organization);
      setIsStripeAdded(isStripeAdded);
      setIsTrialExist(hasTrial);
      setOrg(props.organization);
    }
  }, [props.organization]);

  useEffect(() => {
    const jobPostId = props.match.params ? props.match.params.jobPostId : null;

    props.loadConfiguration(props.orgId);

    setState({ ...state, jobPostId: jobPostId });
    props.getJobPost(jobPostId);
    props.getJobApplicationsByJobPost(
      jobPostId,
      [JobApplicationSelectStatus.Removed],
      -1
    );
  }, []);

  useEffect(() => {
    if (props.jobPost) {
      // sort the sub arrays so that it is in sync with applicationMatrix while showing in UI table columns
      props.jobPost.jobskills &&
        props.jobPost.jobskills.sort((a, b) => a.skillId - b.skillId);
      props.jobPost.jobscreeningqtns &&
        props.jobPost.jobscreeningqtns.sort((a, b) => a.id - b.id);

      setJobPost(props.jobPost);
      //to check whether the job premium membership has been unlocked
      let isUnlockedPremium = props.jobPost.stripeUsageViewRecordId !== null;
      //  setIsUnlockedPremium(isUnlockedPremium);
      setIsUnlockedPremium(true);
      // unlock premium has been set true as default since the rc team doest want to charge for viewing candidate from a premium agency.  To enable the same, uncomment the above line and comment the default ture statement
    }
  }, [props.jobPost]);

  useEffect(() => {
    let lockDetails;
    //check whether the 14 day trial exist
    if (isTrialExist) {
      lockDetails = false;
    } else if (isStripeAdded) {
      // check the organization payment has been subscribed or not
      lockDetails = hasPremiumCandidate
        ? isUnlockedPremium
          ? false
          : true
        : false;
    } else {
      //  if trial expired and yet to add subscription payment, then lock the premium candidate details.
      lockDetails = true;
    }
    // setPendingpayment(lockDetails);
    setPendingpayment(false); // unlock premium has been set false as default since the rc team doest want to charge for viewing candidate from a premium agency.  To enable the same, uncomment the above line and comment the default false statement
  }, [hasPremiumCandidate, isUnlockedPremium]);

  useEffect(() => {
    if (props.jobApplications) {
      // async function fetchApplicants() {
      //   const jobList = props.jobList;
      //   const newState = { ...jobList };
      //   let page = [];
      //   await Promise.all(
      //     jobList.data.map(async (item, index) => {

      //     })
      //   );
      // }

      let skillFactor = PreIntvSkillScore ? PreIntvSkillScore * 1 : 50;
      let preQFactor = PreIntvPreScreeningScore
        ? PreIntvPreScreeningScore * 1
        : 50;
      // console.log(skillFactor, preQFactor);

      getApplicatSkillMatrix(
        props.jobApplications,
        skillFactor,
        preQFactor
      ).then((result) => {
        console.log(result);

        const {
          maxSkillPerc,
          maxAnsScorePrc,
          maxOverAllScore,
          skillReqPointSum,
        } = result.maxSkillValues;

        setMaxValues({
          ...maxValues,
          maxSkillPerc,
          maxAnsScorePrc,
          maxOverAllScore,
          skillReqPointSum,
        });

        let hasPremiumCandidates =
          props.jobApplications.filter((c) => c.isPremiumCandidate == true)
            .length > 0;
        setHasPremiumCandidate(hasPremiumCandidates);

        setApplicationMatrix(result.applicantSkillMatrix);
        setJobApplications(props.jobApplications);
        // if (props.jobPost) {
        //   screenMap(props.jobPost.jobscreeningqtns);
        // }
      });
    }
  }, [props.jobApplications]);

  const screenMap = (screenChoises) => {
    let answers = [];
    screenChoises.map((item) => {
      let index = answers.findIndex((c) => c.id === item.jobscreeningqtnId);
      if (index !== -1) {
        answers[index].ans = [...answers[index].ans, item.id];
      } else {
        answers.push({ id: item.jobscreeningqtnId, ans: [item.id] });
      }
    });
    //setscreeningAns(answers);
    return answers;
  };

  const handleSubmit = async (event) => {
    setSpinner(true);
    let data = {
      paymentMethod: org.stripePaymentMethodId,
      stripeCustomerId: org.stripeCustomerId,
      priceId: process.env.REACT_APP_STRIPE_PROFILE_VIEW_PRICE,
      id: props.orgId,
      isUnlockedPremium: true,
      jobId: props.jobPost.id,
    };
    await props.addsubscription(data).then((res) => {
      console.log(res);
      if (res && res.jobpost && res.jobpost.stripeUsageViewRecordId) {
        setAlert(false);
        setPendingpayment(false);
        setSpinner(false);
      }
    });
  };

  const handleConfirmRemove = (id) => {
    setState({ ...state, showDialog: true, applicantId: id });
  };

  const getapplicants = async (jobpostId) => {
    const res = await props.getJobApplicantsByJobPost(jobpostId, id, role);
    return res;
  };

  /**old code to check job position and close the job(not working) */
  // const checkJobPosition = async (jobpostId) => {
  //   if (props.jobPost && props.jobPost !== null) {
  //     const applicants = await getapplicants(jobpostId);

  //     let jobPosition = props.jobPost.position;
  //     let hiredApplicants =
  //       applicants &&
  //       applicants.data &&
  //       applicants.data.filter(
  //         (c) =>
  //           c.applicantassessments &&
  //           c.applicantassessments.length > 0 &&
  //           c.applicantassessments[0].status === 1
  //       ).length + 1;
  //     if (jobPosition === hiredApplicants) {
  //       let data = {};
  //       data.id = jobpostId;
  //       data.status = 6; //6 - closed
  //       props.createJobPost(data, null);
  //     }
  //   }
  // };

  /**
   * Author:Alphonsa
   * Close the job if the last position for the job is filled
   * @param {*} jobpostId
   */
  const checkJobPositionAmple = async (jobpostId) => {
    if (props.jobPost && props.jobPost !== null) {
      let jobPosition = props.jobPost.position;
      let hiredApplicants =
        props.jobApplications &&
        props.jobApplications.filter(
          (c) => c.selectStatus === JobApplicationSelectStatus.Hired
        ).length;
      if (jobPosition === hiredApplicants) {
        const jobId = jobpostId > 0 ? jobpostId : props.jobPost.id;
        let data = {};
        data.id = jobId;
        data.status = 6; /**6 - closed*/
        data.closedDate = new Date();
        props.createJobPost(data, null);
      }
    }
  };

  const doSelect = (id, sendMail, status) => {
    //const id = state.applicantToSelect;

    // close dialog
    setState({
      ...state,
      showSelectConfirmDialog: false,
      showUncheckModal: false,
      applicantToSelect: null,
    });
    let candidateName = "";
    // set status in applicationMatrix
    let selectIndex = -1;
    selectIndex = applicationMatrix.findIndex((appl) => {
      candidateName = appl.fname + " " + appl.lname;
      return appl.id === id;
    });
    applicationMatrix[selectIndex].selectStatus = status;
    setApplicationMatrix([...applicationMatrix]);

    // set status in postIntrvMatrix
    if (postIntrvMatrix) {
      selectIndex = postIntrvMatrix.findIndex((appl) => {
        return appl.id === id;
      });
      if (postIntrvMatrix[selectIndex]) {
        postIntrvMatrix[selectIndex].selectStatus = status;
        setPostIntrvMatrix([...postIntrvMatrix]);
      }
    }

    if (status === JobApplicationSelectStatus.ShortListed && sendMail) {
      // applicant short listed
      props.saveApplication({
        id: id,
        selectStatus: status,
        //mailtoInterviewer: sendMail,
        mailToRecruiter: true,
        interviewLevel: 1,
        shortListedDate: new Date(),
      });
      if (sendMail) {
        handleOpenPanel(1, id, candidateName);
      }
    } else if (
      status === JobApplicationSelectStatus.Hired ||
      status === JobApplicationSelectStatus.Rejected
    ) {
      // When applicant hired, rejected or shortlisted send mail to recruiter
      props
        .saveApplication({
          id: id,
          selectStatus: status,
          mailToRecruiter: true,
          //interviewLevel: 1,
          selectStatusDate: new Date(),
        })
        .then((res) => {
          const jobPostId = state.jobPostId
            ? state.jobPostId
            : props.jobPost.id;
          checkJobPositionAmple(jobPostId); //check whether the job positions has been filled.
        });
    } else {
      // shortlisted but not assigned
      props.saveApplication({
        id: id,
        selectStatus: status,
        selectStatusDate: new Date(),
        shortListedDate: new Date(),
      });
    }
  };

  const handleRemoveApplicant = (id) => {
    let selectedIndex = -1;
    // Find item
    for (let index = 0; index < applicationMatrix.length; index++) {
      if (applicationMatrix[index].id === id) {
        selectedIndex = index;
        break;
      }
    }

    if (selectedIndex !== -1) {
      // Remove item
      applicationMatrix.splice(selectedIndex, 1);

      // When items are removed, recalculate max values in the list
      recalculateMax();
      setApplicationMatrix(applicationMatrix);
      props.saveApplication({
        id: id,
        selectStatus: JobApplicationSelectStatus.Removed,
      });
    }
    //console.log(state);
  };

  useEffect(() => {
    props.loadUsers(props.orgId, -1);
  }, []);

  useEffect(() => {
    if (interviewers && interviewers.length > 0) {
      setState({
        ...state,
        interviewers: interviewers,
      });
    }
  }, [interviewers]);

  useEffect(() => {
    if (state.tab === "postinterview") {
      // Find the short listed applicant and get thier assesment details
      const shortListedIds = [];
      const shortListedApps = applicationMatrix.filter((app) => {
        if (
          app.selectStatus === JobApplicationSelectStatus.ShortListed ||
          app.selectStatus === JobApplicationSelectStatus.Hired ||
          app.selectStatus === JobApplicationSelectStatus.Rejected
        ) {
          shortListedIds.push(app.id);
          return true;
        }
        return false;
      });

      // Get interview levels
      const levels = jobPost.jobinterviewqtns.map((iv) => {
        return iv.level;
      });

      props.getApplicantsAssessmentsByIds(shortListedIds).then((result) => {
        const appAssesments = result;

        const skillFactor = PostIntvSkillScore ? PostIntvSkillScore * 1 : 50;
        const postQFactor = PostIntvPreScreeningScore
          ? PostIntvPreScreeningScore * 1
          : 50;

        getApplicatAssesmentSkillMatrix(
          shortListedApps,
          appAssesments,
          levels,
          postQFactor,
          skillFactor
        ).then((result) => {
          console.log(result);

          const {
            maxSkillPerc,
            maxAssessmentScorePrc,
            maxOverAllScore,
          } = result.maxSkillValues;

          setMaxPostInrvValues({
            ...maxValues,
            maxSkillPerc,
            maxAssessmentScorePrc,
            maxOverAllScore,
          });
          setPostIntrvMatrix(result.applicantAssesmentMatrix);
        });
      });
    }
  }, [state.tab]);

  const recalculateMax = () => {
    let maxSkillPerc = 0;
    let maxAnsScorePrc = 0;
    let maxOverAllScore = 0;
    //const skillReqPointSum =

    for (let index = 0; index < applicationMatrix.length; index++) {
      const applicant = applicationMatrix[index];

      maxSkillPerc =
        maxSkillPerc > applicant.totalSkillPerc
          ? maxSkillPerc
          : applicant.totalSkillPerc;

      maxAnsScorePrc =
        maxAnsScorePrc > applicant.totalAnsScorePrc
          ? maxAnsScorePrc
          : applicant.totalAnsScorePrc;
      maxOverAllScore =
        maxOverAllScore > applicant.overAllScore
          ? maxOverAllScore
          : applicant.overAllScore;
    }

    console.log({
      maxSkillPerc,
      maxAnsScorePrc,
      maxOverAllScore,
    });
    setMaxValues({
      ...maxValues,
      maxSkillPerc,
      maxAnsScorePrc,
      maxOverAllScore,
      //skillReqPointSum
    });
  };

  const handleScroll = () => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const dialogue = () => {
    return (
      <Dialog
        open={state.showDialog}
        onClose={() => {
          setState({ ...state, showDialog: false, applicantId: null });
        }}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("common:errMsg.removeCandidateAlert")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const id = state.applicantId;
              setState({ ...state, showDialog: false, applicantId: null });
              if (id) {
                handleRemoveApplicant(id);
              }
            }}
            color="primary"
          >
            {t("yes")}
          </Button>
          <Button
            onClick={() => {
              setState({ ...state, showDialog: false, applicantId: null });
            }}
            color="primary"
            autoFocus
          >
            {t("no")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleShowResume = async (id) => {
    setResumePopOut(null);
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

  const handleOpenModalforSendMsgRec = (id) => {
    if (jobApplications) {
      const selectIndex = jobApplications.findIndex((appl) => appl.id === id);
      const selectedItem = jobApplications[selectIndex];
      setShowmodalMsg(true);
      setSelectedJob(selectedItem);
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

  const handleConfirmSelect = (id) => {
    const selectIndex = applicationMatrix.findIndex((appl) => {
      return appl.id === id;
    });

    // Show confirmation dialog only when short list
    const showDialog =
      applicationMatrix[selectIndex].selectStatus ===
      JobApplicationSelectStatus.ShortListed
        ? false
        : true;
    if (showDialog) {
      setState({
        ...state,
        showSelectConfirmDialog: true,
        applicantToSelect: id,
      });
    } else {
      setState({
        ...state,
        showUncheckModal: true,
        applicantToSelect: id,
      });
    }
  };

  const handlePostIntervSelect = (id, status) => {
    doSelect(id, false, status);
  };

  const handleTabClick = (tab) => {
    setState({ ...state, tab: tab });
  };

  const confirmSelectDialog = () => {
    return (
      <Dialog
        open={state.showSelectConfirmDialog}
        onClose={() => {
          setState({
            ...state,
            showSelectConfirmDialog: false,
            applicantToSelect: null,
          });
        }}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("sendtoInterviewer")}
            <br></br>
            {t("assignCandidate")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              doSelect(
                state.applicantToSelect,
                true,
                JobApplicationSelectStatus.ShortListed
              );
            }}
            color="primary"
          >
            {t("common:yes")}
          </Button>
          <Button
            onClick={() => {
              doSelect(
                state.applicantToSelect,
                false,
                JobApplicationSelectStatus.ShortListed
              );
            }}
            color="primary"
            autoFocus
          >
            {t("common:no")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  //Modal for Prescreening Questions
  const handleClose = () => {
    setState({ ...state, anchorEl: null });
  };

  const handleCloseModal = () => {
    setScreeningItem(null);
    setShow(false);
  };

  const handleOpenModalScreenQue = (
    applicantId,
    applicantName,
    queId,
    screeningWeightage,
    premiumAlert
  ) => () => {
    if (premiumAlert) {
      return false;
    }
    let answers;
    if (jobApplications) {
      const screenChoises = jobApplications.find((c) => c.id === applicantId)
        .jobscreeningchoices;
      if (screenChoises) {
        answers = screenMap(screenChoises);
      }

      const newscreeningRows = jobPost.jobscreeningqtns;
      const screeningItem = newscreeningRows.find((c) => c.id === queId);
      const id = screeningItem.id;
      let item = answers.find((c) => c.id === id);
      let selectedChoice = [];
      if (item) {
        selectedChoice = item.ans;
      }
      screeningItem.selectedChoice = selectedChoice;
      setShow(true);
      setScreeningItem(screeningItem);
      setState({
        ...state,
        applicantName,
        screeningWeightage,
        showModalPrescreenDialog: true,
      });
    }
  };

  const openModalPrescreenQue = () => {
    return (
      <Modal
        // style={{
        //   position: "absolute",
        //   top: "10%",
        //   left: "0",
        //   overflowY: "scroll",
        //   height: "100%",
        //   display: "block"
        // }}
        aria-labelledby={t("common:addScreeningQ")}
        aria-describedby={t("common:addScreeningQ")}
        open={show}
        onClose={handleClose}
      >
        <ScreeningQuestions
          applicantName={state.applicantName}
          screeningWeightage={state.screeningWeightage}
          screeningItem={screeningItem}
          onCancel={handleCloseModal}
          isMatrix={true}
        />
      </Modal>
    );
  };

  const assignInterviewerModal = () => {
    const interviewers =
      state.interviewers && state.interviewers.filter((i) => i.status === 1);
    return (
      <Modal
        onBackdropClick="false"
        aria-labelledby={t("postInterview.assignInterviewer")}
        aria-describedby={t("postInterview.assignInterviewer")}
        open={state.interviewerModal}
        onClose={handleClosePanel}
      >
        <AssignInterviewer
          jobPost={props.jobPost}
          jobApplication={props.jobApplications}
          jobpostId={state.jobPostId}
          applicantId={state.applicantId}
          applicantName={state.applicantName}
          interviewers={interviewers}
          interviewDetails={state.interviewDetails}
          organizationId={props.orgId}
          onCancel={handleClosePanel}
          totalLevels={state.totalLevels}
        />
      </Modal>
    );
  };

  const handleOpenPanel = (level, applicantId, applicantName) => {  
        const interviewDetails = jobPost.jobinterviewqtns.find(
      (c) => c.level === level
    );
    setState({
      ...state,
      showSelectConfirmDialog: false,
      applicantToSelect: null,
      applicantId: applicantId,
      applicantName: applicantName,
      interviewDetails: interviewDetails,
      interviewerModal: true,
      totalLevels: jobPost.jobinterviewqtns.length,
    });
  };

  const handleClosePanel = () => {
    setState({ ...state, interviewerModal: false });
  };

  const handleCloseSndMsgRecruiterModal = () => {
    setShowmodalMsg(false);
  };

  const sendMsgtoRec = () => {
    if (showmodalMsg) {
      return (
        <Modal
          // style={{
          //   position: "absolute",
          //   top: "10%",
          //   left: "0",
          //   overflowY: "scroll",
          //   height: "100%",
          //   display: "block"
          // }}
          aria-labelledby={t("msgtoRecruiter")}
          aria-describedby={t("msgtoRecruiter")}
          open={showmodalMsg}
          onClose={handleClose}
        >
          <SendMsgtoRecruiter
            selectedJob={selectedJob}
            onCancel={handleCloseSndMsgRecruiterModal}
            jobId={jobPost.uniqueId}
          />
        </Modal>
      );
    }
    return;
  };

  const showPremiumAlert = () => {
    return (
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
              <Typography variant="h8">{t("subscribeAlert")}</Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {spinner && <CircularProgress className={classes.progress} />}
          {!spinner && (
            <>
              {" "}
              <Button onClick={() => handleCloseAlert()} color="primary">
                {t("common:doLater")}
              </Button>
              <Button onClick={() => handleSubmit()} color="primary">
                {t("common:buyNow")}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  const showOnUncheckShortlist = () => {
    return (
      <Dialog
        open={state.showUncheckModal}
        onClose={() => {
          setState({
            ...state,
            showUncheckModal: false,
          });
        }}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("removeCandAlert")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button
            onClick={() => {
              doSelect(
                state.applicantToSelect,
                false,
                JobApplicationSelectStatus.Inital
              );
            }}
            color="primary"
          >
            {t("common:yes")}
          </Button> */}
          <Button
            onClick={() => {
              doSelect(
                state.applicantToSelect,
                false,
                JobApplicationSelectStatus.ShortListed
              );
            }}
            color="primary"
            autoFocus
          >
            {t("okGotIt")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        <Info
          jobPost={jobPost}
          tab={state.tab}
          finStartMonth={FinStartMonth}
          handleTabClick={handleTabClick}
        />

        {state.tab === "preinterview" ? (
          <>
            {pendingpayment && role.id === Roles.Admin && (
              <Button
                color="primary"
                style={{ float: "right", left: "-27px" }}
                onClick={() => {
                  openAlert();
                }}
              >
                {t("unlockPremium")}
              </Button>
            )}
            <Summary
              jobPost={jobPost}
              applicationMatrix={applicationMatrix}
              maxValues={maxValues}
              handleConfirmRemove={handleConfirmRemove}
              handleScroll={handleScroll}
              handleSelect={handleConfirmSelect}
              handleShowResume={handleShowResume}
              handleOpenModalforSendMsgRec={handleOpenModalforSendMsgRec}
              skillWeightage={PreIntvSkillScore || 50}
              screeningWeightage={PreIntvPreScreeningScore || 50}
              pendingpayment={pendingpayment}
            />
            <Details
              jobPost={jobPost}
              applicationMatrix={applicationMatrix}
              maxValues={maxValues}
              handleConfirmRemove={handleConfirmRemove}
              scoreRef={ref}
              handleSelect={handleConfirmSelect}
              handleOpenModalforSendMsgRec={handleOpenModalforSendMsgRec}
              handleShowResume={handleShowResume}
              handleOpenModalScreenQue={handleOpenModalScreenQue}
              skillWeightage={PreIntvSkillScore || 50}
              screeningWeightage={PreIntvPreScreeningScore || 50}
              pendingpayment={pendingpayment}
            />
          </>
        ) : (
          <PostInterview
            jobPost={jobPost}
            applicationMatrix={postIntrvMatrix}
            maxValues={maxPostInrvValues}
            //handleConfirmRemove={handleConfirmRemove}
            scoreRef={ref}
            handleSelect={handlePostIntervSelect}
            handleShowResume={handleShowResume}
            handleOpenModalforSendMsgRec={handleOpenModalforSendMsgRec}
            skillWeightage={PostIntvSkillScore || 50}
            interviewWeightage={PostIntvPreScreeningScore || 50}
          />
        )}

        {dialogue()}
        {popOutHtml()}
        {confirmSelectDialog()}
        {openModalPrescreenQue()}
        {assignInterviewerModal()}
        {sendMsgtoRec()}
        {showOnUncheckShortlist()}
        {showPremiumAlert()}
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobPost,
  createJobPost,
  getJobApplicantsByJobPost,
  getJobApplicationsByJobPost,
  saveApplication,
  loadConfiguration,
  getFile,
  getApplicantsAssessmentsByIds,
  loadUsers,
  addsubscription,
  loadOrganization,
};

const mapStateToProps = (state) => ({
  jobPost: state.jobPost && state.jobPost.data,
  jobApplications: (state.jobApplication && state.jobApplication.query) || null,
  orgId: state.profile && state.profile.orgId,
  orgConfig: (state.employer && state.employer.config) || {},
  interviewers: state.admin && state.admin.users,
  //state.admin.users.filter((s) => s.status === 1),
  organization: state.organization || null,
  role: state.profile && state.profile.roles && state.profile.roles[0],
  userId: state.profile && state.profile.id,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Matrix));
