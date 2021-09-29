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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons";
import { deleteAgency, upgradeAgency } from "services/admin/action";
// Component styles
import styles from "../../../JobPost/components/styles";
import moment from "moment";

//Actions
import { resendAgencyActivation } from "services/user/action";

class AgencyTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    showSuccess: false,
    successMsg: "",
    isloading: [],
    premiumAgencyList: this.props.premiumAgencyList,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.premiumAgencyList) {
      return { premiumAgencyList: nextProps.premiumAgencyList };
    }
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

  handleDelete = (idx) => () => {
    this.setState({
      showDeletePopup: true,
      deleteId: idx,
    });
  };

  toInviteAgain = (recruiter) => {
    let isLoading = this.state.isLoading ? this.state.isLoading.slice() : [];
    isLoading[recruiter.orgAdmin.id] = true;
    this.setState({ isLoading: isLoading });
    this.props
      .resendAgencyActivation(recruiter.orgAdmin.id, true)
      .then((status) => {
        if (status) {
          let msg = "";
          msg =
            "Invitation has been successfully sent to the agency with the instructions to activate the account";
          isLoading[recruiter.orgAdmin.id] = false;
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

  downgradeAgency = (orgId, isPremium) => {
    const idx = orgId;
    const premiumRecruiters = [...this.state.premiumAgencyList.data];
    if (idx > 0) {
      this.props
        .upgradeAgency({ id: orgId, isPremium: isPremium })
        .then((status) => {
          const index = this.state.premiumAgencyList.data.findIndex(
            (c) => c.id === idx
          );
          if (index !== -1) {
            this.state.premiumAgencyList.data.splice(index, 1);
            // this.setState({
            //   ...this.state.premiumAgencyList,
            //   data: premiumRecruiters,
            // });
          }
          let msg = "";
          msg = "Agency has been downgraded";
          setTimeout(() => {
            this.setState({
              showSuccess: true,
              successMsg: msg,
              showMailBox: true,
              // ...this.state.premiumAgencyList,
              // data: premiumRecruiters,
            });
          }, 700);
        });

      // const premiumAgencyList = {
      //   ...this.state.premiumAgencyList,
      //   data: premiumRecruiters,
      // };
      // this.setState({
      //   premiumAgencyList: premiumAgencyList,
      // });
    }
  };

  toEditAgency = (agency) => {
    this.props.history.push({
      pathname: "/rc/manage-premium-agency/add-premium-agency",
      data: agency,
    });
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };

  render() {
    const { classes, t } = this.props;
    const { rowsPerPage, page, premiumAgencyList } = this.state;
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
              {premiumAgencyList.data && premiumAgencyList.data.length > 0 ? (
                premiumAgencyList.data.map((agency, idx) => (
                  <TableRow>
                    <TableCell
                      className={classes.firstCol}
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {agency.name}
                    </TableCell>
                    {/* {agency.email !== null ? (
                      <TableCell>{agency.email}</TableCell>
                    ) : (
                      <TableCell
                        style={{ color: "#908d8d", fontStyle: "italic" }}
                      >
                        Contact info not updated
                      </TableCell>
                    )} */}
                    <TableCell align="center">
                      {agency.createdAt
                        ? moment(agency.createdAt).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {agency.stripeTrialEndDate
                        ? moment(agency.stripeTrialEndDate).format("L")
                        : "--"}
                    </TableCell>
                    <TableCell align="center">
                      {agency && agency.status === 1 ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        small
                        onClick={() => {
                          this.toEditAgency(agency);
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
                    {t("noAgency")}
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
          count={premiumAgencyList.total}
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
          open={this.state.showDeletePopup}
        >
          <DialogTitle id="confirmation-dialog-title">
            {t("common:removeRec")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("common:deleteRecAlert")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              {t("common:cancel")}
            </Button>
            <Button onClick={this.handleRemoveRow} color="primary">
              {t("common:ok")}
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

AgencyTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  premiumRecruitersList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

AgencyTable.defaultProps = {
  premiumAgencyList: [],
  onSelect: () => {},
  onShowDetails: () => {},
};

const mapDispatchToProps = {
  deleteAgency,
  resendAgencyActivation,
  upgradeAgency,
};

const mapStateToProps = (state) => ({ profile: state.profile });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(
      withTranslation(["managePremiumAgency", "common"])(AgencyTable)
    )
  )
);
