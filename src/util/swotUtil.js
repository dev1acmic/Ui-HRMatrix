import { AssignmentReturnTwoTone } from '@material-ui/icons';
import moment from 'moment';

const Criterias = {
	JobSkills: 1,
	Availability: 2,
	AvgJobTenure: 3,
	PayRate: 4,
	WorkAuthorization: 5,
	YearsOfExperience: 6,
	DomainExpertise: 7,
	Industry: 8,
	Relocation: 9,
	Certifications: 10
};

const Swot = {
	Strength: 1,
	Weakness: 2,
	Opportunity: 3,
	Threat: 4
};

//Check whether the candidate posses all the mandatory skills
const checkSkills = (jobskills) => {
	return jobskills.filter((c) => c.mandatory).every((c) => c.exp >= c.reqExp);
};

//Check whether the candidate is available to join before the job start date
const checkAvailability = (jobStartDt, availableDt) => {
	return moment(availableDt).isSameOrBefore(jobStartDt, 'day');
};

//Find the candidates avg job tenure (total experience/number of companies worked) and its >3
const checkAvgJobTenure = (totalExp, noOfEmps) => { 
	return Math.floor(totalExp / noOfEmps);
};

//Check whether candidate’s asking pay is less than what the company offered
const checkPayRate = (offered, expected) => {
	return offered * 1 >= expected * 1;
};

//Check whether candidate’s asking pay is less than what the company offered
const checkWorkAuthorization = (hasWorkAuth) => {
	return hasWorkAuth;
};

//Check whether the candidate overall experience is more than what is required
const checkYearsOfExp = (candExp, reqExp) => {
	return candExp >= reqExp;
};

//Check whether candidate is willing to relocate
const checkRelocation = (relocate) => {
	return relocate;
};

//Check whether the candidate possesses all the mandatory certifications
const checkCertifications = (candCert, reqCert) => {
	const candCer = candCert.filter((c) => c.has === 1).map((c) => c.jobcertificationId);
	//const mandCert = reqCert.filter((c) => c.mandatory === true).map((c) => c.id);/**removed mandatory certificate check. */
	const jobCert = reqCert.filter((c) => c.id !== 0).map((c) => c.id);
	return jobCert.every((val) => candCer.includes(val));/**check whether the candidate has all the certificates asked by the job */
};

const generateText = (name, criteria, swot, t, addnlText = null) => {
	switch (criteria) {
		case Criterias.JobSkills: {
			if (swot === Swot.Strength) {
				return t("possessImpSkills");
			}
			return t("doesNotPossessImpSkills");
		}

		case Criterias.Availability: {
			if (swot === Swot.Opportunity) {
				return t("readytojoinbeforetheprojectstartdate");
			}
			return t("notreadytojoinbeforetheprojectstartdate");
		}

		case Criterias.AvgJobTenure: {
			if (swot === Swot.Strength) {
				return t('stayedInEveryJobs', { name: `${name}` }) + t('expYrs', { count: addnlText });
			}
			return t('switchedJobs', { name: `${name}` }) + t('expYrs', { count: addnlText });
		}

		case Criterias.PayRate: {
			if (swot === Swot.Opportunity) {
				return t("costeffectiveforthecompany");
			}
			return t("notcosteffectiveforthecompany");
		}

		case Criterias.WorkAuthorization: {
			if (swot === Swot.Opportunity) {
				return t("authorizedtoworkhere");
			}
			return t("notauthorizedtoworkhere");
		}

		case Criterias.YearsOfExperience: {
			if (swot === Swot.Strength) {
				return t("havingenoughexperienceforthejob");
			}
			return t("nothavingenoughexperienceforthejob");
		}

		case Criterias.Relocation: {
			if (swot === Swot.Opportunity) {
				return t("willingtorelocate");
			}
			return t("notwillingtorelocate");
		}

		case Criterias.Certifications: {
			if (swot === Swot.Strength) {
				return t("certifiedforthejob");
			}
			return t("notcertifiedforthejob");
		}

		default: {
			return '';
		}
	}
};

export const getSwotAnalysis = async (applicant, t) => {
	const strength = [];
	const weakness = [];
	const opportunity = [];
	const threat = [];
	const candidateName = applicant.fname + ' ' + applicant.lname;
	//loop through each criteria

	for (let i = 1; i <= Object.entries(Criterias).length; i++) {
		switch (i) {
			case Criterias.JobSkills: {
				if (checkSkills(applicant.skills)) {
					strength.push(generateText(candidateName, Criterias.JobSkills, Swot.Strength, t));
				} else {
					weakness.push(generateText(candidateName, Criterias.JobSkills, Swot.Weakness, t));
				}
				break;
			}

			case Criterias.Availability: {
				if (checkAvailability(applicant.jobpost.startDate, applicant.availDate)) {
					opportunity.push(generateText(candidateName, Criterias.Availability, Swot.Opportunity, t));
				} else {
					threat.push(generateText(candidateName, Criterias.Availability, Swot.Threat, t));
				}
				break;
			}

			case Criterias.AvgJobTenure: {
				let avgTenure = checkAvgJobTenure(applicant.exp, applicant.jobapplicantemployers.length);
				if (avgTenure >= 3) {
					strength.push(generateText(candidateName, Criterias.AvgJobTenure, Swot.Strength, t, avgTenure));
				} else {
					weakness.push(generateText(candidateName, Criterias.AvgJobTenure, Swot.Weakness, t, avgTenure));
				}
				break;
			}

			case Criterias.PayRate: {
				if (checkPayRate(applicant.jobpost.payRate, applicant.payRate)) {
					opportunity.push(generateText(candidateName, Criterias.PayRate, Swot.Opportunity, t));
				} else {
					threat.push(generateText(candidateName, Criterias.PayRate, Swot.Threat, t));
				}
				break;
			}

			case Criterias.WorkAuthorization: {
				if (checkWorkAuthorization(applicant.workAuth)) {
					opportunity.push(generateText(candidateName, Criterias.WorkAuthorization, Swot.Opportunity, t));
				} else {
					threat.push(generateText(candidateName, Criterias.WorkAuthorization, Swot.Threat, t));
				}
				break;
			}

			case Criterias.YearsOfExperience: {
				if (checkYearsOfExp(applicant.exp, applicant.jobpost.exp)) {
					strength.push(generateText(candidateName, Criterias.YearsOfExperience, Swot.Strength, t));
				} else {
					weakness.push(generateText(candidateName, Criterias.YearsOfExperience, Swot.Weakness, t));
				}
				break;
			}

			case Criterias.Relocation: {
				if (checkRelocation(applicant.relocate)) {
					opportunity.push(generateText(candidateName, Criterias.Relocation, Swot.Opportunity, t));
				} else {
					threat.push(generateText(candidateName, Criterias.Relocation, Swot.Threat, t));
				}
				break;
			}

			case Criterias.Certifications: {
				if (checkCertifications(applicant.jobapplicantcerts, applicant.jobpost.jobcertifications)) {
					strength.push(generateText(candidateName, Criterias.Certifications, Swot.Strength, t));
				} else {
					weakness.push(generateText(candidateName, Criterias.Certifications, Swot.Weakness, t));
				}
				break;
			}

			default: {
				break;
			}
		}
	}
	return Promise.resolve({
		strength,
		weakness,
		opportunity,
		threat
	});
};
