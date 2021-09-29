import React, { Component } from "react";

import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";

// Material helpers
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
// Material components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { clearJobPost } from "services/jobPost/action";
import { clearJobApplication } from "services/jobApplication/action";
import {
  Edit,
  Visibility,
  Done,
  AccessTime,
  ContactMail,
  Assignment,
  PersonAdd,
  Cancel,
} from "@material-ui/icons";
// Shared components
//import { Portlet, PortletContent } from "components";
import { getFullAddress } from "util/helper";
import { JobStatus } from "util/enum";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";
class JobTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
  };
  componentDidMount() {
    this.props.clearJobPost();
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
    this.props.onChange(this.state.rowsPerPage, page);
  };

  handleChangeRowsPerPage = (event) => {
    const rowsPerPage = event.target.value;
    this.setState({ rowsPerPage });
    this.props.onChange(rowsPerPage, this.state.page);
  };
  toJobPost = (id) => {
    this.props.history.push({
      pathname: "/rc/job-post",
      //pathname: "/rc/track-job/:" + id,
      state: { jobpostId: id },
    });
  };

  inviteRecruiter = (jobPostId) => {
    this.props.history.push({
      pathname: "/rc/invite-recruiter/" + jobPostId,
    });
  };

  jobApplication = (id) => {
    this.props.clearJobApplication();
    this.props.history.push({
      pathname: "/rc/job-application",
      state: { id: id },
    });
  };

  skillMatrix = (id) => {
    this.props.history.push({
      pathname: "/rc/matrix",
      state: { id: id },
    });
  };

  toReviewPage = (jobPostId) => {
    this.props.history.push({
      pathname: "/rc/job-review/" + jobPostId,
    });
  };

  render() {
    const { classes, t, jobList } = this.props;
    const { rowsPerPage, page } = this.state;
    // const name = this.props.profile
    //   ? this.props.profile.fname + " " + this.props.profile.lname
    //   : "";

    // const rootClassName = classNames(classes.root, className);

    return (
      <div>
        <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
          <Table className={classes.tableReview}>
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.firstCol}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {t("jobId")}
                </TableCell>
                {/* <TableCell style={{ whiteSpace: "nowrap" }}>Location</TableCell> */}
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {t("jobTitle")}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>Location</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Posted On
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Applicants
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  {t("shortlisted")}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  {t("interviewed")}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Status
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobList.data && jobList.data.length > 0 ? (
                jobList.data.map((job) => (
                  <TableRow>
                    <TableCell className={classes.firstCol}>
                      {job.uniqueId}
                    </TableCell>
                    <TableCell className={classes.firstCol}>
                      {job.title || "--"}
                    </TableCell>
                    <TableCell className={classes.firstCol}>
                      {job.addresses && job.addresses[0]
                        ? getFullAddress(job.addresses[0])
                        : "--"}
                    </TableCell>
                    <TableCell className={classes.firstCol}>
                      {job.createdAt ? moment(job.createdAt).format("L") : "--"}
                    </TableCell>

                    <TableCell
                      style={{ textAlign: "center" }}
                      className={classes.firstCol}
                    >
                      0
                    </TableCell>
                    <TableCell
                      style={{ textAlign: "center" }}
                      className={classes.firstCol}
                    >
                      0
                    </TableCell>
                    <TableCell
                      style={{ textAlign: "center" }}
                      className={classes.firstCol}
                    >
                      0
                    </TableCell>
                    <TableCell
                      style={{ textAlign: "center" }}
                      className={classes.firstCol}
                    >
                      <Tooltip
                        title={
                          job.status === 2
                            ? "Pending approval"
                            : JobStatus.getNameByValue(job.status)
                        }
                      >
                        {job.status === 3 ? (
                          <Done style={{ color: "#60CE8C" }} />
                        ) : job.status === 4 ? (
                          <Cancel style={{ color: "rgb(198, 35, 35)" }} />
                        ) : (
                          <AccessTime
                            style={{ color: "#2F80ED" }}
                            title="Color"
                          />
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className={classes.firstCol}>
                      <IconButton
                        small
                        onClick={() => {
                          this.toJobPost(job.id);
                        }}
                      >
                        {job.status > 2 ? <Visibility /> : <Edit />}
                      </IconButton>
                      {job.status === 3 && (
                        <IconButton
                          small
                          variant="contained"
                          onClick={() => {
                            this.toReviewPage(job.id);
                          }}
                        >
                          <Assignment />
                        </IconButton>
                      )}
                      {job.status === 3 && (
                        <IconButton
                          small
                          variant="contained"
                          onClick={() => {
                            this.inviteRecruiter(job.id);
                          }}
                        >
                          <ContactMail />
                        </IconButton>
                      )}
                      {job.status > 1 && (
                        <IconButton
                          small
                          onClick={() => {
                            this.jobApplication(job.id);
                          }}
                        >
                          <PersonAdd />
                        </IconButton>
                      )}

                      {job.status === 3 && (
                        <IconButton
                          small
                          onClick={() => {
                            this.skillMatrix(job.id);
                          }}
                        >
                          <Assignment />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className={classes.tableRow}>
                  <TableCell
                    colSpan={10}
                    style={{ textAlign: "center" }}
                    className={classes.tableCell}
                  >
                    {t("noDataAvailable")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </PerfectScrollbar>
        <TablePagination
          backIconButtonProps={{
            "aria-label": t("common:previousPage"),
          }}
          component="div"
          count={jobList.total}
          nextIconButtonProps={{
            "aria-label": t("common:nextPage"),
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
    );
  }
}

JobTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  jobList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

JobTable.defaultProps = {
  jobList: [],
  onSelect: () => {},
  onShowDetails: () => {},
};

const mapDispatchToProps = {
  clearJobPost: clearJobPost,
  clearJobApplication: clearJobApplication,
};

const mapStateToProps = (state) => ({ profile: state.profile });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(JobTable)))
);
