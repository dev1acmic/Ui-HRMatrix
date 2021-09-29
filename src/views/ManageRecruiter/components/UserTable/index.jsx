import React, { Component } from "react";

// Externals
//import classNames from "classnames";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";

// Material helpers
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MessageBox from "util/messageBox";
import modalIcon from "assets/images/modal_ico_1.png";
import share from "common/share";
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
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
} from "@material-ui/core";
import { EditOutlined,
  CheckCircleOutline,
  CancelOutlined } from "@material-ui/icons";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";

//Actions

import { resendActivation } from "services/user/action";
import { adminApproval, loadUsers } from "services/admin/action";
class RecruiterTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    showSuccess: false,
    successMsg: "",
    isloading: [],
    showPopup: false,
    msg: "",
    user: null,
    isApproved: null,
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
    this.props.onChange(this.state.rowsPerPage, page);
  };

  handleConfirmation = () => {
    this.setState({ showPopup: false });
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
      state: { id: id },
    });
  };
  toEditUser = (user) => {
    this.props.history.push({
      pathname: "/rc/manage-recruiter/add-recruiter",
      data: user,
    });
  };

  toInviteAgain = (user) => {
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    let isReset = true;
    isLoading[user.id] = true;
    this.setState({ isLoading: isLoading });
    this.props
      .resendActivation(user.username, isReset, this.props.profile.orgId)
      .then((status) => {
        if (status) {
          let msg = "";
          msg =
            "Invitation has been successfully sent to the recruiter with the instructions to activate the account";
          isLoading[user.id] = false;
          setTimeout(() => {
            this.setState({
              showSuccess: true,
              successMsg: msg,
              showMailBox: true,
              isLoading: isLoading,
            });
          }, 700);
        }
      });
  };

  showAlert = (isApproved, user) => {
    if (isApproved) {
      this.setState({
        showPopup: true,
        msg: this.props.t("approveRecAlert"),
        user: user,
        isApproved: isApproved,
      });
    }
    if (!isApproved) {
      this.setState({
        showPopup: true,
        msg: this.props.t("denyRecAlert"),
        user: user,
        isApproved: isApproved,
      });
    }
  };

  handleAction = () => {
    if (this.state.isApproved === true) {
      this.approve();
    }
    if (this.state.isApproved === false) {
      this.deny();
    }
  };

  approve = () => {
    let user = this.state.user;
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    let isReset = true;
    isLoading[user.id] = true;
    this.setState({ isLoading: isLoading });
    this.props.adminApproval(user.id, true).then((status) => {
      if (status) {
        let msg = "";
        msg = this.props.t("recInvitationSent");
        isLoading[user.id] = false;
        setTimeout(() => {
          this.setState({
            showPopup: false,
            showSuccess: true,
            successMsg: msg,
            showMailBox: true,
            isLoading: isLoading,
          });
        }, 700);

        this.props.loadUsers(this.props.orgId);
      }
    });
  };

  deny = () => {
    let user = this.state.user;
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    let isReset = true;
    isLoading[user.id] = true;
    this.setState({ isLoading: isLoading });
    this.props.adminApproval(user.id, false).then((status) => {
      if (status) {
        let msg = "";
        msg = this.props.t("recDenyMsg");
        isLoading[user.id] = false;
        setTimeout(() => {
          this.setState({
            showPopup: false,
            showSuccess: true,
            successMsg: msg,
            showMailBox: true,
            isLoading: isLoading,
          });
        }, 700);
        this.props.loadUsers(this.props.orgId);
      }
    });
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };

  render() {
    const { classes, t, userList } = this.props;
    const { rowsPerPage, page } = this.state;

    //const rootClassName = classNames(classes.root, className);

    return (
      <div>
        <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
          <Table className={classes.tableReview}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.firstCol}>
                  {" "}
                  {t("common:name")}
                </TableCell>
                <TableCell>{t("common:loginid")}</TableCell>
                {/* <TableCell>Role</TableCell> */}
                <TableCell align="center">{t("common:createddate")}</TableCell>
                <TableCell align="center">{t("common:role")}</TableCell>
                <TableCell align="center">{t("common:status")}</TableCell>
                <TableCell align="center">{t("common:action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.data && userList.data.length > 0 ? (
                userList.data.map((user) => (
                  <TableRow>
                    <TableCell className={classes.firstCol}>
                      {user.fname} {user.lname}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    {/* <TableCell>
                      {user.roles && user.roles[0] && user.roles[0].name}
                    </TableCell> */}
                    <TableCell align="center">
                      {user.createdAt
                        ? moment(user.createdAt).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {user.roles && user.roles[0] && user.roles[0].name}
                    </TableCell>
                    <TableCell align="center">
                      {user.status === 1 && user.isVerified === true
                        ? t("common:active")
                        : user.status === 2 &&
                          user.isVerified === true &&
                          !user.isReferal
                        ? t("common:inactive")
                        : ""}

                      <Typography
                        style={{ fontSize: "11px", color: "#965041" }}
                      >
                        {share.checkUserStatus(user, true, t)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {this.state.isLoading && this.state.isLoading[user.id] ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        [
                          user.selfAuthorization === 1 ? (
                            <></>
                          ) :
                          user.selfAuthorization === 2 ? (
                            <>
                              {" "}
                              <IconButton
                              title={t("approve")}
                      className={classes.gridButton}
                      onClick={() => {
                        this.showAlert(true, user);
                      }}
                    >                    
                      <CheckCircleOutline style={{ color: "#75D49B" }} />
                    </IconButton>
                    <IconButton
                     title={t("deny")}
                      className={classes.gridButton}
                      style={{cursor:"pointer"}}
                      onClick={() => {
                        this.showAlert(false, user);
                      }}
                    >
                      <CancelOutlined style={{ color: "#FF725F" }} />
                    </IconButton>
                              <br />
                            </>
                          ) : null,
                        ]
                      )}

                      {user.selfAuthorization < 2 && (
                        <IconButton
                          small
                          disabled={
                            user.status === 2 && user.isVerified === false
                          }
                          onClick={() => {
                            this.toEditUser(user);
                          }}
                        >
                          <EditOutlined />
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
                    {t("common:noRecruitersAvailable")}
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
          count={userList.total}
          nextIconButtonProps={{
            "aria-label": t("common:nextPage"),
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <MessageBox
          open={this.state.showSuccess}
          variant="success"
          onClose={this.handleMsgClose}
          message={this.state.successMsg}
        />

        <Dialog
          open={this.state.showPopup}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", padding: "30px" }}>
                  <img
                    alt="HR Matrix"
                    src={modalIcon}
                    Component=""
                    style={{ width: "60px" }}
                  />
                </div>
                <Typography variant="h6">{this.state.msg}</Typography>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleAction()} color="primary">
              {t("ok")}
            </Button>
            <Button onClick={() => this.handleConfirmation()} color="primary">
              {t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RecruiterTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  userList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

RecruiterTable.defaultProps = {
  userList: [],
  onSelect: () => {},
  onShowDetails: () => {},
};

const mapDispatchToProps = {
  resendActivation,
  adminApproval,
  loadUsers,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(RecruiterTable)))
);
