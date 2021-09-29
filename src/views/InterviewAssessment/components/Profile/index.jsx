import React, { useEffect } from "react";
import {
  Container,
  Box,
  withStyles,
  Typography,
  Button,
} from "@material-ui/core";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { InterviewMode } from "util/enum";
import { ProfilePic } from "util/ProfilePic";
import flag from "assets/images/flag_us.png";

import classNames from "classnames";

import styles from "../style";
import { connect } from "react-redux";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";

import {
  isRoleAdmin,
  isRoleHM,
  isRoleTA,
  isRoleInterviewer,
} from "util/roleUtil";
import { Roles } from "util/enum";
const Profile = (props) => {
  const { classes, applicant, interviewLevel, assessment, profile } = props;
  const [role, setRole] = React.useState();
  const { t } = useTranslation(["interviewAssessment", "enum"]);

  useEffect(() => {
    let role;
    if (isRoleTA(profile && profile.roles)) {
      role = Roles.TalentAcquisitionTeam;
    } else if (isRoleHM(profile && profile.roles)) {
      role = Roles.HiringManager;
    } else if (isRoleAdmin(profile && profile.roles)) {
      role = Roles.Admin;
    } else if (isRoleInterviewer(profile && profile.roles)) {
      role = Roles.InterviewPanel;
    }
    setRole(role);
  }, []);

  const getName = () => {
    if (assessment && assessment.user) {
      return assessment.user.fname + " " + assessment.user.lname;
    } else {
      return profile.fname + " " + profile.lname;
    }
  };
  return (
    applicant &&
    interviewLevel && (
      <Container className={classes.root} style={{ paddingBottom: 0 }}>
        <Box className={classes.MainWrapper} style={{ paddingTop: "8px" }}>
          <Box className={classes.SubWrapper}>
            <Box className={classNames(classes.proWrap, classes.col1)}>
              <ProfilePic
                id={applicant.avatarId}
                className={classes.avatarImg}
                getFile={props.getFile}
              />
            </Box>

            <Box className={classes.summaryBoxCol}>
              <div>
                <Typography variant="h1" className={classes.proName}>
                  {applicant.fname} {applicant.lname}
                </Typography>
                <Typography className={classes.cntryName}>
                  <img alt="Name" src={flag} className={classes.flag} />
                  {applicant.country}
                </Typography>
              </div>
            </Box>
            <Box className={classes.proDetails}>
              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.position")}
              </Typography>
              <Typography variant="h3" className={classes.sTitle}>
                {applicant.currJob}
              </Typography>

              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.panelname")}
              </Typography>
              <Typography
                variant="h3"
                className={classNames(classes.sTitle, classes.noBmargin)}
              >
                {interviewLevel.interviewpanel &&
                  interviewLevel.interviewpanel.name}
              </Typography>
            </Box>

            <Box className={classes.proDetails}>
              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.level")}
              </Typography>
              <Typography variant="h3" className={classes.sTitle}>
                {interviewLevel.level} of {interviewLevel.totalLevel}
              </Typography>

              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.typeofInterview")}
              </Typography>
              <Typography
                variant="h3"
                className={classNames(classes.sTitle, classes.noBmargin)}
              >
                {interviewLevel.mode
                  ? t(
                      `${InterviewMode.getNameByValue(
                        parseInt(interviewLevel.mode)
                      )}`
                    )
                  : "--"}
              </Typography>
            </Box>

            <Box className={classes.proDetails}>
              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.dateofInterview")}
              </Typography>
              <Typography variant="h3" className={classes.sTitle}>
                {interviewLevel.interviewDate
                  ? moment(interviewLevel.interviewDate).format("L")
                  : moment().format("L")}
              </Typography>

              <Typography variant="h4" className={classes.mTitle}>
                {t("profile.interviewer")}
              </Typography>
              <Typography
                variant="h3"
                className={classNames(classes.sTitle, classes.noBmargin)}
              >
                {interviewLevel.interviewpanel &&
                interviewLevel.interviewpanel.users &&
                interviewLevel.interviewpanel.users[0] &&
                interviewLevel.interviewpanel.users[0].fname
                  ? interviewLevel.interviewpanel.users[0].fname +
                    " " +
                    interviewLevel.interviewpanel.users[0].lname
                  : getName()}
              </Typography>
            </Box>
          </Box>
        </Box>
        {(role === Roles.Admin ||
          role === Roles.HiringManager ||
          role === Roles.TalentAcquisitionTeam) && (
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "0 20px 0",
            }}
          >
            <Button
              variant="contained"
              className={classes.button}
              size="small"
              onClick={() =>
                props.handleChangeLevel(
                  -1,
                  interviewLevel.level,
                  interviewLevel.totalLevel
                )
              }
              disabled={interviewLevel.level === 1}
              style={{
                minWidth: "30px",
                boxShadow: "none",
                borderRadius: "5px",
                border: "1px solid #efefef",
                textTransform: "inherit",
                fontWeight: "normal",
                letterSpacing: "0",
                backgroundColor: interviewLevel.level === 1 ? "" : "#49beab",
              }}
            >
              <ArrowBackIosOutlined style={{ color: "#fff" }} />{" "}
            </Button>
            <Typography style={{ padding: "5px 5px", alignItems: "center" }}>
              <b>{t("profile.level")} : </b> {interviewLevel.level} of{" "}
              {interviewLevel.totalLevel}
            </Typography>
            <Button
              variant="contained"
              className={classes.button}
              size="small"
              onClick={() =>
                props.handleChangeLevel(
                  1,
                  interviewLevel.level,
                  interviewLevel.totalLevel
                )
              }
              disabled={interviewLevel.level === interviewLevel.totalLevel}
              style={{
                minWidth: "30px",
                boxShadow: "none",
                borderRadius: "5px",
                border: "1px solid #efefef",
                textTransform: "inherit",
                fontWeight: "normal",
                letterSpacing: "0",
                backgroundColor:
                  interviewLevel.level === interviewLevel.totalLevel
                    ? ""
                    : "#49beab",
              }}
            >
              <ArrowForwardIosOutlined style={{ color: "#fff" }} />{" "}
            </Button>
          </Box>
        )}
      </Container>
    )
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  assessment: (state.jobApplication && state.jobApplication.assessment) || null,
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));

//export default withStyles(styles)(Profile);
