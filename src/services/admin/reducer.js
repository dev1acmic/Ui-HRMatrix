export default (state = {}, action) => {
  switch (action.type) {
    case "LOAD_ORGANIZATION":
      return {
        ...state,
        organization: action.data,
      };
    case "LOAD_ROLES":
      return {
        ...state,
        roles: action.data,
      };
    case "LOAD_USERS":
      return {
        ...state,
        users: action.data,
      };
    case "ADD_USER":
      return {
        ...state,
        newuser: [action.data],
      };
    // case "GET_USER":
    //   return {
    //     ...state,
    //     userData: action.data
    //   };
    case "LOAD_PREMIUM_RECRUITERS":
      return {
        ...state,
        premiumRecruiters: action.data,
      };
    case "LOAD_RECRUITERS":
      return {
        ...state,
        recruiters: action.data,
      };
    case "LOAD_STATES":
      return {
        ...state,
        states: action.data,
      };
    // case "UPDATE_ORGANIZATION":
    //   return {
    //     ...state,
    //     organization: action.data
    //   };
    case "LOAD_ORG_ADDRESS":
      return {
        ...state,
        orgOtherAddrr: action.data,
      };
    case "LOAD_ORG_INTERVIEW_PANEL":
      return {
        ...state,
        interviewpanels: action.data,
      };

    case "UPDATE_ORG_CONFIG":
      return {
        ...state,
        orgconfig: { ...state.orgconfig, data: action.data.orgConfig },
      };

    case "UPDATE_DEPARTMENT":
      return {
        ...state,
        department: { ...state.departments, data: action.data.departments },
      };

    case "INTERVIEW_PANELS":
      return {
        ...state,
        interviewpanels: {
          ...state.interviewpanels,
          data: action.data.interviewpanels,
        },
        newuser: null,
      };

    case "OFFICE_LOCATIONS":
      return {
        ...state,
        orgOtherAddrr: {
          ...state.orgOtherAddrr,
          data: action.data.orgOtherAddrr,
        },
      };

    case "CLEAR_USER":
      return {
        ...state,
        newuser: null,
      };

    case "LOAD_ORG_CONFIG":
      return {
        ...state,
        orgconfig: action.data,
      };

    case "ADD_AGENCY_USERS":
      if (state.recruiters && state.recruiters.data) {
        return {
          ...state,
          recruiters: { ...state.recruiters, data: unique([action.data, ...state.recruiters.data], "recOrgId") },
        };
      }
      else {
        return {
          ...state
        }
      }

    case "UPDATE_AGENCY_USERS":
      let agencies = state.recruiters.data;
      let index = agencies.findIndex(c => c.contactUserId === action.data.contactUserId);
      if (index != -1) {
        let item = agencies[index];
        item.user = { ...item.user, ...action.data.user };
        item.organization = { ...item.organization, ...action.data.organization };
        agencies[index] = { ...item };
      }
      return {
        ...state,
        recruiters: { ...state.recruiters, data: [...agencies] },
      };
    case "REMOVE_AGENCY_USERS":
      let agencyData = state.recruiters.data;
      let agencyIndex = agencyData.findIndex(c => c.empOrgId === action.empOrgId && c.recOrgId === action.recOrgId && c.contactUserId === action.contactUserId);
      if (agencyIndex !== -1) {
        agencyData.splice(agencyIndex, 1);
      }
      return {
        ...state,
        recruiters: {
          ...state.recruiters,
          data: [...agencyData]
        }
      };

    case "ADD_PREMIUM_AGENCY_USERS":
      return {
        ...state,
        premiumRecruiters: { ...state.premiumRecruiters, data: [action.data, ...state.premiumRecruiters.data] },
      };

    case "UPDATE_PREMIUMAGENCY_USERS":
      let premiumAgencies = state.premiumRecruiters.data;
      let premiumAgencyIndex = premiumAgencies.findIndex(c => c.orgId === action.data.orgId);
      if (premiumAgencyIndex != -1) {
        let item = premiumAgencies[premiumAgencyIndex];
        item.user = { ...item.user, ...action.data.user };
        item.organization = { ...item.organization, ...action.data.organization };
        premiumAgencies[premiumAgencyIndex] = { ...item };
      }
      return {
        ...state,
        premiumRecruiters: { ...state.premiumRecruiters, data: [...premiumAgencies] },
      };

    default:
      return state;
  }
};


function unique(array, propertyName) {
  return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

