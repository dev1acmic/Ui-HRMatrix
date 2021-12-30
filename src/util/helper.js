import moment from 'moment';
import _ from 'lodash'

export function getFullAddress(address) {
  const fulladdress = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.country,
    address.zip,
  ];
  return fulladdress.filter(Boolean).join(", ");
}

export function getFullName(user) {
  const fullname = [user.fname, user.lname];
  return fullname.filter(Boolean).join(" ");
}

export function getFinancialYear(date, mon) {
  if (mon) {
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var fiscalyear = "";
    if (month < mon) {
      fiscalyear = date.getFullYear() - 1 + "-" + date.getFullYear();
    } else {
      fiscalyear = year + "-" + (year + 1);
    }
    return fiscalyear;
  }
  return;
}

export function getQuarterYear(date, mon) {
  if (mon) {
    var month = date.getMonth() + 1;
    var quater = Math.floor((month - mon) / 3) + 1;
    if (quater === -1) {
      quater = 3;
    }
    if (quater === 0) {
      quater = 4;
    }
    return quater;
  }
  return;
}

export function getYear(startDate, endDate) {
  return (
    new Date(startDate).getFullYear() + "-" + new Date(endDate).getFullYear()
  );
}
export function formatCurrency(money) {
  let amount = money.toString().replace(/,/g, "");
  //return amount.replace(/(.)(?=(\d{3})+$)/g, "$1,");
  return new Intl.NumberFormat("en-US", { currency: "USD" }).format(amount);
}

export function skillCompetencySet() {
  return {
    1: { competency: "Beginner", points: 5, weight: 25, id: 1 },
    2: { competency: "Intermediate", points: 10, weight: 50, id: 2 },
    3: { competency: "Advanced", points: 15, weight: 75, id: 3 },
    4: { competency: "Expert", points: 20, weight: 100, id: 4 },
  };
}

export function skillPrioritySet() {
  return {
    1: { priority: "High", points: 3, id: 1 },
    2: { priority: "Medium", points: 2, id: 2 },
    3: { priority: "Low", points: 1, id: 3 },
  };
}

export function paginate(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

export function getApplicatSkillMatrix(
  applicants,
  skillFactor = 50,
  preQFactor = 50
) {
  /// This function returns array with each applicant skill matrix, and max value of some of the parameters
  let promises = [];
  const prioritySet = skillPrioritySet();
  const competencySet = skillCompetencySet();
  let maxSkillPerc = 0;
  let maxAnsScorePrc = 0;
  let maxOverAllScore = 0;
  let skillReqPointSum = 0;

  // destructure jobApllications data
  applicants.forEach((app) => {
    promises.push(
      new Promise(function (resolve, reject) {
        let totalSkillPoint = 0;
        let totalSkillReqPoint = 0;
        let totalAnsScorePrc = 0;
        let overAllScore = 0;

        const getSkillPriorityPointSum = (total, skill) => {
          const point = prioritySet[skill.priority].points;
          return total + point;
        };

        // for a applicant find the sum of priority point of each skill
        const totalSkillPriorityPoint = app.jobskills.reduce(
          getSkillPriorityPointSum,
          0
        );

        // itereate through each skill
        let skills = app.jobskills.map((skill) => {
          const {
            competency: reqCompetency,
            exp: reqExp,
            mandatory,
            priority,
            skill: { name, id },
            jobapplicantskills: { competency, exp },
          } = skill;

          const skillPriorityFactor =
            prioritySet[priority].points / totalSkillPriorityPoint;

          const skillCompetency = competency
            ? skillPriorityFactor * competencySet[competency].weight
            : 0;

          const skillExp = skillPriorityFactor * exp;

          const skillReqCompetency =
            skillPriorityFactor * competencySet[reqCompetency].weight;

          const skillReqExp = skillPriorityFactor * reqExp;

          totalSkillPoint = totalSkillPoint + (skillCompetency + skillExp);

          totalSkillReqPoint =
            totalSkillReqPoint + (skillReqCompetency + skillReqExp); // This value would be same for each applicant since they deals with same skill set and same required value

          return {
            id,
            competency,
            exp,
            reqCompetency,
            reqExp,
            mandatory,
            priority,
            name,
            competencyPoints: competency ? competencySet[competency].points : 0,
            reqCompetencyPoints: competencySet[reqCompetency].points,
          };
        });

        // A question can have multiple answers as choice, derive unique questions
        const getUniqueQuestions = (result, ans) => {
          const {
            score,
            jobscreeningqtn: { id, priority, question },
          } = ans;

          let idx = null;
          for (let i = 0; i < result.length; i++) {
            if (result[i].id === id) {
              idx = i;
              break;
            }
          }

          if (idx !== null) {
            result[idx].score = result[idx].score + score;
          } else {
            result.push({
              id,
              score,
              priority,
              question,
            });
          }

          return result;
        };

        // Get unique questions from the answers
        const uniqueQuestions = app.jobscreeningchoices.reduce(
          getUniqueQuestions,
          []
        );
        //console.log(uniqueQuestions);

        const getQPriorityPointSum = (total, q) => {
          const point = prioritySet[q.priority].points;
          return total + point;
        };

        const totalQPriorityPoint = uniqueQuestions.reduce(
          getQPriorityPointSum,
          0
        );

        const screeningQ = uniqueQuestions.map((q) => {
          const { score, id, priority } = q;
          const qPriorityPoint = prioritySet[priority].points;
          const ansScorePrc =
            Math.round(score * (qPriorityPoint / totalQPriorityPoint) * 10) /
            10;

          totalAnsScorePrc = totalAnsScorePrc + ansScorePrc;

          return {
            id,
            ansScore: score,
            qPriorityPoint,
            ansScorePrc,
          };
        });

        const {
          id,
          fname,
          lname,
          email,
          exp,
          availDate,
          payRate,
          jobpostId,
          selectStatus,
          resumeId,
          avatarId,
          user: {
            organization: { name: orgName },
          },
        } = app;

        //totalSkillCompetencyPerc = Math.round(totalSkillCompetencyPerc);
        //totalSkillReqCompetencyPerc = Math.round(totalSkillReqCompetencyPerc);

        totalAnsScorePrc = Math.round(totalAnsScorePrc * 10) / 10;

        const totalSkillPerc =
          Math.round((totalSkillPoint / totalSkillReqPoint) * 100 * 10) / 10;

        overAllScore =
          Math.round(
            ((totalSkillPerc * skillFactor) / 100 +
              (totalAnsScorePrc * preQFactor) / 100) *
            10
          ) / 10;

        // Find max values for skill and question scores
        maxSkillPerc =
          maxSkillPerc > totalSkillPerc ? maxSkillPerc : totalSkillPerc;

        maxAnsScorePrc =
          maxAnsScorePrc > totalAnsScorePrc ? maxAnsScorePrc : totalAnsScorePrc;
        maxOverAllScore =
          maxOverAllScore > overAllScore ? maxOverAllScore : overAllScore;

        skillReqPointSum = Math.round(totalSkillReqPoint * 10) / 10;

        resolve({
          id,
          rank: undefined,
          fname,
          lname,
          email,
          exp,
          availDate,
          payRate,
          jobpostId,
          selectStatus,
          orgName,
          resumeId,
          avatarId,
          skills: skills.sort((a, b) => a.id - b.id),
          screeningQ: screeningQ.sort((a, b) => a.id - b.id),
          totalSkillPerc,
          totalAnsScorePrc,
          overAllScore,
          assignedInterviewer: app.applicantinterviewers, 
          interviewschedule: app.interviewschedule,
        });
      })
    );
  });

  return Promise.all(promises).then((matrixList) => {
    //console.log(matrixList);

    //Sort the applicants by overAllScore score in desc
    matrixList.sort((a, b) => b.overAllScore - a.overAllScore);

    // Rank the candidates
    for (const i in matrixList) {
      matrixList[i].rank = i * 1 + 1;
    }

    //console.log(maxValues);
    return new Promise(function (resolve, reject) {
      resolve({
        applicantSkillMatrix: matrixList,
        maxSkillValues: {
          maxSkillPerc,
          maxAnsScorePrc,
          maxOverAllScore,
          skillReqPointSum,
        },
      });
    });
  });
}

export function getApplicatAssesmentSkillMatrix(
  shortListedApplicantsMatrix,
  appAssesments,
  levels,
  assesmentFactor = 50,
  skillFactor = 50,
  panels
) {
  let promises = [];
  // const prioritySet = skillPrioritySet();
  // const competencySet = skillCompetencySet();
  let maxSkillPerc = 0;
  let maxAssessmentScorePrc = 0;
  let maxOverAllScore = 0;

  //let skillReqPointSum = 0;

  shortListedApplicantsMatrix.forEach((app) => {
    promises.push(
      new Promise(function (resolve, reject) {
        let totalAssesmentScorePrc = 0;
        let overAllScore = 0;
        let assessmentCount = 0;
        let interviewdBy, interviewdAt;
        let allAsesmntLevelComplete = true;
        let applicantStatus;

        // Get skills
        let skills = app.skills.map((skill) => {
          const {
            competency,
            id: skillId,
            competencyPoints,
            exp: skillExp,
            mandatory,
            name,
            priority,
            reqCompetency,
            reqCompetencyPoints,
            reqExp,
          } = skill;
          return {
            competency,
            id: skillId,
            competencyPoints,
            exp: skillExp,
            mandatory,
            name,
            priority,
            reqCompetency,
            reqCompetencyPoints,
            reqExp,
          };
        });

        //Get assesment levels 
        let assesmentLevels =
          levels &&
          levels.map((level) => {
            let assesment;
            let assesmentScore;
            let assesmentStatus;
            let panelname;
            if (appAssesments) {
              for (let index = 0; index < appAssesments.length; index++) {
                let asmnt = appAssesments[index];
                if (
                  asmnt.jobapplicationId === app.id &&
                  asmnt.level === level
                ) {
                  assesment = asmnt;
                  break;
                }
              }
            }

            if (assesment) {
              assessmentCount = assessmentCount + 1;
              assesmentScore = assesment.overallScore;
              assesmentStatus = assesment.status;
              totalAssesmentScorePrc =
                totalAssesmentScorePrc + Math.round(assesmentScore * 10) / 10;
              interviewdBy = assesment.user;
              interviewdAt = assesment.interviewDate;
              applicantStatus = assesment.status;
              panelname =
                panels &&
                panels.filter((c) => c.level === level).length > 0 &&
                panels.filter((c) => c.level === level)[0].interviewpanel &&
                panels.filter((c) => c.level === level)[0].interviewpanel.name;
            } else {
              // assesment is not done
              allAsesmntLevelComplete = false;
            }

            return {
              level,
              assesmentScore,
              assesmentStatus,
              interviewdBy,
              interviewdAt,
              applicantStatus,
              panelname,
            };
          });

        const {
          availDate,
          exp,
          fname,
          lname,
          email,
          jobpostId,
          id,
          payRate,
          selectStatus,
          totalSkillPerc,
          assignedInterviewer,
          resumeId,
          avatarId,
          interviewschedule
        } = app;

        totalAssesmentScorePrc = totalAssesmentScorePrc
          ? totalAssesmentScorePrc / assessmentCount
          : totalAssesmentScorePrc; // Some levels of assessment may not be available, so total should be devided by the available count

        if (totalAssesmentScorePrc) {
          overAllScore =
            Math.round(
              ((totalSkillPerc * skillFactor) / 100 +
                (totalAssesmentScorePrc * assesmentFactor) / 100) *
              10
            ) / 10;
        } else {
          overAllScore =
            Math.round(((totalSkillPerc * skillFactor) / 100) * 10) / 10;
        }

        maxSkillPerc =
          maxSkillPerc > totalSkillPerc ? maxSkillPerc : totalSkillPerc;

        maxAssessmentScorePrc =
          maxAssessmentScorePrc > totalAssesmentScorePrc
            ? maxAssessmentScorePrc
            : totalAssesmentScorePrc;

        maxOverAllScore =
          maxOverAllScore > overAllScore ? maxOverAllScore : overAllScore;

        resolve({
          id,
          rank: undefined,
          availDate,
          exp,
          fname,
          lname,
          email,
          jobpostId,
          resumeId,
          avatarId,
          payRate,
          selectStatus,
          assesmentLevels,
          skills,
          allAsesmntLevelComplete,
          atleast1AsesmntLevelComplete: assessmentCount > 0,
          totalSkillPerc,
          totalAssesmentScorePrc,
          overAllScore,
          assignedInterviewer,
          applicantStatus,
          interviewschedule
        });
      })
    );
  });

  return Promise.all(promises).then((matrixList) => {
    // Sort the applicants by overAllScore score in desc
    matrixList.sort((a, b) => b.overAllScore - a.overAllScore);

    // Rank the candidates
    for (const i in matrixList) {
      matrixList[i].rank = i * 1 + 1;
    }

    //console.log(maxValues);
    return new Promise(function (resolve, reject) {
      resolve({
        applicantAssesmentMatrix: matrixList,
        maxSkillValues: {
          maxSkillPerc,
          maxAssessmentScorePrc,
          maxOverAllScore,
        },
      });
    });
  });
}

export function b64toBlob(
  b64Data,
  name = "avatar.png",
  contentType = "",
  sliceSize = 512
) {
  if (b64Data.indexOf("image/png") > -1) {
    contentType = "image/png";
  } else if (b64Data.indexOf("image/jpeg") > -1) {
    contentType = "image/jpeg";
    name = "avatar.jpeg";
  }

  const startIndex = b64Data.indexOf("base64,") + 7;

  if (startIndex > -1) {
    b64Data = b64Data.substr(startIndex);
  }

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, { type: contentType });
  blob.name = name;
  return blob;
}

export function getMsg(message, t) {
  // If there need a translation, do that.
  // If no qualified key, its assimed that its under errMsg node
  if (message && message.indexOf("TRANSLATION.") > -1) {
    const key = message.split(".").pop();
    if (key.indexOf(".") > -1) {
      return t(key);
    }
    return t("errMsg." + key);
  }
  return message;
}

export function translateMessage(message, t) {
  if (
    message &&
    typeof message !== "boolean" &&
    message.indexOf("TRANSLATION.") > -1
  ) {
    const key = message.replace(/TRANSLATION./g, "");
    return t(key);
  }
  return message;
}


function isInBreak(slotTime, breakTimes) {
  return breakTimes.some((br) => {
    return slotTime >= moment(br[0], "hh:mm A") && slotTime < moment(br[1], "hh:mm A");
});
    }

function isToday(date) {
  // Create date from input value
  var inputDate = new Date(date);

  // Get today's date
  var todaysDate = new Date();

  // call setHours to take the time out of the comparison
  if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true
  }
  return false
}

export const loadTimeSlots = (date) => {
  const ROUNDING = 30 * 60 * 1000; /*ms*/
  let start = moment();
  start = moment(Math.ceil((+start) / ROUNDING) * ROUNDING);
  start.format("hh:mm A");

  const x = {
    nextSlot: 30,
    breakTime: [
      // ['11:00', '14:00'], ['16:00', '18:00']
    ],
    // startTime: moment(new Date().getHours()).add(30, 'm').toDate(),
    endTime: '24'
  };

  let slotTime = isToday(date)? start: moment(0, "hh:mm A");
  const endTime = moment(x.endTime, "hh:mm A");

  let times = ['Select'];
  while (slotTime < endTime) {
    if (!isInBreak(slotTime, x.breakTime)) {
      times.push(slotTime.format("hh:mm A"));
    }
    slotTime = slotTime.add(x.nextSlot, 'minutes');
  }
  return times
};

export const compareTime = (str1, str2) => {
  var a = str1;
  var b = str2;

  var aDate = new Date(a).getTime();
  var bDate = new Date(b).getTime();

  if (aDate < bDate) {
    return -1
  } else if (aDate > bDate) {
    return 1
  } else {
    return 1
  }
}

export const getInterviewSchedule = (data) => {
let schedules = []
  data.map(item => {
    let startDt = new Date(item.fromtime);
    let endDt = new Date(item.totime);
    let startHr = moment(item.fromtime).format('HH');
      let startMin = moment(item.fromtime).format('mm');
      let endHr = moment(item.totime).format('HH');
      let endMin = moment(item.totime).format('mm');
  let start = new Date(
      startDt.getFullYear(),
      startDt.getMonth(),
      startDt.getDate(),
      startHr,
      startMin
  ); 
  let end =
      new Date(
          endDt.getFullYear(),
          endDt.getMonth(),
          endDt.getDate(),
          endHr,
          endMin
      ); 
      schedules.push({
        title: `Interview for ${item.applicantname}`, start, end , applicantid : item.jobapplicantid, jobid:item.jobid
      })

  }) 
  return _.uniqBy(schedules, function(elem) {
    return JSON.stringify(_.pick(elem, ['start', 'end']));
});
}

 

export const truncate =(input) => {   
  return input.length > 50 ? `${input.substring(0, 50)}...` : input;;
};