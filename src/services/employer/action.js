import client from "../feathersApi";
//import { services } from "../store";
import { errorHandler } from "../error/action";
import { Roles } from "../../util/enum";
const moment = require("moment");

export const loadDepartments = (id) => async (dispatch) => {
  try {
    const res = await client.service("departments").find({
      query: {
        organizationId: id,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_DEPARTMENTS",
        data: res.data,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getDepartment = async (Id) => {
  try {
    const res = await client.service("departments").get(Id);
    if (res) {
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadAddresses = (employerId) => async (dispatch) => {
  try {
    const res = await client.service("officelocations").find({
      query: {
        organizationId: employerId,
      },
    });
    if (res && res.data) {
      let addresses = [];
      res.data.map((item) => {
        if (
          item.address &&
          item.address.line1 &&
          item.address.city &&
          item.address.state &&
          item.address.zip
        ) {
          return addresses.push(item.address);
        }
      });
      dispatch({
        type: "LOAD_LOCATIONS",
        data: addresses,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadSkills = () => async (dispatch) => {
  try {
    const res = await client.service("skills").find({
      query: {
        $limit: -1,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_SKILLS",
        data: res,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadConfiguration = (employerId) => async (dispatch) => {
  try {
    const res = await client.service("orgconfig").find({
      query: {
        organizationId: employerId,
      },
    });
    if (res && res.data) {
      let config = [];
      res.data.map((c) => {
        if (c.key === "Level") {
          const level = c.value;
          let levels = [];
          for (var i = 1; i <= level; i++) {
            levels.push({ id: i, name: "TRANSLATION.level " + i });
          }
          config.levels = levels;
        }
        // else if (c.key === "FinStartMonth") {
        //   config.FinStartMonth = c.value;
        // } else if (c.key === "FinEndMonth") {
        //   config.FinEndMonth = c.value;
        // }
        else {
          config[c.key] = c.value;
        }
      });
      dispatch({
        type: "LOAD_ORGCONFIG",
        data: config,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadInterviewLevels = (employerId) => async (dispatch) => {
  try {
    const res = await client.service("orgconfig").find({
      query: {
        organizationId: employerId,
        key: "Level",
      },
    });
    if (res && res.data && res.data[0]) {
      const level = res.data[0].value;
      let levels = [];
      for (var i = 1; i <= level; i++) {
        levels.push({ id: i, name: "Level " + i });
      }
      dispatch({
        type: "LOAD_INTERVIEWLEVELS",
        data: levels,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadInterviewers = (employerId) => async (dispatch) => {
  try {
    const res = await client.service("interviewpanels").find({
      query: {
        organizationId: employerId,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_INTERVIEWPANELS",
        data: res.data,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
//load recruiters by location
export const loadRecruiters = (employerId) => async (dispatch) => {
  try {
    const res = await client.service("employerRecruiters").find({
      query: {
        // $sort: {
        //   id: -1,
        // },
        $limit: -1,
        // $include: true,
        empOrgId: employerId,
        status: {
          $lte: 2, // 1 -active 2 - inactive 3 -removed
        },
        //type: 2,
      },
    });
    if (res) {
      dispatch({
        type: "GET_RECRUITERS",
        data: res,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadRecentlyContactedRecruiters = (
  employerId,
  jobpostId
) => async (dispatch) => {
  try {
    // const res = await client.service("employerRecruiters").find({
    //   query: {
    //     $sort: {
    //       createdAt: -1,
    //     },
    //     empOrgId: employerId,
    //     status: 1,
    //     $jobpostId: jobpostId,
    //   },
    // });
    const res = await client.service("jobpostinvites").find({
      query: {
        $sort: {
          createdAt: -1,
        },
        jobpostId: jobpostId,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_RECENTLY_CONTACTED_RECRUITERS",
        data: res,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadRecentlyContactedPremiumRecruiters = (jobpostId) => async (dispatch) => {
  try {
    const res = await client.service("jobpostinvites").find({
      query: {
        $sort: {
          createdAt: -1,
        },
        jobpostId: jobpostId,
        isPremium: 1,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_RECENTLY_CONTACTED_PREMIUM_RECRUITERS",
        data: res,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const inviteRecruiter = (data) => async () => {
  try {
    let newData = [];
    data.recruiters.map((user) => {
      newData.push({
        recruiterId: user.recruiterId,
        recOrgId: user.recOrgId,
        jobpostId: data.jobpostId,
        msg: data.msg || null,
        sendToPremium: data.sendToPremium,
      });
      return newData;
    });
    const res = await client.service("custom").create(newData);
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

// export const addAgency = (data) => async (dispatch) => {
//   try {
//     let res;
//     let empRes;
//     let orgRes;
//     let {
//       orgId,
//       companyName,
//       userId,
//       fname,
//       lname,
//       username,
//       password,
//       status,
//       empOrgId,
//     } = data;

//     const org = {
//       orgId,
//       companyName,
//     };
//     const user = {
//       id: userId,
//       fname,
//       lname,
//       username,
//       password,
//       status,
//     };
//     user.email = username;
//     user.type = 2;
//     user.reset = true;
//     org.name = companyName;
//     org.type = 2;

//     if (orgId > 0) {
//       orgRes = await client.service("organizations").update(orgId, org);
//       if (orgRes) {
//         try {
//           let res;
//           if (user.id > 0) {
//             res = await client.service("users").patch(user.id, user);
//             if (res) {
//               empRes = await client.service("custom").patch(
//                 null,
//                 { status: status },
//                 {
//                   query: {
//                     contactUserId: user.id,
//                     recOrgId: orgRes.id,
//                     empOrgId: empOrgId,
//                     status: user.status,
//                   },
//                 }
//               );
//               return true;
//             }
//           } else {
//             user.selfAuthorization = 3;
//             user.status = 0;
//             res = await client.service("users").create(user);
//             if (res) {
//               empRes = await client.service("employerRecruiters").create({
//                 contactUserId: res.id,
//                 status: status,
//                 empOrgId: empOrgId,
//                 recOrgId: orgRes.id,
//               });
//             }
//           }
//         } catch (error) {
//           errorHandler(error);
//           return false;
//         }
//       }
//     } else {
//       org.username = username;
//       org.status = 0;
//       orgRes = await client.service("organizations").create(org);
//       if (orgRes) {
//         user.selfAuthorization = 3;
//         user.status = 0;
//         user.organizationId = orgRes.id;
//         res = await client.service("users").create(user);
//         if (res) {
//           empRes = await client.service("employerRecruiters").create({
//             contactUserId: res.id,
//             status: status,
//             empOrgId: empOrgId,
//             recOrgId: orgRes.id,
//           });
//         }
//       }
//     }
//     if (empRes) {
//       const data = { ...empRes, organization: orgRes, user: user };
//       dispatch({
//         type: "ADD_AGENCY",
//         data: data,
//       });
//       return true;
//     }
//   } catch (error) {
//     if (
//       error.errors &&
//       error.errors[0] &&
//       error.errors[0].message !== "username must be unique"
//     ) {
//       errorHandler(error);
//     }
//     return false;
//   }
// };

export const attachAgency = (empOrgId, email) => async () => {
  try {
    const agency = await client.service("users").find({
      query: {
        email: email,
        type: 2,
      },
    });
    if (agency && agency.data.length > 0) {
      const user = agency.data[0];
      const empRes = await client.service("employerRecruiters").create({
        exists: true,
        contactUserId: user.id,
        status: 1,
        empOrgId: empOrgId,
        recOrgId: user.organizationId,
      });
      if (empRes) {
        return true;
      }
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getAgencySuggestions = (searchVal) => async () => {
  const agencies = await client.service("organizations").find({
    query: {
      type: 2,
      name: {
        $like: searchVal + "%",
      },
    },
  });
  return agencies;
};

export const getUserSuggestionsByAgency = (searchVal, oid) => async () => {
  const users = await client.service("users").find({
    query: {
      organizationId: oid,
      status: true,
      email: {
        $like: searchVal + "%",
      },
    },
  });
  return users;
};

export const loadEmployers = (limit = 10, pageno = 0) => async (dispatch) => {
  try {
    const res = await client.service("organizations").find({
      query: {
        $limit: limit,
        $skip: pageno * limit, //skip*limit
        $sort: {
          createdAt: -1,
        },
        type: 1,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_EMPLOYERS",
        data: res,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const updateEmployer = (data) => async (dispatch) => {
  try {
    let res;
    let empRes;
    let orgRes;
    let {
      orgId,
      companyName,
      addressId,
      addrLine1,
      addrLine2,
      city,
      state,
      zip,
      contactNo1,
      contactNo2,
      userId,
      fname,
      lname,
      username,
      password,
      status,
      trialPeriod,
      isPremium,
      empOrgId,
    } = data;

    const org = {
      orgId,
      companyName,
      contactNo1,
      contactNo2,
      addressId,
      addrLine1,
      addrLine2,
      city,
      state,
      zip,
      isPremium,
      status,
      trialPeriod,
    };
    const user = {
      id: userId,
      fname,
      lname,
      username,
      password,
      status,
    };
    user.email = username;
    org.name = companyName;
    org.stripeTrialEndDate = moment(new Date(), "DD-MM-YYYY").add(
      parseInt(data.trialPeriod),
      "days"
    );

    if (orgId > 0) {
      orgRes = await client.service("organizations").patch(orgId, org);
      if (orgRes) {
        try {
          const res = await client.service("users").patch(user.id, user);
          if (res) {
            empRes = await client.service("custom").patch(
              null,
              { status: status },
              {
                query: {
                  contactUserId: user.id,
                  recOrgId: orgRes.id,
                  empOrgId: empOrgId,
                  status: status,
                },
              }
            );
            if (empRes) {
              const data = {
                contactUserId: user.id,
                recOrgId: orgRes.id,
                empOrgId: empOrgId,
                status: status,
                organization: orgRes,
                user: user,
              };
              dispatch({
                type: "UPDATE_EMPLOYERS",
                data: data,
              });
              return true;
            }
          }
        } catch (error) {
          errorHandler(error);
          return false;
        }
      }
    } else {
      org.username = username;
      orgRes = await client.service("organizations").create(org);
      if (orgRes) {
        user.organizationId = orgRes.id;
        res = await client.service("users").create(user);
        if (res) {
          empRes = await client.service("employerRecruiters").create({
            contactUserId: res.id,
            status: status,
            empOrgId: empOrgId,
            recOrgId: orgRes.id,
          });
        }
      }
    }
    if (empRes) {
      if (orgRes.isPremium) {
        orgRes.isPremium = 1;
      } else {
        orgRes.isPremium = 0;
      }
      const data = { ...orgRes, orgAdmin: res };
      // dispatch({
      //   type: "ADD_PREMIUM_AGENCY_USERS",
      //   data: data,
      // });
      return true;
    }
    return false;
  } catch (error) {
    if (
      error.errors &&
      error.errors[0] &&
      error.errors[0].message !== "username must be unique"
    ) {
      errorHandler(error);
    }
    return error.data.message;
  }
  // }
};

// export const activateDeactivateEmployer = (data) => async (dispatch) => {
//   try {
//     const orgRes = await client.service("organizations").patch(data.id, data);
//     if (orgRes) {
//       const userStatus =
//         data.status === OrganizationStatus.Active ? true : false;
//       const res = await client.service("users").patch(
//         null,
//         { status: userStatus },
//         {
//           query: {
//             organizationId: data.id,
//           },
//         }
//       );
//       if (res) {
//         // const data = {
//         //   orgRes, admin: orgRes, user: user
//         // }
//         // dispatch({
//         //   type: "UPDATE_EMPLOYERS",
//         //   data: data,
//         // });
//         return true;
//       }
//     }
//   } catch (error) {
//     errorHandler(error);
//     return false;
//   }
// };
