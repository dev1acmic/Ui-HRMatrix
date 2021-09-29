export default (state = {}, action) => {
  switch (action.type) {
    case "LOAD_DEPARTMENTS":
      return {
        ...state,
        departments: action.data,
      };
    case "LOAD_SKILLS":
      return {
        ...state,
        skills: action.data,
      };
    case "LOAD_LOCATIONS":
      return {
        ...state,
        locations: action.data,
      };
    case "LOAD_ORGCONFIG":
      return {
        ...state,
        config: action.data,
      };
    case "LOAD_INTERVIEWLEVELS":
      return {
        ...state,
        levels: action.data,
      };
    case "LOAD_INTERVIEWPANELS":
      return {
        ...state,
        interviewers: action.data,
      };
    case "GET_RECRUITERS":
      return {
        ...state,
        recruiters: action.data,
      };
    case "LOAD_RECENTLY_CONTACTED_RECRUITERS":
      return {
        ...state,
        recentRecruiters: action.data,
      };
    case "LOAD_RECENTLY_CONTACTED_PREMIUM_RECRUITERS":
      return {
        ...state,
        recentPremiumRecruiters: action.data,
      };
    case "LOAD_RECRUITERS":
      return {
        ...state,
        recruiters: action.data,
      };
    case "ADD_AGENCY_USERS":
      if (state.recruiters && state.recruiters.length > 0) {
        return {
          ...state,
          recruiters: [action.data, ...state.recruiters],
        };
      }
      else {
        return {
          ...state
        }
      }

    case "LOAD_EMPLOYERS":
      return {
        ...state,
        employers: action.data,
      };

    case "UPDATE_EMPLOYERS":
      let employers = state.employers.data;
      let employerIndex = employers.findIndex(c => c.id === action.data.id);
      if (employerIndex != -1) {
        let item = employers[employerIndex];
        item.user = { ...item.user, ...action.data.user };
        item.admin = { ...item.admin, ...action.data.admin };
        employers[employerIndex] = { ...item };
      }
      return {
        ...state,
        premiumRecruiters: { ...state.employers, data: [...employers] },
      };

    default:
      return state;
  }
};
