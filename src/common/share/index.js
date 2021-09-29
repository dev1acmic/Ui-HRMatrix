const checkStripeTrialExist = (organization, skipPaymentCheck = false) => {
  if (organization && organization.stripeTrialEndDate) {
    let trialExist;
    if (Date.parse(new Date()) < Date.parse(organization.stripeTrialEndDate)) {
      trialExist = true;
      return true;
    } else {
      trialExist = false;
    }

    if (skipPaymentCheck) {
      return trialExist;
    }
  }
  return checkIsStripeSubscribed(organization);
};

const checkIsStripeSubscribed = (organization) => {
  if (organization && organization.stripe) {
    return true;
  }
  return false;
};

const checkCanidatePremiumMembership = (
  isTrialExist,
  jobViewUsageId,
  isPremium
) => {
  if (!isPremium) {
    return true;
  }
  if (isTrialExist) {
    return true;
  }

  if (isPremium && jobViewUsageId) {
    return true;
  }
  return false;
};

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const checkUserStatus = (user, isAgency, t) => {
  if (isAgency) {
    if (
      user.isReferal === true &&
      user.selfAuthorization === 2 &&
      !user.isDeleted
    ) {
      return "Pending Approval";
    }

    // user.isReferal === true &&
    // (user.selfAuthorization === 1 || user.selfAuthorization === 3) &&
    // !user.isDeleted &&
    // user.status === 2
    if (!user.isReferal && !user.isVerified && user.status === 2) {
      return "Email Verification Pending";
    }

    if (user.isReferal && !user.isVerified && user.status === 2) {
      return "Email Verification Pending";
    }
  }

  if (!isAgency) {
    if (user.status === 2 && user.isVerified === false) {
      return "Email Verification Pending";
    }
  }

  return "";
};
export default {
  checkStripeTrialExist,
  checkIsStripeSubscribed,
  checkCanidatePremiumMembership,
  escapeRegexCharacters,
  checkUserStatus,
};
