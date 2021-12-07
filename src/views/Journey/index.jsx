import React, { Component, useEffect, useState } from "react";
import { Container, withStyles, LinearProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { Dashboard as DashboardLayout } from "layouts";
import { Summary, Info } from "./components";
import styles from "./style"; 
import { JobApplicationSelectStatus, Roles } from "util/enum"; 
import _ from 'lodash'
import {
  getApplicatSkillMatrix,
  getApplicatAssesmentSkillMatrix,
} from "util/helper";

import { loadConfiguration } from "services/employer/action";
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
import { loadUsers } from "services/admin/action";
import {
  addsubscription,
  loadOrganization,
} from "services/organization/action";
const Journey = (props) => {
  // this page has been reused with the functionality used in the skill matrix.
  const { classes, interviewers, role, id } = props;
  const [jobPost, setJobPost] = useState(null);
  const [jobApplications, setJobApplications] = useState(null);

  const [state, setState] = useState(null);
  const ref = React.createRef();
  const [maxValues, setMaxValues] = useState(null);
  const [maxPostInrvValues, setMaxPostInrvValues] = React.useState(null);
  const [applicationMatrix, setApplicationMatrix] = useState(null);
  const [applicationSkillMatrix, setApplicationSkillMatrix] = useState(null);
  const [postIntrvMatrix, setPostIntrvMatrix] = useState(null);
  const [resumePopOut, setResumePopOut] = React.useState(null);
  const [showmodalMsg, setShowmodalMsg] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);

  let {
    FinStartMonth,
    PreIntvSkillScore,
    PreIntvPreScreeningScore,
    PostIntvSkillScore,
    PostIntvPreScreeningScore,
  } = props.orgConfig;

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

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
    if (interviewers && interviewers.length > 0) {
      setState({
        ...state,
        interviewers: interviewers,
      });
    }
  }, [interviewers]);

  useEffect(() => {
    if (
      props.jobPost &&
      props.jobPost.jobskills &&
      props.jobPost.jobscreeningqtns
    ) {
      //sort the sub arrays so that it is in sync with applicationMatrix while showing in UI table columns
      props.jobPost.jobskills.sort((a, b) => a.skillId - b.skillId);
      props.jobPost.jobscreeningqtns.sort((a, b) => a.id - b.id);

      setJobPost(props.jobPost);
    }
  }, [props.jobPost]);

  const loadSkillMatrix = () => {
     // Find the short listed applicant and get thier assesment details
     if (applicationMatrix) {
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
      const questionlevels =
        jobPost &&
        jobPost.jobinterviewqtns.map((iv) => {
          return iv.level;
        });
        const levels = [...new Set(questionlevels)]; 
      // panel name is used to display in the interview score column, ie not used in skill matrix
      const panels =
        jobPost &&
        jobPost.jobinterviewqtns.map((iv) => {
          return iv;
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
          skillFactor,
          panels
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
  }

  useEffect(() => {
    loadSkillMatrix()
  }, [applicationMatrix, jobPost]);

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

        setApplicationMatrix(result.applicantSkillMatrix);
        setJobApplications(props.jobApplications);
        // if (props.jobPost) {
        //   screenMap(props.jobPost.jobscreeningqtns);
        // }
      });
    }
  }, [props.jobApplications]);

  /**
   * Author:Alphonsa
   * Close the job if the last position for the job is filled
   * @param {*} jobpostId
   */
  const checkJobPositionAmple = async (jobPostId) => {
    if (props.jobPost && props.jobPost !== null) {
      let jobPosition = props.jobPost.position;
      let hiredApplicants =
        props.jobApplications &&
        props.jobApplications.filter(
          (c) => c.selectStatus === JobApplicationSelectStatus.Hired
        ).length;
      if (jobPosition === hiredApplicants) {
        const jobId = jobPostId > 0 ? jobPostId : props.jobPost.id;
        let data = {};
        data.id = jobId;
        data.status = 6; //6 - closed
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
        selectStatusDate: new Date(),
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
      // removed
      props.saveApplication({
        id: id,
        selectStatus: status,
        selectStatusDate: new Date(),
      });
    }
  };

  const handlePostIntervSelect = (id, status) => {
    doSelect(id, false, status);
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

  /**old code to check job position and close the job(not working) */
  // const checkJobPosition = async (jobpostId) => {
  //   if (props.jobPost && props.jobPost !== null) {
  //     const applicants = await getapplicants(jobpostId);

  //     let jobPosition = props.jobPost.position;
  //     let hiredApplicants =
  //     applicants&& applicants.data.filter(
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

  const getapplicants = async (jobpostId) => {
    const res = await props.getJobApplicantsByJobPost(jobpostId, id, role);
    return res;
  };

  return (
    <DashboardLayout title="Dashboard">
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        <Info jobPost={jobPost} finStartMonth={FinStartMonth} />
        <Summary
          jobPost={jobPost}
          applicationMatrix={postIntrvMatrix}
          applicationSkillMatrix={applicationMatrix}
          maxValues={maxPostInrvValues}
          jobApplications={jobApplications}
          loadSkillMatrix={loadSkillMatrix}
          //handleConfirmRemove={handleConfirmRemove}
          scoreRef={ref}
          handleSelect={handlePostIntervSelect}
          handleShowResume={handleShowResume}
          handleOpenModalforSendMsgRec={handleOpenModalforSendMsgRec}
          skillWeightage={PostIntvSkillScore || 50}
          interviewWeightage={PostIntvPreScreeningScore || 50}
        />
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
  organization: state.organization || null,
  role: state.profile && state.profile.roles && state.profile.roles[0],
  userId: state.profile && state.profile.id,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Journey));
