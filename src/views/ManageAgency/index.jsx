import React, { Component } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  withStyles,
  Grid,
  CircularProgress,
  Modal,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import { PersonAddOutlined, PersonOutlined } from "@material-ui/icons";
import { withTranslation } from "react-i18next";
import styles from "../JobPost/components/styles";

import { loadAgencies } from "services/admin/action";
import { AgencyTable } from "./components";
import { AddAgency } from "../Modals";

class ManageAgency extends Component {
  signal = true;
  state = {
    isLoading: false,
    error: null,
    showModal: false,
    page: 0,
    rowsPerPage: 10,
    recruiters: [],
  };

  async loadAgencies(id, rowsPerPage = 10, page = 0) {
    try {
      this.setState({ isLoading: true });
      const { recruiters } = await this.props.loadAgencies(
        id,
        rowsPerPage,
        page
      );
      if (this.signal) {
        this.setState({
          isLoading: false,
          recruiters,
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error,
        });
      }
    }
  }

  handleChangePage = (rowsPerPage, page) => {
    this.signal = true;
    this.loadAgencies(this.props.orgId, rowsPerPage, page);
    this.setState({ ...this.state, page: page });
  };

  handleEdit = (item) => {
    this.setState({ ...this.state, editItem: item, showModal: true });
  };

  handleAdd = () => {
    this.setState({ ...this.state, editItem: null, showModal: true });
  };

  componentDidMount() {
    this.signal = true;
    this.loadAgencies(this.props.orgId);
  }

  handleClose() {
    this.setState({ ...this.state, showModal: false });
  }

  renderRecruiters() {
    const { classes, recruiters } = this.props;
    const { isLoading, error, page, rowsPerPage } = this.state;
    if (isLoading) {
      return (
        <div
          className={classes.progressWrapper}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: 30,
          }}
        >
          <CircularProgress style={{ height: 30, width: 30 }} />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (!recruiters) {
      return <Typography variant="h6"></Typography>;
    }
    return (
      <AgencyTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        recruiterList={recruiters}
        page={page}
        rowsPerPage={rowsPerPage}
        onEdit={this.handleEdit}
      />
    );
  }

  render() {
    const { classes, t } = this.props;

    return (
      <DashboardLayout title={t("dashboard")}>
        <Container className={classes.root}>
          <div className={classes.root}>
            <Grid
              container
              spacing={3}
              xs={12}
              style={{ margin: "0" }}
              className={classes.reviewItemWrap}
            >
              <Box display="flex" width="100%">
                <Box flexGrow={1}>
                  <Typography
                    variant="h3"
                    className={classes.reviewTitle}
                    style={{ padding: "20px 0px 0 22px" }}
                  >
                    <PersonOutlined
                      color="secondary"
                      className={classes.titleIcon}
                    />
                    {t("common:manageagencies")}
                  </Typography>
                </Box>
                <Box
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    margin: "20px 20px 10px 0",
                  }}
                >
                  <Button
                    autoCapitalize="false"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      this.handleAdd();
                    }}
                    //to="/rc/manage-agency/add-agency"
                    //component={Link}
                    color="secondary"
                  >
                    <PersonAddOutlined style={{ marginRight: 5 }} />
                    {t("common:addnewagency")}
                  </Button>
                </Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderRecruiters()}</div>
            </Grid>
          </div>
          <Modal
            aria-labelledby={t("common:addScreeningQ")}
            aria-describedby={t("common:addScreeningQ")}
            open={this.state.showModal}
            onClose={() => this.handleClose()}
          >
            <AddAgency
              item={this.state.editItem}
              // organizationId={values.orgId}
              onCancel={() => this.handleClose()}
              refreshList={() =>
                this.loadAgencies(
                  this.props.orgId,
                  this.state.rowsPerPage,
                  this.state.page
                )
              }
            />
          </Modal>
        </Container>
      </DashboardLayout>
    );
  }
}
const mapDispatchToProps = {
  loadAgencies,
};

const mapStateToProps = (state) => ({
  recruiters: (state.admin && state.admin.recruiters) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ManageAgency)))
);
