import React, { Component } from "react";

// Externals
//import classNames from "classnames";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";

// Material helpers
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getFullAddress } from "util/helper";
import MessageBox from "util/messageBox";

// Material components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons";
import { deleteRecruiter } from "services/admin/action";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";

//Actions
import { resendActivation } from "services/user/action";

class RecruiterTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    showSuccess: false,
    successMsg: "",
    isloading: [],
    recruiterList: this.props.recruiterList
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
    this.props.onChange(this.state.rowsPerPage, page);
  };

  handleChangeRowsPerPage = event => {
    const rowsPerPage = event.target.value;
    this.setState({ rowsPerPage });
    this.props.onChange(rowsPerPage, this.state.page);
  };

  handleDelete = idx => () => {
    this.setState({
      showDeletePopup: true,
      deleteId: idx
    });
  };

  handleRemoveRow = () => {
    const idx = this.state.deleteId;
    const recruiters = [...this.state.recruiterList.data];
    const empOrgId = recruiters[idx].empOrgId;
    const recOrgId = recruiters[idx].recOrgId;
    const contactUserId = recruiters[idx].contactUserId;
    if (empOrgId > 0) {
      this.props.deleteRecruiter(empOrgId, recOrgId, contactUserId);
    }
    recruiters.splice(idx, 1);
    const recruiterList = { ...this.state.recruiterList, data: recruiters };
    this.setState({
      recruiterList: recruiterList,
      showDeletePopup: false
    });
  };

  handleCancel = () => {
    this.setState({
      showDeletePopup: false
    });
  };

  toEditRecruiter = recruiter => {
    this.props.history.push({
      pathname: "/rc/manage-recruiter/add-recruiter",
      data: recruiter
    });
  };

  toInviteAgain = recruiter => {
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    isLoading[recruiter.user.id] = true;
    this.setState({ isLoading: isLoading });
    this.props
      .resendActivation(recruiter.user.username, true, this.props.profile.orgId)
      .then(status => {
        if (status) {
          let msg = "";
        msg = "Invitation has been successfully sent to the user with the instructions to activate the account";
          isLoading[recruiter.user.id] = false;
          setTimeout(() => {
            this.setState({
              showSuccess: true,
              successMsg: msg,
              showMailBox: true,
              isLoading: isLoading
            });
          }, 700);

        }
      });
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };

  render() {
    const { classes } = this.props;
    const { rowsPerPage, page, recruiterList } = this.state;

    //const rootClassName = classNames(classes.root, className);

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
                  Company Name
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>Address</TableCell>
                {/* <TableCell style={{ whiteSpace: "nowrap" }}>Location</TableCell> */}
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Contact Name
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>Email</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Contact #
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Created Date
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  Status
                </TableCell>
                <TableCell
                  style={{ whiteSpace: "nowrap", width: 115 }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recruiterList.data && recruiterList.data.length > 0 ? (
                recruiterList.data.map((recruiter, idx) => (
                  <TableRow>
                    <TableCell
                      className={classes.firstCol}
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word"
                      }}
                    >
                      {recruiter.organization.name}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word"
                      }}
                    >
                      {recruiter.organization &&
                        recruiter.organization.addresses &&
                        recruiter.organization.addresses[0] &&
                        getFullAddress(recruiter.organization.addresses[0])}
                    </TableCell>
                    {/* <TableCell>CA</TableCell> */}
                    <TableCell
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word"
                      }}
                    >
                      {recruiter.user.fname + " "} {recruiter.user.lname}
                    </TableCell>
                    <TableCell>{recruiter.user.username}</TableCell>
                    <TableCell align="center">
                      {recruiter.organization.contactNo1}
                    </TableCell>
                    <TableCell align="center">
                      {recruiter.createdAt
                        ? moment(recruiter.createdAt).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {recruiter.status === 1 ? "Active" : "Inactive"}
                      {recruiter.status === 1 &&
                      recruiter.user.isVerified === false ? (
                        <Typography
                          style={{ fontSize: "11px", color: "#965041" }}
                        >
                          Email Verfication Pending
                        </Typography>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {this.state.isLoading &&
                      this.state.isLoading[recruiter.user.id] ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        [
                          recruiter.status === 1 &&
                          recruiter.user.isVerified === false ? (
                            <Button
                              style={{ fontSize: "10px" }}
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.toInviteAgain(recruiter);
                              }}
                            >
                              Invite Again
                            </Button>
                          ) : null
                        ]
                      )}
                      <IconButton
                        small
                        onClick={() => {
                          this.toEditRecruiter(recruiter);
                        }}
                      >
                        <EditOutlined />
                      </IconButton>

                      <IconButton small onClick={this.handleDelete(idx)}>
                        <DeleteOutlined />
                      </IconButton>
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
                    No recruiters available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </PerfectScrollbar>
        <TablePagination
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          component="div"
          count={recruiterList.total}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={this.state.showDeletePopup}
        >
          <DialogTitle id="confirmation-dialog-title">
            Remove recruiter
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the recruiter?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleRemoveRow} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <MessageBox
          open={this.state.showSuccess}
          variant="success"
          onClose={this.handleMsgClose}
          message={this.state.successMsg}
        />
      </div>
    );
  }
}

RecruiterTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  recruitersList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

RecruiterTable.defaultProps = {
  recruiterList: [],
  onSelect: () => {},
  onShowDetails: () => {}
};

const mapDispatchToProps = {
  deleteRecruiter,
  resendActivation
};

const mapStateToProps = state => ({ profile: state.profile });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(RecruiterTable))
);
