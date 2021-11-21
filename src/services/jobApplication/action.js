import client from "../feathersApi";
import { errorHandler } from "../error/action";
import { JobApplicationStatus, JobApplicationSelectStatus } from "util/enum";
import _ from 'lodash'

export const getJobApplicationsByJobPost =
  (
    jobpostId,
    excludeSelectStatuses,
    limit = 10
    //pageno = 0
  ) =>
    async (dispatch) => {
      try {
        const res = await client.service("jobapplications").find({
          query: {
            $limit: limit,
            $sort: {
              createdAt: -1,
            },
            jobpostId: jobpostId,
            status: JobApplicationStatus.Completed, //status=completed
            selectStatus: {
              $nin: excludeSelectStatuses, // this should be an array
            },
          },
        });
        if (res) {
          dispatch({
            type: "QUERY_JOBAPPLICANTIONS",
            query: res,
          });
          return true;
        }
        return false;
      } catch (error) {
        errorHandler(error);
        return false;
      }
    };

export const getJobApplicationsById =
  (jobapplicationId, skipDispatch = false) =>
    async (dispatch) => {
      try {
        const res = await client.service("jobapplications").get(jobapplicationId);
        if (skipDispatch) {
          return res;
        }
        if (res) {
          dispatch({
            type: "GET_JOBAPPLICATION",
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

export const saveApplication = (data) => async (dispatch) => {
  let res;
  try {
    if (data.id > 0) {
      res = await client.service("jobapplications").patch(data.id, data);
    } else {
      res = await client.service("jobapplications").create(data);
    }
    if (res) {
      dispatch({
        type: "JOB_APPLICATION",
        data: res,
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const deleteApplEmployers = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobapplicantemployers").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_APPL_EMPLOYERS",
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

export const deleteApplEducation = (id) => async (dispatch) => {
  if (id > 0) {
    try {
      const res = client.service("jobapplicantedu").remove(id);
      if (res) {
        dispatch({
          type: "REMOVE_APPL_EDUCATION",
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

export const clearJobApplication = () => (dispatch) => {
  dispatch({
    type: "CLEAR_JOBAPPL",
  });
};

export const uploadFile = (files, folder) => async (dispatch) => {
  try {
    let arrFiles = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const { name, type, size } = file;
      arrFiles.push({
        name: name,
        type: type,
        buffer: file,
        size: size,
      });
    }

    const res = await client.service("files").create(
      {
        files: arrFiles,
        folder: folder,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    //console.log(res);
    return { status: true, result: { ...res } };
  } catch (error) {
    errorHandler(error);
    return { status: false };
  }
};

export const getFile = (id) => async (dispatch) => {
  try {
    const res = await client.service("files").get(id);
    return { status: true, result: { ...res } };
  } catch (error) {
    errorHandler(error);
    return { status: false };
  }
};

export const saveApplicantAssessment = (data) => async (dispatch) => {
  let res;
  try {
    if (data.id > 0) {
      res = await client.service("applicantassessments").patch(data.id, data);
    } else {
      //console.log(data);
      res = await client.service("applicantassessments").create(data);
    }
    if (res) {
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getApplicantAssessment =
  (level, applicantId) => async (dispatch) => {
    try {
      const res = await client.service("applicantassessments").find({
        query: {
          level: level,
          jobapplicationId: applicantId,
        },
      });
      if (res) {
        const result = (res.data && res.data[0]) || null;
        dispatch({
          type: "GET_APPLICANT_ASSESSMENT",
          data: result,
        });
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

export const getApplicantsAssessmentsByIds =
  (
    // Get all Apllicant assesments for the given array of ids
    applicantIds // this should be an array
  ) =>
    async (dispatch) => {
      try {
        const res = await client.service("applicantassessments").find({
          query: {
            jobapplicationId: {
              $in: applicantIds,
            },
          },
        });
        if (res && res.data.length > 0) {
          // dispatch({
          //   type: "GET_APPLICANT_ASSESSMENT",
          //   data: res.data[0]
          // });
          return res.data;
        }
        return null;
      } catch (error) {
        errorHandler(error);
        return false;
      }
    };

export const clearApplicantAssessment = () => (dispatch) => {
  dispatch({
    type: "CLEAR_APPLICANT_ASSESSMENT",
  });
};

export const checkAssessmentAccess =
  (level, applicantId) => async (dispatch) => {
    try {
      const res = await client.service("applicantassessments").find({
        select: ["id"],
        query: {
          level: level,
          jobapplicationId: applicantId,
          status: 1,
        },
      });
      if (res && res.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

export const getApplicantAssessmentLevelsAndScore =
  (applicantId) => async (dispatch) => {
    try {
      const res = await client.service("applicantassessments").find({
        select: [
          "id",
          "level",
          "overallScore",
          "timeManagement",
          "communication",
          "collaboration",
          "criticalThinking",
          "leadership",
        ],
        query: {
          jobapplicationId: applicantId,
        },
      });
      if (res) {
        dispatch({
          type: "GET_APPLICANT_ASSESSMENT_SCORES",
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

export const getCandidateSchedulebyJob = (jobapplicantid, jobid) => async (dispatch) => {
  try {
    let data = {}
    data.jobapplicantid = jobapplicantid;
    data.jobid = jobid;
    data.isRemoved = false;

    const res = await client.service("interviewschedule").find({
      query: data,
    });
    if (res) {
      dispatch({
        type: "GET_CANIDTATE_SCHEDULE",
        data: res.data,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};


export const getInterviewersSchedulebyDate = (interviewersid, interviewdate) => async (dispatch) => {
  try {
    let params = [];
    let data = {}
    data.interviewdate = interviewdate;
    data.isRemoved = false;
    interviewersid.map(c => {
      params.push({ interviewerid: c });
    })

    data = {
      ...data,
      $or: params
    }

    const res = await client.service("interviewschedule").find({
      query: data,
    });
    if (res) {
      dispatch({
        type: "GET_INTERVIEW_SCHEDULE",
        data: res.data,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getInterviewersByPanel = (panelId) => async (dispatch) => {
  try {
    const res = await client.service("panelmembers").find({
      query: {
        panelId: panelId,
      },
    });
    if (res) {
      dispatch({
        type: "GET_INTERVIEW_PANEL_MEMBERS",
        data: res.data,
      });
      return true;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const saveApplicantInterviewers = (data) => async (dispatch) => {
  let res;
  try {
    let interviewers = data.users.filter(m => !m.applicantinterviewerId || m.applicantinterviewerId === 0)
    let ischedule = [];
    interviewers.map(c => {
      let user = { ...data, interviewerid: c.id };
      ischedule.push(user)
    })
    if (data.ids) { 
      let res = await client.service("interviewschedule").patch(null, {
        subject: ischedule[0].subject,
        message: ischedule[0].message,
        interviewdate: ischedule[0].interviewdate,
        fromtime: ischedule[0].fromtime,
        totime: ischedule[0].totime,
        isRemoved :false,
        users: interviewers
      }, { query: { id: { $in: data.ids } } });

      if (res.length !== interviewers.length) {
        const newInvite = interviewers.filter(o1 => !res.some(o2 => o1.id === o2.interviewerid))

        if (newInvite && newInvite.length > 0) {
          const newInterviewers = ischedule.filter(o1 => newInvite.some(o2 => o1.interviewerid === o2.id))
          newInterviewers.map(c => {
            c.users = newInvite;
            c.skipEmail = true
          }) 
          const res = await client.service("interviewschedule").create(newInterviewers);
          if (res) {
            return true
          }
        }
      }
      if (res) {
        return true
      }
    } else {
      const res = await client.service("interviewschedule").create(ischedule);
      if (res) {
        return true
      }
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const getInterviewersByApplicantId =
  (applicantId, level = null) =>
    async (dispatch) => {
      try {
        let queryParams = {
          jobapplicationId: applicantId,
        };
        if (level) {
          queryParams = {
            ...queryParams,
            level: level,
          };
        }
        const res = await client.service("applicantinterviewers").find({
          query: queryParams,
        });
        if (res) {
          dispatch({
            type: "GET_APPLICANT_INTERVIEWERS",
            data: res.data,
          });
          return true;
        }
        return false;
      } catch (error) {
        errorHandler(error);
        return false;
      }
    };

export const deleteApplicantInterviewers =
  (applicantinterviewerId) => async (dispatch) => {
    let res;
    try {
      client.service("applicantinterviewers").remove(applicantinterviewerId);
      if (res) {
        return true;
      }
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };

  export const removeApplicantInterviewers = (id) => async (dispatch) => {
    let res;
    try {
      await client.service("interviewschedule").remove(id);
      if (res) {
        return true;
      }
    } catch (error) {
      errorHandler(error);
      return false;
    }
  };
