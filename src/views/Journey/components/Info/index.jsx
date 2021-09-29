import React, { Component } from "react";
import {
  Container,
  Table,
  TableCell,
  TableRow,
  withStyles,
  Divider,
  Typography,
} from "@material-ui/core";
import { getQuarterYear } from "util/helper";
import {
  AccountCircleOutlined,
  AssignmentIndOutlined,
  FlagOutlined,
  PlaceOutlined,
  DonutSmallOutlined,
  CalendarTodayOutlined,
} from "@material-ui/icons";
import { withTranslation } from "react-i18next";

import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
import styles from "../style";

const Info = (props) => {
  const { classes, t, jobPost, finStartMonth } = props;
  const location = jobPost && jobPost.addresses[0];
  const startDate = jobPost && new Date(jobPost.startDate);
  return (
    jobPost && (
      <Container className={classes.root}>
        <div className={classes.root}>
          <PerfectScrollbar className={classes.scroller}>
            <Table className={classes.reviewItemWrap}>
              <TableRow>
                <TableCell className={classes.reviewCol} align="center">
                  <AccountCircleOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("jobcreatedby")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {jobPost.user.fname} {jobPost.user.lname}
                    </Typography>
                  </div>
                  <Divider className={classes.dividerVer} />
                </TableCell>
                <TableCell className={classes.reviewCol}>
                  <FlagOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("jobid")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {jobPost.uniqueId}
                    </Typography>
                  </div>
                  <Divider className={classes.dividerVer} />
                </TableCell>
                <TableCell className={classes.reviewCol}>
                  <AssignmentIndOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("jobtitle")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {jobPost.title}
                    </Typography>
                  </div>
                  <Divider className={classes.dividerVer} />
                </TableCell>
                <TableCell className={classes.reviewCol}>
                  <PlaceOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("location")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {location.city}
                      {location.country ? ", " + location.country : ""}
                    </Typography>
                  </div>
                  <Divider className={classes.dividerVer} />
                </TableCell>
                <TableCell className={classes.reviewCol}>
                  <DonutSmallOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("quarter")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      Q{getQuarterYear(startDate, finStartMonth)} FY
                      {startDate.getFullYear().toString().substr(-2)}
                    </Typography>
                  </div>
                  <Divider className={classes.dividerVer} />
                </TableCell>
                <TableCell className={classes.reviewCol}>
                  <CalendarTodayOutlined
                    color="secondary"
                    className={classes.reviewIcon}
                  />
                  <div>
                    <Typography variant="body1" className={classes.reviewLabel}>
                      {t("posted")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {moment(jobPost.createdAt).format("ll")}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </PerfectScrollbar>
        </div>
      </Container>
    )
  );
};

export default withStyles(styles)(withTranslation("common")(Info));
