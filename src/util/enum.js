function Enum() {
  this.self = arguments[0];
}
Enum.prototype = {
  keys: function () {
    return Object.keys(this.self);
  },
  values: function () {
    var me = this;
    return this.keys(this.self).map(function (key) {
      return me.self[key];
    });
  },
  getKeyValuePairs: function () {
    var me = this;
    return this.keys(this.self).map(function (key) {
      return { name: key, value: me.self[key] };
    });
  },
  getValueByName: function (key) {
    return this.self[
      this.keys(this.self)
        .filter(function (k) {
          return key === k;
        })
        .pop() || ""
    ];
  },
  getNameByValue: function (value) {
    var me = this;
    return (
      this.keys(this.self)
        .filter(function (k) {
          return me.self[k] === value;
        })
        .pop() || null
    );
  }
};

export const type = new Enum({
  Employer: 1,
  Recruiter: 2,
  SuperUser: 3,
});

export const JobType = new Enum({
  "fullTime": 1,
  "partTime": 2,
  "contract": 3,
  "internship": 4,
  "seasonal": 5,
});

export const JobStatus = new Enum({
  "enum:jobStatus.inProgress": 1,
  "enum:jobStatus.completed": 2,
  "enum:jobStatus.approved": 3,
  "enum:jobStatus.rejected": 4,
  "enum:jobStatus.onHold": 5,
  "enum:jobStatus.closed": 6,
});

export const JobStatusToDesc = {
  InProgress: "In progress",
  Completed: "Completed",
  Approved: "Approved",
  Rejected: "Rejected",
  OnHold: "OnHold",
  Closed: "Closed",
};

export const JobApplicationStatus = {
  "In progress": 0,
  Completed: 1,
};

export const JobApplicationSelectStatus = {
  Inital: 0,
  ShortListed: 1,
  Removed: 2,
  Rejected: 3,
  Hired: 4,
};

export const InterviewAssessmentStatus = {
  Hired: 1,
  Rejected: 2,
  OnHold: 3,
};

export const Competency = new Enum({
  "enum:competency.beginner": 1,
  "enum:competency.intermediate": 2,
  "enum:competency.advanced": 3,
  "enum:competency.expert": 4,
});

export const Priority = new Enum({
  "enum:priority.high": 1,
  "enum:priority.medium": 2,
  "enum:priority.low": 3,
});

export const InterviewMode = new Enum({
  "enum:interviewMode.virtual": 1,
  "enum:interviewMode.onsite": 2,
});

export const AnswerType = new Enum({
  "enum:answerType.singleAnswer": 1,
  "enum:answerType.multipleAnswer": 2,
  "enum:answerType.yesNo": 3,
});

export const ActiveStatus = new Enum({
  Active: 1,
  Inactive: 2,
});

export const Month = new Enum({
  "enum:month.jan": "1",
  "enum:month.feb": "2",
  "enum:month.mar": "3",
  "enum:month.apr": "4",
  "enum:month.may": "5",
  "enum:month.jun": "6",
  "enum:month.jul": "7",
  "enum:month.aug": "8",
  "enum:month.sep": "9",
  "enum:month.oct": "10",
  "enum:month.nov": "11",
  "enum:month.dec": "12",
});

export const Role = new Enum({
  "enum:role.administrator": 1,
  "enum:role.hiringManager": 2,
  "enum:role.talentAcquisitionOfficer": 3,
  "enum:role.interviewer": 4,
  "enum:role.recruiter": 5,
  "enum:role.agencyAdmin": 6,
  "enum:role.superUserAdmin": 7,
});

export const Roles = {
  Admin: 1,
  HiringManager: 2,
  TalentAcquisitionTeam: 3,
  InterviewPanel: 4,
  Recruiter: 5,
  AgencyAdmin: 6,
  SuperUserAdmin: 7,
};

export const Types = {
  Employer: 1,
  Recruiter: 2,
  SuperUser: 3,
};

export const SelfAuthorization = {
  NotRequired: 0,
  Required: 1,
  Requested: 2,
  Pending: 3, //if an Oragnization has two incative users, then the users authorization status will be pending until the organization becomes active.
};

export function AssessmentType() {
  return {
    1: { type: "enum:assessmentType.low", points: 1, id: 1 },
    2: { type: "enum:assessmentType.medium", points: 2, id: 2 },
    3: { type: "enum:assessmentType.high", points: 3, id: 3 },
    4: { type: "enum:assessmentType.excellent", points: 4, id: 4 },
  };
}


// export const Lang = {
//   en: "en",
//   fr: "fr",
// };

export const OrganizationStatus = {
  // Prospect: 1,
  Active: 1,
  Inactive: 2,
};

// export const OrganizationStatus = {
//   Prospect: 1,
//   Active: 2,
//   Inactive: 3,
// };

// var Status;
// (function(Status) {
//   Status[(Status["New"] = 0)] = "New";
//   Status[(Status["Submitted"] = 1)] = "Submitted";
//   Status[(Status["Approved"] = 2)] = "Approved";
//   Status[(Status["Rejected"] = 3)] = "Rejected";
// })(Status || (Status = {}));
// var snew = Status.New;
// console.log(snew); //This is the number
// console.log(Status[snew]); //This is the string
