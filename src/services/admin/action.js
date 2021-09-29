import client from "../feathersApi";
import { errorHandler } from "../error/action";

import {
  Roles,
  OrganizationStatus,
  Role,
  SelfAuthorization,
} from "../../util/enum";
import { async } from "validate.js";

const moment = require("moment");

export const loadRoles = () => async (dispatch) => {
  try {
    const res = await client.service("roles").find();
    if (res) {
      dispatch({
        type: "LOAD_ROLES",
        data: res.data,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadStates = () => async (dispatch) => {
  try {
    const res = await client.service("states").find({
      query: {
        $limit: 51,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_STATES",
        data: res.data,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const addUser = (user) => async (dispatch) => {
  user.email = user.username;
  user.type = 1;
  user.reset = true;
  try {
    let res;
    if (user.id > 0) {
      res = await client.service("users").patch(user.id, user);
    } else {
      res = await client.service("users").create(user);
    }
    if (res) {
      dispatch({
        type: "ADD_USER",
        data: { id: res.id, fname: res.fname, lname: res.lname },
      });
      //  return true;
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const clearUser = () => (dispatch) => {
  dispatch({
    type: "CLEAR_USER",
  });
};

export const loadUsers = (orgId, limit = 10, pageno = 0) => async (
  dispatch
) => {
  try {
    const res = await client.service("users").find({
      query: {
        $select: [
          "id",
          "fname",
          "lname",
          "createdAt",
          "status",
          "username",
          "isVerified",
          "isReferal",
          "selfAuthorization",
          "isDeleted",
        ],
        $limit: limit,
        $skip: pageno * limit, //skip*limit
        $sort: {
          createdAt: -1,
        },
        organizationId: orgId,
        selfAuthorization: { $lte: 2 },
        isDeleted: false,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_USERS",
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

// export const getUserById = id => async dispatch => {
//   try {
//     const res = await client.service("users").get(id);
//     if (res) {
//       dispatch({
//         type: "GET_USER",
//         data: res
//       });
//       return true;
//     }
//     return false;
//   } catch (error) {
//     errorHandler(error);
//     return false;
//   }
// };

export const addRecruiter = (user) => async (dispatch) => {
  user.email = user.username;
  //user.roleId = Roles.AgencyRecruiter;
  user.type = 2;
  user.reset = true;
  try {
    let res;
    if (user.id > 0) {
      res = await client.service("users").patch(user.id, user);
    } else {
      res = await client.service("users").create(user);
    }
    if (res) {
      dispatch({
        type: "ADD_USER",
        data: { id: res.id, fname: res.fname, lname: res.lname },
      });
      //  return true;
      return res;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

/*----- AGENCY------*/

export const loadPremiumAgencies = (limit = 10, pageno = 0) => async (
  dispatch
) => {
  try {
    const res = await client.service("organizations").find({
      query: {
        $limit: limit,
        $skip: pageno * limit, //skip*limit
        $sort: {
          createdAt: -1,
        },
        type: 2
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_PREMIUM_RECRUITERS",
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

export const loadAgencies = (employerId, limit = 10, pageno = 0) => async (
  dispatch
) => {
  try {
    const res = await client.service("employerRecruiters").find({
      query: {
        $limit: limit,
        $skip: pageno * limit, //skip*limit
        $sort: {
          createdAt: -1,
        },
        status: {
          $lte: 2, // 1 -active 2 - inactive 3 -removed
        },
        empOrgId: employerId,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_RECRUITERS",
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

export const adminApproval = (id, isApproved) => async (dispatch) => {
  // Approve or deny user approval from agency recruiter list.
  try {
    let res = await client.service("custom").patch(
      null,
      {},
      {
        query: {
          isAdminApproval: true,
          contactUserId: id,
          isApproved: isApproved,
        },
      }
    );
    if (res) {
      return true;
    }

    return null;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const addAgency = (data) => async (dispatch) => {
  try {
    let res;
    let empRes;
    let orgRes;
    let {
      recOrgId,
      companyName,
      userId,
      fname,
      lname,
      username,
      password,
      status,
      empOrgId,
    } = data;

    const org = {
      recOrgId,
      companyName,
    };
    const user = {
      id: userId,
      fname,
      lname,
      username,
      password,
    };

    user.email = username;
    user.type = 2;
    user.reset = true;

    org.name = companyName;
    org.type = 2;

    let orgId = recOrgId;

    if (orgId === 0) {
      org.username = username;
      org.status = 0;
    }

    if (orgId > 0) {
      user.organizationId = orgId;
      orgRes = await client.service("organizations").patch(orgId, org);
      if (orgRes) {
        try {
          if (user.id > 0) {
            res = await client.service("users").patch(user.id, user);
          } else {
            user.isReferal = true;
            user.status = 2;

            let isAgencyAdminExist = await client
              .service("users")
              .find({
                query: {
                  organizationId: orgId,
                  status: 1,
                },
              })
              .then((res) => {
                return (
                  res.data.filter(
                    (c) =>
                      c.roles &&
                      c.roles.length > 0 &&
                      c.roles[0].id === Roles.AgencyAdmin
                  ).length > 0
                );
              });

            user.selfAuthorization = isAgencyAdminExist
              ? SelfAuthorization.Requested
              : SelfAuthorization.Pending; // 0 - not required , 1 - required ,  2 - requested , 3 -pending
            user.roleId = isAgencyAdminExist && Roles.Recruiter;
            user.createdAt = Date.now();
            res = await client.service("users").create(user);
          }

          if (res) {
            empRes = await client.service("custom").patch(
              null,
              { status: 0 },
              {
                query: {
                  contactUserId: res.id,
                  recOrgId: orgRes.id,
                  empOrgId: empOrgId,
                  status: 0,
                },
              }
            );
            if (empRes) {
              // const data = {
              //   ...empRes,
              //   status: status,
              //   organization: orgRes,
              //   user: user,
              // };
              // dispatch({
              //   type: "UPDATE_AGENCY_USERS",
              //   data: data,
              // });
              return true;
            }
          }
        } catch (error) {
          errorHandler(error);
          return false;
        }
      }
    } else {
      orgRes = await client.service("organizations").create(org);
      if (orgRes) {
        user.organizationId = orgRes.id;
        if (user.id > 0) {
          res = await client.service("users").patch(user.id, user);
        } else {
          user.isReferal = true;
          user.status = 2;
          user.selfAuthorization = SelfAuthorization.Pending;
          res = await client.service("users").create(user);
        }

        if (res) {
          empRes = await client.service("employerRecruiters").create({
            contactUserId: res.id,
            status: status,
            empOrgId: empOrgId,
            recOrgId: orgRes.id,
          });
          if (empRes) {
            const data = { ...empRes, organization: orgRes, user: user };
            dispatch({
              type: "ADD_AGENCY_USERS",
              data: data,
            });
            return true;
          }
          return false;
        }
      }
    }
  } catch (error) {
    if (
      error.errors &&
      error.errors[0] &&
      error.errors[0].message !== "username must be unique"
    ) {
      errorHandler(error);
    }
    return false;
  }
};

// export const getOrgUsers = (orgId) => async (dispatch) => {
//   const orgUsers = await client.service("employerRecruiters").find({
//     query: {
//       recOrgId: orgId,
//     },
//   });
//   if (orgUsers && orgUsers.data.length > 0) {
//     const user = orgUsers.filter(c => c.roles === Roles.Admin);
//     if (
//       (user &&
//         user.roles &&
//         user.roles[0] &&
//         user.roles[0].id !== Roles.AgencyAdmin) ||
//       (empUser && empUser.data.length > 0)
//     ) {
//       let error = { errors: [] };
//       error.code = 400;
//       error.errors.push({ message: "username must be unique" });
//       errorHandler(error);
//       return false;
//     } else {
//       return user;
//     }
//   }
// };

export const isUserExist = (id, recOrgId) => async () => {
  const agencyUser = await client.service("users").get(id);
  if (agencyUser) {
    return agencyUser.organizationId !== recOrgId;
  }
  return false;
};

export const checkUser = (username) => async () => {
  const users = await client.service("users").find({
    query: {
      username: username,
    },
  });
  if (users && users.data.length > 0) {
    const user = users.data[0];
    // const empUser = await client.service("employerRecruiters").find({
    //   query: {
    //     recOrgId: user.organizationId,
    //     empOrgId: orgId,
    //   },
    // });
    if (users && users.data.length > 0) {
      if (
        user &&
        user.roles &&
        user.roles[0] &&
        (user.roles[0].id === Roles.AgencyAdmin ||
          user.roles[0].id === Roles.Recruiter)
      ) {
        return user;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

export const attachAgency = (empOrgId, email) => async (dispatch) => {
  try {
    const agency = await client.service("users").find({
      query: {
        email: email,
        type: 2,
      },
    });
    if (agency && agency.data.length > 0) {
      const user = agency.data[0];
      // const empRes = await client.service("employerRecruiters").create({
      //   exists: true,
      //   contactUserId: user.id,
      //   status: 1,
      //   empOrgId: empOrgId,
      //   recOrgId: user.organizationId,
      // });
      const empRes = await client.service("custom").patch(
        null,
        { status: 1 },
        {
          query: {
            contactUserId: user.id,
            recOrgId: user.organizationId,
            empOrgId: empOrgId,
            status: 1,
          },
        }
      );

      if (empRes) {
        const orgRes = await client
          .service("organizations")
          .get(user.organizationId);
        const data = {
          createdAt: Date.now(),
          status: 1,
          organization: orgRes,
          user: user,
        };
        dispatch({
          type: "ADD_AGENCY_USERS",
          data: data,
        });
        return true;
      }
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const deleteAgency = (empOrgId, recOrgId, contactUserId) => async (
  dispatch
) => {
  const res = await client.service("employerRecruiters").remove(null, {
    query: {
      empOrgId,
      recOrgId,
      contactUserId,
    },
  });
  if (res) {
    dispatch({
      type: "REMOVE_AGENCY_USERS",
      empOrgId: empOrgId,
      recOrgId: recOrgId,
      contactUserId: contactUserId,
    });
    return true;
  }
  return false;
};

export const addUserToExistingAgency = (user, empOrgId) => async (dispatch) => {
  try {
    user.email = user.username;
    user.roleId = Roles.AgencyAdmin;
    user.type = 2;
    user.status = 0;
    user.reset = true;
    user.isVerified = false;
    const res = await client.service("users").create(user);
    if (res) {
      // const empRes = await client.service("employerRecruiters").create({
      //   contactUserId: res.id,
      //   status: 1,
      //   empOrgId: empOrgId,
      //   recOrgId: user.organizationId,
      // });

      const empRes = await client.service("custom").patch(
        null,
        { status: 1 },
        {
          query: {
            contactUserId: res.id,
            recOrgId: user.organizationId,
            empOrgId: empOrgId,
            status: 1,
          },
        }
      );

      // const empUser = await client.service("employerRecruiters").find({
      //   query: {
      //     recOrgId: user.organizationId,
      //     empOrgId: empOrgId,
      //   },
      // });

      if (empRes) {
        const orgRes = await client
          .service("organizations")
          .get(user.organizationId);
        const data = {
          createdAt: Date.now(),
          status: 1,
          organization: orgRes,
          user: user,
        };
        dispatch({
          type: "ADD_AGENCY_USERS",
          data: data,
        });
        return true;
      }
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const manageFirm = (data) => async () => {
  try {
    let {
      id,
      name,
      addrId,
      line1,
      line2,
      city,
      state,
      country,
      zip,
      contactNo1,
      fax,
      email,
    } = data;

    const org = {
      id,
      name,
      contactNo1,
      fax,
      email,
    };

    org.addr = {
      id: addrId,
      line1,
      line2,
      city,
      state,
      country,
      zip,
    };

    if (id > 0) {
      const orgRes = await client.service("organizations").patch(id, org);
      if (orgRes) {
        let addrDetails = orgRes.addr;
        let addrId = addrDetails.id;
        let newstate = Object.assign(addrDetails, orgRes);
        newstate.addrId = addrId;
        // return true;
        if (newstate) {
          return newstate;
        }
      }
      return false;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const manageEmployer = (data) => async () => {
  try {
    let {
      id,
      name,
      addrId,
      line1,
      line2,
      city,
      state,
      country,
      zip,
      contactNo1,
      fax,
      email,
      isPremium,
      stripeTrialEndDate,
      status
    } = data;

    const org = {
      id,
      name,
      contactNo1,
      fax,
      email,
      isPremium,
      stripeTrialEndDate,
      status
    };

    org.addr = {
      id: addrId,
      line1,
      line2,
      city,
      state,
      country,
      zip,
    };
    org.stripeTrialEndDate = moment(data.createdAt, "YYYY-MM-DD").add(
      parseInt(data.trialPeriod),
      "days"
    );

    if (id > 0) {
      const orgRes = await client.service("organizations").patch(id, org);
      if (orgRes) {
        let addrDetails = orgRes.addr;
        let addrId = addrDetails.id;
        let newstate = Object.assign(addrDetails, orgRes);
        newstate.addrId = addrId;
        // return true;
        if (newstate) {
          return newstate;
        }
      }
      return false;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const addPremiumAgency = (data) => async (dispatch) => {
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
    // user.roleId = Roles.AgencyAdmin;
    // user.type = 2;
    // user.reset = true;
    org.name = companyName;
    org.stripeTrialEndDate = moment(data.createdAt, "YYYY-MM-DD").add(
      parseInt(data.trialPeriod),
      "days"
    );
    //org.type = 2;
    // org.status = OrganizationStatus.Prospect;

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
                type: "UPDATE_PREMIUMAGENCY_USERS",
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
      dispatch({
        type: "ADD_PREMIUM_AGENCY_USERS",
        data: data,
      });
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
    errorHandler(error);
    return false;

  }
};

export const attachPremiumAgency = (empOrgId, email) => async () => {
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

export const deletePremiumAgency = (
  empOrgId,
  recOrgId,
  contactUserId
) => async () => {
  const res = await client.service("employerRecruiters").remove(null, {
    query: {
      empOrgId,
      recOrgId,
      contactUserId,
    },
  });
  if (res) {
    return true;
  }
  return false;
};

export const addUserToExistingPremiumAgency = (user, empOrgId) => async (
  dispatch
) => {
  user.email = user.username;
  user.roleId = Roles.AgencyAdmin;
  user.type = 2;
  user.reset = true;
  user.isVerified = false;
  const res = await client.service("users").create(user);
  if (res) {
    const empRes = await client.service("employerRecruiters").create({
      contactUserId: res.id,
      status: 1,
      empOrgId: empOrgId,
      recOrgId: user.organizationId,
    });
    if (empRes) {
      const orgRes = await client
        .service("organizations")
        .get(user.organizationId);
      if (orgRes) {
        orgRes.isPremium = true;
        res = await client.service("organizations").patch(orgRes.id, orgRes);
      }
      const data = { ...empRes, organization: orgRes, user: user };
      dispatch({
        type: "ADD_AGENCY_USERS",
        data: data,
      });
      return true;
    }
  }
};

export const upgradeAgency = (data) => async () => {
  try {
    if (data.isPremium) {
      data.$sendMail = true;
    }
    if (data.id > 0) {
      await client
        .service("organizations")
        .patch(data.id, data)
        .then((res) => {
          if (res) {
            loadPremiumAgencies(10, 0).then((res) => {
              if (res) {
                return true;
              }
            });
          } else {
            return false;
          }
        });
    }
    // if (res) {

    //   // dispatch({
    //   //   type: "UPDATE_PREMIUMAGENCY_USERS",
    //   //   data: data,
    //   // });

    // }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getOrgUsers = (orgId) => async () => {
  try {
    if (orgId > 0) {
      const users = await client
        .service("users")
        .find({ query: { organizationId: orgId } });
      if (users && users.data && users.data.length > 0) {
        return users.data;
      } else {
        return null;
      }
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
/*----- ORGANIZATION------*/
export const loadOrganization = (organizationId) => async (dispatch) => {
  try {
    const res = await client.service("organizations").get(organizationId);
    if (res) {
      const addr = await client.service("officelocations").find({
        query: {
          organizationId: organizationId,
          isCorporate: true,
        },
      });
      res.addr = addr.data;
      dispatch({
        type: "LOAD_ORGANIZATION",
        data: res,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadAddress = (organizationId) => async (dispatch) => {
  try {
    const res = await client.service("officelocations").find({
      query: {
        organizationId: organizationId,
        isCorporate: false,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_ORG_ADDRESS",
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

export const loadInterviewPanel = (organizationId) => async (dispatch) => {
  try {
    const res = await client.service("interviewpanels").find({
      query: {
        organizationId: organizationId,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_ORG_INTERVIEW_PANEL",
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

export const loadOrgConfig = (organizationId) => async (dispatch) => {
  try {
    const res = await client.service("orgconfig").find({
      query: {
        organizationId: organizationId,
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_ORG_CONFIG",
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

export const updateOrgConfig = (data) => async (dispatch) => {
  try {
    let orgConfig = data.orgConfig;
    let departments = data.departments;
    let orgRes;
    let depRes;
    let orgConfigList = [];
    let deptList = [];
    let promises = [];
    promises.push(
      new Promise(async (resolve) => {
        if (orgConfig) {
          for (let index = 0; index < orgConfig.length; index++) {
            const item = orgConfig[index];
            if (item.id > 0) {
              orgRes = await client.service("orgconfig").patch(item.id, item);
            } else {
              orgRes = await client.service("orgconfig").create(item);
              if (orgRes) {
                item.id = orgRes.id;
              }
            }
            orgConfigList.push(orgRes);
          }
          resolve(orgConfigList);
        } else {
          resolve(orgConfigList);
        }
      })
    );
    promises.push(
      new Promise(async (resolve) => {
        if (departments) {
          for (let index = 0; index < departments.length; index++) {
            const item = departments[index];
            if (item.id > 0) {
              depRes = await client.service("departments").patch(item.id, item);
            } else {
              depRes = await client.service("departments").create(item);
              if (depRes) {
                item.id = depRes.id;
              }
            }
            deptList.push(depRes);
          }
          resolve(deptList);
        } else {
          resolve(deptList);
        }
      })
    );

    return Promise.all(promises).then(function (values) {
      if (values) {
        if (values[0]) {
          dispatch({
            type: "UPDATE_ORG_CONFIG",
            data: {
              orgConfig: orgConfigList,
            },
          });
        }
        if (values[1]) {
          dispatch({
            type: "UPDATE_DEPARTMENT",
            data: {
              departments: deptList,
            },
          });
        }
      }
      return true;
    });
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const addressPromise = (data) => async (dispatch) => {
  //async function addressPromise(addrs, orgId) {
  let addrs = data;
  let orgId = data.organizationId;
  let addrRes;
  if (addrs) {
    if (addrs.id > 0) {
      addrRes = await client.service("addresses").patch(addrs.id, addrs);
    } else {
      addrRes = await client.service("addresses").create(addrs);
      if (addrRes) {
        addrs.id = addrRes.id;
        await client.service("officelocations").create({
          isCorporate: false,
          organizationId: orgId,
          addressId: addrRes.id,
        });
      }
    }

    if (addrRes) {
      dispatch({
        type: "OFFICE_LOCATIONS",
        data: {
          orgOtherAddrr: addrRes,
        },
      });
    }
  }
};

export const interviewPanelPromise = (data) => async (dispatch) => {
  //async function interviewPanelPromise(interviewPanel, orgId) {
  let interviewPanel = data;
  let final;

  let panelRes;
  if (interviewPanel) {
    if (interviewPanel.id > 0) {
      panelRes = await client
        .service("interviewpanels")
        .patch(interviewPanel.id, interviewPanel);
      if (panelRes) {
        const members = interviewPanel.users;
        if (members && members.length > 0) {
          let panelId = interviewPanel.id;
          final = await client.service("panelmembers").remove(null, {
            query: {
              panelId,
            },
          });
          if (final) {
            members.map(async (m) => {
              await client.service("panelmembers").create({
                userId: m.id,
                panelId: panelId,
              });
            });
            panelRes.users = interviewPanel.users;
            dispatch({
              type: "INTERVIEW_PANELS",
              data: {
                interviewpanels: panelRes,
              },
            });
          }
        }
      }
    } else {
      panelRes = await client.service("interviewpanels").create(interviewPanel);

      if (panelRes) {
        interviewPanel.id = panelRes.id;
        const members = interviewPanel.users;
        if (members && members.length > 0) {
          members.map(async (m) => {
            await client.service("panelmembers").create({
              userId: m.id,
              panelId: panelRes.id,
            });
          });
          panelRes.users = interviewPanel.users;
          dispatch({
            type: "INTERVIEW_PANELS",
            data: {
              interviewpanels: panelRes,
            },
          });
        }
      }
    }
  }
};

export const deleteLocation = (adressId) => async () => {
  const count = await client.service("locations").find({
    query: {
      $limit: 0,
      addressId: adressId,
    },
  });

  if (count.total > 0) {
    return false;
  } else {
    const res = await client.service("addresses").remove(adressId);
    if (res) {
      return true;
    }
  }
};

export const deletePanel = (panelId) => async () => {
  const count = await client.service("jobinterviewers").find({
    query: {
      $limit: 0,
      panelId: panelId,
    },
  });

  if (count.total > 0) {
    return false;
  } else {
    const res = await client.service("interviewpanels").remove(panelId);
    if (res) {
      return true;
    }
  }
};

export const deleteDepartment = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("departments").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_DEPARTMENTS",
          deletedId: id,
        });
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  }
  return false;
};
