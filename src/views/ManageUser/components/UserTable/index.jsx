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
} from "@material-ui/core";
import { EditOutlined } from "@material-ui/icons";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";

//Actions
import { resendActivation } from "services/user/action";

class UserTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    showSuccess: false,
    successMsg: "",
    isloading: [],
  };

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
      state: { id: id },
    });
  };
  toEditUser = (user) => {
    this.props.history.push({
      pathname: "/rc/manage-user/add-user",
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
            "Invitation has been successfully sent to the user with the instructions to activate the account";
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
                  {t("common:name")}
                </TableCell>
                <TableCell>{t("common:loginid")}</TableCell>
                <TableCell>{t("common:role")}</TableCell>
                <TableCell align="center">{t("common:createddate")}</TableCell>
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
                    <TableCell>
                      {user.roles && user.roles[0] && user.roles[0].name}
                    </TableCell>
                    <TableCell align="center">
                      {user.createdAt
                        ? moment(user.createdAt).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {user.status === 1 && user.isVerified === true
                        ? t("common:active")
                        : user.status === 2 && user.isVerified === true
                        ? t("common:inactive")
                        : ""}
                      {user.isVerified === false ? (
                        <Typography
                          style={{ fontSize: "11px", color: "#965041" }}
                        >
                          {t("common:emailVerficationPending")}
                        </Typography>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {this.state.isLoading && this.state.isLoading[user.id] ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        [
                          user.status === 1 && user.isVerified === false ? (
                            <Button
                              style={{ fontSize: "10px" }}
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.toInviteAgain(user);
                              }}
                            >
                              {t("common:inviteAgain")}
                            </Button>
                          ) : null,
                        ]
                      )}
                      <IconButton
                        disabled={
                          user.status === 2 && user.isVerified === false
                        }
                        small
                        onClick={() => {
                          this.toEditUser(user);
                        }}
                      >
                        <EditOutlined />
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
                    {t("common:noUsersAvailable")}
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
      </div>
    );
  }
}

UserTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  userList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

UserTable.defaultProps = {
  userList: [],
  onSelect: () => {},
  onShowDetails: () => {},
};

const mapDispatchToProps = {
  resendActivation,
};

const mapStateToProps = (state) => ({ profile: state.profile });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(UserTable)))
);
