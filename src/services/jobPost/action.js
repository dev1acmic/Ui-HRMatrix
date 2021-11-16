import client from "../feathersApi";
//import { services } from "../store";
import { errorHandler } from "../error/action";
import { Roles, JobApplicationSelectStatus } from "util/enum";
import moment from "moment";

export const createJobPost = (data, errors) => async (dispatch) => {
  if (data.id > 0) {
    try {
      const res = await client.service("jobposts").patch(data.id, data);
      if (res) {
        dispatch({
          type: "PATCH_JOBPOST",
          data: res,
          errors: errors,
        });
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  } else {
    try {
      const res = await client.service("jobposts").create(data);
      if (res) {
        dispatch({
          type: "CREATE_JOBPOST",
          data: res,
          errors: errors,
        });
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  }
};

export const updateJobPost = (data, errors) => async (dispatch) => {
  try {
    if (data.id && data.id > 0) {
      const res = await client.service("jobposts").update(data.id, data);
      if (res) {
        dispatch({
          type: "UPDATE_JOBPOST",
          data: res,
          errors: errors,
        });
        return true;
      }
    } else {
      const createRes = await client.service("jobposts").create(data);
      if (createRes) {
        data.id = createRes.id;
        const res = await client.service("jobposts").update(createRes.id, data);
        if (res) {
          dispatch({
            type: "UPDATE_JOBPOST",
            data: res,
            errors: errors,
          });
        }
      }
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getJobPost = (id) => async (dispatch) => {
  try {
    const res = await client.service("jobposts").get(id);
    if (res) {
      var _ = require("underscore");
      const iteratees = (obj) => -obj.mandatory;
      res.jobskills = _.sortBy(res.jobskills, iteratees);
      // res.jobskills = _.sortBy(res.jobskills, function (skill) {
      //   return [skill.mandatory, skill.priority, skill.competency, skill.years].join("_");
      // });
      //res.jobskills = _.sortBy((res.jobskills, 'mandatory'));

      // res.jobskills = _(res.jobskills).chain().sortBy(function (skill) {
      //   return skill.mandatory;
      //   // }).sortBy(function (skill) {
      //   //   return skill.competency;
      //   // }).sortBy(function (skill) {
      //   //   return skill.years;
      // }).value();

      if (res.jobskills && res.jobskills.length > 0) {
        const jobskills = res.jobskills.map((t) => ({
          ...t,
          name: (t.skill && t.skill.name) || "",
        }));
        res.jobskills = jobskills;
      }
      if (res.addresses && res.addresses.length > 0) {
        res.addressId = res.addresses[0].id;
      }
      if (res) {
        dispatch({
          type: "GET_JOBPOST",
          data: res,
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const deleteJobSkill = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobskills").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_JOBSKILL",
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

export const deleteEducation = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobeduqualifications").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_JOBEDUCATION",
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

export const deleteCertification = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobcertifications").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_JOBCERTIFICATION",
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

export const deleteScreeningQuest = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobscreeningchoices").remove(null, {
        query: {
          jobscreeningqtnId: id,
        },
      });
      if (res) {
        const jobres = client.service("jobscreeningqtns").remove(id);
        if (jobres) {
          dispatch({
            type: "REMOVE_JOB_SCREENING_QUESTION",
            deletedId: id,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  }
  return false;
};

export const deleteInterviewLevel = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobinterviewers").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_JOB_INTERVIEW_LEVEL",
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

export const deleteInterviewQuest = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobinterviewqtns").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_JOB_INTERVIEW_QUES",
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

export const getJobsbyEmployer =
  (
    createdBy,
    role,
    limit = 10,
    pageno = 0,
    sortKey,
    searchKey,
    searchVal,
    openJob = false
  ) =>
  async (dispatch) => {
    sortKey = sortKey ? sortKey : "createdAt";
    let data = {
      $limit: limit,
      $skip: pageno * limit, //skip*limit
      $sort: {
        [sortKey]: -1,
      },
    };
    if (searchKey && searchVal && searchVal !== "") {
      if (searchKey === "createdAt") {
        const startDate = moment.utc(searchVal).format();
        const endDate = moment.utc(searchVal).add(1, "days").format();
        data = {
          ...data,
          $and: [
            {
              createdAt: {
                $gte: startDate, //Format:"2019-10-16T00:00:00.000Z"
              },
            },
            {
              createdAt: {
                $lte: endDate, //Format: "2019-10-17T00:00:00.000Z"
              },
            },
          ],
        };
      } else {
        data = {
          ...data,
          [searchKey]:
            searchKey === "hiringManager"
              ? searchVal
              : { $like: "%" + searchVal + "%" },
        };
      }
    } else if (searchVal && searchVal !== "") {
      data = {
        ...data,
        $or: [
          {
            title: {
              $like: "%" + searchVal + "%",
            },
          },
          {
            uniqueId: {
              $like: "%" + searchVal + "%",
            },
          },
        ],
      };
    }
    if (openJob) {
      data = {
        ...data,
        status: 3,
      };
    }

    if (role === Roles.HiringManager) {
      data = { ...data, createdBy: createdBy };
    } else if (role === Roles.Recruiter) {
      data = { ...data, $isRecruiter: true };
    } else if (role === Roles.InterviewPanel) {
      data = { ...data, $isInterviewer: true };
    } else if (role === Roles.AgencyAdmin) {
      data = { ...data, $isAgencyAdmin: true };
    }
    try {
      const res = await client.service("jobposts").find({
        query: data,
      });
      if (res) {
        let newRes = {};
        const { agencies, recruiters, shortListed, interviewed } = res;

        newRes.data = res.data.map((obj) => ({
          ...obj,
          recruiterCount:
            (recruiters &&
              recruiters.length > 0 &&
              recruiters.find((c) => c.jobPostId === obj.id).count) ||
            0,
          recruiterList:
            (recruiters &&
              recruiters.length > 0 &&
              recruiters.find((c) => c.jobPostId === obj.id).list) ||
            null,
          agencyCount:
            (agencies &&
              agencies.length > 0 &&
              agencies.find((c) => c.jobPostId === obj.id).count) ||
            0,
          shortListedCount:
            (shortListed.length > 0 &&
              shortListed.find((c) => c.jobPostId === obj.id).count) ||
            0,
          interviewedCount:
            (interviewed.length > 0 &&
              interviewed.find((c) => c.jobPostId === obj.id).count) ||
            0,
        }));
        newRes.total = res.total;
        if (openJob) {
          dispatch({
            type: "GET_ALL_OPENJOBS",
            query: newRes,
          });
        } else {
          dispatch({
            type: "GET_ALLJOBS",
            query: newRes,
          });
        }

        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

export const getJobApplicantsByJobPost =
  (
    jobpostId,
    createdBy,
    role,
    limit = 3,
    pageno = 0,
    isClosed = false,
    filterByUser = false
  ) =>
  async (dispatch) => {
    let data = {
      $limit: limit,
      $skip: pageno * limit,
      jobpostId: jobpostId,
    };

    if (role === Roles.Recruiter) {
      data = {
        ...data,
        createdBy: createdBy,
        selectStatus: {
          $ne: JobApplicationSelectStatus.Removed,
        },
      };
    } else if (role === Roles.AgencyAdmin) {
      data = {
        ...data,
        $isAgencyAdmin: true,
      };
      if (filterByUser && createdBy > 0) {
        data = {
          ...data,
          createdBy: createdBy,
        };
      }
    } else if (role === Roles.InterviewPanel) {
      if (isClosed) {
        data = {
          selectStatus: {
            $or: [
              { $eq: JobApplicationSelectStatus.Rejected },
              { $eq: JobApplicationSelectStatus.Hired },
            ],
          },
        };
      }
      data = { ...data, $isInterviewer: true };
    } else {
      data = {
        ...data,
        status: 1, //completed
        selectStatus: {
          $ne: JobApplicationSelectStatus.Removed,
        },
      };
    }
    try {
      const res = await client.service("jobapplications").find({
        query: data,
      });
      const shrtListCount = await client.service("jobapplications").find({
        query: {
          jobpostId: jobpostId,
          selectStatus: {
            $eq: JobApplicationSelectStatus.ShortListed,
          },
        },
      });
      if (res) {
        res.shortListedCount = shrtListCount.total;
        // dispatch({
        //   type: "GET_JOB_APPLICANTS_BY_JOBPOST",
        //   query: res
        // });
        return res;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

//  to check whether the job is premium or not
export const isPremiumJob = (recId, jobpostId) => async (dispatch) => {
  try {
    let empRes;

    empRes = await client.service("jobpostinvites").find({
      query: {
        recruiterId: recId,
        jobpostId: jobpostId,
      },
    });

    if (empRes.data && empRes.data.length > 0) {
      return empRes.data[0].isPremium;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const fromPreferredPremium =
  (id, orgId, isRec = false) =>
  async (dispatch) => {
    try {
      let empRes;
      if (isRec) {
        empRes = await client.service("employerRecruiters").find({
          query: {
            empOrgId: id,
            recOrgId: orgId,
          },
        });
      } else {
        empRes = await client.service("employerRecruiters").find({
          query: {
            contactUserId: id,
            empOrgId: orgId,
          },
        });
      }

      return empRes.data && empRes.data.length > 0;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

export const clearJobPost = () => (dispatch) => {
  dispatch({
    type: "CLEAR_JOBPOST",
  });
};

export const isConfigDetailsExists = (orgId) => async (dispatch) => {
  if (orgId > 0) {
    const levelCount = await client.service("orgconfig").find({
      query: {
        $limit: 0,
        organizationId: orgId,

        //key: ["Level" || "FinStartDate" || "FinEndDate"],
        // key: "FinStartDate",
        // key: "FinEndDate",
        //  key: { $in: [{ $ne: null, $ne: "", $gt: 0 }] }
        $or: [
          { key: "Level", value: { $gt: 0 } },
          { key: "FinStartMonth", value: { $ne: null, $gt: 0 } },
          {
            key: "FinEndMonth",
            value: { $ne: null, $gt: 0 },
          },
        ],
      },
    });

    const iPanelCount = await client.service("interviewpanels").find({
      query: {
        $limit: 0,
        organizationId: orgId,
      },
    });

    const deptCount = await client.service("departments").find({
      query: {
        $limit: 0,
        organizationId: orgId,
      },
    });

    const addrCount = await client.service("officelocations").find({
      query: {
        $limit: 0,
        organizationId: orgId,
      },
    });

    if (
      levelCount.total === 3 &&
      deptCount.total > 0 &&
      iPanelCount.total > 0 &&
      addrCount.total > 0
    ) {
      return true;
    }
    return false;
  }
};

//Check if organisation has role TA
export const checkOrgHasTA = () => async (dispatch) => {
  try {
    const res = await client.service("userRoles").find({
      query: {
        $select: ["roleId", "userId"],
        //$limit: 1,
        roleId: 3, //Talent acquisition
      },
    });
    if (res && res.data.length > 0) {
      const ids = res.data.map((c) => c.userId);
      return ids;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

//Get jobs summary=> open jobs count, candidates count
export const getJobsSummary = (orgId, role) => async (dispatch) => {
  try {
    const res = await client.service("custom").find({
      query: {
        organizationId: orgId,
        role: role,
      },
    });

    if (res) {
      dispatch({
        type: "GET_JOB_SUMMARY",
        data: res,
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getInterviewDetailsByJobPost = (jobPostId) => async (dispatch) => {
  try {
    const res = await client.service("jobinterviewers").find({
      query: {
        jobPostId: jobPostId,
      },
    });
    if (res) {
      dispatch({
        type: "GET_INTERVIEW_DETAILS",
        data: res,
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getInterviewQstnsByJobPost =
  (panelId, jobPostId) => async (dispatch) => {
    try {
      const res = await client.service("jobinterviewqtns").find({
        query: {
          panelId,
          jobPostId,
        },
      });

      if (res) {
        dispatch({
          type: "GET_INTERVIEW_QSTNS",
          data: res,
        });
        return true;
      }
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };
//Send message to Recruiter

export const sendMsgtoRecruiter =
  (semail, msg, orgName, candidateName, jobId) => async (dispatch) => {
    const email = {
      to: semail,
      orgname: orgName,
      candidateName: candidateName,
      message: msg,
      isSendMsg: true,
      jobId: jobId,
    };

    await client
      .service("mailer")
      .create(email)
      .then(function (result) {
        console.log("Sent email", result);
      })
      .catch((err) => {
        console.log(err);
      });
    // try {
    //   const res = await client.service("custom").update({
    //     sendMail: true,
    //     email: email,
    //     message: msg
    //   });

    //   // if (res) {
    //   //   dispatch({
    //   //     type: "GET_INTERVIEW_QSTNS",
    //   //     data: res
    //   //   });
    //   //   return true;
    //   // }
    // } catch (error) {
    //   errorHandler(error);
    //   return false;
    // }
  };
export const getCandidateCountByRecruiterId =
  (jobId, recruiterId) => async (dispatch) => {
    try {
      const res = await client
        .service("custom")
        .get(jobId, { query: { $filterByUser: true, createdBy: recruiterId } });
      if (res) {
        return res;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

//Reportsfor super admin
export const getReportSummary =
  (
    role,
    orgId = 0,
    stripeCusId = null,
    isSuperAdminAgency = false,
    startDt,
    endDt
  ) =>
  async (dispatch) => {
    let startdate, enddate, tz;

    startdate = startDt && moment(startDt).format("YYYY-MM-DD HH:mm:ss"); //Convert date format to match with the server converted time
    enddate = endDt && moment(endDt).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    tz = getTimezoneOffset(); //  get the timezone offset ie. +05:30

    if (!startDt && !endDt) {
      //  if start date and end date is not selected, the report will fetched based on the current year;
      let firstDateOfCurrentYear = new Date(new Date().getFullYear(), 0, 1);
      let lastDateOfCurrentYear = new Date(new Date().getFullYear(), 11, 31);
      startdate = moment(firstDateOfCurrentYear).format("YYYY-MM-DD HH:mm:ss");
      enddate = moment(lastDateOfCurrentYear)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    try {
      const res = await client.service("reports").find({
        query: {
          role,
          orgId,
          customerId: stripeCusId,
          isSuperAdminAgency,
          startdate,
          enddate,
          tz,
        },
      });

      if (res) {
        dispatch({
          type: "GET_REPORT_SUMMARY",
          data: res,
        });
      }
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

function getTimezoneOffset() {
  function z(n) {
    return (n < 10 ? "0" : "") + n;
  }
  var offset = new Date().getTimezoneOffset();
  var sign = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return sign + z((offset / 60) | 0) + ":" + z(offset % 60);
}

const getUTCDate = (Date) => {
  return moment.utc(Date).format();
};

export const getJobsByAttention = (orgId, role) => async (dispatch) => { 
  try {
    const res = await client.service("custom").find({
      query: {
        organizationId: orgId,
        role: role,
        isJobsNeedAttention: true,
      },
    });

    if (
      res &&
      res.needAttentionJobs &&
      res.needAttentionJobs.data &&
      res.needAttentionJobs.data.length
    ) {
      dispatch({
        type: "GET_ALL_JOBSBYATTENTION",
        data: res,
      });
      return true;
    }
    if (
      res &&
      res.needAttentionJobs &&
      res.needAttentionJobs.data &&
      res.needAttentionJobs.data.length === 0
    ) {
      dispatch({
        type: "GET_ALL_JOBSBYATTENTION",
        data: [],
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
