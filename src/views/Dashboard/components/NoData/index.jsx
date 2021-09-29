import React from "react";
import { withStyles, Box, Typography, Button } from "@material-ui/core";

/*******UTIL STARTS/*******/

import { Roles } from "util/enum";

/*******UTIL ENDS/*******/
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../style";
import { useTranslation } from "react-i18next";

import nojob from "assets/images/nojob.png";

const NoData = (props) => {
  const { classes, role } = props;
  const { t } = useTranslation("dashboard");

  return (
    <div style={{ paddingTop: 5 }}>
      <Box className={classes.nojobWrap}>
        <img src={nojob} className={classes.nojobImg} alt="No Job" />
        <Typography variant="h2" className={classes.nojobHead}>
          {t("noactivejobs")}
        </Typography>
        {(role === Roles.HiringManager || role === Roles.Admin) && (
          <React.Fragment>
            <Typography variant="body1" className={classes.nojobDesc}>
              {t("startpostingthejobsnow")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              to="/rc/job-post"
              component={Link}
            >
              {t("postjob")}
            </Button>
          </React.Fragment>
        )}
        {role === Roles.InterviewPanel && (
          <Typography variant="body1" className={classes.nojobDesc}>
            {t("aquisitionAssignAlert")}
          </Typography>
        )}
        {(role === Roles.Recruiter || role === Roles.AgencyAdmin) && (
          <Typography variant="body1" className={classes.nojobDesc}>
            {t("employerAssignAlert")}
          </Typography>
        )}
        {role === Roles.TalentAcquisitionTeam && (
          <Typography variant="body1" className={classes.nojobDesc}>
              {t("managerAssignAlert")}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default withRouter(connect(null, null)(withStyles(styles)(NoData)));
