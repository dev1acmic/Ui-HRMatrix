import { Roles, Types } from "./enum";

//isTA/isHM/isInterviewer
export function isTypeEmployer(type) {
  return type === Types.Employer;
}

export function isTypeRecruiter(type) {
  return type === Types.Recruiter;
}

export function isRoleTA(roles) {
  return roles && roles.some((role) => role.id === Roles.TalentAcquisitionTeam);
}

export function isRoleHM(roles) {
  return roles && roles.some((role) => role.id === Roles.HiringManager);
}

export function isRoleInterviewer(roles) {
  return roles && roles.some((role) => role.id === Roles.InterviewPanel);
}

export function isRoleRecruiter(roles) {
  return roles && roles.some((role) => role.id === Roles.Recruiter);
}

export function isRoleAdmin(roles) {
  return roles && roles.some((role) => role.id === Roles.Admin);
}

export function isRoleAgencyAdmin(roles) {
  return roles && roles.some((role) => role.id === Roles.AgencyAdmin);
}

export function isRoleSuperUserAdmin(roles) {
  return roles && roles.some((role) => role.id === Roles.SuperUserAdmin);
}
