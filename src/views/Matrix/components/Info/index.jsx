import React, { useEffect } from "react";
import moment from "moment";
import {
  Container,
  Box,
  Table,
  TableCell,
  TableRow,
  withStyles,
  Divider,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import classNames from "classnames";
import {
  AccountCircleOutlined,
  AssignmentIndOutlined,
  FlagOutlined,
  PlaceOutlined,
  DonutSmallOutlined,
  CalendarTodayOutlined,
} from "@material-ui/icons";

import PerfectScrollbar from "react-perfect-scrollbar";

import styles from "../style";
//import { connect } from "react-redux";
import { getQuarterYear } from "util/helper";
import { useTranslation } from "react-i18next";

const Info = (props) => {
  const { t } = useTranslation("matrix");
  // const [state, setState] = React.useState({
  //   tab: "preinterview"
  // });

  // useEffect(() => {
  //   setState({ ...state, tab: props.tab });
  // }, [props.tab]);

  const htmlTab = () => {
    if (props.tab === "preinterview") {
      return (
        <Box className={classes.toggleButtonInnerWrap}>
          <Box
            className={classNames(
              classes.toggleButtonInner,
              classes.toggleButtonInnerSel
            )}
          >
            {t("info.preInterview")}
          </Box>
          <Box
            className={classes.toggleButtonInner}
            onClick={() => {
              props.handleTabClick("postinterview");
            }}
          >
            {t("info.postInterview")}
          </Box>
        </Box>
      );
    } else {
      return (
        <Box className={classes.toggleButtonInnerWrap}>
          <Box
            className={classes.toggleButtonInner}
            onClick={() => {
              props.handleTabClick("preinterview");
            }}
          >
            {t("info.preInterview")}
          </Box>
          <Box
            className={classNames(
              classes.toggleButtonInner,
              classes.toggleButtonInnerSel
            )}
          >
            {t("info.postInterview")}
          </Box>
        </Box>
      );
    }
  };

  const htmlInfo = (jobPost) => {
    const location = jobPost.addresses[0];
    const startDate = new Date(jobPost.startDate);
    return (
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
                      {t("info.createdBy")}
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
                      {t("info.jobId")}
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
                      {t("info.jobTitle")}
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
                      {t("info.location")}
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
                      {t("info.quarter")}
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
                      {t("info.posted")}
                    </Typography>
                    <Typography variant="h2" className={classes.reviewTitle}>
                      {moment(jobPost.createdAt).format("ll")}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </PerfectScrollbar>
          {htmlTab()}
        </div>
      </Container>
    );
  };

  const { classes, jobPost, finStartMonth } = props;
  return (
    //console.log(jobPost);
    !jobPost ? ( // Loader
      <Container className={classes.root}>
        <div className={classes.root}>
          <Table className={classes.reviewItemWrap}>
            <TableRow>
              <TableCell className={classes.reviewCol} align="center">
                <CircularProgress className={classes.progress} />
              </TableCell>
            </TableRow>
          </Table>
        </div>
      </Container>
    ) : (
      htmlInfo(jobPost)
    )
  );
};

export default withStyles(styles)(Info);
