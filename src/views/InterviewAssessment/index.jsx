import React, { useEffect } from "react";
import {
  Container,
  withStyles,
  Button,
  Box,
  CircularProgress,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  OutlinedInput,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  getJobApplicationsById,
  getFile,
  saveApplicantAssessment,
  getApplicantAssessment,
  checkAssessmentAccess,
  getInterviewersByApplicantId,
} from "services/jobApplication/action";
import {
  getInterviewDetailsByJobPost,
  getInterviewQstnsByJobPost,
} from "services/jobPost/action";
import styles from "./style";
import {
  Profile,
  Skills,
  Domain,
  Questionnaire,
  Behaviour,
  Comments,
  Score,
} from "./components";
import {
  isRoleAdmin,
  isRoleHM,
  isRoleTA,
  isRoleInterviewer,
} from "util/roleUtil";
import { Roles, JobStatus } from "util/enum";
import modalIcon from "assets/images/modal_ico_1.png";
import {
  ArrowBackOutlined,
  ArrowForwardOutlined,
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons"; 
import _ from 'lodash'
import {
  getJobsbyEmployer,
  getJobApplicantsByJobPost,
  createJobPost,
} from "services/jobPost/action";

const InterviewAssessment = (props) => {
  const { classes } = props;
  const { t } = useTranslation(["interviewAssessment", "common"]);
  const { roles, id, orgId } = props.profile;
  const pageSize = 1;

  const [applicantId, setApplicantId] = React.useState(0);
  const [levelNo, setLevelNo] = React.useState(
    (props.match.params &&
      props.match.params.level &&
      parseInt(props.match.params.level)) ||
      0
  );
  const [applicant, setApplicant] = React.useState(null);
  const [interviewLevel, setInterviewLevel] = React.useState(null);
  const [interviewQstns, setInterviewQstns] = React.useState(null);
  const [skills, setSkills] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [contentLoading, setContentLoading] = React.useState(true);
  const [role, setRole] = React.useState();

  const [behaviouralAssessment, setBehaviouralAssessment] = React.useState(
    null
  );
  const [state, setState] = React.useState({});
  const [paginate, setPaginate] = React.useState({
    pageNo: 1,
    totalPage: 0,
  });
  const [showPopupforHire, setShowPopupforHire] = React.useState(false);
  const [showPopupforReject, setShowPopupforReject] = React.useState(false);

  useEffect(() => {
    if (applicantId > 0) {
      props.getInterviewersByApplicantId(applicantId, levelNo);
    }
  }, [levelNo, applicantId]);

  useEffect(() => {
    if (isRoleInterviewer(roles)) {
      props.getJobsbyEmployer(id, Roles.InterviewPanel);
    }
  }, []);

  const getapplicants = async (jobpostId) => {
    const res = await props.getJobApplicantsByJobPost(jobpostId, id, role);
    return res;
  };

  useEffect(() => {
    async function fetchApplicants() {
      const jobList = props.jobList;
      const newState = { ...jobList };
      let page = [];
      await Promise.all(
        jobList.data.map(async (item, index) => {
          const res = await getapplicants(item.id);
          item.applicants = [];
          item.applicants = res.data;
        })
      );
    }
    if (
      isRoleInterviewer(roles) &&
      props.jobList &&
      props.jobList.data &&
      props.jobList.data.length > 0
    ) {
      fetchApplicants();
    }
  }, [props.jobList]);

  useEffect(() => {
    let jobApplId = 0;
    let role;
    if (isRoleTA(roles)) {
      role = Roles.TalentAcquisitionTeam;
    } else if (isRoleHM(roles)) {
      role = Roles.HiringManager;
    } else if (isRoleAdmin(roles)) {
      role = Roles.Admin;
    } else if (isRoleInterviewer(roles)) {
      role = Roles.InterviewPanel;
    }
    setRole(role);

    if (props.location.state && props.location.state.jobApplId) {
      jobApplId = parseInt(props.location.state.jobApplId);
    }
    // if (props.match.params && props.match.params.level) {
    //   setLevelNo(parseInt(props.match.params.level));
    // }
    if (props.match.params && props.match.params.jobApplId) {
      jobApplId = parseInt(props.match.params.jobApplId);
    }
    if (jobApplId > 0) {
      if (props.location.state && props.location.state.candidates) {
        let candidates = props.location.state.candidates;
        setPaginate({
          ...paginate,
          pageNo: candidates.findIndex((c) => c === jobApplId) + 1,
          candidates: candidates,
          totalPage: candidates.length,
        });
      }

      props.getJobApplicationsById(jobApplId);
      setApplicantId(parseInt(jobApplId));
    }
  }, []);

  useEffect(() => {
    let appln = props.jobApplication;
    if (appln) {
      const {
        id,
        country,
        currJob,
        fname,
        lname,
        file,
        jobskills,
        avatarId,
      } = appln;
      props.getInterviewDetailsByJobPost(appln.jobpostId);
      // if (levelNo > 0) {
      //   props.getApplicantAssessment(levelNo, appln.id).then(res => {
      //     if (res) {
      //       setNoData(false);
      //     } else {
      //       setNoData(true);
      //     }
      //   });
      // }
      setApplicant({ id, country, currJob, fname, lname, file, avatarId });
      let skills =
        jobskills &&
        jobskills.map((c) => {
          return { id: 0, skillId: c.skill.id, name: c.skill.name, score: 0 };
        });
      if (appln.jobpost) {
        const {
          behaviouralScore,
          domainScore,
          interviewScore,
          skillScore,
        } = appln.jobpost;
        setState({
          ...state,
          initialbehaviouralWeightage: behaviouralScore,
          initialdomainWeightage: domainScore,
          initialinterviewWeightage: interviewScore,
          initialskillWeightage: skillScore,
          behaviouralWeightage: behaviouralScore,
          domainWeightage: domainScore,
          interviewWeightage: interviewScore,
          skillWeightage: skillScore,
          jobpostId: appln.jobpostId,
        });
      }
      setSkills(skills);
      setLoading(false);
    }
  }, [props.jobApplication]);

  useEffect(() => {
    let assessment = props.assessment;
    if (assessment && assessment.jobapplicationId === applicantId) {
      const {
        id,
        interviewDate,
        overallSkillScore,
        overallDomainScore,
        overallQuestionnaireScore,
        overallBehaviouralScore,
        overallScore,
        collaboration,
        communication,
        criticalThinking,
        leadership,
        timeManagement,
        comments,
        overrideSkillScore,
        disableSkillAssessment,
        disableDomainAssessment,
        disableQuestAssessment,
        disableBehaviourAssessment,
        disableCommentAssessment,
      } = assessment;

      /*------SKILLS-----*/
      let assessmentSkills = [];
      skills &&
        skills.map((item) => {
          const skill =
            assessment.skills &&
            assessment.skills.find((c) => c.id === item.skillId);
          const skillassessment = (skill && skill.skillassessments) || null;
          assessmentSkills.push({
            id: (skillassessment && skillassessment.id) || 0,
            skillId: item.skillId,
            name: item.name,
            score: (skillassessment && skillassessment.score) || 0,
          });
        });

      setSkills(assessmentSkills);

      /*------BEHAVIOUR-----*/
      setBehaviouralAssessment({
        collaboration,
        communication,
        criticalThinking,
        leadership,
        timeManagement,
        overallBehaviouralScore,
      });

      const newState = { ...state };
      newState.assessmentId = id;
      newState.interviewDate = interviewDate;
      setInterviewLevel({ ...interviewLevel, interviewDate: interviewDate });

      /*------OVERALL SCORES-----*/
      newState.skillScore = overallSkillScore;
      newState.domainScore = overallDomainScore;
      newState.questScore = overallQuestionnaireScore;
      newState.behaviourScore = overallBehaviouralScore;
      newState.totalScore = overallScore;

      /*------COMMENTS-----*/
      newState.comments = comments || "";
      newState.disableSkillAssessment = disableSkillAssessment;
      newState.disableDomainAssessment = disableDomainAssessment;
      newState.disableQuestAssessment = disableQuestAssessment;
      newState.disableBehaviourAssessment = disableBehaviourAssessment;
      newState.disableCommentAssessment = disableCommentAssessment;

      const res = getNewWeightage(newState);
      setState({
        ...newState,
        overrideSkillScore,
        canEdit: false,
        ...res,
      });
    } else {
      setInterviewQstns(null);
      setSkills(null);
      setBehaviouralAssessment(null);

      const newState = { ...state };

      /*------OVERALL SCORES-----*/
      newState.skillScore = 0;
      newState.domainScore = 0;
      newState.questScore = 0;
      newState.behaviourScore = 0;
      newState.totalScore = 0;

      /*------COMMENTS-----*/
      newState.comments = "";
      newState.disableSkillAssessment = false;
      newState.disableDomainAssessment = false;
      newState.disableQuestAssessment = false;
      newState.disableBehaviourAssessment = false;
      newState.disableCommentAssessment = false;

      const res = getNewWeightage(newState);
      setState({
        ...newState,
        canEdit:
          role === Roles.InterviewPanel
            ? true
            : false /**hide hire/reject buttons if role is not interviewer */,
        ...res,
      });
    }
  }, [props.assessment]);

  useEffect(() => {
    if (props.applicantInterviewers) {
      //if (props.applicantInterviewers.length > 0) {
      let levelNumber = levelNo;
      let userId = props.profile.id;
      let canEdit = false;
      let level;

      //check user has access to this interview level
      if (!levelNumber || levelNumber === 0) {
        for (
          let index = 0;
          index < props.applicantInterviewers.length;
          index++
        ) {
          const obj = props.applicantInterviewers[index];

          if (obj.userId === userId) {
            setLevelNo(obj.level);
            levelNumber = obj.level;
            checkAccess(obj.level);
            canEdit =
              role === Roles.InterviewPanel
                ? true
                : false; /**hide hire/reject buttons if role is not interviewer */
            break;
          }
        }
      } else {
        checkAccess(levelNumber);
        canEdit =
          props.applicantInterviewers.findIndex(
            (c) => c.level === levelNumber && c.userId === userId
          ) !== -1;
      }
      let interviewLevel = props.interviewLevel;
      if (interviewLevel) {
        level = interviewLevel.data.find((c) => c.level === levelNumber) || {};
        level.totalLevel =_.uniqBy(interviewLevel.data, function (e) {
          return e.level;
        }).length;
        level.interviewDate = state.interviewDate;
        props.getInterviewQstnsByJobPost(state.jobpostId,levelNumber);
        setLevelNo(levelNumber);
        canEdit =
          canEdit &&
          props.jobApplication &&
          props.jobApplication.selectStatus <
            3; /**hide hire/reject buttons if the candidate is already hired/rejected */
        setState({
          ...state,
          canEdit: canEdit,
        });
        setInterviewLevel(level);
      }
      // } else {
      //   setHasAccess(false);
      //   setContentLoading(false);
      // }
    }
  }, [props.applicantInterviewers, props.interviewLevel]);

  // useEffect(() => {
  //   let interviewLevel = props.interviewLevel;
  //   if (
  //     interviewLevel &&
  //     interviewLevel.data.length > 0 &&
  //     interviewLevel.data[0].jobpostId === state.jobpostId
  //   ) {
  //     let levelNumber = levelNo;
  //     let userId = props.profile.id;
  //     let canEdit = false;
  //     let level;

  //     //check user has access to this interview level
  //     if (!levelNumber || levelNumber === 0) {
  //       for (let index = 0; index < interviewLevel.data.length; index++) {
  //         const obj = interviewLevel.data[index];

  //         if (
  //           obj.interviewpanel &&
  //           obj.interviewpanel.users &&
  //           obj.interviewpanel.users.map(c => c.Id).some(c => c === userId)
  //         ) {
  //           level = obj;
  //           break;
  //         }
  //       }
  //       if (level) {
  //         canEdit = true;
  //       } else {
  //         level = interviewLevel.data[0];
  //         canEdit = false;
  //       }
  //       levelNumber = level.level;
  //       checkAccess(levelNumber);
  //     } else {
  //       checkAccess(levelNumber);
  //       level = interviewLevel.data.find(c => c.level === levelNumber) || {};
  //       let userIds =
  //         (level.interviewpanel &&
  //           level.interviewpanel.users &&
  //           level.interviewpanel.users.map(c => c.Id)) ||
  //         [];
  //       canEdit = userIds && userIds.some(c => c === userId);
  //     }
  //     level.totalLevel = interviewLevel.data.length;
  //     level.interviewDate = state.interviewDate;
  //     props.getInterviewQstnsByJobPost(level.panelId, state.jobpostId);
  //     setLevelNo(levelNumber);
  //     setState({
  //       ...state,
  //       canEdit: canEdit
  //     });
  //     setInterviewLevel(level);
  //   }
  // }, [props.interviewLevel]);

  async function checkAccess(levelNo) {
    if (role === Roles.InterviewPanel) {
      let hasAccess = true;
      if (levelNo > 1) {
        hasAccess = await props.checkAssessmentAccess(levelNo - 1, applicantId);
      }

      if (hasAccess) {
        setHasAccess(true);
        props.getApplicantAssessment(levelNo, applicantId);
      } else {
        setHasAccess(false);
      }
      setNoData(false);
    } else {
      props.getApplicantAssessment(levelNo, applicantId).then((res) => {
        if (res) {
          setNoData(false);
        } else {
          setNoData(true);
        }
      });
      setHasAccess(true);
    }

    setContentLoading(false);
  }

  useEffect(() => {
    let interviewQstns = props.interviewQstns;
    let assessment = props.assessment;
    if (interviewQstns && interviewQstns.data.length > 0) {
      /*------QUESTIONNAIRE -----*/
      let assessmentQuest = [];
      interviewQstns.data.map((item) => {
        if (interviewLevel && item.level === interviewLevel.level && item.jobpostId === interviewLevel.jobpostId) {
          const jobinterviewqtns =
            assessment &&
            assessment.jobapplicationId === applicantId &&
            assessment.jobinterviewqtns.find((c) => c.id === item.id);
          const id =
            (jobinterviewqtns &&
              jobinterviewqtns.questassessments &&
              jobinterviewqtns.questassessments.id) ||
            0;
          const score =
            (jobinterviewqtns &&
              jobinterviewqtns.questassessments &&
              jobinterviewqtns.questassessments.score) ||
            0;
          assessmentQuest.push({
            id: id,
            questionId: item.id,
            panelId: item.panelId,
            question: item.question,
            score: score,
          });
        }
      });
      setInterviewQstns(assessmentQuest);
    }
  }, [props.assessment, props.interviewQstns]);

  const setOverallScore = (type, score, isDisabled = false) => {
    const newState = { ...state };
    if (type === "skill") {
      newState.skillScore = score;
      newState.disableSkillAssessment = isDisabled;
      if (isDisabled) {
        newState.skills = [];
      }
    } else if (type === "domain") {
      newState.domainScore = score;
      newState.disableDomainAssessment = isDisabled;
    } else if (type === "quest") {
      newState.questScore = score;
      newState.disableQuestAssessment = isDisabled;
      if (isDisabled) {
        newState.questionnaire = [];
      }
    } else if (type === "behaviour") {
      newState.behaviourScore = score;
      newState.disableBehaviourAssessment = isDisabled;
      if (isDisabled) {
        setBehaviouralAssessment({
          collaboration: 0,
          communication: 0,
          criticalThinking: 0,
          leadership: 0,
          timeManagement: 0,
          overallBehaviouralScore: 0,
        });
      }
    }
    // else if (type === "total") {
    //   newState.totalScore = score;
    // }
    const res = getNewWeightage(newState);
    setState({ ...newState, ...res });
  };

  const getNewWeightage = (newState) => {
    let totalWeightage = 0;
    if (!newState.disableSkillAssessment) {
      totalWeightage += state.initialskillWeightage;
    }
    if (!newState.disableDomainAssessment) {
      totalWeightage += state.initialdomainWeightage;
    }
    if (!newState.disableQuestAssessment) {
      totalWeightage += state.initialinterviewWeightage;
    }
    if (!newState.disableBehaviourAssessment) {
      totalWeightage += state.initialbehaviouralWeightage;
    }
    const newSkillWeightage = Math.round(
      (state.initialskillWeightage / totalWeightage) * 100
    );
    const newDomainWeightage = Math.round(
      (state.initialdomainWeightage / totalWeightage) * 100
    );
    const newInterviewWeightage = Math.round(
      (state.initialinterviewWeightage / totalWeightage) * 100
    );
    const newBehaviouralWeightage = Math.round(
      (state.initialbehaviouralWeightage / totalWeightage) * 100
    );
    return {
      skillWeightage: newSkillWeightage,
      domainWeightage: newDomainWeightage,
      interviewWeightage: newInterviewWeightage,
      behaviouralWeightage: newBehaviouralWeightage,
    };
  };

  const totalScore = () => {
    let totalScore =
      (state.skillScore > 0 &&
        Math.round(state.skillScore * (state.skillWeightage / 100))) +
      (state.domainScore > 0 &&
        Math.round(state.domainScore * (state.domainWeightage / 100))) +
      (state.questScore > 0 &&
        Math.round(state.questScore * (state.interviewWeightage / 100))) +
      (state.behaviourScore > 0 &&
        Math.round(state.behaviourScore * (state.behaviouralWeightage / 100)));
    return totalScore;
  };

  const setSkillScore = (skills, overallscore, isOverride = false) => {
    setState({
      ...state,
      skills: skills,
      skillScore: overallscore,
      overrideSkillScore: isOverride,
    });
  };

  const setQuestionnaire = (quest, overallscore) => {
    setState({
      ...state,
      questionnaire: quest,
      questScore: overallscore,
    });
  };

  const setBehaviour = (behaviour, overallscore) => {
    const {
      collaboration,
      communication,
      thinking,
      leadership,
      time,
    } = behaviour;

    setBehaviouralAssessment({
      collaboration: collaboration,
      communication: communication,
      criticalThinking: thinking,
      leadership: leadership,
      timeManagement: time,
      overallBehaviouralScore: overallscore,
    });
    setState({
      ...state,
      behaviourScore: overallscore,
    });
  };

  const setComments = (comments, isDisabled = false) => {
    setState({
      ...state,
      comments: comments,
      disableCommentAssessment: isDisabled,
    });
  };

  const skillMatrix = (id) => {
    props.history.push({
      pathname: "/rc/matrix/" + id,
    });
  };

  const checkJobPosition = (jobpostId) => {
    if (props.jobList && props.jobList.data && props.jobList.data.length > 0) {
      let jobPost =
        props.jobList.data.filter((c) => c.id === jobpostId) &&
        props.jobList.data.filter((c) => c.id === jobpostId)[0];
      let jobPosition = jobPost.position;
      let hiredApplicants =
        jobPost.applicants.filter(
          (c) =>
            c.applicantassessments &&
            c.applicantassessments.length > 0 &&
            c.applicantassessments[0].status === 1
        ).length + 1;
      if (jobPosition === hiredApplicants) {
        let data = {};
        data.id = jobpostId;
        data.status = 6; //6 - closed
        props.createJobPost(data, null);
      }
    }
  };

  const handleSubmit = (status) => {
    setState({ ...state, loading: true });
    const data = {};
    data.id = state.assessmentId;
    data.level = interviewLevel.level;
    data.interviewDate = state.interviewDate || new Date();
    data.skills = state.skills;
    data.overallSkillScore = state.skillScore;
    data.overallDomainScore = state.domainScore;
    data.questionnaire = state.questionnaire;
    data.overallQuestionnaireScore = state.questScore;
    data.overallBehaviouralScore = state.behaviourScore;
    data.overallScore = state.totalScore || totalScore();
    data.timeManagement =
      behaviouralAssessment && behaviouralAssessment.timeManagement;
    data.communication =
      behaviouralAssessment && behaviouralAssessment.communication;
    data.collaboration =
      behaviouralAssessment && behaviouralAssessment.collaboration;
    data.criticalThinking =
      behaviouralAssessment && behaviouralAssessment.criticalThinking;
    data.leadership = behaviouralAssessment && behaviouralAssessment.leadership;
    data.comments = state.comments;
    data.jobpostId = state.jobpostId;
    data.status = status; //1-Hire,2-Reject,3-On hold
    data.isFinalLevel = true;
    if (status === 1) {
      // data.mailtoInterviewer = true;
      setShowPopupforHire(true);
      // checkJobPosition(data.jobpostId);
    }
    if (interviewLevel.level !== interviewLevel.totalLevel) {
      data.isFinalLevel = false;
    }
    data.jobapplicationId = applicant.id;
    data.overrideSkillScore = state.overrideSkillScore;
    data.disableSkillAssessment = state.disableSkillAssessment;
    data.disableDomainAssessment = state.disableDomainAssessment;
    data.disableQuestAssessment = state.disableQuestAssessment;
    data.disableBehaviourAssessment = state.disableBehaviourAssessment;
    data.disableCommentAssessment = state.disableCommentAssessment;
    //console.log(data);
    props.saveApplicantAssessment(data).then((result) => {
      props.getApplicantAssessment(interviewLevel.level, applicant.id);
      setState({ ...state, loading: false, canEdit: false });
      handleCancelHire();
      handleCancelReject();
    });
  };

  const handleHire = () => {
    setShowPopupforHire(true);
  };

  const handleCancelHire = () => {
    setShowPopupforHire(false);
  };

  const handleReject = () => {
    setShowPopupforReject(true);
  };

  const handleCancelReject = () => {
    setShowPopupforReject(false);
  };

  const handlePaginate = (next) => {
    let pageNo = paginate.pageNo + next;
    --pageNo;

    const applicantId =
      paginate.candidates &&
      paginate.candidates.length > 0 &&
      paginate.candidates.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
    if (applicantId) {
      props.getJobApplicationsById(applicantId);
      setApplicantId(parseInt(applicantId));
      setPaginate({ ...paginate, pageNo: pageNo + 1 });
    }
  };

  const renderLevels = (totalLevel) => {
    let levels = [];
    for (let i = 0; i < totalLevel; i++) {
      levels.push(
        <MenuItem key={i} value={i + 1}>
          {i + 1}
        </MenuItem>
      );
    }
    return levels;
  };

  const handleChangeLevel = (next, level, totalLevel) => {
    let pageNo = level + next;
    setLevelNo(pageNo);
  };

  const renderLoading = () => (
    <div
      className={classes.progressWrapper}
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        marginBottom: 30,
      }}
    >
      <CircularProgress className={classes.progress} size={20} />
    </div>
  );

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container
        className={classes.root}
        style={{ backgroundColor: "#f3f3f3" }}
      >
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px 20px 0"
          }}
        >
          <Button
            variant="contained"
            className={classes.button}
            size="small"
            to="/Recap"
            component={Link}
            style={{
              boxShadow: "none",
              borderRadius: "5px",
              border: "1px solid #efefef",
              textTransform: "inherit",
              fontWeight: "normal",
              letterSpacing: "0"
            }}
          >
            <OfflineBoltOutlined
              style={{ color: "#60CE8C", marginRight: "5px" }}
            />
            Candidate Recap
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            size="small"
            style={{
              boxShadow: "none",
              borderRadius: "5px",
              border: "1px solid #efefef",
              textTransform: "inherit",
              fontWeight: "normal",
              letterSpacing: "0"
            }}
          >
            <DescriptionOutlined
              style={{ color: "#60CE8C", marginRight: "5px" }}
            />
            Interview Assessment
          </Button>
        </Box> */}
        {(role === Roles.Admin ||
          role === Roles.HiringManager ||
          role === Roles.TalentAcquisitionTeam) && (
          <Grid
            item
            xs={12}
            style={{
              position: "sticky",
              top: 44,
              display: "flex",
              zIndex: 99,
              width: "100%",
              padding: "20px",
            }}
          >
            <div
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#e0e0e0",
                padding: "10px",
                fontFamily: "Roboto",
                width: "100%",
                backgroundColor: "#fff",
                textAlign: "right",
              }}
            >
              {paginate.candidates && (
                <>
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={() => handlePaginate(-1)}
                    disabled={paginate.pageNo === 1}
                    style={{
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid #efefef",
                      textTransform: "inherit",
                      fontWeight: "normal",
                      letterSpacing: "0",
                      marginRight: "5px",
                    }}
                  >
                    <ArrowBackOutlined
                      style={{ color: "#60CE8C", marginRight: "5px" }}
                    />{" "}
                    {t("previous")}
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={() => handlePaginate(1)}
                    disabled={paginate.totalPage === paginate.pageNo}
                    style={{
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid #efefef",
                      textTransform: "inherit",
                      fontWeight: "normal",
                      letterSpacing: "0",
                      marginRight: "5px",
                    }}
                  >
                    <ArrowForwardOutlined
                      style={{ color: "#60CE8C", marginRight: "5px" }}
                    />{" "}
                    {t("next")}
                  </Button>
                  {/* <Button
                    onClick={() => handlePaginate(-1)}
                    disabled={paginate.pageNo === 1}
                  >
                    <ArrowBackOutlined size /> Previous
                  </Button> */}
                  {/* <Button
                    onClick={() => handlePaginate(1)}
                    disabled={paginate.totalPage === paginate.pageNo}
                  >
                    <ArrowForwardOutlined />
                    Next
                  </Button> */}
                  {/* <Select
                    value={levelNo}
                    margin="dense"
                    input={
                      <OutlinedInput
                        labelWidth={0}
                        name="Level"
                        id="outlined-age-simple"
                      />
                    }
                    onChange={event => handleChangeLevel(event.target.value)}
                  >
                    {interviewLevel && renderLevels(interviewLevel.totalLevel)}
                  </Select> */}
                </>
              )}
              <Button
                autoCapitalize="false"
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => {
                  skillMatrix(state.jobpostId);
                }}
              >
                {t("backtoSkillMatrix")}
              </Button>
            </div>
          </Grid>
        )}
        {loading ? (
          renderLoading()
        ) : (
          <div>
            <Profile
              applicant={applicant}
              interviewLevel={interviewLevel}
              interviewschedule={props.interviewschedule}
              getFile={props.getFile}
              assessment={props.assessment}
              profile={props.profile}
              handleChangeLevel={handleChangeLevel}
            />

            {contentLoading ? (
              renderLoading()
            ) : noData ? (
              <div className={classes.noAccessWrap}>
                <Box>
                  <Typography variant="h4">{t("common:nodata")}</Typography>
                </Box>
              </div>
            ) : hasAccess ? (
              <React.Fragment>
                <Skills
                  skillWeightage={state.skillWeightage}
                  disabled={
                    !state.canEdit || state.skillWeightage === 0
                  } /**disable if weightage is 0 */
                  skills={skills}
                  skillScore={state.skillScore}
                  setSkillScore={setSkillScore}
                  setOverallScore={setOverallScore}
                  overrideSkillScore={state.overrideSkillScore}
                  disableSkillAssessment={state.disableSkillAssessment}
                />
                <Domain
                  domainWeightage={state.domainWeightage}
                  disabled={
                    !state.canEdit || state.domainWeightage === 0
                  } /**disable if weightage is 0 */
                  domainScore={state.domainScore}
                  setOverallScore={setOverallScore}
                  disableDomainAssessment={state.disableDomainAssessment}
                />
                <Questionnaire
                  interviewWeightage={state.interviewWeightage}
                  disabled={
                    !state.canEdit || state.interviewWeightage === 0
                  } /**disable if weightage is 0 */
                  questScore={state.questScore}
                  interviewQstns={interviewQstns}
                  setQuestionnaire={setQuestionnaire}
                  setOverallScore={setOverallScore}
                  disableQuestAssessment={state.disableQuestAssessment}
                />
                <Behaviour
                  behaviouralWeightage={state.behaviouralWeightage}
                  disabled={
                    !state.canEdit || state.behaviouralWeightage === 0
                  } /**disable if weightage is 0 */
                  behaviouralAssessment={behaviouralAssessment}
                  setBehaviour={setBehaviour}
                  setOverallScore={setOverallScore}
                  disableBehaviourAssessment={state.disableBehaviourAssessment}
                />
                <Comments
                  disabled={!state.canEdit}
                  comments={state.comments}
                  setComments={setComments}
                  disableCommentAssessment={state.disableCommentAssessment}
                />
                <Score
                  disabled={!state.canEdit}
                  scores={state}
                  setOverallScore={setOverallScore}
                  totalScore={totalScore}
                />

                {state.loading ? (
                  <Box style={{ padding: "0 0 20px 20px" }}>
                    <CircularProgress className={classes.progress} size={20} />
                  </Box>
                ) : (
                  state.canEdit && (
                    <Box style={{ padding: "0 0 20px 20px" }}>
                      <Button
                        variant="contained"
                        className={classes.button}
                        style={{
                          boxShadow: "none",
                          margin: "5px",
                          backgroundColor: "#57B894",
                          color: "#fff",
                        }}
                        onClick={() => {
                          handleHire();
                        }}
                      >
                        {t("hire")}
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.button}
                        style={{
                          boxShadow: "none",
                          margin: "5px",
                          backgroundColor: "#FF725F",
                          color: "#fff",
                        }}
                        onClick={() => {
                          handleReject();
                          // handleSubmit(2);
                        }}
                      >
                        {t("common:reject")}
                      </Button>
                      {/* <Button
                        variant="contained"
                        className={classes.button}
                        style={{
                          boxShadow: "none",
                          margin: "5px",
                          backgroundColor: "#979797",
                          color: "#fff"
                        }}
                        onClick={() => {
                          handleSubmit(3);
                        }}
                      >
                        ON HOLD
                      </Button> */}
                    </Box>
                  )
                )}
              </React.Fragment>
            ) : (
              <div className={classes.noAccessWrap}>
                <Box>
                  <Typography variant="h4">{t("noAccesstoLevel")}</Typography>
                </Box>
              </div>
            )}
          </div>
        )}
      </Container>

      {/* For Hire */}
      <Dialog
        open={showPopupforHire}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          {t("common:errMsg.confirmHire")}
        </DialogTitle>
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
                {t("hireConfirmation")} <br></br>
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
              onClick={() => handleCancelHire()}
            >
              {t("common:no")}
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSubmit(1)}
              className={classes.ctaButton}
            >
              {t("common:yes")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* For Reject */}
      <Dialog
        open={showPopupforReject}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          {t("common:errMsg.confirmReject")}
        </DialogTitle>
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
                {t("rejectConfirmation")}
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
              onClick={() => handleCancelReject()}
            >
              {t("common:no")}
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSubmit(2)}
              className={classes.ctaButton}
            >
              {t("common:yes")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  getJobApplicationsById,
  getInterviewDetailsByJobPost,
  getInterviewQstnsByJobPost,
  getFile,
  saveApplicantAssessment,
  getApplicantAssessment,
  checkAssessmentAccess,
  getInterviewersByApplicantId,
  getJobsbyEmployer,
  getJobApplicantsByJobPost,
  createJobPost,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  jobApplication: (state.jobApplication && state.jobApplication.data) || null,
  interviewLevel: (state.jobPost && state.jobPost.interviewLevel) || null,
  interviewQstns: (state.jobPost && state.jobPost.interviewQstns) || null,
  assessment: (state.jobApplication && state.jobApplication.assessment) || null,
  applicantInterviewers:
    state.jobApplication && state.jobApplication.applicantInterviewers,
  jobList: state.jobPost && state.jobPost.jobList,
  interviewschedule:state.jobApplication && state.jobApplication.interviewSchedule
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InterviewAssessment));
