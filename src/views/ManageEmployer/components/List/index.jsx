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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@material-ui/core";
import { EditOutlined } from "@material-ui/icons";
import {} from "services/employer/action";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";

import { OrganizationStatus } from "util/enum";

class EmployerTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    showSuccess: false,
    successMsg: "",
    isloading: [],
    employerList: this.props.employerList,
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.employerList) {
      return { employerList: nextProps.employerList };
    }
  }

  handleActivateOpen = (idx) => {
    this.setState({
      showActivatePopup: true,
      activateUserId: idx,
    });
  };

  handleDeactivateOpen = (idx) => {
    this.setState({
      showDeactivatePopup: true,
      deactivateUserId: idx,
    });
  };

  handleActivateCancel = () => {
    this.setState({
      showActivatePopup: false,
    });
  };

  handleDeactivateCancel = () => {
    this.setState({
      showDeactivatePopup: false,
    });
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

  handleActivate = (activateUserId) => {
    const idx = activateUserId;
    const employers = [...this.state.employerList.data];
    if (idx > 0) {
      const employer = {
        id: activateUserId,
        status: OrganizationStatus.Active,
      };
      this.props.activateDeactivateEmployer(employer).then((status) => {
        if (status) {
          this.handleActivateCancel();
          let alldatas = employers;
          const index = employers.findIndex((c) => c.id === idx);
          if (index !== -1) {
            let selData = employers[index];
            selData.status = OrganizationStatus.Active;
            alldatas[index] = selData;
            this.setState({
              employerList: alldatas,
            });
          }
        }
      });
    }
  };

  handleDeactivate = (deactivateUserId) => {
    const idx = deactivateUserId;
    const employers = [...this.state.employerList.data];
    if (idx > 0) {
      const employer = {
        id: deactivateUserId,
        status: OrganizationStatus.Inactive,
      };
      this.props.activateDeactivateEmployer(employer).then((status) => {
        if (status) {
          this.handleDeactivateCancel();
          let alldatas = employers;
          const index = employers.findIndex((c) => c.id === idx);
          if (index !== -1) {
            let selData = employers[index];
            selData.status = OrganizationStatus.Inactive;
            alldatas[index] = selData;
            this.setState({
              employerList: alldatas,
            });
          }
        }
      });
    }
  };

  toInviteAgain = (recruiter) => {
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    isLoading[recruiter.user.id] = true;
    this.setState({ isLoading: isLoading });
    this.props
      .resendActivation(recruiter.user.username, true, this.props.profile.orgId)
      .then((status) => {
        if (status) {
          let msg = "";
          msg =
            "Invitation has been successfully sent to the agency with the instructions to activate the account";
          isLoading[recruiter.user.id] = false;
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

  toEditEmployer = (employer) => {
    this.props.history.push({
      pathname: "/rc/manage-employer/add-employer",
      data: employer,
    });
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };

  render() {
    const { classes, t } = this.props;
    const { rowsPerPage, page, employerList } = this.state;
    //console.log(employerList);
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
                  {t("companyName")}
                </TableCell>
                {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                  {t("common:email")}
                </TableCell> */}
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  {t("createdOn")}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  {t("trialPeriod")}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                  {t("status")}
                </TableCell>
                <TableCell
                  style={{ whiteSpace: "nowrap", width: 115 }}
                  align="center"
                >
                  {t("action")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employerList.data && employerList.data.length > 0 ? (
                employerList.data.map((employer) => (
                  <TableRow>
                    <TableCell
                      className={classes.firstCol}
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {employer.name}
                    </TableCell>
                    {/* {employer.email !== null ? (
                      <TableCell>{employer.email}</TableCell>
                    ) : (
                      <TableCell
                        style={{ color: "#908d8d", fontStyle: "italic" }}
                      >
                        Contact info not updated
                      </TableCell>
                    )} */}
                    <TableCell align="center">
                      {employer.createdAt
                        ? moment(employer.createdAt).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {employer.stripeTrialEndDate
                        ? moment(employer.stripeTrialEndDate).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {employer.status === 1
                        ? t("common:active")
                        : t("common:inactive")}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        small
                        onClick={() => {
                          this.toEditEmployer(employer);
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
                    {t("noEmployer")}{" "}
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
          count={employerList.total}
          nextIconButtonProps={{
            "aria-label": t("common:nextPage"),
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
          open={this.state.showActivatePopup}
        >
          <DialogTitle id="confirmation-dialog-title">
            Activate Organization
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to activate this organization?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleActivateCancel} color="primary">
              No
            </Button>
            <Button
              onClick={() => this.handleActivate(this.state.activateUserId)}
              color="primary"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={this.state.showDeactivatePopup}
        >
          <DialogTitle id="confirmation-dialog-title">
            Deactivate Organization
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to deactivate this organization?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeactivateCancel} color="primary">
              No
            </Button>
            <Button
              onClick={() => this.handleDeactivate(this.state.deactivateUserId)}
              color="primary"
            >
              Yes
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

EmployerTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  employerList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

EmployerTable.defaultProps = {
  employerList: [],
  onSelect: () => {},
  onShowDetails: () => {},
};

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({ profile: state.profile });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("manageEmployer")(EmployerTable)))
);
