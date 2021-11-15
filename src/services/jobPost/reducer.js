export default (state = {}, action) => {
  switch (action.type) {
    case "CREATE_JOBPOST":
      return {
        ...state,
        data: action.data,
        errors: Object.assign({}, state.errors, action.errors),
      };
    case "PATCH_JOBPOST":
      return {
        ...state,
        data: action.data,
        errors: Object.assign({}, state.errors, action.errors),
      };
    case "UPDATE_JOBPOST":
      return {
        ...state,
        data: action.data,
        errors: Object.assign({}, state.errors, action.errors),
      };
    case "GET_JOBPOST":
      return {
        ...state,
        data: action.data,
      };
    case "REMOVE_JOBSKILL":
      return {
        ...state,
        data: {
          ...state.data,
          jobskills: state.data.jobskills.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };

    case "REMOVE_JOBEDUCATION":
      return {
        ...state,
        data: {
          ...state.data,
          jobeduqualifications: state.data.jobeduqualifications.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };

    case "REMOVE_JOBCERTIFICATION":
      return {
        ...state,
        data: {
          ...state.data,
          jobcertifications: state.data.jobcertifications.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };

    case "REMOVE_JOB_SCREENING_QUESTION":
      return {
        ...state,
        data: {
          ...state.data,
          jobscreeningqtns: state.data.jobscreeningqtns.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };

    case "REMOVE_JOB_INTERVIEW_LEVEL":
      return {
        ...state,
        data: {
          ...state.data,
          jobinterviewers: state.data.jobinterviewers.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };

    case "REMOVE_JOB_INTERVIEW_QUES":
      return {
        ...state,
        data: {
          ...state.data,
          jobinterviewqtns: state.data.jobinterviewqtns.filter(
            (c) => c.id !== action.deletedId
          ),
        },
      };
    case "GET_ALLJOBS":
      return {
        ...state,
        jobList: { ...action.query },
      };
    case "GET_ALL_OPENJOBS":
      return {
        ...state,
        openjobList: { ...action.query },
      };

    case "GET_ALL_JOBSBYATTENTION":
      return {
        ...state,
        needattentionjobList:
          (action.data && action.data.needAttentionJobs) || [],
      };

    case "CLEAR_JOBPOST":
      return {
        ...state,
        data: null,
      };
    case "GET_JOB_SUMMARY":
      return {
        ...state,
        summary: { ...action.data },
      };

    case "GET_JOB_APPLICANTS_BY_JOBPOST":
      return {
        ...state,
        applicants: { ...action.query },
      };

    case "GET_INTERVIEW_DETAILS":
      return {
        ...state,
        interviewLevel: { ...action.data },
      };

    case "GET_INTERVIEW_QSTNS":
      return {
        ...state,
        interviewQstns: { ...action.data },
      };
    case "GET_REPORT_SUMMARY":
      return {
        ...state,
        reports: { ...action.data },
      };
    default:
      return state;
  }
};
