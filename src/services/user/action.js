import client from "../feathersApi";
import { errorHandler } from "../error/action";
import { OrganizationStatus, Roles, SelfAuthorization } from "util/enum";

export const getUserById = (email) => async (dispatch) => {
  try {
    let res = await client.service("users").find({
      query: {
        email: email,
      },
    });
    if (res && res.data) {
      return res.data[0];
    }
    return null;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const login = (email, password, loginStatus) => async (dispatch) => {
  //use the feathers client to authenticate
  try {
    const res = await client.authenticate({
      strategy: "local",
      username: email,
      password: password,
    });
    if (res) {
      if (!res.profile.isVerified) {
        //console.log("email not verified")
        localStorage.removeItem("feathers-jwt");
        localStorage.removeItem("persist:root");
        await client.logout();
        loginStatus.isVerified = false;
        let error = { message: "TRANSLATION.errMsg.emailNotVerified" };
        errorHandler(error);
        return false;
      } else if (res.profile.status !== 1) {
        //console.log("user not activated")
        localStorage.removeItem("feathers-jwt");
        localStorage.removeItem("persist:root");

        await client.logout();
        let error = { message: "Your account has been deactivated" };
        errorHandler(error);
        return false;
      } else {
        dispatch({
          type: "LOGIN",
          profile: res.profile,
        });
        return true;
      }
    }
  } catch (error) {
    let err = error;
    if (err.name === "NotVerified") {
      loginStatus.isVerified = false;
    }
    errorHandler(err);
    return false;
  }
};

export const register = (user) => async (dispatch) => {
  const newUser = {
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    password: user.password,
    //phone: user.phoneNumber,
    designation: user.designation,
    email: user.username,
  };
  try {
    const orgRes = await client.service("organizations").create({
      /**AUTHOR: Alphonsa
         * save phonumber as org contactNo1
        save email as org email */
      name: user.companyName,
      type: 1,
      contactNo1: user.phoneNumber,
      email: user.username,
      username: user.username,
      status: OrganizationStatus.Active,
    });
    if (orgRes) {
      newUser.organizationId = orgRes.id;
      newUser.roleId = 1;
      newUser.status = 1;
      newUser.type = 1;
      const res = await client.service("users").create(newUser);

      if (res) {
        await client
          .service("organizations")
          .patch(orgRes.id, { createdBy: res.id });
        dispatch({
          type: "REGISTER",
          uid: res.id,
        });
        return true;
      }
    }
  } catch (error) {
    // if (error.message === "Organization already exists.") {
    //   return error.message;
    // } else {
    errorHandler(error);
    return false;
    // }
  }
};

export const agencyRegister = (user) => async (dispatch) => {
  const newUser = { ...user };
  try {
    if (user.organizationId > 0) {
      const orgRes = await client
        .service("organizations")
        .get(user.organizationId);
      if (orgRes) {
        orgRes.name = user.companyName;
        orgRes.status = OrganizationStatus.Active;
        orgRes.$sendMail = false;
        const res = await client
          .service("organizations")
          .patch(orgRes.id, orgRes);
        if (res) {
          newUser.isVerified = 1;
          const userRes = await client
            .service("users")
            .patch(newUser.id, newUser);
          if (userRes) {
            return true;
          }
        }
      }
    } else {

      const orgRes = await client.service("organizations").create({
        /**AUTHOR: Alphonsa
         * save phonumber as org contactNo1
        save email as org email */
        name: user.companyName,
        contactNo1: user.phoneNumber,
        type: 2,
        email: user.username,
        username: user.username,
        status: OrganizationStatus.Active,
        $isAgency: true,
      });
      if (orgRes) {
        newUser.organizationId = orgRes.id;
        newUser.roleId = 6;
        newUser.status = 1;
        newUser.type = 2;
        newUser.email = user.username;

        const res = await client.service("users").create(newUser);

        if (res) {
          await client
            .service("organizations")
            .patch(res.organizationId, { createdBy: res.id });
          dispatch({
            type: "REGISTER",
            uid: res.id,
          });
          return true;
        }
      }

    }
  } catch (error) {

    // if (error.message === "Organization already exists.") {
    //   return 1;
    // } else if (error.message === "Email address already exists.") {
    //   return 0;
    // } else {
    errorHandler(error);
    return false;
    // }
  }
};

export const authenticate = async () => {
  try {
    const token = localStorage.getItem("feathers-jwt");
    if (token) {
      const res = await client.authenticate();
      if (res.accessToken) {
        return true;
      }
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const verifyUser = (token) => async (dispatch) => {
  try {
    if (token) {
      //Find the user with the given token
      let user = await client.service("users").find({
        query: {
          verifyToken: token,
        },
      });
      let res = user && user.data && user.data.length > 0 && user.data[0];

      //if the user exist,
      if (res) {
        // activate organization
        const org = await client
          .service("organizations")
          .get(res.organizationId);
        //if the user exists , check the user belongs to the agency or employer
        if (org && org.type === 2) {
          if (org.status === null || org.status === 0) {
            await client
              .service("organizations")
              .patch(res.organizationId, { status: 2 });
          }

          //if an agency has been created with more than one inactive users, then the first authenticated user will be the agency admin and the remaing users has to undergo through the approval process.
          let isAgencyAdminExist = await client
            .service("users")
            .find({
              query: {
                organizationId: res.organizationId,
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

          if (
            res.selfAuthorization > 0 &&
            (res.status === 2 || res.status === null) &&
            res.isDeleted === false
          ) {
            // after the user approval by agency admin activate the user and update the status of attached user
            if (
              isAgencyAdminExist &&
              res.selfAuthorization === SelfAuthorization.Pending
            ) {
              if (res.roles && res.roles.length === 0) {
                res.roleId = Roles.Recruiter; // as recruiter
              }

              await client.service("users").patch(res.id, res);
              return {
                sendtoApproval: true,
                oid: res.organizationId,
                uid: res.id,
                res,
              };
            } else {
              // if the agency doesnt have an active user, then the user role to agency admin and update the status to active of user and employerrecruiter
              let res = await client.authManagement.verifySignupLong(token);
              res.status = 1;
              res.selfAuthorization = SelfAuthorization.NotRequired;
              if (res.roles && res.roles.length === 0) {
                res.roleId = Roles.AgencyAdmin;
              }

              let u = await client.service("users").patch(res.id, res);

              await client.service("custom").patch(
                null,
                {},
                {
                  query: {
                    userVerified: true,
                    contactUserId: u.id,
                  },
                }
              );
            }
          } else {
            res = await client.authManagement.verifySignupLong(token);
            res.status = 1;
            let u = await client.service("users").patch(res.id, res);
          }
        } else {
          res = await client.authManagement.verifySignupLong(token);
          res.status = 1;
          let u = await client.service("users").patch(res.id, res);
        }

        return { uid: res.id, res };
        // return res;
      }
      return false;
    }
  } catch (e) {
    // let error = { message: "Email address is already verified." };
    // errorHandler(e);
    return false;
  }
};

//a user is verifying the account after an agency admin is created then the user has to undergo though the approval process.
export const sendApproval = (recOrgId, contactUserId) => async (dispatch) => {
  try {
    let user = {};
    user.id = contactUserId;
    user.selfAuthorization = SelfAuthorization.Requested;
    let u = await client.service("users").patch(user.id, user);

    await client.service("custom").patch(
      null,
      {},
      {
        query: {
          sendForApproval: true,
          recOrgId,
        },
      }
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const resetPassword = (password, uid) => async (dispatch) => {
  try {
    const res = await client.service("users").patch(uid, { password });
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const forgotPassword = (email, loginStatus) => async (dispatch) => {
  try {
    if (email) {
      const res = await client.authManagement.sendResetPwd({ email });
      if (res) {
        return true;
      }
      return true;
    }
  } catch (e) {
    if (e.name === "NotVerified") {
      loginStatus.isVerified = false;
    }
    return true;
  }
};

export const resendActivation = (email, reset = false, orgId) => async (
  dispatch
) => {
  try {
    if (email) {
      let orgName = "";
      if (reset) {
        const org = await client.service("organizations").get(orgId);
        orgName = org.name;
      }
      const res = await client.authManagement.resendVerifySignup(
        {
          email,
        }
        // { reset, orgName }
      );
      if (res) {
        return true;
      }
      return false;
    }
  } catch (e) {
    errorHandler(e);
    return false;
  }
};

export const resendAgencyActivation = (userId, reset = false) => async (
  dispatch
) => {
  try {
    let res;
    if (userId) {
      if (reset) {
        res = await client
          .service("custom")
          .get(userId, { query: { $isAgencyAdmin: true } });
      }
      if (res) {
        return true;
      }
      return false;
    }
  } catch (e) {
    errorHandler(e);
    return false;
  }
};

export const resetPasswordWithToken = (token, password) => async (dispatch) => {
  try {
    const res = await client.authManagement.resetPwdLong(token, password);
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("feathers-jwt");
    localStorage.removeItem("persist:root");

    await client.logout();
    dispatch({
      type: "LOGOUT",
    });
    return true;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
