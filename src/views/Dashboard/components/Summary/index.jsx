import React, { useEffect, useState } from "react";
import { Container, Box, withStyles, Typography } from "@material-ui/core";

import classNames from "classnames";
import {
  WorkOutline,
  ErrorOutlineOutlined,
  SupervisedUserCircleOutlined,
  AccountCircleOutlined,
  PlaylistAddCheckOutlined,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { Types } from "util/enum";

import moment from "moment";
import styles from "../style";

const Summary = (props) => {
  const { classes, summary, type, jobList } = props;
  const { t } = useTranslation("dashboard");

  if (summary) {
    return (
      <Container className={classes.root} style={{ paddingBottom: 0 }}>
        <Box className={classes.summaryBoxWrap}>
          <Box className={classes.summaryBoxLeft}>
            <Box className={classNames(classes.summaryBoxCol, classes.col1)}>
              <Box className={classes.iconHead}>
                <WorkOutline className={classes.iconLeft} />
                <Typography className={classes.iconText}>
                  {t("summary.open")}
                  <br />
                  {t("summary.jobs")}
                </Typography>
              </Box>
              <Box>
                <Typography className={classes.iconNumber}>
                  {summary.openJobs}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.summaryBoxCol}>
              <Box>
                <AccountCircleOutlined
                  style={{ color: "#38B5ED" }}
                  className={classes.roundIcon}
                />
              </Box>
              <Box>
                <Typography className={classes.iconTextGradient}>
                  {summary.applicantCount}
                </Typography>
                <Typography className={classes.iconTextNormal}>
                  {t("summary.candidates")}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.summaryBoxCol}>
              <Box>
                <PlaylistAddCheckOutlined
                  style={{ color: "#60ce8c" }}
                  className={classes.roundIcon}
                />
              </Box>
              <Box>
                <Typography
                  className={classes.iconTextGradient}
                  style={{
                    background:
                      "linear-gradient(90deg, #30ec7b 17.24%, #4abead 100%)",
                  }}
                >
                  {summary.shortListedApplicantCount}
                </Typography>
                <Typography className={classes.iconTextNormal}>
                  {t("summary.shortlisted")}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.summaryBoxCol}>
              <Box>
                <SupervisedUserCircleOutlined
                  style={{ color: "#548cf9" }}
                  className={classes.roundIcon}
                />
              </Box>
              <Box>
                <Typography
                  style={{
                    background:
                      "linear-gradient(90deg, #548cf9 17.24%, #042d7d 100%)",
                  }}
                  className={classes.iconTextGradient}
                >
                  {summary.interviewedApplicantCount}
                </Typography>
                <Typography className={classes.iconTextNormal}>
                  {t("summary.interviewed")}
                </Typography>
              </Box>
            </Box>
          </Box>
          {type !== Types.Recruiter && (
            <Box className={classes.summaryBoxRight}>
              <Box className={classes.iconHead}>
                <ErrorOutlineOutlined className={classes.iconLeft} />
                <Typography className={classes.iconText}>
                  {t("summary.jobs")},
                  <br />
                  {t("summary.needAttention")}
                </Typography>
              </Box>
              <Box>
                <Typography className={classes.iconNumber}>
                  {summary.needAttentionCount}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
};

export default withStyles(styles)(Summary);
