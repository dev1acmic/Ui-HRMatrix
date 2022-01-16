
import _ from 'lodash'
export default (state = {}, action) => {
  switch (action.type) {
    case "QUERY_JOBAPPLICANTIONS":
      return {
        ...state,
        query: action.query
      };
    case "LOAD_STATES":
      return {
        ...state,
        states: action.data
      };
    // case "JOB_APPLICATION":
    //   let applications = state.query;
    //   let index = applications.findIndex(c => c.id === action.data.id);
    //   if (index != -1) {
    //     let item = action.data;
    //     applications[index] = item;
    //   }
    //   return {
    //     ...state,
    //     data: { ...state.data, ...action.data },
    //     query: { ...state.query, query: [...applications] },
    //   };
    case "JOB_APPLICATION":
      let applications = [];
      if (state && state.query) {
        applications = state.query;
        let index = applications && applications.findIndex(c => c.id === action.data.id);
        if (index !== -1 && index !== undefined) {
          let item = action.data;
          applications[index] = item;
        }
      }
      return {
        ...state,
        data: { ...state.data, ...action.data },
        query: [...applications],
      };
    case "GET_JOBAPPLICATION":
      return {
        ...state,
        data: action.data
      };
    case "REMOVE_APPL_EMPLOYERS":
      return {
        ...state,
        data: {
          ...state.data,
          jobapplicantemployers: state.data.jobapplicantemployers.filter(
            c => c.id !== action.deletedId
          )
        }
      };
    case "REMOVE_APPL_EDUCATION":
      return {
        ...state,
        data: {
          ...state.data,
          jobapplicantedu: state.data.jobapplicantedu.filter(
            c => c.id !== action.deletedId
          )
        }
      };
    case "CLEAR_JOBAPPL":
      return {
        ...state,
        data: null
      };
    case "GET_APPLICANT_ASSESSMENT":
      return {
        ...state,
        assessment: action.data
      };
    case "CLEAR_APPLICANT_ASSESSMENT":
      return {
        ...state,
        assessment: null
      };
    case "GET_APPLICANT_ASSESSMENT_SCORES":
      return {
        ...state,
        assessmentLevelScore: action.data
      };
    case "GET_INTERVIEW_PANEL_MEMBERS":
      return {
        ...state,
        panelMembers: action.data
      };
    case "GET_INTERVIEW_SCHEDULE":
      return {
        ...state,
        interviewSchedule: action.data
      };
    case "GET_CANIDTATE_SCHEDULE":
      return {
        ...state,
        candidateSchedule: action.data
      };
    case "GET_APPLICANT_INTERVIEWERS":
      return {
        ...state,
        applicantInterviewers: _.sortBy(action.data, o => o.level),
      };
    default:
      return state;
  }
};
